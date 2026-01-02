import { useState, useEffect } from 'react';
import { X, Zap, Clock, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

export function BlackFridayPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const navigate = useNavigate();

  // Black Friday period: November 28 - December 1
  const currentYear = new Date().getFullYear();
  const BLACK_FRIDAY_START = new Date(`${currentYear}-11-28T00:00:00`);
  const BLACK_FRIDAY_END = new Date(`${currentYear}-12-01T23:59:59`);

  useEffect(() => {
    // Check if popup was already shown
    const popupShown = sessionStorage.getItem('blackFridayPopupShown');
    const currentDate = new Date();
    
    // Only show during Black Friday period (Nov 28 - Dec 1) and not shown this session
    const isBlackFridayPeriod = currentDate >= BLACK_FRIDAY_START && currentDate <= BLACK_FRIDAY_END;
    
    if (!popupShown && isBlackFridayPeriod) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Update countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = BLACK_FRIDAY_END - now;
      
      if (diff <= 0) {
        setTimeRemaining('EXPIRED');
        setIsOpen(false);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('blackFridayPopupShown', 'true');
  };

  const handleGetPass = () => {
    handleClose();
    navigate('/black-friday-checkout');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-gray-900 to-black border-yellow-400 border-2" data-testid="black-friday-popup">
        <DialogTitle className="sr-only">Black Friday BOGO Deal</DialogTitle>
        <DialogDescription className="sr-only">
          Buy a $5 Black Friday pass and get BOGO on monthly tanning or minute packages.
        </DialogDescription>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 text-white hover:bg-white/10"
            onClick={handleClose}
            data-testid="close-black-friday-popup"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center text-center space-y-4 pt-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-4 rounded-full animate-bounce">
                <Zap className="w-12 h-12 text-black" />
              </div>
            </div>

            {/* Black Friday Badge */}
            <Badge className="bg-yellow-400 text-black text-lg font-bold px-4 py-1 animate-pulse">
              🔥 BLACK FRIDAY SPECIAL 🔥
            </Badge>

            <div>
              <h2 className="font-serif text-3xl font-black mb-2 text-white">
                BOGO TANNING!
              </h2>
              <p className="text-yellow-400 font-semibold text-lg">
                Buy 1 Get 1 FREE
              </p>
            </div>

            {/* Deal Box */}
            <div className="w-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-4 border-yellow-400 rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Tag className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">Only $5</span>
                </div>
                <p className="text-yellow-200 text-sm font-medium">
                  Get Your Black Friday Pass
                </p>
              </div>
              
              <div className="h-px bg-yellow-400/30"></div>
              
              <div className="text-white space-y-2 text-left">
                <p className="font-bold text-yellow-400 text-center mb-3">What You Get:</p>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-sm">BOGO Monthly Tanning (any level)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-sm">OR BOGO Minute Packages</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-sm">Use in ONE checkout</span>
                </div>
              </div>
              
              {timeRemaining && (
                <div className="flex items-center justify-center gap-2 text-sm text-yellow-300 mt-3 bg-black/30 rounded-lg p-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="font-semibold">Expires in {timeRemaining}</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleGetPass}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl h-16 shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                data-testid="get-black-friday-pass-button"
                type="button"
              >
                🛒 Get $5 Pass Now - Click Here!
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Black Friday Special: Valid through December 1st
              <br />
              One pass per checkout. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
