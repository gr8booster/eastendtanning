import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { X, Tag, Calendar, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DealPopup = () => {
  const [deal, setDeal] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentDeal();
  }, []);

  useEffect(() => {
    if (deal && showPopup) {
      // Delay to allow modal to open first
      setTimeout(() => {
        triggerConfetti();
        triggerFireworks();
      }, 300);
    }
  }, [deal, showPopup]);

  const fetchCurrentDeal = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deals/current`);
      const data = await response.json();
      if (data.success && data.deal) {
        setDeal(data.deal);
        
        // Check if user has dismissed this deal before
        const dismissedDeals = JSON.parse(localStorage.getItem('dismissedDeals') || '[]');
        if (!dismissedDeals.includes(data.deal.deal_id)) {
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6']
      });
      
      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6']
      });
    }, 250);
  };

  const triggerFireworks = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 100,
        startVelocity: 70,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#8A2BE2'],
        shapes: ['star'],
        gravity: 0.5,
        scalar: 1.2,
        zIndex: 9999
      });
    }, 600);
  };

  const handleDismiss = () => {
    if (deal) {
      const dismissedDeals = JSON.parse(localStorage.getItem('dismissedDeals') || '[]');
      dismissedDeals.push(deal.deal_id);
      localStorage.setItem('dismissedDeals', JSON.stringify(dismissedDeals));
    }
    setShowPopup(false);
  };

  if (loading || !deal) {
    return null;
  }

  const savings = deal.original_price ? ((deal.original_price - deal.deal_price) / deal.original_price * 100).toFixed(0) : null;
  const endDate = new Date(deal.end_date);
  const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white shadow-2xl" style={{
        background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px)',
        borderRadius: '20px',
        border: '6px dashed #fbbf24'
      }} data-testid="deal-popup">
        {/* Close button - Made larger and more accessible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 text-gray-700 hover:bg-gray-200 bg-white/90 rounded-full w-12 h-12 sm:w-10 sm:h-10 shadow-lg border-2 border-gray-300"
          data-testid="close-deal-popup"
          aria-label="Close deal popup"
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" />
        </Button>

        <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          {/* Perforated edge effect - top */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{
            background: 'radial-gradient(circle at 10px 0, transparent 8px, white 8px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Perforated edge effect - bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" style={{
            background: 'radial-gradient(circle at 10px 20px, transparent 8px, white 8px)',
            backgroundSize: '20px 20px'
          }}></div>

          {/* Ticket header banner */}
          <div className="relative overflow-hidden pt-6 pb-4">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-xl shadow-lg transform -rotate-2">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Gift className="w-5 h-5 sm:w-8 sm:h-8 animate-bounce" />
                  <span className="text-xl sm:text-3xl md:text-4xl font-black tracking-wider">🎉 WINNING DEAL 🎉</span>
                  <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 animate-pulse" />
                </div>
              </div>
              <div className="mt-3 text-red-600 font-bold text-base sm:text-xl">DEAL OF THE MONTH</div>
            </div>
          </div>

          <div className="p-4 sm:p-8 relative">
            {/* Ticket number/barcode decoration */}
            <div className="absolute top-4 right-8 text-right opacity-50">
              <div className="text-xs font-mono text-gray-500">TICKET #{deal.deal_id.substring(0, 8).toUpperCase()}</div>
              <div className="flex gap-1 mt-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-gray-400" style={{height: `${Math.random() * 20 + 10}px`}}></div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Media */}
              {deal.media_type && deal.media_data && (
                <div className="w-full md:w-2/5">
                  {deal.media_type === 'image' ? (
                    <img 
                      src={`data:${deal.media_content_type};base64,${deal.media_data}`}
                      alt={deal.title}
                      className="w-full h-64 object-cover rounded-xl shadow-xl border-4 border-yellow-400"
                    />
                  ) : (
                    <video 
                      src={`data:${deal.media_content_type};base64,${deal.media_data}`}
                      className="w-full h-64 object-cover rounded-xl shadow-xl border-4 border-yellow-400"
                      controls
                      muted
                      autoPlay
                      loop
                    />
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-3 bg-red-100 border-2 border-red-300 rounded-full px-4 py-2">
                  <Tag className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-bold uppercase tracking-wide text-red-600">In-Store Only</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-gray-800">{deal.title}</h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 leading-relaxed text-gray-700">{deal.description}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  {/* Pricing - Scratch-off style */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-white rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-2xl border-4 border-yellow-600 transform hover:scale-105 transition-transform">
                      <div className="text-center">
                        <div className="text-xs sm:text-sm font-bold uppercase mb-1">🏆 YOU WIN 🏆</div>
                        {deal.original_price && (
                          <div className="text-base sm:text-lg line-through opacity-75">${deal.original_price.toFixed(2)}</div>
                        )}
                        <div className="text-4xl sm:text-5xl md:text-6xl font-black my-2">${deal.deal_price.toFixed(2)}</div>
                        {savings && (
                          <div className="text-lg sm:text-xl md:text-2xl font-bold bg-white text-red-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full inline-block">
                            SAVE {savings}%!
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Sparkle decorations */}
                    <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>
                    <div className="absolute -bottom-2 -left-2 text-4xl animate-bounce">⭐</div>
                  </div>

                  {/* Time Left - Countdown timer style */}
                  {daysLeft > 0 && (
                    <div className="bg-white border-4 border-red-500 rounded-2xl px-8 py-4 text-center shadow-xl transform hover:scale-105 transition-transform">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-red-600" />
                      <div className="text-5xl font-black text-red-600">{daysLeft}</div>
                      <div className="text-sm font-bold uppercase text-gray-700">Days Left</div>
                      <div className="text-xs text-gray-500 mt-1">⏰ Hurry!</div>
                    </div>
                  )}
                </div>

                <div className="text-sm mb-6 bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg px-4 py-2 inline-block">
                  <span className="font-bold text-gray-700">Valid:</span> {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.end_date).toLocaleDateString()}
                </div>

                {/* CTA */}
                <div className="text-center md:text-left">
                  <div className="bg-white text-red-600 rounded-2xl px-8 py-6 shadow-2xl border-4 border-yellow-300 inline-block">
                    <div className="text-3xl font-black mb-2">🏪 IN-HOUSE ONLY</div>
                    <div className="text-lg font-bold">This deal is available in house only</div>
                  </div>
                  <div className="mt-4">
                    <a href="tel:+17403979632" className="text-xl font-bold underline hover:text-yellow-300 transition-colors">
                      📞 (740) 397-9632
                    </a>
                    <p className="text-sm mt-1 opacity-90">Visit us to redeem!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom tear-off section */}
          <div className="border-t-4 border-dashed border-gray-300 bg-white py-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">✂️ CLIP & REDEEM ✂️</div>
              <div className="text-lg font-bold text-red-600">⚡ Limited Time Offer - Don't Miss Out! ⚡</div>
              <div className="text-xs text-gray-600 mt-1">Present this offer at 818 Coshocton Ave, Mt Vernon, OH 43050</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
