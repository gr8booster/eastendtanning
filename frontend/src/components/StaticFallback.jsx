// Static HTML fallback for SEO/AEO - visible even without JavaScript
// Business Identity: Eastend is a TANNING-CENTERED multi-service local hub
// Tanning = Primary anchor service | Laundry, Drinks, Nails, Food = Complementary services
// Location Separation: Eastend (full services) vs Westend (laundry only)

export const StaticFallback = ({ page }) => {
  const content = {
    home: {
      h1: "Eastend Tanning & Laundry - Mt Vernon Ohio's Tanning-Centered Neighborhood Hub",
      intro: "Eastend is a tanning-centered local service hub at 818 Coshocton Ave in Mt Vernon, Ohio. Since 1998, indoor tanning has been our primary service and the reason most customers discover us. Over the years, we've added complementary services—coin laundry with free drying, Fizze bubble tea drinks, Fast Nails, and 818 Food Truck Stop—so our tanning customers can combine self-care and errands in a single visit. This isn't a gym with tanning as an afterthought. This is a tanning studio with smart additions that make your visit more convenient.",
      sections: [
        {
          h2: "Why is Eastend known for tanning?",
          content: "Tanning is what we do best. It's our anchor service, our specialty, and the main reason customers find us. We operate 6 professional-grade tanning beds, including the 40,740-watt Matrix—the most powerful tanning bed in Knox County. Our staff is trained specifically in skin type analysis, bed selection, and tanning optimization. We've perfected indoor tanning over 26 years, serving everyone from first-timers preparing for weddings to experienced tanners maintaining their year-round glow. When people search for 'best tanning salon near me' in Mt Vernon, they find Eastend because tanning is our core identity."
        },
        {
          h2: "What other services does Eastend offer?",
          content: "While tanning is our primary service, we've intentionally added complementary services that make sense for our customers: EASTEND LAUNDRY offers coin-operated washers with FREE drying every day—the only laundromat in Mt Vernon with this deal. Many customers start their laundry, tan during the wash cycle, then return to fold. FIZZE DRINKS serves 52+ flavors of fresh bubble tea, milk tea, and smoothies—perfect for post-tanning refreshment. FAST NAILS provides quick, affordable manicures and pedicures—add a 20-minute manicure while your laundry dries. 818 FOOD TRUCK STOP connects Knox County with local food trucks and our own 818 EATS African cuisine delivery. These services exist because our tanning customers asked for them. They're designed to work together, turning Eastend into a one-stop destination for self-care and errands."
        },
        {
          h2: "How do customers typically use Eastend?",
          content: "The most common pattern: arrive, start a load of laundry, tan during the wash cycle (sessions are 10-20 minutes), grab a bubble tea, then fold your dry clothes (dryers are free). What would be three separate trips—laundromat, tanning salon, drink shop—becomes one efficient, enjoyable visit. Other customers come purely for tanning and discover the convenience of the other services. Some come for laundry and discover tanning. The complementary services create a hub where different needs overlap, but tanning remains the anchor that defines who we are."
        },
        {
          h2: "Who comes to Eastend for tanning?",
          content: "Our tanning customers include: people preparing for weddings, vacations, proms, and special events who want a base tan; maintenance tanners who visit weekly to keep their glow year-round; seasonal tanners who come during Ohio's gray winters for vitamin D and mood benefits (we have many customers who tan specifically for SAD relief); first-time tanners who've never used a tanning bed and need guidance on skin types and bed selection; experienced tanners who know exactly what they want and trust our professional-grade equipment. Tanning is for anyone who wants to look and feel their best, and we serve all experience levels."
        },
        {
          h2: "Where is Eastend located?",
          content: "EASTEND (Main Location): 818 Coshocton Ave, Mt Vernon, OH 43050. This is our full-service hub with tanning, laundry, drinks, nails, and food truck stop. Open Monday-Sunday, 8:00 AM - 7:30 PM. Phone: (740) 397-9632. Large free parking lot behind the building with front-door access. About 2 minutes from OSU Knox Campus. NOTE: We also operate WESTEND LAUNDRY at 3024 Coshocton Rd—a separate laundry-only location open 24/7. Westend does NOT offer tanning or other services. See /westend-laundry for details."
        }
      ],
      internalLinks: [
        { url: "/tanning", text: "Explore our tanning services (primary)" },
        { url: "/laundry", text: "Eastend Laundry with free drying" },
        { url: "/drinks", text: "Fizze bubble tea drinks" },
        { url: "/fast-nails", text: "Fast Nails services" },
        { url: "/food-truck-stop", text: "818 Food Truck Stop" },
        { url: "/westend-laundry", text: "Westend Laundry (24/7, laundry only)" },
        { url: "/people-of-eastend", text: "Stories from our customers" }
      ]
    },

    tanning: {
      h1: "Indoor Tanning at Eastend - Mt Vernon Ohio's Premier Tanning Studio Since 1998",
      intro: "Tanning is what Eastend does best. As our primary service and core identity, we've invested 26 years in perfecting indoor tanning for Knox County residents. Unlike gyms that treat tanning as an afterthought, we are tanning specialists with professional-grade equipment, trained staff, and deep expertise in helping you achieve your tanning goals safely and effectively. This is why people searching for 'best tanning salon near me' find Eastend.",
      sections: [
        {
          h2: "What tanning beds does Eastend offer?",
          content: "We operate 6 distinct tanning bed levels, more options than any facility in Knox County: LEVEL 1 (3,840W, $5/session) - Entry-level bed perfect for beginners or light maintenance. Gentle UV output for those new to indoor tanning. LEVEL 2 (5,000W, $8/session) - Our most popular bed. Balanced UV output for regular tanners building and maintaining color. LEVEL 3 (10,750W, $10/session) - High-pressure tanning for faster results. Popular with experienced tanners seeking deeper color in fewer sessions. LEVEL 4 (13,995W, $14.99/session) - Premium bed with integrated red light therapy panels. Combines tanning with anti-aging and skin health benefits. STAND-UP (8,640W, $11/session) - 360-degree UV exposure for even, streak-free coverage. No lying down, no pressure points. MATRIX (40,740W, $23.99/session) - The most powerful tanning bed in Knox County. For experienced tanners seeking the deepest, fastest tan possible. Professional-grade equipment reserved for those with established base tans."
        },
        {
          h2: "How much does monthly unlimited tanning cost?",
          content: "Monthly unlimited packages let you tan as often as recommended for your skin type. VIP rates (3-month commitment): Level 1 $39.99/month, Level 2 $60/month, Level 3 $95/month, Level 4 $109.99/month, Stand-Up $79.99/month, Matrix $169.99/month. Regular monthly rates are slightly higher. No blackout dates, no restrictions—just unlimited access to your chosen bed level. Most customers find unlimited packages more economical than per-session pricing if they tan twice weekly or more."
        },
        {
          h2: "Who is indoor tanning for?",
          content: "Indoor tanning serves diverse needs: EVENT PREPARATION - Weddings, proms, vacations, reunions, photo shoots. Building a base tan 4-6 weeks before your event ensures you look your best without last-minute burning. YEAR-ROUND MAINTENANCE - Many customers maintain a consistent tan throughout the year, visiting 1-3 times weekly depending on skin type and goals. SEASONAL/WINTER USE - Ohio winters are gray. Many customers tan specifically during winter months for vitamin D production and mood support. We hear frequently that tanning helps with Seasonal Affective Disorder (SAD) symptoms. FIRST-TIME TANNERS - Never tanned before? Our staff evaluates your skin type, recommends appropriate beds and session lengths, and guides you through building a safe base tan. EXPERIENCED TANNERS - Know what you want? We maintain professional-grade equipment that serious tanners trust. The Matrix bed attracts experienced tanners from across Knox County."
        },
        {
          h2: "Can indoor tanning help with winter depression or SAD?",
          content: "Many of our customers report improved mood, energy, and sleep during Ohio's gray winters after regular tanning sessions. The science makes sense: UV light exposure triggers vitamin D production and serotonin release—both linked to mood regulation. Our Level 4 and Stand-Up beds also include red light therapy, which provides additional non-UV benefits for mood and skin health. IMPORTANT: We're not doctors. SAD is a real medical condition. If you're struggling, please consult a healthcare provider. Tanning can be part of a wellness approach, but it's not a substitute for medical treatment. That said, we've heard countless customers tell us that regular tanning sessions help them feel better during winter."
        },
        {
          h2: "Why choose Eastend over gym tanning?",
          content: "Most gyms treat tanning as an add-on revenue stream with minimal investment. Their beds are often outdated, bulbs dim, and staff untrained. At Eastend, tanning IS our business—our primary service, not an afterthought. EQUIPMENT: We invest in professional-grade beds because our reputation depends on it. MAINTENANCE: Daily cleaning, scheduled bulb replacement, professional servicing. EXPERTISE: Staff trained in skin type analysis, bed selection, lotion recommendations. RESULTS: Faster, more consistent tanning with proper guidance. Many customers who switch from gym tanning tell us the difference is 'night and day.' They achieve better results in fewer sessions because our equipment actually works as intended."
        },
        {
          h2: "What should first-time tanners expect?",
          content: "If you've never tanned before, here's the process: SKIN TYPE EVALUATION - Our staff assesses your skin type (Type I-VI on the Fitzpatrick scale) based on your natural skin color, hair color, and how you typically respond to sun exposure. FIRST SESSION - We recommend Level 1 or 2 beds for 5-8 minutes. You'll wear provided eye protection (mandatory). The bed environment is warm and relaxing. AFTER YOUR SESSION - Your skin may feel slightly warm. Any color typically appears within 24-48 hours. BUILDING YOUR TAN - We schedule sessions at least 48 hours apart to let skin recover. Most people see noticeable color after 3-5 sessions and build a solid base tan in 4-6 weeks. ONGOING GUIDANCE - Our staff monitors your progress and recommends when to increase session length or move to higher-level beds."
        },
        {
          h2: "What tanning lotions should I use?",
          content: "Quality tanning lotion accelerates results and keeps skin moisturized. We carry professional-grade lotions and can recommend the right product for your skin type and goals: ACCELERATORS - For beginners and those building a base tan. Moisturize and enhance UV absorption without bronzers. BRONZERS - For experienced tanners seeking deeper color. Provide immediate cosmetic color plus extended tanning benefits. TINGLES - For advanced tanners only. Create increased blood flow for intensified tanning. Our staff can explain the differences and recommend products based on your experience level and skin type. Using lotion consistently makes a significant difference in results."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/laundry", text: "Do laundry while you tan at Eastend" },
        { url: "/drinks", text: "Grab a Fizze drink after your session" },
        { url: "/fast-nails", text: "Add a manicure to your visit" },
        { url: "/people-of-eastend", text: "Read customer tanning stories" }
      ]
    },

    laundry: {
      h1: "Eastend Laundry - Coin Laundry with FREE Drying at Mt Vernon's Tanning Hub",
      intro: "Eastend Laundry is a complementary service at our main Eastend location (818 Coshocton Ave). While tanning is our primary service, we added coin laundry with FREE drying because many tanning customers wanted to combine errands. Now you can start your laundry, tan during the wash cycle, and return to fold—all in one efficient visit. We're the only laundromat in Mt Vernon that offers free drying every day.",
      sections: [
        {
          h2: "What does laundry cost at Eastend?",
          content: "WASHERS: 20lb capacity $4.50 (small loads, singles), 40lb capacity $6.50 (our most popular, great for families), 60lb capacity $7.50 (bedding, comforters, large loads). DRYERS: FREE. Every day, all day. This is not a promotion—it's our everyday policy. No other Mt Vernon laundromat offers free drying. We also accept credit cards in addition to coins."
        },
        {
          h2: "How much do I save with free drying?",
          content: "Most laundromats charge $0.25-$0.50 per 6-8 minute dryer cycle. A typical load needs 30-45 minutes, costing $1.50-$3.75 per load elsewhere. At Eastend, that's $0. If you do 2 loads weekly: Other laundromats = ~$6/week in drying = $312/year. Eastend = $0 in drying = $312 SAVED. Families doing 4+ loads weekly save over $600 annually. The free drying makes Eastend the best laundry value in Knox County."
        },
        {
          h2: "How do customers combine laundry with tanning?",
          content: "The most common pattern: Arrive, load washers (wash cycle ~35 minutes). Walk to tanning area, enjoy a 10-20 minute session. Return relaxed, transfer to free dryers. Grab a Fizze bubble tea while clothes dry. Fold at clean folding tables. Total time: about 90 minutes for complete laundry plus tanning and a drink. What would be three separate trips becomes one efficient visit. This is exactly why we added laundry to our tanning studio."
        },
        {
          h2: "Is Eastend Laundry the same as Westend Laundry?",
          content: "No. They are separate locations under the same ownership: EASTEND LAUNDRY is at our main location (818 Coshocton Ave) with tanning, drinks, nails, and food truck stop. Attended during business hours (8 AM - 7:30 PM). Free drying. WESTEND LAUNDRY is at 3024 Coshocton Rd—a laundry-only location open 24/7. Self-service, no tanning or other services. Choose Eastend for free drying and access to our full service hub. Choose Westend for 24-hour access when you need late-night or early-morning laundry."
        },
        {
          h2: "Do you offer wash-dry-fold service?",
          content: "Yes. If you're too busy to do laundry yourself, drop off your clothes and we'll wash, dry, and fold them for you. Our staff uses quality detergent and handles your items with care. Turnaround is typically same-day or next-day. Popular with busy professionals, large families, and anyone who values their time."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Tan while your laundry runs" },
        { url: "/drinks", text: "Enjoy a Fizze drink while you wait" },
        { url: "/fast-nails", text: "Get nails done during dry cycle" },
        { url: "/westend-laundry", text: "Westend Laundry (24/7, laundry only)" }
      ]
    },

    westend: {
      h1: "Westend Laundry - 24/7 Self-Service Coin Laundry in Mt Vernon Ohio (Laundry Only)",
      intro: "Westend Laundry at 3024 Coshocton Rd is our 24-hour, self-service laundry-only location. It's a sister location to Eastend, owned by the same family, but offers ONLY laundry services. Westend does NOT have tanning, drinks, nails, or food truck services—those are exclusively at our main Eastend location (818 Coshocton Ave). Choose Westend when you need laundry access at any hour. Choose Eastend when you want free drying and access to our full tanning-centered service hub.",
      sections: [
        {
          h2: "What services does Westend Laundry offer?",
          content: "Westend offers LAUNDRY ONLY: Coin-operated washers and dryers. Self-service 24/7/365. No attendant on site. This location does NOT offer: Tanning (available only at Eastend), Fizze drinks (available only at Eastend), Fast Nails (available only at Eastend), Food truck stop (available only at Eastend), Free drying (available only at Eastend). Westend is purely a self-service laundromat for people who need 24-hour access."
        },
        {
          h2: "When is Westend Laundry open?",
          content: "Always. Westend is open 24 hours a day, 7 days a week, 365 days a year. Whether you work night shifts, have a newborn keeping you up, or just prefer doing laundry at odd hours, we're always available. No need to plan around business hours."
        },
        {
          h2: "How is Westend different from Eastend?",
          content: "WESTEND LAUNDRY (3024 Coshocton Rd): 24/7 access, self-service only, laundry services only, lowest prices in area, no attendant, no free drying. EASTEND (818 Coshocton Ave): Business hours (8 AM - 7:30 PM), attended facility, FREE drying every day, plus tanning (our primary service), Fizze drinks, Fast Nails, and Food Truck Stop. If you want the full Eastend experience with tanning and free drying, go to our main location. If you need laundry at 3 AM, Westend is your option."
        },
        {
          h2: "Where exactly is Westend Laundry?",
          content: "Westend Laundry: 3024 Coshocton Rd, Mt Vernon, OH 43050. On the west side of Mt Vernon. Free parking on-site. For questions about either location, call (740) 397-9632."
        },
        {
          h2: "Is Westend safe at night?",
          content: "Yes. Our Westend facility is well-lit inside and out, equipped with security cameras, and located in a residential area. Many shift workers, parents, and students use Westend during late hours. The self-service format means you can arrive, do your laundry, and leave on your own schedule."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/laundry", text: "Eastend Laundry (with free drying and tanning)" },
        { url: "/tanning", text: "Visit Eastend for tanning services" }
      ]
    },

    drinks: {
      h1: "Fizze Drinks - Fresh Bubble Tea at Eastend's Tanning Hub in Mt Vernon Ohio",
      intro: "Fizze Drinks is a complementary service at our main Eastend location. When we asked our tanning customers what would make their visit better, drinks came up constantly. After a tanning session, people wanted something refreshing. While waiting for laundry, they wanted something to enjoy. So we added Fizze—52+ flavors of fresh bubble tea, milk tea, and smoothies. Now many customers make it a routine: tan, grab a bubble tea, relax.",
      sections: [
        {
          h2: "What drinks does Fizze offer?",
          content: "We make everything fresh to order: CLASSIC MILK TEAS - Original, Thai, taro, brown sugar, honeydew, matcha. Creamy and satisfying. FRUIT TEAS - Mango, passion fruit, strawberry, peach, lychee. Light and refreshing. SMOOTHIES - Mixed fruit, tropical, berry blends. Perfect post-tanning cooldown. REFRESHERS - Citrus, watermelon, cucumber mint. Hydrating and crisp. All drinks customizable: choose your sweetness level (0-100%), ice amount, and toppings."
        },
        {
          h2: "What toppings can I add?",
          content: "TAPIOCA BOBA PEARLS - The classic chewy addition. POPPING BOBA - Fruit-flavored pearls that burst. COCONUT JELLY - Refreshing and light. ALOE VERA - Soothing and healthy. GRASS JELLY - Traditional Asian topping. Most toppings can be combined for a custom experience."
        },
        {
          h2: "How do customers combine drinks with tanning?",
          content: "The most popular pattern: Finish a tanning session (10-20 minutes of warmth), walk to the Fizze counter, order a cold bubble tea, and enjoy it while relaxing or waiting for laundry. The contrast of a warm tanning session followed by a cold, refreshing drink is something customers specifically tell us they love. It's become part of the Eastend ritual."
        },
        {
          h2: "Can I order Fizze drinks online?",
          content: "Yes. Order ahead through our website for pickup. Skip the wait and have your drink ready when you arrive. Perfect for grabbing a post-tanning refreshment quickly, or picking up drinks for the family."
        },
        {
          h2: "Where is Fizze located?",
          content: "Fizze Drinks is available ONLY at our main Eastend location: 818 Coshocton Ave, Mt Vernon, OH 43050. It's inside the same building as our tanning studio, Eastend Laundry, and Fast Nails. Fizze is NOT available at Westend Laundry (which is laundry-only)."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Tan first, then grab a drink" },
        { url: "/laundry", text: "Enjoy a drink while doing laundry" },
        { url: "/fast-nails", text: "Sip a drink during your manicure" }
      ]
    },

    nails: {
      h1: "Fast Nails at Eastend - Quick Nail Services at Mt Vernon's Tanning Hub",
      intro: "Fast Nails is a complementary service at our main Eastend location. We added nail services because our tanning and laundry customers wanted a way to maximize their visit. Now you can get a quick manicure while your laundry dries, or add nail services to your tanning day. It's about convenience—combining multiple self-care tasks in one trip.",
      sections: [
        {
          h2: "What nail services does Fast Nails offer?",
          content: "We provide: Manicures, Pedicures, Gel polish, Nail repairs, Basic nail art. Our focus is quality service at affordable prices with minimal wait times. Whether you need a quick polish change or a full manicure, we can help."
        },
        {
          h2: "Do I need an appointment?",
          content: "No appointment necessary. Fast Nails operates on a walk-in basis. This makes it easy to add nail services spontaneously. If there's a short wait, enjoy a Fizze drink or browse tanning packages."
        },
        {
          h2: "How long do nail services take?",
          content: "Basic manicure: 20-30 minutes. Pedicure: 30-45 minutes. Gel polish adds about 10 minutes. These timeframes fit perfectly with laundry cycles—start your wash, get your nails done, return to fold."
        },
        {
          h2: "How do customers combine nails with other services?",
          content: "Common pattern: Start laundry → get nails done during wash cycle → transfer to (free) dryers → enjoy results while clothes dry. Or: Tan first → get manicure → grab a bubble tea → leave feeling refreshed. Fast Nails exists to make Eastend a complete self-care destination, with tanning as the anchor."
        },
        {
          h2: "Where is Fast Nails located?",
          content: "Fast Nails is available ONLY at our main Eastend location: 818 Coshocton Ave, Mt Vernon, OH 43050. It's inside the same building as our tanning studio, Eastend Laundry, and Fizze Drinks. Fast Nails is NOT available at Westend Laundry (which is laundry-only)."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Add tanning to your visit" },
        { url: "/laundry", text: "Do laundry while getting nails done" },
        { url: "/drinks", text: "Enjoy a Fizze drink during your service" }
      ]
    },

    foodtruck: {
      h1: "818 Food Truck Stop at Eastend - Food Trucks & 818 EATS in Mt Vernon Ohio",
      intro: "818 Food Truck Stop is a complementary service at our main Eastend location. We coordinate local food truck visits and operate 818 EATS, our own African cuisine delivery service. This adds another dimension to the Eastend hub—you can tan, do laundry, grab drinks, get nails done, AND enjoy great food, all at 818 Coshocton Ave.",
      sections: [
        {
          h2: "What is the Food Truck Stop?",
          content: "We host food truck events at our Eastend location and connect Knox County event organizers with local food trucks for catering. Check our website and social media for upcoming food truck schedules. It's a great way to try new foods while enjoying our other services."
        },
        {
          h2: "What is 818 EATS?",
          content: "818 EATS is our own African cuisine delivery service. We offer authentic dishes like Ghana Jollof Rice, Egusi Stew with fufu or rice, Waakye, and Suya with Fried Plantains. We use a batch ordering system: you vote for dishes, pre-order, and we deliver when we reach 40 orders. This ensures fresh food (never sitting under heat lamps) at affordable prices ($25 per dish)."
        },
        {
          h2: "How do I order from 818 EATS?",
          content: "Visit our website, provide your contact info, vote for your top 3 dishes, select your delivery preference, and complete payment. You'll receive updates as the batch fills, and notification when food is ready for delivery. It's designed to bring restaurant-quality African cuisine to Knox County at accessible prices."
        },
        {
          h2: "Can restaurants partner with 818 EATS?",
          content: "Yes. We partner with local restaurants and home kitchen operators to expand our menu. If you're an experienced cook of African cuisine interested in reaching Knox County customers, contact us about partnership opportunities."
        },
        {
          h2: "Where is the Food Truck Stop?",
          content: "818 Food Truck Stop operates at our main Eastend location: 818 Coshocton Ave, Mt Vernon, OH 43050. Food trucks visit periodically; 818 EATS delivers throughout Knox County. Neither service is available at Westend Laundry (which is laundry-only)."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Visit for tanning services" },
        { url: "/laundry", text: "Eastend Laundry" },
        { url: "/drinks", text: "Fizze drinks" }
      ]
    },

    eats: {
      h1: "818 EATS - Authentic African Cuisine Delivery in Mt Vernon Ohio",
      intro: "818 EATS brings authentic African cuisine to Knox County through our batch ordering system. Part of the Eastend family of services, 818 EATS operates from our main location at 818 Coshocton Ave. While tanning is our primary service, 818 EATS represents our commitment to serving the Mt Vernon community in multiple ways.",
      sections: [
        {
          h2: "What is 818 EATS and how does it work?",
          content: "818 EATS is a food delivery service using a batch ordering system. You vote for your favorite dishes, choose your delivery preference, and pre-pay. When we reach 40 orders, we prepare everything fresh and deliver to your door. This ensures every dish is made fresh (never sitting under heat lamps) and keeps prices affordable at $25 per dish."
        },
        {
          h2: "What dishes does 818 EATS offer?",
          content: "Our current menu: GHANA JOLLOF RICE ($25) - Famous West African rice with tomatoes, peppers, and spices. EGUSI STEW WITH FUFU OR RICE ($25) - Hearty melon seed soup with your choice of sides. WAAKYE ($25) - Ghanaian rice and beans with special waakye leaves. SUYA & FRIED PLANTAINS ($25) - Spiced grilled meat skewers with sweet plantains. All dishes prepared by experienced cooks using authentic recipes."
        },
        {
          h2: "Why batch ordering?",
          content: "Batch ordering lets us serve authentic African cuisine without full restaurant overhead. Each batch is prepared fresh for that specific group of orders. No heat lamps, no compromise on quality. Prices stay at $25 (restaurant prices would be $35-45). You're ordering alongside neighbors who love African food."
        },
        {
          h2: "How is 818 EATS connected to Eastend?",
          content: "818 EATS operates from our main Eastend location (818 Coshocton Ave). The '818' in our name comes from our address. While tanning is our primary service, 818 EATS is part of our commitment to serving Mt Vernon. You can learn about 818 EATS while visiting for tanning, laundry, or drinks."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Visit Eastend for tanning" },
        { url: "/food-truck-stop", text: "Learn about Food Truck Stop" }
      ]
    },

    blog: {
      h1: "People of Eastend",
      intro: "People of Eastend shares real stories from customers and locals who use Eastend for tanning, laundry, drinks, and self-care. Each story answers common questions about what Eastend is like, who it's for, and how people use multiple services in one visit.",
      blogIndex: [
        {
          id: "can-tanning-help-winter-depression",
          title: "Can Tanning Actually Help With Winter Depression? Tom Found Out.",
          date: "January 15, 2026",
          excerpt: "Many customers report improved mood, energy, and sleep during Ohio winters after regular tanning sessions. UV exposure triggers vitamin D and serotonin production. This story follows Tom, a night-shift factory worker who discovered tanning as part of his winter wellness routine.",
          link: "/blog/can-tanning-help-winter-depression",
          tanningLink: "/tanning",
          tanningLinkText: "Learn about tanning for winter wellness"
        },
        {
          id: "is-eastend-better-than-gym-tanning",
          title: "Is Eastend Actually Better Than Gym Tanning? Sarah Switched.",
          date: "January 12, 2026",
          excerpt: "Most gym-to-Eastend converts say the difference is 'night and day.' We're tanning specialists with professional equipment and trained staff, not a gym treating tanning as an afterthought. Sarah's story shows what happens when you switch from gym tanning to a dedicated salon.",
          link: "/blog/is-eastend-better-than-gym-tanning",
          tanningLink: "/tanning",
          tanningLinkText: "Compare our professional tanning beds"
        },
        {
          id: "what-is-laundry-like-at-eastend",
          title: "What's It Actually Like Doing Laundry at Eastend?",
          date: "January 10, 2026",
          excerpt: "It's not just laundry—it's a mini break. Many customers start laundry, tan during the wash cycle, grab a drink, then fold. The FREE drying saves money, and combining with tanning saves time. Maria's Saturday routine shows how families turn laundromat day into something they look forward to.",
          link: "/blog/what-is-laundry-like-at-eastend",
          tanningLink: "/tanning",
          tanningLinkText: "Add tanning to your laundry visit"
        },
        {
          id: "who-comes-to-eastend-for-tanning",
          title: "What Kind of People Come to Eastend for Tanning?",
          date: "January 8, 2026",
          excerpt: "Everyone from first-time tanners preparing for weddings to experienced regulars maintaining year-round color. Many come specifically for winter mood support. Tanning is our primary service and attracts diverse customers—here's who you'll meet.",
          link: "/blog/who-comes-to-eastend-for-tanning",
          tanningLink: "/tanning",
          tanningLinkText: "See our tanning bed options"
        },
        {
          id: "can-i-relax-at-eastend",
          title: "Can I Actually Relax at Eastend, or Is It Just for Errands?",
          date: "January 5, 2026",
          excerpt: "Absolutely. Many customers have developed 'self-care routines' at Eastend: tan (warm and relaxing), grab a cold drink, maybe get nails done. The tanning experience is inherently relaxing, and complementary services extend that feeling. Here's how locals turn a visit into reset time.",
          link: "/blog/can-i-relax-at-eastend",
          tanningLink: "/tanning",
          tanningLinkText: "Begin your self-care routine with tanning"
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Explore tanning services (primary)" },
        { url: "/laundry", text: "Eastend Laundry with free drying" },
        { url: "/drinks", text: "Fizze bubble tea drinks" },
        { url: "/fast-nails", text: "Fast Nails services" }
      ]
    }
  };

  const data = content[page] || content.home;

  // Check if this is the blog page - render as blog index
  const isBlogPage = page === 'blog';

  return (
    <>
      {/* Noscript fallback - visible to crawlers and non-JS users */}
      <noscript>
        <div className="seo-fallback" style={{padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Georgia, serif', lineHeight: '1.8'}}>
          <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontWeight: 'bold'}}>{data.h1}</h1>
          
          <p style={{fontSize: '1.1rem', marginBottom: '2rem', color: '#333', lineHeight: '1.8'}}>
            {data.intro}
          </p>
          
          {/* Blog Index - only for blog page */}
          {isBlogPage && data.blogIndex && (
            <section style={{marginTop: '2rem'}}>
              {data.blogIndex.map((story, i) => (
                <article key={i} style={{marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #e0e0e0'}}>
                  {/* Story Title (H2) */}
                  <h2 style={{fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1a1a1a', fontWeight: 'bold'}}>
                    <a href={story.link} style={{color: '#1a1a1a', textDecoration: 'none'}}>{story.title}</a>
                  </h2>
                  
                  {/* Publish Date */}
                  <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                    Published: {story.date}
                  </p>
                  
                  {/* Excerpt - Answer-first */}
                  <p style={{fontSize: '1.1rem', color: '#444', marginBottom: '1rem', lineHeight: '1.7'}}>
                    {story.excerpt}
                  </p>
                  
                  {/* Links */}
                  <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
                    <a href={story.link} style={{color: '#0d9488', fontWeight: '600', textDecoration: 'none'}}>
                      Read the full story →
                    </a>
                    <a href={story.tanningLink} style={{color: '#d97706', fontWeight: '500', textDecoration: 'none'}}>
                      {story.tanningLinkText}
                    </a>
                  </div>
                </article>
              ))}
            </section>
          )}
          
          {/* Regular sections - for non-blog pages */}
          {!isBlogPage && data.sections && data.sections.map((section, i) => (
            <section key={i} style={{marginBottom: '2rem'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a'}}>{section.h2}</h2>
              <p style={{color: '#444', marginBottom: '1rem', whiteSpace: 'pre-line'}}>{section.content}</p>
            </section>
          ))}
          
          {/* People of Eastend stories with explicit Q&A - for non-blog pages that have stories */}
          {!isBlogPage && data.stories && (
            <section style={{marginTop: '3rem'}}>
              <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1a1a1a'}}>Customer Stories & Questions Answered</h2>
              {data.stories.map((story, i) => (
                <article key={i} style={{marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
                  <p style={{fontSize: '1.1rem', color: '#d97706', fontWeight: 'bold', marginBottom: '0.75rem'}}>
                    Question: {story.question}
                  </p>
                  <p style={{fontSize: '1rem', color: '#333', marginBottom: '1rem', padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '4px'}}>
                    <strong>Short Answer:</strong> {story.answer}
                  </p>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1a1a1a'}}>{story.title}</h3>
                  <p style={{color: '#444', marginBottom: '1rem'}}>{story.fullStory}</p>
                  <a href={story.serviceLink} style={{color: '#d97706', textDecoration: 'underline', fontWeight: '500'}}>
                    → {story.serviceName}
                  </a>
                </article>
              ))}
            </section>
          )}
          
          {/* Internal Navigation */}
          {data.internalLinks && (
            <nav style={{marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
              <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Explore Eastend Services</h2>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {data.internalLinks.map((link, i) => (
                  <li key={i} style={{marginBottom: '0.75rem'}}>
                    <a href={link.url} style={{color: '#d97706', textDecoration: 'none', fontSize: '1rem'}}>
                      → {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          {/* Location Information - Clear Separation */}
          <footer style={{marginTop: '3rem'}}>
            <div style={{padding: '2rem', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '8px', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#d97706'}}>Eastend (Main Location) - Full Service Hub</h2>
              <p style={{marginBottom: '0.5rem'}}><strong>Services:</strong> Tanning (Primary), Laundry (Free Drying), Fizze Drinks, Fast Nails, Food Truck Stop</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Address:</strong> 818 Coshocton Ave, Mt Vernon, OH 43050</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Phone:</strong> <a href="tel:7403979632" style={{color: '#fbbf24'}}>(740) 397-9632</a></p>
              <p style={{marginBottom: '0.5rem'}}><strong>Hours:</strong> Monday - Sunday, 8:00 AM - 7:30 PM</p>
              <p><strong>Parking:</strong> Free lot behind building with front-door access</p>
            </div>
            
            <div style={{padding: '2rem', backgroundColor: '#374151', color: '#fff', borderRadius: '8px'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#9ca3af'}}>Westend Laundry - Laundry Only (24/7)</h2>
              <p style={{marginBottom: '0.5rem'}}><strong>Services:</strong> Self-Service Coin Laundry ONLY (No tanning, drinks, nails, or food)</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Address:</strong> 3024 Coshocton Rd, Mt Vernon, OH 43050</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Phone:</strong> <a href="tel:7403979632" style={{color: '#9ca3af'}}>(740) 397-9632</a></p>
              <p><strong>Hours:</strong> Open 24/7/365 - Self Service</p>
            </div>
          </footer>
          
          {/* Schema.org structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Eastend Tanning & Laundry",
            "description": "Tanning-centered local service hub in Mt Vernon, Ohio. Primary service: professional indoor tanning. Complementary services: coin laundry with free drying, Fizze bubble tea, Fast Nails, 818 Food Truck Stop.",
            "url": "https://eastend.website",
            "telephone": "(740) 397-9632",
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
              "latitude": 40.3834,
              "longitude": -82.4657
            },
            "openingHours": "Mo-Su 08:00-19:30",
            "priceRange": "$$",
            "areaServed": "Knox County, Ohio",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Eastend Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Indoor Tanning",
                    "description": "Primary service. 6 professional tanning bed levels including the 40,740W Matrix."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Coin Laundry",
                    "description": "Complementary service. FREE drying every day."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Fizze Drinks",
                    "description": "Complementary service. 52+ flavors of bubble tea and smoothies."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Fast Nails",
                    "description": "Complementary service. Quick manicures and pedicures."
                  }
                }
              ]
            }
          })}} />
        </div>
      </noscript>

      {/* Hidden crawlable content - always in DOM for search engines */}
      <div 
        className="seo-hidden-content" 
        style={{position: 'absolute', left: '-9999px', top: '0', width: '1px', height: '1px', overflow: 'hidden'}}
        aria-hidden="true"
      >
        <h1>{data.h1}</h1>
        <p>{data.intro}</p>
        
        {/* Blog index for crawlers */}
        {isBlogPage && data.blogIndex && data.blogIndex.map((story, i) => (
          <article key={i}>
            <h2>{story.title}</h2>
            <p>Published: {story.date}</p>
            <p>{story.excerpt}</p>
            <a href={story.link}>Read the full story</a>
            <a href={story.tanningLink}>{story.tanningLinkText}</a>
          </article>
        ))}
        
        {/* Regular sections for non-blog pages */}
        {!isBlogPage && data.sections && data.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.h2}</h2>
            <p>{section.content}</p>
          </section>
        ))}
        
        {/* Stories for non-blog pages */}
        {!isBlogPage && data.stories && data.stories.map((story, i) => (
          <article key={i}>
            <p>Question: {story.question}</p>
            <p>Answer: {story.answer}</p>
            <h3>{story.title}</h3>
            <p>{story.fullStory}</p>
            <a href={story.serviceLink}>{story.serviceName}</a>
          </article>
        ))}
        
        {/* Navigation for link discovery */}
        <nav>
          <a href="/">Eastend Home - Tanning-Centered Hub</a>
          <a href="/tanning">Tanning Services (Primary)</a>
          <a href="/laundry">Eastend Laundry (Free Drying)</a>
          <a href="/westend-laundry">Westend Laundry (24/7, Laundry Only)</a>
          <a href="/drinks">Fizze Drinks</a>
          <a href="/fast-nails">Fast Nails</a>
          <a href="/food-truck-stop">818 Food Truck Stop</a>
          <a href="/blog">People of Eastend Stories</a>
        </nav>
        
        {/* Location microdata - clear separation */}
        <div itemScope itemType="https://schema.org/LocalBusiness">
          <span itemProp="name">Eastend Tanning & Laundry (Main Location)</span>
          <span itemProp="description">Tanning-centered local service hub. Primary: Indoor Tanning. Complementary: Laundry, Drinks, Nails, Food.</span>
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="streetAddress">818 Coshocton Ave</span>
            <span itemProp="addressLocality">Mt Vernon</span>
            <span itemProp="addressRegion">OH</span>
            <span itemProp="postalCode">43050</span>
          </div>
          <span itemProp="telephone">(740) 397-9632</span>
        </div>
        
        <div itemScope itemType="https://schema.org/Laundromat">
          <span itemProp="name">Westend Laundry (Laundry Only - 24/7)</span>
          <span itemProp="description">Self-service coin laundry only. No tanning, drinks, nails, or food services. Sister location to Eastend.</span>
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="streetAddress">3024 Coshocton Rd</span>
            <span itemProp="addressLocality">Mt Vernon</span>
            <span itemProp="addressRegion">OH</span>
            <span itemProp="postalCode">43050</span>
          </div>
          <span itemProp="telephone">(740) 397-9632</span>
          <span itemProp="openingHours">Mo-Su 00:00-23:59</span>
        </div>
      </div>
    </>
  );
};
