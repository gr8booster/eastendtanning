import { Button } from '../components/ui/button';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Drinks() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(172_45%_94%),hsl(43_96%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Fizze Drinks</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Bubble tea, dirty sodas, energy bombs, and more. Refreshing flavors to brighten your day!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">Our Specialties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Coffee</h3>
                <p className="text-sm text-muted-foreground">Fresh brewed daily</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Dirty Soda</h3>
                <p className="text-sm text-muted-foreground">Unique flavor combos</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Meal Replacement Shakes</h3>
                <p className="text-sm text-muted-foreground">Healthy & delicious</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Energy Bombs</h3>
                <p className="text-sm text-muted-foreground">Power up your day</p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Hours
              </h3>
              <p className="text-muted-foreground">Mon-Fri: 7:30 AM - 6:00 PM</p>
              <p className="text-muted-foreground">Sat-Sun: 8:00 AM - 4:00 PM</p>
              <p className="text-sm text-muted-foreground mt-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                Located inside Eastend at 818 Coshocton Ave
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+17402809400">
                <Button size="lg" className="bg-[hsl(var(--primary))] inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call (740) 280-9400
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
        </div>
      </section>
    </div>
  );
}