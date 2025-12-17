"""
818 EATS - Food Pre-ordering System
Manage African cuisine menu, orders, and vendors
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/api/eats", tags=["818 EATS"])

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.eastend_db

# Pydantic Models
class MenuItem(BaseModel):
    name: str
    description: str
    price: float
    category: str = "African Cuisine"
    image_url: str
    available: bool = True
    prep_time_minutes: int = 60

class FoodOrder(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    items: List[dict]  # [{"menu_item_id": "...", "quantity": 1}]
    eta_hours: int  # 1 or 2 hours
    delivery_address: Optional[str] = None
    delivery_distance_miles: Optional[float] = None
    notes: Optional[str] = None

class VendorSignup(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    email: str
    password: str
    cuisine_type: str
    description: str
    address: str
    license_type: str  # "cottage_food", "food_truck", "health_department"
    license_number: str
    license_file_base64: str  # Base64 encoded file

class VendorMenuItem(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    available: bool = True
    prep_time_minutes: int = 60
    
class MenuItemVote(BaseModel):
    menu_item_id: str
    customer_email: str
    
class ClientSignup(BaseModel):
    email: str
    name: Optional[str] = None
    preferences: Optional[List[str]] = None  # cuisine types

# Helper function to initialize default menu
async def initialize_menu():
    """Create default African cuisine menu if none exists"""
    existing = await db.eats_menu.find_one({})
    if not existing:
        default_items = [
            {
                "id": str(uuid.uuid4()),
                "name": "Ghana Jollof Rice",
                "description": "Authentic West African one-pot rice dish cooked in a rich tomato-based sauce with spices, vegetables, and your choice of protein",
                "price": 20.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxqb2xsb2YlMjByaWNlfGVufDB8fHx8MTc2NTU2MzczOHww&ixlib=rb-4.1.0&q=85",
                "available": True,
                "prep_time_minutes": 60,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Egusi Stew",
                "description": "Traditional Nigerian soup made with ground melon seeds, leafy greens, and aromatic spices. Served with your choice of fufu or rice",
                "price": 20.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1708782344137-21c48d98dfcc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxlZ3VzaSUyMHN0ZXd8ZW58MHx8fHwxNzY1NTYzNzQ1fDA&ixlib=rb-4.1.0&q=85",
                "available": True,
                "prep_time_minutes": 90,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Fried Plantains",
                "description": "Golden-crispy sweet plantains fried to perfection. A classic African side dish that pairs perfectly with any main course",
                "price": 20.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1762884601729-0eeeafbdfb8a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHBsYW50YWluc3xlbnwwfHx8fDE3NjU1NjM3NTF8MA&ixlib=rb-4.1.0&q=85",
                "available": True,
                "prep_time_minutes": 30,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.eats_menu.insert_many(default_items)

# Menu Management
@router.get("/menu")
async def get_menu():
    """Get all menu items"""
    # Initialize menu if empty
    await initialize_menu()
    items = await db.eats_menu.find({}, {"_id": 0}).to_list(None)
    return {"menu": items}

@router.post("/menu")
async def add_menu_item(item: MenuItem):
    """Add new menu item (admin)"""
    new_item = {
        "id": str(uuid.uuid4()),
        **item.dict(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_menu.insert_one(new_item)
    return {"status": "success", "item": new_item}

@router.put("/menu/{item_id}")
async def update_menu_item(item_id: str, item: MenuItem):
    """Update menu item (admin)"""
    result = await db.eats_menu.update_one(
        {"id": item_id},
        {"$set": {**item.dict(), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success"}

@router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str):
    """Delete menu item (admin)"""
    result = await db.eats_menu.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success"}

# Order Management
def calculate_delivery_fee(distance_miles: float, eta_hours: int) -> float:
    """Calculate delivery fee based on distance and ETA (DoorDash-style)"""
    base_fee = 3.99
    per_mile_fee = 1.50
    rush_fee = 2.00 if eta_hours == 1 else 0.00
    
    total_fee = base_fee + (distance_miles * per_mile_fee) + rush_fee
    return round(total_fee, 2)

@router.post("/orders")
async def place_order(order: FoodOrder):
    """Place food pre-order"""
    # Get menu items to calculate subtotal
    menu_items = await db.eats_menu.find({}).to_list(None)
    menu_dict = {item["id"]: item for item in menu_items}
    
    # Calculate order totals
    subtotal = 0
    order_items = []
    for item in order.items:
        menu_item = menu_dict.get(item["menu_item_id"])
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item['menu_item_id']} not found")
        
        item_total = menu_item["price"] * item["quantity"]
        subtotal += item_total
        order_items.append({
            "menu_item_id": item["menu_item_id"],
            "name": menu_item["name"],
            "price": menu_item["price"],
            "quantity": item["quantity"],
            "item_total": item_total
        })
    
    # Calculate delivery fee
    delivery_fee = 0
    if order.delivery_address and order.delivery_distance_miles:
        delivery_fee = calculate_delivery_fee(order.delivery_distance_miles, order.eta_hours)
    
    # Calculate tax (8% assumed)
    tax = round(subtotal * 0.08, 2)
    
    # Total
    total = subtotal + delivery_fee + tax
    
    # Create order
    new_order = {
        "id": str(uuid.uuid4()),
        "order_number": f"818-{str(uuid.uuid4())[:8].upper()}",
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_email": order.customer_email,
        "items": order_items,
        "eta_hours": order.eta_hours,
        "pickup_time": (datetime.now(timezone.utc).timestamp() + (order.eta_hours * 3600)),
        "delivery_address": order.delivery_address,
        "delivery_distance_miles": order.delivery_distance_miles,
        "delivery_fee": delivery_fee,
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "tip": 0,  # Can be added later
        "notes": order.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.eats_orders.insert_one(new_order)
    return {"status": "success", "order": new_order}

@router.post("/orders/{order_id}/tip")
async def add_tip(order_id: str, tip_amount: float):
    """Add tip to order"""
    order = await db.eats_orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    new_total = order["total"] + tip_amount
    
    await db.eats_orders.update_one(
        {"id": order_id},
        {"$set": {"tip": tip_amount, "total": new_total, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"status": "success", "new_total": new_total}

@router.get("/orders")
async def get_orders():
    """Get all orders (admin)"""
    orders = await db.eats_orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(None)
    return {"orders": orders}

@router.get("/orders/{order_id}")
async def get_order(order_id: str):
    """Get specific order"""
    order = await db.eats_orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Update order status (admin)"""
    valid_statuses = ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.eats_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success"}

# Vendor Management
@router.post("/vendors/signup")
async def vendor_signup(vendor: VendorSignup):
    """Food vendor signup with license verification"""
    # Check if vendor already exists
    existing = await db.eats_vendors.find_one({"email": vendor.email})
    if existing:
        raise HTTPException(status_code=400, detail="Vendor with this email already exists")
    
    # Hash password (simple for now - should use bcrypt in production)
    import hashlib
    hashed_password = hashlib.sha256(vendor.password.encode()).hexdigest()
    
    new_vendor = {
        "id": str(uuid.uuid4()),
        "business_name": vendor.business_name,
        "owner_name": vendor.owner_name,
        "phone": vendor.phone,
        "email": vendor.email,
        "password": hashed_password,
        "cuisine_type": vendor.cuisine_type,
        "description": vendor.description,
        "address": vendor.address,
        "license_type": vendor.license_type,
        "license_number": vendor.license_number,
        "license_file": vendor.license_file_base64,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": None
    }
    await db.eats_vendors.insert_one(new_vendor)
    return {
        "status": "success", 
        "message": "Application submitted! Please ensure your food is well-packaged to stay warm and leak-free during long-distance delivery. We'll review your license and contact you within 24-48 hours.",
        "vendor_id": new_vendor["id"]
    }

# Vendor Login & Authentication
@router.post("/vendors/login")
async def vendor_login(email: str, password: str):
    """Vendor login"""
    import hashlib
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    vendor = await db.eats_vendors.find_one({"email": email, "password": hashed_password}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if vendor["status"] != "approved":
        raise HTTPException(status_code=403, detail="Your account is pending approval")
    
    return {"status": "success", "vendor": vendor}

# Vendor Menu Management
@router.post("/vendors/{vendor_id}/menu")
async def vendor_add_menu_item(vendor_id: str, item: VendorMenuItem):
    """Vendor adds their own menu item"""
    # Verify vendor exists and is approved
    vendor = await db.eats_vendors.find_one({"id": vendor_id})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    if vendor["status"] != "approved":
        raise HTTPException(status_code=403, detail="Vendor not approved")
    
    new_item = {
        "id": str(uuid.uuid4()),
        "vendor_id": vendor_id,
        "vendor_name": vendor["business_name"],
        **item.dict(),
        "votes": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_menu.insert_one(new_item)
    return {"status": "success", "item": new_item}

@router.get("/vendors/{vendor_id}/menu")
async def vendor_get_menu(vendor_id: str):
    """Get vendor's menu items"""
    items = await db.eats_menu.find({"vendor_id": vendor_id}, {"_id": 0}).to_list(None)
    return {"menu": items}

@router.put("/vendors/{vendor_id}/menu/{item_id}")
async def vendor_update_menu_item(vendor_id: str, item_id: str, item: VendorMenuItem):
    """Vendor updates their menu item"""
    result = await db.eats_menu.update_one(
        {"id": item_id, "vendor_id": vendor_id},
        {"$set": {**item.dict(), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")
    return {"status": "success"}

@router.delete("/vendors/{vendor_id}/menu/{item_id}")
async def vendor_delete_menu_item(vendor_id: str, item_id: str):
    """Vendor deletes their menu item"""
    result = await db.eats_menu.delete_one({"id": item_id, "vendor_id": vendor_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")
    return {"status": "success"}

# Menu Item Voting
@router.post("/menu/{item_id}/vote")
async def vote_menu_item(item_id: str, vote: MenuItemVote):
    """Vote for unavailable menu item"""
    item = await db.eats_menu.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Check if customer already voted
    existing_vote = await db.menu_votes.find_one({"menu_item_id": item_id, "customer_email": vote.customer_email})
    if existing_vote:
        raise HTTPException(status_code=400, detail="You've already voted for this item")
    
    # Record vote
    await db.menu_votes.insert_one({
        "id": str(uuid.uuid4()),
        "menu_item_id": item_id,
        "customer_email": vote.customer_email,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Increment vote count
    await db.eats_menu.update_one(
        {"id": item_id},
        {"$inc": {"votes": 1}}
    )
    
    return {"status": "success", "message": "Vote recorded! We'll notify the vendor."}

@router.get("/menu/{item_id}/votes")
async def get_menu_item_votes(item_id: str):
    """Get vote count for menu item"""
    item = await db.eats_menu.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"votes": item.get("votes", 0)}

# Client Mailing List
@router.post("/clients/signup")
async def client_signup(client: ClientSignup):
    """Client signs up for menu updates"""
    existing = await db.eats_clients.find_one({"email": client.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_client = {
        "id": str(uuid.uuid4()),
        **client.dict(),
        "subscribed": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_clients.insert_one(new_client)


# Food Blog Integration
@router.post("/blog/create")
async def create_food_blog_post(title: str, content: str, menu_item_id: Optional[str] = None):
    """Create a blog post about food on 818 EATS"""
    new_post = {
        "id": str(uuid.uuid4()),
        "title": title,
        "content": content,
        "category": "food",
        "tags": ["818eats", "food", "african cuisine"],
        "menu_item_id": menu_item_id,
        "author": "818 EATS Team",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "published": True
    }
    
    # Insert into blog_posts collection
    await db.blog_posts.insert_one(new_post)
    return {"status": "success", "post": new_post}

@router.get("/blog/posts")
async def get_food_blog_posts(limit: int = 10):
    """Get food blog posts"""
    posts = await db.blog_posts.find(
        {"category": "food", "published": True},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(None)
    return {"posts": posts}

    return {"status": "success", "message": "You're on the list! We'll notify you of new menu items."}

@router.get("/clients")
async def get_clients():
    """Get all subscribed clients (admin)"""
    clients = await db.eats_clients.find({"subscribed": True}, {"_id": 0}).to_list(None)
    return {"clients": clients}

        "password": hashed_password,
        "cuisine_type": vendor.cuisine_type,
        "description": vendor.description,
        "address": vendor.address,
        "license_type": vendor.license_type,
        "license_number": vendor.license_number,
        "license_file": vendor.license_file_base64,  # Store base64
        "status": "pending",  # pending, approved, rejected
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": None
    }
    await db.eats_vendors.insert_one(new_vendor)
    return {
        "status": "success", 
        "message": "Application submitted! Please ensure your food is well-packaged to stay warm and leak-free during long-distance delivery. We'll review your license and contact you within 24-48 hours.",
        "vendor_id": new_vendor["id"]
    }

@router.get("/vendors")
async def get_vendors():
    """Get all vendors (admin)"""
    vendors = await db.eats_vendors.find({}, {"_id": 0}).to_list(None)
    return {"vendors": vendors}

@router.put("/vendors/{vendor_id}/status")
async def update_vendor_status(vendor_id: str, status: str):
    """Update vendor status (admin)"""
    valid_statuses = ["pending", "approved", "rejected", "active", "inactive"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.eats_vendors.update_one(
        {"id": vendor_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"status": "success"}
