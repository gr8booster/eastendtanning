import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, Calendar, Tag, Sparkles, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSEO } from '../components/EnhancedSEO';
import { generateBreadcrumb } from '../utils/structuredData';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/content/blog/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        toast.error('Blog post not found');
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.meta_description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Create BlogPosting schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description,
    "datePublished": post.created_at,
    "dateModified": post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Eastend Tanning & Laundry",
      "url": "https://eastend.website"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Eastend Tanning & Laundry",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eastend.website/eastend-logo.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://eastend.website/blog/${post.id}`
    },
    "keywords": post.keywords ? post.keywords.join(', ') : '',
    "articleBody": post.content,
    "url": `https://eastend.website/blog/${post.id}`
  };

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'People of Eastend Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.id}` }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 py-12 px-4">
      <EnhancedSEO
        title={`${post.title} | People of Eastend Blog`}
        description={post.meta_description}
        keywords={post.keywords ? post.keywords.join(', ') : 'People of Eastend, Mount Vernon blog, tanning stories'}
        canonicalUrl={`https://eastend.website/blog/${post.id}`}
        structuredData={[blogPostingSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/eastend-logo.jpg"
      />
      <article className="max-w-4xl mx-auto" data-testid="blog-post-article">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-8 hover:bg-teal-50" data-testid="back-to-blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to People of Eastend Blog
          </Button>
        </Link>

        {/* Header */}
        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="ml-auto"
              data-testid="share-button"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900" data-testid="post-title">
            {post.title}
          </h1>

          <p className="text-xl text-slate-600" data-testid="post-description">
            {post.meta_description}
          </p>

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword, idx) => (
                <div key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  <Tag className="w-3 h-3" />
                  <span>{keyword}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-strong:text-slate-900"
          data-testid="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        {/* CTA */}
        {post.cta && (
          <div className="mt-12 p-8 bg-gradient-to-r from-amber-50 to-teal-50 rounded-2xl border border-amber-200/50">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{post.cta}</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/tanning">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Book Tanning
                  </Button>
                </Link>
                <Link to="/nails">
                  <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                    Book Nails
                  </Button>
                </Link>
                <Link to="/locations">
                  <Button variant="outline">View Locations</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
