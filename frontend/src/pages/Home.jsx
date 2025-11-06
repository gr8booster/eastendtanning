import { motion } from 'framer-motion';
import { ServiceCard } from '../components/ServiceCard';
import { Phone, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        data-testid="home-hero" 
        className="relative py-12 sm:py-16 lg:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))] overflow-hidden"
      >
        {/* Decorative noise texture */}
        <div className="noise"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.01em] text-foreground mb-4">
              Tanning Studio. Laundromat. Fizze Drinks. Nails.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Your one-stop destination in Mount Vernon, Ohio for premium tanning, spotless laundry, refreshing drinks, and professional nail care.
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+17403979632" data-testid="home-hero-primary-cta-button">
                <Button 
                  size="lg" 
                  className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 h-12 font-semibold shadow-md hover:bg-[hsl(42_92%_50%)] hover:shadow-lg transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </a>
              <a href="#locations" data-testid="home-hero-secondary-cta-button">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="inline-flex items-center gap-2 px-6 h-12 font-semibold border-2 hover:bg-white/50 transition-all duration-200"
                >
                  <MapPin className="w-4 h-4" />
                  Find a Location
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Bento Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <ServiceCard
              title="Tanning Studio"
              description="5 tanning levels including Matrix, stand-up, and red-light therapy. Achieve your perfect glow."
              ctaText="Explore Tanning"
              href="/tanning"
              imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
              tone="tanning"
            />
            <ServiceCard
              title="Laundromat"
              description="Two convenient locations with modern washers and dryers. Clean, safe, and always open."
              ctaText="Find Washers"
              href="/laundry"
              imageUrl="https://images.unsplash.com/photo-1583810266903-fb9cc6e84376?crop=entropy&cs=srgb&fm=jpg&q=85"
              tone="laundry"
            />
            <ServiceCard
              title="Fizze Drinks"
              description="Bubble tea, dirty sodas, energy bombs, and more. Refreshing flavors to brighten your day."
              ctaText="Sip Fizze Specials"
              href="/drinks"
              imageUrl="https://images.pexels.com/photos/9090072/pexels-photo-9090072.jpeg"
              tone="drinks"
            />
            <ServiceCard
              title="Fast Nails"
              description="Professional nail care with manicures, pedicures, gel services, and nail art. Pamper yourself."
              ctaText="Book Nail Appointment"
              href="/nails"
              imageUrl="https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop"
              tone="drinks"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section data-testid="about-section" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">Your Local Mount Vernon Destination</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
              Eastend Tanning & Laundry is proudly locally owned and operated, serving the Mount Vernon community with premium tanning services, spotless laundromats, and refreshing Fizze drinks. We're committed to providing a welcoming, clean, and convenient experience for all our customers.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Whether you're looking for the perfect tan, need to tackle laundry day, or want to grab a delicious drink, we've got you covered. Visit us today and discover why we're Mount Vernon's favorite spot.
            </p>
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
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>818 Coshocton Ave, Mt Vernon, OH 43050</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>(740) 397-9632</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <div>
                    <p data-testid="hours-eastend" className="font-medium">Mon-Fri: 8:00 AM - 7:30 PM</p>
                    <p>Sun: 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a data-testid="location-call-button-eastend" href="tel:+17403979632">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">
                    Call
                  </Button>
                </a>
                <a data-testid="location-directions-button-eastend" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </a>
              </div>
            </Card>

            {/* Westend Location */}
            <Card data-testid="location-card-westend" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Westend Laundry</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>116 S Norton St, Mt Vernon, OH 43050</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>(740) 393-3766</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <div>
                    <p data-testid="hours-westend" className="font-medium">Open Daily: 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a data-testid="location-call-button-westend" href="tel:+17403933766">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">
                    Call
                  </Button>
                </a>
                <a data-testid="location-directions-button-westend" href="https://www.google.com/maps/dir/?api=1&destination=116+S+Norton+St,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </a>
              </div>
            </Card>

            {/* Fizze Drinks */}
            <Card data-testid="location-card-fizze" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Fizze Drinks</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>818 Coshocton Ave, Mt Vernon, OH 43050</span>
                  <span className="text-xs italic">(Inside Eastend)</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>(740) 280-9400</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <div>
                    <p data-testid="hours-fizze" className="font-medium">Mon-Fri: 7:30 AM - 6:00 PM</p>
                    <p>Sat-Sun: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a data-testid="location-call-button-fizze" href="tel:+17402809400">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">
                    Call
                  </Button>
                </a>
                <a data-testid="location-directions-button-fizze" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </a>
              </div>
            </Card>

            {/* Fast Nails */}
            <Card data-testid="location-card-nails" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Fast Nails</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>818 Coshocton Ave, Mt Vernon, OH 43050</span>
                  <span className="text-xs italic">(Inside Eastend)</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <span>(740) 397-9632</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                  <div>
                    <p data-testid="hours-nails" className="font-medium">Mon-Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a data-testid="location-call-button-nails" href="tel:+17403979632">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">
                    Call
                  </Button>
                </a>
                <a data-testid="location-directions-button-nails" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Directions
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section data-testid="reviews-section" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">What Our Customers Say</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We love serving the Mount Vernon community! See what our customers have to say and leave us a review.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              data-testid="google-reviews-link" 
              href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930,-82.4850,17z" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="inline-flex items-center gap-2 px-6 h-12 font-semibold hover:bg-muted transition-colors duration-200"
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                Read Google Reviews
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}