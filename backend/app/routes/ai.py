from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import RestaurantTable, Waiter, CustomerGroup
from app.schemas import AIChatRequest, AIChatResponse
from app.ai.assistant_service import answer_ai_query
from app.services.auth_service import get_optional_user

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    payload: AIChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    user = Depends(get_optional_user)
):
    # Only enter Guest Sandbox if explicitly requested via X-Guest-Mode header.
    # Authenticated managers or direct local test calls query the live SQLite database.
    is_guest = request.headers.get("x-guest-mode", "").lower() in ["true", "1", "yes"]
    return answer_ai_query(payload.message, db, is_guest=is_guest)

@router.post("/recommend")
def ai_recommend(
    group_size: int = 4,
    special_request: str = "",
    request: Request = None,
    db: Session = Depends(get_db),
    user = Depends(get_optional_user)
):
    is_guest = bool(request and request.headers.get("x-guest-mode", "").lower() in ["true", "1", "yes"])
    prompt = f"Recommend the best table for a group of {group_size} guests with request '{special_request}' based on capacity and current availability."
    return answer_ai_query(prompt, db, is_guest=is_guest)

@router.post("/explain-allocation")
def ai_explain(
    table_number: str,
    group_name: str,
    request: Request = None,
    db: Session = Depends(get_db),
    user = Depends(get_optional_user)
):
    is_guest = bool(request and request.headers.get("x-guest-mode", "").lower() in ["true", "1", "yes"])
    prompt = f"Why was {group_name} allocated {table_number}?"
    return answer_ai_query(prompt, db, is_guest=is_guest)
