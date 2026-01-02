import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar, Tag, ArrowRight, Sparkles, Sun, Snowflake, Heart } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { generateBreadcrumb } from '../utils/structuredData';
import { peopleOfEastendSchema } from '../utils/businessSchemas';
import { StaticFallback } from '../components/StaticFallback';

// Static blog articles for SEO - always available without JavaScript
const staticArticles = [
  {
    id: 'sad-winter-tanning',
    title: 'How Indoor Tanning Helps Fight SAD and Winter Depression in 2026',
    meta_description: 'Learn how UV light therapy at Eastend Tanning triggers vitamin D production and serotonin release to naturally combat Seasonal Affective Disorder (SAD) during Ohio winters.',
    content: `Seasonal Affective Disorder (SAD) affects millions of Americans during the dark winter months, and Ohio residents are particularly susceptible due to our cloudy, gray winters. At Eastend Tanning in Mt Vernon, we've seen firsthand how indoor tanning and red light therapy can help our customers beat the winter blues.

HOW UV LIGHT HELPS SAD:
When your skin is exposed to UV light, it triggers vitamin D production - the "sunshine vitamin" that many Ohioans are deficient in during winter. UV exposure also stimulates serotonin release, the "feel-good" hormone that regulates mood, sleep, and appetite. This is why many people feel happier and more energized after a tanning session.

RED LIGHT THERAPY BENEFITS:
Our Level 4 and Stand-Up beds include red light therapy, which provides non-UV light that reduces inflammation, improves sleep quality, and supports mental wellness. Red light therapy is gaining popularity as a complementary treatment for depression and anxiety.

MONTHLY UNLIMITED FOR CONSISTENT RESULTS:
For the best SAD relief, consistency is key. Our monthly unlimited packages allow you to tan as often as needed to maintain your mood and vitamin D levels throughout winter. Starting at just $39.99/month VIP, it's an affordable investment in your mental health.

CONSULT YOUR DOCTOR:
While many customers report mood improvements from regular tanning, SAD is a medical condition. We always recommend consulting with your healthcare provider for a comprehensive treatment plan.`,
    keywords: ['SAD relief', 'Seasonal Affective Disorder', 'winter depression', 'UV therapy', 'vitamin D', 'red light therapy', 'Mt Vernon tanning'],
    category: 'Wellness',
    created_at: '2026-01-15'
  },
  {
    id: 'best-tanning-salon-mt-vernon',
    title: 'Why Eastend is the Best Tanning Salon Near Me in Mt Vernon Ohio',
    meta_description: 'Discover why Eastend Tanning has been voted the best tanning salon in Mt Vernon, Ohio for 26 years. 6 bed levels, Matrix Bed, expert staff, and competitive pricing.',
    content: `If you're searching for "best tanning salon near me" in Mt Vernon, Ohio, Eastend Tanning consistently comes out on top. Here's why our customers choose us over gyms and other salons:

6 PROFESSIONAL BED LEVELS:
We offer more tanning options than any facility in Knox County:
- Level 1 (3,840W) - Perfect for beginners, $5/session
- Level 2 (5,000W) - Our most popular, $8/session  
- Level 3 (10,750W) - High-pressure for faster results, $10/session
- Level 4 (13,995W) - Premium with red light therapy, $14.99/session
- Stand-Up (8,640W) - Even, streak-free coverage, $11/session
- Matrix (40,740W) - The most powerful bed in Knox County, $23.99/session

WE'RE TANNING SPECIALISTS:
Unlike gyms that treat tanning as an afterthought with outdated equipment and untrained staff, tanning is our specialty. Our beds are professionally maintained daily, our bulbs are replaced on schedule, and our staff is trained to help you achieve your tanning goals safely.

26 YEARS OF TRUSTED SERVICE:
We've been serving Mt Vernon since 1998. That's 26 years of building relationships with Knox County families and perfecting our craft.

COMPETITIVE PRICING:
Monthly unlimited packages start at just $39.99 VIP - often less than gym tanning add-ons that come with restrictions and inferior equipment.

Visit us at 818 Coshocton Ave and see why we're the best tanning salon in Mt Vernon!`,
    keywords: ['best tanning salon near me', 'best tanning salon Mt Vernon', 'Knox County tanning', 'Matrix tanning bed', 'monthly unlimited tanning'],
    category: 'About Us',
    created_at: '2026-01-10'
  },
  {
    id: 'spring-break-base-tan',
    title: 'Building Your Perfect Spring Break Base Tan - Start in February 2026',
    meta_description: 'Expert tips on safely building a base tan before spring break. Why February is the ideal time to start, recommended bed progression, and monthly unlimited benefits.',
    content: `Planning a spring break trip? February 2026 is the perfect time to start building your base tan at Eastend Tanning. Here's how to get beach-ready safely and effectively:

WHY START IN FEBRUARY:
Building a quality base tan takes 4-6 weeks of consistent sessions. Starting in early February gives you plenty of time before March spring break trips. Rush tanning in the week before your vacation won't give you results and increases burn risk.

RECOMMENDED PROGRESSION:
Week 1-2: Start with Level 1 or 2 beds, 8-10 minute sessions, every 48 hours
Week 3-4: Move up to Level 2 or 3, 10-12 minute sessions
Week 5-6: Consider Level 3 or Stand-Up for finishing touches

MONTHLY UNLIMITED ADVANTAGE:
Our monthly unlimited packages are perfect for base tan building. For one flat fee, you can tan as often as your skin allows without worrying about per-session costs. Level 2 Unlimited starts at just $60/month.

LOTION MATTERS:
Using quality tanning lotion accelerates your tan and keeps skin moisturized. Our staff can recommend the right lotion for your skin type. We carry accelerators for beginners and bronzers for those seeking deeper color.

PROTECT YOUR RESULTS:
After building your base tan, maintain it with 2-3 sessions per week. Your base tan provides natural SPF 2-4 protection, but always use sunscreen on your vacation for extended sun exposure.

Visit Eastend Tanning today and let our expert staff create a personalized base tan plan for your spring break!`,
    keywords: ['base tan', 'spring break tanning', 'vacation tan', 'February tanning', 'tanning progression', 'Mt Vernon tanning'],
    category: 'Tanning Tips',
    created_at: '2026-02-01'
  },
  {
    id: 'red-light-therapy-benefits',
    title: 'Red Light Therapy Benefits: Beyond Tanning at Eastend',
    meta_description: 'Explore the science-backed benefits of red light therapy available at Eastend Tanning. From anti-aging and skin health to mood support and muscle recovery.',
    content: `Red light therapy is one of the most exciting wellness trends, and it's available right here at Eastend Tanning in Mt Vernon. Here's what you need to know:

WHAT IS RED LIGHT THERAPY:
Red light therapy uses specific wavelengths of red and near-infrared light (630-850nm) that penetrate the skin and stimulate cellular energy production. Unlike UV tanning, red light is non-damaging and works at the cellular level.

SKIN HEALTH BENEFITS:
- Stimulates collagen production for reduced wrinkles
- Improves skin tone and texture
- Reduces inflammation and redness
- Speeds healing of blemishes
- Promotes overall skin rejuvenation

MOOD & WELLNESS:
Red light therapy can help with:
- Seasonal mood changes (SAD support)
- Sleep quality improvement
- Reduced anxiety symptoms
- Increased energy levels

MUSCLE RECOVERY:
Athletes and fitness enthusiasts use red light therapy for:
- Faster post-workout recovery
- Reduced muscle soreness
- Improved joint health
- Enhanced performance

WHERE TO FIND IT AT EASTEND:
Our Level 4 premium beds and Stand-Up beds include built-in red light therapy panels. You can enjoy UV tanning and red light therapy benefits in a single session, or use the red light feature alone.

Try red light therapy at Eastend Tanning - no appointment needed!`,
    keywords: ['red light therapy', 'anti-aging', 'skin rejuvenation', 'collagen', 'muscle recovery', 'Mt Vernon wellness'],
    category: 'Wellness',
    created_at: '2026-01-20'
  },
  {
    id: 'free-drying-laundry',
    title: 'Free Drying Every Day: Why Eastend Laundry is Mt Vernon\'s Best Value',
    meta_description: 'Eastend Laundry offers FREE drying every day - the only laundromat in Mt Vernon with this deal. Calculate your savings and learn about our services.',
    content: `Looking for affordable laundry in Mt Vernon? Eastend Laundry at 818 Coshocton Ave offers something no other laundromat in town does: FREE DRYING EVERY DAY.

THE FREE DRYING DIFFERENCE:
Most laundromats charge $0.25-$0.50 per 6-8 minute dryer cycle. A typical load needs 30-45 minutes of drying, costing $1.50-$3.75 per load. At Eastend, that's $0.

CALCULATE YOUR SAVINGS:
If you do 2 loads per week:
- Other laundromats: ~$6/week in drying = $312/year
- Eastend: $0 in drying = $312 SAVED per year

For families doing 4+ loads weekly, savings exceed $600 annually!

OUR WASHER PRICING:
- 20lb washers: $4.50 (perfect for small loads)
- 40lb washers: $6.50 (most popular)  
- 60lb washers: $7.50 (great for bedding)

Add free drying and you're looking at the best laundry value in Knox County.

CLEAN & CONVENIENT:
- Attendant on duty during business hours
- Well-lit, clean facility
- Credit card and coin-operated machines
- Large parking lot for easy access
- Open 7 days: 8 AM - 7:30 PM

WASH-DRY-FOLD SERVICE:
Don't have time? Drop off your laundry and we'll do it for you! Professional wash, dry, and folding service available.

Visit Eastend Laundry and start saving on your laundry today!`,
    keywords: ['free drying laundry', 'coin laundry Mt Vernon', 'laundromat Knox County', 'wash dry fold', 'cheapest laundry'],
    category: 'Laundry',
    created_at: '2026-01-05'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/content/blog`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50">
      <EnhancedSEO 
        title="People of Eastend Blog - Beauty, Wellness & Community Stories | Mt Vernon OH"
        description="Discover beauty tips, tanning advice, wellness guides, and local community stories from Eastend Tanning & Laundry in Mt Vernon, OH. Expert insights on tanning, nail care, bubble tea recipes, and Knox County lifestyle."
        keywords="People of Eastend blog, beauty tips Mt Vernon, tanning tips Knox County, wellness blog Ohio, nail care advice, bubble tea recipes, Mt Vernon community, Knox County lifestyle, Eastend blog"
        canonicalUrl="https://eastend.website/blog"
        structuredData={[peopleOfEastendSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/blog-hero.jpg"
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-teal-400/10" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6" data-testid="blog-hero">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Insights</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
            People of Eastend Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Beauty tips, wellness advice, and local insights from Mount Vernon's premier multi-service destination
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center" data-testid="no-posts">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">No blog posts yet</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Our AI is working on creating amazing content for you. Check back soon!
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-testid={`blog-post-${post.id}`}
                >
                  <div className="p-6 space-y-4">
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        AI Generated
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Meta Description */}
                    <p className="text-slate-600 line-clamp-3">
                      {post.meta_description}
                    </p>

                    {/* Keywords */}
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.keywords.slice(0, 3).map((keyword, idx) => (
                          <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                            <Tag className="w-3 h-3" />
                            <span>{keyword}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link to={`/blog/${post.id}`}>
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"
                        data-testid={`read-more-${post.id}`}
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
