/**
 * Individual Business Structured Data Schemas
 * Each business has its own LocalBusiness schema with complete NAP (Name, Address, Phone)
 * Optimized for SEO/AEO discovery and indexing
 */

// 1. EASTEND TANNING - Tanning Salon
export const eastendTanningSchema = {
  "@context": "https://schema.org",
  "@type": "TanningSalon",
  "@id": "https://eastend.website/tanning#business",
  "name": "Eastend Tanning",
  "alternateName": "Eastend Tanning Studio",
  "description": "Professional tanning salon in Mt Vernon, OH featuring 6 tanning bed levels including the exclusive Matrix 40,740W bed, stand-up beds, and red light therapy. Monthly unlimited packages starting at $39.99 with no restrictions.",
  "url": "https://eastend.website/tanning",
  "telephone": "+17403979632",
  "email": "tanning@eastend.website",
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
  "priceRange": "$39.99-$169.99",
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 1 VIP Unlimited Tanning",
        "description": "Entry-level 3,840W bed, perfect for beginners and fair skin"
      },
      "price": "39.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 2 VIP Unlimited Tanning",
        "description": "Mid-tier 7,680W bed with enhanced UV power"
      },
      "price": "59.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 3 VIP Unlimited Tanning",
        "description": "Advanced 15,360W bed for deeper, faster tans"
      },
      "price": "79.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Level 4 Stand-Up VIP Unlimited",
        "description": "High-powered 30,720W stand-up bed, no pressure points"
      },
      "price": "119.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Matrix VIP Unlimited Tanning",
        "description": "Exclusive ultra-premium 40,740W bed - fastest, deepest tan available"
      },
      "price": "169.99",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Red Light Therapy VIP Unlimited",
        "description": "Collagen-boosting red light therapy for skin rejuvenation and anti-aging"
      },
      "price": "64.99",
      "priceCurrency": "USD"
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

// 2. EASTEND LAUNDRY - Laundromat
export const eastendLaundrySchema = {
  "@context": "https://schema.org",
  "@type": "Laundromat",
  "@id": "https://eastend.website/laundry#business",
  "name": "Eastend Laundry",
  "alternateName": "Eastend Laundromat",
  "description": "Full-service laundromat in Mt Vernon, OH with wash-dry-fold service, self-service washers and dryers in multiple sizes. Clean, modern facility with free WiFi, comfortable seating, and always open.",
  "url": "https://eastend.website/laundry",
  "telephone": "+17403979632",
  "email": "laundry@eastend.website",
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
  "paymentAccepted": ["Cash", "Credit Card", "Coins"],
  "currenciesAccepted": "USD",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Comfortable Seating",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free Drying Daily",
      "value": true
    }
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Wash, Dry, and Fold Service",
        "description": "Full-service laundry - drop off dirty clothes, pick up clean and perfectly folded"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Self-Service Washers",
        "description": "Multiple washer sizes including large-capacity for comforters and bulky items"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Self-Service Dryers",
        "description": "High-efficiency dryers in various sizes"
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

// 3. FIZZE DRINKS - Bubble Tea Shop
export const fizzeDrinksSchema = {
  "@context": "https://schema.org",
  "@type": ["FoodEstablishment", "CafeOrCoffeeShop"],
  "@id": "https://eastend.website/drinks#business",
  "name": "Fizze Drinks",
  "alternateName": "Fizze Bubble Tea Bar",
  "description": "Premium bubble tea and specialty drink shop in Mt Vernon, OH featuring 52+ handcrafted flavors including milk teas, fruit teas, blended ice drinks, dirty sodas, protein shakes, and house specials. Fresh ingredients, customizable sweetness and ice levels. Order online for quick pickup.",
  "url": "https://eastend.website/drinks",
  "telephone": "+17403979632",
  "email": "fizze@eastend.website",
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
  "servesCuisine": ["Bubble Tea", "Milk Tea", "Fruit Tea", "Smoothies"],
  "priceRange": "$6.49-$8.99",
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "acceptsReservations": "False",
  "menu": "https://eastend.website/drinks",
  "hasMenu": {
    "@type": "Menu",
    "@id": "https://eastend.website/drinks#menu",
    "name": "Fizze Drinks Complete Menu",
    "description": "52+ bubble tea flavors including milk teas, fruit teas, blended ice, dirty sodas, and more",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Milk Teas & Bubble Tea",
        "description": "Authentic bubble tea with tapioca pearls, 6 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Fruit Teas",
        "description": "Refreshing fruit-infused teas, 16 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Blended Ice",
        "description": "Frozen blended drinks, 8 flavors from $6.99"
      },
      {
        "@type": "MenuSection",
        "name": "House Specials",
        "description": "Signature Fizze creations, 7 flavors from $6.99"
      },
      {
        "@type": "MenuSection",
        "name": "Dirty Sodas",
        "description": "Flavor-infused sodas with cream, 8 flavors from $6.49"
      },
      {
        "@type": "MenuSection",
        "name": "Protein Shakes",
        "description": "Protein-packed smoothies, 4 flavors at $8.99"
      }
    ]
  },
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

// 4. FAST NAILS - Nail Salon
export const fastNailsSchema = {
  "@context": "https://schema.org",
  "@type": "NailSalon",
  "@id": "https://eastend.website/nails#business",
  "name": "Fast Nails",
  "alternateName": "Fast Nails at Eastend",
  "description": "Professional nail salon in Mt Vernon, OH offering manicures, pedicures, gel nails, acrylic nails, nail art, and spa services. Walk-ins welcome or book your appointment online.",
  "url": "https://eastend.website/nails",
  "telephone": "+17403979632",
  "email": "nails@eastend.website",
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
  "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
  "currenciesAccepted": "USD",
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Manicure",
        "description": "Professional manicure with nail shaping, cuticle care, and polish"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Pedicure",
        "description": "Relaxing pedicure with foot soak, exfoliation, massage, and polish"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Gel Nails",
        "description": "Long-lasting gel manicure or pedicure with UV curing"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Acrylic Nails",
        "description": "Durable acrylic nail extensions in any length and shape"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Nail Art & Design",
        "description": "Custom nail art, designs, and decorative nail services"
      }
    }
  ],
  "areaServed": {
    "@type": "City",
    "name": "Mt Vernon",
    "containedInPlace": {
      "@type": "State",
      "name": "Ohio"
    }
  },
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

// 5. PEOPLE OF EASTEND - Blog
export const peopleOfEastendSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://eastend.website/blog#website",
  "name": "People of Eastend",
  "alternateName": "People of Eastend Blog",
  "description": "Community blog featuring stories, tips, and updates from Eastend Tanning & Laundry in Mt Vernon, OH. Tanning tips, laundry hacks, drink recipes, beauty advice, and local community spotlights.",
  "url": "https://eastend.website/blog",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "Eastend Tanning & Laundry",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eastend.website/logo.png"
    },
    "url": "https://eastend.website",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mt Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "telephone": "+17403979632",
    "email": "blog@eastend.website"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "Tanning Tips",
      "description": "Professional tanning advice and skin care tips"
    },
    {
      "@type": "Thing",
      "name": "Beauty & Wellness",
      "description": "Beauty tips, nail care, and wellness advice"
    },
    {
      "@type": "Thing",
      "name": "Community Stories",
      "description": "Local Mt Vernon community spotlights and stories"
    },
    {
      "@type": "Thing",
      "name": "Drink Recipes",
      "description": "Fizze drink recipes and customization ideas"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

// 6. MAIN ORGANIZATION - Parent Company
export const eastendOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://eastend.website/#organization",
  "name": "Eastend Tanning & Laundry",
  "alternateName": "Eastend Mt Vernon",
  "description": "Multi-service business in Mt Vernon, OH featuring Eastend Tanning (tanning salon), Eastend Laundry (laundromat), Fizze Drinks (bubble tea), Fast Nails (nail salon), and 818 Food Truck Stop.",
  "url": "https://eastend.website",
  "logo": "https://eastend.website/logo.png",
  "telephone": "+17403979632",
  "email": "info@eastend.website",
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
  "department": [
    { "@id": "https://eastend.website/tanning#business" },
    { "@id": "https://eastend.website/laundry#business" },
    { "@id": "https://eastend.website/drinks#business" },
    { "@id": "https://eastend.website/nails#business" }
  ],
  "sameAs": [
    "https://www.facebook.com/EastendTanningLaundry",
    "https://www.instagram.com/eastendtanning/",
    "https://www.tiktok.com/@peopleofeastend"
  ]
};

export default {
  eastendTanningSchema,
  eastendLaundrySchema,
  fizzeDrinksSchema,
  fastNailsSchema,
  peopleOfEastendSchema,
  eastendOrganizationSchema
};
