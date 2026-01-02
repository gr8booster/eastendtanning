// Static HTML fallback for SEO/AEO - visible even without JavaScript
// Comprehensive content strategy for search engines and AI systems
// Each page answers real user questions with specific, local content

export const StaticFallback = ({ page }) => {
  const content = {
    home: {
      h1: "Eastend Tanning & Laundry - Mt Vernon, Ohio's Neighborhood Destination Since 1998",
      intro: "What is Eastend? Eastend is a family-owned business at 818 Coshocton Ave in Mt Vernon, Ohio that combines professional indoor tanning, affordable coin laundry, fresh bubble tea drinks, nail services, and African cuisine delivery under one roof. Since 1998, we've served Knox County residents who want quality services without driving to Columbus.",
      sections: [
        {
          h2: "What makes Eastend different from other businesses?",
          content: "Unlike big-box gyms that offer tanning as an afterthought, or chain laundromats with minimal service, Eastend is a locally-owned destination where the owners know your name. We've invested in professional-grade tanning equipment (including the 40,740-watt Matrix bed - the most powerful in Knox County), maintain immaculately clean laundry facilities with FREE drying every day, and added services like Fizze bubble tea and Fast Nails because our customers asked for them. When you visit Eastend, you're supporting a small business that's been part of Mt Vernon for over 26 years."
        },
        {
          h2: "Who comes to Eastend?",
          content: "Our customers include OSU Knox students looking for affordable laundry and a place to study while they wait, working professionals who tan during lunch breaks, moms who do laundry while their kids enjoy bubble tea, retirees who've been coming since we opened, and newcomers to Mt Vernon discovering their neighborhood spot. We see first-time tanners nervous about their skin type and experienced tanners who know exactly which bed they want. Everyone is welcome."
        },
        {
          h2: "What services does Eastend offer?",
          content: "TANNING: 6 bed levels from beginner to professional, including the Matrix bed for the fastest, deepest tan possible. Monthly unlimited packages from $39.99. Red light therapy for anti-aging and mood support. LAUNDRY: Coin-operated washers (20lb $4.50, 40lb $6.50, 60lb $7.50) with FREE drying every day - no other Mt Vernon laundromat offers this. Wash-dry-fold drop-off service available. FIZZE DRINKS: 52+ flavors of bubble tea, milk tea, smoothies, and refreshers made fresh to order. FAST NAILS: Quick, affordable nail services. 818 EATS: Weekly African cuisine delivery featuring Jollof rice, Egusi stew, and more."
        },
        {
          h2: "Where is Eastend located and when is it open?",
          content: "Eastend is located at 818 Coshocton Ave, Mt Vernon, OH 43050 - about 2 minutes from OSU Knox Campus, near Walmart, with easy access from downtown Mt Vernon. Look for the large free parking lot behind the building with front-door access. We're open Monday through Sunday, 8:00 AM to 7:30 PM. Call us at (740) 397-9632 with questions."
        }
      ],
      internalLinks: [
        { url: "/tanning", text: "Explore our tanning services and pricing" },
        { url: "/laundry", text: "Learn about our laundry facilities and free drying" },
        { url: "/drinks", text: "See our Fizze bubble tea menu" },
        { url: "/nails", text: "Book nail services at Fast Nails" },
        { url: "/eats", text: "Order African cuisine from 818 EATS" },
        { url: "/blog", text: "Meet the People of Eastend" }
      ]
    },

    tanning: {
      h1: "Indoor Tanning at Eastend - Mt Vernon Ohio's Premier Tanning Salon Since 1998",
      intro: "Looking for indoor tanning in Mt Vernon, Ohio? Eastend Tanning offers 6 professional bed levels, expert staff, and 26 years of experience helping Knox County residents achieve their tanning goals safely and effectively. We're tanning specialists - not a gym with tanning as an afterthought.",
      sections: [
        {
          h2: "What tanning beds does Eastend have?",
          content: "We offer 6 distinct tanning experiences: Level 1 (3,840W, $5) is perfect for beginners or those maintaining a light tan. Level 2 (5,000W, $8) is our most popular choice for regular tanners. Level 3 (10,750W, $10) provides high-pressure tanning for faster results. Level 4 (13,995W, $14.99) includes red light therapy panels for anti-aging benefits. Stand-Up (8,640W, $11) delivers even, streak-free coverage without lying down. Matrix (40,740W, $23.99) is the most powerful tanning bed in Knox County - ideal for experienced tanners seeking deep, fast results."
        },
        {
          h2: "How much does monthly unlimited tanning cost?",
          content: "Monthly unlimited packages let you tan as often as you want for one flat fee. VIP rates (with 3-month commitment): Level 1 $39.99/month, Level 2 $60/month, Level 3 $95/month, Level 4 $109.99/month, Stand-Up $79.99/month, Matrix $169.99/month. Regular monthly rates are slightly higher. There are no blackout dates, no restrictions - just unlimited access to your chosen bed level."
        },
        {
          h2: "Can tanning help with winter blues or SAD?",
          content: "Many of our customers find indoor tanning helpful during Ohio's gray winters. UV light exposure triggers vitamin D production and serotonin release, which can improve mood and energy levels. Our red light therapy beds (Level 4 and Stand-Up) provide additional non-UV light that may support mental wellness. While we're not doctors and recommend consulting your healthcare provider about Seasonal Affective Disorder (SAD), we've heard countless customers tell us tanning helps them feel better during winter months."
        },
        {
          h2: "Is Eastend better than gym tanning?",
          content: "Yes, and here's why: Gyms treat tanning as an add-on service with minimal investment. Their beds are often outdated, staff untrained, and hours restricted. At Eastend, tanning IS our business. Our beds are professionally maintained daily with bulbs replaced on schedule. Our staff is trained in skin type analysis and can recommend the right bed and lotion for your goals. We've been perfecting indoor tanning for 26 years. Many customers who switched from gym tanning tell us the difference is night and day."
        },
        {
          h2: "What should first-time tanners expect?",
          content: "If you've never tanned before, our staff will evaluate your skin type (Type I-VI on the Fitzpatrick scale) and recommend an appropriate starting bed and session length. We'll explain how to use the bed, eye protection requirements, and aftercare tips. First sessions are typically 5-8 minutes on Level 1 or 2. We'll schedule your next session at least 48 hours later to let your skin recover. Most people see color after 3-5 sessions and build a solid base tan in 4-6 weeks."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/skin-type-evaluation", text: "Take our skin type quiz" },
        { url: "/blog", text: "Read tanning tips from People of Eastend" },
        { url: "/drinks", text: "Grab a Fizze drink after your session" },
        { url: "/laundry", text: "Do laundry while you tan" }
      ]
    },

    laundry: {
      h1: "Eastend Laundry - Mt Vernon Ohio's Only Laundromat with Free Drying Every Day",
      intro: "Need to do laundry in Mt Vernon? Eastend Laundry at 818 Coshocton Ave offers clean, affordable coin-operated washers with FREE drying every day - a deal no other Knox County laundromat matches. We've served Mt Vernon families since 1998.",
      sections: [
        {
          h2: "What does laundry cost at Eastend?",
          content: "Washers: 20lb capacity $4.50 (perfect for small loads or single person), 40lb capacity $6.50 (our most popular, great for families), 60lb capacity $7.50 (ideal for bedding, comforters, and large loads). Dryers: FREE. Every day, all day. This is not a promotion - it's our everyday policy. No other laundromat in Mt Vernon offers free drying. We also accept credit cards in addition to coins."
        },
        {
          h2: "How much money do I save with free drying?",
          content: "Most laundromats charge $0.25-$0.50 per 6-8 minute dryer cycle. A typical load needs 30-45 minutes, costing $1.50-$3.75 per load elsewhere. If you do 2 loads per week at a regular laundromat, you'd spend about $312/year just on drying. At Eastend, that's $0. Families doing 4+ loads weekly save over $600 annually. The savings are real and significant."
        },
        {
          h2: "What's the laundromat like inside?",
          content: "Our facility is clean, well-lit, and attended during all business hours (8 AM - 7:30 PM daily). We have multiple machine sizes to match your needs, folding tables, seating areas, and restrooms. The building is climate-controlled year-round. Large parking lot behind the building makes loading and unloading easy. While you wait, you can enjoy a Fizze bubble tea, browse our tanning packages, or get your nails done at Fast Nails."
        },
        {
          h2: "Do you offer wash-dry-fold service?",
          content: "Yes! If you're too busy to do laundry yourself, drop off your clothes and we'll wash, dry, and fold them for you. Our staff uses quality detergent and handles your items with care. Turnaround is typically same-day or next-day depending on load size. This service is popular with busy professionals, large families, and anyone who values their time over the task of laundry."
        },
        {
          h2: "Is Eastend Laundry safe?",
          content: "Absolutely. Our facility is well-lit with security cameras, attended during all business hours, and located in a visible commercial area on Coshocton Ave. Many parents bring their children, students come to study while waiting, and elderly customers feel comfortable. We take pride in maintaining a welcoming environment for everyone in Mt Vernon."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/westend-laundry", text: "Visit our 24/7 Westend location" },
        { url: "/tanning", text: "Tan while you do laundry" },
        { url: "/drinks", text: "Grab a drink while you wait" },
        { url: "/blog", text: "Read laundry tips and customer stories" }
      ]
    },

    westend: {
      h1: "Westend Laundry - 24/7 Self-Service Coin Laundry in Mt Vernon Ohio",
      intro: "Need to do laundry at 2 AM? Westend Laundry at 3024 Coshocton Rd in Mt Vernon is open 24 hours a day, 7 days a week, 365 days a year. Same trusted ownership as Eastend, with the lowest prices in Knox County.",
      sections: [
        {
          h2: "When is Westend Laundry open?",
          content: "Always. Westend is a fully self-service laundromat open 24/7/365. Whether you work night shifts, have a newborn who keeps you up, or just prefer doing laundry at odd hours, we're always available. No need to plan around business hours - do laundry whenever it fits your schedule."
        },
        {
          h2: "How is Westend different from Eastend?",
          content: "Westend is our 24-hour, self-service only location with the lowest prices in the area. Eastend (818 Coshocton Ave) offers attended service during regular business hours, free drying, and additional services like tanning and drinks. Both locations are owned and operated by the same family that's served Mt Vernon since 1998. Choose Westend for late-night availability and lowest prices; choose Eastend for free drying and additional services."
        },
        {
          h2: "Is Westend safe at night?",
          content: "Yes. Our Westend facility is well-lit inside and out, equipped with security cameras, and located in a residential area with regular traffic. Many shift workers, parents, and students use Westend during late hours without issue. The self-service format means you can arrive, do your laundry, and leave on your own schedule."
        },
        {
          h2: "Where exactly is Westend Laundry?",
          content: "Westend Laundry is located at 3024 Coshocton Rd, Mt Vernon, OH 43050 - on the west side of town. Free parking is available on-site. For questions about either location, call (740) 397-9632."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/laundry", text: "Visit Eastend Laundry (with free drying)" },
        { url: "/blog", text: "Read customer stories from People of Eastend" }
      ]
    },

    drinks: {
      h1: "Fizze Drinks - Fresh Bubble Tea, Milk Tea & Smoothies in Mt Vernon Ohio",
      intro: "Craving bubble tea in Mt Vernon? Fizze Drinks at Eastend (818 Coshocton Ave) offers 52+ flavors of fresh-made bubble tea, milk tea, fruit tea, and smoothies. Customize your sweetness, ice level, and toppings for the perfect drink every time.",
      sections: [
        {
          h2: "What drinks does Fizze offer?",
          content: "We make everything fresh to order: Classic Milk Teas (original, Thai, taro, brown sugar, honeydew, matcha), Fruit Teas (mango, passion fruit, strawberry, peach, lychee), Smoothies (mixed fruit, tropical, berry), Refreshers (citrus, watermelon, cucumber mint), and seasonal specials. All drinks can be customized with your preferred sweetness level, ice amount, and toppings."
        },
        {
          h2: "What toppings can I add to my drink?",
          content: "Choose from: Tapioca Boba Pearls (the classic chewy addition), Popping Boba (fruit-flavored pearls that burst in your mouth), Coconut Jelly (refreshing and light), Aloe Vera (soothing and healthy), Grass Jelly (traditional Asian topping), and seasonal options. Most toppings can be combined for a custom experience."
        },
        {
          h2: "Can I order Fizze drinks online?",
          content: "Yes! Order ahead through our website for pickup. Skip the wait and have your drink ready when you arrive. Online ordering is perfect for grabbing a post-tanning refreshment or picking up drinks for the family. We also offer delivery within Mt Vernon for larger orders."
        },
        {
          h2: "Is Fizze good for kids?",
          content: "Absolutely. We offer non-caffeinated options including fruit smoothies, refreshers, and fruit teas that kids love. Parents often grab bubble tea for themselves while the kids enjoy a strawberry smoothie or mango refresher. It's become a family treat for many Eastend customers."
        },
        {
          h2: "Why bubble tea at a tanning salon?",
          content: "Great question! When we asked our customers what would make their visit even better, drinks came up constantly. After a tanning session, people wanted something refreshing. While waiting for laundry, they wanted something to enjoy. So we added Fizze. Now many customers make it a routine: tan, grab a bubble tea, relax. It's become part of the Eastend experience."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/order-drinks", text: "Order Fizze drinks online" },
        { url: "/tanning", text: "Grab a drink after tanning" },
        { url: "/laundry", text: "Enjoy a drink while doing laundry" },
        { url: "/blog", text: "Read about customer favorites" }
      ]
    },

    nails: {
      h1: "Fast Nails at Eastend - Quick, Affordable Nail Services in Mt Vernon Ohio",
      intro: "Need a quick manicure in Mt Vernon? Fast Nails at Eastend (818 Coshocton Ave) offers affordable nail services without appointments or long waits. Get your nails done while your laundry dries or after a tanning session.",
      sections: [
        {
          h2: "What nail services does Fast Nails offer?",
          content: "We provide manicures, pedicures, gel polish, nail repairs, and basic nail art. Our focus is on quality service at affordable prices with minimal wait times. Whether you need a quick polish change or a full manicure, we can help."
        },
        {
          h2: "Do I need an appointment?",
          content: "No appointment necessary. Fast Nails operates on a walk-in basis. This makes it easy to add nail services to your Eastend visit spontaneously. If there's a wait, enjoy a Fizze drink or browse tanning packages."
        },
        {
          h2: "How long do nail services take?",
          content: "A basic manicure takes 20-30 minutes. Pedicures take 30-45 minutes. Gel polish adds about 10 minutes. Our goal is to provide quality results efficiently - we respect your time."
        },
        {
          h2: "Why get nails done at Eastend?",
          content: "Convenience. Many customers combine errands: start laundry, get nails done while it washes, grab a drink, then dry (free!) and fold. Others add a quick manicure after their tanning session. It's about making Eastend a one-stop destination where you can handle multiple tasks in one trip."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/laundry", text: "Do laundry while getting nails done" },
        { url: "/tanning", text: "Add tanning to your visit" },
        { url: "/drinks", text: "Enjoy a Fizze drink during your service" }
      ]
    },

    eats: {
      h1: "818 EATS - Authentic African Cuisine Delivery in Mt Vernon Ohio",
      intro: "Craving authentic African food in Knox County? 818 EATS brings Ghana Jollof Rice, Egusi Stew, Waakye, and more to your door through our unique weekly batch ordering system. Vote for your favorite dishes, pre-order, and enjoy restaurant-quality African cuisine at home.",
      sections: [
        {
          h2: "What is 818 EATS and how does it work?",
          content: "818 EATS is a food delivery service from Eastend that brings authentic African cuisine to Mt Vernon and Knox County. Unlike regular delivery apps, we use a batch ordering system: you vote for your top 3 dishes, choose your delivery preference, and pre-pay. When we reach 40 orders, we prepare fresh food and deliver to your door. This system ensures every dish is made fresh (never sitting under heat lamps) and keeps prices affordable at $25 per dish."
        },
        {
          h2: "What dishes does 818 EATS offer?",
          content: "Our current menu features: Ghana Jollof Rice ($25) - the famous West African rice dish with tomatoes, peppers, and spices; Egusi Stew with fufu or rice ($25) - hearty melon seed soup with your choice of sides; Waakye ($25) - Ghanaian rice and beans with special waakye leaves; Suya & Fried Plantains ($25) - spiced grilled meat skewers with sweet plantains. All dishes are prepared by experienced cooks using authentic recipes and quality ingredients."
        },
        {
          h2: "How do I order from 818 EATS?",
          content: "Visit our ordering page, provide your contact info (name, email, phone), vote for your top 3 dish choices, select 'First Available' or '#1 Choice Only' delivery preference, and complete payment. You'll receive updates as the batch fills, and notification when your food is ready for delivery. The whole process is designed to be simple and transparent."
        },
        {
          h2: "Why batch ordering instead of regular delivery?",
          content: "Batch ordering lets us serve authentic African cuisine without the overhead of a full restaurant. Each batch is prepared fresh specifically for that group of orders - no heat lamps, no sitting around, no compromise on quality. It keeps prices at $25 per generous portion (restaurant prices would be $35-45). And it builds community: you're ordering alongside your neighbors who also love African food."
        },
        {
          h2: "Can restaurants or home cooks partner with 818 EATS?",
          content: "Yes! We partner with local African restaurants and home kitchen operators to expand our menu offerings. If you're an experienced cook of African cuisine interested in reaching Knox County customers, contact us about partnership opportunities. We handle ordering, payment, and customer communication - you focus on cooking great food."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/eats/partner-signup", text: "Become an 818 EATS partner" },
        { url: "/blog", text: "Read 818 EATS customer stories" },
        { url: "/drinks", text: "Order Fizze drinks" }
      ]
    },

    blog: {
      h1: "People of Eastend - Stories from Mt Vernon Ohio's Neighborhood Destination",
      intro: "Who comes to Eastend? Meet the real people who make our business special. These stories answer common questions about what it's actually like to use our services - straight from the customers who know best.",
      sections: [
        {
          h2: "What kind of people go to Eastend?",
          content: "Everyone. College students from OSU Knox doing laundry between classes. Working moms who tan during lunch breaks. Retirees who've been customers since 1998. Young professionals grabbing bubble tea. Families making laundry day less boring. Night shift workers using our 24/7 Westend location. First-time tanners nervous about their skin. Experienced tanners who know exactly what bed they want. We've served Knox County for 26 years because we welcome everyone."
        },
        {
          h2: "What's it like doing laundry at Eastend?",
          content: "It's not just laundry - it's a mini break. Many customers start their wash, grab a Fizze bubble tea, and catch up on their phone or chat with staff. Some tan during the wash cycle (sessions are 10-20 minutes, perfect timing). Others get their nails done at Fast Nails. When dryers are free (and ours are FREE), you fold and go. Regular customers tell us it's the most pleasant laundry experience they've had - clean, convenient, and actually enjoyable."
        },
        {
          h2: "Can I tan and relax at the same place?",
          content: "That's exactly what many customers do. A typical 'self-care hour' at Eastend: arrive, start a tanning session (10-20 minutes depending on bed), emerge refreshed, grab a cold bubble tea, relax in our seating area, maybe get a quick manicure. It becomes a mini spa experience without spa prices. Several customers have told us it's their weekly ritual for mental health during Ohio winters."
        },
        {
          h2: "Is Eastend a good place to spend time, not just run errands?",
          content: "Absolutely. We designed Eastend to be a destination, not just a transaction. Students study here while waiting for laundry. Friends meet for bubble tea. Families make it a weekend outing. The atmosphere is welcoming, the staff knows regulars by name, and there's always something to do. We're proud that many customers consider Eastend their 'third place' - somewhere between home and work where they actually want to be."
        }
      ],
      stories: [
        {
          question: "What kind of person does laundry at Eastend?",
          title: "Maria's Saturday Routine",
          snippet: "Maria is a single mom with two kids. Every Saturday, she loads up the car and heads to Eastend. While the laundry runs, the kids pick out bubble tea flavors and Maria catches her breath.",
          fullStory: "Maria discovered Eastend three years ago when her apartment washer broke. 'I dreaded laundromat day until I found this place,' she says. 'The free drying saves me at least $10 a week. The kids actually ask to come because of the drinks. And I get 90 minutes of not being pulled in ten directions.' Now it's their Saturday tradition: laundry, bubble tea, sometimes a manicure for Maria. 'It went from a chore to something we look forward to.'",
          serviceLink: "/laundry"
        },
        {
          question: "Can tanning really help with winter depression?",
          title: "How Tom Survived Ohio Winter",
          snippet: "Tom is a night-shift factory worker who struggled with winter depression for years. His doctor suggested light therapy. A coworker mentioned Eastend's tanning beds.",
          fullStory: "Tom was skeptical at first. 'I thought tanning was for beach people, not guys like me.' But after his first few sessions, something shifted. 'I'd come in during my week's darkest days, spend 15 minutes in the bed, and leave feeling like I'd seen sunshine. My mood improved, I slept better, I had more energy.' Tom now has a monthly unlimited package and calls his twice-weekly sessions 'maintenance for my brain.' His wife says she can tell the difference too.",
          serviceLink: "/tanning"
        },
        {
          question: "What's the bubble tea like at Eastend?",
          title: "Jade's Favorite Study Spot",
          snippet: "Jade is an OSU Knox student who discovered Fizze while waiting for her laundry. Now she comes just for the drinks - and to study in a quieter environment than the campus library.",
          fullStory: "'I never had bubble tea before Mt Vernon,' Jade admits. 'I tried the mango passion fruit on a whim and got hooked.' Now she has a standing order: taro milk tea with extra boba, 50% sweetness. 'The staff knows my drink before I say it.' Jade often brings her laptop and studies at Eastend. 'It's quieter than campus, the drinks are amazing, and I can do laundry at the same time. I tell all my friends about this place.'",
          serviceLink: "/drinks"
        },
        {
          question: "Is Eastend actually good for tanning, or just convenient?",
          title: "Why Sarah Switched from Her Gym",
          snippet: "Sarah had been using her gym's tanning beds for two years before trying Eastend. The difference shocked her.",
          fullStory: "'My gym charged $15/month extra for tanning, but the beds were old and the staff didn't know anything,' Sarah explains. 'I'd tan for months and barely see results.' A friend recommended Eastend. 'First session, I noticed the difference. The beds are so much more powerful. The staff asked about my skin type, recommended a specific bed and lotion. Within three weeks, I had a better tan than two years at the gym.' Sarah canceled her gym tanning add-on and switched to Eastend exclusively. 'It's not even close.'",
          serviceLink: "/tanning"
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/tanning", text: "Learn about our tanning services" },
        { url: "/laundry", text: "See our laundry facilities" },
        { url: "/drinks", text: "Explore the Fizze menu" },
        { url: "/eats", text: "Try 818 EATS African cuisine" }
      ]
    },

    foodtruck: {
      h1: "Food Truck Stop at Eastend - Book Food Trucks in Mt Vernon Ohio",
      intro: "Planning an event in Knox County? Eastend's Food Truck Stop connects you with local food trucks for catering, private events, and scheduled stops. Bring delicious mobile food to your next gathering.",
      sections: [
        {
          h2: "What is the Food Truck Stop?",
          content: "The Food Truck Stop is Eastend's food truck coordination service. We help connect Knox County event organizers with local food trucks, facilitate bookings for private events, and host scheduled food truck stops at our 818 Coshocton Ave location."
        },
        {
          h2: "Can I book a food truck for my event?",
          content: "Yes! Whether you're planning a birthday party, corporate event, wedding reception, or community gathering, we can help you find the right food truck. Contact us with your event details (date, location, expected guests, cuisine preferences) and we'll match you with available trucks."
        },
        {
          h2: "When do food trucks come to Eastend?",
          content: "We host food truck events periodically at our 818 Coshocton Ave location. Check our website and social media for upcoming food truck schedules. It's a great way to try new foods while enjoying our other services."
        }
      ],
      internalLinks: [
        { url: "/", text: "Back to Eastend homepage" },
        { url: "/eats", text: "Try 818 EATS for African cuisine" },
        { url: "/drinks", text: "Explore Fizze drinks" }
      ]
    }
  };

  const data = content[page] || content.home;

  return (
    <>
      {/* Noscript fallback - visible to crawlers and non-JS users */}
      <noscript>
        <div className="seo-fallback" style={{padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Georgia, serif', lineHeight: '1.8'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1a1a', fontWeight: 'bold'}}>{data.h1}</h1>
          
          <p style={{fontSize: '1.1rem', marginBottom: '2rem', color: '#333', backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #0066cc'}}>
            {data.intro}
          </p>
          
          {data.sections && data.sections.map((section, i) => (
            <section key={i} style={{marginBottom: '2rem'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a'}}>{section.h2}</h2>
              <p style={{color: '#444', marginBottom: '1rem'}}>{section.content}</p>
            </section>
          ))}
          
          {/* People of Eastend stories */}
          {data.stories && (
            <section style={{marginTop: '3rem'}}>
              <h2 style={{fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1a1a1a'}}>Real Stories from Our Customers</h2>
              {data.stories.map((story, i) => (
                <article key={i} style={{marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
                  <p style={{fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '0.5rem'}}>Question: {story.question}</p>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1a1a1a'}}>{story.title}</h3>
                  <p style={{color: '#555', marginBottom: '1rem'}}>{story.snippet}</p>
                  <p style={{color: '#333'}}>{story.fullStory}</p>
                  <a href={story.serviceLink} style={{color: '#0066cc', textDecoration: 'underline'}}>Learn more about this service →</a>
                </article>
              ))}
            </section>
          )}
          
          {/* Internal Navigation */}
          {data.internalLinks && (
            <nav style={{marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
              <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Explore More at Eastend</h2>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {data.internalLinks.map((link, i) => (
                  <li key={i} style={{marginBottom: '0.75rem'}}>
                    <a href={link.url} style={{color: '#0066cc', textDecoration: 'none', fontSize: '1rem'}}>
                      → {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          {/* Contact Info */}
          <footer style={{marginTop: '3rem', padding: '2rem', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '8px'}}>
            <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#fff'}}>Visit Eastend Today</h2>
            <p style={{marginBottom: '0.5rem'}}><strong>Address:</strong> 818 Coshocton Ave, Mt Vernon, OH 43050</p>
            <p style={{marginBottom: '0.5rem'}}><strong>Phone:</strong> <a href="tel:7403979632" style={{color: '#66b3ff'}}>(740) 397-9632</a></p>
            <p style={{marginBottom: '0.5rem'}}><strong>Hours:</strong> Monday - Sunday, 8:00 AM - 7:30 PM</p>
            <p style={{marginBottom: '0.5rem'}}><strong>Parking:</strong> Free lot behind building with front-door access</p>
            <p><strong>Directions:</strong> 2 minutes from OSU Knox Campus on Coshocton Avenue, near Walmart</p>
          </footer>
          
          {/* Schema.org structured data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Eastend Tanning & Laundry",
            "description": data.intro,
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
            "areaServed": {
              "@type": "City",
              "name": "Mt Vernon, Knox County, Ohio"
            },
            "sameAs": [
              "https://www.facebook.com/eastendtanning",
              "https://www.instagram.com/eastendtanning"
            ]
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
        
        {data.sections && data.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.h2}</h2>
            <p>{section.content}</p>
          </section>
        ))}
        
        {data.stories && data.stories.map((story, i) => (
          <article key={i}>
            <h3>{story.title}</h3>
            <p>Question answered: {story.question}</p>
            <p>{story.fullStory}</p>
          </article>
        ))}
        
        {/* Microdata for enhanced crawlability */}
        <div itemScope itemType="https://schema.org/LocalBusiness">
          <span itemProp="name">Eastend Tanning & Laundry</span>
          <span itemProp="description">{data.intro}</span>
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <span itemProp="streetAddress">818 Coshocton Ave</span>
            <span itemProp="addressLocality">Mt Vernon</span>
            <span itemProp="addressRegion">OH</span>
            <span itemProp="postalCode">43050</span>
          </div>
          <span itemProp="telephone">(740) 397-9632</span>
        </div>
        
        {/* Navigation for link discovery */}
        <nav>
          <a href="/">Home</a>
          <a href="/tanning">Tanning</a>
          <a href="/laundry">Laundry</a>
          <a href="/drinks">Drinks</a>
          <a href="/nails">Nails</a>
          <a href="/eats">818 EATS</a>
          <a href="/blog">People of Eastend</a>
          <a href="/westend-laundry">Westend 24/7</a>
          <a href="/foodtruck">Food Truck Stop</a>
        </nav>
      </div>
    </>
  );
};
