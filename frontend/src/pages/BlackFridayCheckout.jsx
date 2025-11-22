import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Zap, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function BlackFridayCheckout() {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [processing, setProcessing] = useState(false);

  const BED_LEVELS = [
    { value: 'level1', label: 'Level 1 - Entry Bed', monthly: 50 },
    { value: 'level2', label: 'Level 2 - Standard Bed', monthly: 60 },
    { value: 'level3', label: 'Level 3 - Premium Bed', monthly: 70 },
    { value: 'level4', label: 'Level 4 - High-Power Bed', monthly: 80 },
    { value: 'matrix', label: 'Matrix Bed', monthly: 194.99 },
    { value: 'standup', label: 'Stand-Up Bed', monthly: 119.99 }
  ];

  const PACKAGES = [
    { value: 'five_pack', label: '5-Pack Minutes', price: 55 },
    { value: 'six_pack', label: '6-Pack Minutes', price: 66 },
    { value: 'ten_pack', label: '10-Pack Minutes', price: 105 },
    { value: 'month_unlimited', label: 'Monthly Unlimited', price: null }
  ];

  const calculateTotal = () => {
    if (!selectedLevel || !selectedPackage) return null;
    
    const bed = BED_LEVELS.find(b => b.value === selectedLevel);
    const pkg = PACKAGES.find(p => p.value === selectedPackage);
    
    let packagePrice;
    if (pkg.value === 'month_unlimited') {
      packagePrice = bed.monthly;
    } else {
      packagePrice = pkg.price;
    }
    
    const blackFridayPass = 5.00;
    const subtotal = packagePrice + blackFridayPass;
    const salesTax = subtotal * 0.0725;
    const tanTax = subtotal * 0.01;
    const total = subtotal + salesTax + tanTax;
    
    return {
      packagePrice: packagePrice.toFixed(2),
      blackFridayPass: blackFridayPass.toFixed(2),
      subtotal: subtotal.toFixed(2),
      salesTax: salesTax.toFixed(2),
      tanTax: tanTax.toFixed(2),
      total: total.toFixed(2),
      youSave: packagePrice.toFixed(2),
      packageName: `${bed.label} - ${pkg.label}`
    };
  };

  const handleCheckout = async () => {
    if (!selectedLevel || !selectedPackage) {
      toast.error('Please select a bed level and package');
      return;
    }
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all customer information');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Create Black Friday order
      const orderData = {
        level: selectedLevel,
        package: selectedPackage,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        ...calculateTotal(),
        blackFridayDeal: true
      };
      
      const response = await fetch(`${backendUrl}/api/tanning/black-friday-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) throw new Error('Order creation failed');
      
      const result = await response.json();
      
      // Redirect to payment
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        toast.success('Order created! Redirecting to payment...');
        navigate('/payment-success');
      }
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to create order. Please try again.');
      setProcessing(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg font-bold px-6 py-2 mb-4 animate-pulse">
            <Zap className="w-5 h-5 inline mr-2" />
            BLACK FRIDAY BOGO SPECIAL
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Buy 1 Get 1 FREE Tanning!
          </h1>
          <p className="text-yellow-400 text-xl font-semibold">
            Only $5 + Your Package = Get 2nd Package FREE!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Selection Form */}
          <Card className="bg-gray-800/50 border-yellow-400 border-2 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your BOGO Deal</h2>
            
            <div className="space-y-6">
              {/* Bed Level Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Step 1: Select Bed Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400"
                >
                  <option value="">Choose bed level...</option>
                  {BED_LEVELS.map(bed => (
                    <option key={bed.value} value={bed.value}>
                      {bed.label} - ${bed.monthly}/month
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Step 2: Select Package Type
                </label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-yellow-400"
                >
                  <option value="">Choose package...</option>
                  {PACKAGES.map(pkg => (
                    <option key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Information */}
              <div className="space-y-3 pt-4 border-t border-gray-600">
                <h3 className="text-white font-semibold mb-3">Your Information</h3>
                
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="bg-gray-700 text-white border-gray-600"
                />
                
                <Input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="bg-gray-700 text-white border-gray-600"
                />
                
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-yellow-400 border-2 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            
            {pricing ? (
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 space-y-2">
                  <div className="text-white font-semibold mb-2">
                    ✓ You're Getting:
                  </div>
                  <div className="text-yellow-300 text-sm">
                    • {pricing.packageName} x2 (BOGO!)
                  </div>
                  <div className="text-yellow-300 text-sm">
                    • Black Friday Pass
                  </div>
                </div>

                <div className="space-y-2 text-white">
                  <div className="flex justify-between">
                    <span>First Package</span>
                    <span>${pricing.packagePrice}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Second Package (FREE!)</span>
                    <span>-${pricing.youSave}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Black Friday Pass</span>
                    <span>${pricing.blackFridayPass}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Sales Tax</span>
                    <span>${pricing.salesTax}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Tan Tax</span>
                    <span>${pricing.tanTax}</span>
                  </div>
                  <div className="h-px bg-yellow-400 my-3"></div>
                  <div className="flex justify-between text-2xl font-bold text-yellow-400">
                    <span>Total</span>
                    <span>${pricing.total}</span>
                  </div>
                </div>

                <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mt-4">
                  <div className="text-green-400 font-bold text-lg text-center">
                    YOU SAVE ${pricing.youSave}!
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg h-14 mt-6"
                >
                  {processing ? 'Processing...' : '🔒 Proceed to Payment'}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  Secure payment processing • Valid through Dec 1st
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <p>Select your options above to see pricing</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
