import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Building2, Utensils, Truck, Users, CheckCircle2, ArrowLeft, Loader2, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function PartnerSignup() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    business_type: '',
    cuisine_specialties: '',
    address: '',
    city: '',
    state: 'OH',
    license_type: '',
    license_number: '',
    can_handle_bulk_orders: true,
    minimum_order_capacity: 10,
    delivery_radius_miles: '',
    website: '',
    social_media: '',
    additional_notes: ''
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.business_name || !formData.contact_name || !formData.phone || !formData.email || !formData.business_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/eats/partners/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minimum_order_capacity: parseInt(formData.minimum_order_capacity) || 10,
          delivery_radius_miles: formData.delivery_radius_miles ? parseInt(formData.delivery_radius_miles) : null
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(data.detail || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[hsl(var(--muted))] py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in partnering with 818 EATS! Our team will review your application and contact you within 48 hours.
            </p>
            <div className="bg-muted p-4 rounded-lg text-left mb-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Our team will review your application
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  We'll verify your business license if applicable
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll receive an email with partnership details
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Once approved, you'll start receiving bulk orders
                </li>
              </ul>
            </div>
            <Link to="/eats">
              <Button className="bg-[hsl(var(--secondary))]">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to 818 EATS
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))]">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/eats" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to 818 EATS
          </Link>
          <h1 className="font-serif text-4xl font-bold mb-4">Become a Partner</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Join 818 EATS as a partner restaurant, licensed home kitchen, or ghost kitchen. We aggregate orders and send you bulk batches of 10+ orders at a time.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="p-4 text-center">
              <Users className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-2" />
              <h3 className="font-semibold text-sm">New Customers</h3>
              <p className="text-xs text-muted-foreground">Access our customer base</p>
            </Card>
            <Card className="p-4 text-center">
              <Package className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Bulk Orders</h3>
              <p className="text-xs text-muted-foreground">Minimum 10 orders per batch</p>
            </Card>
            <Card className="p-4 text-center">
              <Truck className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-2" />
              <h3 className="font-semibold text-sm">We Handle Delivery</h3>
              <p className="text-xs text-muted-foreground">Focus on cooking</p>
            </Card>
            <Card className="p-4 text-center">
              <Utensils className="w-8 h-8 text-[hsl(var(--primary))] mx-auto mb-2" />
              <h3 className="font-semibold text-sm">African Cuisine Focus</h3>
              <p className="text-xs text-muted-foreground">Specialized market</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Guidelines */}
      <section className="py-6 bg-amber-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Important Partner Guidelines</h3>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• <strong>Order Aggregation:</strong> We collect and batch orders. You'll receive bulk orders of 10+ at a time.</li>
                  <li>• <strong>Packaging Requirements:</strong> Food must be packed securely to prevent leaking during delivery.</li>
                  <li>• <strong>Quality Standards:</strong> Consistent quality and portion sizes expected for all orders.</li>
                  <li>• <strong>Pickup Ready:</strong> Orders should be ready for pickup at the agreed time.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8">
            <h2 className="font-serif text-2xl font-bold mb-6">Partner Application</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Info */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Business Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input 
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                      placeholder="Your Kitchen Name"
                      required
                      data-testid="partner-business-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business_type">Business Type *</Label>
                    <Select value={formData.business_type} onValueChange={(v) => setFormData({...formData, business_type: v})}>
                      <SelectTrigger data-testid="partner-business-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="home_kitchen">Licensed Home Kitchen</SelectItem>
                        <SelectItem value="ghost_kitchen">Ghost Kitchen</SelectItem>
                        <SelectItem value="catering">Catering Service</SelectItem>
                        <SelectItem value="food_truck">Food Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input 
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                      placeholder="Your Name"
                      required
                      data-testid="partner-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(740) 555-1234"
                      required
                      data-testid="partner-phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="kitchen@example.com"
                      required
                      data-testid="partner-email"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-4">Location</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Main St"
                      data-testid="partner-address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Mt Vernon"
                      data-testid="partner-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="OH"
                      data-testid="partner-state"
                    />
                  </div>
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5" /> Cuisine & Capacity
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cuisine_specialties">Cuisine Specialties *</Label>
                    <Input 
                      id="cuisine_specialties"
                      value={formData.cuisine_specialties}
                      onChange={(e) => setFormData({...formData, cuisine_specialties: e.target.value})}
                      placeholder="Nigerian, Ghanaian, West African, etc."
                      required
                      data-testid="partner-cuisine"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minimum_order_capacity">Minimum Order Capacity</Label>
                      <Input 
                        id="minimum_order_capacity"
                        type="number"
                        value={formData.minimum_order_capacity}
                        onChange={(e) => setFormData({...formData, minimum_order_capacity: e.target.value})}
                        min="10"
                        placeholder="10"
                        data-testid="partner-capacity"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum 10 orders per batch</p>
                    </div>
                    <div>
                      <Label htmlFor="delivery_radius">Delivery Radius (miles)</Label>
                      <Input 
                        id="delivery_radius"
                        type="number"
                        value={formData.delivery_radius_miles}
                        onChange={(e) => setFormData({...formData, delivery_radius_miles: e.target.value})}
                        placeholder="Optional"
                        data-testid="partner-radius"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* License */}
              <div>
                <h3 className="font-semibold mb-4">License Information (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="license_type">License Type</Label>
                    <Select value={formData.license_type} onValueChange={(v) => setFormData({...formData, license_type: v})}>
                      <SelectTrigger data-testid="partner-license-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cottage_food">Cottage Food License</SelectItem>
                        <SelectItem value="health_department">Health Department</SelectItem>
                        <SelectItem value="restaurant_license">Restaurant License</SelectItem>
                        <SelectItem value="catering_license">Catering License</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="license_number">License Number</Label>
                    <Input 
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                      placeholder="Optional"
                      data-testid="partner-license-number"
                    />
                  </div>
                </div>
              </div>

              {/* Online Presence */}
              <div>
                <h3 className="font-semibold mb-4">Online Presence (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://yourkitchen.com"
                      data-testid="partner-website"
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_media">Social Media</Label>
                    <Input 
                      id="social_media"
                      value={formData.social_media}
                      onChange={(e) => setFormData({...formData, social_media: e.target.value})}
                      placeholder="@yourkitchen"
                      data-testid="partner-social"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea 
                  id="additional_notes"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                  placeholder="Tell us more about your kitchen, signature dishes, or any questions..."
                  rows={3}
                  data-testid="partner-notes"
                />
              </div>

              {/* Bulk Order Confirmation */}
              <Card className="p-4 bg-[hsl(var(--muted))]">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="bulk_orders" 
                    checked={formData.can_handle_bulk_orders}
                    onCheckedChange={(checked) => setFormData({...formData, can_handle_bulk_orders: checked})}
                    data-testid="partner-bulk-checkbox"
                  />
                  <div>
                    <Label htmlFor="bulk_orders" className="font-medium cursor-pointer">
                      I understand 818 EATS is an order aggregation platform
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      I can handle bulk orders of 10+ at a time and will ensure food is properly packaged to prevent leaking during delivery.
                    </p>
                  </div>
                </div>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-[hsl(var(--secondary))] hover:bg-[hsl(183_55%_36%)] py-6 text-lg"
                disabled={submitting || !formData.can_handle_bulk_orders}
                data-testid="partner-submit-btn"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Partner Application'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
