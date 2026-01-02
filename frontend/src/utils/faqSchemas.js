/**
 * FAQ Schemas for SEO and AEO (AI Engine Optimization)
 * Generates FAQPage structured data for each page
 */

export const generateFAQSchema = (faqs) => {
  return {
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
  };
};

// Home Page FAQs
export const homeFAQs = [
  {
    question: "What services does Eastend Tanning & Laundry offer?",
    answer: "Eastend offers professional tanning services with 6 bed levels including the exclusive Matrix bed, full-service laundromat with wash-dry-fold service, Fizze bubble tea drinks with 52+ flavors, premium tanning lotions, and red light therapy. We're your one-stop shop in Mt Vernon, OH."
  },
  {
    question: "Where is Eastend Tanning & Laundry located?",
    answer: "We're located at 818 Coshocton Ave, Mt Vernon, OH 43050. We serve Mt Vernon and surrounding areas including Knox County, Ohio."
  },
  {
    question: "What are your hours of operation?",
    answer: "Eastend is open daily from 8:00 AM to 7:30 PM, seven days a week. We're open every day to serve your tanning, laundry, and bubble tea needs."
  },
  {
    question: "Do you offer monthly unlimited tanning packages?",
    answer: "Yes! We offer Monthly Unlimited tanning packages starting at $59.99/month with no commitment. VIP packages with 3-month commitment start at $39.99/month. You can tan as often as you want on any of our 6 bed levels."
  },
  {
    question: "Can I order Fizze drinks online?",
    answer: "Yes! You can order Fizze bubble tea drinks online for pickup or delivery through our website. We have 52+ drink flavors including milk teas, fruit teas, blended ice drinks, and house specials."
  },
  {
    question: "Do you have wash and fold laundry service?",
    answer: "Yes! We offer full-service wash, dry, and fold laundry service. Drop off your laundry and we'll have it cleaned, dried, and folded for pickup. We also have self-service washers and dryers available."
  },
  {
    question: "What makes Eastend different from other tanning salons?",
    answer: "Eastend offers 6 tanning bed levels (vs competitors' 1-2), lower prices with VIP starting at $39.99/month, true unlimited tanning with no restrictions, premium equipment including the exclusive Matrix bed with 40,740 watts, and expert staff with free skin evaluations."
  }
];

// Tanning Page FAQs - Updated for 2026
export const tanningFAQs = [
  {
    question: "What is the best tanning salon near me in Mt Vernon Ohio?",
    answer: "Eastend Tanning at 818 Coshocton Ave is Mt Vernon's #1 rated tanning salon in 2026. We offer 6 tanning bed levels including the exclusive 40,740W Matrix bed, stand-up tanning, and red light therapy. Monthly unlimited packages start at just $39.99/month VIP. Open 7 days a week from 8AM-7:30PM. Call (740) 397-9632."
  },
  {
    question: "Can tanning help with Seasonal Affective Disorder (SAD) and winter blues?",
    answer: "Yes! Indoor tanning and light therapy can help combat SAD symptoms by providing UV light exposure that triggers vitamin D production and serotonin release. Many customers visit during Ohio's dark winter months (especially January-March) to boost their mood and energy levels. Our red light therapy beds also provide non-UV light that supports mental wellness. Always consult your doctor for medical advice about SAD."
  },
  {
    question: "How many tanning bed levels do you have?",
    answer: "We have 6 tanning bed levels: Level 1 (3,840W) for beginners at $5/session, Level 2 (5,000W) most popular at $8/session, Level 3 (10,750W) high-pressure at $10/session, Level 4 (13,995W) premium at $14.99/session, Stand Up (8,640W) at $11/session, and Matrix (40,740W) ultimate power at $23.99/session. All levels are included in monthly unlimited packages."
  },
  {
    question: "What is the Matrix tanning bed?",
    answer: "The Matrix is our exclusive ultra-premium tanning bed with 40,740 watts of power - the most powerful tanning bed in Knox County, Ohio. It delivers the fastest, deepest tan possible with professional-grade results. Single sessions are $23.99 or included in the VIP unlimited package at $169.99/month."
  },
  {
    question: "How much does monthly unlimited tanning cost in 2026?",
    answer: "Monthly Unlimited tanning ranges from $45.99-$194.99/month with no commitment. VIP Monthly Unlimited (3-month commitment) ranges from $39.99-$169.99/month for the best value. Prices vary by bed level, with Level 1 starting at $39.99 VIP and Matrix at $169.99 VIP. February is peak season - start now for spring break!"
  },
  {
    question: "Can I tan as often as I want with monthly unlimited?",
    answer: "Yes! Unlike gyms that limit your tanning, our monthly unlimited packages truly mean unlimited - tan as often as needed for real, lasting results. There are no restrictions or blackout dates."
  },
  {
    question: "Do you offer red light therapy for mood and skin?",
    answer: "Yes! We offer red light therapy which promotes skin health, reduces inflammation, enhances tanning results, and can help with mood during winter months. Red light therapy is a non-UV treatment that many customers use for overall wellness, especially during SAD season."
  },
  {
    question: "What tanning lotions do you sell?",
    answer: "We carry premium tanning lotions including brands with tanning accelerators, bronzers, and moisturizers. Our expert staff provides free skin evaluations and lotion recommendations based on your skin type and tanning goals."
  },
  {
    question: "Is there a stand-up tanning bed?",
    answer: "Yes! We have stand-up tanning beds (8,640W) at $11 per single session or $99.99/month VIP unlimited. Stand-up beds provide full-body coverage with no pressure points, perfect for even tanning."
  },
  {
    question: "When is the best time to start tanning in 2026?",
    answer: "February 2026 is peak tanning season! Start now to build your base tan before spring break and summer. Regular sessions during winter also help combat the winter blues and low vitamin D levels common in Ohio. Monthly unlimited is the best value for consistent results."
  }
];

// Drinks/Fizze Page FAQs
export const drinksFAQs = [
  {
    question: "How many Fizze drink flavors do you have?",
    answer: "We have 52+ delicious Fizze bubble tea flavors including milk teas, fruit teas, blended ice drinks, hot boba, house specials, dirty sodas, shakes, and specialty drinks. Plus customizable toppings like boba pearls, popping boba, and jelly."
  },
  {
    question: "Can I order Fizze drinks online for delivery?",
    answer: "Yes! You can order Fizze drinks online through our website for pickup or delivery in Mt Vernon, OH. Choose from our full menu of 52+ drinks and customize with your favorite toppings."
  },
  {
    question: "What are the most popular Fizze drinks?",
    answer: "Our top sellers include Classic Milk Tea, Taro Milk Tea, Brown Sugar Boba Milk Tea, Strawberry Fruit Tea, Mango Smoothie, Thai Tea, and our house special Cotton Candy Dream. All drinks can be customized with ice and sweetness levels."
  },
  {
    question: "Do you have dairy-free or vegan drink options?",
    answer: "Yes! Many of our fruit teas and specialty drinks can be made dairy-free. We also offer alternative milk options. Just let us know your dietary preferences when ordering."
  },
  {
    question: "What is boba (bubble tea)?",
    answer: "Boba, also called bubble tea, is a Taiwanese tea-based drink with chewy tapioca pearls (boba) at the bottom. You can enjoy it hot or cold with various flavors, toppings, and sweetness levels. It's a fun, refreshing drink experience!"
  },
  {
    question: "How much do Fizze drinks cost?",
    answer: "Most Fizze drinks range from $5-$7 depending on size and toppings. We offer regular and large sizes, and you can add premium toppings like popping boba, cheese foam, or extra pearls for a small additional charge."
  },
  {
    question: "Can I customize my Fizze drink?",
    answer: "Absolutely! Customize your drink's sweetness level (0-100%), ice amount (no ice, light, regular, extra), and add toppings like tapioca pearls, popping boba, lychee jelly, mango jelly, or cheese foam. Make it exactly how you like it!"
  }
];

// Laundry Page FAQs
export const laundryFAQs = [
  {
    question: "Do you offer wash and fold service?",
    answer: "Yes! Our full-service wash, dry, and fold service makes laundry effortless. Drop off your laundry, and we'll wash, dry, and neatly fold everything for pickup. Pricing is typically by the pound - ask staff for current rates."
  },
  {
    question: "What size washers and dryers do you have?",
    answer: "We have multiple washer and dryer sizes to handle any load: regular washers for everyday loads, large-capacity washers for comforters and blankets, and extra-large washers for bulky items like sleeping bags and large comforters."
  },
  {
    question: "Are your washers and dryers coin-operated?",
    answer: "Our machines accept coins, bills, and card payments for your convenience. We also have a change machine on-site."
  },
  {
    question: "How long does a typical wash cycle take?",
    answer: "Wash cycles typically take 25-35 minutes depending on machine size. Dryer cycles take 30-45 minutes depending on load size and wetness. You can usually complete your laundry in about 60-90 minutes."
  },
  {
    question: "Do you sell laundry detergent and supplies?",
    answer: "Yes! We sell single-use detergent packets, fabric softener, dryer sheets, and stain removers at our vending area. Forgot your supplies? We've got you covered!"
  },
  {
    question: "Can I drop off dry cleaning?",
    answer: "We offer wash and fold service for regular laundry. For dry cleaning, please call us at (740) 397-9632 to discuss your specific needs and we can recommend options."
  },
  {
    question: "Is there WiFi and seating while I wait?",
    answer: "Yes! We offer free WiFi, comfortable seating, and a clean, well-lit environment. Many customers enjoy getting a Fizze drink from our bubble tea bar while waiting for their laundry!"
  }
];

// Contact Page FAQs
export const contactFAQs = [
  {
    question: "How can I contact Eastend Tanning & Laundry?",
    answer: "Call us at (740) 397-9632, visit us at 818 Coshocton Ave, Mt Vernon, OH 43050, or use the contact form on our website. We're available during business hours: 8:00 AM - 7:30 PM daily."
  },
  {
    question: "Do I need an appointment for tanning?",
    answer: "No appointment necessary! We operate on a walk-in basis for all tanning services. If you have questions about which bed is right for you, call ahead and our staff can provide guidance."
  },
  {
    question: "How do I apply for a job at Eastend?",
    answer: "We're always looking for friendly, reliable team members! Call us at (740) 397-9632 or visit in person at 818 Coshocton Ave to inquire about current job openings and submit an application."
  },
  {
    question: "Do you have a second location?",
    answer: "Currently, we have one location at 818 Coshocton Ave in Mt Vernon, OH. This is our flagship store offering tanning, laundry, and Fizze drinks all under one roof."
  },
  {
    question: "Are you on social media?",
    answer: "Yes! Follow us on Facebook, Instagram, and TikTok for deals, updates, and new Fizze drink flavors. Search for 'Eastend Tanning & Laundry' or 'Eastend Mt Vernon' to find and follow us."
  }
];

// Generate all FAQ schemas
export const allFAQSchemas = {
  home: generateFAQSchema(homeFAQs),
  tanning: generateFAQSchema(tanningFAQs),
  drinks: generateFAQSchema(drinksFAQs),
  laundry: generateFAQSchema(laundryFAQs),
  contact: generateFAQSchema(contactFAQs)
};
