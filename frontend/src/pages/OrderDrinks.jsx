import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, Ticket } from 'lucide-react';
import { SEOHead, createProductSchema } from '../components/SEOHead';
import { toast } from 'sonner';
import { trackEvent } from '../utils/analytics';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function OrderDrinks() {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStep, setOrderStep] = useState('menu'); // 'menu', 'cart', 'info'
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/fizze/menu`);
      const data = await res.json();
      // API returns drinks grouped by category, flatten to array
      const allDrinks = Object.values(data).flat();
      setDrinks(allDrinks);
    } catch (error) {
      console.error('Failed to fetch drinks:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (drink) => {
    const existingItem = cart.find(item => item.id === drink.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === drink.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: drink.id,
        name: drink.name,
        category: 'fizze',
        quantity: 1,
        price: drink.price || 5.99
      }]);
    }
    toast.success(`${drink.name} added to cart`);
    trackEvent('add_to_cart', 'E-commerce', drink.name, drink.price);
  };

  const updateQuantity = (drinkId, change) => {
    setCart(cart.map(item =>
      item.id === drinkId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (drinkId) => {
    setCart(cart.filter(item => item.id !== drinkId));
    toast.info('Item removed from cart');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleGenerateCoupon = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setGenerating(true);

    try {
      const couponData = {
        items: cart,
        customer_name: customerInfo.customer_name || null,
        customer_email: customerInfo.customer_email || null,
        customer_phone: customerInfo.customer_phone || null
      };

      const res = await fetch(`${backendUrl}/api/coupons/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to generate coupon');
      }

      const coupon = await res.json();
      
      toast.success('Coupon generated! Redirecting...');
      trackEvent('coupon_generated', 'E-commerce', coupon.coupon_code, coupon.total_before_discount);
      
      // Redirect to coupon page
      navigate(`/coupon/${coupon.coupon_id}`);
      
      // Clear cart
      setCart([]);
      setCustomerInfo({ customer_name: '', customer_email: '', customer_phone: '' });
      
    } catch (error) {
      console.error('Failed to generate coupon:', error);
      toast.error(error.message || 'Failed to generate coupon. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading menu...</p></div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Order Fizze Drinks Online - Reserve & Pay In-Store"
        description="Reserve Fizze bubble tea online and pay in-store. Browse 52+ drinks including milk teas, fruit teas, smoothies, and dirty sodas."
        keywords="reserve bubble tea, Fizze drinks order, boba tea Mt Vernon, order ahead"
        schemaMarkup={drinks[0] ? createProductSchema(drinks[0]) : null}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">Order Fizze Drinks</h1>
              <p className="text-white/90">Reserve online, pay in-store & get discount for fast payment</p>
            </div>
            {orderStep === 'menu' && (
              <Button
                onClick={() => setOrderStep('cart')}
                size="lg"
                className="bg-white text-[hsl(42_92%_55%)] hover:bg-white/90 relative"
                data-testid="view-cart-button"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Menu View */}
        {orderStep === 'menu' && (
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-3">Browse Our Menu</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Add items to cart, generate a reservation coupon, and bring it to Eastend Tanning & Laundry. 
                <span className="font-semibold text-[hsl(42_92%_55%)]">
                  {' '}Pay within 24 hours for 15% off, 48 hours for 10% off, or 7 days for 5% off!
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drinks.map((drink) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-testid={`drink-card-${drink.id}`}
                >
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{drink.name}</h3>
                          <Badge variant="secondary" className="mt-1">{drink.category}</Badge>
                        </div>
                        <span className="text-xl font-bold text-[hsl(42_92%_55%)]">${drink.price.toFixed(2)}</span>
                      </div>
                      {drink.flavor_profile && (
                        <p className="text-sm text-muted-foreground mb-4">{drink.flavor_profile}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(drink)}
                      className="w-full bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]"
                      data-testid={`add-to-cart-${drink.id}`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Cart View */}
        {orderStep === 'cart' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <Button variant="outline" onClick={() => setOrderStep('menu')} data-testid="back-to-menu">
                Continue Shopping
              </Button>
            </div>

            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">Add some delicious Fizze drinks to get started!</p>
                <Button onClick={() => setOrderStep('menu')}>Browse Menu</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-4" data-testid={`cart-item-${item.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            data-testid={`decrease-qty-${item.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold w-8 text-center" data-testid={`qty-${item.id}`}>{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            data-testid={`increase-qty-${item.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="font-bold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          data-testid={`remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card className="p-6 bg-gradient-to-br from-amber-50 to-teal-50 border-2 border-[hsl(42_92%_55%)]">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Subtotal (before tax):</span>
                      <span className="font-bold">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">*Tax will be calculated on your coupon at time of pickup</p>
                  </div>
                  
                  <Button
                    onClick={() => setOrderStep('info')}
                    className="w-full mt-4 bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-lg py-6"
                    data-testid="proceed-to-info"
                  >
                    <Receipt className="w-5 h-5 mr-2" />
                    Generate Reservation Coupon
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Customer Info & Generate Coupon */}
        {orderStep === 'info' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Information (Optional)</h2>
              <Button variant="outline" onClick={() => setOrderStep('cart')}>Back to Cart</Button>
            </div>

            <form onSubmit={handleGenerateCoupon} className="space-y-6">
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">
                  Providing your contact info is optional but recommended so we can notify you about your order and any updates.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name</Label>
                    <Input
                      id="customer_name"
                      value={customerInfo.customer_name}
                      onChange={(e) => setCustomerInfo({...customerInfo, customer_name: e.target.value})}
                      placeholder="John Doe (optional)"
                      data-testid="customer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={customerInfo.customer_email}
                      onChange={(e) => setCustomerInfo({...customerInfo, customer_email: e.target.value})}
                      placeholder="john@example.com (optional)"
                      data-testid="customer-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      value={customerInfo.customer_phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, customer_phone: e.target.value})}
                      placeholder="740-397-9632 (optional)"
                      data-testid="customer-phone"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-50 to-teal-50">
                <h3 className="font-bold text-lg mb-3">📋 Order Summary</h3>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-amber-200">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    *Your coupon will show exact pricing with 7.25% sales tax calculated. 
                    Bring coupon to Eastend Tanning & Laundry to claim your order and pay with discount!
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={generating || cart.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-lg py-6"
                  data-testid="generate-coupon-button"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Generating Coupon...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5 mr-2" />
                      Generate My Coupon
                    </>
                  )}
                </Button>
              </Card>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
