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

// Static blog articles for SEO - "People of Eastend" with exact structure
const staticArticles = [
  {
    id: 'why-people-choose-tanning-at-eastend',
    title: 'Why People Choose Tanning at Eastend',
    datetime: '2025-01-01',
    created_at: '2025-01-01',
    shortAnswer: "People choose Eastend for tanning because it's clean, consistent, and designed around real routines. This story shows how locals fit tanning into their day while handling laundry or relaxing with a drink in the same visit.",
    meta_description: "People choose Eastend for tanning because it's clean, consistent, and designed around real routines. This story shows how locals fit tanning into their day while handling laundry or relaxing with a drink in the same visit.",
    content: `People choose Eastend for tanning because it's clean, consistent, and designed around real routines. This story shows how locals fit tanning into their day while handling laundry or relaxing with a drink in the same visit.`,
    keywords: ['tanning at Eastend', 'Mt Vernon tanning', 'indoor tanning Ohio'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Learn more about tanning at Eastend'
  },
  {
    id: 'how-locals-combine-laundry-and-self-care',
    title: 'How Locals Combine Laundry and Self-Care at Eastend',
    datetime: '2024-12-15',
    created_at: '2024-12-15',
    shortAnswer: 'Many customers use Eastend to turn routine laundry into productive downtime. This story explains how people tan, grab a drink, or relax while their laundry is running.',
    meta_description: 'Many customers use Eastend to turn routine laundry into productive downtime. This story explains how people tan, grab a drink, or relax while their laundry is running.',
    content: `Many customers use Eastend to turn routine laundry into productive downtime. This story explains how people tan, grab a drink, or relax while their laundry is running.`,
    keywords: ['laundry and self-care', 'Eastend laundry', 'Mt Vernon laundromat'],
    category: 'People of Eastend',
    primaryLink: '/laundry',
    primaryLinkText: 'View laundry services'
  },
  {
    id: 'what-kind-of-place-is-eastend',
    title: 'What Kind of Place Is Eastend?',
    datetime: '2024-11-30',
    created_at: '2024-11-30',
    shortAnswer: 'Eastend is more than a single-service business. This story answers what type of people come here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.',
    meta_description: 'Eastend is more than a single-service business. This story answers what type of people come here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.',
    content: `Eastend is more than a single-service business. This story answers what type of people come here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.`,
    keywords: ['what is Eastend', 'Eastend Mt Vernon', 'local lifestyle hub'],
    category: 'People of Eastend',
    primaryLink: '/tanning',
    primaryLinkText: 'Explore the tanning studio'
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
          <p className="text-xl text-slate-700 leading-relaxed">
            People of Eastend shares real stories from customers and locals who use Eastend for tanning,
            laundry, drinks, and self-care. Each story answers common questions about what Eastend is like,
            who it's for, and how people combine multiple services in one visit.
          </p>
        </div>
      </section>

      {/* Static Blog Index - All stories listed with title, date, excerpt, link */}
      <section className="py-12 px-4" id="people-of-eastend-blog">
        <div className="max-w-4xl mx-auto">
          
          {/* Static story entries - always rendered */}
          <div className="space-y-12" data-testid="blog-index">
            {staticArticles.map((story) => (
              <article key={story.id} className="border-b border-slate-200 pb-10 last:border-b-0" data-testid={`story-entry-${story.id}`}>
                {/* Story Title (H2) */}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 hover:text-teal-700 transition-colors">
                  <Link to={`/blog/${story.id}`}>{story.title}</Link>
                </h2>
                
                {/* Publish Date */}
                <time dateTime={story.datetime} className="text-sm text-slate-500 mb-4 block">
                  {formatDate(story.created_at)}
                </time>
                
                {/* Excerpt */}
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  {story.shortAnswer}
                </p>
                
                {/* Service Link */}
                <Link 
                  to={story.primaryLink}
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  {story.primaryLinkText}
                </Link>
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
