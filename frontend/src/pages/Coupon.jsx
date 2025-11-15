import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Ticket, MapPin, Phone, Clock, Printer, AlertCircle, DollarSign } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { toast } from 'sonner';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Coupon() {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDiscount, setActiveDiscount] = useState(null);

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  useEffect(() => {
    if (!coupon) return;

    // Determine active discount tier
    const now = new Date();
    const created = new Date(coupon.created_at);
    const hoursElapsed = (now - created) / (1000 * 60 * 60);
    
    let currentTier = null;
    if (hoursElapsed <= 24) currentTier = coupon.discount_tiers[0]; // 15%
    else if (hoursElapsed <= 48) currentTier = coupon.discount_tiers[1]; // 10%
    else if (hoursElapsed <= 168) currentTier = coupon.discount_tiers[2]; // 5%
    
    setActiveDiscount(currentTier);

    // Load PayPal Hosted Button (official React implementation)
    if (window.paypal) {
      window.paypal.HostedButtons({
        hostedButtonId: "4VYZ3ABTC3C6G",
      }).render("#paypal-button-container");
    }
  }, [coupon]);

  const fetchCoupon = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/coupons/${couponId}`);
      if (!res.ok) throw new Error('Coupon not found');
      const data = await res.json();
      setCoupon(data);
    } catch (error) {
      console.error('Failed to fetch coupon:', error);
      setError(error.message);
      toast.error(error.message);
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
          <p className="text-muted-foreground">Loading your coupon...</p>
        </div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Coupon Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || 'This coupon does not exist or has been removed.'}</p>
          <Button onClick={() => navigate('/order-drinks')}>Return to Menu</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <SEOHead title={`Reservation ${coupon.coupon_code} - Fizze Drinks`} />

      <style>{`@media print { .no-print { display: none !important; } @page { margin: 0.5cm; size: letter; } }`}</style>

      <div className="max-w-3xl mx-auto">
        {/* Action Buttons */}
        <div className="no-print flex justify-between mb-4">
          <Button variant="outline" onClick={() => navigate('/order-drinks')}>← Back</Button>
          <Button onClick={handlePrint} className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]">
            <Printer className="w-4 h-4 mr-2" />Print
          </Button>
        </div>

        {/* Coupon Card */}
        <Card className="overflow-hidden border-4 border-[hsl(42_92%_55%)] shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white p-6 text-center">
            <Ticket className="w-10 h-10 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Fizze Drinks Reservation</h1>
            <p className="text-sm text-white/90">Eastend Tanning & Laundry</p>
          </div>

          {/* Coupon Code */}
          <div className="bg-amber-50 border-y-2 border-dashed border-amber-300 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">COUPON CODE</p>
            <p className="text-3xl font-bold font-mono tracking-wider" data-testid="coupon-code">{coupon.coupon_code}</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Current Discount */}
            {activeDiscount && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{activeDiscount.label} ACTIVE!</p>
                <p className="text-sm text-green-600">Pay within {activeDiscount.hours_remaining} hours</p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4" />Your Order</h3>
              {coupon.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>${coupon.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (7.25%):</span><span>${coupon.sales_tax.toFixed(2)}</span></div>
                {coupon.tan_tax > 0 && <div className="flex justify-between"><span>Tan Tax (10%):</span><span>${coupon.tan_tax.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-1">
                  <span>Total:</span><span data-testid="total-before-discount">${coupon.total_before_discount.toFixed(2)}</span>
                </div>
                {activeDiscount && (
                  <>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({activeDiscount.label}):</span><span>-${activeDiscount.discount_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-green-700 border-t-2 border-green-300 pt-1">
                      <span>Pay Today:</span><span data-testid="final-price">${activeDiscount.final_price.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Discount Tiers */}
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="font-bold text-sm mb-2">💰 Pay Faster = Save More!</p>
              <div className="space-y-1 text-xs">
                {coupon.discount_tiers.map((tier, i) => (
                  <div key={i} className="flex justify-between">
                    <span>Within {tier.hours_remaining}h:</span>
                    <span className="font-semibold">{tier.label} = ${tier.final_price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-2"><MapPin className="w-4 h-4" />Bring Coupon To:</h3>
              <div className="bg-muted rounded p-3 text-sm space-y-1">
                <p className="font-semibold">Eastend Tanning & Laundry</p>
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />818 Coshocton Ave, Mt Vernon, OH</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" /><a href="tel:+17403979632">(740) 397-9632</a></p>
                <p className="flex items-center gap-1"><Clock className="w-3 h-3" />Open Daily 8:00 AM - 7:30 PM</p>
              </div>
            </div>

            {/* PayPal Payment */}
            <div className="no-print border-t pt-4">
              <h3 className="font-bold mb-2 text-center">💳 Pay Online with PayPal</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-center mb-3">
                  Amount: <span className="font-bold text-lg">${activeDiscount ? activeDiscount.final_price.toFixed(2) : coupon.total_before_discount.toFixed(2)}</span>
                </p>
                <div id="paypal-button-container" className="flex justify-center"></div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Include coupon code <span className="font-mono font-bold">{coupon.coupon_code}</span> in payment note
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Or pay at the counter when you pick up</p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded p-3 text-xs">
              <p className="font-bold mb-1">📋 How to Use:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
                <li>Print this or show on your phone</li>
                <li>Bring to Eastend within 7 days</li>
                <li>Pay at counter (or use PayPal above)</li>
                <li>Enjoy your Fizze drinks!</li>
              </ol>
            </div>

            {/* Expiry */}
            <p className="text-center text-xs text-muted-foreground">
              Expires: {new Date(coupon.expires_at).toLocaleDateString()} at {new Date(coupon.expires_at).toLocaleTimeString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
