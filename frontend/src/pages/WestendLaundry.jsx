import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Clock, DollarSign, Shield, Star } from 'lucide-react';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { StaticFallback } from '../components/StaticFallback';
import { FacebookFeed } from '../components/FacebookFeed';
import { ReviewSubmission } from '../components/ReviewSubmission';
import { PublicReviews } from '../components/PublicReviews';
import { westendLaundrySchema, createFAQSchema } from '../utils/seoSchemas';
import { Link } from 'react-router-dom';

export default function WestendLaundry() {
  const westendFAQs = [
    {
      question: "Where is Westend Laundry located in Mt Vernon?",
      answer: "Westend Laundry is located at 3024 Coshocton Rd, Mt Vernon, OH 43050 on the west side of town near residential neighborhoods."
    },
    {
      question: "Is Westend Laundry open 24 hours?",
      answer: "Yes! Westend Laundry is open 24/7 - always available for your laundry needs any time, day or night."
    },
    {
      question: "Does Westend Laundry have the lowest prices in Mt Vernon?",
      answer: "Yes, Westend Laundry offers the LOWEST laundry prices in Mt Vernon, Ohio with competitive rates on all washer and dryer sizes."
    },
    {
      question: "Is Westend Laundry self-service or attended?",
      answer: "Westend Laundry is a fully self-service coin laundromat. No attendant needed - you can do laundry any time 24/7."
    }
  ];

  const faqSchema = createFAQSchema(westendFAQs);

  return (
    <div className="min-h-screen">
      {/* Static Fallback for SEO */}
      <StaticFallback page="westend" />

      {/* SEO Head */}
      <EnhancedSEO
        title="Westend Laundry - 24/7 Coin Laundry Mt Vernon Ohio - Lowest Prices"
        description="Westend Laundry offers the LOWEST prices in Mt Vernon, Ohio with 24/7 self-service coin laundry at 3024 Coshocton Rd. Multiple washer sizes, always clean, always open. Safe facility with plenty of parking."
        keywords="Westend Laundry, 24/7 laundromat Mt Vernon, coin laundry Mt Vernon Ohio, lowest laundry prices Mt Vernon, self-service laundry, Coshocton Rd laundry, Knox County laundromat, cheap laundry Mt Vernon"
        canonicalUrl="https://eastend.website/westend-laundry"
        structuredData={[westendLaundrySchema, faqSchema]}
        ogImage="https://eastend.website/images/westend-laundry.jpg"
      />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-8">
            <Badge className="bg-green-600 text-white text-xl px-6 py-2 mb-4">
              🏆 Lowest Prices in Mt Vernon
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Westend Laundry</h1>
            <p className="text-2xl text-green-700 font-semibold mb-4">24/7 Coin Laundry - Always Open</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Self-service coin laundromat at 3024 Coshocton Rd, Mt Vernon, OH. 
              The most affordable laundry in Knox County - open any time, day or night.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center border-2 border-green-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold text-lg mb-2">Open 24/7</h3>
              <p className="text-sm">Always available - do laundry any time that's convenient for you</p>
            </Card>

            <Card className="p-6 text-center border-2 border-green-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold text-lg mb-2">Lowest Prices</h3>
              <p className="text-sm">Best rates in Mt Vernon - save money on every load</p>
            </Card>

            <Card className="p-6 text-center border-2 border-green-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold text-lg mb-2">Safe & Clean</h3>
              <p className="text-sm">Well-lit facility with security cameras and regular maintenance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">What We Offer</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="font-bold text-2xl mb-4 text-green-700">Multiple Washer Sizes</h3>
              <p className="mb-4">Choose the right size washer for your laundry load:</p>
              <ul className="space-y-2">
                <li>✓ Small loads: Perfect for quick washes</li>
                <li>✓ Medium loads: Standard family laundry</li>
                <li>✓ Large loads: Comforters and bulky items</li>
              </ul>
              <p className="mt-4 text-green-600 font-semibold">Lowest prices in Mt Vernon guaranteed!</p>
            </Card>

            <Card className="p-8">
              <h3 className="font-bold text-2xl mb-4 text-green-700">Why Choose Westend?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span><strong>24/7 Access:</strong> Laundry on your schedule, not ours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span><strong>No Attendant Needed:</strong> Fully self-service operation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span><strong>Best Prices:</strong> Save money compared to other laundromats</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span><strong>Clean Facility:</strong> Well-maintained machines and facility</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-green-50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Visit Westend Laundry</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="p-8 h-full">
                <MapPin className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">Location & Details</h3>
                <div className="space-y-3">
                  <p><strong>Address:</strong><br/>3024 Coshocton Rd<br/>Mt Vernon, OH 43050</p>
                  <p><strong>Phone:</strong><br/>(740) 397-9632</p>
                  <p><strong>Hours:</strong><br/>Open 24/7 - Always Available</p>
                  <p><strong>Parking:</strong><br/>Free parking lot, well-lit for safety</p>
                  <p><strong>Directions:</strong><br/>On Coshocton Road, west side of Mt Vernon near residential neighborhoods</p>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="font-semibold mb-2">Also Visit:</p>
                  <Link to="/" className="text-blue-600 hover:underline block">🏠 Eastend (Main Location)</Link>
                  <Link to="/laundry" className="text-blue-600 hover:underline block">🧺 Eastend Laundry Services</Link>
                  <Link to="/tanning" className="text-blue-600 hover:underline block">☀️ Eastend Tanning</Link>
                </div>
              </Card>
            </div>

            <div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.9!2d-82.5143!3d40.3892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIzJzIxLjEiTiA4MsKwMzAnNTEuNSJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%" 
                height="500" 
                style={{border: 0, borderRadius: '8px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Westend Laundry Location Map"
              ></iframe>
              <p className="text-sm text-center text-muted-foreground mt-2">Click map for driving directions to Westend Laundry</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[900px]">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {westendFAQs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook Feed Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Latest from Westend Laundry</h2>
          <div className="flex justify-center">
            <FacebookFeed 
              pageUrl="https://www.facebook.com/share/1C5G9Z4gi8/" 
              pageName="Westend Laundry"
            />
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Westend Customer Reviews</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Public Reviews Display */}
            <div>
              <h3 className="font-bold text-xl mb-6">Recent 5-Star Reviews</h3>
              <PublicReviews businessLocation="westend" limit={5} />
            </div>
            
            {/* Review Submission Form */}
            <div>
              <ReviewSubmission defaultLocation="westend" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Save on Laundry?</h2>
          <p className="text-xl mb-8">Visit Westend Laundry today - open 24/7 with the lowest prices in Mt Vernon!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              Get Directions
            </Button>
            <Link to="/laundry">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg">
                Compare Locations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
