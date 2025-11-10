import { useState, useEffect } from 'react';
import { X, Copy, Check, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function FirstTimeDiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    // Check if popup was already shown
    const popupShown = localStorage.getItem('firstTimeDiscountShown');
    
    if (!popupShown) {
      // Show popup after 5 seconds
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`${backendUrl}/api/discounts/first-time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            setDiscountCode(data.code);
            setExpiresAt(data.expires_at);
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Failed to generate first-time discount:', error);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('firstTimeDiscountShown', 'true');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const expiryDate = expiresAt ? new Date(expiresAt).toLocaleDateString() : '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" data-testid="first-time-discount-popup">
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
              <p className="text-muted-foreground">Get 15% off your first tanning package</p>
            </div>

            <div className="w-full bg-gradient-to-br from-[#F59E0B]/10 to-[#14B8A6]/10 border-2 border-dashed border-[#F59E0B]/50 rounded-lg p-6 space-y-3">
              <Badge variant="secondary" className="mb-2">Your Exclusive Code</Badge>
              <div className="font-mono text-3xl font-bold tracking-wider text-[#F59E0B]">
                {discountCode}
              </div>
              <p className="text-sm text-muted-foreground">Expires: {expiryDate}</p>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleCopy}
                className="flex-1"
                variant="outline"
                data-testid="copy-code-button"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  window.openMaryChat?.();
                }}
                className="flex-1 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6]"
                data-testid="chat-now-button"
              >
                Chat with Mary
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Valid for Monthly Unlimited and VIP tanning packages only.
              <br />
              One use per customer.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
