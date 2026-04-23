import { Helmet } from 'react-helmet-async';

export function BusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eastend Tanning & Laundry",
    "image": "https://google-reviews-2.preview.emergentagent.com/logo.png",
    "@id": "https://google-reviews-2.preview.emergentagent.com",
    "url": "https://google-reviews-2.preview.emergentagent.com",
    "telephone": "+17403979632",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mount Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.3934,
      "longitude": -82.4857
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "19:30"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/eastendtanning",
      "https://www.instagram.com/eastendtanning"
    ],
    "priceRange": "$$",
    "description": "Mount Vernon's premier tanning salon, laundromat, and bubble tea bar. Offering professional tanning beds, 24/7 laundry, and Fizze drinks."
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}