import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Star } from 'lucide-react';

export const PublicReviews = ({ businessLocation, limit = 10 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = businessLocation
          ? `${backendUrl}/api/reviews/public?business_location=${businessLocation}&limit=${limit}`
          : `${backendUrl}/api/reviews/public?limit=${limit}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
        }
      } catch (error) {
        console.log('Could not fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [businessLocation, limit, backendUrl]);

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.review_id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-lg">{review.customer_name}</h4>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{review.review_text}</p>
          {review.was_updated && (
            <p className="text-xs text-green-600 mt-2 italic">✓ Updated review</p>
          )}
        </Card>
      ))}
      
      {/* SEO fallback */}
      <noscript>
        <div>
          <h3>Customer Reviews:</h3>
          {reviews.map((review) => (
            <div key={review.review_id} style={{marginBottom: '20px', padding: '15px', border: '1px solid #ccc'}}>
              <strong>{review.customer_name}</strong> - {review.rating}/5 stars
              <p>{review.review_text}</p>
              <small>Posted: {new Date(review.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </noscript>
    </div>
  );
};
