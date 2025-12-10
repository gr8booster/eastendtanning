import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export const ReviewSubmission = ({ defaultLocation = 'eastend' }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    review_text: '',
    business_location: defaultLocation
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [reviewId, setReviewId] = useState(null);
  const [customerReply, setCustomerReply] = useState('');
  const [conversation, setConversation] = useState([]);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const res = await fetch(`${backendUrl}/api/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit review');
      
      const data = await res.json();
      
      setSubmitted(true);
      setReviewId(data.review_id);
      
      if (rating === 5) {
        toast.success('Thank you! Your 5-star review is now live!');
      } else {
        setAiResponse(data.ai_response);
        setConversation([{ role: 'ai', message: data.ai_response }]);
        toast.info('Thank you for your feedback. We\'d like to help resolve your concern.');
      }
      
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!customerReply.trim()) return;
    
    try {
      const newConversation = [...conversation, { role: 'customer', message: customerReply }];
      setConversation(newConversation);
      setCustomerReply('');
      
      const res = await fetch(`${backendUrl}/api/reviews/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_id: reviewId,
          ai_response: customerReply
        })
      });
      
      if (!res.ok) throw new Error('Failed to send response');
      
      const data = await res.json();
      setConversation([...newConversation, { role: 'ai', message: data.ai_response }]);
      
      // Check if AI is asking about updating review
      if (data.ai_response.toLowerCase().includes('update') && data.ai_response.toLowerCase().includes('review')) {
        toast.success('Would you like to update your review to 5 stars?', {
          action: {
            label: 'Update to 5 Stars',
            onClick: () => handleUpdateReview(5)
          }
        });
      }
      
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleUpdateReview = async (newRating) => {
    try {
      const res = await fetch(`${backendUrl}/api/reviews/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_id: reviewId,
          new_rating: newRating,
          updated_text: formData.review_text
        })
      });
      
      if (!res.ok) throw new Error('Failed to update review');
      
      const data = await res.json();
      toast.success('Thank you for updating your review to 5 stars! It\'s now live on our website.');
      setRating(newRating);
      setAiResponse(null);
      
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  if (submitted && rating === 5) {
    return (
      <Card className="p-8 text-center bg-green-50 border-2 border-green-500">
        <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-lg">Your 5-star review is now live on our website.</p>
        <p className="text-muted-foreground mt-2">We appreciate your business!</p>
      </Card>
    );
  }

  if (submitted && rating < 5 && aiResponse) {
    return (
      <Card className="p-8 bg-amber-50 border-2 border-amber-500">
        <h3 className="text-xl font-bold mb-4">We'd Like to Help</h3>
        
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {conversation.map((msg, i) => (
            <div key={i} className={`p-4 rounded-lg ${msg.role === 'ai' ? 'bg-blue-100' : 'bg-white'}`}>
              <p className="font-semibold text-sm mb-1">{msg.role === 'ai' ? 'Eastend Team' : 'You'}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Textarea
            value={customerReply}
            onChange={(e) => setCustomerReply(e.target.value)}
            placeholder="Tell us how we can help..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleReply} className="flex-1">
              Send Reply
            </Button>
            <Button onClick={() => handleUpdateReview(5)} variant="outline" className="flex-1 bg-green-600 text-white hover:bg-green-700">
              Update to 5 Stars
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h3 className="text-2xl font-bold mb-6">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Your Rating *</Label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="business_location">Location *</Label>
          <Select
            value={formData.business_location}
            onValueChange={(value) => setFormData({ ...formData, business_location: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eastend">Eastend Tanning & Laundry</SelectItem>
              <SelectItem value="westend">Westend Laundry</SelectItem>
              <SelectItem value="fizze">Fizze Drinks</SelectItem>
              <SelectItem value="nails">Fast Nails</SelectItem>
              <SelectItem value="foodtruck">818 Food Truck Stop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="customer_name">Your Name *</Label>
          <Input
            id="customer_name"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="customer_email">Your Email *</Label>
          <Input
            id="customer_email"
            type="email"
            value={formData.customer_email}
            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="review_text">Your Review *</Label>
          <Textarea
            id="review_text"
            value={formData.review_text}
            onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
            rows={5}
            placeholder="Tell us about your experience..."
            required
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full h-12 text-lg font-bold">
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
};
