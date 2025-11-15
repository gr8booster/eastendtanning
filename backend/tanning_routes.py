"""
Tanning package ordering routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid
import os

router = APIRouter()

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
tanning_orders_collection = db['tanning_orders']

LEVEL_LABELS = {
    'level1': 'Level 1 - Entry Bed',
    'level2': 'Level 2 - Standard Bed',
    'level3': 'Level 3 - Premium Bed',
    'level4': 'Level 4 - High-Power Bed',
    'matrix': 'Matrix - Stand-Up Bed',
    'wellness': 'Wellness - Red Light Therapy'
}

PACKAGE_LABELS = {
    'single': 'Single Session',
    'five_pack': '5-Pack',
    'ten_pack': '10-Pack',
    'month_unlimited': 'Monthly Unlimited'
}

class CreateTanningOrderRequest(BaseModel):
    """Request to create a tanning package order"""
    level: str
    package: str
    customer_name: str
    customer_email: str
    customer_phone: str
    subtotal: float
    sales_tax: float
    tan_tax: float
    total: float

@router.post("/api/tanning/create-order")
async def create_tanning_order(request: CreateTanningOrderRequest):
    """Create a tanning package order"""
    try:
        order_id = str(uuid.uuid4())
        order_code = f"TAN-{uuid.uuid4().hex[:8].upper()}"
        
        order_doc = {
            "order_id": order_id,
            "order_code": order_code,
            "level": request.level,
            "level_label": LEVEL_LABELS.get(request.level, request.level),
            "package": request.package,
            "package_label": PACKAGE_LABELS.get(request.package, request.package),
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "customer_phone": request.customer_phone,
            "subtotal": request.subtotal,
            "sales_tax": request.sales_tax,
            "tan_tax": request.tan_tax,
            "total": request.total,
            "created_at": datetime.now(timezone.utc),
            "paid": False,
            "paid_at": None,
            "redeemed": False,
            "redeemed_at": None
        }
        
        await tanning_orders_collection.insert_one(order_doc)
        
        return {
            "order_id": order_id,
            "order_code": order_code,
            "total": request.total
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@router.get("/api/tanning/order/{order_id}")
async def get_tanning_order(order_id: str):
    """Retrieve a tanning order by ID"""
    try:
        order = await tanning_orders_collection.find_one({"order_id": order_id})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.pop('_id', None)
        return order
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve order: {str(e)}")
