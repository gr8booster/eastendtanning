import { FAQAccordion } from '../components/FAQAccordion';
import { BookingCTA } from '../components/BookingCTA';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Coffee, Zap, Heart, Sparkles, Clock, MapPin, Phone } from 'lucide-react';

export default function Drinks() {
  const menuCategories = [
    {
      name: "Coffee & Espresso",
      icon: <Coffee className="w-6 h-6" />,
      items: [
        { name: "Hot Coffee", price: "$3-5" },
        { name: "Iced Coffee", price: "$4-6" },
        { name: "Espresso", price: "$3-4" },
        { name: "Latte", price: "$4-6" },
        { name: "Cappuccino", price: "$4-6" },
        { name: "Mocha", price: "$5-7" }
      ]
    },
    {
      name: "Dirty Sodas",
      icon: <Sparkles className="w-6 h-6" />,
      items: [
        { name: "Classic Dirty Soda", price: "$5-7" },
        { name: "Vanilla Cream Soda", price: "$5-7" },
        { name: "Cherry Lime Fizz", price: "$5-7" },
        { name: "Coconut Paradise", price: "$6-8" },
        { name: "Strawberry Dream", price: "$6-8" },
        { name: "Custom Creation", price: "$6-8" }
      ]
    },
    {
      name: "Energy Bombs",
      icon: <Zap className="w-6 h-6" />,
      items: [
        { name: "Classic Energy Bomb", price: "$6-8" },
        { name: "Pre-Workout Blast", price: "$7-9" },
        { name: "Focus Formula", price: "$7-9" },
        { name: "Tropical Thunder", price: "$7-9" },
        { name: "Berry Boost", price: "$7-9" }
      ]
    },
    {
      name: "Healthy Options",
      icon: <Heart className="w-6 h-6" />,
      items: [
        { name: "Meal Replacement Shake", price: "$7-10" },
        { name: "Protein Smoothie", price: "$6-9" },
        { name: "Green Detox", price: "$6-8" },
        { name: "Immune Booster", price: "$6-8" },
        { name: "Collagen Beauty Blend", price: "$7-9" }
      ]
    }
  ];

  const faqs = [
    {
      question: "What's a 'Dirty Soda'?",
      answer: "Dirty sodas are a trendy drink that combines soda (like Dr. Pepper, Coke, or Sprite) with cream, flavored syrups, and mix-ins like fresh fruit or candy. It's a sweet, indulgent treat that's incredibly customizable!"
    },
    {
      question: "Are your energy bombs safe?",
      answer: "Yes! Our energy bombs use quality energy drink bases and natural flavor combinations. However, they do contain caffeine and should be consumed responsibly. We don't recommend them for children, pregnant women, or those sensitive to caffeine."
    },
    {
      question: "Can I customize my drink?",
      answer: "Absolutely! We love creating custom drinks. Tell us your preferences (sweet, tart, creamy, fruity, etc.) and we'll make something perfect for you. Extra flavor shots and add-ins may cost extra."
    },
    {
      question: "Do you have sugar-free or low-calorie options?",
      answer: "Yes! We offer sugar-free syrups and can use diet sodas or sparkling water as bases. Our meal replacement shakes are also a great lower-calorie option with added nutrition."
    },
    {
      question: "What's in a meal replacement shake?",
      answer: "Our meal replacement shakes include protein powder, fruits or vegetables, healthy fats, and flavor enhancers. They're designed to be nutritionally balanced and keep you full. Perfect for busy mornings or post-workout!"
    },
    {
      question: "Do you have dairy-free options?",
      answer: "Yes! We can substitute dairy cream with almond milk, oat milk, or coconut milk in most of our drinks."
    },
    {
      question: "Can I order ahead?",
      answer: "Call us at (740) 280-9400 to place an order and we'll have it ready when you arrive!"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-[hsl(172_45%_94%)] via-[hsl(183_45%_90%)] to-[hsl(183_55%_85%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 1px 1px, hsl(183 55% 40%) 1px, transparent 0)", backgroundSize: "40px 40px"}}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary text-white border-0" data-testid="drinks-hero-badge">
              <Sparkles className="w-3 h-3 mr-1" /> Coffee • Dirty Sodas • Energy • Health
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Fizze Drinks - Refreshment Redefined
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              From classic coffee to trendy dirty sodas, energy bombs, and healthy meal replacement shakes. Your perfect drink awaits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#menu" data-testid="drinks-hero-menu-btn">
                <Button size="lg" className="bg-secondary text-white px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl">
                  <Coffee className="w-5 h-5 mr-2" />
                  View Menu
                </Button>
              </a>
              <Button onClick={() => window.openMaryChat && window.openMaryChat()} data-testid="drinks-hero-chat-btn" variant="outline" size="lg" className="px-8 h-14 font-semibold text-lg bg-white hover:bg-gray-50">
                Chat with Mary
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Our Menu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Hand-crafted drinks made fresh to order with premium ingredients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow" data-testid={`menu-category-${index}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    {category.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{category.name}</h3>
                </div>
                <div className="space-y-3">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-secondary font-semibold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground italic">Prices may vary based on size and customizations. Add extra shots, toppings, or flavor swirls for $0.50-1.50 each.</p>
          </div>
        </div>
      </section>

      {/* Why Fizze? */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[hsl(43_96%_96%)] to-[hsl(183_45%_96%)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-12 text-center">Why Fizze Drinks?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trendy & Unique</h3>
              <p className="text-sm text-muted-foreground">Stay ahead of drink trends with our creative dirty sodas and custom creations</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Health-Conscious</h3>
              <p className="text-sm text-muted-foreground">Meal replacement shakes and protein smoothies for your wellness goals</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Energy Boost</h3>
              <p className="text-sm text-muted-foreground">Custom energy bombs to power through your day or workout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <Card className="p-8 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Visit Fizze Drinks</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">818 Coshocton Ave, Mt Vernon, OH 43050</p>
                  <p className="text-sm text-muted-foreground italic mt-1">Inside Eastend Tanning & Laundry</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="font-medium">(740) 280-9400</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium" data-testid="fizze-hours">Mon-Fri: 7:30 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sat-Sun: 8:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </Card>
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
            title="Thirsty? Come See Us!"
            subtitle="Visit Fizze Drinks inside Eastend for your perfect refreshment. Custom drinks made fresh!"
            primaryAction={{
              text: "Call to Order Ahead",
              href: "tel:+17402809400"
            }}
            callNumber="+17402809400"
            directionsUrl="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
          />
        </div>
      </section>
    </div>
  );
}
