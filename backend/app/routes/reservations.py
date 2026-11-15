from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Reservation, RestaurantTable, Waiter, CustomerGroup, Allocation
from app.schemas import ReservationCreate, ReservationUpdate, ReservationOut
from app.services.auth_service import verify_write_permission

router = APIRouter(prefix="/reservations", tags=["Reservations"])

def enrich_reservation_out(r: Reservation, db: Session) -> ReservationOut:
    table_num = None
    if r.table_id:
        table = db.query(RestaurantTable).filter(RestaurantTable.id == r.table_id).first()
        if table:
            table_num = table.table_number

    return ReservationOut(
        id=r.id,
        customer_name=r.customer_name,
        group_size=r.group_size,
        reservation_date=r.reservation_date,
        reservation_time=r.reservation_time,
        special_requests=r.special_requests,
        status=r.status,
        table_id=r.table_id,
        table_number=table_num
    )

@router.get("", response_model=List[ReservationOut])
def get_reservations(date_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Reservation)
    if date_filter:
        query = query.filter(Reservation.reservation_date == date_filter)
    reservations = query.order_by(Reservation.reservation_date.asc(), Reservation.reservation_time.asc()).all()
    return [enrich_reservation_out(r, db) for r in reservations]

@router.post("", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db), _auth = Depends(verify_write_permission)):
    # Check for duplicate reservation at identical date, time, and customer name
    existing = db.query(Reservation).filter(
        Reservation.customer_name == payload.customer_name,
        Reservation.reservation_date == payload.reservation_date,
        Reservation.reservation_time == payload.reservation_time
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A reservation with this name, date, and time already exists.")

    reservation = Reservation(**payload.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return enrich_reservation_out(reservation, db)

@router.get("/{reservation_id}", response_model=ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return enrich_reservation_out(reservation, db)

@router.put("/{reservation_id}", response_model=ReservationOut)
def update_reservation(reservation_id: int, payload: ReservationUpdate, db: Session = Depends(get_db), _auth = Depends(verify_write_permission)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(reservation, field, val)

    db.commit()
    db.refresh(reservation)
    return enrich_reservation_out(reservation, db)

@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db), _auth = Depends(verify_write_permission)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    db.delete(reservation)
    db.commit()
    return {"message": f"Reservation for '{reservation.customer_name}' cancelled"}

@router.post("/{reservation_id}/seat")
def seat_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    _auth = Depends(verify_write_permission)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # 1. Duplicate Seating Prevention
    if reservation.status == "SEATED":
        raise HTTPException(status_code=409, detail="This reservation has already been seated.")

    # Check if a customer group for this reservation already has an assigned table
    existing_cust = db.query(CustomerGroup).filter(
        CustomerGroup.group_name == reservation.customer_name,
        CustomerGroup.status == "SEATED"
    ).first()
    if existing_cust:
        assigned_t = db.query(RestaurantTable).filter(RestaurantTable.current_group_id == existing_cust.id).first()
        if assigned_t:
            raise HTTPException(status_code=409, detail="This reservation has already been seated.")

    # 2. Verify pre-assigned table or select optimal available table
    target_table = None
    if reservation.table_id:
        t = db.query(RestaurantTable).filter(RestaurantTable.id == reservation.table_id).first()
        if t and t.is_active and t.current_group_id is None and t.capacity >= reservation.group_size:
            target_table = t

    if not target_table:
        candidates = db.query(RestaurantTable).filter(
            RestaurantTable.status.in_(["AVAILABLE", "RESERVED"]),
            RestaurantTable.is_active == True,
            RestaurantTable.current_group_id == None,
            RestaurantTable.capacity >= reservation.group_size
        ).order_by(RestaurantTable.capacity.asc()).all()

        if not candidates:
            raise HTTPException(
                status_code=400,
                detail=f"No available tables with capacity for {reservation.group_size} guests are currently available."
            )
        target_table = candidates[0]

    # 3. Select available waiter with lowest workload
    waiters = db.query(Waiter).filter(Waiter.availability == True).order_by(
        Waiter.workload_score.asc(),
        Waiter.assigned_tables.asc()
    ).all()
    if not waiters:
        raise HTTPException(status_code=400, detail="No active waiters currently on duty.")
    assigned_waiter = waiters[0]

    # 4. Atomic Database Transaction
    try:
        # Find or create customer group
        cust = db.query(CustomerGroup).filter(
            CustomerGroup.group_name == reservation.customer_name,
            CustomerGroup.status == "WAITING"
        ).first()

        if not cust:
            res_dt = None
            try:
                if reservation.reservation_date and reservation.reservation_time:
                    res_dt = datetime.strptime(f"{reservation.reservation_date} {reservation.reservation_time}", "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)
            except Exception:
                res_dt = None

            cust = CustomerGroup(
                group_name=reservation.customer_name,
                group_size=reservation.group_size,
                arrival_time=datetime.now(timezone.utc),
                reservation_time=res_dt,
                priority=3,
                special_requirements=reservation.special_requests or "VIP Advance Reservation",
                status="SEATED"
            )
            db.add(cust)
            db.flush()
        else:
            cust.status = "SEATED"
            cust.group_size = reservation.group_size

        # Update Table to OCCUPIED and assign customer & waiter
        target_table.status = "OCCUPIED"
        target_table.current_group_id = cust.id
        target_table.current_waiter_id = assigned_waiter.id

        # Update Waiter workload
        assigned_waiter.assigned_tables += 1
        assigned_waiter.workload_score = round(assigned_waiter.assigned_tables / assigned_waiter.max_tables, 2)

        # Update Reservation status
        reservation.status = "SEATED"
        reservation.table_id = target_table.id

        # Create exactly one active allocation record
        db_alloc = Allocation(
            customer_group_id=cust.id,
            table_id=target_table.id,
            waiter_id=assigned_waiter.id,
            allocation_time=datetime.now(timezone.utc),
            algorithm_used="RESERVATION_MATCH",
            allocation_reason=f"Reservation confirmed: Table {target_table.table_number} ({target_table.capacity} seats, {target_table.location}) assigned to {reservation.customer_name} ({reservation.group_size} guests). Server {assigned_waiter.name} on duty."
        )
        db.add(db_alloc)
        db.commit()

        return {
            "success": True,
            "message": f"Reservation for {reservation.customer_name} seated at Table {target_table.table_number}",
            "reservation_id": reservation.id,
            "customer_id": cust.id,
            "table_id": target_table.id,
            "table_number": target_table.table_number,
            "table_capacity": target_table.capacity,
            "waiter_id": assigned_waiter.id,
            "waiter_name": assigned_waiter.name,
            "allocation_id": db_alloc.id
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database transaction failed during reservation seating: {str(exc)}"
        )
