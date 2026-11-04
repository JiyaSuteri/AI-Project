from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.utils.seed_data import seed_database

router = APIRouter(prefix="/system", tags=["System"])

@router.post("/reset-db")
def reset_database(force: bool = True, db: Session = Depends(get_db)):
    result = seed_database(db, force_reset=force)
    return result
