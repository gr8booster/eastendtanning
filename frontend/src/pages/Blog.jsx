import React, { useEffect, useState } from 'react';
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
    dateText: 'January 1, 2025',
    excerpt:
      "People choose Eastend for tanning because it’s clean, consistent, and designed around real routines. This story shows how locals fit tanning into their day while handling laundry or relaxing with a drink in the same visit.",
    serviceLink: '/tanning',
    serviceLinkText: 'Learn more about tanning at Eastend'
  },
  {
    id: 'how-locals-combine-laundry-and-self-care',
    title: 'How Locals Combine Laundry and Self-Care at Eastend',
    datetime: '2024-12-15',
    dateText: 'December 15, 2024',
    excerpt:
      'Many customers use Eastend to turn routine laundry into productive downtime. This story explains how people tan, grab a drink, or relax while their laundry is running.',
    serviceLink: '/laundry',
    serviceLinkText: 'View laundry services'
  },
  {
    id: 'what-kind-of-place-is-eastend',
    title: 'What Kind of Place Is Eastend?',
    datetime: '2024-11-30',
    dateText: 'November 30, 2024',
    excerpt:
      'Eastend is more than a single-service business. This story answers what type of people come here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.',
    serviceLink: '/tanning',
    serviceLinkText: 'Explore the tanning studio'
  }
];

export default function Blog() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This page is intentionally static-first for SEO/AEO.
    // We keep a loading flag so we can later expand to dynamic content without changing structure.
    setLoading(false);
  }, []);

  const breadcrumbs = generateBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'People of Eastend', path: '/blog' }
  ]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50"
      data-testid="blog-page"
    >
      {/* Static Fallback for SEO/AEO - visible without JavaScript */}
      <StaticFallback page="blog" />

      <EnhancedSEO
        title="People of Eastend - Real Customer Stories from Mt Vernon's Tanning Hub"
        description="People of Eastend shares real stories from customers and locals who use Eastend for tanning, laundry, drinks, and self-care. Each story answers common questions about what Eastend is like, who it’s for, and how people combine multiple services in one visit."
        keywords="People of Eastend, Mt Vernon tanning stories, Eastend customer stories, indoor tanning experience, tanning for SAD, gym vs salon tanning"
        canonicalUrl="https://eastend.website/blog"
        structuredData={[peopleOfEastendSchema]}
        breadcrumbs={breadcrumbs}
        ogImage="https://eastend.website/images/blog-hero.jpg"
      />

      {/*
        FINAL ONE-AND-DONE UPDATE: STATIC BLOG INDEX FOR SEO / AEO
        APPLY EXACTLY. NO FURTHER ITERATION REQUIRED.
      */}
      <section id="people-of-eastend-blog" className="py-16 px-4" data-testid="people-of-eastend-blog">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-6" data-testid="people-of-eastend-title">
            People of Eastend
          </h1>

          <p className="text-xl text-slate-700 leading-relaxed mb-12" data-testid="people-of-eastend-intro">
            People of Eastend shares real stories from customers and locals who use Eastend for tanning,
            laundry, drinks, and self-care. Each story answers common questions about what Eastend is like,
            who it’s for, and how people combine multiple services in one visit.
          </p>

          {/* BLOG ENTRY 1 */}
          <article className="mb-12 pb-10 border-b border-slate-200" data-testid="people-of-eastend-article-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              <a
                href="/blog/why-people-choose-tanning-at-eastend"
                className="hover:text-teal-700 transition-colors"
                data-testid="people-of-eastend-article-1-title-link"
              >
                Why People Choose Tanning at Eastend
              </a>
            </h2>
            <time
              dateTime="2025-01-01"
              className="text-sm text-slate-500 mb-4 block"
              data-testid="people-of-eastend-article-1-date"
            >
              January 1, 2025
            </time>
            <p className="text-lg text-slate-700 leading-relaxed mb-4" data-testid="people-of-eastend-article-1-excerpt">
              People choose Eastend for tanning because it’s clean, consistent, and designed around real
              routines. This story shows how locals fit tanning into their day while handling laundry or
              relaxing with a drink in the same visit.
            </p>
            <a
              href="/tanning"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              data-testid="people-of-eastend-article-1-service-link"
            >
              Learn more about tanning at Eastend
            </a>
          </article>

          {/* BLOG ENTRY 2 */}
          <article className="mb-12 pb-10 border-b border-slate-200" data-testid="people-of-eastend-article-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              <a
                href="/blog/how-locals-combine-laundry-and-self-care"
                className="hover:text-teal-700 transition-colors"
                data-testid="people-of-eastend-article-2-title-link"
              >
                How Locals Combine Laundry and Self-Care at Eastend
              </a>
            </h2>
            <time
              dateTime="2024-12-15"
              className="text-sm text-slate-500 mb-4 block"
              data-testid="people-of-eastend-article-2-date"
            >
              December 15, 2024
            </time>
            <p className="text-lg text-slate-700 leading-relaxed mb-4" data-testid="people-of-eastend-article-2-excerpt">
              Many customers use Eastend to turn routine laundry into productive downtime. This story
              explains how people tan, grab a drink, or relax while their laundry is running.
            </p>
            <a
              href="/laundry"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              data-testid="people-of-eastend-article-2-service-link"
            >
              View laundry services
            </a>
          </article>

          {/* BLOG ENTRY 3 */}
          <article className="last:border-b-0" data-testid="people-of-eastend-article-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              <a
                href="/blog/what-kind-of-place-is-eastend"
                className="hover:text-teal-700 transition-colors"
                data-testid="people-of-eastend-article-3-title-link"
              >
                What Kind of Place Is Eastend?
              </a>
            </h2>
            <time
              dateTime="2024-11-30"
              className="text-sm text-slate-500 mb-4 block"
              data-testid="people-of-eastend-article-3-date"
            >
              November 30, 2024
            </time>
            <p className="text-lg text-slate-700 leading-relaxed mb-4" data-testid="people-of-eastend-article-3-excerpt">
              Eastend is more than a single-service business. This story answers what type of people come
              here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.
            </p>
            <a
              href="/tanning"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              data-testid="people-of-eastend-article-3-service-link"
            >
              Explore the tanning studio
            </a>
          </article>
        </div>
      </section>

      {/* Keep the static data array available for future extensions. */}
      <SEOHead title="People of Eastend" description="People of Eastend - Real customer stories." />

      {/* Placeholder state (no UI output) */}
      {loading ? null : null}
    </div>
  );
}
