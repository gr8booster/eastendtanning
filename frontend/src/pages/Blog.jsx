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

// Static blog articles for SEO - "People of Eastend" with explicit Q&A framing
// Each story: Question → Short Answer → Human Story → Link to /tanning (priority) or related service
const staticArticles = [
  {
    id: 'can-tanning-help-winter-depression',
    title: 'Can Tanning Actually Help With Winter Depression? Tom Found Out.',
    question: 'Can indoor tanning help with winter blues or SAD?',
    shortAnswer: 'Many customers report improved mood, energy, and sleep during Ohio winters after regular tanning sessions. UV exposure triggers vitamin D production and serotonin release. While we recommend consulting doctors for SAD, countless customers tell us tanning helps.',
    meta_description: 'Real story of how indoor tanning helped a night-shift worker manage winter depression. What to expect, questions for your doctor, and why UV light helps some people.',
    content: `QUESTION: Can indoor tanning help with winter blues or SAD?

SHORT ANSWER: Many customers report improved mood, energy, and sleep during Ohio winters after regular tanning sessions. UV exposure triggers vitamin D production and serotonin release. While we recommend consulting doctors for SAD, countless customers tell us tanning helps.

TOM'S STORY:
Tom works night shift at a Knox County factory. For years, he struggled during winters—no energy, bad mood, poor sleep. His doctor suggested light therapy. A coworker mentioned Eastend's tanning beds.

"I thought tanning was for beach people, not guys like me." But after a few sessions, something shifted.

"I'd come in, spend 15 minutes in the bed, and leave feeling like I'd seen sunshine. My wife noticed before I did—she said I was 'less grumpy.'"

Tom now has a monthly unlimited package ($60/month for Level 2) and calls his sessions "maintenance for my brain."

THE SCIENCE:
UV light triggers vitamin D production. Vitamin D deficiency is linked to depression. UV exposure also triggers serotonin release (the "feel-good" hormone). Ohio winters provide minimal natural UV. Indoor tanning supplements what you're missing.

IMPORTANT: We're not doctors. SAD is real. Consult a healthcare provider. Tanning can be part of a wellness approach, but not a substitute for medical treatment.

→ Learn about tanning for winter wellness: /tanning`,
    keywords: ['tanning for SAD', 'winter depression light therapy', 'vitamin D tanning', 'seasonal affective disorder Ohio'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Explore tanning for winter wellness',
    created_at: '2026-01-15'
  },
  {
    id: 'is-eastend-better-than-gym-tanning',
    title: 'Is Eastend Actually Better Than Gym Tanning? Sarah Switched.',
    question: 'Is a dedicated tanning salon better than gym tanning?',
    shortAnswer: 'Most gym-to-Eastend converts say the difference is "night and day." We\'re tanning specialists with professional equipment and trained staff—not a gym treating tanning as an afterthought with outdated beds and untrained staff.',
    meta_description: 'Why customers switch from gym tanning to Eastend. Real comparison of equipment, staff expertise, and results from someone who tried both.',
    content: `QUESTION: Is a dedicated tanning salon better than gym tanning?

SHORT ANSWER: Most gym-to-Eastend converts say the difference is "night and day." We're tanning specialists with professional equipment and trained staff—not a gym treating tanning as an afterthought with outdated beds and untrained staff.

SARAH'S EXPERIENCE:
Sarah used her gym's tanning for two years. "I figured tanning was tanning. A bed's a bed, right?"

Wrong.

"After two years, I could barely hold a tan. The gym beds were old, the bulbs dim, and no one knew anything. I'd ask questions and get shrugs."

Then she tried Eastend.

"First session, I noticed the difference. The beds are more powerful. Staff asked about my skin type, my goals. They recommended a specific bed and lotion."

Within three weeks, Sarah had a better tan than two years at her gym produced.

"I canceled my gym tanning add-on that day. It's not even close."

WHY GYM TANNING DISAPPOINTS:
- Equipment: Gyms buy cheap beds, replace bulbs infrequently
- Staff: No tanning expertise, can't advise on skin types
- Priority: Tanning is an afterthought, not the business focus

WHY EASTEND WORKS:
- Equipment: Professional-grade beds, including the 40,740W Matrix
- Staff: Trained in skin analysis, bed selection, lotion recommendations
- Focus: Tanning IS our primary service, not an add-on

→ Compare our tanning bed levels: /tanning`,
    keywords: ['gym tanning vs salon', 'best tanning salon comparison', 'why tanning salons better', 'Eastend vs gym tanning'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Compare our professional tanning beds',
    created_at: '2026-01-12'
  },
  {
    id: 'what-is-laundry-like-at-eastend',
    title: "What's It Actually Like Doing Laundry at Eastend?",
    question: 'What makes Eastend Laundry different from other laundromats?',
    shortAnswer: 'It\'s not just laundry—it\'s a mini break. Many customers start laundry, tan during the wash cycle, grab a drink, then fold. The FREE drying saves money, and combining with tanning saves time.',
    meta_description: 'Real description of the Eastend laundry experience—from free drying to combining with tanning. Why customers say it changed how they feel about laundromat day.',
    content: `QUESTION: What makes Eastend Laundry different from other laundromats?

SHORT ANSWER: It's not just laundry—it's a mini break. Many customers start laundry, tan during the wash cycle, grab a drink, then fold. The FREE drying saves money, and combining with tanning saves time.

MARIA'S SATURDAY ROUTINE:
Maria is a single mom with two kids. Every Saturday, they head to Eastend.

10:00 AM - Load three 40lb washers ($6.50 each)
10:10 AM - Kids get bubble tea. Maria starts a tanning session.
10:30 AM - Maria emerges refreshed. Checks on wash cycle.
10:50 AM - Transfers to dryers. (FREE!)
11:30 AM - Folds at clean tables. Maybe a quick manicure.
NOON - Done. Three loads complete, Maria got her tan, kids had treats.

"I dreaded laundry day until I found this place. The free drying saves me $10 per visit. The kids actually ask to come because of the drinks. And I get my tan in the same trip."

THE FREE DRYING DIFFERENCE:
Most laundromats: $1.50-$3.75 per load for drying
Eastend: $0. Every day.
Annual savings for weekly laundry: $300+

WHY COMBINE WITH TANNING:
Wash cycle: ~35 minutes
Tanning session: 10-20 minutes
Perfect timing. Start laundry → tan → return to fold.

→ Add tanning to your laundry visit: /tanning
→ See our laundry pricing: /laundry`,
    keywords: ['Eastend laundry experience', 'free drying laundromat', 'Mt Vernon laundry', 'laundromat with tanning'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Add tanning to your laundry visit',
    created_at: '2026-01-10'
  },
  {
    id: 'who-comes-to-eastend-for-tanning',
    title: 'What Kind of People Come to Eastend for Tanning?',
    question: 'Who uses indoor tanning at Eastend?',
    shortAnswer: 'Everyone from first-time tanners preparing for weddings to experienced regulars maintaining year-round color. Many come specifically for winter mood support. Tanning is our primary service and attracts diverse customers.',
    meta_description: 'Meet the diverse tanning customers at Eastend—from brides-to-be to winter wellness seekers. Why people choose Eastend as their tanning salon.',
    content: `QUESTION: Who uses indoor tanning at Eastend?

SHORT ANSWER: Everyone from first-time tanners preparing for weddings to experienced regulars maintaining year-round color. Many come specifically for winter mood support. Tanning is our primary service and attracts diverse customers.

THE PEOPLE YOU'LL SEE:
EVENT PREPPERS: Brides, grooms, prom-goers, vacation travelers. They want a base tan 4-6 weeks before their event. Staff guides them through the process.

YEAR-ROUND MAINTAINERS: Regular visitors who keep consistent color. They know their preferred bed, session length, and lotion.

WINTER WELLNESS SEEKERS: People who've discovered tanning helps their mood during Ohio's gray winters. They come for the UV light and vitamin D, not just the tan.

FIRST-TIMERS: Nervous about their skin type, unsure which bed to use. Our staff walks them through skin evaluation and first-session guidelines.

EXPERIENCED TANNERS: They know exactly what they want. They come to Eastend because we have professional equipment they trust—especially the Matrix bed, the most powerful in Knox County.

WHY TANNING IS OUR PRIMARY SERVICE:
We're not a gym with tanning as an add-on. We've been perfecting indoor tanning for 26 years. Our 6 bed levels, trained staff, and equipment investment reflect that tanning is what we do best. Everything else—laundry, drinks, nails—supports the tanning experience.

→ Explore our tanning services: /tanning`,
    keywords: ['who uses tanning beds', 'indoor tanning customers', 'tanning for events', 'winter tanning Ohio'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'See our tanning bed options',
    created_at: '2026-01-08'
  },
  {
    id: 'can-i-relax-at-eastend',
    title: 'Can I Actually Relax at Eastend, or Is It Just for Errands?',
    question: 'Is Eastend a place to relax or just run errands?',
    shortAnswer: 'Many customers have developed "self-care routines" at Eastend: tan (warm and relaxing), grab a cold drink, maybe get nails done. The tanning experience is inherently relaxing, and complementary services extend that feeling.',
    meta_description: 'How Eastend became a "third place" for Mt Vernon residents. Customer routines that turn tanning and errands into self-care time.',
    content: `QUESTION: Is Eastend a place to relax or just run errands?

SHORT ANSWER: Many customers have developed "self-care routines" at Eastend: tan (warm and relaxing), grab a cold drink, maybe get nails done. The tanning experience is inherently relaxing, and complementary services extend that feeling.

THE SELF-CARE HOUR:
One regular describes her routine:

"During Ohio winters, this is my reset. I tan for 15 minutes—just lying there in the warmth, no phone, no kids, no demands. I emerge and grab a cold bubble tea. Sometimes I add a quick manicure.

It's like a mini spa day without spa prices. The tanning especially—that warmth and light during gray Ohio winters—it's maintenance for my mental health."

WHY TANNING IS RELAXING:
- Warm, enclosed environment
- No phone, no interruptions
- UV light triggers feel-good hormones
- Dedicated "me time" built into the session

WHY COMPLEMENTARY SERVICES MATTER:
The bubble tea, nails, and laundry aren't random add-ons. They extend the relaxation. You can build an entire self-care visit around tanning:

1. Start laundry
2. Tan during wash cycle (relaxing warmth)
3. Grab cold drink (refreshing contrast)
4. Get quick manicure (pampering)
5. Fold laundry (productive)
6. Leave feeling reset

→ Start with a tanning session: /tanning`,
    keywords: ['Eastend relaxation', 'self-care tanning', 'Mt Vernon spa alternative', 'tanning for mental health'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Begin your self-care routine with tanning',
    created_at: '2026-01-05'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { name: 'People of Eastend', path: '/blog' }
  ]);

  // Use static articles if no posts loaded (ensures content for SEO)
  const displayPosts = posts.length > 0 ? posts : staticArticles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50">
      {/* Static Fallback for SEO/AEO - visible without JavaScript */}
      <StaticFallback page="blog" />
      
      <EnhancedSEO 
        title="People of Eastend - Real Stories from Mt Vernon Ohio's Neighborhood Destination"
        description="Meet the people who make Eastend Tanning & Laundry their home away from home. Real stories answering real questions about what it's like to tan, do laundry, and relax at Mt Vernon's favorite destination."
        keywords="People of Eastend, Mt Vernon community stories, Eastend customer stories, what is Eastend like, laundry experience Mt Vernon, tanning stories Ohio"
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
            <Heart className="w-4 h-4" />
            <span>Real Stories from Real Customers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
            People of Eastend
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Who comes to Eastend? What's it actually like? These stories answer your questions - straight from the customers who know best.
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
