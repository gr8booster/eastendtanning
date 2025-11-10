import { Helmet } from 'react-helmet-async';

export function SEOHead({ 
  title, 
  description, 
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  schemaMarkup
}) {
  const baseUrl = 'https://laundry-marketing.preview.emergentagent.com';
  const defaultTitle = 'Eastend Tanning & Laundry - Premier Tanning Salon & Laundromat';
  const defaultDescription = 'Experience luxury tanning and convenient laundry services at Eastend. Monthly unlimited tanning packages, professional lotions, coin & card laundry, and fresh Fizze bubble tea drinks.';
  const defaultImage = `${baseUrl}/images/eastend-hero.jpg`;
  const defaultKeywords = 'tanning salon, laundromat, bubble tea, Fizze drinks, spray tan, UV tanning, coin laundry, laundry service';

  const fullTitle = title ? `${title} | Eastend` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const fullCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  const fullOgImage = ogImage || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Eastend Tanning & Laundry" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="author" content="Eastend Tanning & Laundry" />
      
      {/* Structured Data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
}

// Business Schema Generator
export const createLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eastend Tanning & Laundry",
    "image": "https://laundry-marketing.preview.emergentagent.com/images/eastend-logo.jpg",
    "@id": "https://laundry-marketing.preview.emergentagent.com",
    "url": "https://laundry-marketing.preview.emergentagent.com",
    "telephone": "+1-555-EASTEND",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Eastend Ave",
      "addressLocality": "Your City",
      "addressRegion": "ST",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/eastendtanning",
      "https://www.instagram.com/eastendtanning",
      "https://www.tiktok.com/@eastendtanning"
    ]
  };
};

// Service Schema Generator
export const createServiceSchema = (serviceName, description, price) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Eastend Tanning & Laundry"
    },
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD"
    }
  };
};

// Product Schema Generator
export const createProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description || product.flavor_profile,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Fizze"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://laundry-marketing.preview.emergentagent.com/drinks`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
};
