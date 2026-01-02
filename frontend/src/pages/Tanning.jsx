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
              <BlackFridayBadge className="text-lg px-4 py-2" />
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

      {/* Black Friday BOGO Deal - SEO Section */}
      {(() => {
        const BLACK_FRIDAY_END = new Date('2025-12-01T23:59:59');
        const isActive = new Date() < BLACK_FRIDAY_END;
        
        if (!isActive) return null;
        
        return (
          <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 py-16 border-y-4 border-yellow-400">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-2xl px-8 py-3 mb-4 animate-pulse">
                    <Zap className="w-6 h-6 mr-2 inline" />
                    BLACK FRIDAY BOGO SALE - LIMITED TIME
                  </Badge>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Buy 1 Get 1 FREE Tanning Packages
                  </h2>
                  <p className="text-2xl font-semibold text-orange-600 mb-6">
                    Only $5 Black Friday Pass + Your Package = 2nd Package FREE!
                  </p>
                </div>

                {/* SEO-Friendly Content */}
                <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">How the Black Friday BOGO Deal Works:</h3>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <span><strong>Purchase a $5 Black Friday Pass</strong> - Valid through December 1st, 2025</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <span><strong>Buy ANY tanning package</strong> - Monthly unlimited or minute packages (5-pack, 6-pack, 10-pack)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <span><strong>Get a SECOND package FREE</strong> - Same bed level, same package type, completely free!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-500">
                    <h4 className="text-xl font-bold mb-3 text-gray-900">Example Savings:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Matrix Bed Monthly:</strong> Pay $194.99 + $5 pass = Get 2 months for $199.99 (Save $194.99!)</li>
                      <li>• <strong>Level 2 Monthly:</strong> Pay $60 + $5 pass = Get 2 months for $65 (Save $60!)</li>
                      <li>• <strong>10-Pack Minutes:</strong> Pay $105 + $5 pass = Get 20 sessions for $110 (Save $105!)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold mb-3 text-gray-900">Valid on All Bed Levels:</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                      <div>• Level 1 - Entry Bed</div>
                      <div>• Level 2 - Standard Bed</div>
                      <div>• Level 3 - Premium Bed</div>
                      <div>• Level 4 - High-Power Bed</div>
                      <div>• Matrix Bed (40,740W)</div>
                      <div>• Stand-Up Bed</div>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/tanning-checkout')}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl h-16 px-12 shadow-2xl transform hover:scale-105 transition-all"
                    >
                      <Zap className="w-6 h-6 mr-2" />
                      Claim Your Black Friday BOGO Deal Now
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                      <strong>Limited Time:</strong> Offer expires December 1st, 2025 at 11:59 PM<br />
                      One Black Friday pass per checkout • Cannot be combined with other offers<br />
                      Available at Eastend Tanning, 818 Coshocton Ave, Mt Vernon, OH 43050
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
              <Card className="p-6 bg-white/80 backdrop-blur border-amber-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Sun className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">UV Light Therapy</h3>
                <p className="text-muted-foreground">
                  UV light exposure triggers vitamin D production and serotonin release, naturally combating winter depression and low energy levels.
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur border-amber-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">Mood Enhancement</h3>
                <p className="text-muted-foreground">
                  Regular tanning sessions can help regulate your body's circadian rhythm and boost endorphins - the "feel good" hormones that improve your mood.
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur border-amber-200 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">Red Light Therapy</h3>
                <p className="text-muted-foreground">
                  Our red light therapy beds provide non-UV light that reduces inflammation, improves sleep quality, and supports mental wellness during dark winter months.
                </p>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">February 2026: Peak Tanning Season</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    As winter drags on in Ohio, now is the perfect time to start your tanning routine. Build your base tan before spring break and summer, while also fighting off the winter blues with regular light exposure.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Boost vitamin D levels during low-sunlight months</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Get beach-ready before spring break trips</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span>Monthly unlimited for consistent results & mood benefits</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/tanning-checkout')}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg h-14 px-8 shadow-lg"
                  >
                    <Sun className="w-5 h-5 mr-2" />
                    Start Your Winter Wellness Plan
                  </Button>
                </div>
              </div>
            </Card>

            {/* External SAD Resources */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">Learn more about Seasonal Affective Disorder:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://www.nimh.nih.gov/health/publications/seasonal-affective-disorder" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1">
                  NIH: SAD Information <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://www.mayoclinic.org/diseases-conditions/seasonal-affective-disorder/symptoms-causes/syc-20364651" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1">
                  Mayo Clinic: SAD Symptoms <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://my.clevelandclinic.org/health/diseases/9293-seasonal-depression" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1">
                  Cleveland Clinic: Winter Depression <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Quick Links - Best Tanning Salon Near Me - Direct Links to Eastend */}
      <div className="bg-white py-12 border-b" data-testid="seo-links-section">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold mb-3">Find the Best Tanning Salon Near You</h2>
              <p className="text-lg text-muted-foreground">Eastend Tanning is Mt Vernon, Ohio's top-rated tanning destination</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Direct link to Eastend on Google Maps */}
              <a href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930247,-82.4871659,17z/data=!3m1!4b1!4m6!3m5!1s0x8836c0c0c7e05555:0x5555555555555555!8m2!3d40.3930247!4d-82.484591!16s%2Fg%2F1td6dn7k" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-6 text-center hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer h-full bg-gradient-to-br from-amber-50 to-white">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                  <h3 className="font-bold text-lg mb-2">Best Tanning Salon Near Me</h3>
                  <p className="text-sm text-muted-foreground mb-3">View Eastend Tanning directly on Google Maps - #1 in Mt Vernon!</p>
                  <Badge className="bg-amber-500 text-white">📍 Go to Eastend</Badge>
                </Card>
              </a>

              {/* Direct link to Eastend location */}
              <a href="https://www.google.com/maps/dir//Eastend+Tanning+and+Laundry,+818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-6 text-center hover:shadow-lg hover:border-teal-400 transition-all cursor-pointer h-full bg-gradient-to-br from-teal-50 to-white">
                  <Sun className="w-10 h-10 mx-auto mb-3 text-teal-600" />
                  <h3 className="font-bold text-lg mb-2">Tanning Salon Near Me</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get directions to Eastend - 818 Coshocton Ave, Mt Vernon</p>
                  <Badge className="bg-teal-500 text-white">🚗 Get Directions</Badge>
                </Card>
              </a>

              {/* Direct link to Eastend's Yelp page */}
              <a href="https://www.yelp.com/biz/eastend-laundry-tanning-and-nutrition-mount-vernon" target="_blank" rel="noopener noreferrer" className="block">
                <Card className="p-6 text-center hover:shadow-lg hover:border-red-400 transition-all cursor-pointer h-full bg-gradient-to-br from-red-50 to-white">
                  <Crown className="w-10 h-10 mx-auto mb-3 text-red-600" />
                  <h3 className="font-bold text-lg mb-2">Best Tanning Salon</h3>
                  <p className="text-sm text-muted-foreground mb-3">Read Eastend's 5-star reviews on Yelp</p>
                  <Badge className="bg-red-500 text-white">⭐ Read Our Reviews</Badge>
                </Card>
              </a>
            </div>

            <div className="text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-lg font-semibold mb-2">📍 Visit Eastend Tanning Today - The Best Tanning Salon in Mt Vernon!</p>
              <p className="text-muted-foreground">
                <strong>818 Coshocton Ave, Mt Vernon, OH 43050</strong> • <a href="tel:+17403979632" className="text-amber-600 hover:underline font-semibold">(740) 397-9632</a> • Open 7 Days: 8AM-7:30PM
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930247,-82.4871659,17z" target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                    <MapPin className="w-4 h-4" /> Eastend on Google Maps
                  </Button>
                </a>
                <a href="https://www.facebook.com/share/1CtZugxSec/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Facebook</Button>
                </a>
                <a href="https://www.instagram.com/eastendtanning" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Instagram</Button>
                </a>
                <a href="https://www.yelp.com/biz/eastend-laundry-tanning-and-nutrition-mount-vernon" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Yelp Reviews</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Over Gyms & Other Salons */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Why Eastend is the Best Tanning Salon in Mt Vernon</h2>
            <p className="text-xl text-muted-foreground">We're the tanning specialists - not a side offering like gyms</p>
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
              <source src="/tanning-hero-video.mp4" type="video/mp4" />
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

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold mb-4">Ready to Start Your Tanning Journey?</h2>
            <p className="text-xl mb-8">
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
              📍 Eastend Tanning: 818 Coshocton Ave, Mt Vernon | 📞 (740) 397-9632 | ⏰ 8am-7:30pm daily
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
