import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, ThumbsUp, Loader2, ShoppingCart, MapPin, Star, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SEOHead } from '../components/SEOHead';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const fizzeLogoUrl = 'https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/fizze-logo.png';

// Category information with enhanced descriptions for SEO
const categoryDetails = {
  'Milk Teas': {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-amber-400 to-orange-500',
    title: 'Bubble Tea & Milk Teas',
    description: 'Discover authentic bubble tea and creamy milk teas at Fizze Drinks in Mt Vernon, Ohio. Our signature bubble tea selection features classic black tea, rich taro, and sweet brown sugar varieties, each perfectly blended with fresh milk and chewy tapioca pearls. Every bubble tea is handcrafted to order using premium tea leaves and fresh ingredients. Whether you\'re craving a traditional milk tea or want to try our unique flavored boba combinations, Fizze has the perfect bubble tea for you. Customize your sweetness level and choose from black boba, brown sugar pearls, or fruit-filled popping boba. Stop by our Eastend location in Knox County for the freshest bubble tea experience in Mt Vernon!',
    keywords: 'bubble tea Mt Vernon, milk tea Knox County, boba tea Ohio, taro bubble tea, brown sugar milk tea'
  },
  'Fruit Teas': {
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-pink-400 to-rose-500',
    title: 'Fresh Fruit Teas',
    description: 'Refresh yourself with tropical fruit teas at Fizze Drinks, Mt Vernon\'s favorite spot for chilled fruit-infused beverages. Our fruit tea menu showcases vibrant flavors like juicy mango, sweet strawberry, exotic lychee, and refreshing dragon fruit—all brewed with premium green tea and bursting with natural fruit essence. Each fruit tea is lightly sweetened to let the fresh, tropical flavors shine through. Perfect for hot Ohio days or when you need a healthy, energizing pick-me-up after tanning or running errands in Knox County. Our fruit teas are made fresh daily with real fruit purees and can be customized with your choice of ice level and sweetness. Try our most popular picks: Mango Fruit Tea and Strawberry Dragon Fruit Fusion!',
    keywords: 'fruit tea Mt Vernon, mango tea Knox County, strawberry tea Ohio, tropical drinks Mt Vernon, fresh fruit tea'
  },
  'Dirty Sodas': {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-indigo-400 to-purple-500',
    title: 'Dirty Sodas & Specialty Fizzes',
    description: 'Try the hottest drink trend in Mt Vernon—Dirty Sodas at Fizze Drinks! Our specialty fizz creations combine your favorite sodas with creamy syrups and unique flavor twists for an unforgettable taste experience. From our signature "Butter Me Up" root beer float-style soda to the zesty "Lime Light" cola creation, each dirty soda is crafted to deliver bold, refreshing flavor. These aren\'t your average sodas—they\'re handcrafted fizzy masterpieces! Perfect for anyone in Knox County looking to try something new and exciting. Our dirty sodas feature premium syrups, fresh cream, and creative combinations you won\'t find anywhere else in Mt Vernon, Ohio. Stop by Eastend Tanning & Laundry and let our Fizze team create your new favorite specialty drink. Fully customizable and endlessly delicious!',
    keywords: 'dirty sodas Mt Vernon, specialty sodas Knox County, fizz drinks Ohio, custom soda Mt Vernon, dirty soda bar'
  },
  'Shakes': {
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-green-400 to-teal-500',
    title: 'Smoothies & Meal Replacement Shakes',
    description: 'Fuel your day with protein-packed smoothies and meal replacement shakes at Fizze Drinks in Mt Vernon! Our shake menu features nutritious, delicious blends perfect for post-workout recovery, meal replacement, or a healthy snack any time of day. Choose from indulgent flavors like Oreo Cheesecake, Banana Caramel, and Ohio\'s favorite—the Buckeye shake with chocolate and peanut butter. Each shake is blended with premium protein powder, fresh fruit, and wholesome ingredients to keep you energized throughout your busy day in Knox County. Whether you\'re looking for a quick breakfast on-the-go or a satisfying treat after your tanning session, our smoothies and shakes deliver both nutrition and incredible taste. All shakes can be customized for dietary preferences including vegan and dairy-free options. Visit Fizze at Eastend for the best smoothies in Mt Vernon!',
    keywords: 'smoothies Mt Vernon, protein shakes Knox County, meal replacement shakes Ohio, healthy drinks Mt Vernon, Buckeye shake'
  },
  'Blended Ice': {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-blue-400 to-cyan-500',
    title: 'Blended Ice Drinks',
    description: 'Cool off with our signature blended ice drinks at Fizze—Mt Vernon\'s go-to spot for frozen, slushy perfection! Our blended ice menu features smoothie-textured frozen drinks in tropical flavors like mango, coconut, honeydew, and watermelon. Each drink is blended with ice to create a thick, refreshing slush that\'s perfect for hot Ohio summers or anytime you need to chill out. Unlike traditional smoothies, our blended ice drinks have a lighter, more refreshing texture while still delivering bold fruit flavors. Popular with families, students, and anyone in Knox County looking for a fun, Instagrammable beverage. Customize your blended ice with tapioca pearls, fruit jellies, or popping boba for added texture and fun. Available exclusively at Fizze Drinks inside Eastend Tanning & Laundry on Coshocton Ave!',
    keywords: 'blended ice drinks Mt Vernon, frozen drinks Knox County, slush drinks Ohio, frozen bubble tea Mt Vernon'
  },
  'Hot Boba': {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-red-400 to-orange-500',
    title: 'Hot Boba & Warm Teas',
    description: 'Warm up with comforting hot boba drinks at Fizze in Mt Vernon! Our hot boba menu is perfect for chilly Ohio mornings, cozy afternoons, or anytime you\'re craving a warm, soothing beverage. Featuring creamy Taro Latte, spiced Thai Tea, and rich Coffee Boba, each hot drink is served steaming and topped with chewy tapioca pearls for that signature boba experience. Hot boba is an underrated treasure—combining the comfort of a warm latte with the fun texture of bubble tea pearls. Ideal for fall and winter visits to Knox County or for anyone who prefers warm drinks year-round. Our hot boba uses the same premium ingredients as our cold drinks, ensuring exceptional quality and flavor in every sip. Stop by Fizze Drinks at Eastend and discover why hot boba is becoming a local favorite in Mt Vernon!',
    keywords: 'hot boba Mt Vernon, hot bubble tea Knox County, warm boba Ohio, hot taro latte, hot Thai tea Mt Vernon'
  },
  'House Specials': {
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-purple-400 to-pink-500',
    title: 'Fizze House Specials',
    description: 'Try exclusive drinks you can only get at Fizze! Our House Specials menu showcases creative, one-of-a-kind beverages crafted by our talented drink artists in Mt Vernon. These signature creations feature unique flavor combinations, premium ingredients, and eye-catching presentations that make every sip an experience. From our Galaxy Tea with swirling colors to the indulgent Boba Float and energizing Energy Fizz, each house special is designed to surprise and delight your taste buds. These aren\'t drinks you\'ll find at any other bubble tea shop in Knox County—they\'re uniquely Fizze! Perfect for adventurous drinkers, social media content creators, and anyone looking to try something truly special in Mt Vernon, Ohio. Our house specials change seasonally, so there\'s always something new to discover. Visit Eastend Tanning & Laundry and ask our team about today\'s Fizze House Specials!',
    keywords: 'specialty drinks Mt Vernon, signature drinks Knox County, unique bubble tea Ohio, Fizze specials, Galaxy tea'
  },
  'Toppings': {
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-green-400 to-teal-500',
    title: 'Bubble Tea Toppings',
    description: 'Customize your perfect drink with Fizze\'s premium bubble tea toppings! Our topping selection includes classic black tapioca boba, sweet brown sugar pearls, fruit-filled popping boba in multiple flavors, and various fruit jellies for added texture and fun. Each topping is prepared fresh daily to ensure the perfect chew and burst of flavor. Whether you love the traditional chewy texture of tapioca pearls or want to try trendy popping boba that explodes with fruit juice, we have the perfect topping combination for you. Mix and match multiple toppings to create your signature Fizze drink! Our toppings are available for any drink on our menu—from bubble teas and fruit teas to smoothies and blended ice drinks. Stop by our Mt Vernon location in Knox County and let our team help you build your dream drink with the perfect toppings!',
    keywords: 'boba toppings Mt Vernon, tapioca pearls Knox County, popping boba Ohio, bubble tea toppings Mt Vernon'
  },
  'Food': {
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-orange-400 to-red-500',
    title: 'Snacks & Food',
    description: 'Pair your Fizze drink with delicious snacks! Our food menu features satisfying treats perfect for enjoying with your bubble tea or smoothie. Choose from warm, soft Amish-style pretzels (plain or with cheese sauce), crispy tortilla chip nachos with melted cheese, or loaded nachos topped with your favorite fixings. These snacks are perfect for sharing with friends, fueling up between errands in Mt Vernon, or satisfying those afternoon cravings while you tan or do laundry at Eastend. Our food items are made fresh to order and pair perfectly with any Fizze beverage. Whether you\'re looking for a quick snack or a light meal, our menu has something for everyone in Knox County. Stop by Fizze Drinks today and enjoy a complete refreshment experience!',
    keywords: 'snacks Mt Vernon, pretzels Knox County, nachos Mt Vernon Ohio, food with bubble tea'
  }
};

// Enhanced schema markup for AI/voice search
const createFizzeDrinksSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CafeOrCoffeeShop", "FoodEstablishment"],
    "name": "Fizze Drinks at Eastend Tanning & Laundry",
    "alternateName": "Fizze Drinks Mt Vernon",
    "description": "Fresh bubble tea, smoothies, and specialty drinks handcrafted daily in Mt Vernon, Ohio. Serving Knox County with premium Fizze beverages.",
    "image": [fizzeLogoUrl],
    "url": "https://tanshop-unified.preview.emergentagent.com/drinks",
    "telephone": "+17403979632",
    "priceRange": "$",
    "servesCuisine": ["Bubble Tea", "Smoothies", "Beverages"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mt Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.3934,
      "longitude": -82.4857
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Mt Vernon",
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Knox County",
          "containedInPlace": {
            "@type": "State",
            "name": "Ohio"
          }
        }
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    },
    "hasMenu": {
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Bubble Tea",
          "description": "Handcrafted bubble tea with premium tea and fresh tapioca pearls"
        },
        {
          "@type": "MenuSection",
          "name": "Fruit Teas",
          "description": "Tropical fruit-infused teas with natural fruit flavors"
        },
        {
          "@type": "MenuSection",
          "name": "Smoothies",
          "description": "Protein-packed smoothies and meal replacement shakes"
        },
        {
          "@type": "MenuSection",
          "name": "Dirty Sodas",
          "description": "Specialty fizz drinks with creative flavor combinations"
        }
      ]
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Eastend Tanning & Laundry",
      "url": "https://tanshop-unified.preview.emergentagent.com"
    }
  };
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
        title="Fizze Drinks | Bubble Tea & Smoothies in Mt Vernon, Ohio"
        description="Cool off with Fizze Drinks—bubble teas, smoothies, dirty sodas, and fruit fizzes made fresh daily at Eastend Tanning & Laundry, Mt Vernon, Knox County, OH. Order online for pickup or delivery!"
        keywords="Fizze Drinks Mt Vernon, bubble tea Mt Vernon Ohio, smoothies Knox County, Fizze specialty drinks, custom bubble tea Mount Vernon Ohio, fruit fizz drinks Knox County, Eastend Fizze Bar, dirty sodas Mt Vernon"
        ogImage={fizzeLogoUrl}
        schemaMarkup={createFizzeDrinksSchema()}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={fizzeLogoUrl} alt="Fizze Drinks bubble tea Mt Vernon Ohio" className="h-20 mx-auto mb-6" loading="eager" />
          <h1 className="font-serif text-6xl font-black mb-4 tracking-tight" itemProp="name">FIZZE DRINKS</h1>
          <p className="text-2xl mb-3 text-white font-semibold">Mt Vernon's Premier Bubble Tea & Specialty Drinks</p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto">
            Discover Fizze Drinks at Eastend Tanning & Laundry in Mt Vernon, Ohio. Our refreshing bubble teas, smoothies, dirty sodas, and fruit fizz drinks are handcrafted fresh daily. Stop by for a local favorite in Knox County!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate('/order-drinks')}
              className="bg-white text-[hsl(42_92%_55%)] hover:bg-white/90 text-lg px-8 h-14"
              data-testid="order-online-button"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Online - Pickup or Delivery
            </Button>
            <a href="tel:+17403979632">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[hsl(42_92%_55%)] text-lg px-8 h-14"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call (740) 397-9632
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About Fizze Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 mb-12 shadow-md"
        >
          <h2 className="font-serif text-4xl font-bold mb-4 text-center">About Fizze Drinks</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg mb-4 leading-relaxed">
              Fizze is our in-house drink bar—created to refresh your day while you tan or do laundry at Eastend. Every Fizze drink is made to energize and cool you off right here in Mt Vernon, Ohio.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're grabbing a bubble tea before your tanning session, sipping a smoothie while your laundry spins, or ordering specialty drinks for delivery across Knox County, Fizze Drinks is your go-to spot for handcrafted beverages made with premium ingredients and served with a smile. <strong>Proudly serving Mt Vernon and Knox County</strong> with the freshest drinks in Ohio!
            </p>
          </div>
        </motion.div>

        {/* Menu Categories with SEO-Rich Descriptions */}
        <div className="space-y-12">
          {Object.entries(menu).map(([category, drinks]) => {
            const catDetails = categoryDetails[category] || {
              icon: <Coffee />,
              gradient: 'from-gray-400 to-gray-600',
              title: category,
              description: `Explore our ${category} menu with fresh, handcrafted drinks made daily at Fizze in Mt Vernon, Ohio.`,
              keywords: category
            };
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`bg-gradient-to-r ${catDetails.gradient} text-white rounded-xl p-8 mb-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    {catDetails.icon}
                    <h2 className="font-serif text-4xl font-bold">{catDetails.title}</h2>
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-3 py-1">{drinks.length} drinks</Badge>
                  </div>
                  <p className="text-white/95 text-base leading-relaxed max-w-5xl">
                    {catDetails.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drinks.map((drink) => (
                    <Card key={drink.id} className="p-6 hover:shadow-xl transition-shadow" itemScope itemType="https://schema.org/Product">
                      <h3 className="font-bold text-xl mb-2" itemProp="name">{drink.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4" itemProp="description">{drink.flavor_profile}</p>
                      {drink.price && (
                        <div className="flex items-center justify-between" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                          <span className="text-2xl font-bold text-[hsl(42_92%_55%)]" itemProp="price">${drink.price.toFixed(2)}</span>
                          <meta itemProp="priceCurrency" content="USD" />
                          <meta itemProp="availability" content="https://schema.org/InStock" />
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

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 mb-6">
              <h2 className="font-serif text-4xl font-bold mb-2">Coming Soon - Vote for Your Favorites!</h2>
              <p className="text-white/90 text-lg">Help us decide which drinks to add next to the Fizze menu in Mt Vernon</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoon.map((drink) => (
                <Card key={drink.id} className="p-6 hover:shadow-xl transition-shadow">
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

        {/* Local CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white rounded-xl p-8 text-center"
        >
          <h2 className="font-serif text-4xl font-bold mb-4">Visit Fizze Drinks in Mt Vernon Today!</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Stop by 818 Coshocton Ave, Mt Vernon, OH to try our bubble teas, smoothies, and specialty drinks. Made fresh daily, available for pickup or delivery across Knox County!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://www.google.com/maps/dir/?api=1&destination=818+Coshocton+Ave,+Mt+Vernon,+OH+43050" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-[hsl(42_92%_55%)] hover:bg-white/90 text-lg px-8 h-14">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </a>
            <a href="https://www.google.com/maps/place/Eastend+Tanning+and+Laundry/@40.3930,-82.4850,17z" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[hsl(42_92%_55%)] text-lg px-8 h-14">
                <Star className="w-5 h-5 mr-2" />
                Leave a Review
              </Button>
            </a>
          </div>
          <p className="mt-6 text-white/90 text-lg">
            <strong>Hours:</strong> Open Daily 8:00 AM - 7:30 PM | <strong>Phone:</strong> (740) 397-9632
          </p>
        </motion.div>

        {/* FAQ Section for AI/Voice Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 mb-12"
        >
          <h2 className="font-serif text-4xl font-bold mb-8 text-center">Frequently Asked Questions About Fizze Drinks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">What are Fizze Drinks?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Fizze Drinks are handcrafted bubble teas, smoothies, dirty sodas, and fruit fizz drinks available at Eastend Tanning & Laundry in Mt Vernon, Ohio. We make every drink fresh to order with premium ingredients.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">Do you offer dairy-free or vegan Fizze options?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Yes! We have vegan-friendly fruit fizzes and smoothies, as well as dairy-free milk options for bubble tea. Just ask our team when ordering.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">Where can I get Fizze Drinks in Knox County?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Fizze Drinks are available exclusively at Eastend Tanning & Laundry, located at 818 Coshocton Ave, Mt Vernon, OH 43050. We also offer delivery across Knox County!
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">What are the most popular Fizze flavors?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Our top picks include Brown Sugar Milk Tea, Strawberry Fruit Tea, Mango Smoothie, Buckeye Shake, and our signature Dirty Sodas. Try them all and find your favorite!
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">Are Fizze Drinks available to-go?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Yes! All Fizze Drinks are made fresh and available to-go. Order online for pickup or delivery, or stop by our Mt Vernon location and grab your drink to go.
                </p>
              </div>
            </Card>

            <Card className="p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="font-bold text-xl mb-3" itemProp="name">Can I customize my Fizze drink?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-muted-foreground leading-relaxed" itemProp="text">
                  Absolutely! Customize sweetness level, ice amount, and choose from multiple topping options including tapioca boba, popping boba, and fruit jellies. We love creating your perfect drink!
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Footer Local Signal */}
        <div className="text-center py-8 border-t border-muted-foreground/20">
          <p className="text-muted-foreground text-lg">
            <strong>Fizze Drinks</strong> - Proudly serving Mt Vernon and Knox County, Ohio since 2024
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Part of the Eastend Tanning & Laundry family | 818 Coshocton Ave, Mt Vernon, OH 43050
          </p>
        </div>
      </div>
    </div>
  );
}
