import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Phone, MapPin } from 'lucide-react';

export default function Tanning() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Premium Tanning Studio</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Achieve your perfect glow with our 5 tanning levels, including Matrix technology, stand-up beds, and red-light therapy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <p className="text-center text-base sm:text-lg text-muted-foreground mb-12">
            More details coming soon! Call us to learn about our tanning levels, packages, and pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+17403979632">
              <Button size="lg" className="bg-[hsl(var(--primary))] inline-flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call (740) 397-9632
              </Button>
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}