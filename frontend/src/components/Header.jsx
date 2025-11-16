import { Button } from './ui/button';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { Menu, MessageCircle, MapPin, Mic, Truck } from 'lucide-react';

export const Header = () => {
  return (
    <header data-testid="site-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px] h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" data-testid="header-logo-link" className="font-serif text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors duration-200">
          Eastend
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a data-testid="nav-tanning-link" href="/tanning" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Tanning</a>
          <a data-testid="nav-laundry-link" href="/laundry" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Laundry</a>
          <a data-testid="nav-drinks-link" href="/drinks" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Fizze Drinks</a>
          <a data-testid="nav-nails-link" href="/nails" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Nails</a>
          <a data-testid="nav-foodtruck-link" href="/foodtruck" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Food Truck Stop</a>
          <a data-testid="nav-locations-link" href="/locations" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Locations</a>
          <a data-testid="nav-blog-link" href="/blog" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">People of the Eastend</a>
          <a data-testid="nav-contact-link" href="/contact" className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Contact</a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex gap-3">
          <a data-testid="nav-book-spot-button" href="/foodtruck">
            <Button variant="default" size="default" className="inline-flex items-center gap-2 bg-[hsl(24_100%_50%)] text-white hover:bg-[hsl(24_100%_45%)] font-semibold shadow-md hover:shadow-lg transition-all duration-200">
              <Truck className="w-4 h-4" />
              Book Your Spot
            </Button>
          </a>
          <Button data-testid="nav-chat-button" onClick={() => window.openMaryChat && window.openMaryChat()} variant="default" size="default" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(42_92%_50%)] font-semibold">
            <MessageCircle className="w-4 h-4" />
            Chat with Mary
          </Button>
          <Button data-testid="nav-talk-button" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()} variant="outline" size="default" className="inline-flex items-center gap-2 font-semibold">
            <Mic className="w-4 h-4" />
            Talk to Mary
          </Button>
          <a data-testid="nav-directions-button" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="default" className="inline-flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4" />
              Directions
            </Button>
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button data-testid="nav-menu-button" className="h-10 w-10 grid place-items-center border rounded-md hover:bg-muted transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="grid gap-4 mt-8">
                <a href="/tanning" className="text-base font-medium hover:text-primary transition-colors">Tanning</a>
                <a href="/laundry" className="text-base font-medium hover:text-primary transition-colors">Laundry</a>
                <a href="/drinks" className="text-base font-medium hover:text-primary transition-colors">Fizze Drinks</a>
                <a href="/nails" className="text-base font-medium hover:text-primary transition-colors">Nails</a>
                <a href="/foodtruck" className="text-base font-medium hover:text-primary transition-colors">Food Truck Stop</a>
                <a href="/blog" className="text-base font-medium hover:text-primary transition-colors">People of the Eastend</a>
                <a href="/locations" className="text-base font-medium hover:text-primary transition-colors">Locations</a>
                <a href="/contact" className="text-base font-medium hover:text-primary transition-colors">Contact</a>
                <div className="mt-4 space-y-3">
                  <button data-testid="sheet-chat-button" className="inline-flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] h-11 w-full font-semibold" onClick={() => window.openMaryChat && window.openMaryChat()}>
                    <MessageCircle className="w-4 h-4" />
                    Chat with Mary
                  </button>
                  <button data-testid="sheet-talk-button" className="inline-flex items-center justify-center gap-2 rounded-md border h-11 w-full font-semibold" onClick={() => window.openMaryChatAndListen && window.openMaryChatAndListen()}>
                    <Mic className="w-4 h-4" />
                    Talk to Mary
                  </button>
                  <a data-testid="sheet-directions-button" className="inline-flex items-center justify-center gap-2 rounded-md border h-11 w-full font-semibold" href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
