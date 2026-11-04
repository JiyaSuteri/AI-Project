from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import ServicePolicy
from app.schemas import PolicyCreate, PolicyUpdate, PolicyOut

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.get("", response_model=List[PolicyOut])
def get_policies(category: Optional[str] = None, active_only: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(ServicePolicy)
    if category:
        query = query.filter(ServicePolicy.category == category.upper())
    if active_only is not None:
        query = query.filter(ServicePolicy.is_active == active_only)
    return query.order_by(ServicePolicy.id).all()

@router.post("", response_model=PolicyOut, status_code=status.HTTP_201_CREATED)
def create_policy(payload: PolicyCreate, db: Session = Depends(get_db)):
    policy = ServicePolicy(**payload.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy

@router.get("/{policy_id}", response_model=PolicyOut)
def get_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ServicePolicy).filter(ServicePolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Service policy not found")
    return policy

@router.put("/{policy_id}", response_model=PolicyOut)
def update_policy(policy_id: int, payload: PolicyUpdate, db: Session = Depends(get_db)):
    policy = db.query(ServicePolicy).filter(ServicePolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Service policy not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(policy, field, val)

    db.commit()
    db.refresh(policy)
    return policy

@router.delete("/{policy_id}")
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(ServicePolicy).filter(ServicePolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Service policy not found")

    db.delete(policy)
    db.commit()
    return {"message": f"Policy '{policy.policy_name}' deleted"}
