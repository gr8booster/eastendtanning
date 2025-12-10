// Static HTML fallback for SEO/AEO - visible even without JavaScript

export const StaticFallback = ({ page }) => {
  const content = {
    home: {
      h1: "Eastend Tanning & Laundry - Mt Vernon, Ohio",
      paragraphs: [
        "Professional tanning salon and coin laundry located at 818 Coshocton Ave, Mt Vernon, OH 43050. Serving Knox County with premium tanning beds, red light therapy, and affordable laundry services since 1998.",
        "Tanning Services: 6 bed levels including Level 1-4 beds, Matrix Bed (40,740W), Stand-Up tanning bed, and red light therapy. Monthly unlimited packages starting at $60. Black Friday BOGO deals available.",
        "Laundry Services: Coin-operated washers (20lb $4.50, 40lb $6.50, 60lb $7.50) with FREE DRYING EVERY DAY. Wash-dry-fold service available. Clean, well-maintained facility with ample parking."
      ],
      services: "Tanning Beds, Matrix Bed, Stand-Up Tanning, Red Light Therapy, Coin Laundry, Wash-Dry-Fold, Fizze Bubble Tea",
      hours: "Monday-Sunday: 8:00 AM - 7:30 PM",
      phone: "(740) 397-9632",
      address: "818 Coshocton Ave, Mt Vernon, OH 43050",
      parking: "Large parking lot behind building with front-door parking available",
      directions: "Located 2 minutes from OSU Knox Campus on Coshocton Avenue"
    },
    tanning: {
      h1: "Best Tanning Salon Mt Vernon Ohio - 6 Bed Levels | Eastend Tanning",
      paragraphs: [
        "Eastend Tanning offers the best tanning beds in Mt Vernon, Ohio with 6 power levels to match your skin type and tanning goals. From beginner-friendly Level 1 beds to our high-powered Matrix Bed (40,740W), we have the perfect tanning solution for fast, beautiful results.",
        "Tanning Packages: Single sessions start at $12. Monthly unlimited packages from $60 (Level 2) to $194.99 (Matrix Bed). VIP unlimited memberships available. Black Friday BOGO: Buy 1 package, get 2nd FREE with $5 pass.",
        "Red Light Therapy available in Level 4 and Stand-Up beds for anti-aging, skin rejuvenation, and muscle recovery. Clean beds, maintained daily, with premium lotions available for purchase."
      ],
      services: "Level 1-4 Tanning Beds, Matrix Bed 40,740W, Stand-Up Tanning, Red Light Therapy, Monthly Unlimited, VIP Memberships, Single Sessions",
      hours: "Monday-Sunday: 8:00 AM - 7:30 PM",
      phone: "(740) 397-9632",
      address: "818 Coshocton Ave, Mt Vernon, OH 43050",
      parking: "Free parking lot behind building, wheelchair accessible entrance",
      directions: "On Coshocton Avenue, 2 minutes from OSU Knox Campus, near Walmart"
    },
    laundry: {
      h1: "Coin Laundry Mt Vernon OH - Wash Dry Fold Service | Eastend Laundry",
      paragraphs: [
        "Eastend Laundry provides clean, affordable coin laundry services in Mt Vernon, Ohio at 818 Coshocton Ave. Large capacity washers and FREE DRYING EVERY DAY make us the best value for your laundry needs.",
        "Washer Pricing: 20lb washers $4.50, 40lb washers $6.50, 60lb washers $7.50. All dryers are FREE every single day. Wash-dry-fold service available for busy families and professionals.",
        "Clean, well-lit facility with ample parking. Attendant on duty during business hours. Credit card and coin-operated machines available. Open 7 days a week."
      ],
      services: "Coin Laundry, 20lb-60lb Washers, Free Drying Every Day, Wash-Dry-Fold Service, Credit Card Machines",
      hours: "Monday-Sunday: 8:00 AM - 7:30 PM",
      phone: "(740) 397-9632",
      address: "818 Coshocton Ave, Mt Vernon, OH 43050",
      parking: "Large lot behind building, easy load/unload access",
      directions: "Coshocton Avenue near downtown Mt Vernon, across from Ariel Foundation Park"
    },
    westend: {
      h1: "Westend Laundry - 24/7 Coin Laundry Mt Vernon Ohio - Lowest Prices",
      paragraphs: [
        "Westend Laundry offers the LOWEST laundry prices in Mt Vernon, Ohio with 24/7 self-service coin laundry at 3024 Coshocton Rd. Always open, always clean, always affordable.",
        "Our Westend location provides multiple washer sizes and dryers for your convenience, all at the best prices in Knox County. No attendant needed - fully self-service laundromat available any time, day or night.",
        "Safe, well-lit facility with security cameras. Plenty of parking. Close to residential neighborhoods for quick laundry runs any time you need."
      ],
      services: "24/7 Self-Service Coin Laundry, Multiple Washer Sizes, Dryers, Lowest Prices in Mt Vernon",
      hours: "Open 24/7 - Always Available",
      phone: "(740) 397-9632",
      address: "3024 Coshocton Rd, Mt Vernon, OH 43050",
      parking: "Free parking lot, well-lit for safety",
      directions: "Coshocton Road, west side of Mt Vernon, near residential area"
    },
    drinks: {
      h1: "Fizze Bubble Tea & Drinks Mt Vernon OH - 52+ Flavors | Eastend",
      paragraphs: [
        "Fizze Drinks at Eastend offers bubble tea, smoothies, and refreshing beverages in Mt Vernon, Ohio. With 52+ flavors and endless customization options, Fizze is your go-to refresh stop at 818 Coshocton Ave.",
        "Popular drinks include Mango Passion Fruit, Strawberry Burst, Classic Milk Tea, and Thai Tea. Customize sweetness level, ice amount, and add toppings like boba pearls, popping boba, or jelly. All drinks made fresh to order.",
        "Online ordering available for pickup or delivery. Perfect for a post-tanning refreshment or while waiting for laundry. Family-friendly menu with options for all ages."
      ],
      services: "Bubble Tea, Smoothies, Milk Tea, Fruit Teas, Custom Drinks, Online Ordering, Pickup & Delivery",
      hours: "Monday-Sunday: 8:00 AM - 7:30 PM",
      phone: "(740) 397-9632",
      address: "818 Coshocton Ave (inside Eastend Tanning & Laundry), Mt Vernon, OH 43050",
      parking: "Shared parking with Eastend Tanning & Laundry",
      directions: "Inside Eastend facility on Coshocton Avenue"
    },
    blog: {
      h1: "Eastend Blog - Tanning Tips & Local Stories | Mt Vernon OH",
      paragraphs: [
        "The Eastend Blog features tanning tips, laundry guides, local Mt Vernon stories, and community highlights. Learn about proper tanning techniques, skin care, laundry hacks, and meet the people who make Knox County special.",
        "Popular topics include 'People of Eastend' featuring local residents, tanning safety guides, red light therapy benefits, and seasonal tips for maintaining your tan year-round.",
        "New articles published weekly. Follow us for expert advice from our experienced staff and stories from our Mt Vernon community."
      ],
      services: "Blog Articles, Tanning Tips, Laundry Guides, Community Stories, Local Business Features",
      hours: "Monday-Sunday: 8:00 AM - 7:30 PM (Main Location)",
      phone: "(740) 397-9632",
      address: "818 Coshocton Ave, Mt Vernon, OH 43050",
      parking: "N/A - Online Blog",
      directions: "Visit us online at eastend.website/blog"
    }
  };

  const data = content[page] || content.home;

  return (
    <>
      {/* Noscript fallback - always visible to crawlers */}
      <noscript>
        <div className="seo-fallback" style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
          <h1>{data.h1}</h1>
          {data.paragraphs.map((p, i) => (
            <p key={i} style={{marginBottom: '16px', lineHeight: '1.6'}}>{p}</p>
          ))}
          <div style={{marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
            <p><strong>Services:</strong> {data.services}</p>
            <p><strong>Hours:</strong> {data.hours}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Parking:</strong> {data.parking}</p>
            <p><strong>Directions:</strong> {data.directions}</p>
          </div>
        </div>
      </noscript>

      {/* Hidden but crawlable fallback for JS-enabled browsers */}
      <div className="seo-fallback-hidden" style={{position: 'absolute', left: '-9999px', top: '0'}}>
        <h1>{data.h1}</h1>
        {data.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div>
          <p>Services: {data.services}</p>
          <p>Hours: {data.hours}</p>
          <p>Phone: {data.phone}</p>
          <p>Address: {data.address}</p>
          <p>Parking: {data.parking}</p>
          <p>Directions: {data.directions}</p>
        </div>
      </div>
    </>
  );
};
