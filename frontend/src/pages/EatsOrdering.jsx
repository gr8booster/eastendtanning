import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { Clock, MapPin, Check, Users, Utensils, Truck, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSEO } from '../components/EnhancedSEO';

export default function EatsOrdering() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [batchStatus, setBatchStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    quantity: 1,
    tip: 0,
    notes: ''
  });
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMenu();
    fetchBatchStatus();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/menu`);
      const data = await response.json();
      setMenu(data.menu || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/orders/current-batch`);
      const data = await response.json();
      setBatchStatus(data);
    } catch (error) {
      console.error('Error fetching batch status:', error);
    }
  };

  const tipOptions = [0, 2, 3, 5];

  const calculateTotal = () => {
    const itemPrice = 25.00;
    const deliveryFee = 5.99;
    const subtotal = itemPrice * orderDetails.quantity;
    const tax = subtotal * 0.08;
    return {
      subtotal,
      deliveryFee,
      tax: Math.round(tax * 100) / 100,
      tip: orderDetails.tip,
      total: Math.round((subtotal + deliveryFee + tax + orderDetails.tip) * 100) / 100
    };
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleProceedToCheckout = () => {
    if (!selectedItem) {
      toast.error('Please select a dish to vote for');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    if (!orderDetails.customer_name || !orderDetails.customer_phone || !orderDetails.customer_email || !orderDetails.customer_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_name: orderDetails.customer_name,
        customer_phone: orderDetails.customer_phone,
        customer_email: orderDetails.customer_email,
        customer_address: orderDetails.customer_address,
        menu_item_id: selectedItem.id,
        quantity: orderDetails.quantity,
        tip: orderDetails.tip,
        notes: orderDetails.notes
      };

      const response = await fetch(`${backendUrl}/api/eats/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        setCurrentOrder(data.order);
        setShowCheckout(false);
        setShowPayment(true);
        toast.success('Order created! Complete payment to confirm.');
      } else {
        toast.error(data.detail || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  // Load PayPal SDK
  useEffect(() => {
    if (showPayment && currentOrder && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AfDT4xEbDBYJbkqevhCTf0-hgchxACo55xgXMjgoMyElbFG0SaE52w1B066P_Jbn0YGNY6RSlUY31qob&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    }
  }, [showPayment, currentOrder, paypalLoaded]);

  // Render PayPal buttons
  useEffect(() => {
    if (paypalLoaded && currentOrder && window.paypal) {
      const container = document.getElementById('eats-paypal-container');
      if (container) {
        container.innerHTML = '';
        window.paypal.Buttons({
          style: { shape: 'rect', color: 'gold', label: 'pay', height: 50 },
          createOrder: async () => {
            const response = await fetch(`${backendUrl}/api/eats/paypal/create-order`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: currentOrder.id })
            });
            const data = await response.json();
            if (data.status === 'success') {
              return data.paypal_order_id;
            }
            throw new Error('Failed to create PayPal order');
          },
          onApprove: async (data) => {
            try {
              const response = await fetch(`${backendUrl}/api/eats/paypal/capture-order/${data.orderID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: currentOrder.id })
              });
              const result = await response.json();
              if (result.status === 'success') {
                toast.success('Payment successful! Your order is confirmed.');
                navigate(`/eats/order/${currentOrder.id}`);
              } else {
                toast.error('Payment capture failed');
              }
            } catch (err) {
              toast.error('Payment error. Please try again.');
            }
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            toast.error('Payment error. Please try again.');
          }
        }).render('#eats-paypal-container');
      }
    }
  }, [paypalLoaded, currentOrder, backendUrl, navigate]);

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <EnhancedSEO
        title="818 EATS - African Cuisine Weekly Vote | Mt Vernon OH"
        description="Vote for your favorite African dish this week! Ghana Jollof Rice, Egusi Stew, Suya & Plantains, or Waakye. $25 per meal with delivery."
        keywords="african food mt vernon, jollof rice, egusi stew, waakye, suya, 818 eats, weekly food delivery"
        canonical="/eats"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="uppercase tracking-widest text-xs font-semibold text-white/80 mb-3">Weekly African Cuisine</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" data-testid="eats-title">818 EATS</h1>
            <p className="text-xl sm:text-2xl mb-4 text-white/90">Vote for This Week's Dish & Get It Delivered!</p>
            <p className="text-base text-white/80 mb-8 max-w-2xl">
              Choose your favorite African dish. Once we reach 40 orders, your food is prepared fresh by our vendor partners and delivered to your door.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 font-semibold px-8"
              onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}
              data-testid="vote-now-btn"
            >
              Vote Now - $25/meal
            </Button>
          </div>
        </div>
      </section>

      {/* Batch Status Banner */}
      {batchStatus && (
        <section className="py-6 bg-[hsl(var(--muted))]">
          <div className="container mx-auto px-4">
            <Card className="p-6 border-2 border-[hsl(var(--secondary))]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[hsl(var(--secondary))]" />
                    <span className="font-semibold text-lg" data-testid="batch-week">{batchStatus.week}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress 
                        value={batchStatus.progress_percentage} 
                        className="h-4 bg-[hsl(var(--muted))]" 
                        data-testid="batch-progress"
                      />
                    </div>
                    <span className="font-bold text-xl text-[hsl(var(--secondary))]" data-testid="batch-count">
                      {batchStatus.current_orders}/40
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {batchStatus.progress_percentage}% to delivery! 
                    {batchStatus.leading_dish && (
                      <span className="ml-2">Leading: <strong>{batchStatus.leading_dish}</strong></span>
                    )}
                  </p>
                </div>
                {batchStatus.status === 'ready_for_fulfillment' && (
                  <Badge className="bg-green-600 text-white text-lg py-2 px-4">
                    Ready for Delivery!
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">1. Vote</h3>
              <p className="text-xs text-muted-foreground">Pick your favorite dish</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">2. Prepay</h3>
              <p className="text-xs text-muted-foreground">Secure your order</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">3. Reach 40</h3>
              <p className="text-xs text-muted-foreground">We batch orders weekly</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">4. Delivery</h3>
              <p className="text-xs text-muted-foreground">Fresh to your door</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section - Card Selection */}
      <section id="menu" className="py-12 bg-[hsl(var(--muted))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Vote for Your Dish</h2>
            <p className="text-muted-foreground">All dishes $25 • Select one to continue</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {menu.map((item) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    selectedItem?.id === item.id 
                      ? 'ring-4 ring-[hsl(var(--secondary))] shadow-xl scale-[1.02]' 
                      : 'hover:ring-2 hover:ring-[hsl(var(--secondary))]/50'
                  }`}
                  onClick={() => handleSelectItem(item)}
                  data-testid={`menu-card-${item.id}`}
                >
                  <div className="relative">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {selectedItem?.id === item.id && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[hsl(var(--secondary))] rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-white font-bold text-2xl">$25</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{item.prep_time_minutes} min prep
                      </div>
                      {batchStatus?.vote_summary?.[item.name] && (
                        <Badge variant="outline" className="text-xs">
                          {batchStatus.vote_summary[item.name]} votes
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Vote Button */}
          {selectedItem && (
            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-[hsl(var(--secondary))] hover:bg-[hsl(183_55%_36%)] text-white font-semibold px-12 py-6 text-lg"
                onClick={handleProceedToCheckout}
                data-testid="proceed-checkout-btn"
              >
                Vote for {selectedItem.name} - $25
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Complete Your Vote</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Selected Item Summary */}
              <Card className="p-4 bg-[hsl(var(--muted))]">
                <div className="flex gap-4">
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold">{selectedItem.name}</h3>
                    <p className="text-lg font-semibold text-[hsl(var(--secondary))]">$25.00</p>
                  </div>
                </div>
              </Card>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">Your Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name"
                      value={orderDetails.customer_name}
                      onChange={(e) => setOrderDetails({...orderDetails, customer_name: e.target.value})}
                      placeholder="John Doe"
                      data-testid="checkout-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input 
                      id="phone"
                      value={orderDetails.customer_phone}
                      onChange={(e) => setOrderDetails({...orderDetails, customer_phone: e.target.value})}
                      placeholder="(740) 555-1234"
                      data-testid="checkout-phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={orderDetails.customer_email}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_email: e.target.value})}
                    placeholder="john@example.com"
                    data-testid="checkout-email"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input 
                    id="address"
                    value={orderDetails.customer_address}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_address: e.target.value})}
                    placeholder="123 Main St, Mt Vernon, OH 43050"
                    data-testid="checkout-address"
                  />
                </div>
              </div>

              {/* Tip Selection */}
              <div className="space-y-3">
                <Label>Add a Tip</Label>
                <div className="flex gap-2">
                  {tipOptions.map((tip) => (
                    <Button
                      key={tip}
                      type="button"
                      variant={orderDetails.tip === tip ? 'default' : 'outline'}
                      className={orderDetails.tip === tip ? 'bg-[hsl(var(--secondary))]' : ''}
                      onClick={() => setOrderDetails({...orderDetails, tip})}
                      data-testid={`tip-${tip}`}
                    >
                      {tip === 0 ? 'No Tip' : `$${tip}`}
                    </Button>
                  ))}
                  <Input 
                    type="number"
                    placeholder="Custom"
                    className="w-20"
                    min="0"
                    step="0.5"
                    onChange={(e) => setOrderDetails({...orderDetails, tip: parseFloat(e.target.value) || 0})}
                    data-testid="tip-custom"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Special Requests (optional)</Label>
                <Textarea 
                  id="notes"
                  value={orderDetails.notes}
                  onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
                  placeholder="Any dietary restrictions or special requests?"
                  rows={2}
                  data-testid="checkout-notes"
                />
              </div>

              {/* Order Summary */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{selectedItem.name}</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>${totals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  {totals.tip > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tip</span>
                      <span>${totals.tip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[hsl(var(--secondary))]">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              <Button 
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(42_92%_50%)] text-[hsl(var(--primary-foreground))] font-semibold py-6 text-lg"
                onClick={handlePlaceOrder}
                disabled={submitting}
                data-testid="place-order-btn"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  'Continue to Payment'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Delivery scheduled once we reach 40 orders this week
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Complete Payment</DialogTitle>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-6">
              <Card className="p-4 bg-[hsl(var(--muted))]">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-3xl font-bold text-[hsl(var(--secondary))]">
                    ${currentOrder.total.toFixed(2)}
                  </p>
                  <p className="text-sm mt-2">Order #{currentOrder.order_number}</p>
                </div>
              </Card>

              <div id="eats-paypal-container" data-testid="paypal-container" className="min-h-[60px]">
                {!paypalLoaded && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--secondary))]" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by PayPal. Your order will be confirmed after payment.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Ready to Vote?</h2>
          <p className="mb-6 text-white/90">Join {batchStatus?.current_orders || 0} others who've already voted this week!</p>
          <Button 
            size="lg" 
            className="bg-white text-[hsl(var(--secondary))] hover:bg-white/90 font-semibold"
            onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}
            data-testid="footer-vote-btn"
          >
            Choose Your Dish Now
          </Button>
        </div>
      </section>
    </div>
  );
}
