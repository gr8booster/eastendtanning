import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Zap, Download, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function BlackFridaySuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
  
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setProcessing(false);
      return;
    }

    // Capture the PayPal payment
    const capturePayment = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tanning/black-friday-capture/${orderId}`, {
          method: 'POST'
        });

        if (!response.ok) {
          throw new Error('Payment capture failed');
        }

        const result = await response.json();

        // Fetch order details
        const orderResponse = await fetch(`${backendUrl}/api/tanning/order/${orderId}`);
        if (!orderResponse.ok) throw new Error('Failed to fetch order');

        const orderData = await orderResponse.json();
        setOrder(orderData);
        setProcessing(false);

        // Celebrate!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast.success('Payment successful! Enjoy your BOGO deal!');

      } catch (err) {
        console.error('Payment capture error:', err);
        setError('Failed to process payment. Please contact support.');
        setProcessing(false);
      }
    };

    capturePayment();
  }, [orderId, backendUrl]);

  const downloadReceipt = () => {
    if (!order) return;

    const receiptText = `
╔════════════════════════════════════════════╗
║   EASTEND TANNING & LAUNDRY                ║
║   3010 E. Eastex Fwy                       ║
║   Beaumont, TX 77703                       ║
║   (409) 201-1900                           ║
╚════════════════════════════════════════════╝

BLACK FRIDAY BOGO RECEIPT
═══════════════════════════════════════════

Order #: ${order.order_code}
Date: ${new Date(order.created_at).toLocaleString()}

Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}

═══════════════════════════════════════════
PACKAGE DETAILS
═══════════════════════════════════════════

${order.package_name}
BUY 1 GET 1 FREE! 🎉

First Package ...................... $${order.package_price.toFixed(2)}
Second Package (FREE) ......... -$${order.savings.toFixed(2)}
Black Friday Pass .................. $${order.black_friday_pass.toFixed(2)}

                          Subtotal: $${order.subtotal.toFixed(2)}
                         Sales Tax: $${order.sales_tax.toFixed(2)}
                      Tanning Tax: $${order.tan_tax.toFixed(2)}
                   ═══════════════════════
                    TOTAL PAID: $${order.total.toFixed(2)}
                   ═══════════════════════

YOU SAVED: $${order.savings.toFixed(2)}! 💰

Payment Method: ${order.payment_method}
Status: PAID ✅

═══════════════════════════════════════════
IMPORTANT INSTRUCTIONS
═══════════════════════════════════════════

📍 Visit Us:
   Eastend Tanning & Laundry
   3010 E. Eastex Fwy, Beaumont, TX

⏰ Hours: 8:00 AM - 7:30 PM Daily

📱 Bring this receipt OR your order code
   to redeem your Black Friday BOGO deal!

✨ You're getting TWO packages for the 
   price of ONE plus your $5 pass!

Thank you for choosing Eastend Tanning! ☀️
`;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BlackFriday_Receipt_${order.order_code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Receipt downloaded!');
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800/50 border-yellow-400 border-2 p-8 text-center">
          <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
          <p className="text-gray-300">Please wait while we confirm your order</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800/50 border-red-500 border-2 p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/black-friday-checkout')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gray-800/50 border-yellow-400 border-2 p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-green-400 opacity-30 rounded-full blur-2xl"></div>
              <CheckCircle className="w-20 h-20 text-green-400 relative" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-yellow-400 text-xl font-semibold">
              Your Black Friday BOGO Deal is Confirmed!
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Code */}
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400 rounded-lg p-6 text-center">
                <p className="text-gray-300 text-sm mb-2">Your Order Code</p>
                <p className="text-3xl font-bold text-yellow-400 tracking-wider">{order.order_code}</p>
                <p className="text-xs text-gray-400 mt-2">Show this code when you visit</p>
              </div>

              {/* What You're Getting */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  What You're Getting:
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-white">
                    <span>{order.package_name}</span>
                    <span>${order.package_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Second Package (FREE!) 🎁</span>
                    <span>-${order.savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Black Friday Pass</span>
                    <span>${order.black_friday_pass.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-yellow-400/30"></div>
                  <div className="flex justify-between text-2xl font-bold text-yellow-400">
                    <span>Total Paid</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="bg-green-900/30 border border-green-500 rounded p-3 mt-3">
                    <p className="text-green-400 font-bold text-center">
                      YOU SAVED ${order.savings.toFixed(2)}!
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4">Customer Information</h3>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-semibold text-white">Name:</span> {order.customer_name}</p>
                  <p><span className="font-semibold text-white">Email:</span> {order.customer_email}</p>
                  <p><span className="font-semibold text-white">Phone:</span> {order.customer_phone}</p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4">📍 Next Steps:</h3>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-yellow-400 font-bold">1.</span>
                    <span>Visit <span className="text-white font-semibold">Eastend Tanning & Laundry</span> at 3010 E. Eastex Fwy, Beaumont, TX</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-400 font-bold">2.</span>
                    <span>Show your order code: <span className="text-yellow-400 font-mono">{order.order_code}</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-400 font-bold">3.</span>
                    <span>Enjoy your <span className="text-green-400 font-semibold">BOGO tanning packages</span>!</span>
                  </li>
                </ol>
                <div className="mt-4 pt-4 border-t border-yellow-400/30">
                  <p className="text-white font-semibold">⏰ Hours: 8:00 AM - 7:30 PM Daily</p>
                  <p className="text-white font-semibold">📱 Phone: (409) 201-1900</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={downloadReceipt}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
