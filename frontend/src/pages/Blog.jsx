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
// Reframed as "People of Eastend" with question-based content
const staticArticles = [
  {
    id: 'what-kind-of-people-visit-eastend',
    title: 'What Kind of People Visit Eastend? (You Might Be Surprised)',
    meta_description: 'Meet the diverse community that makes Eastend Tanning & Laundry their neighborhood destination. From OSU Knox students to working families - everyone is welcome.',
    content: `QUESTION: What kind of people go to Eastend?

SHORT ANSWER: Everyone. College students, working parents, retirees, first-time tanners, experienced regulars - our customer base reflects Mt Vernon itself. We've served Knox County for 26 years precisely because we welcome everyone.

THE FULL PICTURE:
Walk into Eastend on any given day and you'll see:

OSU Knox students doing laundry between classes, textbooks open on the folding tables. Many discover our Fizze bubble tea and become regulars.

Working moms who've learned to combine errands: start laundry, tan during the wash cycle, pick up ready-to-fold clothes. "It went from a chore to 'me time,'" one told us.

Night shift workers using our 24/7 Westend location at 3 AM because that's when their schedule allows.

Retirees who've been coming since we opened in 1998. Some have watched their children grow up here, now watching their grandchildren.

Young professionals grabbing a post-work tan and bubble tea as their evening unwind ritual.

First-time tanners nervous about their skin type, getting patient guidance from staff who've helped thousands of beginners.

Experienced tanners who know exactly which bed, which lotion, which settings - and trust us to maintain equipment properly.

WHAT BRINGS THEM ALL TOGETHER:
It's not just the services. It's the atmosphere. The owners know regulars by name. The staff actually cares about your results. The facility is clean and well-maintained. There's no pretense, no judgment - just a neighborhood place where you can take care of yourself.

SERVICE LINKS:
- Learn about our tanning services: /tanning
- See our laundry facilities: /laundry
- Explore Fizze drinks: /drinks`,
    keywords: ['who goes to Eastend', 'Mt Vernon tanning customers', 'neighborhood laundromat', 'Knox County community'],
    category: 'People of Eastend',
    created_at: '2026-01-15'
  },
  {
    id: 'whats-it-like-doing-laundry-at-eastend',
    title: "What's It Actually Like Doing Laundry at Eastend?",
    meta_description: 'A real description of the Eastend laundry experience - from free drying to bubble tea, why customers say it changed how they feel about laundromat day.',
    content: `QUESTION: What's it like doing laundry at Eastend?

SHORT ANSWER: It's not just laundry - it's a mini break. Clean facilities, free drying (really!), and enough other services that many customers actually look forward to laundromat day.

THE REAL EXPERIENCE:
Here's what a typical Eastend laundry visit looks like for Maria, a single mom with two kids:

10:00 AM - She pulls into the large parking lot behind the building. Easy access to the back door means no hauling baskets across a parking lot.

10:05 AM - Loads into three 40lb washers ($6.50 each). The machines are clean, well-maintained, and actually work - no out-of-order signs everywhere.

10:10 AM - Kids head to the Fizze counter. They know their orders: strawberry smoothie for the 8-year-old, mango boba for the 12-year-old. Maria gets a Thai tea.

10:15 AM - While washers run (about 35 minutes), Maria catches up on her phone in comfortable seating. The kids do homework. The facility is quiet, clean, air-conditioned.

10:50 AM - Transfers to dryers. Here's where Eastend is different: THE DRYERS ARE FREE. Every day. No coins, no cards, just... free. Maria saves about $4-6 per visit compared to other laundromats.

11:30 AM - Folds at the clean folding tables. Sometimes Maria gets her nails done at Fast Nails during this time - 20-minute manicure while kids watch.

NOON - Done. Three loads washed, dried, folded. Kids entertained. Mom had some downtime. Total cost: $19.50 for washing (dryers free) plus drinks.

WHY IT MATTERS:
"Laundry used to be this dreaded chore," Maria says. "Now the kids ask when we're going to Eastend. That's not normal, right? But it's real."

SERVICE LINKS:
- See our laundry pricing: /laundry
- Check out Fizze drinks: /drinks
- Book Fast Nails: /nails`,
    keywords: ['Eastend laundry experience', 'free drying laundromat', 'Mt Vernon laundry', 'laundromat with drinks'],
    category: 'People of Eastend',
    created_at: '2026-01-12'
  },
  {
    id: 'can-tanning-help-with-winter-blues',
    title: 'Can Tanning Actually Help With Winter Blues? Tom Found Out.',
    meta_description: 'A real story about how indoor tanning helped a night-shift worker manage winter depression. What to expect, what to ask your doctor, and why it works for some people.',
    content: `QUESTION: Can tanning help with SAD or winter depression?

SHORT ANSWER: Many customers report improved mood, energy, and sleep during winter months after regular tanning sessions. While we're not doctors and recommend consulting healthcare providers, the science makes sense: UV exposure triggers vitamin D and serotonin production.

TOM'S STORY:
Tom works night shift at a Knox County factory. For years, he struggled during Ohio winters.

"By December, I was a zombie. No energy, bad mood, sleeping all the time but never rested. My doctor said it was probably seasonal depression. Suggested light therapy."

A coworker mentioned Eastend. Tom was skeptical.

"I thought tanning was for beach people, college girls, not guys like me. But I was desperate."

First few sessions, he didn't notice much. Staff recommended twice weekly, Level 2 bed, 12 minutes. By week three, something shifted.

"I'd come in after my worst shift, spend 15 minutes in the bed, and leave feeling like I'd actually seen sunshine. My wife noticed before I did. She said I was 'less grumpy.'"

Tom now has a monthly unlimited package ($60/month for Level 2). He calls his sessions "maintenance for my brain."

THE SCIENCE (SIMPLIFIED):
- UV light triggers vitamin D production in your skin
- Vitamin D deficiency is linked to depression
- UV exposure also triggers serotonin release (the "feel-good" hormone)
- Ohio winters provide minimal natural UV exposure
- Indoor tanning can supplement what you're missing

IMPORTANT DISCLAIMER:
We're not doctors. SAD is a real medical condition. If you're struggling, please consult a healthcare provider. Tanning can be ONE part of a wellness approach, but it's not a substitute for medical treatment.

OUR RECOMMENDATION:
Talk to your doctor about light therapy. If they support it, our Level 4 beds include red light therapy panels that provide additional non-UV benefits for mood and skin.

SERVICE LINKS:
- Learn about our tanning beds: /tanning
- Read about red light therapy: /blog/red-light-therapy-benefits`,
    keywords: ['tanning for SAD', 'winter depression light therapy', 'vitamin D tanning', 'seasonal affective disorder Ohio'],
    category: 'People of Eastend',
    created_at: '2026-01-10'
  },
  {
    id: 'is-eastend-better-than-gym-tanning',
    title: 'Is Eastend Actually Better Than Gym Tanning? Sarah Switched and Here\'s What Happened.',
    meta_description: 'A comparison of gym tanning vs. dedicated tanning salons from someone who tried both. Why equipment, staff knowledge, and focus matter for tanning results.',
    content: `QUESTION: Is Eastend better than gym tanning, or just more expensive?

SHORT ANSWER: Most gym-to-Eastend converts say the difference is "night and day." Better equipment, knowledgeable staff, and faster results typically make dedicated tanning salons worth the switch.

SARAH'S EXPERIENCE:
Sarah had been using her gym's tanning beds for two years. The gym charged $15/month extra for "unlimited tanning."

"I figured tanning was tanning. A bed's a bed, right?"

Wrong.

"After two years, I could barely hold a tan. The gym beds were old, the bulbs were dim, and no one on staff knew anything about tanning. I'd ask questions and get shrugs."

A coworker recommended Eastend. Sarah was hesitant about paying "extra" for dedicated tanning.

"First session, I noticed the difference immediately. The beds are so much more powerful. The staff actually asked about my skin type, my tanning history, what I wanted to achieve. They recommended a specific bed and lotion."

Three weeks later, Sarah had a better tan than two years at her gym had produced.

"I canceled my gym tanning add-on that day. It's not even close. I was wasting $180/year on something that barely worked."

WHY GYM TANNING OFTEN DISAPPOINTS:
1. EQUIPMENT: Gyms buy cheap beds, replace bulbs infrequently, skip maintenance
2. STAFF: No tanning expertise, can't advise on skin types or products
3. RESTRICTIONS: Often limited hours, blackout periods, bed availability issues
4. PRIORITY: Tanning is an afterthought, not the business focus

WHY DEDICATED SALONS WORK BETTER:
1. EQUIPMENT: We invest in professional-grade beds because it's our core business
2. EXPERTISE: Staff trained in skin type analysis, bed selection, lotion recommendations
3. MAINTENANCE: Daily cleaning, scheduled bulb replacement, professional servicing
4. RESULTS: Faster, more consistent tanning with proper guidance

COST COMPARISON:
- Gym tanning add-on: $10-20/month (but with inferior equipment and results)
- Eastend Level 2 Unlimited: $60/month VIP (professional equipment, expert staff)

Many customers find they tan less often at Eastend because the beds are more effective - so monthly cost isn't necessarily higher.

SERVICE LINKS:
- Compare our bed levels: /tanning
- Take the skin type quiz: /skin-type-evaluation`,
    keywords: ['gym tanning vs salon', 'best tanning salon comparison', 'why tanning salons are better', 'Eastend vs gym tanning'],
    category: 'People of Eastend',
    created_at: '2026-01-08'
  },
  {
    id: 'can-i-relax-at-eastend-or-just-run-errands',
    title: 'Can I Actually Relax at Eastend, or Is It Just for Errands?',
    meta_description: 'How Eastend became a "third place" for Mt Vernon residents - somewhere between home and work where people actually want to spend time.',
    content: `QUESTION: Is Eastend a good place to spend time, not just run errands?

SHORT ANSWER: Absolutely. Many customers consider Eastend their "third place" - somewhere between home and work where they can actually relax. The combination of services, atmosphere, and community makes it more than just transactions.

JADE'S STUDY SPOT:
Jade is an OSU Knox student who discovered Eastend while doing laundry. Now she comes specifically to study.

"The campus library is loud and crowded. Coffee shops kick you out if you don't keep buying. Eastend? I order a taro milk tea, find a quiet corner, and study for hours. No one bothers me. The WiFi works. It's weirdly perfect."

THE SELF-CARE HOUR:
Several customers have developed what they call their "self-care hour" at Eastend. A typical routine:

- Arrive, start a tanning session (10-20 minutes depending on bed)
- Emerge relaxed, grab a cold bubble tea
- Sit in the comfortable seating area, decompress
- Maybe get a quick manicure at Fast Nails
- Leave feeling human again

"During Ohio winters, this is my reset," says one regular. "It's like a mini spa day without spa prices."

THE FAMILY OUTING:
For families with young kids, Eastend has become a weekend destination:

- Parents do laundry (free drying saves money)
- Kids get bubble tea as a treat
- Mom might tan while Dad watches the clothes
- Everyone leaves in good spirits

"We used to dread laundry day," one mom told us. "Now the kids literally ask when we're going to Eastend. That's wild."

WHY IT WORKS AS A "THIRD PLACE":
- Multiple reasons to be there (not just one transaction)
- Comfortable environment (clean, climate-controlled, good seating)
- Friendly staff (they know regulars, remember preferences)
- No pressure (stay as long as you want, no purchase minimums)
- Community feel (you see the same people, connections form)

We didn't design Eastend to be a hangout spot. But our customers made it one, and we're proud of that.

SERVICE LINKS:
- See all our services: /
- Explore Fizze drinks: /drinks
- Learn about tanning: /tanning`,
    keywords: ['Eastend as third place', 'Mt Vernon hangout spot', 'relaxation at Eastend', 'more than laundromat'],
    category: 'People of Eastend',
    created_at: '2026-01-05'
  }
];
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
      // Combine dynamic posts with static articles
      const allPosts = [...(data || []), ...staticArticles];
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fall back to static articles if API fails
      setPosts(staticArticles);
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

  // Use static articles if no posts loaded (ensures content for SEO)
  const displayPosts = posts.length > 0 ? posts : staticArticles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50">
      {/* Static Fallback for SEO/AEO - visible without JavaScript */}
      <StaticFallback page="blog" />
      
      <EnhancedSEO 
        title="Eastend Blog - Tanning Tips, SAD Relief & Mt Vernon Community 2026"
        description="Expert tanning tips, SAD relief advice, and Mt Vernon community stories from Eastend Tanning & Laundry. Learn about indoor tanning benefits, red light therapy, and seasonal wellness at Ohio's best tanning salon."
        keywords="tanning tips blog, SAD relief tanning, best tanning salon Mt Vernon, red light therapy benefits, winter depression UV therapy, Knox County wellness, Eastend blog 2026"
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
            <span>Expert Tanning & Wellness Advice</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
            Eastend Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tanning tips, SAD relief advice, and local insights from Mt Vernon's best tanning salon since 1998
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map(post => (
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
                      {post.category ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          {post.category}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          AI Generated
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

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
