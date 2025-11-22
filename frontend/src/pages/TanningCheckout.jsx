import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Tanning pricing data
const TANNING_PRICES = {
  'level1': { single: 10, five_pack: 45, six_pack: 54, ten_pack: 85, month_unlimited: 50, vip_unlimited: 40 },
  'level2': { single: 12, five_pack: 55, six_pack: 66, ten_pack: 105, month_unlimited: 60, vip_unlimited: 50 },
  'level3': { single: 14, five_pack: 65, six_pack: 78, ten_pack: 125, month_unlimited: 70, vip_unlimited: 60 },
  'level4': { single: 16, five_pack: 75, six_pack: 90, ten_pack: 145, month_unlimited: 80, vip_unlimited: 70 },
  'matrix': { single: 18, five_pack: 85, six_pack: 100, ten_pack: 165, month_unlimited: 194.99, vip_unlimited: 174.99 },
  'standup': { single: 15, five_pack: 70, six_pack: 90, ten_pack: 145, month_unlimited: 119.99, vip_unlimited: 85.99 },
  'wellness': { single: 20, five_pack: 95, six_pack: 110, ten_pack: 185, month_unlimited: 100, vip_unlimited: 90 }
};

const LEVELS = [
  { value: 'level1', label: 'Level 1 - Entry Bed' },
  { value: 'level2', label: 'Level 2 - Standard Bed' },
  { value: 'level3', label: 'Level 3 - Premium Bed' },
  { value: 'level4', label: 'Level 4 - High-Power Bed' },
  { value: 'matrix', label: 'Matrix Bed' },
  { value: 'standup', label: 'Stand-Up Bed' },
  { value: 'wellness', label: 'Wellness - Red Light Therapy' }
];

const PACKAGES = [
  { value: 'single', label: 'Single Session' },
  { value: 'five_pack', label: '5-Pack' },
  { value: 'six_pack', label: '6-Pack Special' },
  { value: 'ten_pack', label: '10-Pack' },
  { value: 'month_unlimited', label: 'Monthly Unlimited' },
  { value: 'vip_unlimited', label: 'VIP Unlimited' }
];

export default function TanningCheckout() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('level2');
  const [selectedPackage, setSelectedPackage] = useState('single');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [processing, setProcessing] = useState(false);

  const getPrice = () => {
    return TANNING_PRICES[selectedLevel]?.[selectedPackage] || 0;
  };

  const calculateTaxes = () => {
    const subtotal = getPrice();
    const salesTax = subtotal * 0.0725; // 7.25%
    const tanTax = subtotal * 0.10; // 10%
    const total = subtotal + salesTax + tanTax;
    
    return {
      subtotal: subtotal.toFixed(2),
      salesTax: salesTax.toFixed(2),
      tanTax: tanTax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all your information');
      return;
    }

    setProcessing(true);

    try {
      const taxes = calculateTaxes();
      const orderData = {
        level: selectedLevel,
        package: selectedPackage,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        subtotal: parseFloat(taxes.subtotal),
        sales_tax: parseFloat(taxes.salesTax),
        tan_tax: parseFloat(taxes.tanTax),
        total: parseFloat(taxes.total)
      };

      const res = await fetch(`${backendUrl}/api/tanning/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to create order');
      }

      const order = await res.json();
      
      toast.success('Order created! Redirecting to payment...');
      
      // Redirect to tanning receipt page with PayPal
      navigate(`/tanning-receipt/${order.order_id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const taxes = calculateTaxes();

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Tanning Package Checkout - Eastend Tanning & Laundry"
        description="Purchase tanning packages online. Choose your bed level and package, pay with PayPal."
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/tanning')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tanning
          </Button>
          <h1 className="font-serif text-4xl font-bold">Tanning Package Checkout</h1>
          <p className="text-white/90 mt-2">Select your bed level and package, then pay securely with PayPal</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Package Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Select Your Package</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="level">Bed Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="package">Package Type</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger id="package">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGES.map(pkg => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label} - ${TANNING_PRICES[selectedLevel]?.[pkg.value] || 0}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="740-397-9632"
                />
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-teal-50">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-semibold">
                  {LEVELS.find(l => l.value === selectedLevel)?.label} - {PACKAGES.find(p => p.value === selectedPackage)?.label}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${taxes.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Sales Tax (7.25%):</span>
                <span>${taxes.salesTax}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tan Tax (10%):</span>
                <span>${taxes.tanTax}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${taxes.total}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-lg py-6"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to PayPal Payment
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              You will be redirected to PayPal to complete your payment securely
            </p>
          </Card>
        </form>
      </div>
    </div>
  );
}
