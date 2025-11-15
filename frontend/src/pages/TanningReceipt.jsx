import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, Printer, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function TanningReceipt() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order) return;

    // Load PayPal button for tanning payment
    const loadPayPalButton = () => {
      if (window.paypal && window.paypal.Buttons) {
        window.paypal.Buttons({
          createOrder: async () => {
            try {
              const response = await fetch(`${backendUrl}/api/paypal/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  coupon_id: order.order_id,
                  amount: order.total,
                  coupon_code: order.order_code
                })
              });
              
              const data = await response.json();
              if (response.ok) {
                return data.order_id;
              } else {
                throw new Error(data.detail || 'Failed to create order');
              }
            } catch (error) {
              console.error('Create order error:', error);
              toast.error('Payment initialization failed');
              throw error;
            }
          },
          
          onApprove: async (data) => {
            try {
              const response = await fetch(`${backendUrl}/api/paypal/capture-order/${data.orderID}`, {
                method: 'POST'
              });
              
              const captureData = await response.json();
              if (response.ok) {
                toast.success('Payment successful! Thank you for your purchase.');
                // Could update order status here
              } else {
                throw new Error(captureData.detail || 'Payment capture failed');
              }
            } catch (error) {
              console.error('Capture error:', error);
              toast.error('Payment processing failed');
            }
          },
          
          onError: (err) => {
            console.error('PayPal error:', err);
            toast.error('Payment error occurred');
          },
          
          onCancel: () => {
            toast.info('Payment cancelled');
          }
        }).render("#paypal-button-container-tanning");
      } else {
        setTimeout(loadPayPalButton, 500);
      }
    };
    
    setTimeout(loadPayPalButton, 1000);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/tanning/order/${orderId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(42_92%_55%)] mx-auto mb-4" />
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Button onClick={() => navigate('/tanning')}>Return to Tanning</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <SEOHead title={`Tanning Order ${order.order_code}`} />

      <style>{`@media print { .no-print { display: none !important; } @page { margin: 0.5cm; } }`}</style>

      <div className="max-w-3xl mx-auto">
        {/* Action Buttons */}
        <div className="no-print flex justify-between mb-4">
          <Button variant="outline" onClick={() => navigate('/tanning')}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />Print
          </Button>
        </div>

        {/* Success Message */}
        <Card className="no-print p-6 mb-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-green-900 mb-1">Order Created Successfully!</h3>
              <p className="text-green-800 text-sm">
                Complete your payment below or bring this receipt to Eastend Tanning & Laundry.
              </p>
            </div>
          </div>
        </Card>

        {/* Order Card */}
        <Card className="overflow-hidden border-4 border-[hsl(42_92%_55%)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Tanning Package Order</h1>
            <p className="text-sm">Eastend Tanning & Laundry</p>
          </div>

          {/* Order Code */}
          <div className="bg-amber-50 border-y-2 border-dashed border-amber-300 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">ORDER CODE</p>
            <p className="text-3xl font-bold font-mono tracking-wider">{order.order_code}</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Package Details */}
            <div>
              <h3 className="font-bold mb-2">Your Package</h3>
              <div className="bg-muted rounded p-3">
                <p className="font-semibold">{order.level_label}</p>
                <p className="text-sm text-muted-foreground">{order.package_label}</p>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-bold mb-2">Pricing</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Sales Tax (7.25%):</span><span>${order.sales_tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tan Tax (10%):</span><span>${order.tan_tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-1">
                  <span>Total:</span><span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-bold mb-2">Customer Information</h3>
              <div className="bg-muted rounded p-3 text-sm space-y-1">
                <p><span className="font-semibold">Name:</span> {order.customer_name}</p>
                <p><span className="font-semibold">Email:</span> {order.customer_email}</p>
                <p><span className="font-semibold">Phone:</span> {order.customer_phone}</p>
              </div>
            </div>

            {/* PayPal Payment */}
            <div className="no-print border-t pt-4">
              <h3 className="font-bold mb-2 text-center">💳 Pay Now with PayPal</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-center mb-3">Amount: <span className="font-bold text-lg">${order.total.toFixed(2)}</span></p>
                <div id="paypal-button-container-tanning" className="flex justify-center"></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-muted rounded p-3 text-xs">
              <p className="font-bold mb-1">📋 How to Redeem:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
                <li>Pay online with PayPal above, or</li>
                <li>Print this receipt and bring to Eastend</li>
                <li>Pay at counter (cash or card)</li>
                <li>Start tanning immediately!</li>
              </ol>
            </div>

            {/* Location */}
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-semibold">Eastend Tanning & Laundry</p>
              <p>818 Coshocton Ave, Mt Vernon, OH 43050</p>
              <p>(740) 397-9632</p>
              <p>Open Daily: 8:00 AM - 7:30 PM</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
