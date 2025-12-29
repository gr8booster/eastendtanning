import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Clock, MapPin, Check, Users, Utensils, Truck, DollarSign, Loader2, Star, Building2, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSEO } from '../components/EnhancedSEO';

export default function EatsOrdering() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [rankings, setRankings] = useState({ rank_1: null, rank_2: null, rank_3: null });
  const [deliveryPreference, setDeliveryPreference] = useState('first_available');
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [partners, setPartners] = useState([]);
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
    fetchPartners();
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

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/partners`);
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
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

  const handleRankItem = (itemId, rank) => {
    // Remove item from any existing rank
    const newRankings = { ...rankings };
    Object.keys(newRankings).forEach(key => {
      if (newRankings[key] === itemId) {
        newRankings[key] = null;
      }
    });
    
    // If clicking on same rank, just remove (toggle off)
    if (rankings[rank] === itemId) {
      setRankings(newRankings);
      return;
    }
    
    // Assign to new rank
    newRankings[rank] = itemId;
    setRankings(newRankings);
  };

  const getItemRank = (itemId) => {
    if (rankings.rank_1 === itemId) return 1;
    if (rankings.rank_2 === itemId) return 2;
    if (rankings.rank_3 === itemId) return 3;
    return null;
  };

  const getRankedItemName = (rank) => {
    const itemId = rankings[rank];
    if (!itemId) return null;
    const item = menu.find(m => m.id === itemId);
    return item?.name || null;
  };

  const isRankingComplete = () => {
    return rankings.rank_1 && rankings.rank_2 && rankings.rank_3;
  };

  const handleProceedToCheckout = () => {
    if (!isRankingComplete()) {
      toast.error('Please rank your top 3 dishes');
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
        rank_1: rankings.rank_1,
        rank_2: rankings.rank_2,
        rank_3: rankings.rank_3,
        delivery_preference: deliveryPreference,
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
        title="818 EATS - African Cuisine Weekly Delivery | Mt Vernon OH"
        description="Rank your favorite African dishes and get fresh food delivered! Ghana Jollof Rice, Egusi Stew, Suya & Plantains, or Waakye. $25 per meal."
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
            <p className="text-xl sm:text-2xl mb-4 text-white/90">Rank Your Favorites & Get Fresh African Food Delivered!</p>
            <p className="text-base text-white/80 mb-8 max-w-2xl">
              Choose your top 3 dishes. Decide if you want only your #1 choice or the first dish that's ready. Fresh, authentic African cuisine delivered to your door.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 font-semibold px-8"
              onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}
              data-testid="rank-now-btn"
            >
              Rank Your Dishes - $25/meal
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-[hsl(var(--primary))]">1</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Rank Top 3</h3>
              <p className="text-xs text-muted-foreground">Choose your favorites in order</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Prepay</h3>
              <p className="text-xs text-muted-foreground">Secure your spot</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">We Prepare</h3>
              <p className="text-xs text-muted-foreground">Fresh when ready</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Delivery</h3>
              <p className="text-xs text-muted-foreground">Fresh to your door</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section - Ranking Selection */}
      <section id="menu" className="py-12 bg-[hsl(var(--muted))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Rank Your Top 3 Dishes</h2>
            <p className="text-muted-foreground">All dishes $25 • Click to assign rank 1, 2, or 3</p>
          </div>

          {/* Ranking Summary */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 rounded-lg ${rankings.rank_1 ? 'bg-amber-100 border-2 border-amber-400' : 'bg-gray-100'}`}>
                  <div className="text-2xl font-bold text-amber-600">1st</div>
                  <div className="text-sm truncate">{getRankedItemName('rank_1') || 'Not selected'}</div>
                </div>
                <div className={`p-3 rounded-lg ${rankings.rank_2 ? 'bg-gray-200 border-2 border-gray-400' : 'bg-gray-100'}`}>
                  <div className="text-2xl font-bold text-gray-600">2nd</div>
                  <div className="text-sm truncate">{getRankedItemName('rank_2') || 'Not selected'}</div>
                </div>
                <div className={`p-3 rounded-lg ${rankings.rank_3 ? 'bg-orange-100 border-2 border-orange-400' : 'bg-gray-100'}`}>
                  <div className="text-2xl font-bold text-orange-600">3rd</div>
                  <div className="text-sm truncate">{getRankedItemName('rank_3') || 'Not selected'}</div>
                </div>
              </div>
            </Card>
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
              {menu.map((item) => {
                const rank = getItemRank(item.id);
                return (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden transition-all duration-200 ${
                      rank ? 'ring-4 shadow-xl scale-[1.02]' : 'hover:shadow-lg'
                    } ${
                      rank === 1 ? 'ring-amber-400' :
                      rank === 2 ? 'ring-gray-400' :
                      rank === 3 ? 'ring-orange-400' : ''
                    }`}
                    data-testid={`menu-card-${item.id}`}
                  >
                    <div className="relative">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      {rank && (
                        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xl ${
                          rank === 1 ? 'bg-amber-500' :
                          rank === 2 ? 'bg-gray-500' :
                          'bg-orange-500'
                        }`}>
                          {rank}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="text-white font-bold text-2xl">$25</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~{item.prep_time_minutes} min prep
                        </div>
                      </div>
                      {/* Rank Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={rank === 1 ? 'default' : 'outline'}
                          className={rank === 1 ? 'bg-amber-500 hover:bg-amber-600' : ''}
                          onClick={() => handleRankItem(item.id, 'rank_1')}
                          data-testid={`rank-1-${item.id}`}
                        >
                          1st
                        </Button>
                        <Button 
                          size="sm" 
                          variant={rank === 2 ? 'default' : 'outline'}
                          className={rank === 2 ? 'bg-gray-500 hover:bg-gray-600' : ''}
                          onClick={() => handleRankItem(item.id, 'rank_2')}
                          data-testid={`rank-2-${item.id}`}
                        >
                          2nd
                        </Button>
                        <Button 
                          size="sm" 
                          variant={rank === 3 ? 'default' : 'outline'}
                          className={rank === 3 ? 'bg-orange-500 hover:bg-orange-600' : ''}
                          onClick={() => handleRankItem(item.id, 'rank_3')}
                          data-testid={`rank-3-${item.id}`}
                        >
                          3rd
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Proceed Button */}
          {isRankingComplete() && (
            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-[hsl(var(--secondary))] hover:bg-[hsl(183_55%_36%)] text-white font-semibold px-12 py-6 text-lg"
                onClick={handleProceedToCheckout}
                data-testid="proceed-checkout-btn"
              >
                Continue with My Rankings - $25
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Partner Restaurants Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Partner Restaurants</h2>
            <p className="text-muted-foreground">Authentic African cuisine from our trusted partners</p>
          </div>
          
          {partners.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {partners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.business_name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-[hsl(var(--primary))]/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-[hsl(var(--primary))]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{partner.business_name}</h3>
                        <Badge variant="outline" className="mt-1">{partner.cuisine_type}</Badge>
                      </div>
                      {partner.featured && (
                        <Badge className="bg-amber-500 text-white">
                          <Star className="w-3 h-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{partner.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{partner.city}, {partner.state}</span>
                      </div>
                      {partner.website && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--secondary))] hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Partner Restaurants Coming Soon</h3>
              <p className="text-muted-foreground mb-4">We're building a network of authentic African restaurants. Check back soon!</p>
              <p className="text-sm text-muted-foreground">Are you an African restaurant owner? <a href="#partner-signup" className="text-[hsl(var(--secondary))] hover:underline">Join our network</a></p>
            </Card>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Complete Your Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Rankings Summary */}
            <Card className="p-4 bg-[hsl(var(--muted))]">
              <h4 className="font-semibold mb-3">Your Rankings</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <span>{getRankedItemName('rank_1')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <span>{getRankedItemName('rank_2')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <span>{getRankedItemName('rank_3')}</span>
                </div>
              </div>
            </Card>

            {/* Delivery Preference */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Delivery Preference</Label>
              <RadioGroup value={deliveryPreference} onValueChange={setDeliveryPreference} className="space-y-3">
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setDeliveryPreference('first_available')}>
                  <RadioGroupItem value="first_available" id="first_available" className="mt-1" />
                  <div>
                    <Label htmlFor="first_available" className="font-medium cursor-pointer">First Available (Recommended)</Label>
                    <p className="text-sm text-muted-foreground">Get whichever of your ranked dishes is ready first. Faster delivery!</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setDeliveryPreference('top_choice_only')}>
                  <RadioGroupItem value="top_choice_only" id="top_choice_only" className="mt-1" />
                  <div>
                    <Label htmlFor="top_choice_only" className="font-medium cursor-pointer">#1 Choice Only</Label>
                    <p className="text-sm text-muted-foreground">Wait until your top choice ({getRankedItemName('rank_1')}) is available. May take longer.</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

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
                  <span>African Cuisine (Your Selection)</span>
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
              {deliveryPreference === 'first_available' 
                ? "You'll receive whichever of your ranked dishes is available first"
                : `You'll wait for ${getRankedItemName('rank_1')} to be available`
              }
            </p>
          </div>
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="mb-6 text-white/90">Rank your favorites and get authentic African cuisine delivered!</p>
          <Button 
            size="lg" 
            className="bg-white text-[hsl(var(--secondary))] hover:bg-white/90 font-semibold"
            onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}
            data-testid="footer-rank-btn"
          >
            Start Ranking Now
          </Button>
        </div>
      </section>
    </div>
  );
}
