"""
Simple authentication for admin access
Uses password-based authentication with JWT tokens
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import jwt
import os
from typing import Optional

router = APIRouter(prefix="/api/auth")

# Get admin password from environment
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'eastend2025')
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours


class LoginRequest(BaseModel):
    password: str


class TokenResponse(BaseModel):
    token: str
    expires_at: str


def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, expire


def verify_token(authorization: Optional[str] = Header(None)):
    """Verify JWT token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    if request.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Create access token
    access_token, expires_at = create_access_token({"sub": "admin", "role": "admin"})
    
    return TokenResponse(
        token=access_token,
        expires_at=expires_at.isoformat()
    )


@router.get("/verify")
async def verify(payload: dict = Depends(verify_token)):
    """Verify token is valid"""
    return {"status": "authenticated", "user": payload.get("sub")}


@router.post("/logout")
async def logout():
    """Logout (client should remove token)"""
    return {"status": "logged_out"}
