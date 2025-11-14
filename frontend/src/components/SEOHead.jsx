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
  const baseUrl = 'https://knoxcounty-fizze.preview.emergentagent.com';
  const defaultTitle = 'Eastend Tanning & Laundry | Mt Vernon, OH | Tanning Salon & Laundromat Knox County';
  const defaultDescription = 'Eastend Tanning & Laundry at 818 Coshocton Ave, Mt Vernon, OH offers unlimited tanning packages, red light therapy, and laundry with free drying every day. Serving Knox County, Ohio. Call (740) 397-9632.';
  const defaultImage = `${baseUrl}/images/eastend-hero.jpg`;
  const defaultKeywords = 'tanning salon Mt Vernon, laundromat Knox County, red light therapy Mt Vernon, laundry Mt Vernon OH, tanning near me, laundry with free drying Mt Vernon, UV tanning Knox County Ohio';

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

// Business Schema Generator - Optimized for Mt Vernon, Knox County Local SEO
export const createLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["TanningSalon", "Laundromat", "LocalBusiness"],
    "name": "Eastend Tanning & Laundry",
    "alternateName": "Eastend Tanning",
    "description": "Premier tanning salon and laundromat in Mt Vernon, Ohio offering unlimited tanning packages, red light therapy, laundry with free drying daily, serving Knox County.",
    "image": [
      "https://knoxcounty-fizze.preview.emergentagent.com/images/eastend-logo.jpg",
      "https://customer-assets.emergentagent.com/job_cece3dc5-08ac-44b8-9e32-3608ea17c8d0/artifacts/ylcc1ll3_Screenshot_20251108_054848_Google.jpg"
    ],
    "@id": "https://knoxcounty-fizze.preview.emergentagent.com",
    "url": "https://knoxcounty-fizze.preview.emergentagent.com",
    "telephone": "+17403979632",
    "priceRange": "$-$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mt Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.3934,
      "longitude": -82.4857
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Mt Vernon",
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Knox County",
          "containedInPlace": {
            "@type": "State",
            "name": "Ohio"
          }
        }
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:30"
    },
    "hasMap": "https://www.google.com/maps/place/818+Coshocton+Ave,+Mt+Vernon,+OH+43050",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "USD",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Parking",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wheelchair Accessible",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": true
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Unlimited Tanning",
          "description": "Monthly unlimited tanning with VIP packages starting at $39.99"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Laundry Service",
          "description": "Self-service laundry with free drying every day, drop-off service available at $1.75/lb"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Red Light Therapy",
          "description": "Premium red light therapy for skin rejuvenation and wellness"
        }
      }
    ],
    "sameAs": [
      "https://www.facebook.com/eastendtanning",
      "https://www.instagram.com/eastendtanning"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
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
      "url": `https://knoxcounty-fizze.preview.emergentagent.com/drinks`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
};
