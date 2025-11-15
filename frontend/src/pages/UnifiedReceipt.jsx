import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loader2, CheckCircle, Printer, MapPin, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

export default function UnifiedReceipt() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && !paypalLoaded) {
      loadPayPalButton();
    }
  }, [order, paypalLoaded]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/cart/order/${orderId}`);
      if (!response.ok) throw new Error('Order not found');
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const loadPayPalButton = () => {
    if (!window.paypal || paypalLoaded) return;

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const response = await fetch(`${backendUrl}/api/paypal/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: order.total.toFixed(2),
              reference_id: order.order_code
            })
          });
          const data = await response.json();
          return data.order_id;
        } catch (error) {
          console.error('Error creating PayPal order:', error);
          toast.error('Failed to initialize payment');
        }
      },
      onApprove: async (data) => {
        try {
          const response = await fetch(`${backendUrl}/api/paypal/capture-order/${data.orderID}`, {
            method: 'POST'
          });
          if (response.ok) {
            toast.success('Payment successful!');
            await fetch(`${backendUrl}/api/cart/order/${orderId}/payment`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'paid', paypal_order_id: data.orderID })
            });
            fetchOrder();
          } else {
            toast.error('Payment capture failed');
          }
        } catch (error) {
          console.error('Error capturing payment:', error);
          toast.error('Payment failed');
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        toast.error('Payment error occurred');
      }
    }).render('#paypal-button-container');

    setPaypalLoaded(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-xl">Order not found</p>
        </Card>
      </div>
    );
  }

  const tanningItems = order.items.filter(i => i.item_type === 'tanning');
  const lotionItems = order.items.filter(i => i.item_type === 'lotion');

  return (
    <div className="min-h-screen bg-muted py-8">
      <SEOHead title={`Order ${order.order_code} - Receipt`} />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Badge */}
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Order Code: <strong>{order.order_code}</strong></p>
        </div>

        {/* Receipt Card */}
        <Card className="p-8 mb-6 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-6 border-b pb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">Eastend Tanning & Laundry</h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />818 Coshocton Ave, Mt Vernon</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" />(740) 397-9632</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />8am-7:30pm daily</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Customer Information</h3>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {order.customer_name}</p>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Phone:</strong> {order.customer_phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Order Details</h3>
            
            {/* Tanning Packages */}
            {tanningItems.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Tanning Packages:</p>
                {tanningItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-2 border-b">
                    <div>
                      <p className="font-medium">{item.details.bed_label}</p>
                      <p className="text-muted-foreground text-xs">{item.details.package_label} × {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Lotions */}
            {lotionItems.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Tanning Lotions:</p>
                {lotionItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-2 border-b">
                    <div>
                      <p className="font-medium">{item.details.lotion_name}</p>
                      <p className="text-muted-foreground text-xs">{item.details.lotion_brand} × {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 border-t pt-4 mb-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sales Tax (7.25%):</span>
              <span>${order.sales_tax.toFixed(2)}</span>
            </div>
            {order.tan_tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tan Tax (10%):</span>
                <span>${order.tan_tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="text-center mb-6">
            {order.payment_status === 'paid' ? (
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                <CheckCircle className="inline mr-2 h-5 w-5" />PAID
              </Badge>
            ) : (
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Payment: {order.payment_status}
              </Badge>
            )}
          </div>

          {/* Redemption Instructions */}
          <div className="bg-primary/5 rounded-lg p-4 text-sm">
            <p className="font-bold mb-2">📋 How to Redeem:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>1. Bring this receipt (printed or on phone) to Eastend Tanning</li>
              <li>2. Show your order code: <strong>{order.order_code}</strong></li>
              <li>3. Pay at counter if not paid online, or redeem immediately</li>
              <li>4. For lotions: Pick up at front desk</li>
              <li>5. For tanning: Staff will assign you to your bed level</li>
            </ul>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="mr-2 h-4 w-4" />Print Receipt
          </Button>
          {order.payment_status !== 'paid' && (
            <div className="flex-1">
              <div id="paypal-button-container" className="min-h-[50px]"></div>
            </div>
          )}
        </div>

        {/* Info */}
        <Card className="p-6 text-center print:hidden">
          <p className="text-sm text-muted-foreground">
            Questions? Call us at <strong>(740) 397-9632</strong> or visit us at 818 Coshocton Ave, Mt Vernon, OH
          </p>
        </Card>
      </div>
    </div>
  );
}
