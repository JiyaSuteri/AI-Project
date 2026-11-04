from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import CustomerGroup, RestaurantTable
from app.schemas import CustomerCreate, CustomerUpdate, CustomerOut

router = APIRouter(prefix="/customers", tags=["Customers"])

def enrich_customer_out(c: CustomerGroup) -> CustomerOut:
    now = datetime.now(timezone.utc)
    arr = c.arrival_time
    if arr:
        if arr.tzinfo is None:
            arr = arr.replace(tzinfo=timezone.utc)
        wait_mins = round((now - arr).total_seconds() / 60.0, 1)
    else:
        wait_mins = 0.0

    table_num = c.assigned_table.table_number if c.assigned_table else None

    return CustomerOut(
        id=c.id,
        group_name=c.group_name,
        group_size=c.group_size,
        arrival_time=c.arrival_time,
        reservation_time=c.reservation_time,
        priority=c.priority,
        special_requirements=c.special_requirements,
        status=c.status,
        assigned_table_number=table_num,
        waiting_minutes=wait_mins
    )

@router.get("", response_model=List[CustomerOut])
def get_customers(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CustomerGroup)
    if status_filter:
        query = query.filter(CustomerGroup.status == status_filter.upper())
    customers = query.order_by(CustomerGroup.priority.desc(), CustomerGroup.arrival_time.asc()).all()
    return [enrich_customer_out(c) for c in customers]

@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = CustomerGroup(
        group_name=payload.group_name,
        group_size=payload.group_size,
        arrival_time=datetime.now(timezone.utc),
        reservation_time=payload.reservation_time,
        priority=payload.priority,
        special_requirements=payload.special_requirements,
        status=payload.status or "WAITING"
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return enrich_customer_out(customer)

@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(CustomerGroup).filter(CustomerGroup.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer group not found")
    return enrich_customer_out(customer)

@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(CustomerGroup).filter(CustomerGroup.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer group not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(customer, field, val)

    db.commit()
    db.refresh(customer)
    return enrich_customer_out(customer)

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(CustomerGroup).filter(CustomerGroup.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer group not found")

    # If seated at a table, clear table reference
    table = db.query(RestaurantTable).filter(RestaurantTable.current_group_id == customer.id).first()
    if table:
        table.current_group_id = None
        table.status = "CLEANING"

    db.delete(customer)
    db.commit()
    return {"message": f"Customer group '{customer.group_name}' removed"}
