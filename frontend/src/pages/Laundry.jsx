import { PricingTable } from '../components/PricingTable';
import { FAQAccordion } from '../components/FAQAccordion';
import { BookingCTA } from '../components/BookingCTA';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Sparkles, Clock, Shield, Wifi, CreditCard, Droplets, MapPin, Phone } from 'lucide-react';

export default function Laundry() {
  const equipment = [
    { service: "Standard Washer", description: "20-25 lb capacity, 30-35 min cycle", price: "$3.00-4.00" },
    { service: "Large Washer", description: "30-35 lb capacity, perfect for comforters", price: "$5.00-6.00" },
    { service: "Extra Large Washer", description: "50+ lb capacity, industrial size", price: "$7.00-8.00" },
    { service: "Standard Dryer", description: "30-40 min cycle, high efficiency", price: "$0.25/8 min" },
    { service: "Wash & Fold Service", description: "Drop off, we wash, dry, fold (by lb)", price: "$1.50-2.00/lb" }
  ];

  const faqs = [
    { question: "What forms of payment do you accept?", answer: "Both locations accept cash, credit/debit cards, and quarters. We have change machines on-site for your convenience." },
    { question: "Do I need to bring my own detergent?", answer: "Yes, please bring your own laundry detergent, fabric softener, and dryer sheets. We also have vending machines with laundry supplies available for purchase." },
    { question: "How long does a typical wash and dry cycle take?", answer: "Washers run for 30-35 minutes depending on the cycle. Dryers typically take 30-40 minutes on medium-high heat. Total time is usually 60-75 minutes." },
    { question: "Can I drop off my laundry and pick it up later?", answer: "Yes! We offer wash-and-fold service at both locations. Drop off your laundry, and we'll wash, dry, and fold it for you." },
    { question: "Are your facilities attended?", answer: "Our laundromats are self-service. Staff may not always be on-site, but we have security cameras and regular maintenance checks to ensure a safe, clean environment." },
    { question: "Do you have WiFi?", answer: "Yes! Free WiFi is available at both locations so you can work, browse, or stream while you wait." },
    { question: "What size washers do I need for a king comforter?", answer: "We recommend our Large (30-35 lb) or Extra Large (50+ lb) washers for king-size comforters, heavy blankets, or sleeping bags." },
    { question: "What are your busiest times?", answer: "Weekends and weekday evenings (5-8pm) tend to be busiest. For a quieter experience, try weekday mornings or early afternoons." }
  ];

  const eastendPhoto = "https://customer-assets.emergentagent.com/job_tanmarketing/artifacts/a3rejhx0_Screenshot_20251108_054802_Google.jpg";

  return (
    <div className="min-h-screen">
      {/* Hero with Eastend photo */}
      <section className="relative py-10 sm:py-16 bg-gradient-to-br from-[hsl(183_45%_96%)] via-[hsl(183_55%_90%)] to-[hsl(183_55%_85%)] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-secondary text-white border-0" data-testid="laundry-hero-badge">
                <Droplets className="w-3 h-3 mr-1" /> 2 Convenient Locations
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">Mount Vernon's Premier Laundromats</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-6 leading-relaxed">Modern washers and dryers, spotless facilities, open daily 6am-10pm. Eastend and Westend locations for your convenience.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#locations" data-testid="laundry-hero-locations-btn"><Button size="lg" className="bg-secondary text-white px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl">Find a Location</Button></a>
                <a href="#pricing" data-testid="laundry-hero-pricing-btn"><Button variant="outline" size="lg" className="px-8 h-14 font-semibold text-lg bg-white hover:bg-gray-50">View Pricing</Button></a>
              </div>
            </div>
            <div className="relative">
              <img src={eastendPhoto} alt="Eastend Laundry" className="w-full rounded-xl border shadow" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Why Choose Our Laundromats?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow"><div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4"><Sparkles className="w-7 h-7 text-secondary" /></div><h3 className="font-semibold text-lg mb-2">Always Clean</h3><p className="text-sm text-muted-foreground">Sanitized daily, well-maintained machines, comfortable waiting areas</p></Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow"><div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4"><Clock className="w-7 h-7 text-secondary" /></div><h3 className="font-semibold text-lg mb-2">Open Late</h3><p className="text-sm text-muted-foreground">Daily 6am-10pm at both locations for your convenience</p></Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow"><div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4"><Shield className="w-7 h-7 text-secondary" /></div><h3 className="font-semibold text-lg mb-2">Safe & Secure</h3><p className="text-sm text-muted-foreground">Well-lit, monitored facilities in convenient locations</p></Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow"><div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4"><Wifi className="w-7 h-7 text-secondary" /></div><h3 className="font-semibold text-lg mb-2">Free WiFi</h3><p className="text-sm text-muted-foreground">Stay connected while you wash - work or browse online</p></Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-center">Equipment & Pricing</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Coin-operated and card-accepted machines. Change machines available on-site.</p>
            <PricingTable items={equipment} note="Prices may vary slightly by location. Wash-and-fold service requires 24-hour notice." />
          </div>
        </div>
      </section>

      {/* Locations Comparison */}
      <section id="locations" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Our Two Locations</h2>
          {/* ... existing cards unchanged ... */}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-muted"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><div className="max-w-3xl mx-auto"><FAQAccordion faqs={faqs} /></div></div></section>
      <section className="py-16 lg:py-24 bg-white"><div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]"><BookingCTA title="Visit Us Today!" subtitle="Two convenient locations in Mount Vernon. Open daily with extended hours for your convenience." primaryAction={{ text: 'Get Directions', href: 'https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050' }} showCall={true} showDirections={false} callNumber="+17403979632" /></div></section>
    </div>
  );
}
