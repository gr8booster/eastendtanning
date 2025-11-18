import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & NAP */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-3">Eastend Tanning & Laundry</h3>
            <p className="text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              818 Coshocton Ave<br />
              Mt Vernon, OH 43050
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              <a href="tel:+17403979632" className="hover:text-primary">(740) 397-9632</a>
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <Clock className="w-4 h-4 inline mr-1" />
              Open Daily 8am-7:30pm
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-3 mt-4">
              <a 
                href="https://www.facebook.com/EastendTanningLaundry" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/eastendtanning/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our Instagram"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@peopleofeastend" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our TikTok"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors text-sm font-bold"
              >
                TT
              </a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-semibold text-base mb-3">Our Locations</h4>
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Eastend</p>
                <p className="text-muted-foreground flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  818 Coshocton Ave, Mt Vernon, OH 43050
                </p>
                <p className="text-muted-foreground flex items-start gap-2 mt-1">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  (740) 397-9632
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Westend</p>
                <p className="text-muted-foreground flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  116 S Norton St, Mt Vernon, OH 43050
                </p>
                <p className="text-muted-foreground flex items-start gap-2 mt-1">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  (740) 397-9632
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-3">Quick Links</h4>
            <nav className="space-y-2">
              <a href="/tanning" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Tanning Services</a>
              <a href="/laundry" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Laundry Services</a>
              <a href="/drinks" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Fizze Drinks</a>
              <a href="/nails" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Fast Nails</a>
              <a href="/locations" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Find Us</a>
              <a href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
            </nav>
            <div className="mt-4 pt-4 border-t border-border">
              <a
                href="/admin"
                data-testid="footer-admin-link"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                🎯 Staff Dashboard
              </a>
            </div>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930,-82.4850,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                Leave us a Google Review →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Eastend Tanning & Laundry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};