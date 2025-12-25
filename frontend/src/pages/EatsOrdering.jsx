import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Clock, MapPin, ShoppingCart, Plus, Minus, Trash2, Info, User, Phone, Mail, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSEO } from '../components/EnhancedSEO';

export default function EatsOrdering() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    quantity: 1,
    tip: 0,
    notes: ''
  });
  const [batchStatus, setBatchStatus] = useState(null);
  const [showVendorSignup, setShowVendorSignup] = useState(false);
  const [vendorData, setVendorData] = useState({
    business_name: '',
    owner_name: '',
    phone: '',
    email: '',
    password: '',
    cuisine_type: '',
    description: '',
    address: '',
    license_type: '',
    license_number: '',
    license_file_base64: ''
  });
  const [licenseFile, setLicenseFile] = useState(null);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/menu`);
      const data = await response.json();
      setMenu(data.menu || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(c => {
      if (c.id === itemId) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? {...c, quantity: newQty} : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    if (!orderDetails.delivery_address || !orderDetails.delivery_distance_miles) return 0;
    const baseFee = 3.99;
    const perMileFee = 1.50;
    const rushFee = orderDetails.eta_hours === 1 ? 2.00 : 0.00;
    return baseFee + (orderDetails.delivery_distance_miles * perMileFee) + rushFee;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee() + calculateTax();
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!orderDetails.customer_name || !orderDetails.customer_phone) {
      toast.error('Please fill in your contact information');
      return;
    }

    try {
      const orderData = {
        ...orderDetails,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${backendUrl}/api/eats/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success(`Order ${data.order.order_number} placed successfully!`);
        setCart([]);
        setShowCheckout(false);
        navigate(`/eats/order/${data.order.id}`);
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setVendorData({...vendorData, license_file_base64: reader.result});
      setLicenseFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleVendorSignup = async (e) => {
    e.preventDefault();
    
    if (!vendorData.license_file_base64) {
      toast.error('Please upload your license');
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        toast.success(data.message, { duration: 8000 });
        setShowVendorSignup(false);
        setVendorData({
          business_name: '',
          owner_name: '',
          phone: '',
          email: '',
          password: '',
          cuisine_type: '',
          description: '',
          address: '',
          license_type: '',
          license_number: '',
          license_file_base64: ''
        });
        setLicenseFile(null);
      } else {
        toast.error(data.detail || 'Failed to submit signup');
      }
    } catch (error) {
      console.error('Error with vendor signup:', error);
      toast.error('Failed to submit signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <EnhancedSEO
        title="818 EATS - African Cuisine Pre-Order | Mt Vernon OH"
        description="Pre-order authentic African cuisine including Ghana Jollof Rice, Egusi Stew, and Fried Plantains. Choose 1 or 2 hour pickup window."
        keywords="african food mt vernon, jollof rice, egusi stew, plantains, food pre-order, 818 eats"
        canonical="/eats"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold mb-4" data-testid="eats-title">818 EATS</h1>
            <p className="text-2xl mb-6">Authentic African Cuisine - Pre-Order & Pick Up</p>
            <p className="text-lg text-white/90 mb-8">
              Order now, pick up in 1-2 hours. Fresh, made-to-order African dishes prepared with love.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}>
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setShowVendorSignup(true)}>
                Become a Vendor
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/vendor-portal')}>
                Vendor Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Hero Images */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Featured Dishes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {menu.slice(0, 3).map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <p className="text-sm text-white/90">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">1. Choose Dishes</h3>
              <p className="text-sm text-muted-foreground">Browse our menu and add items to cart</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">2. Select ETA</h3>
              <p className="text-sm text-muted-foreground">Choose 1 or 2 hour pickup window</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">3. Complete Order</h3>
              <p className="text-sm text-muted-foreground">Provide contact info and confirm</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">4. Pick Up</h3>
              <p className="text-sm text-muted-foreground">We'll prepare and have it ready!</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Food Blog Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Food Stories from People of Eastend</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the stories behind our dishes, meet our vendors, and explore African cuisine culture
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate('/blog?category=food')}>
              Read Food Blog →
            </Button>
          </div>
        </div>
      </section>

      {/* Client Newsletter Signup */}
      <section className="py-12 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Stay Updated on New Menu Items!</h2>
          <p className="text-lg mb-6">Join our mailing list and be the first to know when new dishes are available</p>
          <form 
            className="max-w-md mx-auto flex gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              try {
                const response = await fetch(`${backendUrl}/api/eats/clients/signup`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (data.status === 'success') {
                  toast.success(data.message);
                  e.target.reset();
                } else {
                  toast.error(data.detail || 'Signup failed');
                }
              } catch (error) {
                toast.error('Failed to join mailing list');
              }
            }}
          >
            <Input 
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-white text-orange-600 hover:bg-gray-100">
              Join List
            </Button>
          </form>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Our Menu</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {menu.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`menu-item-${item.id}`}>
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{item.name}</h3>
                    <Badge variant={item.available ? 'default' : 'secondary'} className={item.available ? 'bg-green-500' : ''}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{item.prep_time_minutes} min prep
                      </div>
                    </div>
                  </div>
                  {item.available ? (
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(item)}
                      data-testid={`add-to-cart-${item.id}`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        Currently Unavailable
                      </Badge>
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={async () => {
                          const email = prompt('Enter your email to vote for this item:');
                          if (!email) return;
                          try {
                            const response = await fetch(`${backendUrl}/api/eats/menu/${item.id}/vote`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ menu_item_id: item.id, customer_email: email })
                            });
                            const data = await response.json();
                            if (data.status === 'success') {
                              toast.success(data.message);
                              fetchMenu();
                            } else {
                              toast.error(data.detail || 'Vote failed');
                            }
                          } catch (error) {
                            toast.error('Failed to vote');
                          }
                        }}
                      >
                        👍 Vote for This Item ({item.votes || 0} votes)
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            size="lg" 
            className="shadow-2xl"
            onClick={() => setShowCheckout(true)}
            data-testid="view-cart-button"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({cart.length}) - ${calculateTotal().toFixed(2)}
          </Button>
        </div>
      )}

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Cart Items */}
            <div>
              <h3 className="font-bold mb-4">Order Items</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="font-bold">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Your Name *</Label>
                  <Input 
                    id="customer_name"
                    value={orderDetails.customer_name}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_name: e.target.value})}
                    placeholder="John Doe"
                    data-testid="customer-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input 
                    id="customer_phone"
                    value={orderDetails.customer_phone}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_phone: e.target.value})}
                    placeholder="(740) 123-4567"
                    data-testid="customer-phone-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customer_email">Email (Optional)</Label>
                  <Input 
                    id="customer_email"
                    type="email"
                    value={orderDetails.customer_email}
                    onChange={(e) => setOrderDetails({...orderDetails, customer_email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* ETA Selection */}
            <div>
              <Label htmlFor="eta_hours">Pickup Time *</Label>
              <Select 
                value={orderDetails.eta_hours.toString()} 
                onValueChange={(value) => setOrderDetails({...orderDetails, eta_hours: parseInt(value)})}
              >
                <SelectTrigger id="eta_hours" data-testid="eta-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour (+$2.00 rush fee)</SelectItem>
                  <SelectItem value="2">2 Hours (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Address (Optional) */}
            <div>
              <Label htmlFor="delivery_address">Delivery Address (Optional)</Label>
              <Input 
                id="delivery_address"
                value={orderDetails.delivery_address}
                onChange={(e) => setOrderDetails({...orderDetails, delivery_address: e.target.value})}
                placeholder="123 Main St, Mt Vernon, OH"
              />
              {orderDetails.delivery_address && (
                <div className="mt-2">
                  <Label htmlFor="delivery_distance">Distance (miles)</Label>
                  <Input 
                    id="delivery_distance"
                    type="number"
                    step="0.1"
                    value={orderDetails.delivery_distance_miles}
                    onChange={(e) => setOrderDetails({...orderDetails, delivery_distance_miles: parseFloat(e.target.value)})}
                    placeholder="5.0"
                  />
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea 
                id="notes"
                value={orderDetails.notes}
                onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
                placeholder="Any allergies or special requests?"
                rows={3}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              {calculateDeliveryFee() > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span>${calculateDeliveryFee().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (8%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted-foreground pt-2">
                <Info className="w-4 h-4 inline mr-1" />
                You can add a tip when you pick up your order
              </div>
            </div>

            {/* Place Order Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePlaceOrder}
              data-testid="place-order-button"
            >
              Place Order - ${calculateTotal().toFixed(2)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vendor Signup Modal */}
      <Dialog open={showVendorSignup} onOpenChange={setShowVendorSignup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Become a Food Vendor</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleVendorSignup} className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input 
                id="business_name"
                value={vendorData.business_name}
                onChange={(e) => setVendorData({...vendorData, business_name: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="owner_name">Owner Name *</Label>
              <Input 
                id="owner_name"
                value={vendorData.owner_name}
                onChange={(e) => setVendorData({...vendorData, owner_name: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor_phone">Phone *</Label>
                <Input 
                  id="vendor_phone"
                  value={vendorData.phone}
                  onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vendor_email">Email *</Label>
                <Input 
                  id="vendor_email"
                  type="email"
                  value={vendorData.email}
                  onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="vendor_password">Password *</Label>
              <Input 
                id="vendor_password"
                type="password"
                value={vendorData.password}
                onChange={(e) => setVendorData({...vendorData, password: e.target.value})}
                placeholder="Create a password for your vendor portal"
                required
              />
            </div>

            <div>
              <Label htmlFor="cuisine_type">Cuisine Type *</Label>
              <Input 
                id="cuisine_type"
                value={vendorData.cuisine_type}
                onChange={(e) => setVendorData({...vendorData, cuisine_type: e.target.value})}
                placeholder="e.g., West African, Nigerian, Ethiopian"
                required
              />
            </div>

            <div>
              <Label htmlFor="vendor_description">Business Description *</Label>
              <Textarea 
                id="vendor_description"
                value={vendorData.description}
                onChange={(e) => setVendorData({...vendorData, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="vendor_address">Business Address *</Label>
              <Input 
                id="vendor_address"
                value={vendorData.address}
                onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
                required
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-amber-900">License Requirement *</h4>
              
              <div>
                <Label htmlFor="license_type">License Type *</Label>
                <Select 
                  value={vendorData.license_type} 
                  onValueChange={(value) => setVendorData({...vendorData, license_type: value})}
                >
                  <SelectTrigger id="license_type">
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cottage_food">Cottage Food License</SelectItem>
                    <SelectItem value="food_truck">Food Truck License</SelectItem>
                    <SelectItem value="health_department">Health Department Permit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="license_number">License Number *</Label>
                <Input 
                  id="license_number"
                  value={vendorData.license_number}
                  onChange={(e) => setVendorData({...vendorData, license_number: e.target.value})}
                  placeholder="Enter license/permit number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="license_file">Upload License Copy * (PDF, JPG, PNG)</Label>
                <Input 
                  id="license_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleLicenseUpload}
                  required
                />
                {licenseFile && (
                  <p className="text-xs text-green-600 mt-1">✓ {licenseFile.name}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Important Delivery Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Package food to stay warm for 30-60 minutes</li>
                <li>Use leak-proof containers</li>
                <li>We are a long-distance delivery service</li>
                <li>Ensure packaging can handle transport</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
