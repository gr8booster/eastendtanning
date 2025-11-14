import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Ticket, MapPin, Phone, Clock, Printer, CheckCircle, 
  AlertCircle, Calendar, DollarSign, Tag, Package 
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { toast } from 'sonner';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Coupon() {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [activeDiscount, setActiveDiscount] = useState(null);

  useEffect(() => {
    fetchCoupon();
  }, [couponId]);

  useEffect(() => {
    if (!coupon) return;

    // Load PayPal Hosted Button
    if (window.paypal && window.paypal.HostedButtons) {
      window.paypal.HostedButtons({
        hostedButtonId: "4VYZ3ABTC3C6G"
      }).render("#paypal-container-4VYZ3ABTC3C6G");
    }
  }, [coupon]);

  useEffect(() => {
    if (!coupon) return;

    const updateCountdown = () => {
      const now = new Date();
      const created = new Date(coupon.created_at);
      const expiresAt = new Date(coupon.expires_at);
      
      const hoursElapsed = (now - created) / (1000 * 60 * 60);
      
      // Determine active discount tier
      let currentTier = null;
      if (hoursElapsed <= 24) {
        currentTier = coupon.discount_tiers[0]; // 15%
      } else if (hoursElapsed <= 48) {
        currentTier = coupon.discount_tiers[1]; // 10%
      } else if (hoursElapsed <= 168) {
        currentTier = coupon.discount_tiers[2]; // 5%
      }
      setActiveDiscount(currentTier);
      
      // Calculate time remaining until expiry
      const msRemaining = expiresAt - now;
      if (msRemaining > 0) {
        const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining({ days: daysRemaining, hours: hoursRemaining, minutes: minutesRemaining });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [coupon]);

  const fetchCoupon = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/coupons/${couponId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Coupon not found');
        }
        throw new Error('Failed to load coupon');
      }
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

  const handlePrint = () => {
    window.print();
  };

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

  const isExpired = timeRemaining && timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0;

  return (
    <div className="min-h-screen bg-muted py-12 px-4">
      <SEOHead
        title={`Reservation Coupon ${coupon.coupon_code} - Fizze Drinks`}
        description="Your Fizze Drinks reservation coupon. Bring this to Eastend Tanning & Laundry to claim your order with discount!"
      />

      {/* Print Styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .break-inside-avoid { break-inside: avoid; }
          @page { margin: 1cm; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - No Print */}
        <div className="no-print flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/order-drinks')}>
            ← Back to Menu
          </Button>
          <Button onClick={handlePrint} className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]">
            <Printer className="w-4 h-4 mr-2" />
            Print Coupon
          </Button>
        </div>

        {/* Success Message - No Print */}
        {!coupon.redeemed && !isExpired && (
          <Card className="no-print p-6 mb-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-green-900 mb-1">🎉 Reservation Successful!</h3>
                <p className="text-green-800 text-sm">
                  Your coupon has been generated. Print it or show this page on your phone at Eastend Tanning & Laundry within 7 days.
                  {activeDiscount && (
                    <span className="font-semibold">
                      {' '}Pay within the next {activeDiscount.hours_remaining} hours to save {activeDiscount.label}!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Expired Warning - No Print */}
        {isExpired && (
          <Card className="no-print p-6 mb-6 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-red-900 mb-1">⚠️ Coupon Expired</h3>
                <p className="text-red-800 text-sm">
                  This coupon expired and is no longer valid. Please create a new reservation to order Fizze drinks.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Coupon Card */}
        <Card className="break-inside-avoid overflow-hidden border-4 border-[hsl(42_92%_55%)] shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white p-6 text-center">
            <Ticket className="w-12 h-12 mx-auto mb-3" />
            <h1 className="text-3xl font-bold mb-2">Fizze Drinks Reservation</h1>
            <p className="text-white/90">Eastend Tanning & Laundry</p>
          </div>

          {/* Coupon Code */}
          <div className="bg-amber-50 border-y-2 border-dashed border-amber-300 p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">COUPON CODE</p>
            <p className="text-3xl font-bold tracking-wider font-mono" data-testid="coupon-code">{coupon.coupon_code}</p>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Active Discount Banner */}
            {activeDiscount && !isExpired && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                <Tag className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-700 mb-1">{activeDiscount.label} DISCOUNT ACTIVE</p>
                <p className="text-sm text-green-600">
                  Pay within {activeDiscount.hours_remaining} hours to save ${activeDiscount.discount_amount.toFixed(2)}!
                </p>
              </div>
            )}

            {/* All Discount Tiers */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Discount Tiers
              </h3>
              <div className="space-y-2">
                {coupon.discount_tiers.map((tier, index) => {
                  const isActive = activeDiscount && activeDiscount.discount_percent === tier.discount_percent;
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                        isActive 
                          ? 'bg-green-50 border-green-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div>
                        <p className={`font-bold ${isActive ? 'text-green-700' : ''}`}>
                          {tier.label} {isActive && '← CURRENT'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pay within {tier.hours_remaining} hours
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${isActive ? 'text-green-700' : ''}`}>
                          ${tier.final_price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Save ${tier.discount_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Your Order
              </h3>
              <div className="space-y-2">
                {coupon.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t-2 border-dashed pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${coupon.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (7.25%):</span>
                  <span>${coupon.sales_tax.toFixed(2)}</span>
                </div>
                {coupon.tan_tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tan Tax (10%):</span>
                    <span>${coupon.tan_tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total Before Discount:</span>
                  <span data-testid=\"total-before-discount">${coupon.total_before_discount.toFixed(2)}</span>
                </div>
                {activeDiscount && (
                  <>
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Current Discount ({activeDiscount.label}):</span>
                      <span>-${activeDiscount.discount_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-2xl text-green-700 pt-2 border-t-2 border-green-300">
                      <span>Pay Today:</span>
                      <span data-testid=\"final-price">${activeDiscount.final_price.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Expiry Info */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-900 mb-1">Expiry Information</p>
                  {!isExpired ? (
                    <>
                      <p className="text-sm text-amber-800">
                        Valid for <span className="font-semibold">7 days</span> from creation
                      </p>
                      {timeRemaining && (
                        <p className="text-sm text-amber-700 font-medium mt-1">
                          Time remaining: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-red-600 font-semibold">This coupon has expired</p>
                  )}
                </div>
              </div>
            </div>

            {/* Redemption Location */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Redemption Location
              </h3>
              <Card className="p-4 bg-gradient-to-br from-amber-50 to-teal-50">
                <p className="font-bold text-lg mb-2">Eastend Tanning & Laundry</p>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    818 Coshocton Ave, Mt Vernon, OH 43050
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href=\"tel:+17403979632" className="hover:underline">(740) 397-9632</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Open Daily: 8:00 AM - 7:30 PM
                  </p>
                </div>
              </Card>
            </div>

            {/* PayPal Payment Option - No Print */}
            <div className="no-print">
              <h3 className="font-bold text-lg mb-3">💳 Pay Online with PayPal</h3>
              <Card className="p-6 bg-blue-50 border-blue-200">
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer to pay online? Use PayPal to complete your payment now and secure your discount!
                </p>
                {/* PayPal Button Container */}
                <div id=\"paypal-container-4VYZ3ABTC3C6G" className="flex justify-center"></div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  After payment, show this coupon when picking up your order
                </p>
              </Card>
            </div>

            {/* Instructions */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-bold mb-2">📋 How to Redeem:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Print this coupon or show it on your phone</li>
                <li>Bring it to Eastend Tanning & Laundry within 7 days</li>
                <li>Pay at the counter (cash, card, or PayPal above)</li>
                <li>The faster you pay, the bigger your discount!</li>
                <li>Enjoy your fresh Fizze drinks!</li>
              </ol>
            </div>

            {/* Customer Info (if provided) */}
            {(coupon.customer_name || coupon.customer_email || coupon.customer_phone) && (
              <div className="text-sm text-muted-foreground border-t pt-4">
                <p className="font-semibold mb-1">Customer Information:</p>
                {coupon.customer_name && <p>Name: {coupon.customer_name}</p>}
                {coupon.customer_email && <p>Email: {coupon.customer_email}</p>}
                {coupon.customer_phone && <p>Phone: {coupon.customer_phone}</p>}
              </div>
            )}

            {/* Footer - Dates */}
            <div className="text-xs text-muted-foreground text-center border-t pt-3">
              <p>Created: {new Date(coupon.created_at).toLocaleString()}</p>
              <p>Expires: {new Date(coupon.expires_at).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Print Instructions */}
        <div className="no-print mt-6 text-center text-sm text-muted-foreground">
          <p>💡 <span className="font-semibold">Tip:</span> Save paper by showing this page on your phone at checkout!</p>
        </div>
      </div>
    </div>
  );
}
