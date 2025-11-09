import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function Locations() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Find Us in Mount Vernon</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Visit us at either of our convenient locations in Mount Vernon, Ohio.
          </p>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eastend */}
            <Card className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4">Eastend Tanning & Laundry</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">818 Coshocton Ave</p>
                    <p className="text-muted-foreground">Mt Vernon, OH 43050</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">(740) 397-9632</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Tanning & Laundry</p>
                    <p className="text-muted-foreground text-sm">Mon-Fri: 8:00 AM - 7:30 PM</p>
                    <p className="text-muted-foreground text-sm">Sun: 8:00 AM - 10:00 PM</p>
                    <p className="font-medium mt-2">Fizze Drinks</p>
                    <p className="text-muted-foreground text-sm">Mon-Fri: 7:30 AM - 6:00 PM</p>
                    <p className="text-muted-foreground text-sm">Sat-Sun: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-[hsl(var(--secondary))] text-white" data-testid="locations-chat-eastend">Chat with Mary</Button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Directions</Button>
                </a>
              </div>
            </Card>

            {/* Westend */}
            <Card className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-2">Westend Laundry</h2>
              <Badge variant="secondary" className="mb-4">Coin Laundry Only</Badge>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">116 S Norton St</p>
                    <p className="text-muted-foreground">Mt Vernon, OH 43050</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">(740) 393-3766</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Open Daily</p>
                    <p className="text-muted-foreground text-sm">6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => window.openMaryChat && window.openMaryChat()} className="bg-[hsl(var(--secondary))] text-white" data-testid="locations-chat-westend">Chat with Mary</Button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=116+S+Norton+St,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Directions</Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}