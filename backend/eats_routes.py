"""
818 EATS - Food Pre-ordering System
Weekly batch voting model - customers vote for ONE dish per week
Orders aggregated to reach 40-order threshold before fulfillment
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os
import requests
import base64

router = APIRouter(prefix="/api/eats", tags=["818 EATS"])

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.eastend_db

# PayPal credentials
PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET')
PAYPAL_API_BASE = "https://api-m.paypal.com"  # Production

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
    customer_email: str
    customer_address: str
    menu_item_id: str  # Vote for ONE item
    quantity: int = 1
    delivery_fee: float = 5.99  # Standard delivery fee
    tip: float = 0.00
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

class PayPalOrderRequest(BaseModel):
    order_id: str

# Helper function to initialize default menu with 4 items
async def initialize_menu():
    """Create default African cuisine menu if none exists - 4 dishes at $25"""
    existing = await db.eats_menu.find_one({})
    if not existing:
        default_items = [
            {
                "id": str(uuid.uuid4()),
                "name": "Ghana Jollof Rice",
                "description": "Authentic West African one-pot rice dish cooked in a rich tomato-based sauce with aromatic spices, vegetables, and your choice of protein. A beloved classic!",
                "price": 25.00,
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
                "description": "Traditional Nigerian soup made with ground melon seeds, fresh leafy greens, and aromatic spices. Hearty and flavorful, served with fufu or rice.",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1763048443535-1243379234e2?crop=entropy&cs=srgb&fm=jpg&q=85",
                "available": True,
                "prep_time_minutes": 90,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Suya & Fried Plantains",
                "description": "Nigerian grilled meat skewers (suya) seasoned with spicy peanut blend, paired with perfectly golden fried sweet plantains. A savory-sweet delight!",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1636301175218-6994458a4b0a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw2fHxzdXlhJTIwZ3JpbGxlZCUyMG1lYXR8ZW58MHx8fHwxNzM0NDUyOTUzfDA&ixlib=rb-4.1.0&q=85",
                "available": True,
                "prep_time_minutes": 45,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Waakye",
                "description": "Popular Ghanaian dish of rice and black-eyed peas cooked with millet leaves for a distinctive dark color. Served with shito (spicy pepper sauce) and protein.",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1721314678207-8b7bd43e677b?crop=entropy&cs=srgb&fm=jpg&q=85",
                "available": True,
                "prep_time_minutes": 75,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.eats_menu.insert_many(default_items)

# PayPal Helper
def get_paypal_access_token():
    """Get OAuth 2.0 access token from PayPal"""
    try:
        auth_string = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
        
        headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        data = {"grant_type": "client_credentials"}
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            headers=headers,
            data=data
        )
        
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            raise Exception(f"Failed to get access token: {response.status_code} {response.text}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PayPal auth error: {str(e)}")

# Menu Endpoints
@router.get("/menu")
async def get_menu():
    """Get all menu items - all priced at $25"""
    await initialize_menu()
    items = await db.eats_menu.find({}, {"_id": 0}).to_list(None)
    # Enforce $25 pricing
    for item in items:
        item["price"] = 25.00
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

# Order Management - Weekly Batch System
@router.post("/orders")
async def place_order(order: FoodOrder):
    """Place weekly food pre-order with voting"""
    # Get menu item
    menu_item = await db.eats_menu.find_one({"id": order.menu_item_id})
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Calculate totals server-side
    item_price = 25.00  # Fixed price
    subtotal = item_price * order.quantity
    delivery_fee = 5.99  # Standard delivery fee
    tax = round(subtotal * 0.08, 2)
    tip = max(0, order.tip)  # Ensure non-negative tip
    total = round(subtotal + delivery_fee + tax + tip, 2)
    
    # Get current week number for batch aggregation
    now = datetime.now(timezone.utc)
    week_number = now.isocalendar()[1]
    year = now.year
    batch_id = f"{year}-W{week_number:02d}"
    
    # Count current batch orders
    batch_count = await db.eats_orders.count_documents({"batch_id": batch_id})
    
    # Create order
    new_order = {
        "id": str(uuid.uuid4()),
        "order_number": f"818-{str(uuid.uuid4())[:8].upper()}",
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_email": order.customer_email,
        "customer_address": order.customer_address,
        "menu_item_id": order.menu_item_id,
        "menu_item_name": menu_item["name"],
        "quantity": order.quantity,
        "item_price": item_price,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "tax": tax,
        "tip": tip,
        "total": total,
        "notes": order.notes,
        "batch_id": batch_id,
        "batch_count": batch_count + 1,
        "status": "pending_payment",
        "paid": False,
        "paid_at": None,
        "paypal_order_id": None,
        "paypal_capture_id": None,
        "payer_email": None,
        "delivery_week": batch_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.eats_orders.insert_one(new_order)
    
    # Check if batch reached target
    batch_status = "collecting"
    if batch_count + 1 >= 40:
        batch_status = "ready_for_fulfillment"
    
    return {
        "status": "success", 
        "order": {k: v for k, v in new_order.items() if k != '_id'},
        "batch_info": {
            "batch_id": batch_id,
            "current_orders": batch_count + 1,
            "target_orders": 40,
            "batch_status": batch_status,
            "delivery_week": f"Week {week_number}, {year}"
        },
        "message": "Order placed! Complete payment to confirm. Delivery scheduled once we reach 40 orders."
    }

@router.get("/orders/batch/{batch_id}")
async def get_batch_orders(batch_id: str):
    """Get all orders for a specific batch (admin)"""
    orders = await db.eats_orders.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    
    # Aggregate votes by menu item
    vote_counts = {}
    paid_count = 0
    total_revenue = 0
    for order in orders:
        item_name = order.get("menu_item_name")
        vote_counts[item_name] = vote_counts.get(item_name, 0) + order.get("quantity", 1)
        if order.get("paid"):
            paid_count += 1
            total_revenue += order.get("total", 0)
    
    return {
        "batch_id": batch_id,
        "total_orders": len(orders),
        "paid_orders": paid_count,
        "total_revenue": round(total_revenue, 2),
        "orders": orders,
        "vote_summary": vote_counts,
        "target_reached": len(orders) >= 40
    }

@router.get("/orders/current-batch")
async def get_current_batch_status():
    """Get current week's batch status"""
    now = datetime.now(timezone.utc)
    week_number = now.isocalendar()[1]
    year = now.year
    batch_id = f"{year}-W{week_number:02d}"
    
    batch_count = await db.eats_orders.count_documents({"batch_id": batch_id})
    paid_count = await db.eats_orders.count_documents({"batch_id": batch_id, "paid": True})
    
    # Get vote counts
    orders = await db.eats_orders.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    vote_counts = {}
    for order in orders:
        item_name = order.get("menu_item_name")
        if item_name:
            vote_counts[item_name] = vote_counts.get(item_name, 0) + order.get("quantity", 1)
    
    # Find leading dish
    leading_dish = None
    if vote_counts:
        leading_dish = max(vote_counts, key=vote_counts.get)
    
    return {
        "batch_id": batch_id,
        "week": f"Week {week_number}, {year}",
        "current_orders": batch_count,
        "paid_orders": paid_count,
        "target_orders": 40,
        "progress_percentage": round((batch_count / 40) * 100, 1),
        "status": "ready_for_fulfillment" if batch_count >= 40 else "collecting",
        "vote_summary": vote_counts,
        "leading_dish": leading_dish
    }

@router.get("/orders/all-batches")
async def get_all_batches():
    """Get all batches with summary (admin)"""
    # Get distinct batch_ids
    pipeline = [
        {"$group": {
            "_id": "$batch_id",
            "total_orders": {"$sum": 1},
            "paid_orders": {"$sum": {"$cond": ["$paid", 1, 0]}},
            "total_revenue": {"$sum": {"$cond": ["$paid", "$total", 0]}},
            "latest_order": {"$max": "$created_at"}
        }},
        {"$sort": {"_id": -1}}
    ]
    
    batches = await db.eats_orders.aggregate(pipeline).to_list(None)
    
    return {
        "batches": [{
            "batch_id": b["_id"],
            "total_orders": b["total_orders"],
            "paid_orders": b["paid_orders"],
            "total_revenue": round(b["total_revenue"], 2),
            "target_reached": b["total_orders"] >= 40,
            "latest_order": b["latest_order"]
        } for b in batches if b["_id"]]
    }

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
    valid_statuses = ["pending_payment", "paid", "preparing", "ready_for_pickup", "out_for_delivery", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.eats_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success"}

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

# PayPal Integration for EATS
@router.post("/paypal/create-order")
async def create_eats_paypal_order(request: PayPalOrderRequest):
    """Create PayPal order for EATS order - amount from server"""
    # Get the order
    order = await db.eats_orders.find_one({"id": request.order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.get("paid"):
        raise HTTPException(status_code=400, detail="Order already paid")
    
    try:
        access_token = get_paypal_access_token()
        
        # Create PayPal order with server-side amount
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": order["order_number"],
                "description": f"818 EATS - {order['menu_item_name']} x{order['quantity']}",
                "amount": {
                    "currency_code": "USD",
                    "value": f"{order['total']:.2f}"
                }
            }],
            "application_context": {
                "brand_name": "818 EATS",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW",
                "shipping_preference": "NO_SHIPPING"
            }
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            headers=headers,
            json=order_payload
        )
        
        if response.status_code == 201:
            paypal_data = response.json()
            
            # Store PayPal order ID on the order
            await db.eats_orders.update_one(
                {"id": request.order_id},
                {"$set": {"paypal_order_id": paypal_data["id"], "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            return {
                "status": "success",
                "paypal_order_id": paypal_data["id"],
                "amount": order["total"]
            }
        else:
            raise Exception(f"PayPal API error: {response.status_code} {response.text}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create PayPal order: {str(e)}")

@router.post("/paypal/capture-order/{paypal_order_id}")
async def capture_eats_paypal_order(paypal_order_id: str, request: PayPalOrderRequest):
    """Capture PayPal order and mark EATS order as paid"""
    # Get the EATS order
    order = await db.eats_orders.find_one({"id": request.order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Idempotency check - if already paid, return success
    if order.get("paid"):
        return {
            "status": "success",
            "message": "Order already paid",
            "order_id": request.order_id
        }
    
    try:
        access_token = get_paypal_access_token()
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{paypal_order_id}/capture",
            headers=headers
        )
        
        if response.status_code == 201:
            capture_data = response.json()
            capture_id = capture_data["purchase_units"][0]["payments"]["captures"][0]["id"]
            payer_email = capture_data.get("payer", {}).get("email_address")
            
            # Update order as paid
            await db.eats_orders.update_one(
                {"id": request.order_id},
                {"$set": {
                    "paid": True,
                    "status": "paid",
                    "paid_at": datetime.now(timezone.utc).isoformat(),
                    "paypal_capture_id": capture_id,
                    "payer_email": payer_email,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            return {
                "status": "success",
                "capture_id": capture_id,
                "payer_email": payer_email,
                "order_id": request.order_id
            }
        else:
            raise Exception(f"PayPal capture error: {response.status_code} {response.text}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to capture PayPal order: {str(e)}")

# Vendor Management
@router.post("/vendors/signup")
async def vendor_signup(vendor: VendorSignup):
    """Food vendor signup with license verification"""
    existing = await db.eats_vendors.find_one({"email": vendor.email})
    if existing:
        raise HTTPException(status_code=400, detail="Vendor with this email already exists")
    
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
        "message": "Application submitted! We'll review your license and contact you within 24-48 hours.",
        "vendor_id": new_vendor["id"]
    }

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
    return {"status": "success", "message": "You're on the list! We'll notify you of new menu items."}

@router.get("/clients")
async def get_clients():
    """Get all subscribed clients (admin)"""
    clients = await db.eats_clients.find({"subscribed": True}, {"_id": 0}).to_list(None)
    return {"clients": clients}
