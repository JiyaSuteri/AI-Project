from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
import jwt
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.config import settings
from app.database.session import get_db
from app.models import User

security = HTTPBearer(auto_error=False)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT session token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a signed JWT session token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.PyJWTError:
        return None

def verify_google_token(credential: str) -> Dict[str, Any]:
    """
    Verify Google OAuth 2.0 ID token using Google's public keys.
    Returns decoded token dictionary containing sub, email, name, picture.
    """
    if not credential or not credential.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token credential is required."
        )

    # If GOOGLE_CLIENT_ID is configured in .env, verify against it
    client_id = settings.GOOGLE_CLIENT_ID.strip() if settings.GOOGLE_CLIENT_ID else None

    try:
        req = google_requests.Request()
        id_info = id_token.verify_oauth2_token(
            credential,
            req,
            audience=client_id if client_id else None
        )

        # Validate issuer
        if id_info.get("iss") not in ["accounts.google.com", "https://accounts.google.com"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token issuer."
            )

        return id_info
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token verification failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication error: {str(e)}"
        )

def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency: Requires a valid authenticated user via Bearer token."""
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in with Google or continue as Guest.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or deactivated.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user

def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Dependency: Returns authenticated User if Bearer token present & valid; otherwise None."""
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        return None

    try:
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        return user
    except Exception:
        return None

def verify_write_permission(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    x_guest_mode: Optional[str] = Header(None, alias="X-Guest-Mode"),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency for mutating operations (CREATE, UPDATE, DELETE, RESET).
    - If in Guest Mode (X-Guest-Mode header), blocks real DB modifications to guarantee isolation.
    - If valid Bearer token provided, returns the verified User.
    - If in DEBUG mode without auth header, permits developer/test execution.
    - Otherwise, requires authentication.
    """
    if x_guest_mode and x_guest_mode.lower() in ["true", "1", "yes"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Guest Mode Sandbox: Modifying persistent restaurant records is restricted to authenticated managers. Please sign in with Google."
        )

    if auth and auth.credentials:
        payload = decode_access_token(auth.credentials)
        if payload and "sub" in payload:
            try:
                user_id = int(payload.get("sub"))
                user = db.query(User).filter(User.id == user_id).first()
                if user and user.is_active:
                    return user
            except (ValueError, TypeError):
                pass
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if settings.DEBUG:
        return None

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please sign in with Google to modify restaurant records.",
        headers={"WWW-Authenticate": "Bearer"}
    )
