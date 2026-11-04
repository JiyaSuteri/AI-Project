from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import RestaurantTable, Waiter, CustomerGroup
from app.schemas import AIChatRequest, AIChatResponse
from app.ai.assistant_service import answer_ai_query

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest, db: Session = Depends(get_db)):
    return answer_ai_query(payload.message, db)

@router.post("/recommend")
def ai_recommend(group_size: int = 4, special_request: str = "", db: Session = Depends(get_db)):
    prompt = f"Recommend the best table for a group of {group_size} guests with request '{special_request}' based on capacity and current availability."
    return answer_ai_query(prompt, db)

@router.post("/explain-allocation")
def ai_explain(table_number: str, group_name: str, db: Session = Depends(get_db)):
    prompt = f"Why was {group_name} allocated {table_number}?"
    return answer_ai_query(prompt, db)
