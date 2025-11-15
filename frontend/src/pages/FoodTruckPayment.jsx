import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loader2, CheckCircle, MapPin, Calendar, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';

export default function FoodTruckPayment() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (booking && !paypalLoaded) {
      loadPayPalButton();
    }
  }, [booking, paypalLoaded]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/foodtruck/booking/${bookingId}`);
      if (!response.ok) throw new Error('Booking not found');
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const loadPayPalButton = () => {
    if (!window.paypal || paypalLoaded) return;

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const response = await fetch(`${backendUrl}/api/paypal/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: booking.amount.toFixed(2),
              reference_id: booking.booking_code
            })
          });
          const data = await response.json();
          return data.order_id;
        } catch (error) {
          console.error('Error creating PayPal order:', error);
          toast.error('Failed to initialize payment');
        }
      },
      onApprove: async (data) => {
        try {
          const response = await fetch(`${backendUrl}/api/paypal/capture-order/${data.orderID}`, {
            method: 'POST'
          });
          if (response.ok) {
            toast.success('Payment successful!');
            await fetch(`${backendUrl}/api/foodtruck/booking/${bookingId}/payment`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                payment_status: 'paid', 
                paypal_order_id: data.orderID 
              })
            });
            fetchBooking();
          } else {
            toast.error('Payment capture failed');
          }
        } catch (error) {
          console.error('Error capturing payment:', error);
          toast.error('Payment failed');
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        toast.error('Payment error occurred');
      }
    }).render('#paypal-button-container');

    setPaypalLoaded(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-xl">Booking not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <SEOHead title={`Booking Payment - ${booking.booking_code}`} />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          {booking.payment_status === 'paid' ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground">Booking Code: <strong>{booking.booking_code}</strong></p>
            </>
          ) : (
            <>
              <Truck className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
              <p className="text-muted-foreground">Booking Code: <strong>{booking.booking_code}</strong></p>
            </>
          )}
        </div>

        {/* Booking Details */}
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Vendor Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Business:</strong> {booking.business_name}</p>
                <p><strong>Contact:</strong> {booking.contact_name}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Booking Information</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <strong>Date:</strong> {formatDate(booking.booking_date)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <strong>Location:</strong> 818 Coshocton Ave
                </p>
                <p><strong>Amount:</strong> ${booking.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Truck Description</h3>
            <p className="text-sm">{booking.truck_description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Menu Items</h3>
            <p className="text-sm">{booking.menu_items}</p>
          </div>

          {booking.truck_photo_base64 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Truck Photo</h3>
              <img 
                src={booking.truck_photo_base64} 
                alt="Food Truck" 
                className="w-full max-w-md rounded-lg"
              />
            </div>
          )}

          {/* Payment Status */}
          <div className="border-t pt-6">
            {booking.payment_status === 'paid' ? (
              <div className="text-center">
                <Badge className="bg-green-500 text-white px-6 py-3 text-lg">
                  <CheckCircle className="inline mr-2 h-5 w-5" />PAYMENT CONFIRMED
                </Badge>
                <p className="text-sm text-muted-foreground mt-4">
                  You'll receive a confirmation email shortly. See you on {formatDate(booking.booking_date)}!
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-4 text-center">Complete Payment to Confirm Booking</h3>
                <div className="max-w-md mx-auto">
                  <div id="paypal-button-container" className="min-h-[50px]"></div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* What's Included */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">What's Included:</h3>
          <ul className="space-y-2 text-sm">
            <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Prime location opposite Kroger</li>
            <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Electricity hookup provided</li>
            <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Water access available</li>
            <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />High foot traffic area</li>
            <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Featured on Coming Soon section</li>
          </ul>
        </Card>

        {/* Contact */}
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Questions? Call us at <strong>(740) 397-9632</strong>
          </p>
        </Card>
      </div>
    </div>
  );
}
