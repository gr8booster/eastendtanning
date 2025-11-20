"""
Tanning package ordering routes
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from typing import List, Optional
import uuid
import os
from auth import verify_token

# Import email sending functionality
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False

router = APIRouter()

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'eastend_db')
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
        
        # Send notification email to staff
        try:
            await send_tanning_order_notification_email(order_doc)
        except Exception as e:
            # Don't fail the order if email fails
            print(f"Failed to send tanning order notification email: {e}")
        
        return {
            "order_id": order_id,
            "order_code": order_code,
            "total": request.total
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

class MarkSunlinkEnteredRequest(BaseModel):
    """Request to mark order as entered in Sunlink"""
    order_id: str
    staff_name: str

@router.post("/api/tanning/mark-sunlink-entered")
async def mark_sunlink_entered(
    request: MarkSunlinkEnteredRequest,
    current_user: dict = Depends(verify_token)
):
    """Mark a tanning order as entered in Sunlink system"""
    try:
        result = await tanning_orders_collection.update_one(
            {"order_id": request.order_id},
            {
                "$set": {
                    "sunlink_entered": True,
                    "sunlink_entered_by": request.staff_name,
                    "sunlink_entered_at": datetime.now(timezone.utc)
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"success": True, "message": f"Order marked as entered by {request.staff_name}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update order: {str(e)}")

@router.get("/api/tanning/orders/list")
async def list_tanning_orders(
    limit: int = 100,
    paid_only: bool = False,
    current_user: dict = Depends(verify_token)
):
    """List all tanning orders (Admin only)"""
    try:
        query = {}
        if paid_only:
            query["paid"] = True
        
        orders = []
        async for doc in tanning_orders_collection.find(query).sort("created_at", -1).limit(limit):
            doc.pop('_id', None)
            orders.append(doc)
        
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list orders: {str(e)}")

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

async def send_tanning_order_notification_email(order_doc: dict):
    """Send tanning order notification email to staff"""
    if not SENDGRID_AVAILABLE:
        print("SendGrid not available, skipping email notification")
        return
    
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    if not sendgrid_api_key:
        print("SENDGRID_API_KEY not set, skipping email notification")
        return
    
    staff_email = "eastendtanninglaundrynutrition@outlook.com"
    from_email = os.environ.get('SENDGRID_FROM_EMAIL', 'noreply@eastendtanning.com')
    
    # Build email HTML
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background: linear-gradient(135deg, #f5a623 0%, #e67e22 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;'>
            <h1 style='color: white; margin: 0;'>☀️ New Tanning Package Purchase!</h1>
        </div>
        
        <div style='background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;'>
            <h2 style='color: #f5a623; margin-top: 0;'>Order #{order_doc['order_code']}</h2>
            <p style='font-size: 14px; color: #666;'>Purchased: {order_doc['created_at'].strftime('%B %d, %Y at %I:%M %p')}</p>
            
            <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='margin-top: 0; color: #333;'>Customer Information</h3>
                <p style='margin: 5px 0;'><strong>Name:</strong> {order_doc['customer_name']}</p>
                <p style='margin: 5px 0;'><strong>Phone:</strong> {order_doc['customer_phone']}</p>
                <p style='margin: 5px 0;'><strong>Email:</strong> {order_doc['customer_email']}</p>
            </div>
            
            <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='margin-top: 0; color: #333;'>Package Details</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr style='border-bottom: 1px solid #eee;'>
                        <td style='padding: 8px;'><strong>Bed Level:</strong></td>
                        <td style='padding: 8px; text-align: right;'>{order_doc['level_label']}</td>
                    </tr>
                    <tr style='border-bottom: 1px solid #eee;'>
                        <td style='padding: 8px;'><strong>Package:</strong></td>
                        <td style='padding: 8px; text-align: right;'>{order_doc['package_label']}</td>
                    </tr>
                    <tr style='font-weight: bold; border-bottom: 1px solid #eee;'>
                        <td style='padding: 8px; padding-top: 15px;'>Subtotal</td>
                        <td style='padding: 8px; padding-top: 15px; text-align: right;'>${order_doc['subtotal']:.2f}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px;'>Sales Tax</td>
                        <td style='padding: 8px; text-align: right;'>${order_doc['sales_tax']:.2f}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px;'>Tanning Tax</td>
                        <td style='padding: 8px; text-align: right;'>${order_doc['tan_tax']:.2f}</td>
                    </tr>
                    <tr style='font-weight: bold; font-size: 18px; border-top: 2px solid #333;'>
                        <td style='padding: 8px; padding-top: 15px;'>Total Paid</td>
                        <td style='padding: 8px; padding-top: 15px; text-align: right; color: #f5a623;'>${order_doc['total']:.2f}</td>
                    </tr>
                </table>
            </div>
            
            <div style='background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #f5a623;'>
                <h3 style='margin: 0 0 10px 0; color: #856404;'>⚠️ Action Required: Enter into Sunlink System</h3>
                <div style='background: white; padding: 15px; border-radius: 4px; margin-top: 10px;'>
                    <h4 style='margin: 0 0 10px 0; color: #333; font-size: 16px;'>Sunlink Entry Details:</h4>
                    <table style='width: 100%; font-size: 14px;'>
                        <tr>
                            <td style='padding: 5px 0; font-weight: bold; width: 40%;'>Customer Name:</td>
                            <td style='padding: 5px 0;'>{order_doc['customer_name']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 5px 0; font-weight: bold;'>Phone:</td>
                            <td style='padding: 5px 0;'>{order_doc['customer_phone']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 5px 0; font-weight: bold;'>Email:</td>
                            <td style='padding: 5px 0;'>{order_doc['customer_email']}</td>
                        </tr>
                        <tr style='border-top: 2px solid #f5a623;'>
                            <td style='padding: 10px 0 5px 0; font-weight: bold; color: #f5a623;'>Bed Type:</td>
                            <td style='padding: 10px 0 5px 0; font-weight: bold; color: #f5a623;'>{order_doc['level_label']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 5px 0; font-weight: bold; color: #f5a623;'>Package:</td>
                            <td style='padding: 5px 0; font-weight: bold; color: #f5a623;'>{order_doc['package_label']}</td>
                        </tr>
                        <tr style='border-top: 1px solid #ddd;'>
                            <td style='padding: 10px 0 5px 0; font-weight: bold;'>Amount Paid:</td>
                            <td style='padding: 10px 0 5px 0; font-weight: bold; font-size: 16px; color: #28a745;'>${order_doc['total']:.2f}</td>
                        </tr>
                        <tr>
                            <td style='padding: 5px 0; font-weight: bold;'>Skin Type:</td>
                            <td style='padding: 5px 0; color: #856404;'>❌ Not collected online</td>
                        </tr>
                    </table>
                    <p style='margin: 15px 0 0 0; padding: 10px; background: #fff3cd; border-radius: 4px; font-size: 13px; color: #856404;'>
                        <strong>Note:</strong> Skin type was not collected during online purchase. Please assess in-person when customer visits.
                    </p>
                </div>
            </div>
            
            <p style='margin-top: 20px; font-size: 12px; color: #666; text-align: center;'>
                This is an automated notification from Eastend Tanning & Laundry
            </p>
        </div>
    </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=from_email,
            to_emails=staff_email,
            subject=f'New Tanning Purchase #{order_doc["order_code"]} - ${order_doc["total"]:.2f}',
            html_content=html_content
        )
        
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Tanning order notification email sent successfully. Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"Failed to send tanning order notification email: {e}")
        return False
