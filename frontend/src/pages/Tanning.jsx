import { PricingTable } from '../components/PricingTable';
import { BookingCTA } from '../components/BookingCTA';
import { LotionsCatalog } from '../components/LotionsCatalog';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, Sparkles, Gift, Crown, Zap } from 'lucide-react';

const matrixPoster = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop";

export default function Tanning() {
  const packages = [
    { service: 'Single Session', description: 'Pay as you go, any level', price: '$10-35' },
    { service: '5 Session Package', description: '5% discount on any level', price: 'Starting at $47' },
    { service: '10 Session Package', description: '10% discount on any level', price: 'Starting at $90' },
    { service: 'Monthly Unlimited', description: 'Unlimited tanning on levels 1-3', price: '$59-89/month' },
    { service: 'Premium Unlimited', description: 'Unlimited tanning all levels', price: '$99/month' }
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
  ];

  return (
    <div className="min-h-screen">
      {/* Hero - Conversion Focused */}
      <section className="relative bg-gradient-to-br from-[#F59E0B]/10 via-white to-[#14B8A6]/10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] text-white">
                <Zap className="w-3 h-3 mr-1" />
                Achieve Your Perfect Glow
              </Badge>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Tanning Studio
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                5 tanning levels including Matrix, stand-up, and red-light therapy. From budget-friendly to premium VIP experience.
              </p>
              
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                    <div className="text-[#14B8A6]">{benefit.icon}</div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={openChat}
                  size="lg"
                  className="bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] text-white px-8"
                >
                  Talk to Mary - Get Recommendation
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#14B8A6]/20 rounded-2xl blur-3xl"></div>
              <img
                src="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg"
                alt="Tanning Results"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <Card className="p-0 overflow-hidden">
            <video
              controls
              poster="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg"
              className="w-full h-auto"
              data-testid="tanning-video"
            >
              <source src="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/e30rw6wp_Movie%2090_1_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>
      </section>

      {/* Pricing - Focused on Monthly/VIP */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Best Value for Results</Badge>
            <h2 className="font-serif text-4xl font-bold mb-4">Monthly Unlimited Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Buying one or five sessions isn't practical for real results. Get unlimited access and see the difference!
            </p>
          </div>

          <PricingTable highlightMonthly={true} />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want to see single-session pricing? <button onClick={openChat} className="text-[#14B8A6] underline font-medium">Chat with Mary</button>
            </p>
          </div>
        </div>
      </section>

      {/* Lotions Catalog */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Lotions
            </Badge>
            <h2 className="font-serif text-4xl font-bold mb-4">Maximize Your Results</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tanning lotions designed for optimal results. Pay online, pick up at Eastend.
            </p>
          </div>

          <LotionsCatalog />
        </div>
      </section>

      {/* Skin Type Evaluation CTA */}
      <section className="py-16 bg-gradient-to-br from-[#F59E0B]/5 to-[#14B8A6]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Not Sure Which Package is Right?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take our free skin type evaluation and get personalized recommendations from Mary Well.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => window.location.href = '/skin-type-evaluation'}
              variant="outline"
              size="lg"
            >
              Take Skin Type Quiz
            </Button>
            <Button
              onClick={openChat}
              size="lg"
              className="bg-gradient-to-r from-[#F59E0B] to-[#14B8A6]"
            >
              Chat with Mary Now
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <BookingCTA showCall={false} showDirections={false} />
        </div>
      </section>
    </div>
  );
}
