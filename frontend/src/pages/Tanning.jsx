import { PricingTable } from '../components/PricingTable';
import { BookingCTA } from '../components/BookingCTA';
import { LotionsCatalog } from '../components/LotionsCatalog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Sparkles, Gift, Crown, Zap } from 'lucide-react';
import { SEOHead, createServiceSchema } from '../components/SEOHead';

const matrixPoster = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop";

export default function Tanning() {
  const packages = [
    { service: '⭐ VIP Monthly Unlimited', description: 'BEST VALUE! 3-month commitment, auto-pay. Unlimited tanning at the lowest price!', price: '$39.99-$169.99/mo' },
    { service: 'Monthly Unlimited', description: 'Unlimited tanning, no commitment. Great value for consistent results.', price: '$45.99-$194.99/mo' },
    { service: '10 Session Package', description: '10% discount on any level. Good for occasional tanners.', price: '$38.99-$194.99' },
    { service: '5 Session Package', description: '5% discount on any level', price: 'Starting at $38' },
    { service: 'Single Session', description: 'Pay as you go (not recommended for results)', price: '$5-$23.99' }
  ];

  const openChat = () => {
    if (window.openMaryChat) {
      window.openMaryChat();
    }
  };

  const benefits = [
    { icon: <Sparkles className="w-5 h-5" />, text: "5 tanning levels from budget to premium Matrix bed" },
    { icon: <Check className="w-5 h-5" />, text: "Professional skin type evaluation (free)" },
    { icon: <Gift className="w-5 h-5" />, text: "Premium lotions catalog with expert recommendations" },
    { icon: <Crown className="w-5 h-5" />, text: "Unlimited tanning - best value for consistent results" },
    { icon: <Zap className="w-5 h-5" />, text: "Consistent tanning delivers real, lasting results" }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Monthly Unlimited Tanning Packages - Best Value for Real Results"
        description="Get your perfect tan with Monthly Unlimited and VIP tanning packages at Eastend. Professional UV beds, premium lotions, expert staff. Consistent tanning delivers results - single sessions don't work!"
        keywords="monthly unlimited tanning, VIP tanning package, UV tanning beds, tanning salon Mount Vernon, spray tan, indoor tanning, tanning lotions"
        ogImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200"
        schemaMarkup={createServiceSchema('Monthly Unlimited Tanning', 'Unlimited UV tanning on all levels with professional beds and expert guidance', 59.99)}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">⭐ Monthly & VIP Best Value</Badge>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Monthly & VIP Unlimited Tanning</h1>
            <p className="text-xl mb-4 text-white/90">
              <strong>Real results need consistency!</strong> Monthly Unlimited and VIP packages deliver the best value. Single sessions don't work - get unlimited access and save money!
            </p>
            <p className="text-lg mb-6 text-white/80">
              💎 <strong>VIP = LOWEST PRICE</strong> - 3-month commitment with auto-pay saves you $10-$25/month!
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="text-white/90">{benefit.icon}</div>
                  <span className="text-white/90">{benefit.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <Button size="lg" className="bg-white text-[hsl(var(--primary))] hover:bg-white/90" onClick={openChat}>
                Chat with Mary - Get Skin Type Evaluation
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <img src={matrixPoster} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Video Showcase */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4">Our Premium Tanning Beds</h2>
            <p className="text-muted-foreground">State-of-the-art equipment for the best tanning experience</p>
          </div>
          <Card className="overflow-hidden">
            <video
              controls
              poster={matrixPoster}
              className="w-full aspect-video bg-black"
            >
              <source src="/videos/tanning-beds.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">💎 Monthly & VIP Tanning Packages</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            <strong>Monthly Unlimited and VIP packages deliver the BEST VALUE and results.</strong> Consistent tanning is the only way to get a real tan!
          </p>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-lg font-semibold text-amber-900 mb-2">⭐ What is VIP?</p>
            <p className="text-amber-800">
              VIP is our <strong>BEST VALUE</strong> option! You commit to 3 months minimum with automatic monthly payments. This gives you the <strong>lowest possible price</strong> - save $10-$25/month compared to regular unlimited. Tan as often as you want without limits!
            </p>
          </div>
        </div>
        <PricingTable items={packages} highlightMonthly={true} note="💡 VIP pricing requires 3-month commitment with automatic monthly payments. All prices shown are per month for unlimited tanning." />
      </div>

      {/* Lotions Catalog */}
      <div className="bg-gradient-to-b from-muted to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Premium Tanning Lotions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your tan with professional-grade lotions. Buy online, pickup at Eastend.
            </p>
          </div>
          <LotionsCatalog />
        </div>
      </div>

      {/* Skin Type CTA */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 border-2 border-[hsl(var(--primary))]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Not Sure What's Right for You?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Chat with Mary Well, our AI tanning expert, for a free skin type evaluation and personalized package recommendation.
            </p>
            <Button size="lg" onClick={openChat} className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
              Get Your Free Skin Type Evaluation
            </Button>
          </div>
        </Card>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Ready to Get Your Glow?</h2>
          <p className="text-xl mb-8 text-white/90">Start your tanning journey today with a Monthly Unlimited package</p>
          <BookingCTA />
        </div>
      </div>
    </div>
  );
}
