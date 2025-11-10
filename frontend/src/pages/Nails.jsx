import { PricingTable } from '../components/PricingTable';
import { FAQAccordion } from '../components/FAQAccordion';
import { BookingCTA } from '../components/BookingCTA';
import { BookingForm } from '../components/BookingForm';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Clock, MapPin, Phone, Sparkles, Heart, Palette } from 'lucide-react';
import { SEOHead, createServiceSchema } from '../components/SEOHead';

export default function Nails() {
  const services = [
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: "Manicures",
      description: "Basic, gel, French tips, and stunning nail art designs"
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: "Pedicures",
      description: "Relaxing spa pedicures with massage, exfoliation, and polish"
    },
    {
      icon: <Palette className="w-6 h-6 text-secondary" />,
      title: "Specialty Services",
      description: "Gel extensions, nail repair, custom designs, and more"
    }
  ];

  const pricing = [
    { service: "Basic Manicure", description: "Nail shaping, cuticle care, polish", price: "$25-35" },
    { service: "Gel Manicure", description: "Long-lasting gel polish, 2-3 weeks", price: "$40-45" },
    { service: "Basic Pedicure", description: "Foot soak, exfoliation, massage, polish", price: "$40-60" },
    { service: "Gel Pedicure", description: "Spa pedicure with gel polish", price: "$60-75" },
    { service: "Polish Change (Hands)", description: "Polish removal and reapplication", price: "$15-20" },
    { service: "Polish Change (Feet)", description: "Polish removal and reapplication", price: "$15-20" },
    { service: "French Manicure/Pedicure", description: "Classic French tips", price: "+$5-10" },
    { service: "Nail Art (per nail)", description: "Custom designs and embellishments", price: "$5-15" }
  ];

  const faqs = [
    {
      question: "Do you accept walk-ins or appointments only?",
      answer: "We welcome both walk-ins and appointments! However, we recommend calling ahead to ensure availability, especially during peak hours (evenings and weekends)."
    },
    {
      question: "How long does a manicure or pedicure take?",
      answer: "A basic manicure typically takes 30-45 minutes, while a basic pedicure takes 45-60 minutes. Gel services and specialty treatments may take longer. We'll let you know the expected time when you book."
    },
    {
      question: "What brands of polish do you use?",
      answer: "We use professional-grade nail polishes from trusted brands including OPI, Essie, and CND. Our gel polishes are high-quality and long-lasting."
    },
    {
      question: "Do you sanitize tools between clients?",
      answer: "Absolutely! We follow strict sanitation protocols. All metal tools are disinfected in an autoclave between each client, and we use disposable files and buffers for your safety."
    },
    {
      question: "Can I bring my own polish?",
      answer: "Yes, you're welcome to bring your own polish! However, we cannot guarantee the longevity or application quality of outside products."
    },
    {
      question: "Do you offer nail art and custom designs?",
      answer: "Yes! We offer a variety of nail art options from simple accent nails to intricate custom designs. Pricing varies based on complexity. Ask your technician for ideas!"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit cards (Visa, Mastercard, American Express, Discover), and debit cards."
    },
    {
      question: "Do you have a loyalty program or package deals?",
      answer: "Ask us about our special packages and loyalty rewards! We frequently offer discounts for new customers and returning clients."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(172_45%_94%),hsl(43_96%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary text-white" data-testid="nails-hero-badge">Professional Nail Care</Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Fast Nails - Mount Vernon's Nail Salon
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Manicures, pedicures, gel services, and stunning nail art. Pamper yourself with professional care at Fast Nails.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Our Nail Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200" data-testid={`service-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/50">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Services List */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold mb-6">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold mb-2">Manicures</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Basic Manicure</li>
                  <li>• Gel Manicure</li>
                  <li>• French Manicure</li>
                  <li>• Polish Change</li>
                  <li>• Nail Art</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold mb-2">Pedicures</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Basic Pedicure</li>
                  <li>• Gel Pedicure</li>
                  <li>• Spa Pedicure</li>
                  <li>• Polish Change</li>
                  <li>• Callus Treatment</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold mb-2">Specialty Services</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gel Extensions</li>
                  <li>• Nail Repair</li>
                  <li>• Custom Nail Art</li>
                  <li>• Acrylic Removal</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <h4 className="font-semibold mb-2">Add-Ons</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Paraffin Wax Treatment</li>
                  <li>• Hot Stone Massage</li>
                  <li>• Extended Foot Massage</li>
                  <li>• Nail Strengthening</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 lg:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Pricing</h2>
            <PricingTable 
              items={pricing} 
              note="Prices may vary based on service complexity and technician. Call (740) 397-9632 for exact pricing."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 lg:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <BookingForm 
            service="nails"
            title="Book Your Nail Appointment"
            description="Request your preferred time and we'll confirm availability."
          />
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-12 lg:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <Card className="p-8 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Visit Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium" data-testid="nails-hours">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-sm text-muted-foreground mt-1">Walk-ins welcome! Appointments recommended.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">818 Coshocton Ave</p>
                  <p className="text-sm text-muted-foreground">Mt Vernon, OH 43050</p>
                  <p className="text-sm text-muted-foreground italic mt-1">Inside Eastend</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="font-medium">(740) 397-9632</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <BookingCTA 
            title="Ready for Beautiful Nails?"
            subtitle="Book your appointment today or walk in anytime during our hours!"
            primaryAction={{
              text: "Chat with Mary",
              onClick: () => window.openMaryChat && window.openMaryChat()
            }}
            directionsUrl="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
          />
        </div>
      </section>
    </div>
  );
}