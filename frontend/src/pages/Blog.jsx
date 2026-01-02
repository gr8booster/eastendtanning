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
        title="People of Eastend - Real Customer Stories from Mt Vernon's Tanning Hub"
        description="People of Eastend shares real stories from customers who use Eastend for tanning, laundry, drinks, and self-care. Each story answers common questions about what Eastend is like and how people use multiple services in one visit."
        keywords="People of Eastend, Mt Vernon tanning stories, Eastend customer stories, indoor tanning experience, tanning for SAD, gym vs salon tanning"
        canonicalUrl="https://eastend.website/blog"
        structuredData={[peopleOfEastendSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/blog-hero.jpg"
      />
      
      {/* Blog Introduction - Static, visible without interaction */}
      <section className="py-16 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto" data-testid="blog-intro">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-6">
            People of Eastend
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed mb-4">
            People of Eastend shares real stories from customers and locals who use Eastend for tanning, laundry, drinks, and self-care. Each story answers common questions about what Eastend is like, who it's for, and how people use multiple services in one visit.
          </p>
          <p className="text-lg text-slate-600">
            Tanning is our primary service—the anchor that brings people in. The stories below show how real customers experience Eastend and why they keep coming back.
          </p>
          <div className="mt-6">
            <Link to="/tanning" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold text-lg">
              <Sun className="w-5 h-5" />
              Learn about our tanning services →
            </Link>
          </div>
        </div>
      </section>

      {/* Static Blog Index - All stories listed with title, date, excerpt, link */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 sr-only">All Stories</h2>
          
          {/* Static story entries - always rendered */}
          <div className="space-y-10" data-testid="blog-index">
            {staticArticles.map((story, index) => (
              <article key={story.id} className="border-b border-slate-200 pb-10 last:border-b-0" data-testid={`story-entry-${story.id}`}>
                {/* Story Title (H2) */}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 hover:text-teal-700 transition-colors">
                  <Link to={`/blog/${story.id}`}>{story.title}</Link>
                </h2>
                
                {/* Publish Date */}
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Published: {formatDate(story.created_at)}
                </p>
                
                {/* Excerpt - Answer-first format */}
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  {story.shortAnswer}
                </p>
                
                {/* Links */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link 
                    to={`/blog/${story.id}`}
                    className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Read the full story
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  {/* Internal link to tanning (primary) or relevant service */}
                  <Link 
                    to={story.primaryLink || '/tanning'}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    <Sun className="w-4 h-4" />
                    {story.primaryLinkText || 'Related: Tanning Services'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {/* Dynamic posts from API (if any) */}
          {!loading && posts.filter(p => !staticArticles.find(s => s.id === p.id)).length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-300">
              <h2 className="text-xl font-bold text-slate-700 mb-6">More Stories</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {posts.filter(p => !staticArticles.find(s => s.id === p.id)).map(post => (
                  <Card key={post.id} className="p-5 hover:shadow-lg transition-shadow">
                    <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      <Link to={`/blog/${post.id}`} className="hover:text-teal-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                      {post.meta_description}
                    </p>
                    <Link to={`/blog/${post.id}`} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                      Read more →
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action - Link back to tanning */}
      <section className="py-12 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Experience Eastend?</h2>
          <p className="text-slate-600 mb-6">
            Start with our primary service—indoor tanning. Then discover how our complementary services make your visit even better.
          </p>
          <Link to="/tanning">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
              <Sun className="w-5 h-5 mr-2" />
              Explore Tanning Services
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
