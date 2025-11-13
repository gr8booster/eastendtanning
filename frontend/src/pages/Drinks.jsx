import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, ThumbsUp, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SEOHead, createProductSchema } from '../components/SEOHead';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fizzeLogoUrl = 'https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/fizze-logo.png';

const categoryInfo = {
  'Milk Teas': { icon: <Coffee className="w-6 h-6" />, gradient: 'from-amber-400 to-orange-500' },
  'Fruit Teas': { icon: <Heart className="w-6 h-6" />, gradient: 'from-pink-400 to-rose-500' },
  'Blended Ice': { icon: <Coffee className="w-6 h-6" />, gradient: 'from-blue-400 to-cyan-500' },
  'Hot Boba': { icon: <Coffee className="w-6 h-6" />, gradient: 'from-red-400 to-orange-500' },
  'House Specials': { icon: <Heart className="w-6 h-6" />, gradient: 'from-purple-400 to-pink-500' },
  'Toppings': { icon: <Coffee className="w-6 h-6" />, gradient: 'from-green-400 to-teal-500' }
};

export default function Drinks() {
  const [menu, setMenu] = useState({});
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    fetchComingSoon();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/fizze/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchComingSoon = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/fizze/coming-soon`);
      if (!response.ok) throw new Error('Failed to fetch coming soon');
      const data = await response.json();
      setComingSoon(data);
    } catch (error) {
      console.error('Error fetching coming soon:', error);
    }
  };

  const handleVote = async (drinkId, drinkName) => {
    setVoting(drinkId);
    try {
      const response = await fetch(`${backendUrl}/api/fizze/vote/${drinkId}`, { method: 'POST' });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to vote');
      }
      toast.success(`Voted for ${drinkName}!`, { description: 'Thanks for your feedback' });
      trackEvent('vote_drink', 'Engagement', drinkName);
      fetchComingSoon();
    } catch (error) {
      if (error.message.includes('rate limit')) {
        toast.error('Slow down!', { description: 'You can vote 10 times per hour. Try again later.' });
      } else {
        toast.error('Failed to vote', { description: error.message });
      }
    } finally {
      setVoting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SEOHead
        title="Fizze Bubble Tea Menu - Fresh Boba, Milk Teas & Fruit Teas"
        description="Explore 34+ Fizze bubble tea drinks! Milk teas, fruit teas, blended ice, hot boba, and customizable toppings. Order online for pickup or delivery. Vote for coming soon flavors!"
        keywords="Fizze drinks, bubble tea menu, boba tea, milk tea, fruit tea, blended ice drinks, bubble tea toppings"
        ogImage={fizzeLogoUrl}
        schemaMarkup={Object.values(menu).flat()[0] ? createProductSchema(Object.values(menu).flat()[0]) : null}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={fizzeLogoUrl} alt="Fizze Drinks" className="h-20 mx-auto mb-6" />
          <h1 className="font-serif text-6xl font-black mb-4 tracking-tight">FIZZE DRINKS</h1>
          <p className="text-xl mb-8 text-white/90">Fresh, handcrafted bubble tea with premium ingredients</p>
          <Button
            size="lg"
            onClick={() => navigate('/order-drinks')}
            className="bg-white text-[hsl(42_92%_55%)] hover:bg-white/90"
            data-testid="order-online-button"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Order Online - Pickup or Delivery
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Menu Categories */}
        <div className="space-y-12">
          {Object.entries(menu).map(([category, drinks]) => {
            const catInfo = categoryInfo[category] || { icon: <Coffee />, gradient: 'from-gray-400 to-gray-600' };
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`bg-gradient-to-r ${catInfo.gradient} text-white rounded-lg p-6 mb-6`}>
                  <div className="flex items-center gap-3">
                    {catInfo.icon}
                    <h2 className="font-serif text-3xl font-bold">{category}</h2>
                    <Badge className="bg-white/20 text-white border-white/30">{drinks.length} drinks</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drinks.map((drink) => (
                    <Card key={drink.id} className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-bold text-xl mb-2">{drink.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{drink.flavor_profile}</p>
                      {drink.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[hsl(42_92%_55%)]">${drink.price.toFixed(2)}</span>
                          <Button
                            size="sm"
                            onClick={() => navigate('/order-drinks')}
                            className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)]"
                          >
                            Order Now
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 mb-6">
              <h2 className="font-serif text-3xl font-bold">Coming Soon - Vote for Your Favorites!</h2>
              <p className="text-white/90 mt-2">Help us decide which drinks to add next</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoon.map((drink) => (
                <Card key={drink.id} className="p-6">
                  <Badge className="mb-4 bg-purple-100 text-purple-700">Coming Soon</Badge>
                  <h3 className="font-bold text-xl mb-2">{drink.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{drink.flavor_profile}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-muted-foreground" />
                      <span className="font-bold">{drink.votes || 0} votes</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleVote(drink.id, drink.name)}
                      disabled={voting === drink.id}
                      variant="outline"
                      data-testid={`vote-${drink.id}`}
                    >
                      {voting === drink.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><ThumbsUp className="w-4 h-4 mr-1" />Vote</>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
