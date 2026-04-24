import { PricingTable } from '../components/PricingTable';
import { BookingCTA } from '../components/BookingCTA';
import { LotionsCatalog } from '../components/LotionsCatalog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Sparkles, Gift, Crown, Zap, Sun, Heart, Brain, MapPin, ExternalLink, Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEOHead, createServiceSchema } from '../components/SEOHead';
// import { DealPopup } from '../components/DealPopup'; // Disabled for Black Friday
import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { generateBreadcrumb } from '../utils/structuredData';
import { eastendTanningSchema } from '../utils/businessSchemas';
import { HolidayDiscountBanner, UpcomingDiscounts, DiscountTag } from '../components/HolidayDiscountBanner';
import { StaticFallback } from '../components/StaticFallback';
import { FacebookFeed } from '../components/FacebookFeed';
import { ReviewSubmission } from '../components/ReviewSubmission';
import { PublicReviews } from '../components/PublicReviews';
import { tanningSalonSchema, createFAQSchema } from '../utils/seoSchemas';
import { ServiceSchema } from '../components/seo/ServiceSchema';

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

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Tanning', path: '/tanning' }
  ]);

  return (
    <>
      <ServiceSchema name="Tanning Studio" description="Premium tanning beds including high-pressure Matrix and red light therapy." category="Tanning" />
    <div className="min-h-screen bg-muted">
      <StaticFallback page="tanning" />
      <SEOHead
        title="Best Tanning Salon Near Me Mt Vernon Ohio 2026 | #1 Tanning Salon | Eastend Tanning"
        description="Looking for the best tanning salon near me? Eastend Tanning is Mt Vernon Ohio's #1 rated tanning salon in 2026. 6 bed levels, 40,740W Matrix Bed, red light therapy for SAD relief. Monthly unlimited from $39.99. Peak season deals! 818 Coshocton Ave. (740) 397-9632."
        keywords="best tanning salon near me, best tanning salon Mt Vernon Ohio 2026, tanning salon near me, indoor tanning Knox County, SAD seasonal affective disorder tanning, winter blues light therapy, Matrix tanning bed, monthly unlimited tanning Ohio, red light therapy depression, vitamin D tanning benefits"
        canonicalUrl="https://eastend.website/tanning"
        faqSchema={allFAQSchemas.tanning}
        structuredData={[eastendTanningSchema, createServiceSchema('Monthly Unlimited Tanning', 'Unlimited UV tanning on all 6 levels including Matrix, stand-up, and red light therapy with professional equipment and expert guidance', 39.99)]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/tanning-hero.jpg"
      />
      <script type="application/ld+json">
        {JSON.stringify(tanningSalonSchema)}
      </script>

      {/* Deal of the Month Popup */}
      {/* <DealPopup /> Disabled for Black Friday */}

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
          <source src="/tanning-hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/80 to-[hsl(var(--secondary))]/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-4">
              <DiscountTag serviceType="tanning" className="text-lg px-4 py-2" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Best Tanning Salon Near Me in Mt Vernon, Ohio</h1>
            <p className="text-2xl mb-8 text-white/90">
              Beat the winter blues & get your glow on! February 2026 is peak tanning season. Monthly unlimited delivers real results that last all year.
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

      {/* Dynamic Holiday/Seasonal Discount Banner */}
      <HolidayDiscountBanner serviceType="tanning" variant="full" className="container mx-auto px-4" />

      {/* SAD - Seasonal Affective Disorder & Winter Blues Section */}
      <div className="bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 py-16 border-y-2 border-amber-200" data-testid="sad-section">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-blue-600 text-white text-lg px-6 py-2 mb-4">
                <Snowflake className="w-5 h-5 mr-2 inline" />
                Winter Wellness 2026
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Beat the Winter Blues & SAD with Indoor Tanning
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Seasonal Affective Disorder (SAD) affects millions during Ohio winters. Indoor tanning and light therapy can help boost your mood, energy, and vitamin D levels naturally.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="p-6 bg-white/80 backdrop-blur border-blue-100 hover:shadow-lg transition-shadow">
                <Sun className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">Natural Vitamin D</h3>
                <p className="text-muted-foreground">Our beds trigger natural Vitamin D production, which is essential for immune health and mood regulation when the Ohio sun is hidden.</p>
              </Card>
              <Card className="p-6 bg-white/80 backdrop-blur border-blue-100 hover:shadow-lg transition-shadow">
                <Heart className="w-10 h-10 text-rose-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">Serotonin Boost</h3>
                <p className="text-muted-foreground">UV exposure stimulates the release of serotonin, the 'feel-good' hormone that helps combat anxiety and winter depression.</p>
              </Card>
              <Card className="p-6 bg-white/80 backdrop-blur border-blue-100 hover:shadow-lg transition-shadow">
                <Brain className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">Circadian Rhythm</h3>
                <p className="text-muted-foreground">Regular bright light exposure helps regulate your sleep-wake cycle, improving sleep quality and daytime energy levels.</p>
              </Card>
            </div>

            <div className="text-center bg-white/50 rounded-2xl p-8 border border-blue-100">
              <p className="text-sm text-muted-foreground italic mb-0">
                *Note: While many find relief through light therapy, please consult your doctor for medical advice regarding SAD or depression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Why Choose Us - Authority & Comparison */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="font-serif text-3xl font-bold mb-8">Why We're #1 in Mt Vernon</h2>
              <div className="space-y-6">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Check className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="mt-12 p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Crown className="w-6 h-6" />
                  VIP Membership
                </h3>
                <p className="mb-6 text-amber-50">
                  Join our VIP program with a 3-month commitment for the lowest possible rates and exclusive member benefits.
                </p>
                <Button 
                  className="w-full bg-white text-orange-600 hover:bg-amber-50 font-bold"
                  onClick={openChat}
                >
                  Ask Mary About VIP
                </Button>
              </Card>
            </div>
          </div>

          {/* Bed Levels & Pricing */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-8" id="levels">State-of-the-Art Bed Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bedLevels.map((tier, idx) => (
                <Card key={idx} className="p-6 hover:shadow-md transition-shadow border-2 hover:border-amber-500 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">{tier.level}</Badge>
                      <h3 className="text-xl font-bold">{tier.watts} Power</h3>
                    </div>
                    <Sun className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="font-semibold text-amber-700 mb-2">{tier.price}</p>
                  <p className="text-sm text-muted-foreground mb-4">{tier.bestFor}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-amber-500 group-hover:text-white transition-colors"
                    onClick={openChat}
                  >
                    Book {tier.level}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Matrix Section */}
            <Card className="mt-8 overflow-hidden border-4 border-amber-500">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <Badge className="bg-amber-500 text-white mb-4">The Ultimate Tan</Badge>
                  <h3 className="font-serif text-3xl font-bold mb-4">The 40,740-Watt Matrix</h3>
                  <p className="text-muted-foreground mb-6">
                    Mount Vernon's most powerful bed. High-pressure lamps deliver the fastest, deepest, and longest-lasting tan possible. Results in just 3-4 sessions.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">360-degree high-pressure coverage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Maximum melanin stimulation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Best for hard-to-tan skin</span>
                    </li>
                  </ul>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-8"
                    onClick={openChat}
                  >
                    Experience the Matrix
                  </Button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={matrixPoster} 
                    alt="Matrix Tanning Bed"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Upcoming Seasonal Deals Section */}
      <div className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">Upcoming 2026 Tanning Specials</h2>
          <UpcomingDiscounts />
        </div>
      </div>

      {/* Lotions Section */}
      <section className="py-20 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Never Tan Dry</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quality lotions protect your skin and accelerate results by up to 50%. Browse our professional catalog.
            </p>
          </div>
          <LotionsCatalog />
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-10 text-lg border-2 border-amber-500 text-amber-700 hover:bg-amber-50"
              onClick={() => navigate('/lotions')}
            >
              View Full Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Facebook Feed Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Latest from Eastend Tanning</h2>
          <div className="flex justify-center">
            <FacebookFeed 
              pageUrl="https://www.facebook.com/share/1CtZugxSec/" 
              pageName="Eastend Tanning & Laundry"
            />
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Tanning Customer Reviews</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Public Reviews Display */}
            <div>
              <h3 className="font-bold text-xl mb-6">Recent 5-Star Reviews</h3>
              <PublicReviews businessLocation="eastend" limit={5} />
            </div>
            
            {/* Review Submission Form */}
            <div>
              <ReviewSubmission defaultLocation="eastend" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Authority CTA */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <BookingCTA 
            title="Ready to Get Your Glow On?"
            subtitle="Visit us at 818 Coshocton Ave today. No appointment needed for tanning sessions!"
            primaryAction={{ 
              text: "Talk to Mary Well", 
              onClick: openChat 
            }}
            secondaryAction={{ 
              text: "Get Directions", 
              onClick: () => window.open('https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050') 
            }}
          />
        </div>
      </section>
    </div>
      </>
  );
}