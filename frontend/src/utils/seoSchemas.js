// Comprehensive Schema.org markup for SEO/AEO - Updated 2026

export const tanningSalonSchema = {
  "@context": "https://schema.org",
  "@type": "TanningSalon",
  "name": "Eastend Tanning & Laundry",
  "alternateName": ["Best Tanning Salon Mt Vernon", "Tanning Salon Near Me Mt Vernon Ohio", "Best Tanning Salon Near Me"],
  "description": "Eastend Tanning is Mt Vernon Ohio's #1 rated tanning salon in 2026. Professional indoor tanning with 6 bed levels including 40,740W Matrix Bed, Stand-Up tanning, red light therapy for SAD relief, and expert staff. Monthly unlimited from $39.99. Beat the winter blues!",
  "image": "https://eastend.website/images/eastend-tanning.jpg",
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
    "longitude": "-82.4857"
  },
  "telephone": "(740) 397-9632",
  "priceRange": "$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "08:00",
    "closes": "19:30"
  },
  "sameAs": [
    "https://www.facebook.com/share/1CtZugxSec/",
    "https://www.instagram.com/eastendtanning?igsh=aXBvbzJtaGIyM3dx",
    "https://www.yelp.com/biz/eastend-laundry-tanning-and-nutrition-mount-vernon",
    "https://www.google.com/maps/place/818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tanning Services 2026",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "VIP Monthly Unlimited Tanning",
          "description": "Unlimited tanning on all 6 bed levels with 3-month commitment"
        },
        "price": "39.99",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Matrix Bed Session",
          "description": "Single session on 40,740W Matrix bed - fastest, deepest tan"
        },
        "price": "23.99",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Red Light Therapy",
          "description": "Non-UV light therapy for skin health and SAD relief"
        }
      }
    ]
  },
  "servicesOffered": [
    "Level 1 Tanning Beds (3,840W)",
    "Level 2 Tanning Beds (5,000W)",
    "Level 3 High-Pressure Tanning Beds (10,750W)",
    "Level 4 Premium Tanning Beds (13,995W)",
    "Matrix Bed (40,740W) - Most Powerful in Knox County",
    "Stand-Up Tanning Bed (8,640W)",
    "Red Light Therapy for SAD & Skin Health",
    "Professional Tanning Lotions",
    "Free Skin Type Evaluations"
  ],
  "keywords": "best tanning salon near me, tanning salon near me, best tanning salon Mt Vernon Ohio, indoor tanning Knox County, SAD seasonal affective disorder, winter blues light therapy, vitamin D tanning",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "156",
    "bestRating": "5"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Mt Vernon",
      "containedInPlace": {
        "@type": "State",
        "name": "Ohio"
      }
    },
    {
      "@type": "AdministrativeArea",
      "name": "Knox County"
    }
  ]
};

export const laundryBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LaundryBusiness",
  "name": "Eastend Laundry",
  "description": "Coin laundry and wash-dry-fold services in Mt Vernon, Ohio with free drying every day",
  "image": "https://eastend.website/images/eastend-laundry.jpg",
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
    "longitude": "-82.4857"
  },
  "telephone": "(740) 397-9632",
  "priceRange": "$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "08:00",
    "closes": "19:30"
  },
  "sameAs": [
    "https://www.facebook.com/share/1CtZugxSec/",
    "https://www.instagram.com/eastendtanning?igsh=aXBvbzJtaGIyM3dx",
    "https://www.google.com/maps/place/818+Coshocton+Ave,+Mt+Vernon,+OH+43050"
  ],
  "servicesOffered": [
    "Coin Laundry - 20lb Washers ($4.50)",
    "Coin Laundry - 40lb Washers ($6.50)",
    "Coin Laundry - 60lb Washers ($7.50)",
    "Free Drying Every Day",
    "Wash-Dry-Fold Service"
  ]
};

export const westendLaundrySchema = {
  "@context": "https://schema.org",
  "@type": "LaundryBusiness",
  "name": "Westend Laundry",
  "description": "Lowest priced coin laundry in Mt Vernon, Ohio - 24/7 self-service laundromat",
  "image": "https://eastend.website/images/westend-laundry.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3024 Coshocton Rd",
    "addressLocality": "Mt Vernon",
    "addressRegion": "OH",
    "postalCode": "43050",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.3892",
    "longitude": "-82.5143"
  },
  "telephone": "(740) 397-9632",
  "priceRange": "$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/share/1C5G9Z4gi8/",
    "https://www.google.com/maps/place/3024+Coshocton+Rd,+Mt+Vernon,+OH+43050"
  ],
  "servicesOffered": [
    "24/7 Self-Service Coin Laundry",
    "Multiple Washer Sizes",
    "Dryers",
    "Lowest Prices in Mt Vernon"
  ]
};

export const foodEstablishmentSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "Fizze Drinks at Eastend",
  "description": "Bubble tea and smoothie bar in Mt Vernon, Ohio with 52+ flavors",
  "image": "https://eastend.website/images/fizze-drinks.jpg",
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
    "longitude": "-82.4857"
  },
  "telephone": "(740) 397-9632",
  "priceRange": "$",
  "servesCuisine": ["Bubble Tea", "Smoothies", "Drinks"],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "08:00",
    "closes": "19:30"
  },
  "sameAs": [
    "https://www.facebook.com/share/1AsxupQfG8/",
    "https://www.instagram.com/fizzedrinks"
  ]
};

export const createBlogPostingSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt || post.content?.substring(0, 160),
  "author": {
    "@type": "Organization",
    "name": "Eastend Tanning & Laundry"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Eastend Tanning & Laundry",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eastend.website/eastend-logo.jpg"
    }
  },
  "datePublished": post.created_at || post.date,
  "dateModified": post.updated_at || post.created_at || post.date,
  "image": post.featured_image || "https://eastend.website/images/blog-default.jpg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://eastend.website/blog/${post.slug}`
  }
});

export const createFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
