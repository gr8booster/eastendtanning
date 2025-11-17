// MenuItem Schema Generator for all Fizze Drinks
// Generates structured data for SEO

export const generateDrinksMenuSchema = (drinks) => {
  if (!drinks || Object.keys(drinks).length === 0) return null;

  const menuItems = [];

  Object.entries(drinks).forEach(([category, items]) => {
    items.forEach(drink => {
      menuItems.push({
        "@type": "MenuItem",
        "name": drink.name,
        "description": drink.flavor_profile || drink.description || `Delicious ${drink.name} from Fizze Drinks`,
        "offers": {
          "@type": "Offer",
          "price": drink.price || "6.99",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://eastend.website/drinks"
        },
        "nutrition": {
          "@type": "NutritionInformation",
          "servingSize": drink.size || "24 oz"
        },
        "suitableForDiet": drink.category === "Fruit Teas" ? "https://schema.org/VeganDiet" : undefined
      });
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "Fizze Drinks Menu",
    "description": "Complete menu of bubble tea, milk teas, fruit teas, smoothies, and specialty drinks at Eastend Tanning & Laundry, Mt Vernon, OH",
    "hasMenuSection": Object.entries(drinks).map(([category, items]) => ({
      "@type": "MenuSection",
      "name": category,
      "hasMenuItem": items.map(drink => ({
        "@type": "MenuItem",
        "name": drink.name,
        "description": drink.flavor_profile || drink.description,
        "offers": {
          "@type": "Offer",
          "price": drink.price || "6.99",
          "priceCurrency": "USD"
        }
      }))
    })),
    "inLanguage": "en-US"
  };
};

export const generateFoodEstablishmentSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Fizze Drinks at Eastend Tanning & Laundry",
    "image": "https://eastend.website/images/fizze-drinks.jpg",
    "@id": "https://eastend.website/drinks",
    "url": "https://eastend.website/drinks",
    "telephone": "+17404071084",
    "priceRange": "$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "818 Coshocton Ave",
      "addressLocality": "Mt Vernon",
      "addressRegion": "OH",
      "postalCode": "43050",
      "addressCountry": "US"
    },
    "servesCuisine": ["Bubble Tea", "Smoothies", "Beverages"],
    "hasMenu": "https://eastend.website/drinks",
    "acceptsReservations": "False"
  };
};
