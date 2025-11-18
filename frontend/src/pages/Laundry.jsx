import { motion } from 'framer-motion';
import { ServiceCard } from '../components/ServiceCard';
import { MapPin, Clock, DollarSign, Sparkles, CreditCard, Coins, User, Shield, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SEOHead, createServiceSchema } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { allFAQSchemas } from '../utils/faqSchemas';
import { laundryServiceSchema, generateBreadcrumb } from '../utils/structuredData';

const laundryImage = 'https://customer-assets.emergentagent.com/job_cece3dc5-08ac-44b8-9e32-3608ea17c8d0/artifacts/ylcc1ll3_Screenshot_20251108_054848_Google.jpg';

export default function Laundry() {
  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Laundry', path: '/laundry' }
  ]);

  return (
    <div className="min-h-screen bg-muted">
      {/* Enhanced SEO with 7 FAQs and Laundromat Schema */}
      <EnhancedSEO
        title="Laundry Services - Wash Dry Fold & Self-Service | Eastend Mt Vernon OH"
        description="Full-service wash, dry, and fold laundry at Eastend Mt Vernon. Self-service washers and dryers in multiple sizes. Clean facility with WiFi, seating. Drop-off service available. Large-capacity machines for comforters. 818 Coshocton Ave. Open daily 8am-7:30pm. Call (740) 397-9632."
        keywords="laundry services Mt Vernon, wash and fold Mt Vernon OH, laundromat Knox County, self-service laundry, drop-off laundry, coin laundry Mt Vernon, large capacity washers, comforter washing, 818 Coshocton Ave, wash dry fold service"
        canonicalUrl="https://eastend.website/laundry"
        faqSchema={allFAQSchemas.laundry}
        structuredData={[laundryServiceSchema, createServiceSchema('Wash Dry Fold Service', 'Professional full-service laundry - drop off dirty, pick up clean and folded', 1.75)]}
        breadcrumbs={breadcrumbs}
        ogImage={laundryImage}
      />

      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={laundryImage}
          alt="Modern Laundromat"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
                Clean, Modern Laundry Facilities
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Two convenient locations with modern equipment and flexible service options
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Two Locations */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Two Locations to Serve You</h2>
          <p className="text-xl text-muted-foreground">Choose the service that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Eastend */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-3xl font-bold">Eastend Location</h3>
              <Badge className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white">
                <User className="w-4 h-4 mr-1" />
                Attendant on Duty
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-muted-foreground">8:00 AM - 6:00 PM Daily</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">818 Coshocton Ave, Mt Vernon, OH</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">(740) 397-9632</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Payment Methods</p>
                  <p className="text-muted-foreground">Cash & Credit Cards (No Coins)</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[hsl(42_92%_55%)]/10 to-[hsl(183_55%_43%)]/10 rounded-lg p-6 border-2 border-[hsl(42_92%_55%)]">
              <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[hsl(42_92%_55%)]" />
                Drop-Off Service & Self-Service
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold"><DollarSign className="w-4 h-4 inline" />Laundry Drop-Off:</span>
                  <span className="text-2xl font-bold text-[hsl(42_92%_55%)]">$1.75/lb</span>
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold mb-2">Washer Sizes & Pricing:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>20 lb washers</span>
                      <span className="font-bold">$4.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>40 lb washers</span>
                      <span className="font-bold">$5.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>60 lb washers</span>
                      <span className="font-bold">$7.50</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Free Drying:</span>
                  <span className="font-bold">45 minutes daily</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Additional Drying:</span>
                  <span className="font-bold">$0.25 for 7 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Professional attendant on duty for assistance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Modern, high-efficiency washers and dryers</span>
              </div>
            </div>
          </Card>

          {/* Westend */}
          <Card className="p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-3xl font-bold">Westend Location</h3>
              <Badge variant="secondary">
                <Coins className="w-4 h-4 mr-1" />
                Self-Service
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-muted-foreground">6:00 AM - 10:00 PM Daily</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">116 S Norton St, Mt Vernon, OH</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">(740) 397-9632</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-[hsl(42_92%_55%)] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Payment Methods</p>
                  <p className="text-muted-foreground">Coin-Operated Only</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-600" />
                Self-Service Coin Laundry
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold mb-2 text-sm">Washer Sizes Available:</p>
                  <div className="space-y-1 text-sm pl-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>30 lb washers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>50 lb washers</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Coin changer machines available for convenience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>24/7 security monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Extended hours: Open from 6 AM to 10 PM</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">⚠️ Note: Westend is coin-operated self-service only. For drop-off service and attendant assistance, visit Eastend location.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Questions About Our Services?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Call us at (740) 397-9632 or chat with Mary Well for instant answers
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[hsl(42_92%_55%)] hover:bg-white/90"
              onClick={() => window.open('tel:7403979633')}
            >
              Call (740) 397-9632
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.openMaryChat?.()}
            >
              Chat with Mary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
