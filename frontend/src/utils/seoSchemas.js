// Comprehensive Schema.org markup for SEO/AEO

export const tanningSalonSchema = {
  "@context": "https://schema.org",
  "@type": "TanningSalon",
  "name": "Eastend Tanning & Laundry",
  "description": "Professional tanning salon in Mt Vernon, Ohio offering 6 bed levels including Matrix Bed, Stand-Up tanning, and red light therapy",
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
  "serv icesOffered": [
    "Level 1 Tanning Beds",
    "Level 2 Tanning Beds",
    "Level 3 Tanning Beds",
    "Level 4 High-Power Tanning Beds",
    "Matrix Bed (40,740W)",
    "Stand-Up Tanning Bed",
    "Red Light Therapy"
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
    "https://www.facebook.com/profile.php?id=100063538993608",
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
    "https://www.facebook.com/profile.php?id=100063538993608"
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
