"""
Fizze Drinks Online Ordering System
Integrates with DoorDash, GrubHub, and other delivery platforms
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from auth import verify_token

router = APIRouter(prefix="/api/orders", tags=["online_orders"])

# MongoDB
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "test_database")]

class OrderItem(BaseModel):
    drink_id: str
    drink_name: str
    quantity: int
    price: float
    customizations: Optional[Dict[str, str]] = {}  # ice level, sugar level, toppings

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    items: List[OrderItem]
    delivery_method: str  # "pickup", "doordash", "grubhub", "ubereats"
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None
    tip_amount: Optional[float] = 0.0

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    items: List[OrderItem]
    subtotal: float
    tax: float
    delivery_fee: float
    tip_amount: float
    total: float
    delivery_method: str
    delivery_address: Optional[str]
    status: str  # "pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed", "cancelled"
    estimated_ready_time: datetime
    created_at: datetime
    payment_status: str  # "pending", "paid", "refunded"

def calculate_order_total(items: List[OrderItem], delivery_method: str, tip_amount: float = 0.0):
    """Calculate order total with tax and delivery fee"""
    subtotal = sum(item.price * item.quantity for item in items)
    tax_rate = 0.0825  # 8.25% Ohio sales tax
    tax = round(subtotal * tax_rate, 2)
    
    # Delivery fees by platform
    delivery_fees = {
        "pickup": 0.0,
        "doordash": 2.99,
        "grubhub": 3.49,
        "ubereats": 2.49
    }
    delivery_fee = delivery_fees.get(delivery_method, 0.0)
    
    total = subtotal + tax + delivery_fee + tip_amount
    
    return {
        "subtotal": round(subtotal, 2),
        "tax": tax,
        "delivery_fee": delivery_fee,
        "tip_amount": tip_amount,
        "total": round(total, 2)
    }

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    """Create new Fizze drinks order"""
    # Generate order number
    order_number = f"FZ{datetime.now().strftime('%y%m%d')}{str(uuid.uuid4())[:4].upper()}"
    
    # Calculate totals
    totals = calculate_order_total(order.items, order.delivery_method, order.tip_amount or 0.0)
    
    # Estimate ready time (15-20 minutes for pickup, add delivery time)
    estimated_minutes = 20 if order.delivery_method == "pickup" else 45
    from datetime import timedelta
    estimated_ready_time = datetime.now(timezone.utc) + timedelta(minutes=estimated_minutes)
    
    # Create order document
    order_doc = {
        "id": str(uuid.uuid4()),
        "order_number": order_number,
        "customer_name": order.customer_name,
        "customer_email": order.customer_email,
        "customer_phone": order.customer_phone,
        "items": [item.model_dump() for item in order.items],
        "subtotal": totals["subtotal"],
        "tax": totals["tax"],
        "delivery_fee": totals["delivery_fee"],
        "tip_amount": totals["tip_amount"],
        "total": totals["total"],
        "delivery_method": order.delivery_method,
        "delivery_address": order.delivery_address,
        "special_instructions": order.special_instructions,
        "status": "pending",
        "payment_status": "pending",
        "estimated_ready_time": estimated_ready_time,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.fizze_orders.insert_one(order_doc)
    
    return OrderResponse(**order_doc)

@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    status: Optional[str] = None,
    delivery_method: Optional[str] = None,
    limit: int = 50,
    current_user: dict = Depends(verify_token)
):
    """List orders (Admin only)"""
    query = {}
    if status:
        query["status"] = status
    if delivery_method:
        query["delivery_method"] = delivery_method
    
    orders = []
    async for doc in db.fizze_orders.find(query).sort("created_at", -1).limit(limit):
        doc.pop("_id", None)
        orders.append(OrderResponse(**doc))
    
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get order by ID (public - for customer tracking)"""
    doc = await db.fizze_orders.find_one({"id": order_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    doc.pop("_id", None)
    return OrderResponse(**doc)

@router.get("/track/{order_number}", response_model=OrderResponse)
async def track_order(order_number: str):
    """Track order by order number (public)"""
    doc = await db.fizze_orders.find_one({"order_number": order_number.upper()})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    doc.pop("_id", None)
    return OrderResponse(**doc)

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    current_user: dict = Depends(verify_token)
):
    """Update order status (Admin only)"""
    valid_statuses = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.fizze_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"status": "success", "order_id": order_id, "new_status": status}

@router.post("/doordash/webhook")
async def doordash_webhook(payload: Dict):
    """DoorDash webhook for order updates"""
    # DoorDash will send order status updates here
    # Format: {"order_id": "...", "status": "...", "timestamp": "..."}
    order_id = payload.get("order_id")
    status = payload.get("status")
    
    if order_id and status:
        await db.fizze_orders.update_one(
            {"id": order_id},
            {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
        )
    
    return {"status": "received"}

@router.post("/grubhub/webhook")
async def grubhub_webhook(payload: Dict):
    """GrubHub webhook for order updates"""
    order_id = payload.get("order_id")
    status = payload.get("status")
    
    if order_id and status:
        await db.fizze_orders.update_one(
            {"id": order_id},
            {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
        )
    
    return {"status": "received"}

@router.post("/ubereats/webhook")
async def ubereats_webhook(payload: Dict):
    """Uber Eats webhook for order updates"""
    order_id = payload.get("order_id")
    status = payload.get("status")
    
    if order_id and status:
        await db.fizze_orders.update_one(
            {"id": order_id},
            {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
        )
    
    return {"status": "received"}
