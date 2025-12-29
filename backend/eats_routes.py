"""
818 EATS - Food Pre-ordering System
Weekly batch voting model - customers RANK top 3 dishes
Orders aggregated to reach threshold before fulfillment
Customers choose: "First Available" or "#1 Choice Only"
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

# Constants
ORDER_THRESHOLD = 40  # Internal threshold - not shown to customers

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
    rank_1: str  # Menu item ID - top choice
    rank_2: str  # Menu item ID - second choice
    rank_3: str  # Menu item ID - third choice
    delivery_preference: str  # "first_available" or "top_choice_only"
    quantity: int = 1
    delivery_fee: float = 5.99
    tip: float = 0.00
    notes: Optional[str] = None

class PartnerRestaurant(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    email: str
    cuisine_type: str
    description: str
    address: str
    city: str
    state: str = "OH"
    website: Optional[str] = None
    logo_url: Optional[str] = None

class VendorSignup(BaseModel):
    business_name: str
    owner_name: str
    phone: str
    email: str
    password: str
    cuisine_type: str
    description: str
    address: str
    license_type: str
    license_number: str
    license_file_base64: str

class ClientSignup(BaseModel):
    email: str
    name: Optional[str] = None
    preferences: Optional[List[str]] = None

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

# Order Management - Weekly Batch System with Rankings
@router.post("/orders")
async def place_order(order: FoodOrder):
    """Place weekly food pre-order with rankings"""
    # Validate all ranked menu items exist
    rank_items = {}
    for rank_num, item_id in [("rank_1", order.rank_1), ("rank_2", order.rank_2), ("rank_3", order.rank_3)]:
        menu_item = await db.eats_menu.find_one({"id": item_id})
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item for {rank_num} not found")
        rank_items[rank_num] = menu_item
    
    # Calculate totals server-side (based on rank_1 item for now)
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
    
    # Create order with rankings
    new_order = {
        "id": str(uuid.uuid4()),
        "order_number": f"818-{str(uuid.uuid4())[:8].upper()}",
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_email": order.customer_email,
        "customer_address": order.customer_address,
        # Rankings
        "rank_1": order.rank_1,
        "rank_1_name": rank_items["rank_1"]["name"],
        "rank_2": order.rank_2,
        "rank_2_name": rank_items["rank_2"]["name"],
        "rank_3": order.rank_3,
        "rank_3_name": rank_items["rank_3"]["name"],
        "delivery_preference": order.delivery_preference,  # "first_available" or "top_choice_only"
        # Assigned dish (determined when batch is ready)
        "assigned_dish_id": None,
        "assigned_dish_name": None,
        # Pricing
        "quantity": order.quantity,
        "item_price": item_price,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "tax": tax,
        "tip": tip,
        "total": total,
        "notes": order.notes,
        # Batch tracking
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
    
    return {
        "status": "success", 
        "order": {k: v for k, v in new_order.items() if k != '_id'},
        "batch_info": {
            "batch_id": batch_id,
            "delivery_week": f"Week {week_number}, {year}"
        },
        "message": "Order placed! Complete payment to confirm your spot."
    }

@router.get("/orders/batch/{batch_id}")
async def get_batch_orders(batch_id: str):
    """Get all orders for a specific batch (admin)"""
    orders = await db.eats_orders.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    
    # Aggregate votes by menu item (counting all rankings)
    vote_counts = {}
    rank_1_counts = {}
    paid_count = 0
    total_revenue = 0
    
    for order in orders:
        # Count rank 1 preferences
        rank_1_name = order.get("rank_1_name")
        if rank_1_name:
            rank_1_counts[rank_1_name] = rank_1_counts.get(rank_1_name, 0) + order.get("quantity", 1)
        
        # Count all ranked items for potential fulfillment
        for rank_field in ["rank_1_name", "rank_2_name", "rank_3_name"]:
            item_name = order.get(rank_field)
            if item_name:
                vote_counts[item_name] = vote_counts.get(item_name, 0) + 1
        
        if order.get("paid"):
            paid_count += 1
            total_revenue += order.get("total", 0)
    
    return {
        "batch_id": batch_id,
        "total_orders": len(orders),
        "paid_orders": paid_count,
        "total_revenue": round(total_revenue, 2),
        "orders": orders,
        "rank_1_summary": rank_1_counts,
        "all_rankings_summary": vote_counts,
        "target_reached": len(orders) >= ORDER_THRESHOLD
    }

@router.get("/orders/current-batch")
async def get_current_batch_status():
    """Get current week's batch status (internal tracking)"""
    now = datetime.now(timezone.utc)
    week_number = now.isocalendar()[1]
    year = now.year
    batch_id = f"{year}-W{week_number:02d}"
    
    batch_count = await db.eats_orders.count_documents({"batch_id": batch_id})
    paid_count = await db.eats_orders.count_documents({"batch_id": batch_id, "paid": True})
    
    # Get ranking counts
    orders = await db.eats_orders.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    rank_1_counts = {}
    delivery_pref_counts = {"first_available": 0, "top_choice_only": 0}
    
    for order in orders:
        rank_1_name = order.get("rank_1_name")
        if rank_1_name:
            rank_1_counts[rank_1_name] = rank_1_counts.get(rank_1_name, 0) + order.get("quantity", 1)
        
        pref = order.get("delivery_preference", "first_available")
        delivery_pref_counts[pref] = delivery_pref_counts.get(pref, 0) + 1
    
    # Find leading dish
    leading_dish = None
    if rank_1_counts:
        leading_dish = max(rank_1_counts, key=rank_1_counts.get)
    
    return {
        "batch_id": batch_id,
        "week": f"Week {week_number}, {year}",
        "current_orders": batch_count,
        "paid_orders": paid_count,
        "target_orders": ORDER_THRESHOLD,
        "progress_percentage": round((batch_count / ORDER_THRESHOLD) * 100, 1),
        "status": "ready_for_fulfillment" if batch_count >= ORDER_THRESHOLD else "collecting",
        "rank_1_summary": rank_1_counts,
        "delivery_preferences": delivery_pref_counts,
        "leading_dish": leading_dish
    }

@router.get("/orders/all-batches")
async def get_all_batches():
    """Get all batches with summary (admin)"""
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
            "target_reached": b["total_orders"] >= ORDER_THRESHOLD,
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

@router.put("/orders/{order_id}/assign-dish")
async def assign_dish_to_order(order_id: str, dish_id: str, dish_name: str):
    """Assign final dish to order when batch is ready (admin)"""
    result = await db.eats_orders.update_one(
        {"id": order_id},
        {"$set": {
            "assigned_dish_id": dish_id,
            "assigned_dish_name": dish_name,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success"}

# PayPal Integration for EATS
@router.post("/paypal/create-order")
async def create_eats_paypal_order(request: PayPalOrderRequest):
    """Create PayPal order for EATS order - amount from server"""
    order = await db.eats_orders.find_one({"id": request.order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.get("paid"):
        raise HTTPException(status_code=400, detail="Order already paid")
    
    try:
        access_token = get_paypal_access_token()
        
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": order["order_number"],
                "description": f"818 EATS - Weekly African Cuisine (Rankings: {order['rank_1_name']}, {order['rank_2_name']}, {order['rank_3_name']})",
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
    order = await db.eats_orders.find_one({"id": request.order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
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

# Partner Restaurants
@router.post("/partners")
async def add_partner_restaurant(partner: PartnerRestaurant):
    """Add a partner restaurant"""
    existing = await db.eats_partners.find_one({"email": partner.email})
    if existing:
        raise HTTPException(status_code=400, detail="Partner with this email already exists")
    
    new_partner = {
        "id": str(uuid.uuid4()),
        **partner.dict(),
        "status": "pending",  # pending, approved, active, inactive
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": None
    }
    await db.eats_partners.insert_one(new_partner)
    return {
        "status": "success",
        "message": "Thank you for your interest! We'll review your application and contact you soon.",
        "partner_id": new_partner["id"]
    }

@router.get("/partners")
async def get_partner_restaurants(status: str = None):
    """Get partner restaurants - public endpoint shows only approved/active"""
    if status:
        partners = await db.eats_partners.find({"status": status}, {"_id": 0}).to_list(None)
    else:
        # Public: show only approved or active partners
        partners = await db.eats_partners.find(
            {"status": {"$in": ["approved", "active"]}}, 
            {"_id": 0}
        ).to_list(None)
    return {"partners": partners}

@router.get("/partners/all")
async def get_all_partner_restaurants():
    """Get all partner restaurants including pending (admin)"""
    partners = await db.eats_partners.find({}, {"_id": 0}).to_list(None)
    return {"partners": partners}

@router.put("/partners/{partner_id}/status")
async def update_partner_status(partner_id: str, status: str):
    """Update partner restaurant status (admin)"""
    valid_statuses = ["pending", "approved", "active", "inactive", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    update_data = {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}
    if status == "approved":
        update_data["approved_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.eats_partners.update_one(
        {"id": partner_id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"status": "success"}

@router.put("/partners/{partner_id}/featured")
async def toggle_partner_featured(partner_id: str, featured: bool):
    """Toggle partner featured status (admin)"""
    result = await db.eats_partners.update_one(
        {"id": partner_id},
        {"$set": {"featured": featured, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    return {"status": "success"}

# Vendor Management (Legacy)
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
