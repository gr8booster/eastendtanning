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
    cuisine_type: str
    description: str
    address: str

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
    """Food vendor signup"""
    new_vendor = {
        "id": str(uuid.uuid4()),
        **vendor.dict(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_vendors.insert_one(new_vendor)
    return {"status": "success", "message": "Thank you for your interest! We'll contact you within 24 hours."}

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
