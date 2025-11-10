import { useState, useEffect } from 'react';
import { X, Gift, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function FirstTimeDiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [hoursRemaining, setHoursRemaining] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was already shown
    const popupShown = localStorage.getItem('firstTimeDiscountShown');
    
    if (!popupShown) {
      // Generate session ID if not exists
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }
      
      // Show popup after 5 seconds
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`${backendUrl}/api/discounts/first-time?session_id=${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            setDiscountData(data);
            setHoursRemaining(data.expires_in_hours || 24);
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Failed to generate first-time discount:', error);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (!isOpen || !discountData) return;
    
    const interval = setInterval(() => {
      const expiresAt = new Date(discountData.expires_at);
      const now = new Date();
      const diff = expiresAt - now;
      const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      setHoursRemaining(hours);
      
      if (hours === 0) {
        clearInterval(interval);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [isOpen, discountData]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('firstTimeDiscountShown', 'true');
  };

  const handleBookNow = () => {
    handleClose();
    navigate('/tanning');
  };

  if (!isOpen || !discountData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" data-testid="first-time-discount-popup">
        <DialogTitle className="sr-only">Welcome Discount</DialogTitle>
        <DialogDescription className="sr-only">
          Exclusive 15% off discount for first-time visitors, automatically applied to your order.
        </DialogDescription>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleClose}
            data-testid="close-popup"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center text-center space-y-4 pt-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B] to-[#14B8A6] opacity-20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-[#F59E0B] to-[#14B8A6] p-4 rounded-full">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold mb-2">Welcome to Eastend!</h2>
              <p className="text-muted-foreground">Your exclusive first-time offer</p>
            </div>

            <div className="w-full bg-gradient-to-br from-[#F59E0B]/10 to-[#14B8A6]/10 border-2 border-[#F59E0B] rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="text-5xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] bg-clip-text text-transparent">
                  15% OFF
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-[#F59E0B]/20 text-[#F59E0B]">
                ✅ Automatically Applied!
              </Badge>
              
              <p className="text-sm font-medium text-muted-foreground">
                {discountData.message}
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <Clock className="w-4 h-4" />
                <span>Expires in {hoursRemaining} hours</span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleBookNow}
                className="flex-1 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] hover:opacity-90"
                data-testid="book-now-button"
              >
                Book Tanning Now
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  window.openMaryChat?.();
                }}
                variant="outline"
                className="flex-1"
                data-testid="chat-now-button"
              >
                Chat with Mary
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Valid for Monthly Unlimited and VIP tanning packages only.
              <br />
              One use per customer. Discount applied at checkout.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
