"""
PayPal Orders API integration for dynamic payment amounts
Uses PayPal REST API to create orders with exact coupon amounts
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
import base64

router = APIRouter()

# PayPal credentials
PAYPAL_CLIENT_ID = "AfDT4xEbDBYJbkqevhCTf0-hgchxACo55xgXMjgoMyElbFG0SaE52w1B066P_Jbn0YGNY6RSlUY31qob"
PAYPAL_CLIENT_SECRET = "EIO1UXJukMaUPm4oulAZYwrMGsKrubjTOpL9mV-Rxq-BzP8N5m_WkFKnD5xOGx2xsV34OBzqzTQaqM5a"
PAYPAL_API_BASE = "https://api-m.paypal.com"  # Production

class CreatePayPalOrderRequest(BaseModel):
    """Request to create a PayPal order"""
    coupon_id: str
    amount: float
    coupon_code: str

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

@router.post("/api/paypal/create-order")
async def create_paypal_order(request: CreatePayPalOrderRequest):
    """
    Create a PayPal order with dynamic amount
    Returns order ID that frontend uses to render PayPal button
    """
    try:
        # Get access token
        access_token = get_paypal_access_token()
        
        # Create order payload
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": request.coupon_code,
                "description": f"Fizze Drinks Order - Coupon {request.coupon_code}",
                "amount": {
                    "currency_code": "USD",
                    "value": f"{request.amount:.2f}"
                }
            }],
            "application_context": {
                "brand_name": "Eastend Tanning & Laundry",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW",
                "return_url": f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:3000')}/coupon/{request.coupon_id}?payment=success",
                "cancel_url": f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:3000')}/coupon/{request.coupon_id}?payment=cancelled"
            }
        }
        
        # Create order via PayPal API
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
            order_data = response.json()
            return {
                "order_id": order_data["id"],
                "status": "success"
            }
        else:
            raise Exception(f"PayPal API error: {response.status_code} {response.text}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create PayPal order: {str(e)}")

@router.post("/api/paypal/capture-order/{order_id}")
async def capture_paypal_order(order_id: str):
    """
    Capture/complete a PayPal order after customer approves
    Called by frontend after PayPal approval
    """
    try:
        # Get access token
        access_token = get_paypal_access_token()
        
        # Capture the order
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        
        if response.status_code == 201:
            capture_data = response.json()
            return {
                "status": "success",
                "capture_id": capture_data["purchase_units"][0]["payments"]["captures"][0]["id"],
                "payer_email": capture_data.get("payer", {}).get("email_address"),
                "amount": capture_data["purchase_units"][0]["payments"]["captures"][0]["amount"]["value"]
            }
        else:
            raise Exception(f"PayPal capture error: {response.status_code} {response.text}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to capture PayPal order: {str(e)}")
