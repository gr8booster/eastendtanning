"""
Role-Based Access Control System
Defines roles (Owner, Admin, Marketing, Sales) and permissions
"""
from enum import Enum
from functools import wraps
from fastapi import HTTPException, status, Depends
from typing import List

class Role(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MARKETING = "marketing_associate"
    SALES = "sales_associate"

class Permission(str, Enum):
    # Lead permissions
    LEADS_READ = "leads:read"
    LEADS_WRITE = "leads:write"
    
    # Booking permissions
    BOOKINGS_READ = "bookings:read"
    BOOKINGS_WRITE = "bookings:write"
    
    # Campaign permissions
    CAMPAIGNS_READ = "campaigns:read"
    CAMPAIGNS_WRITE = "campaigns:write"
    
    # Blog permissions
    BLOG_READ = "blog:read"
    BLOG_WRITE = "blog:write"
    
    # Discount permissions
    DISCOUNTS_GENERATE_5 = "discounts:generate_5"
    DISCOUNTS_GENERATE_10 = "discounts:generate_10"
    DISCOUNTS_GENERATE_15 = "discounts:generate_15"
    
    # Product management
    LOTIONS_MANAGE = "lotions:manage"
    FIZZE_MANAGE = "fizze:manage"
    
    # Analytics
    ANALYTICS_VIEW = "analytics:view"
    ANALYTICS_FINANCIAL = "analytics:financial"
    
    # Social media
    SOCIAL_READ = "social:read"
    SOCIAL_WRITE = "social:write"
    
    # User management
    USERS_MANAGE = "users:manage"
    
    # System config
    SYSTEM_CONFIG = "system:config"
    
    # Voice calls
    VOICE_READ = "voice:read"

ROLE_PERMISSIONS = {
    Role.OWNER: ["*"],  # All permissions
    Role.ADMIN: [
        Permission.LEADS_READ, Permission.LEADS_WRITE,
        Permission.BOOKINGS_READ, Permission.BOOKINGS_WRITE,
        Permission.CAMPAIGNS_READ, Permission.CAMPAIGNS_WRITE,
        Permission.BLOG_READ, Permission.BLOG_WRITE,
        Permission.DISCOUNTS_GENERATE_5, Permission.DISCOUNTS_GENERATE_10, Permission.DISCOUNTS_GENERATE_15,
        Permission.LOTIONS_MANAGE, Permission.FIZZE_MANAGE,
        Permission.ANALYTICS_VIEW, Permission.VOICE_READ
    ],
    Role.MARKETING: [
        Permission.CAMPAIGNS_READ, Permission.CAMPAIGNS_WRITE,
        Permission.BLOG_READ, Permission.BLOG_WRITE,
        Permission.SOCIAL_READ, Permission.SOCIAL_WRITE,
        Permission.ANALYTICS_VIEW
    ],
    Role.SALES: [
        Permission.LEADS_READ, Permission.LEADS_WRITE,
        Permission.BOOKINGS_READ, Permission.BOOKINGS_WRITE,
        Permission.DISCOUNTS_GENERATE_5,
        Permission.ANALYTICS_VIEW
    ]
}

def has_permission(user_role: Role, required_permission: Permission) -> bool:
    """Check if user role has required permission"""
    if user_role == Role.OWNER:
        return True  # Owner has all permissions
    
    role_perms = ROLE_PERMISSIONS.get(user_role, [])
    if "*" in role_perms:
        return True
    return required_permission in role_perms

def require_permission(permission: Permission):
    """Decorator to protect routes with permission check"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract current_user from kwargs (injected by Depends(verify_token))
            current_user = kwargs.get('current_user') or kwargs.get('payload')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_role_str = current_user.get("role", "sales_associate")
            try:
                user_role = Role(user_role_str)
            except ValueError:
                user_role = Role.SALES  # Default to sales if invalid role
            
            if not has_permission(user_role, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. Required: {permission.value}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_any_permission(permissions: List[Permission]):
    """Decorator to protect routes requiring any of the listed permissions"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user') or kwargs.get('payload')
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_role_str = current_user.get("role", "sales_associate")
            try:
                user_role = Role(user_role_str)
            except ValueError:
                user_role = Role.SALES
            
            if user_role == Role.OWNER:
                return await func(*args, **kwargs)
            
            for permission in permissions:
                if has_permission(user_role, permission):
                    return await func(*args, **kwargs)
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required one of: {[p.value for p in permissions]}"
            )
        return wrapper
    return decorator

def can_generate_discount(user_role: Role, percentage: int) -> bool:
    """Check if user can generate discount of given percentage"""
    if user_role == Role.OWNER or user_role == Role.ADMIN:
        return True  # Owner and Admin can generate any discount
    
    if user_role == Role.SALES and percentage == 5:
        return True  # Sales can only generate 5%
    
    return False  # Marketing cannot generate discounts
