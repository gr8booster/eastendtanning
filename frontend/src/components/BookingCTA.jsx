import { Button } from './ui/button';
import { Calendar, MessageCircle, MapPin } from 'lucide-react';

export const BookingCTA = ({ 
  title = "Ready to Book?", 
  subtitle, 
  primaryAction, 
  showCall = true, 
  showDirections = true,
  callNumber,
  directionsUrl,
  className = ""
}) => {
  const openMary = () => {
    if (window.openMaryChat) window.openMaryChat();
    else window.location.assign('/');
  };
  return (
    <div className={`rounded-xl bg-gradient-to-br from-[hsl(43_96%_96%)] to-[hsl(183_45%_96%)] p-8 sm:p-10 text-center ${className}`}>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3 text-foreground">{title}</h2>
      {subtitle && <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {primaryAction && (
          <Button data-testid="booking-cta-primary" size="lg" className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 h-14 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200" onClick={primaryAction.onClick} asChild={primaryAction.href ? true : false}>
            {primaryAction.href ? (
              <a href={primaryAction.href}><Calendar className="w-5 h-5" />{primaryAction.text}</a>
            ) : (<><Calendar className="w-5 h-5" />{primaryAction.text}</>)}
          </Button>
        )}
        <Button variant="outline" size="lg" className="inline-flex items-center gap-2 px-6 h-14 font-semibold bg-white hover:bg-gray-50 transition-colors" onClick={openMary} data-testid="booking-cta-talk-to-mary">
          <MessageCircle className="w-5 h-5" /> Chat with Mary
        </Button>
        {showDirections && directionsUrl && (
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" data-testid="booking-cta-directions">
            <Button variant="outline" size="lg" className="inline-flex items-center gap-2 px-6 h-14 font-semibold bg-white hover:bg-gray-50 transition-colors">
              <MapPin className="w-5 h-5" /> Directions
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};
