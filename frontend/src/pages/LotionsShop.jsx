import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, ShoppingCart, Sparkles, Check, MapPin, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

export default function LotionsShop() {
  const navigate = useNavigate();
  const [lotions, setLotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLotion, setSelectedLotion] = useState(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [quantity, setQuantity] = useState(1);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchLotions();
  }, []);

  const fetchLotions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/lotions`);
      const data = await response.json();
      setLotions(data);
    } catch (error) {
      console.error('Error fetching lotions:', error);
      toast.error('Failed to load lotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLotion = (lotion) => {
    setSelectedLotion(lotion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateTotal = () => {
    if (!selectedLotion) return 0;
    const subtotal = selectedLotion.price * quantity;
    const salesTax = subtotal * 0.0725;
    return subtotal + salesTax;
  };

  const handleCheckout = () => {
    if (!selectedLotion) {
      toast.error('Please select a lotion');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone) {
      toast.error('Please fill in all customer information');
      return;
    }

    // Prepare lotion item for unified cart
    const lotionItem = {
      item_id: `lot-${selectedLotion.id}-${Date.now()}`,
      item_type: 'lotion',
      details: {
        lotion_id: selectedLotion.id,
        lotion_name: selectedLotion.name,
        lotion_brand: selectedLotion.brand || ''
      },
      price: selectedLotion.price,
      quantity: quantity
    };

    // Navigate to unified checkout with pre-filled data
    navigate('/checkout', {
      state: {
        customerInfo: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        recommendedItems: [lotionItem]
      }
    });
    
    toast.success('Added to cart! Complete your purchase at checkout.');
  };

  const features = [
    { title: "Professional Grade", desc: "Salon-quality lotions for optimal tanning results" },
    { title: "Accelerate Your Tan", desc: "Advanced formulas that enhance and deepen your tan" },
    { title: "Moisturize & Protect", desc: "Keep your skin hydrated and your tan lasting longer" },
    { title: "Tattoo-Safe Options", desc: "Special formulas designed to protect your ink" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Premium Tanning Lotions - Buy Online | Eastend Tanning"
        description="Shop professional-grade tanning lotions online. Accelerators, bronzers, and tattoo-safe formulas. Buy online, pick up in-store at Eastend Tanning & Laundry."
        keywords="tanning lotion, bronzer, tanning accelerator, tattoo safe lotion, indoor tanning lotion, tanning products"
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Premium Tanning Lotions</h1>
            <p className="text-2xl mb-8 text-white/90">
              Professional-grade lotions that accelerate your tan, moisturize your skin, and make your results last longer.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {features.map((feature, idx) => (
                <Badge key={idx} className="bg-white/20 text-white text-sm px-4 py-2">
                  <Check className="w-4 h-4 mr-2" />
                  {feature.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Lotion Checkout */}
      {selectedLotion && (
        <div className="bg-white border-b-2 border-primary/20 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-4 py-6">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{selectedLotion.name}</h3>
                  {selectedLotion.brand && (
                    <p className="text-muted-foreground mb-3">{selectedLotion.brand}</p>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    {selectedLotion.tattoo_guard && (
                      <Badge variant="outline">Tattoo-Safe</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Your name"
                        data-testid="lotion-customer-name"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="your@email.com"
                        data-testid="lotion-customer-email"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="(740) 555-1234"
                        data-testid="lotion-customer-phone"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:w-80">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold mb-3">Order Summary</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Label>Quantity:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-20"
                          data-testid="lotion-quantity"
                        />
                      </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Price will be displayed at checkout. Contact us at (740) 397-9632 for pricing information.
                    </p>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      data-testid="lotion-checkout-button"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedLotion(null)}
                      className="w-full mt-2"
                    >
                      Change Selection
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Lotions Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Available Lotions</h2>
          <p className="text-xl text-muted-foreground">
            Select a lotion to purchase online and pick up in-store
          </p>
        </div>

        {lotions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground">No lotions available at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please call us at (740) 397-9632 for assistance.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotions.map((lotion) => (
              <Card
                key={lotion.id}
                className={`p-6 hover:shadow-xl transition-all cursor-pointer ${
                  selectedLotion?.id === lotion.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelectLotion(lotion)}
                data-testid={`lotion-card-${lotion.id}`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{lotion.name}</h3>
                    {lotion.brand && (
                      <p className="text-muted-foreground text-sm mb-3">{lotion.brand}</p>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      {lotion.tattoo_guard && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Tattoo-Safe
                        </Badge>
                      )}
                    </div>
                    {lotion.features && lotion.features.length > 0 && (
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {lotion.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant={selectedLotion?.id === lotion.id ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLotion(lotion);
                    }}
                  >
                    {selectedLotion?.id === lotion.id ? 'Selected' : 'Select Lotion'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Why Buy Lotions */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Why Use Tanning Lotions?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional lotions make a dramatic difference in your tanning results
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Chat with Mary, our AI tanning expert, for personalized lotion recommendations based on your skin type and tanning goals.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => window.openMaryChat && window.openMaryChat()}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Ask Mary for Recommendations
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">Eastend Tanning & Laundry</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />818 Coshocton Ave, Mt Vernon, OH</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" />(740) 397-9632</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />8am-7:30pm daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}
