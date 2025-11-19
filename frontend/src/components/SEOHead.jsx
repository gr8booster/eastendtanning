import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ title, description, keywords, schemaMarkup, canonicalUrl }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export const createLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eastend Tanning & Laundry",
    "description": "Premier tanning salon and laundromat in Mt Vernon, OH",
    "url": "https://eastend.website",
    "telephone": "+17403979632",
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
      "latitude": "40.3934",
      "longitude": "-82.4858"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "19:30"
      }
    ],
    "priceRange": "$$",
    "image": [
      "https://eastend.website/images/tanning-beds.jpg",
      "https://eastend.website/images/laundry-services.jpg"
    ],
    "sameAs": [
      "https://www.facebook.com/EastendTanningLaundry",
      "https://www.instagram.com/eastendtanning/",
      "https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

export const createServiceSchema = (name, description, price) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": name,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Eastend Tanning & Laundry",
      "telephone": "+17403979632",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "818 Coshocton Ave",
        "addressLocality": "Mt Vernon",
        "addressRegion": "OH",
        "postalCode": "43050"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD"
    }
  };
};

export const createProductSchema = (name, description, price, image) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image || "https://eastend.website/images/product-default.jpg",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "LocalBusiness",
        "name": "Eastend Tanning & Laundry",
        "telephone": "+17403979632"
      }
    }
  };
};
