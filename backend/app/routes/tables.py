from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import RestaurantTable, Waiter, CustomerGroup
from app.schemas import TableCreate, TableUpdate, TableOut, TableStatusUpdate

router = APIRouter(prefix="/tables", tags=["Tables"])

def enrich_table_out(t: RestaurantTable) -> TableOut:
    return TableOut(
        id=t.id,
        table_number=t.table_number,
        capacity=t.capacity,
        location=t.location,
        status=t.status,
        is_active=t.is_active,
        current_waiter_id=t.current_waiter_id,
        current_group_id=t.current_group_id,
        waiter_name=t.assigned_waiter.name if t.assigned_waiter else None,
        group_name=t.seated_group.group_name if t.seated_group else None,
        group_size=t.seated_group.group_size if t.seated_group else None
    )

@router.get("", response_model=List[TableOut])
def get_tables(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(RestaurantTable)
    if status_filter:
        query = query.filter(RestaurantTable.status == status_filter.upper())
    tables = query.order_by(RestaurantTable.id).all()
    return [enrich_table_out(t) for t in tables]

@router.post("", response_model=TableOut, status_code=status.HTTP_201_CREATED)
def create_table(payload: TableCreate, db: Session = Depends(get_db)):
    existing = db.query(RestaurantTable).filter(RestaurantTable.table_number == payload.table_number).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Table number '{payload.table_number}' already exists.")
    
    table = RestaurantTable(**payload.model_dump())
    db.add(table)
    db.commit()
    db.refresh(table)
    return enrich_table_out(table)

@router.get("/{table_id}", response_model=TableOut)
def get_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return enrich_table_out(table)

@router.put("/{table_id}", response_model=TableOut)
def update_table(table_id: int, payload: TableUpdate, db: Session = Depends(get_db)):
    table = db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(table, field, val)

    db.commit()
    db.refresh(table)
    return enrich_table_out(table)

@router.put("/{table_id}/status", response_model=TableOut)
def update_table_status(table_id: int, payload: TableStatusUpdate, db: Session = Depends(get_db)):
    table = db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    valid_statuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING", "UNAVAILABLE"]
    new_status = payload.status.upper()
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {valid_statuses}")

    # If transitioning to CLEANING or AVAILABLE, disassociate seated group
    if new_status in ["CLEANING", "AVAILABLE"] and table.current_group_id:
        group = db.query(CustomerGroup).filter(CustomerGroup.id == table.current_group_id).first()
        if group:
            group.status = "COMPLETED"
        table.current_group_id = None

    if new_status == "AVAILABLE" and table.current_waiter_id:
        waiter = db.query(Waiter).filter(Waiter.id == table.current_waiter_id).first()
        if waiter and waiter.assigned_tables > 0:
            waiter.assigned_tables -= 1
            waiter.completed_orders += 1
            waiter.workload_score = max(0.0, waiter.assigned_tables / waiter.max_tables)
        table.current_waiter_id = None

    table.status = new_status
    db.commit()
    db.refresh(table)
    return enrich_table_out(table)

@router.post("/{table_id}/reset", response_model=TableOut)
def reset_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    if table.current_group_id:
        group = db.query(CustomerGroup).filter(CustomerGroup.id == table.current_group_id).first()
        if group:
            group.status = "COMPLETED"
        table.current_group_id = None

    if table.current_waiter_id:
        waiter = db.query(Waiter).filter(Waiter.id == table.current_waiter_id).first()
        if waiter and waiter.assigned_tables > 0:
            waiter.assigned_tables -= 1
            waiter.completed_orders += 1
            waiter.workload_score = max(0.0, waiter.assigned_tables / waiter.max_tables)
        table.current_waiter_id = None

    table.status = "AVAILABLE"
    db.commit()
    db.refresh(table)
    return enrich_table_out(table)

@router.delete("/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(RestaurantTable).filter(RestaurantTable.id == table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    if table.status == "OCCUPIED":
        raise HTTPException(status_code=400, detail="Cannot delete an occupied table. Free or reset table first.")

    db.delete(table)
    db.commit()
    return {"message": f"Table {table.table_number} deleted successfully"}
