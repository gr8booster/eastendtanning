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
    'matrix': 'Matrix Bed',
    'standup': 'Stand-Up Bed',
    'wellness': 'Wellness - Red Light Therapy'
}

PACKAGE_LABELS = {
    'single': 'Single Session',
    'five_pack': '5-Pack',
    'six_pack': '6-Pack Special',
    'ten_pack': '10-Pack',
    'month_unlimited': 'Monthly Unlimited',
    'vip_unlimited': 'VIP Unlimited'
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


class CreateBlackFridayOrderRequest(BaseModel):
    """Request to create a Black Friday BOGO tanning order"""
    level: str
    package: str
    customer_name: str
    customer_email: str
    customer_phone: str
    packagePrice: float
    blackFridayPass: float
    subtotal: float
    salesTax: float
    tanTax: float
    total: float
    youSave: float
    packageName: str
    blackFridayDeal: bool = True

@router.post("/api/tanning/black-friday-order")
async def create_black_friday_order(request: CreateBlackFridayOrderRequest):
    """
    Create a Black Friday BOGO tanning order and return PayPal checkout URL
    """
    try:
        order_id = str(uuid.uuid4())
        order_code = f"BF-{uuid.uuid4().hex[:8].upper()}"
        
        # Create order document
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
            "package_price": request.packagePrice,
            "black_friday_pass": request.blackFridayPass,
            "subtotal": request.subtotal,
            "sales_tax": request.salesTax,
            "tan_tax": request.tanTax,
            "total": request.total,
            "savings": request.youSave,
            "package_name": request.packageName,
            "black_friday_deal": True,
            "created_at": datetime.now(timezone.utc),
            "paid": False,
            "paid_at": None,
            "payment_method": None,
            "redeemed": False,
            "redeemed_at": None,
            "sunlink_entered": False
        }
        
        # Insert into database
        await tanning_orders_collection.insert_one(order_doc)
        
        # Create PayPal order
        import requests
        import base64
        
        PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = "https://api-m.paypal.com"
        
        if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
            raise HTTPException(status_code=500, detail="PayPal credentials not configured")
        
        # Get PayPal access token
        auth_string = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
        
        token_headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        token_data = {"grant_type": "client_credentials"}
        
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            headers=token_headers,
            data=token_data
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to authenticate with PayPal")
        
        access_token = token_response.json()["access_token"]
        
        # Get frontend URL for return/cancel URLs
        backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
        frontend_url = backend_url.replace('/api', '') if '/api' in backend_url else backend_url
        
        # Create PayPal order with detailed instructions
        order_instructions = (
            f"ORDER DETAILS:\n"
            f"Customer: {request.customer_name}\n"
            f"Phone: {request.customer_phone}\n"
            f"Email: {request.customer_email}\n"
            f"Package: {request.packageName} (BOGO)\n"
            f"Order Code: {order_code}\n"
            f"Total: ${request.total:.2f}\n"
            f"You Save: ${request.youSave:.2f}"
        )
        
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": order_code,
                "description": order_instructions[:127],  # PayPal has 127 char limit
                "amount": {
                    "currency_code": "USD",
                    "value": f"{request.total:.2f}",
                    "breakdown": {
                        "item_total": {"currency_code": "USD", "value": f"{request.subtotal:.2f}"},
                        "tax_total": {"currency_code": "USD", "value": f"{(request.salesTax + request.tanTax):.2f}"}
                    }
                },
                "items": [{
                    "name": f"{request.packageName} (BOGO)",
                    "description": "Buy 1 Get 1 FREE",
                    "unit_amount": {"currency_code": "USD", "value": f"{request.packagePrice:.2f}"},
                    "quantity": "1"
                }, {
                    "name": "Black Friday Pass",
                    "description": "$5 Special Pass",
                    "unit_amount": {"currency_code": "USD", "value": f"{request.blackFridayPass:.2f}"},
                    "quantity": "1"
                }]
            }],
            "application_context": {
                "brand_name": "Eastend Tanning & Laundry",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW",
                "return_url": f"{frontend_url}/black-friday-success?order_id={order_id}",
                "cancel_url": f"{frontend_url}/black-friday-checkout?cancelled=true"
            }
        }
        
        order_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        order_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            headers=order_headers,
            json=order_payload
        )
        
        if order_response.status_code != 201:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to create PayPal order: {order_response.text}"
            )
        
        paypal_order = order_response.json()
        paypal_order_id = paypal_order["id"]
        
        # Store PayPal order ID
        await tanning_orders_collection.update_one(
            {"order_id": order_id},
            {"$set": {"paypal_order_id": paypal_order_id}}
        )
        
        # Get approval URL
        approve_link = None
        for link in paypal_order.get("links", []):
            if link["rel"] == "approve":
                approve_link = link["href"]
                break
        
        if not approve_link:
            raise HTTPException(status_code=500, detail="PayPal approval link not found")
        
        # Send notification email (non-blocking)
        try:
            await send_tanning_order_notification_email(order_doc)
        except Exception as e:
            print(f"Failed to send Black Friday order notification: {e}")
        
        return {
            "success": True,
            "order_id": order_id,
            "order_code": order_code,
            "paypal_order_id": paypal_order_id,
            "checkout_url": approve_link,
            "total": request.total
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Black Friday order: {str(e)}")

@router.post("/api/tanning/black-friday-capture/{order_id}")
async def capture_black_friday_payment(order_id: str):
    """
    Capture PayPal payment after customer approval
    Called from frontend after PayPal redirects back
    """
    try:
        # Get order from database
        order = await tanning_orders_collection.find_one({"order_id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        paypal_order_id = order.get("paypal_order_id")
        if not paypal_order_id:
            raise HTTPException(status_code=400, detail="PayPal order ID not found")
        
        # Get PayPal credentials
        import requests
        import base64
        
        PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID')
        PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET')
        PAYPAL_API_BASE = "https://api-m.paypal.com"
        
        # Get access token
        auth_string = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
        
        token_headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        token_response = requests.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            headers=token_headers,
            data={"grant_type": "client_credentials"}
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=500, detail="PayPal authentication failed")
        
        access_token = token_response.json()["access_token"]
        
        # Capture the order
        capture_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        capture_response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{paypal_order_id}/capture",
            headers=capture_headers
        )
        
        if capture_response.status_code != 201:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to capture payment: {capture_response.text}"
            )
        
        capture_data = capture_response.json()
        
        # Update order as paid
        await tanning_orders_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "paid": True,
                    "paid_at": datetime.now(timezone.utc),
                    "payment_method": "PayPal",
                    "paypal_capture_id": capture_data["purchase_units"][0]["payments"]["captures"][0]["id"],
                    "payer_email": capture_data.get("payer", {}).get("email_address")
                }
            }
        )
        
        return {
            "success": True,
            "order_id": order_id,
            "capture_id": capture_data["purchase_units"][0]["payments"]["captures"][0]["id"],
            "status": "COMPLETED"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to capture payment: {str(e)}")


class MarkSunlinkEnteredRequest(BaseModel):
    """Request to mark order as entered in Sunlink"""
    order_id: str
    staff_name: str

class MarkPaidRequest(BaseModel):
    """Request to mark order as paid"""
    order_id: str
    payment_method: Optional[str] = "manual"

@router.post("/api/tanning/mark-paid")
async def mark_tanning_order_paid(
    request: MarkPaidRequest,
    current_user: dict = Depends(verify_token)
):
    """Mark a tanning order as paid (for manual payment confirmation)"""
    try:
        result = await tanning_orders_collection.update_one(
            {"order_id": request.order_id},
            {
                "$set": {
                    "paid": True,
                    "paid_at": datetime.now(timezone.utc),
                    "payment_method": request.payment_method
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"success": True, "message": "Order marked as paid"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update order: {str(e)}")

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
