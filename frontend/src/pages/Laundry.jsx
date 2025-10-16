import { Button } from '../components/ui/button';
import { Phone, MapPin } from 'lucide-react';

export default function Laundry() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(183_45%_96%),hsl(43_96%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Laundromat Services</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Two convenient locations in Mount Vernon with modern washers and dryers. Clean, safe, and always open.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <p className="text-center text-base sm:text-lg text-muted-foreground mb-12">
            Visit our Eastend or Westend locations for spotless laundry services with coin-operated washers and dryers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-xl mb-4">Eastend Laundry</h3>
              <p className="text-muted-foreground mb-4">818 Coshocton Ave, Mt Vernon, OH 43050</p>
              <div className="flex gap-3 justify-center">
                <a href="tel:+17403979632">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white">Call</Button>
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Directions</Button>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-xl mb-4">Westend Laundry</h3>
              <p className="text-muted-foreground mb-4">116 S Norton St, Mt Vernon, OH 43050</p>
              <div className="flex gap-3 justify-center">
                <a href="tel:+17403933766">
                  <Button size="sm" className="bg-[hsl(var(--secondary))] text-white">Call</Button>
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=116+S+Norton+St,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">Directions</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}