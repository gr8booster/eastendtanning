import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Gift, Clock, Copy, CheckCircle2, Sparkles, Calendar, Tag } from 'lucide-react';
import { getCurrentDiscount, getUpcomingDiscounts, formatDiscountBanner } from '../utils/holidayDiscounts';
import { toast } from 'sonner';

// Main Holiday/Seasonal Discount Banner
export const HolidayDiscountBanner = ({ serviceType = null, variant = 'full', className = '' }) => {
  const [discount, setDiscount] = useState(null);
  const [copied, setCopied] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    const currentDiscount = getCurrentDiscount(serviceType);
    if (currentDiscount) {
      setDiscount(formatDiscountBanner(currentDiscount));
      
      // Calculate days remaining if there's an end date
      if (currentDiscount.endDate) {
        const now = new Date();
        const end = new Date(currentDiscount.endDate);
        const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        setDaysRemaining(days > 0 ? days : null);
      }
    }
  }, [serviceType]);

  const copyCode = () => {
    if (discount?.discountCode) {
      navigator.clipboard.writeText(discount.discountCode);
      setCopied(true);
      toast.success(`Code "${discount.discountCode}" copied!`);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!discount) return null;

  // Compact variant for headers/footers
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r ${discount.colors.primary} text-white py-2 px-4 ${className}`} data-testid="discount-banner-compact">
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
          <span className="text-lg">{discount.emoji}</span>
          <span className="font-semibold">{discount.name}:</span>
          <Badge className="bg-white/20 text-white font-bold">{discount.discountPercent}% OFF</Badge>
          <span className="hidden sm:inline">| Code:</span>
          <button 
            onClick={copyCode}
            className="font-mono bg-white/20 px-2 py-0.5 rounded hover:bg-white/30 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            {discount.discountCode}
            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
          {daysRemaining && daysRemaining <= 7 && (
            <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full animate-pulse">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left!
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full variant for dedicated sections
  return (
    <div className={`py-8 ${className}`} data-testid="discount-banner-full">
      <Card className={`bg-gradient-to-r ${discount.colors.primary} text-white p-6 sm:p-8 overflow-hidden relative`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-20 text-9xl transform translate-x-8 -translate-y-4">
          {discount.emoji}
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <Sparkles className="w-32 h-32 transform -translate-x-8 translate-y-8" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-4xl">{discount.emoji}</span>
                <Badge className="bg-white/20 text-white text-lg px-3 py-1">
                  {discount.discountPercent}% OFF
                </Badge>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">{discount.name}</h3>
              <p className="text-lg text-white/90 mb-1">{discount.tagline}</p>
              <p className="text-sm text-white/80 max-w-md">{discount.description}</p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <p className="text-xs text-white/70 mb-1">USE CODE</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold">{discount.discountCode}</span>
                  <button 
                    onClick={copyCode}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Copy code"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {daysRemaining && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {daysRemaining <= 3 ? (
                      <span className="font-bold text-yellow-300 animate-pulse">
                        Only {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left!
                      </span>
                    ) : (
                      <span>{daysRemaining} days remaining</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Upcoming Discounts Preview
export const UpcomingDiscounts = ({ serviceType = null, limit = 3, className = '' }) => {
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const discounts = getUpcomingDiscounts(60, serviceType).slice(0, limit);
    setUpcoming(discounts);
  }, [serviceType, limit]);

  if (upcoming.length === 0) return null;

  return (
    <div className={`${className}`} data-testid="upcoming-discounts">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <h4 className="font-semibold text-lg">Upcoming Deals</h4>
      </div>
      <div className="space-y-3">
        {upcoming.map((discount) => (
          <Card key={discount.id} className="p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-2xl">{discount.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{discount.name}</p>
              <p className="text-xs text-muted-foreground">
                {discount.startDate.toLocaleDateString()} - {discount.discountPercent}% OFF
              </p>
            </div>
            <Badge variant="outline" className={discount.colors.text}>
              {discount.discountCode}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Mini discount tag for product cards
export const DiscountTag = ({ serviceType = null, className = '' }) => {
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const currentDiscount = getCurrentDiscount(serviceType);
    setDiscount(currentDiscount);
  }, [serviceType]);

  if (!discount) return null;

  return (
    <Badge 
      className={`bg-gradient-to-r ${discount.colors.primary} text-white ${className}`}
      data-testid="discount-tag"
    >
      <Tag className="w-3 h-3 mr-1" />
      {discount.discountPercent}% OFF - {discount.name}
    </Badge>
  );
};

// Hero overlay discount announcement
export const HeroDiscountOverlay = ({ serviceType = null }) => {
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const currentDiscount = getCurrentDiscount(serviceType);
    setDiscount(currentDiscount);
  }, [serviceType]);

  if (!discount) return null;

  return (
    <div className="absolute top-4 left-4 z-20" data-testid="hero-discount-overlay">
      <div className={`bg-gradient-to-r ${discount.colors.primary} text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 transition-transform`}>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 animate-bounce" />
          <span className="font-bold">{discount.emoji} {discount.discountPercent}% OFF</span>
        </div>
        <p className="text-xs text-white/90">{discount.name}</p>
      </div>
    </div>
  );
};

export default HolidayDiscountBanner;
