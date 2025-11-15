"""Unified Cart System for Tanning Packages + Lotions
Customers can add multiple items and checkout together
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os

router = APIRouter(prefix="/api/cart", tags=["cart"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

class TanningItem(BaseModel):
    type: str = "tanning"  # tanning
    bed_level: str  # level1, level2, etc
    package_type: str  # single, five_pack, ten_pack, month_unlimited
    price: float
    quantity: int = 1

class LotionItem(BaseModel):
    type: str = "lotion"
    lotion_id: str
    lotion_name: str
    lotion_brand: Optional[str] = None
    price: float
    quantity: int = 1

class CartItem(BaseModel):
    item_id: str
    item_type: str  # "tanning" or "lotion"
    details: Dict[str, Any]
    price: float
    quantity: int

class CreateOrder(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    items: List[Dict[str, Any]]  # List of cart items
    customer_id: Optional[str] = None

@router.post("/create-order")
async def create_unified_order(order_data: CreateOrder):
    """Create order with multiple tanning packages and lotions"""
    
    if not order_data.items or len(order_data.items) == 0:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate totals
    subtotal = 0
    tanning_subtotal = 0
    lotion_subtotal = 0
    
    for item in order_data.items:
        item_total = item["price"] * item["quantity"]
        subtotal += item_total
        
        if item["item_type"] == "tanning":
            tanning_subtotal += item_total
        elif item["item_type"] == "lotion":
            lotion_subtotal += item_total
    
    # Calculate taxes
    sales_tax = subtotal * 0.0725  # 7.25% on everything
    tan_tax = tanning_subtotal * 0.10  # Additional 10% on tanning only
    total_tax = sales_tax + tan_tax
    total = subtotal + total_tax
    
    # Generate order
    order_id = str(uuid.uuid4())
    order_code = f"EST-{str(uuid.uuid4())[:8].upper()}"
    
    order = {
        "order_id": order_id,
        "order_code": order_code,
        "customer_name": order_data.customer_name,
        "customer_email": order_data.customer_email,
        "customer_phone": order_data.customer_phone,
        "customer_id": order_data.customer_id,
        "items": order_data.items,
        "subtotal": round(subtotal, 2),
        "tanning_subtotal": round(tanning_subtotal, 2),
        "lotion_subtotal": round(lotion_subtotal, 2),
        "sales_tax": round(sales_tax, 2),
        "tan_tax": round(tan_tax, 2),
        "total_tax": round(total_tax, 2),
        "total": round(total, 2),
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc),
        "status": "pending"
    }
    
    await db.unified_orders.insert_one(order)
    
    # Add to customer purchase history if customer_id provided
    if order_data.customer_id:
        await db.customer_profiles.update_one(
            {"customer_id": order_data.customer_id},
            {"$push": {"purchase_history": {
                "order_id": order_id,
                "order_code": order_code,
                "total": round(total, 2),
                "items_count": len(order_data.items),
                "timestamp": datetime.now(timezone.utc)
            }}}
        )
    
    order.pop('_id', None)
    return order

@router.get("/order/{order_id}")
async def get_order(order_id: str):
    """Retrieve order by ID"""
    order = await db.unified_orders.find_one({"order_id": order_id})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.pop('_id', None)
    return order

@router.patch("/order/{order_id}/payment")
async def update_payment_status(order_id: str, status: str, paypal_order_id: Optional[str] = None):
    """Update payment status after PayPal capture"""
    update_data = {
        "payment_status": status,
        "updated_at": datetime.now(timezone.utc)
    }
    
    if paypal_order_id:
        update_data["paypal_order_id"] = paypal_order_id
    
    result = await db.unified_orders.update_one(
        {"order_id": order_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Payment status updated"}
