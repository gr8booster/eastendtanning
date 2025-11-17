"""
Simple authentication for admin access
Uses password-based authentication with JWT tokens
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
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
    """Admin login endpoint - grants Owner role with full access"""
    if request.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Create access token with Owner role (full permissions)
    access_token, expires_at = create_access_token({"sub": "admin", "role": "owner", "email": "admin@eastend.com", "name": "Admin Owner"})
    
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


# Role-Based Access Control (RBAC)
# Level 1: Owner/Admin - Full access to everything
# Level 2: Manager - Can edit deals, mary training, upload media
# Level 3: Staff - Read-only access, can submit suggestions

ROLE_PERMISSIONS = {
    'owner': {
        'deals': {'read': True, 'write': True, 'delete': True},
        'mary_training': {'read': True, 'write': True, 'delete': True},
        'users': {'read': True, 'write': True, 'delete': True},
        'system': {'read': True, 'write': True, 'delete': True},
        'all': True  # Full access to everything
    },
    'manager': {
        'deals': {'read': True, 'write': True, 'delete': False},
        'mary_training': {'read': True, 'write': True, 'delete': False},
        'users': {'read': True, 'write': False, 'delete': False},
        'system': {'read': True, 'write': False, 'delete': False}
    },
    'staff': {
        'deals': {'read': True, 'write': False, 'delete': False},
        'mary_training': {'read': True, 'write': False, 'delete': False},
        'users': {'read': False, 'write': False, 'delete': False},
        'system': {'read': True, 'write': False, 'delete': False}
    }
}

def check_permission(user: dict, resource: str, action: str) -> bool:
    """
    Check if user has permission for resource and action
    
    Args:
        user: User dict with 'role' key
        resource: Resource name (e.g., 'deals', 'mary_training')
        action: Action type ('read', 'write', 'delete')
    
    Returns:
        bool: True if user has permission, False otherwise
    """
    role = user.get('role', 'staff')
    
    # Owner has full access
    if role == 'owner':
        return True
    
    # Check specific permission
    if role in ROLE_PERMISSIONS:
        resource_perms = ROLE_PERMISSIONS[role].get(resource, {})
        return resource_perms.get(action, False)
    
    return False

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Get current authenticated user from token
    Returns user dict with role information
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_role_display_name(role: str) -> str:
    """Get friendly display name for role"""
    role_names = {
        'owner': 'Owner/Admin (Level 1)',
        'manager': 'Manager Admin (Level 2)',
        'staff': 'Staff User (Level 3)'
    }
    return role_names.get(role, 'Unknown Role')
