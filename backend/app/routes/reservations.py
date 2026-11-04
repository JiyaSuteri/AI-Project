from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Reservation, RestaurantTable
from app.schemas import ReservationCreate, ReservationUpdate, ReservationOut

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
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
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
def update_reservation(reservation_id: int, payload: ReservationUpdate, db: Session = Depends(get_db)):
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
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    db.delete(reservation)
    db.commit()
    return {"message": f"Reservation for '{reservation.customer_name}' cancelled"}
