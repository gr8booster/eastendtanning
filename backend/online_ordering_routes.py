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

# Import email sending functionality
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False

router = APIRouter(prefix="/api/orders", tags=["online_orders"])

# MongoDB
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "eastend_db")]

class OrderItem(BaseModel):
    drink_id: str
    drink_name: str
    quantity: int
    price: float
    customizations: Optional[Dict[str, str]] = {}

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    items: List[OrderItem]
    delivery_method: str
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
    status: str
    estimated_ready_time: datetime
    created_at: datetime
    payment_status: str

def calculate_order_total(items: List[OrderItem], delivery_method: str, tip_amount: float = 0.0):
    """Calculate order total with tax and delivery fee"""
    subtotal = sum(item.price * item.quantity for item in items)
    tax_rate = 0.0825
    tax = round(subtotal * tax_rate, 2)
    
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

async def check_delivery_enabled() -> bool:
    """Check if delivery is currently enabled"""
    settings = await db.settings.find_one({"key": "delivery_enabled"})
    if settings:
        return settings.get("value", True)
    return True

@router.post("/create", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    """Create new Fizze drinks order"""
    
    # Check if delivery is enabled
    if order.delivery_method != "pickup":
        delivery_enabled = await check_delivery_enabled()
        if not delivery_enabled:
            raise HTTPException(
                status_code=400, 
                detail="Delivery is temporarily unavailable. Please select pickup only."
            )
    
    # Validate required fields for delivery
    if order.delivery_method != "pickup" and not order.delivery_address:
        raise HTTPException(
            status_code=400,
            detail="Delivery address is required for delivery orders"
        )
    
    # Generate order number
    order_number = f"FZ{datetime.now().strftime('%y%m%d')}{str(uuid.uuid4())[:4].upper()}"
    
    # Calculate totals
    totals = calculate_order_total(order.items, order.delivery_method, order.tip_amount or 0.0)
    
    # Estimate ready time
    from datetime import timedelta
    estimated_minutes = 20 if order.delivery_method == "pickup" else 45
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
    
    # Send notification email to staff
    try:
        await send_order_notification_email(order_doc)
    except Exception as e:
        # Don't fail the order if email fails
        print(f"Failed to send order notification email: {e}")
    
    return OrderResponse(**order_doc)

@router.get("/list", response_model=List[OrderResponse])
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

@router.get("/settings", response_model=Dict)
async def get_order_settings():
    """Get order settings (delivery enabled, etc.)"""
    settings = await db.settings.find_one({"key": "delivery_enabled"})
    if settings:
        return {"delivery_enabled": settings.get("value", True)}
    return {"delivery_enabled": True}

@router.post("/settings/delivery-toggle")
async def toggle_delivery(enabled: bool, current_user: dict = Depends(verify_token)):
    """Toggle delivery on/off (Admin only)"""
    await db.settings.update_one(
        {"key": "delivery_enabled"},
        {"$set": {"value": enabled, "updated_at": datetime.now(timezone.utc)}},
        upsert=True
    )
    return {"status": "success", "delivery_enabled": enabled}

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get order by ID"""
    doc = await db.fizze_orders.find_one({"id": order_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    
    doc.pop("_id", None)
    return OrderResponse(**doc)

@router.get("/track/{order_number}", response_model=OrderResponse)
async def track_order(order_number: str):
    """Track order by order number"""
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
        raise HTTPException(status_code=400, detail=f"Invalid status")
    
    result = await db.fizze_orders.update_one(
        {"id": order_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"status": "success", "order_id": order_id, "new_status": status}
