import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Tag, Calendar } from 'lucide-react';

export const DealBanner = () => {
  const [deal, setDeal] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentDeal();
  }, []);

  const fetchCurrentDeal = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deals/current`);
      const data = await response.json();
      if (data.success && data.deal) {
        setDeal(data.deal);
      }
    } catch (error) {
      console.error('Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !deal || !showBanner) {
    return null;
  }

  const savings = deal.original_price ? ((deal.original_price - deal.deal_price) / deal.original_price * 100).toFixed(0) : null;
  const endDate = new Date(deal.end_date);
  const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-r from-[hsl(24_100%_50%)] to-[hsl(14_100%_45%)] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBanner(false)}
          className="absolute top-2 right-2 text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Media */}
          {deal.media_type && deal.media_data && (
            <div className="w-full md:w-1/3 lg:w-1/4">
              {deal.media_type === 'image' ? (
                <img 
                  src={`data:${deal.media_content_type};base64,${deal.media_data}`}
                  alt={deal.title}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <video 
                  src={`data:${deal.media_content_type};base64,${deal.media_data}`}
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                  controls
                  muted
                />
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Deal of the Month - In-House Only</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{deal.title}</h2>
            <p className="text-lg md:text-xl mb-4 opacity-90">{deal.description}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              {/* Pricing */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                {deal.original_price && (
                  <div className="text-sm opacity-75 line-through">${deal.original_price.toFixed(2)}</div>
                )}
                <div className="text-3xl font-bold">${deal.deal_price.toFixed(2)}</div>
                {savings && (
                  <div className="text-sm font-semibold">Save {savings}%!</div>
                )}
              </div>

              {/* Time Left */}
              {daysLeft > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{daysLeft}</div>
                  <div className="text-sm">Days Left</div>
                </div>
              )}
            </div>

            <div className="text-sm opacity-90">
              Valid: {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.end_date).toLocaleDateString()}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href="tel:+17404071084">
              <Button size="lg" className="bg-white text-[hsl(24_100%_50%)] hover:bg-white/90 font-bold text-lg px-8 h-14 shadow-lg">
                Call to Book
              </Button>
            </a>
            <p className="text-sm mt-2 opacity-90">(740) 407-1084</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
    </div>
  );
};
