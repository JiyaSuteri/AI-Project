from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Waiter, RestaurantTable
from app.schemas import WaiterCreate, WaiterUpdate, WaiterOut

router = APIRouter(prefix="/waiters", tags=["Waiters"])

@router.get("", response_model=List[WaiterOut])
def get_waiters(available_only: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(Waiter)
    if available_only is not None:
        query = query.filter(Waiter.availability == available_only)
    return query.order_by(Waiter.id).all()

@router.post("", response_model=WaiterOut, status_code=status.HTTP_201_CREATED)
def create_waiter(payload: WaiterCreate, db: Session = Depends(get_db)):
    waiter = Waiter(
        name=payload.name,
        availability=payload.availability,
        max_tables=payload.max_tables,
        assigned_tables=0,
        completed_orders=0,
        workload_score=0.0
    )
    db.add(waiter)
    db.commit()
    db.refresh(waiter)
    return waiter

@router.get("/{waiter_id}", response_model=WaiterOut)
def get_waiter(waiter_id: int, db: Session = Depends(get_db)):
    waiter = db.query(Waiter).filter(Waiter.id == waiter_id).first()
    if not waiter:
        raise HTTPException(status_code=404, detail="Waiter not found")
    return waiter

@router.put("/{waiter_id}", response_model=WaiterOut)
def update_waiter(waiter_id: int, payload: WaiterUpdate, db: Session = Depends(get_db)):
    waiter = db.query(Waiter).filter(Waiter.id == waiter_id).first()
    if not waiter:
        raise HTTPException(status_code=404, detail="Waiter not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(waiter, field, val)

    # Recalculate workload score
    waiter.workload_score = round(waiter.assigned_tables / max(1, waiter.max_tables), 2)
    db.commit()
    db.refresh(waiter)
    return waiter

@router.delete("/{waiter_id}")
def delete_waiter(waiter_id: int, db: Session = Depends(get_db)):
    waiter = db.query(Waiter).filter(Waiter.id == waiter_id).first()
    if not waiter:
        raise HTTPException(status_code=404, detail="Waiter not found")

    if waiter.assigned_tables > 0:
        raise HTTPException(status_code=400, detail="Cannot remove a waiter who is currently assigned to active tables.")

    db.delete(waiter)
    db.commit()
    return {"message": f"Waiter '{waiter.name}' removed successfully"}
