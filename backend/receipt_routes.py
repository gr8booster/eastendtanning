"""
Purchase Receipt Generation
Generates activation receipts for tanning packages and lotion purchases
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid
from routes import db

receipt_router = APIRouter(prefix="/api/receipts")

@receipt_router.get("/{session_id}")
async def get_receipt(session_id: str):
    """Get purchase receipt by Stripe session ID"""
    # Find transaction by session_id
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Receipt not found")
    
    # Get lead information
    lead_id = transaction.get('lead_id')
    lead = await db.leads.find_one({"id": lead_id}) if lead_id else None
    
    # Format receipt
    receipt = {
        "receipt_id": transaction.get('id'),
        "purchase_date": transaction.get('created_at'),
        "customer_name": lead.get('name') if lead else 'Valued Customer',
        "customer_email": lead.get('email') if lead else None,
        "items": [],
        "subtotal": transaction.get('original_amount', 0),
        "discount_amount": transaction.get('discount_amount', 0),
        "total": transaction.get('final_amount', 0),
        "payment_status": transaction.get('status', 'paid'),
        "activation_required": True,
        "activation_instructions": "Bring this receipt to Eastend Tanning & Laundry (102 Martinsburg Rd, Mount Vernon, OH) for activation.",
        "location": "Eastend - 102 Martinsburg Rd, Mount Vernon, OH 43050"
    }
    
    # Determine item type
    package_name = transaction.get('package_name')
    lotion_id = transaction.get('metadata', {}).get('lotion_id')
    
    if lotion_id:
        # Lotion purchase
        lotion = await db.lotions.find_one({"id": lotion_id})
        if lotion:
            receipt['items'].append({
                "type": "lotion",
                "name": lotion.get('name'),
                "description": f"{lotion.get('brand', '')} - Pickup at Eastend",
                "price": transaction.get('final_amount', 0)
            })
    elif package_name:
        # Tanning package
        receipt['items'].append({
            "type": "tanning",
            "name": package_name,
            "description": "Unlimited tanning sessions",
            "price": transaction.get('original_amount', 0)
        })
    
    return receipt

@receipt_router.post("/activate/{receipt_id}")
async def activate_receipt(receipt_id: str, staff_id: str):
    """Mark receipt as activated (for staff use)"""
    result = await db.payment_transactions.update_one(
        {"id": receipt_id},
        {"$set": {
            "activated": True,
            "activated_at": datetime.now(timezone.utc),
            "activated_by": staff_id
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Receipt not found")
    
    return {"success": True, "message": "Receipt activated successfully"}
