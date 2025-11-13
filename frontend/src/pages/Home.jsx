import { motion } from 'framer-motion';
import { ServiceCard } from '../components/ServiceCard';
import { MapPin, Clock, Star, Mic } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SEOHead, createLocalBusinessSchema } from '../components/SEOHead';

export default function Home() {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Eastend Tanning & Laundry | Mt Vernon, OH | Tanning Salon & Laundromat Knox County"
        description="Eastend Tanning & Laundry at 818 Coshocton Ave, Mt Vernon, OH offers unlimited tanning packages, red light therapy, and coin laundry with free drying every day. Serving Knox County, Ohio. Call (740) 397-9632."
        keywords="tanning salon Mt Vernon, laundromat Knox County, red light therapy Mt Vernon, coin laundry Mt Vernon OH, tanning near me, laundry with free drying Mt Vernon, UV tanning Knox County Ohio"
        ogImage="https://laundromat-hub.preview.emergentagent.com/images/eastend-hero.jpg"
        schemaMarkup={createLocalBusinessSchema()}
      />
      {/* Hero Section */}
      <section data-testid="home-hero" className="relative py-12 sm:py-16 lg:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))] overflow-hidden">
        <div className="noise"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.01em] text-foreground mb-4">Mt Vernon's Premier Tanning Salon & Laundromat</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">Eastend Tanning & Laundry offers premium tanning beds, red light therapy, and coin laundry with free drying every day at 818 Coshocton Ave, serving Mt Vernon and Knox County, Ohio.</p>
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button data-testid="home-hero-primary-cta-button" size="lg" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 h-12 font-semibold shadow-md hover:bg-[hsl(42_92%_50%)] hover:shadow-lg transition-all duration-200">
                <Mic className="w-4 h-4" />
                Talk to Mary
              </Button>
              <a href="#locations" data-testid="home-hero-secondary-cta-button">
                <Button variant="outline" size="lg" className="inline-flex items-center gap-2 px-6 h-12 font-semibold border-2 hover:bg-white/50 transition-all duration-200">
                  <MapPin className="w-4 h-4" />
                  Find a Location
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Bento Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <ServiceCard title="Tanning Studio" description="5 tanning levels including Matrix, stand-up, and red-light therapy. Achieve your perfect glow." ctaText="Explore Tanning" href="/tanning" imageUrl="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg" tone="tanning" />
            <ServiceCard title="Laundromat" description="Two convenient locations with modern washers and dryers. Clean, safe, and always open." ctaText="Find Washers" href="/laundry" imageUrl="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/iq5hip31_Screenshot_20251108_054922_Google.jpg" tone="laundry" />
            <ServiceCard title="Fizze Drinks" description="Bubble tea, dirty sodas, energy bombs, and more. Refreshing flavors to brighten your day." ctaText="Sip Fizze Specials" href="/drinks" imageUrl="https://images.pexels.com/photos/9090072/pexels-photo-9090072.jpeg" tone="drinks" />
            <ServiceCard title="Fast Nails" description="Professional nail care with manicures, pedicures, gel services, and nail art. Pamper yourself." ctaText="Book Nail Appointment" href="/nails" imageUrl="https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop" tone="drinks" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section data-testid="about-section" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">Your Local Mount Vernon Destination</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">Eastend Tanning & Laundry is proudly locally owned and operated, serving the Mount Vernon community with premium tanning services, spotless laundromats, and refreshing Fizze drinks. We're committed to providing a welcoming, clean, and convenient experience for all our customers.</p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">Whether you're looking for the perfect tan, need to tackle laundry day, or want to grab a delicious drink, we've got you covered. Visit us today and discover why we're Mount Vernon's favorite spot.</p>
          </div>
        </div>
      </section>

      {/* Locations Strip */}
      <section id="locations" data-testid="locations-section" className="py-12 lg:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eastend Location */}
            <Card data-testid="location-card-eastend" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Eastend Tanning & Laundry</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><span>818 Coshocton Ave, Mt Vernon, OH 43050</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><div><p data-testid="hours-eastend" className="font-medium">Mon-Fri: 8:00 AM - 7:30 PM</p><p>Sun: 8:00 AM - 10:00 PM</p></div></div>
              </div>
              <div className="mt-5 flex gap-3">
                <Button data-testid="location-talk-mary-eastend" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">Talk to Mary</Button>
                <a data-testid="location-directions-button-eastend" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">Directions</Button></a>
              </div>
            </Card>

            {/* Westend Location */}
            <Card data-testid="location-card-westend" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Westend Laundry</h3>
              <Badge variant="secondary" className="mb-3">Coin Laundry Only</Badge>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><span>116 S Norton St, Mt Vernon, OH 43050</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><div><p data-testid="hours-westend" className="font-medium">Open Daily: 6:00 AM - 10:00 PM</p></div></div>
              </div>
              <div className="mt-5 flex gap-3">
                <Button data-testid="location-talk-mary-westend" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">Talk to Mary</Button>
                <a data-testid="location-directions-button-westend" href="https://www.google.com/maps/dir/?api=1&destination=116+S+Norton+St,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">Directions</Button></a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section data-testid="reviews-section" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">What Our Customers Say</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">We love serving the Mount Vernon community! See what our customers have to say and leave us a review on Google!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a data-testid="google-reviews-link" href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930,-82.4850,17z" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="inline-flex items-center gap-2 px-6 h-12 font-semibold hover:bg-muted transition-colors duration-200"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />Read & Leave Google Reviews</Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section - Optimized for Voice & AI Search */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-muted to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[900px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">Where is Eastend Tanning & Laundry located?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  We're located at <strong>818 Coshocton Ave, Mt Vernon, OH 43050</strong>. We serve Mt Vernon and all of Knox County, Ohio. Our facility offers tanning, laundry, Fizze drinks, and nail services all under one roof.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">What time does the laundromat close?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  <strong>Eastend (818 Coshocton Ave)</strong>: Open Mon-Sun 8:00 AM - 9:00 PM with drop-off service and attended washers. <strong>Westend (116 S Norton St)</strong>: Self-service coin laundry open daily 6:00 AM - 10:00 PM.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">Do you offer free drying?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  Yes! At our Eastend location, we offer <strong>45 minutes of free drying every single day</strong>. After that, additional drying is just $0.25 for 7 minutes. This is one of the best values in Knox County!
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">How long are tanning sessions?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  Tanning session lengths vary by bed level: Level 1-2 beds typically 12-15 minutes, Level 3-4 beds 8-12 minutes, and our Matrix bed 6-10 minutes. Our staff will help you determine the right time for your skin type. Monthly unlimited packages let you tan as often as needed!
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">Do you take credit cards or cash?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  <strong>Eastend location</strong> accepts both cash and credit/debit cards for all services (no coins needed). <strong>Westend location</strong> is coin-operated only, but we have coin changer machines on-site for your convenience.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">What tanning packages do you offer in Mt Vernon?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  We offer VIP unlimited tanning starting at $39.99/month (3-month commitment), Monthly unlimited with no commitment ($45.99-$194.99/month), 10-session packages, and single sessions. We have 5 tanning levels plus our exclusive 40,740-watt Matrix bed!
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-semibold text-lg mb-2" itemProp="name">Do you have parking and wheelchair access?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground" itemProp="text">
                  Yes! Both locations offer free parking and are wheelchair accessible. We're committed to serving all members of the Mt Vernon and Knox County community.
                </p>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Have more questions? Talk to Mary, our AI assistant!</p>
            <Button onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} size="lg" className="bg-[hsl(var(--primary))] hover:bg-[hsl(42_92%_50%)]">
              Ask Mary Anything
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
