import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ThumbsUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BookingCTA } from '../components/BookingCTA';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const fizzeLogoUrl = "https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/femzg13i_Screenshot_20251108_055345_Maps.jpg";

export default function Drinks() {
  const [menu, setMenu] = useState({});
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});

  useEffect(() => {
    fetchMenu();
    fetchComingSoon();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/fizze/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenu(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComingSoon = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/fizze/coming-soon`);
      if (response.ok) {
        const data = await response.json();
        setComingSoon(data);
      }
    } catch (error) {
      console.error('Failed to fetch coming soon:', error);
    }
  };

  const handleVote = async (drinkId) => {
    if (voting[drinkId]) return;
    
    setVoting(prev => ({ ...prev, [drinkId]: true }));
    
    try {
      const response = await fetch(`${backendUrl}/api/fizze/vote/${drinkId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Vote recorded! Thank you!');
        
        // Update local state
        setComingSoon(prev => prev.map(d => 
          d.id === drinkId ? { ...d, votes: data.votes } : d
        ));
      } else {
        toast.error('Already voted or limit reached');
      }
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to record vote');
    } finally {
      setTimeout(() => setVoting(prev => ({ ...prev, [drinkId]: false })), 1000);
    }
  };

  const categories = [
    { key: 'Milk Teas', icon: '🥛', color: 'from-amber-50 to-orange-50' },
    { key: 'Fruit Teas', icon: '🍓', color: 'from-pink-50 to-red-50' },
    { key: 'Blended Ice', icon: '🧊', color: 'from-blue-50 to-cyan-50' },
    { key: 'Hot Boba', icon: '☕', color: 'from-yellow-50 to-amber-50' },
    { key: 'House Specials', icon: '✨', color: 'from-purple-50 to-pink-50' },
    { key: 'Toppings', icon: '🍬', color: 'from-green-50 to-teal-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-teal-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 to-[#14B8A6]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <img src={fizzeLogoUrl} alt="Fizze Drinks" className="h-24 mx-auto mb-6 rounded-xl shadow-lg" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] bg-clip-text text-transparent">
              🧋 FIZZE DRINKS
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Refreshing. Playful. Fizzy Energy in Every Sip.
            </p>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Bubble Tea • Snacks • Vibes
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B] mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                const drinks = menu[category.key] || [];
                if (drinks.length === 0) return null;

                return (
                  <div key={category.key}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl">{category.icon}</span>
                      <h2 className="font-serif text-3xl font-bold">{category.key}</h2>
                      <Badge variant="outline">{drinks.length} drinks</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {drinks.map((drink) => (
                        <Card key={drink.id} className={`p-6 hover:shadow-xl transition-all bg-gradient-to-br ${category.color}`}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">{drink.name}</h3>
                            {drink.price && (
                              <Badge className="bg-gradient-to-r from-[#F59E0B] to-[#14B8A6] text-white">
                                ${drink.price.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{drink.flavor_profile}</p>
                          <p className="text-xs text-muted-foreground italic border-l-2 border-[#14B8A6] pl-2">
                            {drink.recipe}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Coming Soon Section */}
          {comingSoon.length > 0 && (
            <div className="mt-20">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="text-lg px-6 py-2 mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Coming Soon - Vote for Your Favorite!
                </Badge>
                <h2 className="font-serif text-3xl font-bold">Help Us Decide</h2>
                <p className="text-muted-foreground mt-2">Vote to bring these drinks to our menu</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {comingSoon.map((drink) => (
                  <Card key={drink.id} className="p-6 border-2 border-dashed border-[#F59E0B]">
                    <h3 className="font-bold text-lg mb-2">{drink.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{drink.flavor_profile}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#14B8A6]">{drink.votes} votes</span>
                      <Button
                        onClick={() => handleVote(drink.id)}
                        disabled={voting[drink.id]}
                        size="sm"
                        className="bg-gradient-to-r from-[#F59E0B] to-[#14B8A6]"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Vote
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#F59E0B] to-[#14B8A6]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Visit Eastend for Fizze Drinks!
          </h2>
          <p className="text-white/90 mb-6">Available at 102 Martinsburg Rd, Mount Vernon, OH</p>
          <BookingCTA showCall={false} />
        </div>
      </section>
    </div>
  );
}
