# Eastend Tanning & Laundry — Complete Launch-Ready Implementation Plan

## Context Sync
- **Current Status**: Phase 9 features 95% complete (Fizze backend ✅, Receipt system ✅, Enhanced Tanning page ✅, First-time popup ✅)
- **Preview URL**: https://tan-laundry.preview.emergentagent.com
- **Tech Stack**: FastAPI + React + MongoDB; Stripe test mode; Emergent LLM (GPT-4o + Claude); SendGrid + Twilio ready
- **Session Objective**: Complete ALL phases (1-6) in single session to achieve 100% launch-ready status with comprehensive testing, SEO optimization, and supervisor readiness

## Phase 1: Critical Fixes (Status: In Progress) 🔧

### Objectives
1. **Fix Discount Expiry Logic**: 15% = 1 day, 10% = 3 days, 5% = 7 days
2. **Hide Discount Codes in UI**: Auto-apply codes without user visibility
3. **Add Fizze Admin Tab**: Complete CRUD interface for drink management
4. **Verify First-Time Discount Endpoint**: Ensure proper route registration

### Implementation Steps

#### Task 1.1: Update Discount Expiry Logic
**Backend Changes:**
- Modify `/app/backend/discount_routes.py`:
  - Add `percentage` parameter to all discount generation endpoints
  - Implement expiry calculation function:
    ```python
    def calculate_expiry(percentage: int) -> datetime:
        if percentage == 15:
            return datetime.now(timezone.utc) + timedelta(days=1)
        elif percentage == 10:
            return datetime.now(timezone.utc) + timedelta(days=3)
        else:  # 5%
            return datetime.now(timezone.utc) + timedelta(days=7)
    ```
  - Update `POST /api/discounts/first-time` to use 1-day expiry for 15%
  - Update `POST /api/discounts/generate` to accept percentage and calculate expiry
  - Add `lead_id` and `session_id` fields to discount records for auto-apply
  
- Modify `/app/backend/mary_well.py`:
  - Update discount generation in chat to pass percentage parameter
  - Remove code display from chat responses
  - Return message: "✅ Your {percentage}% discount has been applied! It's valid for {days}. Ready to book?"

**Frontend Changes:**
- Modify `/app/frontend/src/components/FirstTimeDiscountPopup.jsx`:
  - Remove code display field
  - Show message: "🎁 15% discount automatically applied! Valid for 24 hours."
  - Update CTA: "Book Now" button that routes to /tanning
  - Add countdown timer showing hours remaining
  
- Modify `/app/frontend/src/components/MaryWellChat.jsx`:
  - Remove discount code display from chat bubbles
  - Show confirmation: "✅ {percentage}% discount applied! Valid for {days}."
  - Add visual indicator (badge) when discount is active

#### Task 1.2: Add Fizze Admin Tab
**Frontend Changes:**
- Modify `/app/frontend/src/pages/Admin.jsx`:
  - Add 7th tab: "Fizze Menu" (after Voice Calls tab)
  - Create table with columns:
    - Name (editable inline)
    - Category (dropdown: Milk Teas, Fruit Teas, Blended Ice, Hot Boba, House Specials, Toppings)
    - Price (editable inline with $ prefix)
    - Recipe (truncated to 50 chars, tooltip on hover)
    - Available (toggle switch with instant API update)
    - Coming Soon (toggle switch with instant API update)
    - Votes (read-only, badge style)
    - Actions (Edit button → modal, Delete button → confirmation dialog)
  - Add "Create New Drink" button → modal form with fields:
    - Name (required)
    - Category (required dropdown)
    - Flavor Profile (textarea)
    - Recipe (textarea with ingredient list)
    - Price (number input)
    - Image URL (optional)
    - Available (checkbox, default true)
    - Coming Soon (checkbox, default false)
  - Edit modal: pre-fill all fields, same validation
  - Delete confirmation: "Are you sure you want to delete {drink_name}? This cannot be undone."
  - Add search/filter: by category, availability status
  - Add sorting: by name, price, votes, created date
  
**API Endpoints (Already Exist - Just Wire Up):**
- `GET /api/fizze/admin/drinks` - List all drinks
- `POST /api/fizze/admin/drinks` - Create drink
- `PUT /api/fizze/admin/drinks/{id}` - Update drink
- `DELETE /api/fizze/admin/drinks/{id}` - Delete drink
- `PATCH /api/fizze/admin/drinks/{id}/toggle` - Toggle available/coming_soon

#### Task 1.3: Auto-Apply Discount System
**Backend Changes:**
- Update discount schema to include:
  ```python
  {
    "code": str,
    "percentage": int,
    "expires_at": datetime,
    "lead_id": Optional[str],
    "session_id": Optional[str],
    "auto_applied": bool,
    "redeemed": bool,
    "redeemed_at": Optional[datetime]
  }
  ```
- Add `/api/discounts/active` endpoint:
  - Accepts `lead_id` or `session_id` (from localStorage)
  - Returns active discount if exists and not expired
  - Marks as `redeemed` when used in checkout
- Modify Stripe checkout creation:
  - Check for active discount via lead_id/session_id
  - Auto-apply discount to checkout session
  - Store discount_id in payment metadata
- Update webhook handler:
  - Mark discount as redeemed on successful payment
  - Prevent reuse of same discount

**Frontend Changes:**
- Remove all manual code entry fields from checkout
- Add automatic discount check on checkout page load:
  ```javascript
  useEffect(() => {
    const checkDiscount = async () => {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/discounts/active?session_id=${sessionId}`);
      if (response.ok) {
        const discount = await response.json();
        setAppliedDiscount(discount);
      }
    };
    checkDiscount();
  }, []);
  ```
- Display applied discount in checkout summary:
  - "🎉 {percentage}% discount applied! Expires in {hours}h {minutes}m"
  - Strikethrough original price
  - Show discounted price in green
- No input field for manual code entry

#### Task 1.4: Verify and Fix First-Time Discount Endpoint
**Testing:**
- Test `POST /api/discounts/first-time` via curl:
  ```bash
  curl -X POST https://tan-laundry.preview.emergentagent.com/api/discounts/first-time \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test_session_123"}'
  ```
- Verify response includes: code, percentage (15), expires_at (24 hours from now)
- Check MongoDB for created discount record
- Fix any 404 errors (ensure route registered in server.py)
- Fix any validation errors (ensure all required fields present)

### Success Criteria (Phase 1)
- ✅ Discount expiry correctly calculated: 15%=1day, 10%=3days, 5%=7days
- ✅ No discount codes visible anywhere in UI
- ✅ Fizze Admin tab fully functional with CRUD operations
- ✅ First-time popup displays and applies discount automatically
- ✅ Checkout flow auto-applies discounts without manual entry
- ✅ Screenshots confirm all UI changes working

---

## Phase 2: Role-Based Access Control (Status: Not Started) 🔐

### Objectives
1. **Define 4 User Roles**: Owner, Admin, Marketing Associate, Sales Associate
2. **Implement Permission System**: Backend decorators and frontend guards
3. **Update Admin Dashboard**: Show/hide features based on role
4. **Secure API Endpoints**: Protect routes with role-based middleware
5. **Create User Management UI**: Owner can create/manage staff accounts

### Role Definitions

#### Owner (Full Access)
- All backend features without restriction
- User management (create/edit/delete staff accounts, assign roles)
- Financial settings (Stripe keys, pricing updates, revenue reports)
- System configuration (integrations, webhooks, API keys)
- All analytics and reports including financial data
- Can override any permission restriction

#### Admin (Most Features)
- Leads, bookings, campaigns management
- Blog and content creation
- Discount generation (all percentages: 5%, 10%, 15%)
- Lotions and Fizze menu management (full CRUD)
- Analytics (engagement, conversions, but NOT revenue)
- Voice calls management
- **Cannot**: Manage users, view revenue/financial reports, change system config, modify Stripe settings

#### Marketing Associate (Marketing Only)
- Create/edit email and SMS campaigns
- Blog post creation and scheduling
- Social media post scheduling (Phase 3)
- Analytics: engagement metrics, clicks, conversions (no revenue)
- Content library management
- **Cannot**: Access leads directly, generate discounts, view bookings, access financial data, manage products

#### Sales Associate (Sales Only)
- View and manage leads (full CRUD)
- View and manage bookings (full CRUD)
- Generate 5% discounts ONLY (cannot create 10% or 15%)
- View customer journey analytics
- Chat with Mary Well on behalf of customers
- **Cannot**: Create campaigns, access financial data, manage content, view revenue, generate higher discounts

### Implementation Steps

#### Task 2.1: Backend Role System
**Create `/app/backend/roles.py`:**
```python
from enum import Enum
from functools import wraps
from fastapi import HTTPException, status, Depends
from typing import List, Optional

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
    return required_permission in role_perms

def require_permission(permission: Permission):
    """Decorator to protect routes with permission check"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: dict = Depends(verify_token), **kwargs):
            user_role = Role(current_user.get("role", "sales_associate"))
            
            if not has_permission(user_role, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. Required: {permission.value}"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

def require_any_permission(permissions: List[Permission]):
    """Decorator to protect routes requiring any of the listed permissions"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: dict = Depends(verify_token), **kwargs):
            user_role = Role(current_user.get("role", "sales_associate"))
            
            if user_role == Role.OWNER:
                return await func(*args, current_user=current_user, **kwargs)
            
            for permission in permissions:
                if has_permission(user_role, permission):
                    return await func(*args, current_user=current_user, **kwargs)
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required one of: {[p.value for p in permissions]}"
            )
        return wrapper
    return decorator
```

**Modify `/app/backend/auth.py`:**
- Add `role` field to User model:
  ```python
  class User(BaseModel):
      email: str
      name: str
      role: str = "sales_associate"  # Default role
      created_at: datetime
      last_login: Optional[datetime]
  ```
- Update JWT token generation to include role:
  ```python
  token_data = {
      "sub": user["email"],
      "user_id": user["id"],
      "role": user.get("role", "sales_associate"),
      "exp": datetime.now(timezone.utc) + timedelta(days=7)
  }
  ```
- Update `verify_token()` to extract and return role
- Create `get_current_user_role()` dependency for easy role access

**Update Route Protection:**
Apply permission decorators to all protected routes:

1. `/app/backend/routes.py`:
   - `POST /api/leads` → `@require_permission(Permission.LEADS_WRITE)`
   - `PUT /api/leads/{id}` → `@require_permission(Permission.LEADS_WRITE)`
   - `DELETE /api/leads/{id}` → `@require_permission(Permission.LEADS_WRITE)`
   - `GET /api/leads` → `@require_permission(Permission.LEADS_READ)`

2. `/app/backend/discount_routes.py`:
   - Add role-based percentage restriction:
     ```python
     @router.post("/api/discounts/generate")
     async def generate_discount(
         percentage: int,
         current_user: dict = Depends(verify_token)
     ):
         user_role = Role(current_user.get("role"))
         
         # Sales can only generate 5%
         if user_role == Role.SALES and percentage > 5:
             raise HTTPException(403, "Sales associates can only generate 5% discounts")
         
         # Marketing cannot generate any discounts
         if user_role == Role.MARKETING:
             raise HTTPException(403, "Marketing associates cannot generate discounts")
         
         # Proceed with discount generation
     ```

3. `/app/backend/fizze_routes.py`:
   - All admin routes → `@require_permission(Permission.FIZZE_MANAGE)`

4. `/app/backend/ai_routes.py`:
   - Blog generation → `@require_permission(Permission.BLOG_WRITE)`

5. `/app/backend/lotion_routes.py`:
   - CRUD operations → `@require_permission(Permission.LOTIONS_MANAGE)`

#### Task 2.2: Frontend Role Guards
**Create `/app/frontend/src/utils/permissions.js`:**
```javascript
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MARKETING: 'marketing_associate',
  SALES: 'sales_associate'
};

export const PERMISSIONS = {
  LEADS_READ: 'leads:read',
  LEADS_WRITE: 'leads:write',
  BOOKINGS_READ: 'bookings:read',
  BOOKINGS_WRITE: 'bookings:write',
  CAMPAIGNS_READ: 'campaigns:read',
  CAMPAIGNS_WRITE: 'campaigns:write',
  BLOG_WRITE: 'blog:write',
  DISCOUNTS_GENERATE_5: 'discounts:generate_5',
  DISCOUNTS_GENERATE_10: 'discounts:generate_10',
  DISCOUNTS_GENERATE_15: 'discounts:generate_15',
  LOTIONS_MANAGE: 'lotions:manage',
  FIZZE_MANAGE: 'fizze:manage',
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_FINANCIAL: 'analytics:financial',
  SOCIAL_WRITE: 'social:write',
  USERS_MANAGE: 'users:manage',
  SYSTEM_CONFIG: 'system:config',
  VOICE_READ: 'voice:read'
};

const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['*'],
  [ROLES.ADMIN]: [
    PERMISSIONS.LEADS_READ, PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_WRITE,
    PERMISSIONS.CAMPAIGNS_READ, PERMISSIONS.CAMPAIGNS_WRITE,
    PERMISSIONS.BLOG_WRITE,
    PERMISSIONS.DISCOUNTS_GENERATE_5, PERMISSIONS.DISCOUNTS_GENERATE_10, PERMISSIONS.DISCOUNTS_GENERATE_15,
    PERMISSIONS.LOTIONS_MANAGE, PERMISSIONS.FIZZE_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.VOICE_READ
  ],
  [ROLES.MARKETING]: [
    PERMISSIONS.CAMPAIGNS_READ, PERMISSIONS.CAMPAIGNS_WRITE,
    PERMISSIONS.BLOG_WRITE, PERMISSIONS.SOCIAL_WRITE,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  [ROLES.SALES]: [
    PERMISSIONS.LEADS_READ, PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_WRITE,
    PERMISSIONS.DISCOUNTS_GENERATE_5,
    PERMISSIONS.ANALYTICS_VIEW
  ]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  if (userRole === ROLES.OWNER) return true;
  
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  return rolePerms.includes(permission);
};

export const canAccessTab = (userRole, tabName) => {
  const tabPermissions = {
    'Leads': PERMISSIONS.LEADS_READ,
    'Bookings': PERMISSIONS.BOOKINGS_READ,
    'Campaigns': PERMISSIONS.CAMPAIGNS_READ,
    'Blog': PERMISSIONS.BLOG_WRITE,
    'Lotions': PERMISSIONS.LOTIONS_MANAGE,
    'Voice Calls': PERMISSIONS.VOICE_READ,
    'Fizze Menu': PERMISSIONS.FIZZE_MANAGE,
    'Social Media': PERMISSIONS.SOCIAL_WRITE,
    'Analytics': PERMISSIONS.ANALYTICS_VIEW,
    'Financial Reports': PERMISSIONS.ANALYTICS_FINANCIAL,
    'User Management': PERMISSIONS.USERS_MANAGE,
    'System Settings': PERMISSIONS.SYSTEM_CONFIG
  };
  
  const requiredPermission = tabPermissions[tabName];
  if (!requiredPermission) return true; // No restriction
  
  return hasPermission(userRole, requiredPermission);
};

export const getVisibleTabs = (userRole) => {
  const allTabs = [
    'Leads', 'Bookings', 'Campaigns', 'Blog', 'Lotions', 
    'Voice Calls', 'Fizze Menu', 'Social Media', 'Analytics',
    'Financial Reports', 'User Management', 'System Settings'
  ];
  
  return allTabs.filter(tab => canAccessTab(userRole, tab));
};

export const canGenerateDiscount = (userRole, percentage) => {
  if (userRole === ROLES.OWNER || userRole === ROLES.ADMIN) return true;
  if (userRole === ROLES.SALES && percentage === 5) return true;
  return false;
};
```

**Modify `/app/frontend/src/pages/Admin.jsx`:**
```javascript
import { hasPermission, canAccessTab, getVisibleTabs, PERMISSIONS } from '../utils/permissions';

function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Leads');
  
  useEffect(() => {
    // Fetch current user with role
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await response.json();
      setUser(userData);
      
      // Set first visible tab as active
      const visibleTabs = getVisibleTabs(userData.role);
      if (visibleTabs.length > 0) {
        setActiveTab(visibleTabs[0]);
      }
    };
    fetchUser();
  }, []);
  
  const visibleTabs = user ? getVisibleTabs(user.role) : [];
  
  return (
    <div className="admin-dashboard">
      {/* Role Badge */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          {user?.role?.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      
      {/* Tabs - only show permitted tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {visibleTabs.map(tab => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Tab Content with permission checks */}
        {visibleTabs.includes('Leads') && (
          <TabsContent value="Leads">
            {/* Leads content */}
          </TabsContent>
        )}
        
        {visibleTabs.includes('Fizze Menu') && (
          <TabsContent value="Fizze Menu">
            {/* Fizze CRUD interface */}
          </TabsContent>
        )}
        
        {visibleTabs.includes('User Management') && (
          <TabsContent value="User Management">
            {/* User management UI (Owner only) */}
          </TabsContent>
        )}
        
        {/* ... other tabs */}
      </Tabs>
    </div>
  );
}
```

**Add Discount Generation Guards:**
- In MaryWellChat, check user role before showing discount options
- In admin discount form, disable percentage options based on role
- Show tooltip: "Sales associates can only generate 5% discounts"

#### Task 2.3: User Management Interface (Owner Only)
**Create `/app/backend/user_routes.py`:**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import uuid
import secrets
from .auth import verify_token, hash_password
from .roles import require_permission, Permission, Role

router = APIRouter()

class CreateUserRequest(BaseModel):
    email: EmailStr
    name: str
    role: Role
    temp_password: Optional[str] = None

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[Role] = None
    active: Optional[bool] = None

@router.get("/api/users")
@require_permission(Permission.USERS_MANAGE)
async def list_users(current_user: dict = Depends(verify_token)):
    """List all staff users (Owner only)"""
    users = await db.users.find(
        {},
        {"password": 0}  # Don't return passwords
    ).to_list(length=100)
    return users

@router.post("/api/users")
@require_permission(Permission.USERS_MANAGE)
async def create_user(
    user_data: CreateUserRequest,
    current_user: dict = Depends(verify_token)
):
    """Create new staff account (Owner only)"""
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(400, "Email already registered")
    
    # Generate temp password if not provided
    temp_password = user_data.temp_password or secrets.token_urlsafe(12)
    
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "name": user_data.name,
        "role": user_data.role.value,
        "password": hash_password(temp_password),
        "active": True,
        "created_at": datetime.now(timezone.utc),
        "created_by": current_user["user_id"],
        "last_login": None,
        "must_change_password": True
    }
    
    await db.users.insert_one(new_user)
    
    return {
        "user": {k: v for k, v in new_user.items() if k != "password"},
        "temp_password": temp_password  # Return once for owner to share
    }

@router.put("/api/users/{user_id}")
@require_permission(Permission.USERS_MANAGE)
async def update_user(
    user_id: str,
    user_data: UpdateUserRequest,
    current_user: dict = Depends(verify_token)
):
    """Update user role or status (Owner only)"""
    update_fields = {}
    if user_data.name is not None:
        update_fields["name"] = user_data.name
    if user_data.role is not None:
        update_fields["role"] = user_data.role.value
    if user_data.active is not None:
        update_fields["active"] = user_data.active
    
    update_fields["updated_at"] = datetime.now(timezone.utc)
    update_fields["updated_by"] = current_user["user_id"]
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(404, "User not found")
    
    return {"message": "User updated successfully"}

@router.delete("/api/users/{user_id}")
@require_permission(Permission.USERS_MANAGE)
async def deactivate_user(
    user_id: str,
    current_user: dict = Depends(verify_token)
):
    """Deactivate user account (Owner only)"""
    # Prevent self-deactivation
    if user_id == current_user["user_id"]:
        raise HTTPException(400, "Cannot deactivate your own account")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "active": False,
            "deactivated_at": datetime.now(timezone.utc),
            "deactivated_by": current_user["user_id"]
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(404, "User not found")
    
    return {"message": "User deactivated successfully"}
```

**Add User Management Tab to Admin.jsx:**
```javascript
<TabsContent value="User Management">
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Button onClick={() => setShowCreateUserModal(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Create New User
      </Button>
    </div>
    
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge>{user.role.replace('_', ' ')}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? 'success' : 'destructive'}>
                {user.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => editUser(user)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deactivateUser(user.id)}>
                Deactivate
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</TabsContent>
```

**Create User Modal:**
- Form fields: Email, Name, Role dropdown, Optional temp password
- Validation: Email format, role selection required
- On submit: Call `POST /api/users`, show temp password to owner
- Success message: "User created! Share this temp password: {password}"

### Success Criteria (Phase 2)
- ✅ 4 roles defined with clear permission boundaries
- ✅ All API routes protected with role-based middleware
- ✅ Admin dashboard shows only permitted tabs per role
- ✅ Owner can create/manage staff accounts
- ✅ Sales associates can only generate 5% discounts
- ✅ Marketing associates cannot access leads or bookings
- ✅ Permission denied errors show clear messages
- ✅ Role badge visible in admin header

---

## Phase 3: Social Media Integrations (Status: Not Started) 📱

### Objectives
1. **Facebook Integration**: Pages API, Lead Ads, Pixel tracking, Messenger bot
2. **Instagram Integration**: Business API, Stories, DM automation
3. **TikTok Integration**: Business Center, Ads API, Analytics
4. **Unified Admin Dashboard**: Post scheduling, lead management, analytics
5. **Mary Well Integration**: Route social DMs to AI chat system

### Implementation Steps

#### Task 3.1: Get Integration Playbooks
**Call Integration Expert for Each Platform:**

1. **Facebook Pages API + Lead Ads + Pixel:**
   ```
   INTEGRATION: Facebook Pages API, Facebook Lead Ads, Facebook Pixel
   CONSTRAINTS: 
   - Need to capture leads from Facebook Lead Gen forms
   - Need to track conversions with Facebook Pixel
   - Need to handle Messenger messages via webhook
   - Must integrate with existing Mary Well AI chat system
   - Python backend (FastAPI), React frontend
   ```

2. **Instagram Business API + DM Automation:**
   ```
   INTEGRATION: Instagram Business API, Instagram Direct Messages
   CONSTRAINTS:
   - Need to schedule posts and stories
   - Need to handle incoming DMs via webhook
   - Route DMs to Mary Well AI for automated responses
   - Fetch analytics (reach, engagement, profile visits)
   - Python backend (FastAPI), React frontend
   ```

3. **TikTok Business Center + Ads API:**
   ```
   INTEGRATION: TikTok Business Center API, TikTok Ads API
   CONSTRAINTS:
   - Need to capture leads from TikTok Lead Gen forms
   - Need to schedule video posts
   - Fetch analytics (views, likes, shares, conversions)
   - Python backend (FastAPI), React frontend
   ```

**Expected Outputs:**
- Required credentials list (App IDs, secrets, tokens, page IDs)
- SDK installation instructions
- Webhook setup guides with verification logic
- Code examples for authentication, posting, lead capture
- Rate limit information
- Error handling best practices

#### Task 3.2: Facebook Integration
**Backend Implementation:**

Create `/app/backend/social/facebook_routes.py`:
```python
from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
import hmac
import hashlib
from typing import Optional, List
from datetime import datetime, timezone
import uuid

router = APIRouter()

# Will be populated from integration playbook
# Example structure:
class FacebookPost(BaseModel):
    message: str
    link: Optional[str] = None
    image_url: Optional[str] = None
    scheduled_time: Optional[datetime] = None

@router.post("/api/social/facebook/webhook")
async def facebook_webhook(request: Request):
    """Handle Facebook webhooks for lead forms and Messenger messages"""
    # Verify webhook signature (from playbook)
    # Parse lead form submission or message
    # If lead form: create lead in MongoDB
    # If messenger message: route to Mary Well chat
    pass

@router.get("/api/social/facebook/webhook")
async def facebook_webhook_verify(request: Request):
    """Verify webhook with Facebook (required for setup)"""
    # Verification logic from playbook
    pass

@router.post("/api/social/facebook/post")
async def create_facebook_post(post: FacebookPost, current_user: dict = Depends(verify_token)):
    """Schedule or publish post to Facebook page"""
    # Use Facebook Graph API to post
    # Store post record in MongoDB
    pass

@router.get("/api/social/facebook/analytics")
async def get_facebook_analytics(days: int = 30):
    """Fetch Facebook page insights"""
    # Get page insights from Graph API
    # Return: reach, engagement, post performance
    pass

@router.get("/api/social/facebook/leads")
async def get_facebook_leads(limit: int = 50):
    """Fetch leads from Facebook Lead Ads"""
    # Query MongoDB for leads with source='facebook'
    pass
```

**Install Dependencies:**
```bash
pip install facebook-sdk requests
```

**Environment Variables:**
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_VERIFY_TOKEN=random_string_for_webhook
```

**Facebook Pixel Integration (Frontend):**
Add to `/app/frontend/public/index.html`:
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

Track conversions:
```javascript
// In checkout success page
fbq('track', 'Purchase', {
  value: amount,
  currency: 'USD',
  content_name: 'Tanning Package'
});

// In booking page
fbq('track', 'InitiateCheckout');

// In lead form
fbq('track', 'Lead');
```

#### Task 3.3: Instagram Integration
**Backend Implementation:**

Create `/app/backend/social/instagram_routes.py`:
```python
from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

router = APIRouter()

class InstagramPost(BaseModel):
    caption: str
    image_url: str
    post_type: str = "feed"  # feed, story, reel
    scheduled_time: Optional[datetime] = None

@router.post("/api/social/instagram/webhook")
async def instagram_webhook(request: Request):
    """Handle Instagram webhooks for DMs and mentions"""
    # Parse incoming DM
    # Route to Mary Well chat system
    # Send AI response back via Instagram API
    pass

@router.get("/api/social/instagram/webhook")
async def instagram_webhook_verify(request: Request):
    """Verify webhook with Instagram (uses Facebook verification)"""
    pass

@router.post("/api/social/instagram/post")
async def create_instagram_post(post: InstagramPost, current_user: dict = Depends(verify_token)):
    """Schedule or publish post/story to Instagram"""
    # Use Instagram Graph API (part of Facebook Graph API)
    # Create media container, publish
    pass

@router.get("/api/social/instagram/analytics")
async def get_instagram_analytics(days: int = 30):
    """Fetch Instagram business account insights"""
    # Get insights: reach, impressions, profile views, engagement
    pass

@router.get("/api/social/instagram/messages")
async def get_instagram_messages(limit: int = 50):
    """Fetch recent Instagram DMs"""
    # Query Instagram Messaging API
    pass
```

**Environment Variables:**
```
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token
```

**Mary Well Integration:**
When Instagram DM received:
1. Parse message content and sender
2. Create temporary chat session
3. Call Mary Well AI with message
4. Send AI response back via Instagram API
5. Log conversation in MongoDB

#### Task 3.4: TikTok Integration
**Backend Implementation:**

Create `/app/backend/social/tiktok_routes.py`:
```python
from fastapi import APIRouter, Request, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

router = APIRouter()

class TikTokPost(BaseModel):
    caption: str
    video_url: str
    hashtags: List[str] = []
    scheduled_time: Optional[datetime] = None

@router.post("/api/social/tiktok/webhook")
async def tiktok_webhook(request: Request):
    """Handle TikTok webhooks for lead forms"""
    # Parse lead form submission
    # Create lead in MongoDB with source='tiktok'
    pass

@router.get("/api/social/tiktok/webhook")
async def tiktok_webhook_verify(request: Request):
    """Verify webhook with TikTok"""
    pass

@router.post("/api/social/tiktok/post")
async def create_tiktok_post(post: TikTokPost, current_user: dict = Depends(verify_token)):
    """Schedule or publish video to TikTok"""
    # Use TikTok Content Posting API
    pass

@router.get("/api/social/tiktok/analytics")
async def get_tiktok_analytics(days: int = 30):
    """Fetch TikTok account analytics"""
    # Get video analytics: views, likes, shares, comments
    pass

@router.get("/api/social/tiktok/leads")
async def get_tiktok_leads(limit: int = 50):
    """Fetch leads from TikTok Lead Gen forms"""
    # Query MongoDB for leads with source='tiktok'
    pass
```

**Environment Variables:**
```
TIKTOK_APP_ID=your_app_id
TIKTOK_APP_SECRET=your_app_secret
TIKTOK_ACCESS_TOKEN=your_access_token
```

#### Task 3.5: Unified Social Media Dashboard
**Create Social Media Admin Tab:**

Add to `/app/frontend/src/pages/Admin.jsx`:
```javascript
<TabsContent value="Social Media">
  <div className="space-y-8">
    {/* Overview Section */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{socialStats.totalLeads}</p>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Reach</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{socialStats.totalReach}</p>
          <p className="text-sm text-muted-foreground">All platforms</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Engagement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{socialStats.engagementRate}%</p>
          <p className="text-sm text-muted-foreground">Average</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{socialStats.conversions}</p>
          <p className="text-sm text-muted-foreground">From social media</p>
        </CardContent>
      </Card>
    </div>
    
    {/* Post Scheduler */}
    <Card>
      <CardHeader>
        <CardTitle>Schedule Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={selectedPlatforms.includes('facebook') ? 'default' : 'outline'}
              onClick={() => togglePlatform('facebook')}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button 
              variant={selectedPlatforms.includes('instagram') ? 'default' : 'outline'}
              onClick={() => togglePlatform('instagram')}
            >
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
            <Button 
              variant={selectedPlatforms.includes('tiktok') ? 'default' : 'outline'}
              onClick={() => togglePlatform('tiktok')}
            >
              <Music className="mr-2 h-4 w-4" />
              TikTok
            </Button>
          </div>
          
          <Textarea 
            placeholder="What's on your mind?" 
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={4}
          />
          
          <div className="flex gap-4">
            <Input type="file" accept="image/*,video/*" onChange={handleMediaUpload} />
            <Input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          </div>
          
          <Button onClick={schedulePost}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {/* Lead Management */}
    <Card>
      <CardHeader>
        <CardTitle>Social Media Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socialLeads.map(lead => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Badge>
                    {lead.source === 'facebook' && <Facebook className="h-3 w-3 mr-1" />}
                    {lead.source === 'instagram' && <Instagram className="h-3 w-3 mr-1" />}
                    {lead.source === 'tiktok' && <Music className="h-3 w-3 mr-1" />}
                    {lead.source}
                  </Badge>
                </TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email || lead.phone}</TableCell>
                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => routeToMary(lead.id)}>
                    Route to Mary
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
    {/* Analytics Dashboard */}
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="facebook">
          <TabsList>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facebook">
            {/* Facebook analytics charts */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Page Reach</h4>
                {/* Chart component */}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Engagement</h4>
                {/* Chart component */}
              </div>
            </div>
          </TabsContent>
          
          {/* Similar for Instagram and TikTok */}
        </Tabs>
      </CardContent>
    </Card>
    
    {/* Settings */}
    <Card>
      <CardHeader>
        <CardTitle>Social Media Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Connected Accounts</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Facebook Page</span>
                <Badge variant={facebookConnected ? 'success' : 'destructive'}>
                  {facebookConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Instagram Business</span>
                <Badge variant={instagramConnected ? 'success' : 'destructive'}>
                  {instagramConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>TikTok Business</span>
                <Badge variant={tiktokConnected ? 'success' : 'destructive'}>
                  {tiktokConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Webhook URLs</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Configure these URLs in your platform settings:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value="https://tan-laundry.preview.emergentagent.com/api/social/facebook/webhook" 
                />
                <Button variant="ghost" size="sm">Copy</Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value="https://tan-laundry.preview.emergentagent.com/api/social/instagram/webhook" 
                />
                <Button variant="ghost" size="sm">Copy</Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value="https://tan-laundry.preview.emergentagent.com/api/social/tiktok/webhook" 
                />
                <Button variant="ghost" size="sm">Copy</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Auto-Response Settings</h4>
            <div className="flex items-center justify-between">
              <span>Enable Mary Well for Instagram DMs</span>
              <Switch checked={autoResponseInstagram} onCheckedChange={setAutoResponseInstagram} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>Enable Mary Well for Facebook Messenger</span>
              <Switch checked={autoResponseFacebook} onCheckedChange={setAutoResponseFacebook} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>
```

**Wire Up Backend Routes:**
Update `/app/backend/server.py`:
```python
from backend.social.facebook_routes import router as facebook_router
from backend.social.instagram_routes import router as instagram_router
from backend.social.tiktok_routes import router as tiktok_router

app.include_router(facebook_router)
app.include_router(instagram_router)
app.include_router(tiktok_router)
```

### Success Criteria (Phase 3)
- ✅ Integration playbooks obtained for all 3 platforms
- ✅ Facebook Pixel installed; conversion tracking active
- ✅ Instagram DMs route to Mary Well for automated responses
- ✅ TikTok lead forms create leads in MongoDB
- ✅ Admin can schedule posts to all 3 platforms from dashboard
- ✅ Unified analytics view: impressions, clicks, conversions by platform
- ✅ All webhooks properly configured and tested
- ✅ Lead capture working from all platforms
- ✅ Social Media tab shows real-time data

---

## Phase 4: SEO Optimization (Status: Not Started) 🔍

### Objectives
1. **Meta Tags**: Proper title, description, OG tags for all pages
2. **Structured Data**: JSON-LD schema for local business, services, reviews
3. **Performance**: Optimize images, lazy loading, code splitting
4. **Sitemap & Robots.txt**: Generate dynamic sitemap, configure crawling
5. **Analytics**: Google Analytics 4 + Search Console integration
6. **Core Web Vitals**: Achieve excellent scores on all metrics

### Implementation Steps

#### Task 4.1: Meta Tags and SEO Headers
**Create `/app/frontend/src/utils/seo.js`:**
```javascript
export const SEO_CONFIG = {
  home: {
    title: "Eastend Tanning & Laundry - Premium Tanning & Coin Laundry in Evansville, IN",
    description: "Evansville's premier tanning salon and laundromat. Monthly unlimited tanning from $59.99, professional-grade beds, premium lotions, coin laundry, and Fizze bubble tea. Two locations: Eastend & Westend.",
    keywords: "tanning salon Evansville, laundromat Evansville, bubble tea Evansville, monthly tanning, unlimited tanning, coin laundry, tanning beds, Eastend Tanning",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-home.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/"
  },
  tanning: {
    title: "Unlimited Tanning Packages - Monthly Plans from $59.99 | Eastend Tanning",
    description: "Get your perfect tan with our monthly unlimited tanning packages. Professional tanning beds, premium lotions, expert guidance, and flexible hours. Start at just $59.99/month in Evansville, IN.",
    keywords: "unlimited tanning, monthly tanning packages, tanning beds Evansville, tanning lotions, VIP tanning, professional tanning salon",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-tanning.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/tanning"
  },
  laundry: {
    title: "Coin Laundry & Card-Operated Machines - Eastend & Westend Locations",
    description: "Clean, modern laundromats in Evansville. Coin-operated and card-accepted machines at Eastend. Coin-only at Westend. Open daily 6 AM - 10 PM.",
    keywords: "coin laundry Evansville, laundromat near me, card laundry machines, 24 hour laundromat, Eastend laundry, Westend laundry",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-laundry.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/laundry"
  },
  drinks: {
    title: "Fizze Bubble Tea Menu - Fresh Boba, Milk Teas & Fruit Teas | Eastend Location",
    description: "Explore our Fizze bubble tea menu with milk teas, fruit teas, blended ice drinks, hot boba, and house specials. Vote for your favorite coming-soon flavors!",
    keywords: "bubble tea Evansville, boba tea, milk tea, fruit tea, Fizze drinks, boba near me, taro milk tea",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-fizze.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/drinks"
  },
  locations: {
    title: "Our Locations - Eastend & Westend Evansville | Hours & Directions",
    description: "Visit us at our two Evansville locations. Eastend: Full service with tanning, laundry, nails & Fizze drinks. Westend: Coin laundry only. Open daily 6 AM - 10 PM.",
    keywords: "Eastend Tanning location, Westend laundry location, Evansville tanning salon address, directions to Eastend Tanning",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-locations.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/locations"
  },
  blog: {
    title: "Tanning Tips & Beauty Blog - Expert Advice | Eastend Tanning",
    description: "Get expert tanning tips, skincare advice, and beauty insights from our blog. Learn about tanning bed levels, lotion selection, and achieving the perfect tan.",
    keywords: "tanning tips, tanning advice, skincare blog, tanning bed tips, how to tan safely, tanning lotion guide",
    ogImage: "https://tan-laundry.preview.emergentagent.com/images/og-blog.jpg",
    canonical: "https://tan-laundry.preview.emergentagent.com/blog"
  }
};

export const getPageSEO = (pageName) => {
  return SEO_CONFIG[pageName] || SEO_CONFIG.home;
};
```

**Create `/app/frontend/src/components/SEO.jsx`:**
```javascript
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  canonical,
  type = 'website',
  author = 'Eastend Tanning & Laundry'
}) => {
  const siteUrl = 'https://tan-laundry.preview.emergentagent.com';
  const fullCanonical = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Tags (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Eastend Tanning & Laundry" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US-IN" />
      <meta name="geo.placename" content="Evansville" />
      <meta name="geo.position" content="37.9747;-87.5558" />
      <meta name="ICBM" content="37.9747, -87.5558" />
    </Helmet>
  );
};

export default SEO;
```

**Install React Helmet:**
```bash
cd /app/frontend && yarn add react-helmet-async
```

**Wrap App with HelmetProvider:**
Update `/app/frontend/src/index.js`:
```javascript
import { HelmetProvider } from 'react-helmet-async';

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

**Update All Pages to Use SEO Component:**
Example for Home.jsx:
```javascript
import SEO from '../components/SEO';
import { getPageSEO } from '../utils/seo';

function Home() {
  const seo = getPageSEO('home');
  
  return (
    <>
      <SEO {...seo} />
      <div className="home-page">
        {/* Page content */}
      </div>
    </>
  );
}
```

Repeat for: Tanning.jsx, Laundry.jsx, Drinks.jsx, Locations.jsx, Blog.jsx

#### Task 4.2: Structured Data (JSON-LD)
**Create `/app/frontend/src/utils/structuredData.js`:**
```javascript
export const LOCAL_BUSINESS_SCHEMA_EASTEND = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://tan-laundry.preview.emergentagent.com/#eastend",
  "name": "Eastend Tanning & Laundry",
  "image": "https://tan-laundry.preview.emergentagent.com/images/eastend-exterior.jpg",
  "description": "Premier tanning salon, laundromat, nail salon, and bubble tea shop in Evansville, IN. Monthly unlimited tanning from $59.99.",
  "url": "https://tan-laundry.preview.emergentagent.com",
  "telephone": "+1-812-XXX-XXXX",
  "email": "info@eastendtanning.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Eastend Ave",
    "addressLocality": "Evansville",
    "addressRegion": "IN",
    "postalCode": "47715",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.9747",
    "longitude": "-87.5558"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "06:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "paymentAccepted": "Cash, Credit Card, Debit Card",
  "currenciesAccepted": "USD",
  "hasMap": "https://maps.google.com/?q=Eastend+Tanning+Evansville",
  "sameAs": [
    "https://www.facebook.com/eastendtanning",
    "https://www.instagram.com/eastendtanning",
    "https://www.tiktok.com/@eastendtanning"
  ]
};

export const LOCAL_BUSINESS_SCHEMA_WESTEND = {
  "@context": "https://schema.org",
  "@type": "Laundromat",
  "@id": "https://tan-laundry.preview.emergentagent.com/#westend",
  "name": "Westend Laundry",
  "image": "https://tan-laundry.preview.emergentagent.com/images/westend-exterior.jpg",
  "description": "Coin-operated laundromat in Evansville, IN. Clean, modern machines available daily.",
  "url": "https://tan-laundry.preview.emergentagent.com/locations",
  "telephone": "+1-812-XXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 Westend Blvd",
    "addressLocality": "Evansville",
    "addressRegion": "IN",
    "postalCode": "47712",
    "addressCountry": "US"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "06:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$",
  "paymentAccepted": "Cash, Coins",
  "currenciesAccepted": "USD"
};

export const TANNING_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tan-laundry.preview.emergentagent.com/#tanning-service",
  "serviceType": "Tanning Salon",
  "name": "Professional Indoor Tanning",
  "description": "Professional indoor tanning services with 5 tanning bed levels, premium lotions, and expert guidance.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Eastend Tanning & Laundry"
  },
  "areaServed": {
    "@type": "City",
    "name": "Evansville",
    "containedInPlace": {
      "@type": "State",
      "name": "Indiana"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tanning Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Monthly Unlimited Tanning"
        },
        "price": "59.99",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "59.99",
          "priceCurrency": "USD",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitCode": "MON"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "VIP Unlimited Tanning"
        },
        "price": "89.99",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "89.99",
          "priceCurrency": "USD",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitCode": "MON"
          }
        }
      }
    ]
  }
};

export const FIZZE_MENU_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": "https://tan-laundry.preview.emergentagent.com/#fizze-menu",
  "name": "Fizze Bubble Tea Menu",
  "description": "Fresh bubble tea, milk teas, fruit teas, and specialty drinks",
  "hasMenuSection": [
    {
      "@type": "MenuSection",
      "name": "Milk Teas",
      "description": "Creamy milk tea bases with boba pearls"
    },
    {
      "@type": "MenuSection",
      "name": "Fruit Teas",
      "description": "Refreshing fruit-infused teas"
    }
  ]
};

export const BREADCRUMB_SCHEMA = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const FAQ_SCHEMA = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
```

**Create Schema Component:**
```javascript
// /app/frontend/src/components/StructuredData.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
```

**Add to Pages:**
```javascript
// Home.jsx
import StructuredData from '../components/StructuredData';
import { LOCAL_BUSINESS_SCHEMA_EASTEND, LOCAL_BUSINESS_SCHEMA_WESTEND } from '../utils/structuredData';

function Home() {
  return (
    <>
      <SEO {...getPageSEO('home')} />
      <StructuredData data={LOCAL_BUSINESS_SCHEMA_EASTEND} />
      <StructuredData data={LOCAL_BUSINESS_SCHEMA_WESTEND} />
      {/* Page content */}
    </>
  );
}

// Tanning.jsx
import { TANNING_SERVICE_SCHEMA, BREADCRUMB_SCHEMA } from '../utils/structuredData';

function Tanning() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://tan-laundry.preview.emergentagent.com/' },
    { name: 'Tanning', url: 'https://tan-laundry.preview.emergentagent.com/tanning' }
  ];
  
  return (
    <>
      <SEO {...getPageSEO('tanning')} />
      <StructuredData data={TANNING_SERVICE_SCHEMA} />
      <StructuredData data={BREADCRUMB_SCHEMA(breadcrumbs)} />
      {/* Page content */}
    </>
  );
}
```

#### Task 4.3: Performance Optimization
**Image Optimization:**

1. **Convert images to WebP:**
```bash
# Install imagemagick if needed
# Convert all images to WebP
for img in /app/frontend/public/images/*.{jpg,png}; do
  convert "$img" "${img%.*}.webp"
done
```

2. **Add lazy loading to all images:**
```javascript
// Update all <img> tags
<img 
  src={imageUrl} 
  alt={altText} 
  loading="lazy"
  decoding="async"
  className="..."
/>
```

3. **Implement responsive images:**
```javascript
<picture>
  <source 
    srcSet="/images/hero-mobile.webp" 
    media="(max-width: 768px)" 
    type="image/webp"
  />
  <source 
    srcSet="/images/hero-desktop.webp" 
    media="(min-width: 769px)" 
    type="image/webp"
  />
  <img 
    src="/images/hero-desktop.jpg" 
    alt="Hero" 
    loading="lazy"
  />
</picture>
```

**Code Splitting:**

Update `/app/frontend/src/App.js`:
```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Eager load critical pages
import Home from './pages/Home';
import Tanning from './pages/Tanning';

// Lazy load admin and heavy components
const Admin = lazy(() => import('./pages/Admin'));
const MaryWellChat = lazy(() => import('./components/MaryWellChat'));
const Receipt = lazy(() => import('./pages/Receipt'));
const Blog = lazy(() => import('./pages/Blog'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tanning" element={<Tanning />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/receipt/:sessionId" element={<Receipt />} />
          <Route path="/blog" element={<Blog />} />
          {/* Other routes */}
        </Routes>
      </Suspense>
      
      {/* Global components */}
      <Suspense fallback={null}>
        <MaryWellChat />
      </Suspense>
    </Router>
  );
}
```

**Bundle Optimization:**

1. **Remove unused dependencies:**
```bash
cd /app/frontend
yarn remove [any unused packages]
```

2. **Analyze bundle size:**
```bash
yarn add --dev webpack-bundle-analyzer
# Add to craco.config.js for analysis
```

3. **Enable production optimizations:**
Update `/app/frontend/craco.config.js`:
```javascript
module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Enable tree shaking
        webpackConfig.optimization.usedExports = true;
        
        // Split chunks
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        };
      }
      return webpackConfig;
    }
  }
};
```

**Lighthouse Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

#### Task 4.4: Sitemap and Robots.txt
**Backend:**

Create `/app/backend/seo_routes.py`:
```python
from fastapi import APIRouter, Response
from datetime import datetime
import xml.etree.ElementTree as ET

router = APIRouter()

@router.get("/sitemap.xml", response_class=Response)
async def generate_sitemap():
    """Generate dynamic XML sitemap"""
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    base_url = "https://tan-laundry.preview.emergentagent.com"
    
    # Static pages
    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "weekly"},
        {"loc": "/tanning", "priority": "0.9", "changefreq": "weekly"},
        {"loc": "/laundry", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/drinks", "priority": "0.8", "changefreq": "weekly"},
        {"loc": "/locations", "priority": "0.9", "changefreq": "monthly"},
        {"loc": "/blog", "priority": "0.7", "changefreq": "daily"},
    ]
    
    for page in static_pages:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{base_url}{page['loc']}"
        ET.SubElement(url, "priority").text = page['priority']
        ET.SubElement(url, "changefreq").text = page['changefreq']
        ET.SubElement(url, "lastmod").text = datetime.now().strftime("%Y-%m-%d")
    
    # Dynamic blog posts
    blog_posts = await db.blog_posts.find({"published": True}).to_list(length=100)
    for post in blog_posts:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{base_url}/blog/{post['slug']}"
        ET.SubElement(url, "priority").text = "0.6"
        ET.SubElement(url, "changefreq").text = "monthly"
        ET.SubElement(url, "lastmod").text = post['published_at'].strftime("%Y-%m-%d")
    
    xml_string = ET.tostring(urlset, encoding='unicode', method='xml')
    xml_declaration = '<?xml version="1.0" encoding="UTF-8"?>\n'
    
    return Response(
        content=xml_declaration + xml_string,
        media_type="application/xml"
    )

@router.get("/robots.txt", response_class=Response)
async def robots_txt():
    """Serve robots.txt"""
    content = """User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /receipt/

Sitemap: https://tan-laundry.preview.emergentagent.com/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1
"""
    return Response(content=content, media_type="text/plain")
```

**Wire Up Routes:**
Update `/app/backend/server.py`:
```python
from backend.seo_routes import router as seo_router
app.include_router(seo_router)
```

#### Task 4.5: Analytics Integration
**Google Analytics 4:**

Add to `/app/frontend/public/index.html` (before closing `</head>`):
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': false // We'll track manually for SPA
  });
</script>
```

**Track Page Views in React:**
```javascript
// /app/frontend/src/utils/analytics.js
export const trackPageView = (path, title) => {
  if (window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title
    });
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackConversion = (conversionType, value, currency = 'USD') => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'G-XXXXXXXXXX',
      value: value,
      currency: currency,
      transaction_id: `${conversionType}_${Date.now()}`
    });
  }
};
```

**Use in App.js:**
```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);
  
  return (
    // App content
  );
}
```

**Track Conversions:**
```javascript
// In checkout success
trackConversion('purchase', amount);
trackEvent('purchase', {
  transaction_id: sessionId,
  value: amount,
  currency: 'USD',
  items: [{ item_name: packageName, price: amount }]
});

// In booking
trackEvent('begin_checkout', {
  items: [{ item_name: serviceName }]
});

// In chat start
trackEvent('chat_started');

// In discount applied
trackEvent('discount_applied', {
  discount_percentage: percentage
});
```

**Google Search Console:**
- Verify domain ownership (add meta tag or DNS record)
- Submit sitemap URL: `https://tan-laundry.preview.emergentagent.com/sitemap.xml`
- Monitor search performance and indexing status

### Success Criteria (Phase 4)
- ✅ All pages have unique, optimized meta tags
- ✅ Structured data validates in Google Rich Results Test
- ✅ Lighthouse scores: Performance 90+, Accessibility 95+, SEO 100
- ✅ Sitemap generated and accessible at /sitemap.xml
- ✅ Robots.txt configured correctly
- ✅ Google Analytics tracking all key conversions
- ✅ Images optimized and lazy-loaded
- ✅ Code splitting implemented for heavy components
- ✅ Bundle size reduced by 30%+

---

## Phase 5: Comprehensive Automated Testing (Status: Not Started) 🧪

### Objectives
1. **Backend Tests**: Unit tests for all API routes, integration tests for workflows
2. **Frontend Tests**: Component tests, E2E tests for critical user flows
3. **Test Coverage**: Minimum 80% code coverage
4. **Bug Fixing**: Systematic resolution of all test failures
5. **Test Reports**: Detailed reports with screenshots and logs

### Implementation Steps

#### Task 5.1: Call Testing Agent
**Prepare Comprehensive Test Specification:**

```json
{
  "original_problem_statement_and_user_choices_inputs": "Build a production-ready autonomous AI marketing system for Eastend Tanning & Laundry that handles lead generation, booking, payments, chat support, analytics, role-based access control, social media integrations, and SEO optimization. User chose: Emergent LLM key for AI, Stripe for payments, MongoDB database, FastAPI + React stack.",
  
  "features_or_bugs_to_test": [
    "Phase 1 - Critical Fixes:",
    "1. Discount expiry logic: 15%=1day, 10%=3days, 5%=7days",
    "2. Discount codes hidden in UI, auto-applied at checkout",
    "3. First-time discount popup appears after 5 seconds for new visitors",
    "4. Fizze Admin tab CRUD operations (create, edit, delete, toggle availability)",
    "5. Checkout automatically applies active discounts without manual code entry",
    
    "Phase 2 - Role-Based Access:",
    "6. Owner has full access to all features including User Management",
    "7. Admin can access most features but NOT financial reports or user management",
    "8. Marketing associate can only access campaigns, blog, social media, analytics (no revenue)",
    "9. Sales associate can only access leads, bookings, and generate 5% discounts (NOT 10% or 15%)",
    "10. Admin dashboard shows only permitted tabs per role",
    "11. API routes reject unauthorized access with 403 errors",
    "12. User management UI allows owner to create/edit/deactivate staff accounts",
    
    "Phase 3 - Social Media:",
    "13. Facebook webhook receives and processes lead form submissions",
    "14. Instagram DMs route to Mary Well AI for automated responses",
    "15. TikTok lead forms create leads in MongoDB with source='tiktok'",
    "16. Social media post scheduling works for all 3 platforms",
    "17. Unified analytics dashboard shows data from all platforms",
    "18. Facebook Pixel tracks conversions correctly",
    
    "Phase 4 - SEO:",
    "19. All pages have unique meta tags (title, description, OG tags)",
    "20. Structured data (JSON-LD) validates in Google Rich Results Test",
    "21. Images lazy-load correctly",
    "22. Sitemap.xml generates all pages including blog posts",
    "23. Robots.txt configured correctly (allow /, disallow /admin, /api/)",
    "24. Google Analytics tracks page views and conversions",
    "25. Lighthouse scores: Performance 90+, SEO 100",
    
    "Existing Features:",
    "26. Tanning page emphasizes Monthly/VIP packages over single sessions",
    "27. Enhanced lotions catalog with online purchase and pickup instructions",
    "28. Purchase receipt system displays activation instructions",
    "29. Fizze drinks menu displays dynamically from backend",
    "30. Coming Soon voting system works with rate limiting",
    "31. Mary Well chat generates discounts and applies them automatically",
    "32. Payment flow: checkout → Stripe → receipt → activation tracking",
    "33. Admin voice calls tab displays call records",
    "34. Blog scheduler posts every 2 days",
    "35. Marketing worker processes scheduled campaigns"
  ],
  
  "files_of_reference": [
    "/app/backend/discount_routes.py",
    "/app/backend/fizze_routes.py",
    "/app/backend/roles.py",
    "/app/backend/user_routes.py",
    "/app/backend/auth.py",
    "/app/backend/social/facebook_routes.py",
    "/app/backend/social/instagram_routes.py",
    "/app/backend/social/tiktok_routes.py",
    "/app/backend/seo_routes.py",
    "/app/backend/receipt_routes.py",
    "/app/backend/mary_well.py",
    "/app/frontend/src/components/FirstTimeDiscountPopup.jsx",
    "/app/frontend/src/components/SEO.jsx",
    "/app/frontend/src/pages/Admin.jsx",
    "/app/frontend/src/pages/Tanning.jsx",
    "/app/frontend/src/pages/Drinks.jsx",
    "/app/frontend/src/pages/Receipt.jsx",
    "/app/frontend/src/utils/permissions.js",
    "/app/frontend/src/utils/seo.js",
    "/app/frontend/src/utils/structuredData.js"
  ],
  
  "required_credentials": [
    "Emergent LLM key (already configured)",
    "Stripe test keys (already configured)",
    "MongoDB connection (already configured)",
    "Facebook App ID and Secret (to be mocked if not provided)",
    "Instagram Business Account ID and Token (to be mocked if not provided)",
    "TikTok App ID and Secret (to be mocked if not provided)",
    "Google Analytics ID (to be mocked if not provided)"
  ],
  
  "testing_type": "both (comprehensive backend and frontend testing)",
  
  "agent_to_agent_context_note": {
    "description": "This is final launch-ready testing. All 6 phases have been implemented: Phase 1 (critical fixes), Phase 2 (role-based access), Phase 3 (social media integrations), Phase 4 (SEO optimization), Phase 5 (testing), Phase 6 (production prep). Test ALL features thoroughly including new role-based permissions, social media webhooks, SEO meta tags, and discount auto-apply logic. Previous sessions completed Fizze backend, receipt system, and enhanced UI. Focus on integration testing across all systems."
  },
  
  "mocked_api": {
    "has_mocked_apis": true,
    "mocked_apis_list": [
      "Facebook API (until credentials provided - mock lead capture and webhook verification)",
      "Instagram API (until credentials provided - mock DM handling and post scheduling)",
      "TikTok API (until credentials provided - mock lead forms and analytics)",
      "Vapi voice calls (already in mock mode)",
      "SendGrid email (credentials not provided - expected warnings)",
      "Twilio SMS (credentials not provided - expected warnings)"
    ]
  }
}
```

#### Task 5.2: Review Test Report and Fix Bugs
**Process:**
1. Wait for testing agent to complete and generate `/app/test_reports/iteration_final.json`
2. Read test report thoroughly:
   ```bash
   cat /app/test_reports/iteration_final.json | jq '.'
   ```
3. Create TODO list from test report:
   - High priority bugs (blocking, security, data loss)
   - Medium priority bugs (functional issues, UI inconsistencies)
   - Low priority bugs (minor polish, edge cases)
4. Fix bugs systematically from high to low priority
5. Re-run testing agent after fixes to verify
6. Repeat until all tests pass

**Bug Fix Workflow:**
```
For each bug:
1. Understand the issue (read test report description)
2. Locate the problematic code (use grep, view files)
3. Implement fix (use search_replace or multi_search_replace)
4. Test fix locally (curl for backend, screenshot for frontend)
5. Mark as resolved in TODO
6. Move to next bug
```

**Expected Bug Categories:**
- Permission errors (role checks not working)
- Missing routes (social media endpoints)
- UI rendering issues (role-based tab visibility)
- Discount logic errors (expiry calculation)
- SEO validation failures (missing meta tags)
- Performance issues (images not lazy-loading)

#### Task 5.3: Achieve 100% Test Pass Rate
**Goal:** All tests passing, zero high-priority bugs

**Verification Steps:**
1. Backend health check: `curl https://tan-laundry.preview.emergentagent.com/health`
2. Frontend build: `cd /app/frontend && yarn build` (no errors)
3. Supervisor status: All services running
4. Test report: 100% pass rate
5. Screenshots: All pages render correctly
6. Lighthouse audit: Scores meet targets

### Success Criteria (Phase 5)
- ✅ Testing agent called with comprehensive spec
- ✅ Test report reviewed and all bugs documented
- ✅ All high-priority bugs fixed and verified
- ✅ All medium-priority bugs fixed
- ✅ Low-priority bugs fixed or documented for future
- ✅ 100% test pass rate achieved
- ✅ No console errors in frontend
- ✅ No errors in backend logs
- ✅ All features working as expected

---

## Phase 6: Supervisor Readiness & Production Prep (Status: Not Started) 🚀

### Objectives
1. **Supervisor Configuration**: Ensure all services auto-restart on failure
2. **Environment Variables**: Document all required vars for production
3. **Health Checks**: Add comprehensive health monitoring
4. **Documentation**: Complete deployment guide and runbook
5. **Production Checklist**: Final verification before go-live

### Implementation Steps

#### Task 6.1: Supervisor Configuration
**Verify Supervisor Config:**
```bash
# Check supervisor status
supervisorctl status

# View supervisor config
cat /etc/supervisor/conf.d/backend.conf
cat /etc/supervisor/conf.d/frontend.conf
```

**Ensure Auto-Restart:**
Both configs should have:
```ini
[program:backend]
command=uvicorn server:app --host 0.0.0.0 --port 8001
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log
```

**Add Health Check Service:**
Create `/app/backend/health_routes.py`:
```python
from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health")
async def health_check():
    """Overall system health"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "backend": "running",
            "database": "connected",
            "ai": "available"
        }
    }

@router.get("/health/db")
async def database_health():
    """Check MongoDB connection"""
    try:
        # Attempt to ping database
        await db.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(500, f"Database connection failed: {str(e)}")

@router.get("/health/stripe")
async def stripe_health():
    """Verify Stripe API key"""
    import stripe
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    
    try:
        # Test Stripe connection
        stripe.Account.retrieve()
        return {
            "status": "healthy",
            "stripe": "connected",
            "mode": "test" if "test" in stripe.api_key else "live"
        }
    except Exception as e:
        raise HTTPException(500, f"Stripe connection failed: {str(e)}")

@router.get("/health/llm")
async def llm_health():
    """Test Emergent LLM connection"""
    try:
        # Quick test call to LLM
        from emergentintegrations import EmergentIntegrations
        ei = EmergentIntegrations()
        response = ei.chat([{"role": "user", "content": "test"}], max_tokens=5)
        return {
            "status": "healthy",
            "llm": "available",
            "provider": "emergent"
        }
    except Exception as e:
        raise HTTPException(500, f"LLM connection failed: {str(e)}")
```

**Wire Up Health Routes:**
```python
# In server.py
from backend.health_routes import router as health_router
app.include_router(health_router)
```

#### Task 6.2: Environment Variables Documentation
**Create `/app/.env.example`:**
```bash
# =============================================================================
# EASTEND TANNING & LAUNDRY - ENVIRONMENT VARIABLES
# =============================================================================

# -----------------------------------------------------------------------------
# DATABASE
# -----------------------------------------------------------------------------
MONGO_URL=mongodb://localhost:27017/eastend_tanning

# -----------------------------------------------------------------------------
# BACKEND
# -----------------------------------------------------------------------------
BACKEND_URL=http://localhost:8001
JWT_SECRET=your_jwt_secret_here_minimum_32_characters

# -----------------------------------------------------------------------------
# STRIPE PAYMENTS (Production)
# -----------------------------------------------------------------------------
# Switch to live keys for production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Test keys (for development)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_test_...

# -----------------------------------------------------------------------------
# AI / LLM
# -----------------------------------------------------------------------------
# Emergent LLM key is auto-provided, no manual configuration needed
EMERGENT_LLM_KEY=auto_provided

# -----------------------------------------------------------------------------
# EMAIL & SMS
# -----------------------------------------------------------------------------
SENDGRID_API_KEY=SG.your_sendgrid_key_here
SENDGRID_FROM_EMAIL=noreply@eastendtanning.com
SENDGRID_FROM_NAME=Eastend Tanning & Laundry

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+12345678900

# -----------------------------------------------------------------------------
# VOICE CALLS
# -----------------------------------------------------------------------------
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id

# -----------------------------------------------------------------------------
# SOCIAL MEDIA (Phase 3)
# -----------------------------------------------------------------------------
# Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_long_lived_page_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_VERIFY_TOKEN=random_string_for_webhook_verification

# Instagram (uses Facebook Graph API)
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# TikTok
TIKTOK_APP_ID=your_tiktok_app_id
TIKTOK_APP_SECRET=your_tiktok_app_secret
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# -----------------------------------------------------------------------------
# ANALYTICS
# -----------------------------------------------------------------------------
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
FACEBOOK_PIXEL_ID=your_facebook_pixel_id

# -----------------------------------------------------------------------------
# FRONTEND
# -----------------------------------------------------------------------------
REACT_APP_BACKEND_URL=http://localhost:8001
# For production: REACT_APP_BACKEND_URL=https://your-domain.com

# -----------------------------------------------------------------------------
# SECURITY
# -----------------------------------------------------------------------------
# Generate strong secret: python -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET=your_super_secure_jwt_secret_here

# -----------------------------------------------------------------------------
# OPTIONAL: CUSTOM DOMAIN
# -----------------------------------------------------------------------------
# DOMAIN=eastendtanning.com
# SSL_CERT_PATH=/etc/ssl/certs/eastend.crt
# SSL_KEY_PATH=/etc/ssl/private/eastend.key
```

**Create Production Checklist:**
Create `/app/PRODUCTION_CHECKLIST.md`:
```markdown
# Production Deployment Checklist

## Pre-Deployment (Complete Before Go-Live)

### 1. Environment Variables
- [ ] Generate strong JWT_SECRET (minimum 32 characters)
- [ ] Update Stripe keys from test to live mode
- [ ] Configure SendGrid domain authentication
- [ ] Set up Twilio phone number and verify
- [ ] Obtain Vapi API key for voice calls
- [ ] Connect Facebook Business account and get tokens
- [ ] Connect Instagram Business account
- [ ] Connect TikTok Business Center
- [ ] Set up Google Analytics property
- [ ] Update REACT_APP_BACKEND_URL to production domain

### 2. Database
- [ ] Create production MongoDB database
- [ ] Set up database user with appropriate permissions
- [ ] Configure connection string with authentication
- [ ] Enable MongoDB backups (daily)
- [ ] Test database connection from backend

### 3. External Services
- [ ] Stripe: Switch to live mode, test webhook
- [ ] SendGrid: Verify domain, test email delivery
- [ ] Twilio: Test SMS sending
- [ ] Vapi: Test voice call flow
- [ ] Facebook: Verify webhook, test lead capture
- [ ] Instagram: Verify webhook, test DM automation
- [ ] TikTok: Verify webhook, test lead forms

### 4. Security
- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL for custom domain
- [ ] Configure CORS for production domain only
- [ ] Review and update rate limiting rules
- [ ] Enable security headers (HSTS, CSP)
- [ ] Scan for vulnerabilities (npm audit, pip check)

### 5. Performance
- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Optimize images (convert to WebP, compress)
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets (optional)
- [ ] Test page load times (<2 seconds)

### 6. Monitoring
- [ ] Set up error alerting (email/SMS for critical errors)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Test health check endpoints
- [ ] Configure database backup alerts

### 7. Documentation
- [ ] Update README with production setup
- [ ] Document all environment variables
- [ ] Create runbook for common operations
- [ ] Document rollback procedure
- [ ] Train staff on admin dashboard

### 8. Testing
- [ ] Run full test suite (100% pass rate)
- [ ] Test all user flows end-to-end
- [ ] Test role-based access with all 4 roles
- [ ] Test payment flow with real cards
- [ ] Test social media integrations
- [ ] Test on mobile devices (iOS + Android)

### 9. Data Migration
- [ ] Seed initial data (services, packages, lotions)
- [ ] Import existing customer data (if any)
- [ ] Set up initial admin/owner account
- [ ] Create staff accounts with appropriate roles

### 10. DNS & Domain
- [ ] Configure DNS records for custom domain
- [ ] Set up SSL certificate
- [ ] Test domain resolution
- [ ] Configure www redirect
- [ ] Submit sitemap to Google Search Console

## Deployment Day

### 1. Final Checks
- [ ] All services running and healthy
- [ ] Database backups configured and tested
- [ ] All environment variables set correctly
- [ ] Supervisor auto-restart enabled
- [ ] Health checks passing

### 2. Go-Live
- [ ] Deploy to production server
- [ ] Update DNS to point to production
- [ ] Verify SSL certificate active
- [ ] Test all critical flows
- [ ] Monitor logs for errors

### 3. Post-Deployment
- [ ] Send test lead through each social platform
- [ ] Complete test purchase
- [ ] Verify email/SMS notifications
- [ ] Check analytics tracking
- [ ] Monitor error rates for 24 hours

## Post-Launch (First Week)

### 1. Monitoring
- [ ] Check error logs daily
- [ ] Monitor conversion rates
- [ ] Review social media lead quality
- [ ] Check database performance
- [ ] Verify backup completion

### 2. Optimization
- [ ] Review Lighthouse scores
- [ ] Analyze user behavior (Google Analytics)
- [ ] Optimize slow API endpoints
- [ ] Adjust rate limits if needed
- [ ] Fine-tune Mary Well AI responses

### 3. Support
- [ ] Train staff on admin dashboard
- [ ] Document common issues and solutions
- [ ] Set up support ticketing system
- [ ] Create FAQ for customers
- [ ] Monitor customer feedback

## Emergency Contacts
- **Developer**: [Your contact info]
- **Hosting Provider**: [Support contact]
- **Stripe Support**: https://support.stripe.com
- **SendGrid Support**: https://support.sendgrid.com
- **Twilio Support**: https://support.twilio.com

## Rollback Procedure
If critical issues arise:
1. Revert DNS to old system (if applicable)
2. Restore database from latest backup
3. Redeploy previous stable version
4. Notify users of temporary downtime
5. Investigate and fix issue before re-deployment
```

#### Task 6.3: Documentation
**Update `/app/README.md`:**
```markdown
# Eastend Tanning & Laundry - Autonomous AI Marketing System

## Overview
Production-ready autonomous AI marketing system for Eastend Tanning & Laundry featuring lead generation, booking management, payment processing, AI chat support, role-based access control, social media integrations, and SEO optimization.

## Tech Stack
- **Backend**: FastAPI (Python 3.11)
- **Frontend**: React 18
- **Database**: MongoDB
- **AI**: Emergent LLM (GPT-4o + Claude Sonnet 4)
- **Payments**: Stripe
- **Email**: SendGrid
- **SMS**: Twilio
- **Voice**: Vapi
- **Social Media**: Facebook, Instagram, TikTok APIs

## Features
- ✅ Lead generation and management
- ✅ Automated booking system
- ✅ Stripe payment processing
- ✅ AI chat support (Mary Well)
- ✅ Role-based access control (Owner, Admin, Marketing, Sales)
- ✅ Social media integrations (Facebook, Instagram, TikTok)
- ✅ Automated blog posting
- ✅ Email/SMS marketing campaigns
- ✅ Fizze drinks menu management
- ✅ Purchase receipt and activation system
- ✅ First-time discount popup
- ✅ SEO optimization (meta tags, structured data, sitemap)
- ✅ Analytics dashboard

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB 6.0+
- Yarn package manager

### Installation

1. **Clone repository** (if applicable)

2. **Backend Setup**
```bash
cd /app/backend
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd /app/frontend
yarn install
```

4. **Environment Variables**
Copy `.env.example` to `.env` and fill in required values:
```bash
cp .env.example .env
# Edit .env with your credentials
```

5. **Database Setup**
```bash
# MongoDB should be running on default port 27017
# Seed Fizze drinks data
cd /app/backend
python seed_fizze.py
```

6. **Start Services**
```bash
# Using supervisor (recommended)
supervisorctl start backend
supervisorctl start frontend

# Or manually
# Backend
cd /app/backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd /app/frontend && yarn start
```

7. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## Testing

### Backend Tests
```bash
cd /app/backend
pytest tests/ --cov=. --cov-report=html
```

### Frontend Tests
```bash
cd /app/frontend
yarn test --coverage
```

### E2E Tests
```bash
# Use testing agent (see TESTING.md)
```

## Deployment
See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for detailed deployment guide.

## Project Structure
```
/app/
├── backend/
│   ├── server.py              # Main FastAPI app
│   ├── routes.py              # Core routes (leads, bookings)
│   ├── auth.py                # JWT authentication
│   ├── roles.py               # Role-based permissions
│   ├── user_routes.py         # User management (owner only)
│   ├── discount_routes.py     # Discount generation
│   ├── fizze_routes.py        # Fizze drinks CRUD
│   ├── receipt_routes.py      # Purchase receipts
│   ├── payment_routes.py      # Stripe integration
│   ├── chat_routes.py         # Mary Well chat
│   ├── mary_well.py           # AI chat logic
│   ├── seo_routes.py          # Sitemap, robots.txt
│   ├── health_routes.py       # Health checks
│   ├── social/
│   │   ├── facebook_routes.py # Facebook integration
│   │   ├── instagram_routes.py# Instagram integration
│   │   └── tiktok_routes.py   # TikTok integration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── SEO.jsx
│   │   │   ├── StructuredData.jsx
│   │   │   ├── FirstTimeDiscountPopup.jsx
│   │   │   ├── MaryWellChat.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Tanning.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── ...
│   │   └── utils/
│   │       ├── permissions.js
│   │       ├── seo.js
│   │       ├── structuredData.js
│   │       └── analytics.js
│   └── package.json
└── tests/
    ├── backend/
    └── frontend/
```

## User Roles

### Owner
- Full system access
- User management
- Financial reports
- System configuration

### Admin
- Leads, bookings, campaigns
- Blog and content
- Product management
- Analytics (non-financial)

### Marketing Associate
- Campaigns and blog only
- Social media management
- Engagement analytics

### Sales Associate
- Leads and bookings only
- 5% discount generation only
- Customer journey analytics

## API Documentation
Interactive API docs available at: http://localhost:8001/docs

## Support
For issues or questions, contact: [Your contact info]

## License
Proprietary - Eastend Tanning & Laundry
```

**Create `/app/RUNBOOK.md`:**
```markdown
# Eastend Tanning & Laundry - Operations Runbook

## Common Operations

### Restart Services
```bash
# Restart backend
supervisorctl restart backend

# Restart frontend
supervisorctl restart frontend

# Restart all
supervisorctl restart all

# Check status
supervisorctl status
```

### View Logs
```bash
# Backend logs (last 100 lines)
tail -n 100 /var/log/supervisor/backend.out.log
tail -n 100 /var/log/supervisor/backend.err.log

# Frontend logs
tail -n 100 /var/log/supervisor/frontend.out.log
tail -n 100 /var/log/supervisor/frontend.err.log

# Follow logs in real-time
tail -f /var/log/supervisor/backend.err.log
```

### Database Operations
```bash
# Connect to MongoDB
mongosh $MONGO_URL

# Backup database
mongodump --uri="$MONGO_URL" --out="/app/backups/backup_$(date +%Y%m%d_%H%M%S)"

# Restore database
mongorestore --uri="$MONGO_URL" /app/backups/backup_YYYYMMDD_HHMMSS
```

### Clear Cache/Reset
```bash
# Clear frontend build cache
cd /app/frontend && rm -rf node_modules/.cache

# Clear Python cache
cd /app/backend && find . -type d -name __pycache__ -exec rm -rf {} +

# Reset localStorage (user-side)
# Open browser console: localStorage.clear()
```

## Troubleshooting

### Backend Not Starting
1. Check logs: `tail -n 50 /var/log/supervisor/backend.err.log`
2. Common issues:
   - Missing environment variables → Check `/app/backend/.env`
   - Port 8001 already in use → `lsof -i :8001` and kill process
   - Database connection failed → Verify MONGO_URL
   - Import errors → `pip install -r requirements.txt`

### Frontend Not Loading
1. Check logs: `tail -n 50 /var/log/supervisor/frontend.err.log`
2. Common issues:
   - Build errors → `cd /app/frontend && yarn build`
   - Port 3000 in use → Kill process on port 3000
   - Missing dependencies → `yarn install`
   - REACT_APP_BACKEND_URL incorrect → Check `.env`

### Payments Failing
1. Check Stripe dashboard for errors
2. Verify webhook is receiving events:
   ```bash
   curl https://tan-laundry.preview.emergentagent.com/api/payments/webhook
   ```
3. Check Stripe keys are correct (test vs live)
4. Verify webhook secret matches Stripe dashboard

### Discounts Not Applying
1. Check discount expiry: Query MongoDB `discounts` collection
2. Verify lead_id or session_id is being passed
3. Check discount logic in `/app/backend/discount_routes.py`
4. Test endpoint: `curl -X POST .../api/discounts/active?session_id=test`

### Social Media Webhooks Not Working
1. Verify webhook URLs in platform settings
2. Check webhook verification logic
3. Test webhook: Use platform's test event feature
4. Check logs for incoming webhook requests
5. Verify tokens/secrets are correct

### Mary Well Chat Not Responding
1. Check Emergent LLM key is set
2. Test LLM connection: `curl https://tan-laundry.preview.emergentagent.com/health/llm`
3. Check rate limiting (may be temporary)
4. Review chat logs in MongoDB `chat_sessions` collection

### Role-Based Access Not Working
1. Verify JWT token contains role field
2. Check user's role in database: `db.users.findOne({email: "user@example.com"})`
3. Test permission check: Review `/app/backend/roles.py`
4. Clear browser localStorage and re-login

## Maintenance Tasks

### Weekly
- [ ] Review error logs for patterns
- [ ] Check database backup completion
- [ ] Monitor disk space usage
- [ ] Review analytics for anomalies

### Monthly
- [ ] Update dependencies (security patches)
- [ ] Review and optimize slow API endpoints
- [ ] Clean up old logs (keep last 30 days)
- [ ] Review and update blog content
- [ ] Audit user accounts and roles

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Update documentation
- [ ] Review and optimize database indexes

## Emergency Procedures

### System Down
1. Check supervisor status: `supervisorctl status`
2. Restart all services: `supervisorctl restart all`
3. If still down, check logs for errors
4. Verify database is running: `mongosh $MONGO_URL`
5. Check disk space: `df -h`
6. Contact developer if unresolved

### Data Loss
1. Stop all services immediately
2. Do NOT make changes to database
3. Restore from latest backup:
   ```bash
   mongorestore --uri="$MONGO_URL" /app/backups/latest
   ```
4. Verify data integrity
5. Restart services
6. Investigate cause

### Security Breach
1. Immediately change all passwords and API keys
2. Review access logs for unauthorized access
3. Check database for suspicious changes
4. Rotate JWT secret (will log out all users)
5. Review and patch vulnerability
6. Notify affected users if necessary

## Monitoring Checklist

### Daily
- [ ] Check error rates in logs
- [ ] Verify scheduled tasks ran (blog posts, campaigns)
- [ ] Check payment processing (any failures?)
- [ ] Review social media lead quality

### Weekly
- [ ] Review analytics dashboard
- [ ] Check conversion rates
- [ ] Monitor API response times
- [ ] Review customer feedback

## Contact Information
- **Developer**: [Your contact]
- **Hosting**: [Provider support]
- **Stripe**: https://support.stripe.com
- **SendGrid**: https://support.sendgrid.com
- **Twilio**: https://support.twilio.com
- **Emergency**: [Emergency contact]
```

### Success Criteria (Phase 6)
- ✅ All services configured for auto-restart
- ✅ Health check endpoints working and tested
- ✅ Environment variables documented with examples
- ✅ Production checklist complete and reviewed
- ✅ README updated with setup instructions
- ✅ Runbook created for common operations
- ✅ Supervisor logs configured and rotating
- ✅ System ready for production deployment

---

## Final Launch Readiness Checklist

### Technical Readiness
- [ ] All 6 phases completed (Critical Fixes, Roles, Social Media, SEO, Testing, Production Prep)
- [ ] 100% test pass rate achieved
- [ ] Zero high-priority bugs remaining
- [ ] All services running stable for 24 hours
- [ ] Lighthouse scores: Performance 90+, SEO 100
- [ ] Health checks passing for all services

### Content Readiness
- [ ] All pages have SEO-optimized content
- [ ] Images optimized and compressed
- [ ] Meta tags unique for each page
- [ ] Structured data validates
- [ ] Sitemap generated and submitted

### Security Readiness
- [ ] All passwords changed from defaults
- [ ] JWT secret is strong and unique
- [ ] Role-based access tested thoroughly
- [ ] API rate limiting configured
- [ ] HTTPS/SSL configured (production)

### Integration Readiness
- [ ] Stripe test mode working, live keys ready
- [ ] SendGrid domain verified
- [ ] Twilio phone number configured
- [ ] Facebook webhook verified
- [ ] Instagram webhook verified
- [ ] TikTok webhook verified
- [ ] Google Analytics tracking

### Documentation Readiness
- [ ] README complete
- [ ] PRODUCTION_CHECKLIST reviewed
- [ ] RUNBOOK created
- [ ] Environment variables documented
- [ ] Staff training materials prepared

### Business Readiness
- [ ] Pricing confirmed and set
- [ ] Initial content seeded (services, packages, lotions, drinks)
- [ ] Staff accounts created with roles
- [ ] Payment processing tested
- [ ] Customer support process defined

## Timeline Summary

### Current Session (Estimated 4-5 hours)
1. **Phase 1: Critical Fixes** (30 min)
2. **Phase 2: Role-Based Access** (60 min)
3. **Phase 3: Social Media Integrations** (90 min)
4. **Phase 4: SEO Optimization** (45 min)
5. **Phase 5: Comprehensive Testing** (60 min)
6. **Phase 6: Production Prep** (30 min)
7. **Final Verification** (15 min)

## Success Metrics

### Launch Day KPIs
- System uptime: 99.9%
- Page load time: <2 seconds
- Conversion rate: 5%+
- Zero critical errors

### 30-Day KPIs
- Social media leads: 100/week
- Discount redemption: 20%
- Mary Well response time: <5 min
- Customer satisfaction: 4.5/5 stars

## Risk Mitigation

### Technical Risks
- **Risk**: Social media API rate limits
  - **Mitigation**: Queue system with retry logic
- **Risk**: High traffic overwhelms backend
  - **Mitigation**: Load testing, horizontal scaling plan
- **Risk**: Database corruption
  - **Mitigation**: Daily backups, replica sets

### Business Risks
- **Risk**: Discount abuse
  - **Mitigation**: IP tracking, email verification
- **Risk**: Platform policy violations
  - **Mitigation**: Legal review, compliance monitoring
- **Risk**: Staff resistance to new system
  - **Mitigation**: Training, documentation, support

---

## Next Immediate Actions

**Starting NOW - Executing all 6 phases in sequence:**

1. ✅ Plan updated and confirmed
2. 🚀 Begin Phase 1: Critical Fixes
3. 🚀 Proceed to Phase 2: Role-Based Access
4. 🚀 Implement Phase 3: Social Media Integrations
5. 🚀 Complete Phase 4: SEO Optimization
6. 🚀 Execute Phase 5: Comprehensive Testing
7. 🚀 Finalize Phase 6: Production Prep
8. ✅ Take screenshots and verify all features
9. ✅ Generate final summary
10. 🎉 Launch-ready application delivered!

**Let's execute! Starting with Phase 1 implementation immediately.**
