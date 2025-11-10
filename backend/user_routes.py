"""
User Management Routes (Owner Only)
Create, update, delete staff users with roles
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import bcrypt
from auth import verify_token, create_access_token
from roles import Role, Permission, has_permission

router = APIRouter(prefix="/api/users", tags=["users"])

# MongoDB
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "test_database")]

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    role: Role
    password: str
    active: bool = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[Role] = None
    password: Optional[str] = None
    active: Optional[bool] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_owner(current_user: dict) -> bool:
    """Check if current user is owner"""
    user_role = current_user.get("role", "")
    return user_role == Role.OWNER

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate, current_user: dict = Depends(verify_token)):
    """Create new staff user (Owner only)"""
    if not verify_owner(current_user):
        raise HTTPException(status_code=403, detail="Only owners can create users")
    
    # Check if email already exists
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user document
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "name": user.name,
        "role": user.role.value,
        "password_hash": hash_password(user.password),
        "active": user.active,
        "created_at": datetime.now(timezone.utc),
        "created_by": current_user.get("email", "system")
    }
    
    await db.users.insert_one(user_doc)
    
    # Return response without password
    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        name=user_doc["name"],
        role=user_doc["role"],
        active=user_doc["active"],
        created_at=user_doc["created_at"]
    )

@router.get("/", response_model=List[UserResponse])
async def list_users(current_user: dict = Depends(verify_token)):
    """List all staff users (Owner only)"""
    if not verify_owner(current_user):
        raise HTTPException(status_code=403, detail="Only owners can view users")
    
    users = []
    async for user_doc in db.users.find():
        users.append(UserResponse(
            id=user_doc["id"],
            email=user_doc["email"],
            name=user_doc["name"],
            role=user_doc["role"],
            active=user_doc.get("active", True),
            created_at=user_doc["created_at"],
            last_login=user_doc.get("last_login")
        ))
    
    return users

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: dict = Depends(verify_token)):
    """Get current logged-in user info"""
    user_email = current_user.get("email") or current_user.get("sub")
    
    user_doc = await db.users.find_one({"email": user_email})
    
    if not user_doc:
        # Return basic info from JWT if user not in DB (backward compatibility)
        return UserResponse(
            id="admin",
            email=user_email or "admin",
            name="Admin",
            role=current_user.get("role", "admin"),
            active=True,
            created_at=datetime.now(timezone.utc)
        )
    
    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        name=user_doc["name"],
        role=user_doc["role"],
        active=user_doc.get("active", True),
        created_at=user_doc["created_at"],
        last_login=user_doc.get("last_login")
    )

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, update: UserUpdate, current_user: dict = Depends(verify_token)):
    """Update staff user (Owner only)"""
    if not verify_owner(current_user):
        raise HTTPException(status_code=403, detail="Only owners can update users")
    
    user_doc = await db.users.find_one({"id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Build update dict
    update_dict = {}
    if update.name is not None:
        update_dict["name"] = update.name
    if update.role is not None:
        update_dict["role"] = update.role.value
    if update.password is not None:
        update_dict["password_hash"] = hash_password(update.password)
    if update.active is not None:
        update_dict["active"] = update.active
    
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc)
        await db.users.update_one({"id": user_id}, {"$set": update_dict})
        
        # Fetch updated user
        user_doc = await db.users.find_one({"id": user_id})
    
    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        name=user_doc["name"],
        role=user_doc["role"],
        active=user_doc.get("active", True),
        created_at=user_doc["created_at"],
        last_login=user_doc.get("last_login")
    )

@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(verify_token)):
    """Delete staff user (Owner only)"""
    if not verify_owner(current_user):
        raise HTTPException(status_code=403, detail="Only owners can delete users")
    
    # Prevent deleting yourself
    current_user_email = current_user.get("email") or current_user.get("sub")
    user_doc = await db.users.find_one({"id": user_id})
    
    if user_doc and user_doc.get("email") == current_user_email:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"status": "deleted", "user_id": user_id}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def user_login(request: LoginRequest):
    """User login with email/password"""
    email = request.email
    password = request.password
    user_doc = await db.users.find_one({"email": email})
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user_doc.get("active", True):
        raise HTTPException(status_code=401, detail="Account is inactive")
    
    # Verify password
    password_hash = user_doc.get("password_hash", "")
    if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.users.update_one(
        {"id": user_doc["id"]},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )
    
    # Create access token
    token, expires_at = create_access_token({
        "sub": user_doc["email"],
        "email": user_doc["email"],
        "role": user_doc["role"]
    })
    
    return {
        "token": token,
        "expires_at": expires_at.isoformat(),
        "user": {
            "id": user_doc["id"],
            "email": user_doc["email"],
            "name": user_doc["name"],
            "role": user_doc["role"]
        }
    }
