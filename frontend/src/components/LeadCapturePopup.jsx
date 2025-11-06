import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { X, Gift, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const LeadCapturePopup = ({ isOpen, onClose, source = 'popup' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_interest: 'tanning',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit lead
      await fetch(`${backendUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source,
          notes: formData.notes || `Lead captured via ${source}`
        })
      });

      // Track conversion
      await fetch(`${backendUrl}/api/analytics/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'lead_captured',
          event_data: { service: formData.service_interest, source },
          page_url: window.location.pathname,
          session_id: sessionStorage.getItem('session_id') || 'unknown'
        })
      });

      toast.success('🎉 Thank you! We\'ll contact you soon!', {
        description: 'Check your email for special offers.',
      });

      onClose();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Oops! Something went wrong. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="lead-capture-popup">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-secondary" />
            <Zap className="w-5 h-5 text-[hsl(var(--primary))]" />
          </div>
          <DialogTitle className="text-2xl font-serif">Get 15% Off Your First Visit!</DialogTitle>
          <DialogDescription className="text-base">
            Join our VIP list and get exclusive deals on tanning, nails, and more.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              data-testid="lead-name-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              data-testid="lead-email-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              data-testid="lead-phone-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="(740) 555-1234"
            />
          </div>

          <div>
            <Label className="mb-3 block">I'm interested in:</Label>
            <RadioGroup
              value={formData.service_interest}
              onValueChange={(value) => setFormData({ ...formData, service_interest: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tanning" id="tanning" />
                <Label htmlFor="tanning" className="font-normal cursor-pointer">☀️ Tanning Studio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nails" id="nails" />
                <Label htmlFor="nails" className="font-normal cursor-pointer">💅 Fast Nails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="laundry" id="laundry" />
                <Label htmlFor="laundry" className="font-normal cursor-pointer">🧺 Laundromat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drinks" id="drinks" />
                <Label htmlFor="drinks" className="font-normal cursor-pointer">🧋 Fizze Drinks</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(42_92%_50%)] text-[hsl(var(--primary-foreground))] font-semibold"
            disabled={loading}
            data-testid="lead-submit-button"
          >
            {loading ? 'Submitting...' : '🎁 Claim My 15% Discount'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting, you agree to receive promotional emails and texts. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};