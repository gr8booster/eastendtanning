import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Phone, Zap, Droplet, DollarSign, Truck, CalendarDays, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { generateBreadcrumb } from '../utils/structuredData';
import { foodTruckStopSchema } from '../utils/businessSchemas';
import { FoodTruckLogo } from '../components/FoodTruckLogo';

export default function FoodTruckStop() {
  const navigate = useNavigate();
  const [nextUpcoming, setNextUpcoming] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    truck_description: '',
    menu_items: '',
    social_media: '',
    license_number: ''
  });
  const [truckPhoto, setTruckPhoto] = useState(null);
  const [menuPhoto, setMenuPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchNextUpcoming();
    fetchUpcomingBookings();
  }, []);

  const fetchNextUpcoming = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/foodtruck/next-upcoming`);
      const data = await response.json();
      setNextUpcoming(data);
    } catch (error) {
      console.error('Error fetching next upcoming:', error);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/foodtruck/upcoming-bookings?days=7`);
      const data = await response.json();
      setUpcomingBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const checkAvailability = async (date) => {
    if (!date) return;
    try {
      const response = await fetch(`${backendUrl}/api/foodtruck/check-availability?booking_date=${date}`, {
        method: 'POST'
      });
      const data = await response.json();
      setAvailability(data);
      
      if (!data.available) {
        toast.error(data.reason);
      } else {
        toast.success('Date is available!');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAvailability(null);
    if (date) {
      checkAvailability(date);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error('Please select a booking date');
      return;
    }
    
    if (!availability?.available) {
      toast.error('Selected date is not available');
      return;
    }

    if (!truckPhoto || !menuPhoto) {
      toast.error('Please upload both truck photo and menu');
      return;
    }

    setLoading(true);

    try {
      // Convert images to base64
      const truckPhotoBase64 = await convertToBase64(truckPhoto);
      const menuPhotoBase64 = await convertToBase64(menuPhoto);

      const bookingData = {
        ...formData,
        booking_date: selectedDate,
        truck_photo_base64: truckPhotoBase64,
        menu_photo_base64: menuPhotoBase64
      };

      const response = await fetch(`${backendUrl}/api/foodtruck/create-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) throw new Error('Failed to create booking');

      const booking = await response.json();
      toast.success('Booking created! Proceed to payment.');
      navigate(`/foodtruck-payment/${booking.booking_id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: '818 Food Truck Stop', path: '/foodtruck' }
  ]);

  return (
    <div className="min-h-screen bg-muted">
      <EnhancedSEO
        title="818 Food Truck Stop - Prime Location Opposite Kroger | Mt Vernon, OH"
        description="818 Food Truck Stop at 818 Coshocton Ave, Mt Vernon - Prime food truck rental location opposite Kroger. $70/day includes electricity hookup and water access. High-traffic spot in Knox County. Book your daily or weekly rental online. Perfect for mobile food vendors."
        keywords="818 Food Truck Stop, food truck rental Mt Vernon, mobile vendor spot Knox County, Kroger food truck, 818 Coshocton Ave, electricity hookup, water access, food truck parking, Mt Vernon OH"
        canonicalUrl="https://eastend.website/foodtruck"
        structuredData={[foodTruckStopSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/food-truck-location.jpg"
      />

      {/* Hero Section with Jollof Rice */}
      <div className="relative bg-gradient-to-r from-orange-600 to-red-700 text-white py-20 overflow-hidden">
        {/* Background Jollof Rice Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxqb2xsb2YlMjByaWNlfGVufDB8fHx8MTc2NTU2MzczOHww&ixlib=rb-4.1.0&q=85" 
            alt="Ghana Jollof Rice" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-700/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <FoodTruckLogo className="w-32 h-32" showText={false} />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-3">
              818 Food Truck Stop
            </h1>
            <p className="text-3xl font-bold mb-2 text-yellow-300">
              Succulent Ghana Jollof Rice & More! 🍽️
            </p>
            <p className="text-xl mb-8 text-white/90">
              Authentic African Cuisine + Food Truck Parking
            </p>
            
            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold text-lg px-8 py-6 shadow-2xl"
                onClick={() => navigate('/eats')}
              >
                🍽️ View Menu & Order Now
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 shadow-2xl"
                onClick={() => document.getElementById('booking-form')?.scrollIntoView({behavior: 'smooth'})}
              >
                🚚 Food Truck: Book Your Spot
              </Button>
            </div>

            {/* 818 EATS Info Banner */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/30">
              <p className="text-lg mb-2">
                <strong>818 EATS:</strong> Ghana Jollof Rice • Egusi Stew • Fried Plantains
              </p>
              <p className="text-sm text-white/80">
                Pre-order online, pick up in 1-2 hours • Multiple vendors • Fresh made-to-order
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
                <Zap className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Electricity Provided</p>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
                <Droplet className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Water Available</p>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
                <MapPin className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">High Traffic Area</p>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
                <DollarSign className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">$70/Day</p>
              </Card>
            </div>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90" onClick={() => document.getElementById('booking-form').scrollIntoView({behavior: 'smooth'})}>
              Book Your Spot Now
            </Button>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      {nextUpcoming && (
        <div className="bg-white py-12 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">🚨 Coming Soon</h2>
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {nextUpcoming.truck_photo_base64 && (
                    <img
                      src={nextUpcoming.truck_photo_base64}
                      alt={nextUpcoming.business_name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{nextUpcoming.business_name}</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    <CalendarDays className="inline h-5 w-5 mr-2" />
                    {formatDate(nextUpcoming.booking_date)}
                  </p>
                  <p className="mb-4">{nextUpcoming.truck_description}</p>
                  {nextUpcoming.menu_items && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Menu Highlights:</p>
                      <p className="text-sm">{nextUpcoming.menu_items}</p>
                    </div>
                  )}
                  {nextUpcoming.social_media && (
                    <a href={nextUpcoming.social_media} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                      Follow on Social Media →
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Upcoming 7 Days */}
      {upcomingBookings.length > 0 && (
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Upcoming This Week</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {upcomingBookings.map((booking) => (
                <Card key={booking.booking_id} className="p-6 hover:shadow-lg transition-shadow">
                  {booking.truck_photo_base64 && (
                    <img
                      src={booking.truck_photo_base64}
                      alt={booking.business_name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{booking.business_name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {formatDate(booking.booking_date)}
                  </p>
                  <p className="text-sm line-clamp-3">{booking.truck_description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Details */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Perfect Location for Your Food Truck</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <MapPin className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Prime Location</h3>
                <p className="mb-2"><strong>818 Coshocton Ave, Mt Vernon, OH 43050</strong></p>
                <p className="text-sm text-muted-foreground">Directly opposite Kroger - one of the busiest grocery stores in Knox County</p>
              </Card>
              <Card className="p-6">
                <Zap className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Full Amenities</h3>
                <ul className="space-y-2 text-sm">
                  <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Electricity hookup included</li>
                  <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Water access available</li>
                  <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />High foot traffic area</li>
                  <li><CheckCircle className="inline h-4 w-4 text-green-600 mr-2" />Easy customer access</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking-form" className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-2 text-center">Book Your Spot</h2>
              <p className="text-center text-muted-foreground mb-8">$70/day - Reserve your date now</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <Label>Select Your Date *</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="text-lg"
                  />
                  {availability && (
                    <div className={`mt-2 flex items-center gap-2 ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
                      {availability.available ? (
                        <><CheckCircle className="h-5 w-5" /> Date is available!</>
                      ) : (
                        <><AlertCircle className="h-5 w-5" /> {availability.reason}</>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name *</Label>
                    <Input value={formData.business_name} onChange={(e) => setFormData({...formData, business_name: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Contact Name *</Label>
                    <Input value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <Label>Truck Description *</Label>
                  <Textarea 
                    value={formData.truck_description} 
                    onChange={(e) => setFormData({...formData, truck_description: e.target.value})} 
                    placeholder="Describe your food truck and cuisine type"
                    rows={3}
                    required 
                  />
                </div>

                <div>
                  <Label>Menu Items *</Label>
                  <Textarea 
                    value={formData.menu_items} 
                    onChange={(e) => setFormData({...formData, menu_items: e.target.value})} 
                    placeholder="List your popular menu items"
                    rows={3}
                    required 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Social Media (optional)</Label>
                    <Input 
                      value={formData.social_media} 
                      onChange={(e) => setFormData({...formData, social_media: e.target.value})} 
                      placeholder="Instagram, Facebook, etc."
                    />
                  </div>
                  <div>
                    <Label>License Number (optional)</Label>
                    <Input value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Truck Photo *</Label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setTruckPhoto(e.target.files[0])} 
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">Clear photo of your food truck</p>
                  </div>
                  <div>
                    <Label>Menu Photo *</Label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setMenuPhoto(e.target.files[0])} 
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">Photo of your menu board</p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="font-semibold text-lg mb-2">Booking Details:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Daily rate: <strong>$70</strong></li>
                    <li>• Electricity & water included</li>
                    <li>• Payment via PayPal</li>
                    <li>• Instant confirmation after payment</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-lg py-6" 
                  disabled={loading || !availability?.available}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment ($70)'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions?</h3>
          <p className="text-lg mb-4">Contact us for more information about the 818 Food Truck Stop</p>
          <p className="text-muted-foreground">
            <Phone className="inline h-5 w-5 mr-2" />
            <a href="tel:7403979632" className="hover:underline">(740) 397-9632</a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            818 Coshocton Ave, Mt Vernon, OH 43050
          </p>
        </div>
      </div>
    </div>
  );
}
