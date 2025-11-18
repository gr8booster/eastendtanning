/**
 * Comprehensive Structured Data for SEO & AEO
 * Includes LocalBusiness, TanningSalon, LaundryService, and more
 */

// Base organization data
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TanningSalon", "Laundromat"],
  "@id": "https://eastend.website/#organization",
  "name": "Eastend Tanning & Laundry",
  "alternateName": "Eastend Mt Vernon",
  "description": "Premier tanning salon, laundromat, and Fizze bubble tea in Mt Vernon, OH. Offering 6 tanning bed levels including Matrix, wash-dry-fold laundry service, and 52+ bubble tea flavors.",
  "url": "https://eastend.website",
  "logo": "https://eastend.website/logo.png",
  "image": [
    "https://eastend.website/images/tanning-beds.jpg",
    "https://eastend.website/images/fizze-drinks.jpg",
    "https://eastend.website/images/laundry-services.jpg"
  ],
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
  "priceRange": "$$",
  "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
  "currenciesAccepted": "USD",
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
    "https://www.instagram.com/eastendmtvernon",
    "https://www.tiktok.com/@eastendmtvernon"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
};

// Tanning Salon specific schema
export const tanningSalonSchema = {
  "@context": "https://schema.org",
  "@type": "TanningSalon",
  "@id": "https://eastend.website/tanning#service",
  "name": "Eastend Tanning Studio",
  "provider": {
    "@id": "https://eastend.website/#organization"
  },
  "serviceType": "Tanning Services",
  "description": "Professional tanning salon with 6 bed levels including Matrix (40,740W), stand-up beds, and red light therapy. Monthly unlimited packages starting at $39.99. True unlimited tanning - no restrictions.",
  "areaServed": "Mt Vernon, OH",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Tanning Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Level 1 Tanning - VIP Unlimited",
          "description": "Beginner-friendly 3,840W bed, perfect for fair skin and maintaining base tan"
        },
        "price": "39.99",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "39.99",
          "priceCurrency": "USD",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitText": "MONTH"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Matrix Tanning Bed - VIP Unlimited",
          "description": "Exclusive 40,740W ultra-premium tanning bed - fastest, deepest tan possible"
        },
        "price": "169.99",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "169.99",
          "priceCurrency": "USD",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitText": "MONTH"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Single Tanning Session",
          "description": "Pay-as-you-go tanning sessions on any bed level"
        },
        "price": "5.00",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": "5.00",
          "maxPrice": "23.99",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "10 Session Package",
          "description": "Save 10% with a 10-session package on your choice of bed level"
        },
        "price": "38.99",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": "38.99",
          "maxPrice": "194.99",
          "priceCurrency": "USD"
        }
      }
    ]
  }
};

// Laundry Service schema
export const laundryServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Laundromat",
  "@id": "https://eastend.website/laundry#service",
  "name": "Eastend Laundromat",
  "provider": {
    "@id": "https://eastend.website/#organization"
  },
  "serviceType": "Laundry Services",
  "description": "Full-service laundromat with wash-dry-fold service, self-service washers and dryers in multiple sizes. Clean, comfortable facility with WiFi and seating.",
  "areaServed": "Mt Vernon, OH",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Laundry Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Wash, Dry, and Fold Service",
          "description": "Full-service laundry - drop off dirty, pick up clean and folded"
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
    ]
  }
};

// FoodEstablishment schema for Fizze Drinks
export const fizzeDrinksSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "@id": "https://eastend.website/drinks#service",
  "name": "Fizze Bubble Tea Bar at Eastend",
  "provider": {
    "@id": "https://eastend.website/#organization"
  },
  "servesCuisine": "Bubble Tea",
  "description": "52+ flavors of Fizze bubble tea including milk teas, fruit teas, blended ice drinks, and house specials. Order online for pickup or delivery.",
  "acceptsReservations": "False",
  "menu": "https://eastend.website/drinks",
  "hasMenu": {
    "@type": "Menu",
    "@id": "https://eastend.website/drinks#menu",
    "name": "Fizze Drinks Menu",
    "description": "Complete bubble tea menu with 52+ flavors"
  }
};

// WebSite schema for site-wide search
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://eastend.website/#website",
  "url": "https://eastend.website",
  "name": "Eastend Tanning & Laundry",
  "description": "Tanning salon, laundromat, and Fizze bubble tea in Mt Vernon, OH",
  "publisher": {
    "@id": "https://eastend.website/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://eastend.website/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Breadcrumb schema generator
export const generateBreadcrumb = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://eastend.website${item.path}`
    }))
  };
};

// Product schema for tanning lotions
export const generateProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `Premium tanning lotion - ${product.name}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Professional Tanning Products"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://eastend.website/lotions",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@id": "https://eastend.website/#organization"
      }
    }
  };
};

export default {
  organizationSchema,
  tanningSalonSchema,
  laundryServiceSchema,
  fizzeDrinksSchema,
  websiteSchema,
  generateBreadcrumb,
  generateProductSchema
};
