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
    {
      question: "What forms of payment do you accept?",
      answer: "Both locations accept cash, credit/debit cards, and quarters. We have change machines on-site for your convenience."
    },
    {
      question: "Do I need to bring my own detergent?",
      answer: "Yes, please bring your own laundry detergent, fabric softener, and dryer sheets. We also have vending machines with laundry supplies available for purchase."
    },
    {
      question: "How long does a typical wash and dry cycle take?",
      answer: "Washers run for 30-35 minutes depending on the cycle. Dryers typically take 30-40 minutes on medium-high heat. Total time is usually 60-75 minutes."
    },
    {
      question: "Can I drop off my laundry and pick it up later?",
      answer: "Yes! We offer wash-and-fold service at both locations. Drop off your laundry, and we'll wash, dry, and fold it for you. Pricing is typically $1.50-2.00 per pound with a minimum order."
    },
    {
      question: "Are your facilities attended?",
      answer: "Our laundromats are self-service. Staff may not always be on-site, but we have security cameras and regular maintenance checks to ensure a safe, clean environment."
    },
    {
      question: "Do you have WiFi?",
      answer: "Yes! Free WiFi is available at both locations so you can work, browse, or stream while you wait."
    },
    {
      question: "What size washers do I need for a king comforter?",
      answer: "We recommend our Large (30-35 lb) or Extra Large (50+ lb) washers for king-size comforters, heavy blankets, or sleeping bags."
    },
    {
      question: "What are your busiest times?",
      answer: "Weekends (especially Saturday mornings) and weekday evenings (5-8pm) tend to be busiest. For a quieter experience, try weekday mornings or early afternoons."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[hsl(183_45%_96%)] via-[hsl(183_55%_90%)] to-[hsl(183_55%_85%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 1px 1px, hsl(183 55% 40%) 1px, transparent 0)", backgroundSize: "40px 40px"}}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary text-white border-0" data-testid="laundry-hero-badge">
              <Droplets className="w-3 h-3 mr-1" /> 2 Convenient Locations
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Mount Vernon's Premier Laundromats
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Modern washers and dryers, spotless facilities, open daily 6am-10pm. Eastend and Westend locations for your convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#locations" data-testid="laundry-hero-locations-btn">
                <Button size="lg" className="bg-secondary text-white px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find a Location
                </Button>
              </a>
              <a href="#pricing" data-testid="laundry-hero-pricing-btn">
                <Button variant="outline" size="lg" className="px-8 h-14 font-semibold text-lg bg-white hover:bg-gray-50">
                  View Pricing
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Why Choose Our Laundromats?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow" data-testid="feature-clean">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Always Clean</h3>
              <p className="text-sm text-muted-foreground">Sanitized daily, well-maintained machines, comfortable waiting areas</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow" data-testid="feature-hours">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Open Late</h3>
              <p className="text-sm text-muted-foreground">Daily 6am-10pm at both locations for your convenience</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow" data-testid="feature-safe">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">Well-lit, monitored facilities in convenient locations</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow" data-testid="feature-wifi">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Wifi className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free WiFi</h3>
              <p className="text-sm text-muted-foreground">Stay connected while you wash - work or browse online</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-center">Equipment & Pricing</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Coin-operated and card-accepted machines. Change machines available on-site.</p>
            <PricingTable 
              items={equipment}
              note="Prices may vary slightly by location. Wash-and-fold service requires 24-hour notice. Call for same-day availability."
            />
          </div>
        </div>
      </section>

      {/* Locations Comparison */}
      <section id="locations" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Our Two Locations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eastend */}
            <Card className="p-8 hover:shadow-xl transition-shadow" data-testid="location-eastend">
              <Badge className="mb-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">Eastend Location</Badge>
              <h3 className="font-serif text-2xl font-bold mb-6">Eastend Laundry</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">818 Coshocton Ave</p>
                    <p className="text-sm text-muted-foreground">Mt Vernon, OH 43050</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="font-medium">(740) 397-9632</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Open Daily</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri: 8:00 AM - 7:30 PM</p>
                    <p className="text-sm text-muted-foreground">Sun: 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Multiple washer sizes (standard to extra-large)</li>
                  <li>• High-efficiency dryers</li>
                  <li>• Wash-and-fold service available</li>
                  <li>• Free WiFi</li>
                  <li>• Vending machines</li>
                  <li>• Change machine</li>
                </ul>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="tel:+17403979632">
                  <Button size="sm" className="bg-secondary text-white">Call</Button>
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Directions</Button>
                </a>
              </div>
            </Card>

            {/* Westend */}
            <Card className="p-8 hover:shadow-xl transition-shadow" data-testid="location-westend">
              <Badge className="mb-4 bg-secondary text-white">Westend Location</Badge>
              <h3 className="font-serif text-2xl font-bold mb-6">Westend Laundry</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">116 S Norton St</p>
                    <p className="text-sm text-muted-foreground">Mt Vernon, OH 43050</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="font-medium">(740) 393-3766</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Open Daily</p>
                    <p className="text-sm text-muted-foreground">6:00 AM - 10:00 PM</p>
                    <p className="text-sm text-muted-foreground">Every day of the week</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Wide selection of washers and dryers</li>
                  <li>• Large-capacity machines available</li>
                  <li>• Comfortable seating area</li>
                  <li>• Free WiFi</li>
                  <li>• Well-lit parking</li>
                  <li>• Change machine</li>
                </ul>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="tel:+17403933766">
                  <Button size="sm" className="bg-secondary text-white">Call</Button>
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=116+S+Norton+St,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Directions</Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <BookingCTA 
            title="Visit Us Today!"
            subtitle="Two convenient locations in Mount Vernon. Open daily with extended hours for your convenience."
            primaryAction={{
              text: "Get Directions",
              href: "https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
            }}
            showCall={true}
            showDirections={false}
            callNumber="+17403979632"
          />
        </div>
      </section>
    </div>
  );
}