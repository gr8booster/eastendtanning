import { PricingTable } from '../components/PricingTable';
import { FAQAccordion } from '../components/FAQAccordion';
import { BookingCTA } from '../components/BookingCTA';
import { BookingForm } from '../components/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sun, Zap, Shield, Star, Sparkles, Play, Mic } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Tanning() {
  const tanningLevels = [
    { level: 1, name: 'Basic Bed', description: 'Perfect for beginners or maintaining your tan', features: ['10-15 minute sessions', 'Gentle UV exposure', 'Great for sensitive skin'], price: '$10-15/session' },
    { level: 2, name: 'Medium Bed', description: 'Faster results with balanced UV output', features: ['8-12 minute sessions', 'Stronger bulbs', 'Faster tan development'], price: '$15-20/session' },
    { level: 3, name: 'High-Pressure Bed', description: 'Deep, long-lasting tans with less sessions', features: ['6-10 minute sessions', 'Deeper pigmentation', 'Longer-lasting results'], price: '$20-25/session' },
    { level: 4, name: 'Matrix Stand-Up', description: '360° coverage for an even, all-over tan', features: ['8-12 minute sessions', 'No pressure points', 'Full body coverage'], price: '$25-30/session' },
    { level: 5, name: 'Red Light Therapy', description: 'Skin rejuvenation and anti-aging benefits', features: ['15-20 minute sessions', 'Collagen production', 'Reduces fine lines'], price: '$30-35/session' }
  ];

  const packages = [
    { service: 'Single Session', description: 'Pay as you go, any level', price: '$10-35' },
    { service: '5 Session Package', description: '5% discount on any level', price: 'Starting at $47' },
    { service: '10 Session Package', description: '10% discount on any level', price: 'Starting at $90' },
    { service: 'Monthly Unlimited', description: 'Unlimited tanning on levels 1-3', price: '$59-89/month' },
    { service: 'Premium Unlimited', description: 'Unlimited tanning all levels', price: '$99/month' }
  ];

  const matrixPoster = 'https://customer-assets.emergentagent.com/job_tanmarketing/artifacts/d0qgu4dp_Screenshot_20251108_055133_Google.jpg';

  const faqs = [
    { question: 'How do I choose the right tanning level?', answer: "Start with Level 1 or 2 if you're new to tanning or have fair skin. Our staff can help assess your skin type and recommend the best starting level. You can always upgrade as your tan develops." },
    { question: 'How many sessions do I need to see results?', answer: 'Most people see visible results after 3-5 sessions. For a deep, maintained tan, we recommend 2-3 sessions per week initially, then 1-2 sessions weekly for maintenance.' },
    { question: 'Do I need to use tanning lotion?', answer: 'While not required, tanning lotions significantly improve your results by preparing your skin, accelerating the tanning process, and helping your tan last longer. We carry professional indoor tanning lotions designed specifically for UV beds.' },
    { question: 'Is tanning safe?', answer: 'When done responsibly with proper session times and protective eyewear, indoor tanning can be safe. We follow FDA guidelines and Ohio Board of Cosmetology regulations. We provide protective eyewear and staff guidance on safe tanning practices.' },
    { question: 'Can I tan if I have tattoos?', answer: 'Yes, but UV exposure can fade tattoos over time. We recommend covering newer tattoos and using SPF lotion on older tattoos to preserve their vibrancy.' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[hsl(43_100%_97%)] via-[hsl(43_96%_90%)] to-[hsl(42_92%_85%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(42 92% 40%) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-0" data-testid="tanning-hero-badge"><Sun className="w-3 h-3 mr-1" /> 5 Tanning Levels</Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">Premium Tanning Studio in Mount Vernon</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">Achieve your perfect glow with 5 tanning levels including Matrix stand-up beds and rejuvenating red-light therapy. Professional equipment, expert guidance.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#packages" data-testid="tanning-hero-packages-btn"><Button size="lg" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl"><Star className="w-5 h-5 mr-2" />View Packages</Button></a>
              <Button onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} data-testid="tanning-hero-talk-btn" variant="outline" size="lg" className="px-8 h-14 font-semibold text-lg bg-white hover:bg-gray-50"><Mic className="w-5 h-5 mr-2" />Talk to Mary</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video/Media */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <Card className="p-0 overflow-hidden">
            <video 
              controls 
              poster={matrixPoster}
              className="w-full h-auto"
              data-testid="tanning-video"
            >
              <source src="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/e30rw6wp_Movie%2090_1_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        </div>
      </section>

      {/* Levels */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-12"><h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Choose Your Tanning Level</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">From beginner-friendly beds to advanced Matrix technology and red-light therapy</p></div>
          <Tabs defaultValue="level1" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto mb-8">
              <TabsTrigger value="level1">Level 1</TabsTrigger>
              <TabsTrigger value="level2">Level 2</TabsTrigger>
              <TabsTrigger value="level3">Level 3</TabsTrigger>
              <TabsTrigger value="level4">Level 4</TabsTrigger>
              <TabsTrigger value="level5">Level 5</TabsTrigger>
            </TabsList>
            {tanningLevels.map((level, index) => (
              <TabsContent key={index} value={`level${level.level}`} className="mt-0">
                <Card className="p-8 max-w-3xl mx-auto">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-[hsl(43_96%_90%)]">{level.level === 5 ? <Sparkles className="w-8 h-8 text-[hsl(var(--primary))]" /> : <Sun className="w-8 h-8 text-[hsl(var(--primary))]" />}</div>
                    <div className="flex-1"><div className="flex items-center gap-3 mb-2"><h3 className="font-serif text-2xl font-bold">Level {level.level}: {level.name}</h3><Badge variant="secondary">{level.price}</Badge></div><p className="text-muted-foreground text-lg">{level.description}</p></div>
                  </div>
                  <div className="space-y-3">{level.features.map((f, i) => (<div key={i} className="flex items-center gap-3"><Zap className="w-5 h-5 text-secondary flex-shrink-0" /><span>{f}</span></div>))}</div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 lg:py-24 bg-muted"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><div className="max-w-4xl mx-auto"><h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Tanning Packages</h2><PricingTable items={packages} note="Prices vary by tanning level. Monthly unlimited packages require autopay." /></div></div></section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><div className="max-w-3xl mx-auto"><FAQAccordion faqs={faqs} /></div></div></section>

      {/* Booking */}
      <section className="py-16 lg:py-24 bg-muted"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><BookingForm service="tanning" title="Book Your Tanning Session" description="Request an appointment and we'll follow up via SMS/chat to confirm." /></div></section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><BookingCTA title="Ready for Your Perfect Glow?" subtitle="Visit us today at 818 Coshocton Ave. No appointment needed - walk-ins welcome!" primaryAction={{ text: 'Talk to Mary', onClick: () => window.openMaryChatAndListen && window.openMaryChatAndListen() }} directionsUrl="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" /></div></section>
    </div>
  );
}
