import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2, Package, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

const TANNING_PRICES = {
  level1: { single: 10, five_pack: 45, ten_pack: 85, month_unlimited: 50 },
  level2: { single: 12, five_pack: 55, ten_pack: 105, month_unlimited: 60 },
  level3: { single: 14, five_pack: 65, ten_pack: 125, month_unlimited: 70 },
  level4: { single: 16, five_pack: 75, ten_pack: 145, month_unlimited: 80 },
  matrix: { single: 18, five_pack: 85, ten_pack: 165, month_unlimited: 90 },
  wellness: { single: 20, five_pack: 95, ten_pack: 185, month_unlimited: 100 }
};

const BED_LEVELS = [
  { value: 'level1', label: 'Level 1 (3,840W)', desc: 'Beginners, fair skin' },
  { value: 'level2', label: 'Level 2 (5,000W)', desc: 'Most popular' },
  { value: 'level3', label: 'Level 3 (10,750W)', desc: 'High-pressure' },
  { value: 'level4', label: 'Level 4 (13,995W)', desc: 'Premium' },
  { value: 'matrix', label: 'Matrix (40,740W)', desc: 'Ultimate power' },
  { value: 'wellness', label: 'Wellness Bed', desc: 'Red light therapy' }
];

const PACKAGE_TYPES = [
  { value: 'single', label: 'Single Session' },
  { value: 'five_pack', label: '5-Pack' },
  { value: 'ten_pack', label: '10-Pack' },
  { value: 'month_unlimited', label: 'Monthly Unlimited' }
];

export default function UnifiedCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', customer_id: null });
  const [lotions, setLotions] = useState([]);
  const [selectedBedLevel, setSelectedBedLevel] = useState('level2');
  const [selectedPackage, setSelectedPackage] = useState('ten_pack');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Check if pre-populated from consultation
    if (location.state) {
      const { customerInfo, recommendedItems } = location.state;
      if (customerInfo) {
        setCustomer(customerInfo);
      }
      if (recommendedItems && recommendedItems.length > 0) {
        setCart(recommendedItems);
        toast.success('Items added from your consultation!');
      }
    }
    fetchLotions();
  }, [location]);

  const fetchLotions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/lotions`);
      const data = await response.json();
      setLotions(data);
    } catch (error) {
      console.error('Error fetching lotions:', error);
    }
  };

  const addTanningToCart = () => {
    const price = TANNING_PRICES[selectedBedLevel][selectedPackage];
    const bedInfo = BED_LEVELS.find(b => b.value === selectedBedLevel);
    const packageInfo = PACKAGE_TYPES.find(p => p.value === selectedPackage);
    
    const item = {
      item_id: `tan-${Date.now()}`,
      item_type: 'tanning',
      details: {
        bed_level: selectedBedLevel,
        bed_label: bedInfo.label,
        package_type: selectedPackage,
        package_label: packageInfo.label
      },
      price: price,
      quantity: 1
    };
    
    setCart([...cart, item]);
    toast.success('Tanning package added to cart');
  };

  const addLotionToCart = (lotion) => {
    const item = {
      item_id: `lot-${lotion.id}-${Date.now()}`,
      item_type: 'lotion',
      details: {
        lotion_id: lotion.id,
        lotion_name: lotion.name,
        lotion_brand: lotion.brand || ''
      },
      price: lotion.price,
      quantity: 1
    };
    
    setCart([...cart, item]);
    toast.success(`${lotion.name} added to cart`);
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.item_id === itemId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.item_id !== itemId));
    toast.info('Item removed from cart');
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let tanningSubtotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      if (item.item_type === 'tanning') {
        tanningSubtotal += itemTotal;
      }
    });
    
    const salesTax = subtotal * 0.0725;
    const tanTax = tanningSubtotal * 0.10;
    const totalTax = salesTax + tanTax;
    const total = subtotal + totalTax;
    
    return { subtotal, salesTax, tanTax, totalTax, total };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!customer.name || !customer.email || !customer.phone) {
      toast.error('Please fill in all customer information');
      return;
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/cart/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_id: customer.customer_id,
          items: cart
        })
      });
      
      if (!response.ok) throw new Error('Failed to create order');
      
      const order = await response.json();
      toast.success('Order created successfully!');
      navigate(`/receipt/${order.order_id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-muted pb-20">
      <SEOHead title="Checkout - Eastend Tanning & Laundry" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2"><ShoppingCart className="inline mr-3 h-8 w-8" />Checkout</h1>
          <p className="text-white/90">Add tanning packages and lotions to your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Add Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Tanning Package */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4"><Package className="inline mr-2 h-6 w-6" />Add Tanning Package</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Bed Level</Label>
                  <Select value={selectedBedLevel} onValueChange={setSelectedBedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BED_LEVELS.map(bed => (
                        <SelectItem key={bed.value} value={bed.value}>
                          {bed.label} - {bed.desc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Package Type</Label>
                  <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PACKAGE_TYPES.map(pkg => (
                        <SelectItem key={pkg.value} value={pkg.value}>
                          {pkg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  ${TANNING_PRICES[selectedBedLevel]?.[selectedPackage] || 0}
                </span>
                <Button onClick={addTanningToCart}>
                  <Plus className="mr-2 h-4 w-4" />Add to Cart
                </Button>
              </div>
            </Card>

            {/* Add Lotions */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4"><Sparkles className="inline mr-2 h-6 w-6" />Add Tanning Lotions</h2>
              {lotions.length === 0 ? (
                <p className="text-muted-foreground">No lotions available</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {lotions.map(lotion => (
                    <div key={lotion.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{lotion.name}</h3>
                          {lotion.brand && <p className="text-sm text-muted-foreground">{lotion.brand}</p>}
                        </div>
                        <Badge className="bg-primary">${lotion.price}</Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => addLotionToCart(lotion)} className="w-full mt-2">
                        <Plus className="mr-1 h-3 w-3" />Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Cart & Checkout */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Your Information</h2>
              <div className="space-y-3">
                <div>
                  <Label>Name *</Label>
                  <Input value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="Your name" />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="your@email.com" />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} placeholder="(740) 555-1234" />
                </div>
              </div>
            </Card>

            {/* Cart */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Your Cart ({cart.length})</h2>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.item_id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-sm">
                            {item.item_type === 'tanning' ? item.details.bed_label : item.details.lotion_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.item_type === 'tanning' ? item.details.package_label : item.details.lotion_brand}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.item_id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.item_id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.item_id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Order Summary */}
            {cart.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax (7.25%):</span>
                    <span>${totals.salesTax.toFixed(2)}</span>
                  </div>
                  {totals.tanTax > 0 && (
                    <div className="flex justify-between">
                      <span>Tan Tax (10%):</span>
                      <span>${totals.tanTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full mt-4 bg-gradient-to-r from-primary to-secondary" size="lg">
                  Complete Order
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
