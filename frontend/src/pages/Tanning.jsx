import { PricingTable } from '../components/PricingTable';
import { FAQAccordion } from '../components/FAQAccordion';
import { BookingCTA } from '../components/BookingCTA';
import { BookingForm } from '../components/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sun, Zap, Shield, Clock, Star, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Tanning() {
  const tanningLevels = [
    {
      level: 1,
      name: "Basic Bed",
      description: "Perfect for beginners or maintaining your tan",
      features: ["10-15 minute sessions", "Gentle UV exposure", "Great for sensitive skin"],
      price: "$10-15/session"
    },
    {
      level: 2,
      name: "Medium Bed",
      description: "Faster results with balanced UV output",
      features: ["8-12 minute sessions", "Stronger bulbs", "Faster tan development"],
      price: "$15-20/session"
    },
    {
      level: 3,
      name: "High-Pressure Bed",
      description: "Deep, long-lasting tans with less sessions",
      features: ["6-10 minute sessions", "Deeper pigmentation", "Longer-lasting results"],
      price: "$20-25/session"
    },
    {
      level: 4,
      name: "Matrix Stand-Up",
      description: "360° coverage for an even, all-over tan",
      features: ["8-12 minute sessions", "No pressure points", "Full body coverage"],
      price: "$25-30/session"
    },
    {
      level: 5,
      name: "Red Light Therapy",
      description: "Skin rejuvenation and anti-aging benefits",
      features: ["15-20 minute sessions", "Collagen production", "Reduces fine lines"],
      price: "$30-35/session"
    }
  ];

  const packages = [
    { service: "Single Session", description: "Pay as you go, any level", price: "$10-35" },
    { service: "5 Session Package", description: "5% discount on any level", price: "Starting at $47" },
    { service: "10 Session Package", description: "10% discount on any level", price: "Starting at $90" },
    { service: "Monthly Unlimited", description: "Unlimited tanning on levels 1-3", price: "$59-89/month" },
    { service: "Premium Unlimited", description: "Unlimited tanning all levels", price: "$99/month" }
  ];

  const lotions = [
    { service: "Bronzer Lotion", description: "Instant color + DHA bronzers", price: "$25-75" },
    { service: "Tingle Lotion", description: "Advanced tanning acceleration", price: "$35-85" },
    { service: "Moisturizer", description: "Extend your tan, hydrate skin", price: "$20-45" },
    { service: "Facial Tanning", description: "Face-specific formula", price: "$30-55" }
  ];

  const faqs = [
    {
      question: "How do I choose the right tanning level?",
      answer: "Start with Level 1 or 2 if you're new to tanning or have fair skin. Our staff can help assess your skin type and recommend the best starting level. You can always upgrade as your tan develops."
    },
    {
      question: "How many sessions do I need to see results?",
      answer: "Most people see visible results after 3-5 sessions. For a deep, maintained tan, we recommend 2-3 sessions per week initially, then 1-2 sessions weekly for maintenance."
    },
    {
      question: "Do I need to use tanning lotion?",
      answer: "While not required, tanning lotions significantly improve your results by preparing your skin, accelerating the tanning process, and helping your tan last longer. We carry professional indoor tanning lotions designed specifically for UV beds."
    },
    {
      question: "Is tanning safe?",
      answer: "When done responsibly with proper session times and protective eyewear, indoor tanning can be safe. We follow FDA guidelines and Ohio Board of Cosmetology regulations. We provide protective eyewear and staff guidance on safe tanning practices."
    },
    {
      question: "What should I wear while tanning?",
      answer: "Most people tan in swimwear or underwear. You can also tan nude if you prefer (our beds are private). We provide disposable undergarments if needed."
    },
    {
      question: "Can I tan if I have tattoos?",
      answer: "Yes, but UV exposure can fade tattoos over time. We recommend covering newer tattoos and using SPF lotion on older tattoos to preserve their vibrancy."
    },
    {
      question: "What's the difference between red light therapy and tanning?",
      answer: "Red light therapy doesn't produce a tan. Instead, it uses non-UV red wavelengths to stimulate collagen production, reduce fine lines, improve skin tone, and promote healing. It's great for anti-aging and skin health."
    },
    {
      question: "Do you offer spray tanning?",
      answer: "Currently we specialize in UV tanning beds and red light therapy. Call us at (740) 397-9632 for current service offerings."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[hsl(43_100%_97%)] via-[hsl(43_96%_90%)] to-[hsl(42_92%_85%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 1px 1px, hsl(42 92% 40%) 1px, transparent 0)", backgroundSize: "40px 40px"}}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-0" data-testid="tanning-hero-badge">
              <Sun className="w-3 h-3 mr-1" /> 5 Tanning Levels
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Premium Tanning Studio in Mount Vernon
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Achieve your perfect glow with 5 tanning levels including Matrix stand-up beds and rejuvenating red-light therapy. Professional equipment, expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#packages" data-testid="tanning-hero-packages-btn">
                <Button size="lg" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl">
                  <Star className="w-5 h-5 mr-2" />
                  View Packages
                </Button>
              </a>
              <a href="tel:+17403979632" data-testid="tanning-hero-call-btn">
                <Button variant="outline" size="lg" className="px-8 h-14 font-semibold text-lg bg-white hover:bg-gray-50">
                  Call (740) 397-9632
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Tanning Levels */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Choose Your Tanning Level</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From beginner-friendly beds to advanced Matrix technology and red-light therapy</p>
          </div>

          <Tabs defaultValue="level1" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto mb-8">
              <TabsTrigger value="level1" data-testid="tab-level1">Level 1</TabsTrigger>
              <TabsTrigger value="level2" data-testid="tab-level2">Level 2</TabsTrigger>
              <TabsTrigger value="level3" data-testid="tab-level3">Level 3</TabsTrigger>
              <TabsTrigger value="level4" data-testid="tab-level4">Level 4</TabsTrigger>
              <TabsTrigger value="level5" data-testid="tab-level5">Level 5</TabsTrigger>
            </TabsList>

            {tanningLevels.map((level, index) => (
              <TabsContent key={index} value={`level${level.level}`} className="mt-0">
                <Card className="p-8 max-w-3xl mx-auto">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-[hsl(43_96%_90%)]">
                      {level.level === 5 ? <Sparkles className="w-8 h-8 text-[hsl(var(--primary))]" /> : <Sun className="w-8 h-8 text-[hsl(var(--primary))]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-2xl font-bold">Level {level.level}: {level.name}</h3>
                        <Badge variant="secondary">{level.price}</Badge>
                      </div>
                      <p className="text-muted-foreground text-lg">{level.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {level.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Packages & Pricing */}
      <section id="packages" className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Tanning Packages</h2>
            <PricingTable 
              items={packages}
              note="Prices vary by tanning level. Monthly unlimited packages require autopay. Ask about student and senior discounts!"
            />
          </div>
        </div>
      </section>

      {/* Tanning Lotions */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-center">Professional Tanning Lotions</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Maximize your results with professional indoor tanning lotions. Our staff can help you choose the right product for your skin type and goals.</p>
            <PricingTable 
              items={lotions}
              note="Lotions help you tan faster, darker, and extend the life of your tan. We carry top brands like Australian Gold, Devoted Creations, and Designer Skin."
            />
          </div>
        </div>
      </section>

      {/* Safety & Benefits */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[hsl(183_45%_96%)] to-[hsl(183_55%_92%)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Why Choose Eastend Tanning?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Clean</h3>
              <p className="text-sm text-muted-foreground">All beds sanitized after each use. FDA-compliant equipment. Ohio Board of Cosmetology certified.</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Convenient Hours</h3>
              <p className="text-sm text-muted-foreground">Open extended hours Mon-Fri 8am-7:30pm, Sun 8am-10pm. No appointments needed!</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Staff</h3>
              <p className="text-sm text-muted-foreground">Trained professionals help you choose the right level and provide tanning tips for best results.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <BookingCTA 
            title="Ready for Your Perfect Glow?"
            subtitle="Visit us today at 818 Coshocton Ave. No appointment needed - walk-ins welcome!"
            primaryAction={{
              text: "Call to Get Started",
              href: "tel:+17403979632"
            }}
            callNumber="+17403979632"
            directionsUrl="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
          />
        </div>
      </section>
    </div>
  );
}