import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50">
      <SEOHead 
        title="Beauty & Wellness Blog - People of the Eastend"
        description="Beauty tips, wellness advice, and local insights from Mount Vernon's premier multi-service destination"
        keywords="beauty tips, wellness advice, Mount Vernon, hair salon, nail salon, spa services"
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
            People of the Eastend
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
