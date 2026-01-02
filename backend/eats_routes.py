"""
818 EATS - Food Pre-ordering System
Two modes: 
1. INTEREST_ONLY - Collect interest when no partner restaurants
2. VOTE_MODE - Full ranking system when partners available
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
PAYPAL_API_BASE = "https://api-m.paypal.com"

# Constants
ORDER_THRESHOLD = 10  # Minimum bulk orders for partners
DEFAULT_MODE = "interest_only"  # "interest_only" or "vote_mode"

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
    rank_1: str
    rank_2: str
    rank_3: str
    delivery_preference: str
    quantity: int = 1
    delivery_fee: float = 5.99
    tip: float = 0.00
    notes: Optional[str] = None

class InterestSignup(BaseModel):
    name: str
    email: str
    phone: str
    interested_dishes: List[str]  # List of menu item IDs they're interested in
    willing_to_prepay: bool = False

class PartnerRestaurantSignup(BaseModel):
    business_name: str
    contact_name: str
    phone: str
    email: str
    business_type: str  # "restaurant", "home_kitchen", "ghost_kitchen"
    cuisine_specialties: str
    address: str
    city: str
    state: str = "OH"
    license_type: Optional[str] = None  # "cottage_food", "health_department", "other"
    license_number: Optional[str] = None
    can_handle_bulk_orders: bool = True
    minimum_order_capacity: int = 10
    delivery_radius_miles: Optional[int] = None
    website: Optional[str] = None
    social_media: Optional[str] = None
    additional_notes: Optional[str] = None

class EatsSettings(BaseModel):
    mode: str  # "interest_only" or "vote_mode"

class ClientSignup(BaseModel):
    email: str
    name: Optional[str] = None
    preferences: Optional[List[str]] = None

class PayPalOrderRequest(BaseModel):
    order_id: str

# Settings Management
async def get_eats_settings():
    """Get current EATS settings"""
    settings = await db.eats_settings.find_one({"type": "main"})
    if not settings:
        # Create default settings
        default_settings = {
            "type": "main",
            "mode": DEFAULT_MODE,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.eats_settings.insert_one(default_settings)
        return default_settings
    return settings

@router.get("/settings")
async def get_settings():
    """Get EATS system settings"""
    settings = await get_eats_settings()
    # Check if we have active partners
    active_partners = await db.eats_partners.count_documents({"status": {"$in": ["approved", "active"]}})
    return {
        "mode": settings.get("mode", DEFAULT_MODE),
        "has_active_partners": active_partners > 0,
        "active_partner_count": active_partners
    }

@router.put("/settings")
async def update_settings(settings: EatsSettings):
    """Update EATS system settings (admin)"""
    if settings.mode not in ["interest_only", "vote_mode"]:
        raise HTTPException(status_code=400, detail="Invalid mode. Must be 'interest_only' or 'vote_mode'")
    
    await db.eats_settings.update_one(
        {"type": "main"},
        {"$set": {"mode": settings.mode, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"status": "success", "mode": settings.mode}

# Helper function to initialize default menu
async def initialize_menu():
    """Create default African cuisine menu if none exists"""
    existing = await db.eats_menu.find_one({})
    if not existing:
        default_items = [
            {
                "id": str(uuid.uuid4()),
                "name": "Ghana Jollof Rice",
                "description": "Authentic West African one-pot rice dish cooked in a rich tomato-based sauce with aromatic spices, vegetables, and your choice of protein.",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=srgb&fm=jpg&q=85",
                "available": True,
                "prep_time_minutes": 60,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Egusi Stew",
                "description": "Traditional Nigerian soup made with ground melon seeds, fresh leafy greens, and aromatic spices. Served with fufu or rice.",
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
                "description": "Nigerian grilled meat skewers (suya) seasoned with spicy peanut blend, paired with perfectly golden fried sweet plantains.",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://customer-assets.emergentagent.com/job_eats-aggregator/artifacts/o7lj27xo_Suya-and-plantain.webp",
                "available": True,
                "prep_time_minutes": 45,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Waakye",
                "description": "Popular Ghanaian dish of rice and black-eyed peas cooked with millet leaves for a distinctive dark color. Served with shito and protein.",
                "price": 25.00,
                "category": "African Cuisine",
                "image_url": "https://customer-assets.emergentagent.com/job_eats-aggregator/artifacts/zrxyildz_IMG_0026-scaled.jpg",
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
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            headers=headers,
            data={"grant_type": "client_credentials"}
        )
        
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            raise Exception(f"Failed to get access token: {response.status_code}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PayPal auth error: {str(e)}")

# Menu Endpoints
@router.get("/menu")
async def get_menu():
    """Get all menu items"""
    await initialize_menu()
    items = await db.eats_menu.find({}, {"_id": 0}).to_list(None)
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

# Interest Signup (Interest Only Mode)
@router.post("/interest")
async def express_interest(signup: InterestSignup):
    """Express interest in ordering when food becomes available"""
    # Check for existing signup
    existing = await db.eats_interest.find_one({"email": signup.email})
    if existing:
        # Update existing record
        await db.eats_interest.update_one(
            {"email": signup.email},
            {"$set": {
                "name": signup.name,
                "phone": signup.phone,
                "interested_dishes": signup.interested_dishes,
                "willing_to_prepay": signup.willing_to_prepay,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return {"status": "success", "message": "Your interest has been updated!"}
    
    # Get dish names
    dish_names = []
    for dish_id in signup.interested_dishes:
        dish = await db.eats_menu.find_one({"id": dish_id})
        if dish:
            dish_names.append(dish["name"])
    
    new_interest = {
        "id": str(uuid.uuid4()),
        "name": signup.name,
        "email": signup.email,
        "phone": signup.phone,
        "interested_dishes": signup.interested_dishes,
        "interested_dish_names": dish_names,
        "willing_to_prepay": signup.willing_to_prepay,
        "contacted": False,
        "converted_to_order": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_interest.insert_one(new_interest)
    
    return {
        "status": "success",
        "message": "Thank you for your interest! We'll contact you when your favorite dishes are available.",
        "interest_id": new_interest["id"]
    }

@router.get("/interest")
async def get_interest_list():
    """Get all interest signups (admin)"""
    interests = await db.eats_interest.find({}, {"_id": 0}).sort("created_at", -1).to_list(None)
    
    # Get summary stats
    total = len(interests)
    willing_to_prepay = sum(1 for i in interests if i.get("willing_to_prepay"))
    
    # Dish interest counts
    dish_counts = {}
    for interest in interests:
        for dish_name in interest.get("interested_dish_names", []):
            dish_counts[dish_name] = dish_counts.get(dish_name, 0) + 1
    
    return {
        "interests": interests,
        "summary": {
            "total_signups": total,
            "willing_to_prepay": willing_to_prepay,
            "dish_interest": dish_counts
        }
    }

# Vote Contact Collection (builds database when users vote)
class VoteContact(BaseModel):
    name: str
    email: str
    phone: str

@router.post("/vote-contact")
async def save_vote_contact(contact: VoteContact):
    """Save contact info when user wants to vote - builds customer database"""
    # Check for existing contact
    existing = await db.eats_vote_contacts.find_one({"email": contact.email})
    if existing:
        # Update existing record
        await db.eats_vote_contacts.update_one(
            {"email": contact.email},
            {"$set": {
                "name": contact.name,
                "phone": contact.phone,
                "vote_count": existing.get("vote_count", 0) + 1,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return {"status": "success", "message": "Welcome back! You can now vote."}
    
    new_contact = {
        "id": str(uuid.uuid4()),
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "vote_count": 1,
        "converted_to_order": False,
        "contacted": False,
        "source": "vote_mode",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.eats_vote_contacts.insert_one(new_contact)
    
    return {
        "status": "success",
        "message": "Contact saved! You can now vote for your favorites.",
        "contact_id": new_contact["id"]
    }

@router.get("/vote-contacts")
async def get_vote_contacts():
    """Get all vote contacts (admin) - the customer database"""
    contacts = await db.eats_vote_contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(None)
    return {
        "contacts": contacts,
        "total": len(contacts)
    }


@router.put("/interest/{interest_id}/contacted")
async def mark_interest_contacted(interest_id: str, contacted: bool = True):
    """Mark interest as contacted (admin)"""
    result = await db.eats_interest.update_one(
        {"id": interest_id},
        {"$set": {"contacted": contacted, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Interest not found")
    return {"status": "success"}

# Order Management (Vote Mode)
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
    
    # Calculate totals
    item_price = 25.00
    subtotal = item_price * order.quantity
    delivery_fee = 5.99
    tax = round(subtotal * 0.08, 2)
    tip = max(0, order.tip)
    total = round(subtotal + delivery_fee + tax + tip, 2)
    
    # Get current week
    now = datetime.now(timezone.utc)
    week_number = now.isocalendar()[1]
    year = now.year
    batch_id = f"{year}-W{week_number:02d}"
    
    batch_count = await db.eats_orders.count_documents({"batch_id": batch_id})
    
    new_order = {
        "id": str(uuid.uuid4()),
        "order_number": f"818-{str(uuid.uuid4())[:8].upper()}",
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "customer_email": order.customer_email,
        "customer_address": order.customer_address,
        "rank_1": order.rank_1,
        "rank_1_name": rank_items["rank_1"]["name"],
        "rank_2": order.rank_2,
        "rank_2_name": rank_items["rank_2"]["name"],
        "rank_3": order.rank_3,
        "rank_3_name": rank_items["rank_3"]["name"],
        "delivery_preference": order.delivery_preference,
        "assigned_dish_id": None,
        "assigned_dish_name": None,
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
    
    rank_1_counts = {}
    paid_count = 0
    total_revenue = 0
    
    for order in orders:
        rank_1_name = order.get("rank_1_name")
        if rank_1_name:
            rank_1_counts[rank_1_name] = rank_1_counts.get(rank_1_name, 0) + order.get("quantity", 1)
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
        "target_reached": len(orders) >= ORDER_THRESHOLD
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
    
    orders = await db.eats_orders.find({"batch_id": batch_id}, {"_id": 0}).to_list(None)
    rank_1_counts = {}
    delivery_pref_counts = {"first_available": 0, "top_choice_only": 0}
    
    for order in orders:
        rank_1_name = order.get("rank_1_name")
        if rank_1_name:
            rank_1_counts[rank_1_name] = rank_1_counts.get(rank_1_name, 0) + order.get("quantity", 1)
        pref = order.get("delivery_preference", "first_available")
        delivery_pref_counts[pref] = delivery_pref_counts.get(pref, 0) + 1
    
    leading_dish = max(rank_1_counts, key=rank_1_counts.get) if rank_1_counts else None
    
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
        raise HTTPException(status_code=400, detail=f"Invalid status")
    
    result = await db.eats_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success"}

# PayPal Integration
@router.post("/paypal/create-order")
async def create_eats_paypal_order(request: PayPalOrderRequest):
    """Create PayPal order for EATS order"""
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
                "description": f"818 EATS - Weekly African Cuisine",
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
            raise Exception(f"PayPal API error: {response.status_code}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create PayPal order: {str(e)}")

@router.post("/paypal/capture-order/{paypal_order_id}")
async def capture_eats_paypal_order(paypal_order_id: str, request: PayPalOrderRequest):
    """Capture PayPal order"""
    order = await db.eats_orders.find_one({"id": request.order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.get("paid"):
        return {"status": "success", "message": "Order already paid", "order_id": request.order_id}
    
    try:
        access_token = get_paypal_access_token()
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{paypal_order_id}/capture",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
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
            
            return {"status": "success", "capture_id": capture_id, "order_id": request.order_id}
        else:
            raise Exception(f"PayPal capture error: {response.status_code}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to capture PayPal order: {str(e)}")

# Partner Restaurant Signup
@router.post("/partners/signup")
async def partner_restaurant_signup(partner: PartnerRestaurantSignup):
    """Partner restaurant signup - for restaurants, home kitchens, ghost kitchens"""
    existing = await db.eats_partners.find_one({"email": partner.email})
    if existing:
        raise HTTPException(status_code=400, detail="A partner with this email already exists")
    
    new_partner = {
        "id": str(uuid.uuid4()),
        "business_name": partner.business_name,
        "contact_name": partner.contact_name,
        "phone": partner.phone,
        "email": partner.email,
        "business_type": partner.business_type,
        "cuisine_specialties": partner.cuisine_specialties,
        "address": partner.address,
        "city": partner.city,
        "state": partner.state,
        "license_type": partner.license_type,
        "license_number": partner.license_number,
        "can_handle_bulk_orders": partner.can_handle_bulk_orders,
        "minimum_order_capacity": partner.minimum_order_capacity,
        "delivery_radius_miles": partner.delivery_radius_miles,
        "website": partner.website,
        "social_media": partner.social_media,
        "additional_notes": partner.additional_notes,
        "status": "pending",
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": None
    }
    await db.eats_partners.insert_one(new_partner)
    
    return {
        "status": "success",
        "message": "Thank you for your interest in partnering with 818 EATS! We'll review your application and contact you within 48 hours.",
        "partner_id": new_partner["id"],
        "next_steps": [
            "Our team will review your application",
            "We'll verify your business license if applicable",
            "You'll receive an email with partnership details",
            "Once approved, you'll receive bulk orders of 10+ items"
        ]
    }

@router.get("/partners")
async def get_partner_restaurants(status: str = None):
    """Get partner restaurants - public shows only approved/active"""
    if status:
        partners = await db.eats_partners.find({"status": status}, {"_id": 0}).to_list(None)
    else:
        partners = await db.eats_partners.find(
            {"status": {"$in": ["approved", "active"]}}, 
            {"_id": 0}
        ).to_list(None)
    return {"partners": partners}

@router.get("/partners/all")
async def get_all_partner_restaurants():
    """Get all partner restaurants (admin)"""
    partners = await db.eats_partners.find({}, {"_id": 0}).sort("created_at", -1).to_list(None)
    return {"partners": partners}

@router.put("/partners/{partner_id}/status")
async def update_partner_status(partner_id: str, status: str):
    """Update partner status (admin)"""
    valid_statuses = ["pending", "approved", "active", "inactive", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    update_data = {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}
    if status == "approved":
        update_data["approved_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.eats_partners.update_one({"id": partner_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
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
    return {"status": "success", "message": "You're on the list!"}

@router.get("/clients")
async def get_clients():
    """Get all subscribed clients (admin)"""
    clients = await db.eats_clients.find({"subscribed": True}, {"_id": 0}).to_list(None)
    return {"clients": clients}
