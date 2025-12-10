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
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2 text-foreground">Follow Us:</p>
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/EastendTanningLaundry" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                  data-testid="facebook-link"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/eastendmtvernon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                  data-testid="instagram-link"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our TikTok"
                  className="w-10 h-10 rounded-full bg-black hover:bg-black/90 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                  data-testid="tiktok-link"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
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
              <a href="/blog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Blog - People of Eastend</a>
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