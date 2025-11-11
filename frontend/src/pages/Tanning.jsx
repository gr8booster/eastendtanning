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
    { service: 'VIP Monthly Unlimited', description: 'Best value - lowest price with 3-month commitment', price: '$39.99-$169.99/mo' },
    { service: 'Monthly Unlimited', description: 'No commitment - cancel anytime', price: '$45.99-$194.99/mo' },
    { service: '10 Session Package', description: 'Save 10% - good for occasional tanners', price: '$38.99-$194.99' },
    { service: 'Single Session', description: 'Pay as you go', price: '$5-$23.99' }
  ];

  const openChat = () => {
    if (window.openMaryChat) {
      window.openMaryChat();
    }
  };

  const whyChooseUs = [
    { title: "More Beds, Better Choice", desc: "5 levels vs gyms' 1-2 basic beds. From beginner-friendly to our exclusive 40,740-watt Matrix." },
    { title: "Unlimited = Real Results", desc: "Gyms limit your tanning. We don't. Monthly unlimited means you can tan as often as needed for actual results." },
    { title: "Lower Prices Than Competition", desc: "VIP starts at $39.99/month vs $60+ at other salons. Same quality, better value." },
    { title: "Expert Staff & Lotions", desc: "Free skin evaluations, professional lotion recommendations. Not just equipment - actual tanning expertise." }
  ];

  const bedLevels = [
    { level: "Level 1", watts: "3,840W", price: "$5 single / $39.99 VIP unlimited", bestFor: "Beginners, fair skin, maintaining base tan" },
    { level: "Level 2", watts: "5,000W", price: "$8 single / $59.99 VIP unlimited", bestFor: "Most popular! Medium skin, faster results" },
    { level: "Level 3", watts: "10,750W", price: "$10 single / $79.99 VIP unlimited", bestFor: "High-pressure tanning, experienced tanners" },
    { level: "Level 4", watts: "13,995W", price: "$14.99 single / $99.99 VIP unlimited", bestFor: "Premium results, less frequent sessions" },
    { level: "Stand Up", watts: "8,640W", price: "$11 single / $99.99 VIP unlimited", bestFor: "No pressure points, full-body coverage" },
    { level: "Matrix", watts: "40,740W", price: "$23.99 single / $169.99 VIP unlimited", bestFor: "ULTIMATE power - fastest, deepest tan possible" }
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

      {/* Hero - Why are they here? They want results! */}
      <div className="relative bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Get Real Tanning Results That Last</h1>
            <p className="text-2xl mb-8 text-white/90">
              Forget single sessions that fade in days. Monthly unlimited tanning delivers the consistent exposure you need for a real, lasting tan.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-[hsl(var(--primary))] hover:bg-white/90" onClick={openChat}>
                Find Your Perfect Bed (Free Consultation)
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
