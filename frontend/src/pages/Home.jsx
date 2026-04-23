import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { MapPin, Clock, Star, Mic, Phone, Award, Users, Shield, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BlackFridayBadge } from '../components/BlackFridayBadge';
import { SEOHead, createLocalBusinessSchema } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { StaticFallback } from '../components/StaticFallback';
import { FacebookFeed } from '../components/FacebookFeed';
import { ReviewSubmission } from '../components/ReviewSubmission';
import { PublicReviews } from '../components/PublicReviews';
import { HolidayDiscountBanner } from '../components/HolidayDiscountBanner';
import { allFAQSchemas } from '../utils/faqSchemas';
import { websiteSchema, generateBreadcrumb } from '../utils/structuredData';
import { eastendOrganizationSchema } from '../utils/businessSchemas';
import { tanningSalonSchema, laundryBusinessSchema, foodEstablishmentSchema } from '../utils/seoSchemas';
import { Link } from 'react-router-dom';
import { ServiceSchema } from '../components/seo/ServiceSchema';

export default function Home() {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } };
  const [blogPosts, setBlogPosts] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Fetch latest 3 blog posts
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/blog/posts`);
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data.slice(0, 3)); // Get latest 3
        }
      } catch (e) {
        console.log('Could not fetch blog posts');
      }
    };
    fetchBlogPosts();
  }, [backendUrl]);

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' }
  ]);

  return (
    <>
      <ServiceSchema name="Eastend Tanning & Laundry" description="Mount Vernon premier tanning salon, laundromat, and bubble tea bar." category="General" />
    <div className="min-h-screen">
      {/* Static Fallback HTML for Crawlers */}
      <StaticFallback page="home" />
      
      {/* Enhanced SEO with FAQs and Structured Data */}
      <EnhancedSEO
        title="#1 Tanning & Laundry in Mt Vernon, Ohio | Eastend Tanning & Laundry"
        description="Eastend Tanning & Laundry - Mt Vernon's premier tanning salon & coin laundry since 1998. 6 tanning bed levels, Matrix Bed, red light therapy, free drying daily. 818 Coshocton Ave. (740) 397-9632. Black Friday BOGO deals!"
        keywords="best tanning salon Mt Vernon Ohio, coin laundry Mt Vernon, Eastend Tanning, laundromat Knox County, tanning beds Mt Vernon, wash dry fold, Matrix tanning bed, red light therapy Mt Vernon, 818 Coshocton Ave, trusted local business"
        canonicalUrl="https://eastend.website/"
        faqSchema={allFAQSchemas.home}
        structuredData={[eastendOrganizationSchema, websiteSchema, tanningSalonSchema, laundryBusinessSchema, foodEstablishmentSchema, createLocalBusinessSchema()]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/eastend-hero.jpg"
      />
      
      {/* Dynamic Holiday/Seasonal Discount Banner */}
      <HolidayDiscountBanner variant="compact" />
      
      {/* Hero Section */}
      <section data-testid="home-hero" className="relative py-12 sm:py-16 lg:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))] overflow-hidden">
        <div className="noise"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            {/* Black Friday Banner */}
            <div className="mb-6">
              <BlackFridayBadge className="text-2xl px-8 py-4 inline-block shadow-2xl" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.01em] text-foreground mb-4">#1 Tanning & Laundry in Mt Vernon, Ohio</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">Eastend Tanning & Laundry offers premium tanning beds, red light therapy, and professional laundry with free drying every day at 818 Coshocton Ave, serving Mt Vernon and Knox County, Ohio.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ServiceCard title="Tanning Studio" description="5 tanning levels including Matrix, stand-up, and red-light therapy. Achieve your perfect glow." ctaText="Book Tanning" href="/tanning" imageUrl="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg" tone="tanning" altText="Professional tanning bed with red light therapy at Eastend Tanning, Mt Vernon, OH" />
            <ServiceCard title="Laundromat" description="Two convenient locations with modern washers and dryers. Clean, safe, and always open." ctaText="Laundry Drop-Off Service" href="/laundry" imageUrl="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/iq5hip31_Screenshot_20251108_054922_Google.jpg" tone="laundry" altText="Modern coin-operated washing machines at Eastend Laundromat, Mt Vernon, OH" />
            <ServiceCard title="Fizze Drinks" description="Bubble tea, dirty sodas, energy bombs, and more. Refreshing flavors to brighten your day." ctaText="Order Fizze Drinks" href="/drinks" imageUrl="https://images.pexels.com/photos/9090072/pexels-photo-9090072.jpeg" tone="drinks" altText="Fresh bubble tea and milk tea drinks at Fizze, Eastend Tanning Mt Vernon" />
            <ServiceCard title="Fast Nails" description="Professional nail care with manicures, pedicures, gel services, and nail art. Pamper yourself." ctaText="Book Nail Appointment" href="/nails" imageUrl="https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop" tone="drinks" altText="Professional nail services, manicures and pedicures at Fast Nails, Eastend Mt Vernon" />
            <ServiceCard 
              title="818 Food Truck Stop" 
              description="Order authentic African cuisine or book your food truck spot! Prime location opposite Kroger. $70/day with electricity and water included." 
              ctaText="View Menu & Order" 
              href="/eats" 
              secondaryCta="Book Food Truck Spot"
              secondaryHref="/foodtruck"
              imageUrl="https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxqb2xsb2YlMjByaWNlfGVufDB8fHx8MTc2NTU2MzczOHww&ixlib=rb-4.1.0&q=85" 
              tone="foodtruck" 
              altText="Succulent Ghana Jollof Rice - 818 Food Truck Stop at 818 Coshocton Ave, Mt Vernon" 
            />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Eastend Location */}
            <Card data-testid="location-card-eastend" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Eastend Tanning & Laundry</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><span>818 Coshocton Ave, Mt Vernon, OH 43050</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><div><p data-testid="hours-eastend" className="font-medium">Mon-Sun: 8:00 AM - 7:30 PM</p></div></div>
              </div>
              <div className="mt-5 flex gap-3">
                <Button data-testid="location-talk-mary-eastend" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">Talk to Mary</Button>
                <a data-testid="location-directions-button-eastend" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">Directions</Button></a>
              </div>
            </Card>

            {/* Fizze Drinks */}
            <Card data-testid="location-card-fizze" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Fizze Drinks</h3>
              <Badge variant="secondary" className="mb-3">Bubble Tea Shop</Badge>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><span>818 Coshocton Ave, Mt Vernon, OH 43050</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><a href="tel:+17403979632" className="hover:underline">(740) 397-9632</a></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><div><p data-testid="hours-fizze" className="font-medium">Open Daily: 8:00 AM - 6:00 PM</p></div></div>
              </div>
              <div className="mt-5 flex gap-3">
                <a href="/drinks"><Button data-testid="location-view-menu-fizze" size="sm" className="bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(183_55%_38%)]">View Menu</Button></a>
                <a data-testid="location-directions-button-fizze" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">Directions</Button></a>
              </div>
            </Card>

            {/* Westend Location */}
            <Card data-testid="location-card-westend" className="p-6 bg-white">
              <h3 className="font-semibold text-xl mb-3">Westend Laundry</h3>
              <Badge variant="secondary" className="mb-3">Coin Laundry Only</Badge>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><span>116 S Norton St, Mt Vernon, OH 43050</span></div>
                <div className="flex items-start gap-2 text-muted-foreground"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /><a href="tel:+17403979632" className="hover:underline">(740) 397-9632</a></div>
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

      {/* Facebook Feed Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Latest from Eastend</h2>
          <div className="flex justify-center">
            <FacebookFeed 
              pageUrl="https://www.facebook.com/share/1CtZugxSec/" 
              pageName="Eastend Tanning & Laundry"
            />
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section data-testid="reviews-section" className="py-12 lg:py-20 bg-gradient-to-br from-amber-50 to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">What Our Customers Say</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
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

          <div className="text-center pt-8 border-t">
            <p className="text-base sm:text-lg text-muted-foreground mb-6">Love us? Leave a Google review too!</p>
            <a data-testid="google-reviews-link" href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930,-82.4850,17z" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="inline-flex items-center gap-2 px-6 h-12 font-semibold hover:bg-muted transition-colors duration-200"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />Leave Google Review</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Food Truck CTA Section */}
      <section data-testid="foodtruck-cta-section" className="py-12 lg:py-20 bg-gradient-to-br from-[hsl(24_100%_96%)] to-[hsl(24_100%_98%)] border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(24_100%_50%)] text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-foreground">Own a Food Truck?</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">Reserve your spot at 818 Food Truck Stop - the prime location opposite Kroger in Mt Vernon! Just $70/day with electricity and water included.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/foodtruck" data-testid="foodtruck-cta-primary">
                  <Button size="lg" className="inline-flex items-center gap-2 bg-[hsl(24_100%_50%)] text-white hover:bg-[hsl(24_100%_45%)] px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                      <path d="M15 18H9"/>
                      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                      <circle cx="17" cy="18" r="2"/>
                      <circle cx="7" cy="18" r="2"/>
                    </svg>
                    Book Your Spot Now
                  </Button>
                </a>
                <a href="/foodtruck" data-testid="foodtruck-cta-secondary" className="text-[hsl(24_100%_40%)] font-semibold hover:underline inline-flex items-center gap-2">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Trust Signals & Authority Section */}
      <section className="py-12 bg-gradient-to-br from-amber-50 via-white to-teal-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Trusted by Mt Vernon Since 1998</h2>
            <p className="text-lg text-muted-foreground">Family-owned local business serving Knox County for over 25 years</p>
          </div>

          {/* Trust Badges */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h3 className="font-bold text-lg mb-2">Locally Owned Since 1998</h3>
              <p className="text-sm text-muted-foreground">Over 25 years serving Mt Vernon families with trusted tanning & laundry services</p>
            </Card>

            <Card className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <h3 className="font-bold text-lg mb-2">10,000+ Happy Customers</h3>
              <p className="text-sm text-muted-foreground">Trusted by Mt Vernon residents and OSU Knox Campus students</p>
            </Card>

            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-bold text-lg mb-2">Clean & Safe Facility</h3>
              <p className="text-sm text-muted-foreground">Sanitized daily with well-maintained equipment and secure parking</p>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="font-serif text-2xl font-bold text-center mb-6">Why Choose Eastend?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">✓ Fast Tanning Results</h3>
                <p className="text-muted-foreground">High-powered beds including 40,740W Matrix bed for maximum efficiency</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">✓ Affordable Pricing</h3>
                <p className="text-muted-foreground">Monthly unlimited from $60, free drying every day at laundromat</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">✓ Clean Facility</h3>
                <p className="text-muted-foreground">Sanitized daily, well-maintained equipment, comfortable environment</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">✓ Family Owned</h3>
                <p className="text-muted-foreground">Local business that cares about our Mt Vernon community</p>
              </div>
            </div>
          </div>

          {/* Location & Map */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-serif text-2xl font-bold text-center mb-6">Visit Us in Mt Vernon</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">📍 Our Location</h3>
                <p className="text-lg mb-2"><strong>818 Coshocton Ave</strong></p>
                <p className="text-muted-foreground mb-6">Mount Vernon, OH 43050<br />(Across from Kroger)</p>
                
                <div className="space-y-3">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <MapPin className="w-5 h-5" />
                    Get Directions on Google Maps
                  </a>
                  <a 
                    href="tel:+17403979632" 
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us: (740) 397-9632
                  </a>
                </div>

                {/* Social Proof Badges */}
                <div className="mt-8 flex gap-4">
                  <a href="https://www.facebook.com/EastendTanningLaundry" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/eastendtanning/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                </div>
              </div>

              <div className="h-[300px] rounded-lg overflow-hidden border">
                <iframe 
                  title="Eastend Tanning & Laundry Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m18!1m12!1m18!1m12!1m3!1d3034.33120153835!2d-82.485741623437!3d40.393433671442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883907c0827f3f33%3A0xc07a82645069f9e!2sEastend%20Tanning%20and%20Laundry!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Authority & FAQ Section */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    Where is Eastend Tanning & Laundry located?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">We are located at <strong>818 Coshocton Ave, Mt Vernon, OH 43050</strong>, right across the street from Kroger. Our Westend self-service location is at 116 S Norton St.</p>
                </details>
                
                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    What time does the laundromat close?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">Our main Eastend location is open daily from <strong>8:00 AM to 7:30 PM</strong>. Our Westend location offers extended self-service hours from 6:00 AM to 10:00 PM.</p>
                </details>

                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    Do you offer free drying?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">Yes! We are the <strong>only laundromat in Mt Vernon that offers FREE DRYING</strong> every single day at our Eastend location on Coshocton Ave.</p>
                </details>

                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    How long are tanning sessions?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">Tanning sessions typically range from 8 to 20 minutes depending on the bed level and your skin type. Our AI Assistant, Mary Well, can help you determine the best schedule.</p>
                </details>

                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    Do you take credit cards or cash?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">We accept cash, coins, and all major credit cards. You can also pay via PayPal for online tanning package purchases.</p>
                </details>

                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    What tanning packages do you offer in Mt Vernon?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">We offer single sessions, 10-packs, and our popular Monthly Unlimited VIP packages across 6 different bed levels. <Link to="/tanning" className="text-primary hover:underline">View full tanning pricing here.</Link></p>
                </details>

                <details className="group">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center">
                    Do you have parking and wheelchair access?
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <p className="text-muted-foreground mt-3">Yes, we have plenty of free storefront parking and our facility is fully ADA-compliant and wheelchair accessible.</p>
                </details>
              </div>
              
              <div className="mt-10">
                <Button onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-8">
                  Ask Mary Anything
                </Button>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold mb-8">People of Eastend Blog</h2>
              <div className="space-y-8">
                {blogPosts.length > 0 ? blogPosts.map((post) => (
                  <article key={post.id} className="border-b pb-6">
                    <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.meta_description || post.content.substring(0, 150) + '...'}</p>
                    <Link to={`/blog/${post.id}`} className="text-teal-600 font-semibold hover:underline flex items-center gap-1">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                )) : (
                  <>
                    <article className="border-b pb-6">
                      <h3 className="font-bold text-xl mb-2">Tan Before You Go: Get Vacation Ready</h3>
                      <p className="text-muted-foreground mb-4">Heading to the beach? Build a base tan safely to prevent burning on your trip. Our Level 2 beds are perfect for building a lasting foundation.</p>
                      <Link to="/blog" className="text-teal-600 font-semibold hover:underline flex items-center gap-1">
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </article>
                    <article className="border-b pb-6">
                      <h3 className="font-bold text-xl mb-2">Start Your Summer Body Tan Now</h3>
                      <p className="text-muted-foreground mb-4">Summer is coming! Get a head start on your golden glow. Early season tanning helps you look amazing the first day the sun comes out.</p>
                      <Link to="/blog" className="text-teal-600 font-semibold hover:underline flex items-center gap-1">
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </article>
                    <article className="border-b pb-6">
                      <h3 className="font-bold text-xl mb-2">Tanning for Winter Wellness</h3>
                      <p className="text-muted-foreground mb-4">Beat the winter blues in Knox County. UV light triggers serotonin and vitamin D, helping you stay happy and healthy during the dark Ohio winter.</p>
                      <Link to="/blog" className="text-teal-600 font-semibold hover:underline flex items-center gap-1">
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </article>
                  </>
                )}
                <Link to="/blog">
                  <Button variant="outline" className="w-full h-12 font-bold">View All Stories</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Check, Info, Clock, MapPin, Sparkles, Droplets } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { laundryBusinessSchema, generateBreadcrumb } from '../utils/structuredData';
import { ServiceSchema } from '../components/seo/ServiceSchema';

export default function Laundry() {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Laundry', path: '/laundry' }
  ]);

  return (
    <>
      <ServiceSchema name="Laundromat" description="24/7 self-service laundry and professional drop-off service with free drying." category="Laundry" />
    <div className="min-h-screen bg-slate-50">
      <EnhancedSEO
        title="Best Laundromat in Mt Vernon, Ohio | Eastend Tanning & Laundry"
        description="Eastend Laundry - Mt Vernon's cleanest laundromat with free drying every day! Self-service washers in 3 sizes & professional wash-dry-fold drop-off service. 818 Coshocton Ave. Open daily 8am-7:30pm."
        keywords="laundromat Mt Vernon Ohio, free drying laundromat, laundry service Knox County, wash dry fold Mt Vernon, coin laundry, large capacity washers, drop off laundry service"
        canonicalUrl="https://eastend.website/laundry"
        faqSchema={allFAQSchemas.laundry}
        structuredData={[laundryBusinessSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/iq5hip31_Screenshot_20251108_054922_Google.jpg"
      />

      {/* Hero Section */}
      <section className="relative pt-12 sm:py-20 lg:py-24 bg-gradient-to-br from-teal-500 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-3xl">
            <motion.div {...fadeInUp}>
              <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1 text-sm font-medium backdrop-blur-sm">Cleanest Laundromat in Mt Vernon</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Clean Clothes, <span className="text-teal-200">Zero Effort.</span></h1>
              <p className="text-lg sm:text-xl text-teal-50 mb-8 leading-relaxed">
                Experience Mount Vernon's most modern laundry facility. We offer free drying every day, professional drop-off service, and heavy-duty machines for your largest loads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#services">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-teal-700 hover:bg-teal-50 font-bold h-14 px-8 text-lg shadow-lg">
                    View Services
                  </Button>
                </a>
                <Button onClick={() => window.openMaryChat && window.openMaryChat()} variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold h-14 px-8 text-lg">
                  Ask Mary About Laundry
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-10 bg-white border-b">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">FREE</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Drying Every Day</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">20-60LB</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Washer Sizes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">24 HR</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Westend Access</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">100%</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Clean Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="services" className="py-12 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div {...fadeInUp}>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">Drop-Off Service (Wash, Dry, Fold)</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Don't have time to do it yourself? Let our professionals handle it. Just drop off your laundry, and we'll wash, dry, and fold it perfectly. You'll get your clothes back fresh, clean, and ready to put away.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Check className="w-4 h-4 text-teal-600" /></div>
                  <p className="font-medium">$1.75 per pound (10lb minimum)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Check className="w-4 h-4 text-teal-600" /></div>
                  <p className="font-medium">Same-day service available</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Check className="w-4 h-4 text-teal-600" /></div>
                  <p className="font-medium">Premium detergents used</p>
                </div>
              </div>
              <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 px-8">Ask Mary to Set Up Drop-Off</Button>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/iq5hip31_Screenshot_20251108_054922_Google.jpg" alt="Eastend Tanning & Laundry - Clean, modern washers and dryers in Mt Vernon, OH" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-amber-500 w-5 h-5" />
                  <p className="font-bold text-foreground">Free Drying!</p>
                </div>
                <p className="text-sm text-muted-foreground">Every day, all day long at Eastend.</p>
              </div>
            </motion.div>
          </div>

          {/* Self-Service Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-1">
              <h2 className="font-serif text-3xl font-bold mb-6">Self-Service Tiers</h2>
              <p className="text-muted-foreground mb-8">
                Our high-efficiency washers come in three sizes to handle everything from small daily loads to king-size comforters and rugs.
              </p>
              <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                <h3 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Did you know?
                </h3>
                <p className="text-teal-700 text-sm leading-relaxed">
                  We are the only laundromat in Mount Vernon that offers 100% free drying every day. Just pay for your wash, and the drying is on us!
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2 grid sm:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-teal-500 group">
                <Droplets className="w-8 h-8 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xl mb-2">20LB Washer</h3>
                <p className="text-3xl font-bold text-foreground mb-4">$4.00</p>
                <p className="text-sm text-muted-foreground">Perfect for 2-3 baskets of regular laundry.</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-teal-500 group">
                <Droplets className="w-10 h-10 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xl mb-2">40LB Washer</h3>
                <p className="text-3xl font-bold text-foreground mb-4">$6.50</p>
                <p className="text-sm text-muted-foreground">Ideal for large bedding or a family's weekly load.</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-teal-500 group">
                <Droplets className="w-12 h-12 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xl mb-2">60LB Washer</h3>
                <p className="text-3xl font-bold text-foreground mb-4">$7.50</p>
                <p className="text-sm text-muted-foreground">The ultimate machine for comforters, rugs, and bulk items.</p>
              </Card>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <h2 className="font-serif text-3xl font-bold mb-8">Where to Find Us</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <MapPin className="text-teal-600" />
                      Eastend (Main Location)
                    </h3>
                    <p className="text-muted-foreground mb-2">818 Coshocton Ave, Mt Vernon, OH 43050</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-teal-600">
                      <Clock className="w-4 h-4" />
                      <span>Open Daily: 8:00 AM - 7:30 PM</span>
                    </div>
                    <p className="text-xs text-amber-600 font-bold mt-2 uppercase tracking-wider">* FREE DRYING AT THIS LOCATION *</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <MapPin className="text-teal-600" />
                      Westend (Norton St)
                    </h3>
                    <p className="text-muted-foreground mb-2">116 S Norton St, Mt Vernon, OH 43050</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-teal-600">
                      <Clock className="w-4 h-4" />
                      <span>Open Daily: 6:00 AM - 10:00 PM (24/7 access soon!)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[400px] lg:h-auto bg-muted">
                {/* Map placeholder */}
                <iframe 
                  title="Eastend Laundry Locations Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.33120153835!2d-82.485741623437!3d40.393433671442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883907c0827f3f33%3A0xc07a82645069f9e!2sEastend%20Tanning%20and%20Laundry!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-teal-50 border-t">
        <div className="container mx-auto px-4 text-center max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">Laundry Day Doesn't Have to Be Hard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Visit our Coshocton Ave location for free drying every day, or drop off your load and let us handle the rest. We're here to make your life easier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold h-14 px-10 text-lg shadow-lg">
                Get Directions
              </Button>
            </a>
            <Button onClick={() => window.openMaryChat && window.openMaryChat()} variant="outline" size="lg" className="w-full sm:w-auto border-teal-600 text-teal-700 hover:bg-teal-50 font-bold h-14 px-10 text-lg">
              Chat with Mary
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Star, Clock, MapPin, Check, Sparkles, Scissors, Heart, ShieldCheck } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { generateBreadcrumb } from '../utils/structuredData';
import { ServiceSchema } from '../components/seo/ServiceSchema';

export default function Nails() {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Nails', path: '/nails' }
  ]);

  return (
    <>
      <ServiceSchema name="Nail Salon" description="Professional manicures, pedicures, and nail art in Mount Vernon." category="Beauty" />
    <div className="min-h-screen bg-rose-50/30">
      <EnhancedSEO
        title="Fast Nails Mt Vernon | Professional Manicures & Pedicures"
        description="Fast Nails at Eastend Tanning - Mt Vernon's favorite spot for professional manicures, pedicures, gel nails, and custom nail art. Expert technicians, sanitized environment, and walk-ins welcome! 818 Coshocton Ave."
        keywords="nail salon Mt Vernon Ohio, manicures Mount Vernon, pedicures Knox County, gel nails, acrylic nails, nail art Mt Vernon, Fast Nails, pampering service"
        canonicalUrl="https://eastend.website/nails"
        faqSchema={allFAQSchemas.nails}
        breadcrumbs={breadcrumbs}
        ogImage="https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop"
      />

      {/* Hero Section */}
      <section className="relative pt-12 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-400 to-rose-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-3xl">
            <motion.div {...fadeInUp}>
              <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1 text-sm font-medium backdrop-blur-sm">Professional Nail Care at Eastend</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Elegance at Your <span className="text-rose-200">Fingertips.</span></h1>
              <p className="text-lg sm:text-xl text-rose-50 mb-8 leading-relaxed">
                Experience Mount Vernon's premier nail salon inside Eastend Tanning. From classic manicures to advanced nail art, our expert technicians ensure you leave feeling beautiful and refreshed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="w-full sm:w-auto bg-white text-rose-600 hover:bg-rose-50 font-bold h-14 px-8 text-lg shadow-lg">
                  Book Appointment
                </Button>
                <a href="#services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold h-14 px-8 text-lg">
                    View Price List
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-10 bg-white border-b">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-rose-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">100% Sanitized</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="w-8 h-8 text-rose-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">Expert Care</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="w-8 h-8 text-rose-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">Custom Art</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-rose-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">Walk-ins Welcome</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section id="services" className="py-12 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Professional Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose from our wide range of treatments designed to pamper and beautify.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow border-rose-100">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                <Scissors className="text-rose-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">Manicures</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between"><span>Basic Manicure</span><span className="font-bold text-rose-600">$25+</span></li>
                <li className="flex justify-between"><span>Gel Manicure</span><span className="font-bold text-rose-600">$40+</span></li>
                <li className="flex justify-between"><span>Paraffin Treatment</span><span className="font-bold text-rose-600">$15+</span></li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nail shaping, cuticle care, hand massage, and professional polish application.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-rose-100">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                <Sparkles className="text-rose-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">Pedicures</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between"><span>Basic Pedicure</span><span className="font-bold text-rose-600">$35+</span></li>
                <li className="flex justify-between"><span>Spa Pedicure</span><span className="font-bold text-rose-600">$50+</span></li>
                <li className="flex justify-between"><span>Gel Add-on</span><span className="font-bold text-rose-600">$15+</span></li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Soothing foot soak, exfoliation, callus removal, massage, and polish.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-rose-100">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-6">
                <Star className="text-rose-600 w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">Enhancements</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex justify-between"><span>Acrylic Full Set</span><span className="font-bold text-rose-600">$45+</span></li>
                <li className="flex justify-between"><span>Acrylic Fill</span><span className="font-bold text-rose-600">$35+</span></li>
                <li className="flex justify-between"><span>Custom Nail Art</span><span className="font-bold text-rose-600">$10+</span></li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Durable extensions and artistic designs tailored to your unique style.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="relative order-2 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?q=80&w=1200&auto=format&fit=crop" alt="Professional nail art and manicure results at Fast Nails Mt Vernon" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-rose-50 p-8 rounded-xl shadow-xl hidden sm:block border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-rose-500 text-rose-500" />)}
                </div>
                <p className="font-bold text-foreground">Best in Knox County</p>
                <p className="text-sm text-muted-foreground italic">"Always perfect results!"</p>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="order-1 lg:order-2">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">Experience the Difference</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                At Fast Nails, we prioritize your health and satisfaction. We use only premium products and maintain strict sanitation protocols to ensure a safe, relaxing environment for every client.
              </p>
              <div className="space-y-4 mb-10">
                {['Sanitized instruments for every client', 'Premium OPI & CND products', 'Custom design consultations', 'Relaxing spa environment'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 px-8">
                Book Your Session Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Bar */}
      <section className="py-12 bg-rose-100/50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Visit Fast Nails</h3>
                <p className="text-muted-foreground">Inside Eastend Tanning: 818 Coshocton Ave, Mt Vernon</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-rose-200 bg-white hover:bg-rose-50 text-rose-700">
                  Get Directions
                </Button>
              </a>
              <Button onClick={() => window.openMaryChat && window.openMaryChat()} size="lg" className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white shadow-lg">
                Ask Mary About Availability
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Star, Clock, MapPin, Check, Sparkles, Zap, ShieldCheck, Sun } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { tanningSalonSchema, generateBreadcrumb } from '../utils/structuredData';
import { ServiceSchema } from '../components/seo/ServiceSchema';

export default function Tanning() {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
  const [activeTier, setActiveTier] = useState('monthly');

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Tanning', path: '/tanning' }
  ]);

  const bedTiers = [
    { 
      level: "Level 1", 
      watts: "3,840W", 
      name: "Starter Glow", 
      desc: "Perfect for beginners and building a base tan.",
      pricing: { single: "$5", ten: "$38.99", monthly: "$45.99", vip: "$39.99/mo" }
    },
    { 
      level: "Level 2", 
      watts: "5,000W", 
      name: "Gold Standard", 
      desc: "Our most popular bed for consistent, beautiful results.",
      pricing: { single: "$8", ten: "$59.99", monthly: "$69.99", vip: "$59.99/mo" }
    },
    { 
      level: "Level 3", 
      watts: "10,750W", 
      name: "High Pressure", 
      desc: "Deep results in half the sessions. Premium high-pressure lamps.",
      pricing: { single: "$10", ten: "$94.95", monthly: "$89.99", vip: "$79.99/mo" }
    },
    { 
      level: "Level 4", 
      watts: "13,995W", 
      name: "Elite Red Light", 
      desc: "Maximum UV output combined with red light skin rejuvenation.",
      pricing: { single: "$14.99", ten: "$129.99", monthly: "$119.99", vip: "$99.99/mo" }
    },
    { 
      level: "Stand-Up", 
      watts: "8,640W", 
      name: "Red Light Vertical", 
      desc: "Total 360-degree coverage with skin-repairing red light therapy.",
      pricing: { single: "$11", ten: "$129.99", monthly: "$119.99", vip: "$99.99/mo" }
    },
    { 
      level: "Matrix", 
      watts: "40,740W", 
      name: "Ultra Premium", 
      desc: "Mount Vernon's most powerful bed. Fastest, deepest tan possible.",
      pricing: { single: "$23.99", ten: "N/A", monthly: "$194.99", vip: "$169.99/mo" }
    }
  ];

  return (
    <>
      <ServiceSchema name="Tanning Studio" description="Premium tanning beds including high-pressure Matrix and red light therapy." category="Tanning" />
    <div className="min-h-screen bg-slate-50">
      <EnhancedSEO
        title="Best Tanning Beds Mt Vernon, Ohio | Eastend Tanning & Laundry"
        description="Mount Vernon's premier tanning studio. 6 levels including high-pressure Matrix and red light therapy. Monthly unlimited tanning starts at $39.99. No restrictions, cleanest beds in Knox County."
        keywords="best tanning salon Mt Vernon Ohio, tanning packages Mt Vernon, Matrix tanning bed, red light therapy, monthly unlimited tanning, tanning bed levels, Knox County tanning"
        canonicalUrl="https://eastend.website/tanning"
        faqSchema={allFAQSchemas.tanning}
        structuredData={[tanningSalonSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg"
      />

      {/* Hero Section */}
      <section className="relative pt-12 sm:py-20 lg:py-24 bg-gradient-to-br from-amber-500 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] relative z-10">
          <div className="max-w-3xl">
            <motion.div {...fadeInUp}>
              <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1 text-sm font-medium backdrop-blur-sm">#1 Tanning in Mt Vernon Since 1998</Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Get Your Perfect <span className="text-amber-200">Golden Glow.</span></h1>
              <p className="text-lg sm:text-xl text-amber-50 mb-8 leading-relaxed">
                From base building to deep bronze, our 6 levels of state-of-the-art beds ensure you achieve the exact look you want. Clean, professional, and results-driven.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="w-full sm:w-auto bg-white text-orange-700 hover:bg-amber-50 font-bold h-14 px-8 text-lg shadow-lg">
                  Get a Tanning Consultation
                </Button>
                <a href="#pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold h-14 px-8 text-lg">
                    View Packages
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-10 bg-white border-b">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">Sanitized Daily</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Zap className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">40,740W Matrix</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">No Restrictions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-bold uppercase tracking-wider">Red Light Therapy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tanning Bed Levels */}
      <section id="pricing" className="py-12 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">Choose Your Level</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We offer 6 distinct bed levels to match your skin type and tanning goals perfectly.</p>
            
            {/* Tier Toggle */}
            <div className="flex justify-center mt-10">
              <div className="bg-white p-1 rounded-full border shadow-sm flex">
                <button 
                  onClick={() => setActiveTier('monthly')} 
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTier === 'monthly' ? 'bg-amber-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Monthly Unlimited
                </button>
                <button 
                  onClick={() => setActiveTier('single')} 
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTier === 'single' ? 'bg-amber-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Single Sessions
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bedTiers.map((tier, idx) => (
              <Card key={idx} className="p-8 hover:shadow-xl transition-all border-2 hover:border-amber-500 group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 mb-2">{tier.level}</Badge>
                    <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Sun className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {activeTier === 'monthly' ? tier.pricing.monthly : tier.pricing.single}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                    {activeTier === 'monthly' ? '/month' : '/session'}
                  </span>
                </p>
                <p className="text-sm text-amber-600 font-bold mb-6 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {tier.watts} Power
                </p>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">{tier.desc}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{activeTier === 'monthly' ? 'Unlimited daily visits' : 'High quality UV lamps'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Sanitized before every use</span>
                  </div>
                  {activeTier === 'monthly' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">VIP Rate: {tier.pricing.vip}</span>
                    </div>
                  )}
                </div>
                <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Buy Package
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Red Light Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/zne70emi_Screenshot_20230527-083315_Gallery.jpg" alt="Premium Matrix tanning bed with maximum wattage for elite results" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-50 p-6 rounded-xl shadow-xl hidden sm:block border border-amber-100">
                <p className="font-bold text-foreground text-lg mb-1">Matrix Bed</p>
                <p className="text-sm text-muted-foreground">40,740 Watts of Power</p>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">More Than Just a Tan</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our premium Level 4 and Stand-Up beds feature integrated Red Light Therapy. This advanced technology goes beyond tanning to stimulate collagen, reduce fine lines, and improve overall skin texture while you build your glow.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-amber-600" /></div>
                  <p className="font-medium">Anti-Aging & Collagen Boosting</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-amber-600" /></div>
                  <p className="font-medium">Improved Skin Texture & Tone</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-amber-600" /></div>
                  <p className="font-medium">Reduced Inflammation</p>
                </div>
              </div>
              <Button size="lg" onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-8">Ask Mary About Red Light</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tanning Tips Bar */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="text-center font-serif text-2xl font-bold mb-10">Pro Tips for the Best Results</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2 text-amber-700">Exfoliate First</h3>
              <p className="text-sm text-muted-foreground">Gently exfoliate your skin 24 hours before your session to ensure a smooth, even application and longer-lasting tan.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2 text-amber-700">Stay Hydrated</h3>
              <p className="text-sm text-muted-foreground">Drink plenty of water before and after your session. Hydrated skin tans faster and stays golden longer.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2 text-amber-700">Use Lotion</h3>
              <p className="text-sm text-muted-foreground">Never tan dry! Quality tanning lotions accelerate the process and protect your skin. Ask Mary for a recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white border-t">
        <div className="container mx-auto px-4 text-center max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">Ready to Glow?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Visit us at 818 Coshocton Ave today. No appointment needed for tanning sessions! Just walk in and start your journey to the perfect tan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold h-14 px-10 text-lg shadow-lg">
                Get Directions
              </Button>
            </a>
            <Button onClick={() => window.openMaryChat && window.openMaryChat()} variant="outline" size="lg" className="w-full sm:w-auto border-amber-600 text-amber-700 hover:bg-amber-50 font-bold h-14 px-10 text-lg">
              Talk to Mary Well
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}/**
 * Individual Business Structured Data Schemas
 * Each business has its own LocalBusiness schema with complete NAP (Name, Address, Phone)
 * Optimized for SEO/AEO discovery and indexing
 */

// 1. EASTEND TANNING - Tanning Salon
export const eastendTanningSchema = {
  "@context": "https://schema.org",
  "@type": "TanningSalon",
  "@id": "https://eastend.website/tanning#business",
  "name": "Eastend Tanning",
  "alternateName": "Eastend Tanning Studio",
  "description": "Professional tanning salon in Mt Vernon, OH featuring 6 tanning bed levels including the exclusive Matrix 40,740W bed, stand-up beds, and red light therapy. Monthly unlimited packages starting at $39.99 with no restrictions.",
  "url": "https://eastend.website/tanning",
  "telephone": "+17403979632",
  "email": "tanning@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    }
  ],
  "priceRange": "$39.99-$169.99",
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 1 VIP Unlimited Tanning",
        "description": "Entry-level 3,840W bed, perfect for beginners and fair skin"
      },
      "price": "39.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 2 VIP Unlimited Tanning",
        "description": "Mid-tier 7,680W bed with enhanced UV power"
      },
      "price": "59.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 3 VIP Unlimited Tanning",
        "description": "Advanced 15,360W bed for deeper, faster tans"
      },
      "price": "79.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 4 Stand-Up VIP Unlimited",
        "description": "High-powered 30,720W stand-up bed, no pressure points"
      },
      "price": "119.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Matrix VIP Unlimited Tanning",
        "description": "Exclusive ultra-premium 40,740W bed - fastest, deepest tan available"
      },
      "price": "169.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Red Light Therapy VIP Unlimited",
        "description": "Collagen-boosting red light therapy for skin rejuvenation and anti-aging"
      },
      "price": "64.99",
      "priceCurrency": "USD"
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 2. EASTEND LAUNDRY - Laundromat
export const eastendLaundrySchema = {
  "@context": "https://schema.org",
  "@type": "Laundromat",
  "@id": "https://eastend.website/laundry#business",
  "name": "Eastend Laundry",
  "alternateName": "Eastend Laundromat",
  "description": "Full-service laundromat in Mt Vernon, OH with wash-dry-fold service, self-service washers and dryers in multiple sizes. Clean, modern facility with free WiFi, comfortable seating, and always open.",
  "url": "https://eastend.website/laundry",
  "telephone": "+17403979632",
  "email": "laundry@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    }
  ],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Coins"],
  "currenciesAccepted": "USD",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Comfortable Seating",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free Drying Daily",
      "value": true
    }
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Wash, Dry, and Fold Service",
        "description": "Full-service laundry - drop off dirty clothes, pick up clean and perfectly folded"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Self-Service Washers",
        "description": "Multiple washer sizes including large-capacity for comforters and bulky items"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Self-Service Dryers",
        "description": "High-efficiency dryers in various sizes"
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 3. FIZZE DRINKS - Bubble Tea Shop
export const fizzeDrinksSchema = {
  "@context": "https://schema.org",
  "@type": ["FoodEstablishment", "CafeOrCoffeeShop"],
  "@id": "https://eastend.website/drinks#business",
  "name": "Fizze Drinks",
  "alternateName": "Fizze Bubble Tea Bar",
  "description": "Premium bubble tea and specialty drink shop in Mt Vernon, OH featuring 52+ handcrafted flavors including milk teas, fruit teas, blended ice drinks, dirty sodas, protein shakes, and house specials. Fresh ingredients, customizable sweetness and ice levels. Order online for quick pickup.",
  "url": "https://eastend.website/drinks",
  "telephone": "+17403979632",
  "email": "fizze@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "servesCuisine": ["Bubble Tea", "Milk Tea", "Fruit Tea", "Smoothies"],
  "priceRange": "$6.49-$8.99",
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "acceptsReservations": "False",
  "menu": "https://eastend.website/drinks",
  "hasMenu": {
    "@type": "Menu",
    "@id": "https://eastend.website/drinks#menu",
    "name": "Fizze Drinks Complete Menu",
    "description": "52+ bubble tea flavors including milk teas, fruit teas, blended ice, dirty sodas, and more",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Milk Teas & Bubble Tea",
        "description": "Authentic bubble tea with tapioca pearls, 6 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Fruit Teas",
        "description": "Refreshing fruit-infused teas, 16 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Blended Ice",
        "description": "Frozen blended drinks, 8 flavors from $6.99"
      },
      {
        "@type": "MenuSection",
        "name": "House Specials",
        "description": "Signature Fizze creations, 7 flavors from $6.99"
      },
      {
        "@type": "MenuSection",
        "name": "Dirty Sodas",
        "description": "Flavor-infused sodas with cream, 8 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Protein Shakes",
        "description": "Protein-packed smoothies, 4 flavors at $8.99"
      }
    ]
  },
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 4. FAST NAILS - Nail Salon
export const fastNailsSchema = {
  "@context": "https://schema.org",
  "@type": "NailSalon",
  "@id": "https://eastend.website/nails#business",
  "name": "Fast Nails",
  "alternateName": "Fast Nails at Eastend",
  "description": "Professional nail salon in Mt Vernon, OH offering manicures, pedicures, gel nails, acrylic nails, nail art, and spa services. Walk-ins welcome or book your appointment online.",
  "url": "https://eastend.website/nails",
  "telephone": "+17403979632",
  "email": "nails@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    }
  ],
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Manicure",
        "description": "Professional manicure with nail shaping, cuticle care, and polish"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Pedicure",
        "description": "Relaxing pedicure with foot soak, exfoliation, massage, and polish"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Gel Nails",
        "description": "Long-lasting gel manicure or pedicure with UV curing"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Acrylic Nails",
        "description": "Durable acrylic nail extensions in any length and shape"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Nail Art & Design",
        "description": "Custom nail art, designs, and decorative nail services"
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 5. PEOPLE OF EASTEND - Blog
export const peopleOfEastendSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://eastend.website/blog#website",
  "name": "People of Eastend",
  "alternateName": "People of Eastend Blog",
  "description": "Community blog featuring stories, tips, and updates from Eastend Tanning & Laundry in Mt Vernon, OH. Tanning tips, laundry hacks, drink recipes, beauty advice, and local community spotlights.",
  "url": "https://eastend.website/blog",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "Eastend Tanning & Laundry",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eastend.website/logo.png"
    },
    "url": "https://eastend.website",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mt Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "telephone": "+17403979632",
    "email": "blog@eastend.website"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "Tanning Tips",
      "description": "Professional tanning advice and skin care tips"
    },
    {
      "@type": "Thing",
      "name": "Beauty & Wellness",
      "description": "Beauty tips, nail care, and wellness advice"
    },
    {
      "@type": "Thing",
      "name": "Community Stories",
      "description": "Local Mt Vernon community spotlights and stories"
    },
    {
      "@type": "Thing",
      "name": "Drink Recipes",
      "description": "Fizze drink recipes and customization ideas"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 6. MAIN ORGANIZATION - Parent Company
export const eastendOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://eastend.website/#organization",
  "name": "Eastend Tanning and Laundry",
  "alternateName": ["Eastend Mt Vernon", "Eastend Tanning & Laundry"],
  "description": "Eastend Tanning and Laundry - Premier multi-service destination in Knox County, Ohio. Professional tanning salon with 6 bed levels, full-service laundromat with wash-dry-fold, Fizze bubble tea shop with 52+ flavors, and Fast Nails salon. Serving Mt Vernon and Knox County at 818 Coshocton Ave.",
  "url": "https://eastend.website",
  "logo": "https://eastend.website/logo.png",
  "telephone": "+17403979632",
  "email": "info@eastend.website",
  "potentialAction": {
    "@type": "CommunicateAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://google-reviews-2.preview.emergentagent.com/#chat",
      "description": "Chat with Mary Well, our AI Wingman, for personalized tanning consultations and business help."
    }
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    }
  ],
  "department": [
    { "@id": "https://eastend.website/tanning#business" },
    { "@id": "https://eastend.website/laundry#business" },
    { "@id": "https://eastend.website/drinks#business" },
    { "@id": "https://eastend.website/nails#business" },
    { "@id": "https://eastend.website/locations#westend" },
    { "@id": "https://eastend.website/foodtruck#business" }
  ],
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ]
};

// 7. WESTEND LAUNDRY - Coin Laundromat (Second Location)
export const westendLaundrySchema = {
  "@context": "https://schema.org",
  "@type": "Laundromat",
  "@id": "https://eastend.website/locations#westend",
  "name": "Westend Laundry",
  "alternateName": "Westend Coin Laundromat",
  "description": "Self-service coin laundromat in Mt Vernon, OH with modern washers and dryers in multiple sizes. Clean, safe, 24/7 access facility. Large-capacity machines perfect for comforters and bulky items. Conveniently located on South Norton Street.",
  "url": "https://eastend.website/locations",
  "telephone": "+17405071084",
  "email": "westend@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "116 South Norton Street",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3928",
    "longitude": "-82.4912"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "06:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$",
  "paymentAccepted": ["Coins", "Cash"],
  "currenciesAccepted": "USD",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "24/7 Access",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Self-Service",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Large Capacity Machines",
      "value": true
    }
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Coin-Operated Washers",
        "description": "Self-service washers in multiple sizes including large-capacity for bulky items"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Coin-Operated Dryers",
        "description": "High-efficiency coin-operated dryers in various sizes"
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ],
  "parentOrganization": {
    "@id": "https://eastend.website/#organization"
  }
};

// 8. 818 FOOD TRUCK STOP - Food Truck Rental Space
export const foodTruckStopSchema = {
  "@context": "https://schema.org",
  "@type": "ParkingFacility",
  "@id": "https://eastend.website/foodtruck#business",
  "name": "818 Food Truck Stop",
  "alternateName": "818 Coshocton Food Truck Spot",
  "description": "Prime food truck rental location in Mt Vernon, OH opposite Kroger on busy Coshocton Ave. $70/day includes electricity hookup and water access. High-traffic location perfect for food vendors. Daily and weekly rentals available. Book your spot online.",
  "url": "https://eastend.website/foodtruck",
  "telephone": "+17403979632",
  "email": "foodtruck@eastend.website",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "818 Coshocton Ave",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3934",
    "longitude": "-82.4858"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "06:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$70/day",
  "paymentAccepted": ["PayPal", "Credit Card", "Cash"],
  "currenciesAccepted": "USD",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Electricity Hookup",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Water Access",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "High Traffic Location",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Opposite Kroger",
      "value": true
    }
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Daily Food Truck Spot Rental",
        "description": "Prime food truck location with electricity and water included"
      },
      "price": "70.00",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "70.00",
        "priceCurrency": "USD",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitText": "DAY"
        }
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
  ],
  "parentOrganization": {
    "@id": "https://eastend.website/#organization"
  }
};

export default {
  eastendTanningSchema,
  eastendLaundrySchema,
  fizzeDrinksSchema,
  fastNailsSchema,
  peopleOfEastendSchema,
  eastendOrganizationSchema,
  westendLaundrySchema,
  foodTruckStopSchema
};