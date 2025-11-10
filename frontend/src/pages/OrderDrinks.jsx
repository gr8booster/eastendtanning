import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Phone, Clock, Package } from 'lucide-react';
import { SEOHead, createProductSchema } from '../components/SEOHead';
import { toast } from 'sonner';
import { trackEvent, trackPurchase } from '../utils/analytics';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function OrderDrinks() {
  const [drinks, setDrinks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStep, setOrderStep] = useState('menu'); // 'menu', 'cart', 'checkout', 'confirmation'
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_method: 'pickup',
    delivery_address: '',
    special_instructions: '',
    tip_amount: 0
  });
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);

  useEffect(() => {
    fetchDrinks();
    fetchDeliverySettings();
  }, []);

  const fetchDeliverySettings = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/settings`);
      if (res.ok) {
        const data = await res.json();
        setDeliveryEnabled(data.delivery_enabled);
        // If delivery is disabled and user selected delivery, reset to pickup
        if (!data.delivery_enabled && orderForm.delivery_method !== 'pickup') {
          setOrderForm({...orderForm, delivery_method: 'pickup'});
        }
      }
    } catch (error) {
      console.error('Failed to fetch delivery settings:', error);
    }
  };

  const fetchDrinks = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/fizze/menu`);
      const data = await res.json();
      setDrinks(data);
    } catch (error) {
      console.error('Failed to fetch drinks:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (drink) => {
    const existingItem = cart.find(item => item.drink_id === drink.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.drink_id === drink.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        drink_id: drink.id,
        drink_name: drink.name,
        quantity: 1,
        price: drink.price || 5.99,
        customizations: {}
      }]);
    }
    toast.success(`${drink.name} added to cart`);
    trackEvent('add_to_cart', 'E-commerce', drink.name, drink.price);
  };

  const updateQuantity = (drinkId, change) => {
    setCart(cart.map(item =>
      item.drink_id === drinkId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (drinkId) => {
    setCart(cart.filter(item => item.drink_id !== drinkId));
    toast.info('Item removed from cart');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.0825; // 8.25% Ohio tax
  };

  const getDeliveryFee = () => {
    const fees = {
      pickup: 0,
      doordash: 2.99,
      grubhub: 3.49,
      ubereats: 2.49
    };
    return fees[orderForm.delivery_method] || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const deliveryFee = getDeliveryFee();
    const tip = orderForm.tip_amount || 0;
    return subtotal + tax + deliveryFee + tip;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        ...orderForm,
        items: cart,
        tip_amount: parseFloat(orderForm.tip_amount) || 0
      };

      const res = await fetch(`${backendUrl}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Order failed');

      const order = await res.json();
      setOrderConfirmation(order);
      setOrderStep('confirmation');
      setCart([]);
      toast.success(`Order ${order.order_number} placed successfully!`);
      
      trackPurchase(order.order_number, order.total, cart.map(item => ({
        item_id: item.drink_id,
        item_name: item.drink_name,
        price: item.price,
        quantity: item.quantity
      })));
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading menu...</p></div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Order Fizze Drinks Online - Delivery & Pickup Available"
        description="Order fresh Fizze bubble tea online for pickup or delivery via DoorDash, GrubHub, and Uber Eats. 34+ drinks including milk teas, fruit teas, and blended ice."
        keywords="bubble tea delivery, boba tea online, Fizze drinks order, DoorDash bubble tea, GrubHub boba"
        schemaMarkup={drinks[0] ? createProductSchema(drinks[0]) : null}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-2">Order Fizze Drinks</h1>
              <p className="text-white/90">Fresh bubble tea delivered or ready for pickup in 15-20 minutes</p>
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
                  <Badge className="absolute -top-2 -right-2 bg-red-500">{cartItemCount}</Badge>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Menu View */}
        {orderStep === 'menu' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Our Menu</h2>
              <p className="text-muted-foreground">Choose from our selection of premium bubble tea drinks</p>
            </div>

            <div className="space-y-8">
              {Object.entries(drinks).map(([category, categoryDrinks]) => (
                <div key={category}>
                  <h3 className="text-xl font-bold mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryDrinks.map((drink) => (
                      <Card key={drink.id} className="p-4 hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-lg mb-2">{drink.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{drink.flavor_profile}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[hsl(42_92%_55%)]">${drink.price?.toFixed(2) || '5.99'}</span>
                          <Button
                            onClick={() => addToCart(drink)}
                            size="sm"
                            className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]"
                            data-testid={`add-to-cart-${drink.id}`}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart View */}
        {orderStep === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <Button variant="outline" onClick={() => setOrderStep('menu')}>Continue Shopping</Button>
            </div>

            {cart.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => setOrderStep('menu')}>Browse Menu</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.drink_id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold">{item.drink_name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.drink_id, -1)}
                            data-testid={`decrease-${item.drink_id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.drink_id, 1)}
                            data-testid={`increase-${item.drink_id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="w-24 text-right font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.drink_id)}
                          data-testid={`remove-${item.drink_id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card className="p-6 bg-muted">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.25%):</span>
                      <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setOrderStep('checkout')}
                    className="w-full mt-4 bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]"
                    data-testid="proceed-to-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Checkout View */}
        {orderStep === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <Button variant="outline" onClick={() => setOrderStep('cart')}>Back to Cart</Button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      value={orderForm.customer_name}
                      onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                      required
                      data-testid="customer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={orderForm.customer_email}
                      onChange={(e) => setOrderForm({...orderForm, customer_email: e.target.value})}
                      required
                      data-testid="customer-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({...orderForm, customer_phone: e.target.value})}
                      placeholder="740-397-9632"
                      required
                      data-testid="customer-phone"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Delivery Method</h3>
                {!deliveryEnabled && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800">⚠️ Delivery is temporarily unavailable. Pickup only at this time.</p>
                  </div>
                )}
                <Select
                  value={orderForm.delivery_method}
                  onValueChange={(val) => setOrderForm({...orderForm, delivery_method: val})}
                  disabled={!deliveryEnabled && orderForm.delivery_method !== 'pickup'}
                >
                  <SelectTrigger data-testid="delivery-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup"><Package className="w-4 h-4 inline mr-2" />Pickup (15-20 min) - FREE</SelectItem>
                    {deliveryEnabled && (
                      <>
                        <SelectItem value="doordash">DoorDash Delivery - $2.99</SelectItem>
                        <SelectItem value="grubhub">GrubHub Delivery - $3.49</SelectItem>
                        <SelectItem value="ubereats">Uber Eats Delivery - $2.49</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                {orderForm.delivery_method !== 'pickup' && (
                  <div className="mt-4">
                    <Label htmlFor="delivery_address">Delivery Address *</Label>
                    <Textarea
                      id="delivery_address"
                      value={orderForm.delivery_address}
                      onChange={(e) => setOrderForm({...orderForm, delivery_address: e.target.value})}
                      required={orderForm.delivery_method !== 'pickup'}
                      rows={3}
                      data-testid="delivery-address"
                    />
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>${getDeliveryFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-lg py-6"
                data-testid="place-order-button"
              >
                Place Order - ${calculateTotal().toFixed(2)}
              </Button>
            </form>
          </div>
        )}

        {/* Confirmation View */}
        {orderStep === 'confirmation' && orderConfirmation && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-xl text-muted-foreground">Order #{orderConfirmation.order_number}</p>
            </div>

            <Card className="p-6 text-left mb-6">
              <h3 className="font-bold text-lg mb-4">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge>{orderConfirmation.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Method:</span>
                  <span className="capitalize">{orderConfirmation.delivery_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Ready:</span>
                  <span>{new Date(orderConfirmation.estimated_ready_time).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">${orderConfirmation.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {orderConfirmation.delivery_method === 'pickup' && (
              <Card className="p-6 bg-blue-50 mb-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-bold mb-2">Pickup Location</h4>
                    <p className="text-sm">Eastend Tanning & Laundry</p>
                    <p className="text-sm">123 Eastend Ave, Mount Vernon, OH</p>
                    <p className="text-sm flex items-center gap-2 mt-2">
                      <Phone className="w-4 h-4" />
                      (740) 397-9632
                    </p>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      Open 8am - 6pm
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={() => { setOrderStep('menu'); setOrderConfirmation(null); }}>Order More</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>Back to Home</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
