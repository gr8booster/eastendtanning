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
}