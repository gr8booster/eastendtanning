import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const BookingForm = ({ service = 'tanning', title, description }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create booking
      await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          ...formData,
          booking_date: new Date(formData.booking_date).toISOString()
        })
      });

      // Track conversion
      await fetch(`${backendUrl}/api/analytics/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'booking_started',
          event_data: { service, booking_date: formData.booking_date },
          page_url: window.location.pathname,
          session_id: sessionStorage.getItem('session_id') || 'unknown'
        })
      });

      toast.success('🎉 Booking Request Received!', {
        description: 'We\'ll call you shortly to confirm your appointment.',
      });

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Oops! Please call us directly at (740) 397-9632');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="font-serif text-2xl font-bold mb-2">{title || 'Book Your Appointment'}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_name" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Name *
            </Label>
            <Input
              id="customer_name"
              data-testid="booking-name-input"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="customer_phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone *
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              data-testid="booking-phone-input"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              required
              placeholder="(740) 555-1234"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="customer_email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email (optional)
          </Label>
          <Input
            id="customer_email"
            type="email"
            data-testid="booking-email-input"
            value={formData.customer_email}
            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label htmlFor="booking_date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Preferred Date & Time *
          </Label>
          <Input
            id="booking_date"
            type="datetime-local"
            data-testid="booking-date-input"
            value={formData.booking_date}
            onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-muted-foreground mt-1">We'll call to confirm availability</p>
        </div>

        <div>
          <Label htmlFor="notes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Special Requests (optional)
          </Label>
          <Textarea
            id="notes"
            data-testid="booking-notes-input"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special requests or questions?"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-secondary text-white hover:bg-secondary/90 font-semibold h-12"
          disabled={loading}
          data-testid="booking-submit-button"
        >
          {loading ? 'Submitting...' : '📅 Request Appointment'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to be contacted about your appointment.
        </p>
      </form>
    </Card>
  );
};