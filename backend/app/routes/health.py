from fastapi import APIRouter
from app.config import settings
from app.ai.groq_client import groq_client
from app.ai.claude_client import claude_client

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    ai_status = "Grounded Local RAG Engine"
    if groq_client.is_configured():
        ai_status = f"Groq LPU Engine ({settings.GROQ_MODEL})"
    elif claude_client.is_configured():
        ai_status = f"Anthropic Claude ({settings.ANTHROPIC_MODEL})"

    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_provider": ai_status,
        "groq_active": groq_client.is_configured(),
        "claude_active": claude_client.is_configured()
    }
