import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, MapPin, Clock, Package } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Receipt() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchReceipt();
    }
  }, [sessionId]);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/receipts/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setReceipt(data);
      } else {
        console.error('Receipt not found');
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Receipt Not Found</h2>
          <p className="text-muted-foreground mb-4">We couldn't find your purchase receipt.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F59E0B]/5 to-[#14B8A6]/5 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="p-8 text-center bg-gradient-to-br from-white to-gray-50">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Purchase Successful!</h1>
          <p className="text-muted-foreground">Thank you for your purchase, {receipt.customer_name}</p>
        </Card>

        {/* Activation Instructions */}
        {receipt.activation_required && (
          <Card className="p-6 border-2 border-[#F59E0B] bg-gradient-to-br from-[#F59E0B]/5 to-[#14B8A6]/5">
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-[#F59E0B] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Activation Required</h3>
                <p className="text-sm mb-4">{receipt.activation_instructions}</p>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#14B8A6] mt-0.5" />
                  <span>{receipt.location}</span>
                </div>
                <div className="flex items-start gap-2 text-sm mt-2">
                  <Clock className="w-4 h-4 text-[#14B8A6] mt-0.5" />
                  <span>Open Daily: 6:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Receipt Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">Receipt</h2>
            <Badge variant="secondary">{receipt.payment_status}</Badge>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Receipt ID:</span>
              <span className="font-mono">{receipt.receipt_id?.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span>{new Date(receipt.purchase_date).toLocaleDateString()}</span>
            </div>
            {receipt.customer_email && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span>{receipt.customer_email}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold mb-2">Items Purchased</h3>
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="font-bold">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            {receipt.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${receipt.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Paid:</span>
              <span className="text-[#14B8A6]">${receipt.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => window.print()} variant="outline" className="flex-1">
            Print Receipt
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
