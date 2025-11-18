import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Enhanced SEO Component with FAQ and Structured Data
 * Provides comprehensive SEO and AEO optimization
 */
export const EnhancedSEO = ({ 
  title, 
  description, 
  keywords,
  canonicalUrl,
  faqSchema,
  structuredData = [],
  breadcrumbs,
  ogImage,
  ogType = 'website'
}) => {
  // Combine all structured data into one array
  const allStructuredData = [
    ...(Array.isArray(structuredData) ? structuredData : [structuredData]),
    faqSchema && faqSchema,
    breadcrumbs && breadcrumbs
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl || `https://eastend.website${window.location.pathname}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl || `https://eastend.website${window.location.pathname}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content="Eastend Tanning & Laundry" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl || `https://eastend.website${window.location.pathname}`} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}

      {/* Structured Data */}
      {allStructuredData.map((schema, index) => (
        schema && (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )
      ))}

      {/* AI Engine Optimization Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
    </Helmet>
  );
};

export default EnhancedSEO;
