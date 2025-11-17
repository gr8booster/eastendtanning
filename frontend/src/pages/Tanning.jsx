import { PricingTable } from '../components/PricingTable';
import { BookingCTA } from '../components/BookingCTA';
import { LotionsCatalog } from '../components/LotionsCatalog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Sparkles, Gift, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEOHead, createServiceSchema } from '../components/SEOHead';
import { DealBanner } from '../components/DealBanner';

const matrixPoster = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop";

export default function Tanning() {
  const navigate = useNavigate();
  
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

  const openConsultation = () => {
    if (window.openMaryChatWithConsultation) {
      window.openMaryChatWithConsultation();
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
        title="Book Tanning Sessions & Red Light Therapy – Eastend Tanning, Mt Vernon"
        description="Book tanning sessions at Eastend Tanning in Mt Vernon. Monthly unlimited packages, VIP tanning, red light therapy, 6 bed levels. Professional UV beds, premium lotions. Call (740) 397-9632 or book online."
        keywords="book tanning Mt Vernon, red light therapy Mt Vernon, monthly unlimited tanning, VIP tanning package, UV tanning beds, tanning salon Mt Vernon OH, indoor tanning, Matrix bed"
        ogImage="https://eastend.website/images/tanning-hero.jpg"
        schemaMarkup={createServiceSchema('Monthly Unlimited Tanning', 'Unlimited UV tanning on all levels with professional beds and expert guidance', 59.99)}
      />

      {/* Deal of the Month Banner */}
      <DealBanner />

      {/* Hero - Why are they here? They want results! */}
      <div className="relative bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-20 overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          data-testid="hero-video"
        >
          <source src="https://customer-assets.emergentagent.com/job_eastend-dash/artifacts/kwt74izc_2023-06-27-205802406_1_1.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/80 to-[hsl(var(--secondary))]/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Get Real Tanning Results That Last</h1>
            <p className="text-2xl mb-8 text-white/90">
              Forget single sessions that fade in days. Monthly unlimited tanning delivers the consistent exposure you need for a real, lasting tan.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 hover:scale-105 transition-transform" 
                onClick={openConsultation}
                data-testid="hero-consultation-button"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Find Your Perfect Bed (Free Consultation)
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <img src={matrixPoster} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Why Choose Us Over Gyms & Other Salons */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Why Eastend Over Your Gym or Other Salons?</h2>
            <p className="text-xl text-muted-foreground">We're the tanning specialists - not a side offering</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((reason, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[hsl(var(--primary))]" />
                  {reason.title}
                </h3>
                <p className="text-muted-foreground">{reason.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Capture - Which Bed Should I Choose? */}
      <div className="bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 py-16 cursor-pointer hover:shadow-lg transition-shadow" onClick={openConsultation} data-testid="consultation-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">Not Sure Which Bed is Right for You?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get a free skin type evaluation and personalized recommendation from Mary, our AI tanning expert. She'll match you to the perfect bed based on your skin type, goals, and budget.
            </p>
            <Button size="lg" onClick={(e) => { e.stopPropagation(); openConsultation(); }} className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-lg px-8 hover:scale-105 transition-transform">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Free Consultation - Ask Mary Anything
            </Button>
          </div>
        </div>
      </div>

      {/* Our Tanning Beds - Detailed Breakdown */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Our 5 Tanning Levels (+ Matrix)</h2>
          <p className="text-xl text-muted-foreground">From beginner-friendly to ultimate power - we have the right bed for every skin type</p>
        </div>
        
        <div className="space-y-4 max-w-5xl mx-auto mb-12">
          {bedLevels.map((bed, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                      {bed.level}
                    </Badge>
                    <span className="font-bold text-lg">{bed.watts}</span>
                  </div>
                  <p className="text-muted-foreground mb-2">Best for: {bed.bestFor}</p>
                  <p className="font-semibold text-[hsl(var(--primary))]">{bed.price}</p>
                </div>
                <Button variant="outline" onClick={openChat}>Ask Mary About This Bed</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Video Showcase */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl font-bold mb-4">See Our Beds in Action</h3>
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

      {/* Pricing - Show Them the Deal */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Tanning Packages & Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monthly unlimited gives you the consistency needed for real results. Choose VIP for the lowest price or regular monthly with no commitment.
            </p>
          </div>
          <PricingTable items={packages} highlightMonthly={true} note="💡 Questions about VIP or which package is right for you? Ask Mary for personalized advice." />
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={openChat}>
              Ask Mary: "What's the difference between VIP and Monthly?"
            </Button>
          </div>
        </div>
      </div>

      {/* Lotions - They Want Lotions! */}
      <div className="bg-gradient-to-b from-muted to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Get Better Results with Premium Lotions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade lotions accelerate tanning, moisturize, and help your tan last longer. Buy online, pick up in-store, or ask Mary for recommendations.
            </p>
          </div>
          <LotionsCatalog />
        </div>
      </div>

      {/* Final CTA - Convert Them */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Stop by today or chat with Mary to find your perfect package. No pressure, just expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90"
                onClick={() => navigate('/tanning-checkout')}
              >
                Buy Package Online
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" onClick={openChat}>
                Chat with Mary
              </Button>
              <BookingCTA />
            </div>
            <p className="text-sm text-white/70 mt-6">
              📍 Eastend Tanning: 818 Coshocton Ave, Mt Vernon | 📞 (740) 397-9632 | ⏰ 8am-6pm daily
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
