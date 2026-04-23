import { Helmet } from 'react-helmet-async';

export function ServiceSchema({ name, description, category }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": name,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Eastend Tanning & Laundry"
    },
    "description": description,
    "areaServed": {
      "@type": "City",
      "name": "Mount Vernon"
    },
    "category": category
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}