from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database.session import get_db
from app.models import User
from app.schemas import GoogleAuthRequest, TokenResponse, UserOut, AuthStatusResponse
from app.services.auth_service import (
    verify_google_token,
    create_access_token,
    get_current_user,
    get_optional_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/status", response_model=AuthStatusResponse)
def get_auth_status(optional_user: User = Depends(get_optional_user)):
    """Returns the current authentication and Google configuration state."""
    return AuthStatusResponse(
        is_authenticated=optional_user is not None,
        is_guest=optional_user is None,
        user=UserOut.model_validate(optional_user) if optional_user else None,
        google_configured=bool(settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_ID.strip())
    )

@router.post("/google", response_model=TokenResponse)
def google_sign_in(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate with Google OAuth 2.0 / OpenID Connect ID token.
    Verifies token signature with Google, syncs user profile in SQLite,
    and returns a signed session JWT.
    """
    id_info = verify_google_token(payload.credential)

    google_id = id_info.get("sub")
    email = id_info.get("email")
    name = id_info.get("name") or email.split("@")[0]
    picture = id_info.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token did not provide a verified email address."
        )

    # Check if user exists by google_id or email
    user = db.query(User).filter((User.google_id == google_id) | (User.email == email)).first()

    now = datetime.now(timezone.utc)
    if not user:
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            picture=picture,
            role="MANAGER",
            is_active=True,
            created_at=now,
            last_login=now
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user profile information & last login
        user.google_id = google_id
        user.name = name
        user.picture = picture or user.picture
        user.last_login = now
        db.commit()
        db.refresh(user)

    # Issue session JWT
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = create_access_token(token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(get_current_user)):
    """Returns the verified profile of the currently logged-in user."""
    return UserOut.model_validate(user)

@router.post("/logout")
def logout(user: User = Depends(get_current_user)):
    """Logout current user session."""
    return {"status": "success", "message": f"User {user.email} successfully logged out."}

@router.post("/dev-demo-login", response_model=TokenResponse)
def dev_demo_login(db: Session = Depends(get_db)):
    """
    Local developer login endpoint (Available in DEBUG mode for localhost testing).
    Enables instant verification of authenticated routes before external Google credentials are wired up.
    """
    if not settings.DEBUG:
        raise HTTPException(status_code=403, detail="Developer login is disabled in production.")

    email = "demo.manager@saffronandsage.com"
    user = db.query(User).filter(User.email == email).first()
    now = datetime.now(timezone.utc)

    if not user:
        user = User(
            google_id="demo-google-id-001",
            email=email,
            name="Executive Chef & Manager",
            picture="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
            role="MANAGER",
            is_active=True,
            created_at=now,
            last_login=now
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.last_login = now
        db.commit()
        db.refresh(user)

    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = create_access_token(token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )
