// Static HTML fallback for SEO/AEO - visible even without JavaScript
// Business Identity: Eastend is a TANNING-CENTERED multi-service local hub
// Tanning = Primary anchor service | Laundry, Drinks, Nails, Food = Complementary services
// Location Separation: Eastend (full services) vs Westend (laundry only)

export const StaticFallback = ({ page }) => {
  const content = {
    home: {
      h1: "Eastend Tanning & Laundry - Mt Vernon Ohio's Tanning-Centered Neighborhood Hub",
      intro:
        "Eastend is a tanning-centered local service hub at 818 Coshocton Ave in Mt Vernon, Ohio. Since 1998, indoor tanning has been our primary service and the reason most customers discover us. Over the years, we've added complementary services—coin laundry with free drying, Fizze bubble tea drinks, Fast Nails, and 818 Food Truck Stop—so our tanning customers can combine self-care and errands in a single visit. This isn't a gym with tanning as an afterthought. This is a tanning studio with smart additions that make your visit more convenient.",
      sections: [
        {
          h2: 'Why is Eastend known for tanning?',
          content:
            "Tanning is what we do best. It's our anchor service, our specialty, and the main reason customers find us. We operate 6 professional-grade tanning beds, including the 40,740-watt Matrix—the most powerful tanning bed in Knox County. Our staff is trained specifically in skin type analysis, bed selection, and tanning optimization. We've perfected indoor tanning over 26 years, serving everyone from first-timers preparing for weddings to experienced tanners maintaining their year-round glow. When people search for 'best tanning salon near me' in Mt Vernon, they find Eastend because tanning is our core identity."
        },
        {
          h2: 'What other services does Eastend offer?',
          content:
            "While tanning is our primary service, we've intentionally added complementary services that make sense for our customers: EASTEND LAUNDRY offers coin-operated washers with FREE drying every day—the only laundromat in Mt Vernon with this deal. Many customers start their laundry, tan during the wash cycle, then return to fold. FIZZE DRINKS serves 52+ flavors of fresh bubble tea, milk tea, and smoothies—perfect for post-tanning refreshment. FAST NAILS provides quick, affordable manicures and pedicures—add a 20-minute manicure while your laundry dries. 818 FOOD TRUCK STOP connects Knox County with local food trucks and our own 818 EATS African cuisine delivery. These services exist because our tanning customers asked for them. They're designed to work together, turning Eastend into a one-stop destination for self-care and errands."
        },
        {
          h2: 'How do customers typically use Eastend?',
          content:
            "The most common pattern: arrive, start a load of laundry, tan during the wash cycle (sessions are 10-20 minutes), grab a bubble tea, then fold your dry clothes (dryers are free). What would be three separate trips—laundromat, tanning salon, drink shop—becomes one efficient, enjoyable visit. Other customers come purely for tanning and discover the convenience of the other services. Some come for laundry and discover tanning. The complementary services create a hub where different needs overlap, but tanning remains the anchor that defines who we are."
        },
        {
          h2: 'Who comes to Eastend for tanning?',
          content:
            "Our tanning customers include: people preparing for weddings, vacations, proms, and special events who want a base tan; maintenance tanners who visit weekly to keep their glow year-round; seasonal tanners who come during Ohio's gray winters for vitamin D and mood benefits (we have many customers who tan specifically for SAD relief); first-time tanners who've never used a tanning bed and need guidance on skin types and bed selection; experienced tanners who know exactly what they want and trust our professional-grade equipment. Tanning is for anyone who wants to look and feel their best, and we serve all experience levels."
        },
        {
          h2: 'Where is Eastend located?',
          content:
            "EASTEND (Main Location): 818 Coshocton Ave, Mt Vernon, OH 43050. This is our full-service hub with tanning, laundry, drinks, nails, and food truck stop. Open Monday-Sunday, 8:00 AM - 7:30 PM. Phone: (740) 397-9632. Large free parking lot behind the building with front-door access. About 2 minutes from OSU Knox Campus. NOTE: We also operate WESTEND LAUNDRY at 3024 Coshocton Rd—a separate laundry-only location open 24/7. Westend does NOT offer tanning or other services. See /westend-laundry for details."
        }
      ],
      internalLinks: [
        { url: '/tanning', text: 'Explore our tanning services (primary)' },
        { url: '/laundry', text: 'Eastend Laundry with free drying' },
        { url: '/drinks', text: 'Fizze bubble tea drinks' },
        { url: '/fast-nails', text: 'Fast Nails services' },
        { url: '/food-truck-stop', text: '818 Food Truck Stop' },
        { url: '/westend-laundry', text: 'Westend Laundry (24/7, laundry only)' },
        { url: '/people-of-eastend', text: 'Stories from our customers' }
      ]
    },

    tanning: {
      h1: "Indoor Tanning at Eastend - Mt Vernon Ohio's Premier Tanning Studio Since 1998",
      intro:
        "Tanning is what Eastend does best. As our primary service and core identity, we've invested 26 years in perfecting indoor tanning for Knox County residents. Unlike gyms that treat tanning as an afterthought, we are tanning specialists with professional-grade equipment, trained staff, and deep expertise in helping you achieve your tanning goals safely and effectively. This is why people searching for 'best tanning salon near me' find Eastend.",
      sections: [
        {
          h2: 'What tanning beds does Eastend offer?',
          content:
            'We operate 6 distinct tanning bed levels, more options than any facility in Knox County: LEVEL 1 (3,840W, $5/session) - Entry-level bed perfect for beginners or light maintenance. Gentle UV output for those new to indoor tanning. LEVEL 2 (5,000W, $8/session) - Our most popular bed. Balanced UV output for regular tanners building and maintaining color. LEVEL 3 (10,750W, $10/session) - High-pressure tanning for faster results. Popular with experienced tanners seeking deeper color in fewer sessions. LEVEL 4 (13,995W, $14.99/session) - Premium bed with integrated red light therapy panels. Combines tanning with anti-aging and skin health benefits. STAND-UP (8,640W, $11/session) - 360-degree UV exposure for even, streak-free coverage. No lying down, no pressure points. MATRIX (40,740W, $23.99/session) - The most powerful tanning bed in Knox County. For experienced tanners seeking the deepest, fastest tan possible. Professional-grade equipment reserved for those with established base tans.'
        },
        {
          h2: 'How much does monthly unlimited tanning cost?',
          content:
            'Monthly unlimited packages let you tan as often as recommended for your skin type. VIP rates (3-month commitment): Level 1 $39.99/month, Level 2 $60/month, Level 3 $95/month, Level 4 $109.99/month, Stand-Up $79.99/month, Matrix $169.99/month. Regular monthly rates are slightly higher. No blackout dates, no restrictions—just unlimited access to your chosen bed level. Most customers find unlimited packages more economical than per-session pricing if they tan twice weekly or more.'
        },
        {
          h2: 'Who is indoor tanning for?',
          content:
            "Indoor tanning serves diverse needs: EVENT PREPARATION - Weddings, proms, vacations, reunions, photo shoots. Building a base tan 4-6 weeks before your event ensures you look your best without last-minute burning. YEAR-ROUND MAINTENANCE - Many customers maintain a consistent tan throughout the year, visiting 1-3 times weekly depending on skin type and goals. SEASONAL/WINTER USE - Ohio winters are gray. Many customers tan specifically during winter months for vitamin D production and mood support. We hear frequently that tanning helps with Seasonal Affective Disorder (SAD) symptoms. FIRST-TIME TANNERS - Never tanned before? Our staff evaluates your skin type, recommends appropriate beds and session lengths, and guides you through building a safe base tan. EXPERIENCED TANNERS - Know what you want? We maintain professional-grade equipment that serious tanners trust. The Matrix bed attracts experienced tanners from across Knox County."
        },
        {
          h2: 'Can indoor tanning help with winter depression or SAD?',
          content:
            "Many of our customers report improved mood, energy, and sleep during Ohio's gray winters after regular tanning sessions. The science makes sense: UV light exposure triggers vitamin D production and serotonin release—both linked to mood regulation. Our Level 4 and Stand-Up beds also include red light therapy, which provides additional non-UV benefits for mood and skin health. IMPORTANT: We're not doctors. SAD is a real medical condition. If you're struggling, please consult a healthcare provider. Tanning can be part of a wellness approach, but it's not a substitute for medical treatment. That said, we've heard countless customers tell us that regular tanning sessions help them feel better during winter."
        },
        {
          h2: 'Why choose Eastend over gym tanning?',
          content:
            "Most gyms treat tanning as an add-on revenue stream with minimal investment. Their beds are often outdated, bulbs dim, and staff untrained. At Eastend, tanning IS our business—our primary service, not an afterthought. EQUIPMENT: We invest in professional-grade beds because our reputation depends on it. MAINTENANCE: Daily cleaning, scheduled bulb replacement, professional servicing. EXPERTISE: Staff trained in skin type analysis, bed selection, lotion recommendations. RESULTS: Faster, more consistent tanning with proper guidance. Many customers who switch from gym tanning tell us the difference is 'night and day.' They achieve better results in fewer sessions because our equipment actually works as intended."
        },
        {
          h2: 'What should first-time tanners expect?',
          content:
            "If you've never tanned before, here's the process: SKIN TYPE EVALUATION - Our staff assesses your skin type (Type I-VI on the Fitzpatrick scale) based on your natural skin color, hair color, and how you typically respond to sun exposure. FIRST SESSION - We recommend Level 1 or 2 beds for 5-8 minutes. You'll wear provided eye protection (mandatory). The bed environment is warm and relaxing. AFTER YOUR SESSION - Your skin may feel slightly warm. Any color typically appears within 24-48 hours. BUILDING YOUR TAN - We schedule sessions at least 48 hours apart to let skin recover. Most people see noticeable color after 3-5 sessions and build a solid base tan in 4-6 weeks. ONGOING GUIDANCE - Our staff monitors your progress and recommends when to increase session length or move to higher-level beds."
        },
        {
          h2: 'What tanning lotions should I use?',
          content:
            'Quality tanning lotion accelerates results and keeps skin moisturized. We carry professional-grade lotions and can recommend the right product for your skin type and goals: ACCELERATORS - For beginners and those building a base tan. Moisturize and enhance UV absorption without bronzers. BRONZERS - For experienced tanners seeking deeper color. Provide immediate cosmetic color plus extended tanning benefits. TINGLES - For advanced tanners only. Create increased blood flow for intensified tanning. Our staff can explain the differences and recommend products based on your experience level and skin type. Using lotion consistently makes a significant difference in results.'
        }
      ],
      internalLinks: [
        { url: '/', text: 'Back to Eastend homepage' },
        { url: '/laundry', text: 'Do laundry while you tan at Eastend' },
        { url: '/drinks', text: 'Grab a Fizze drink after your session' },
        { url: '/fast-nails', text: 'Add a manicure to your visit' },
        { url: '/people-of-eastend', text: 'Read customer tanning stories' }
      ]
    },

    // (Other pages unchanged)

    blog: {
      // This page's static markup MUST match the user-provided snippet exactly.
      snippet: {
        id: 'people-of-eastend-blog',
        h1: 'People of Eastend',
        intro:
          'People of Eastend shares real stories from customers and locals who use Eastend for tanning,\n    laundry, drinks, and self-care. Each story answers common questions about what Eastend is like,\n    who it’s for, and how people combine multiple services in one visit.',
        entries: [
          {
            title: 'Why People Choose Tanning at Eastend',
            href: '/blog/why-people-choose-tanning-at-eastend',
            datetime: '2025-01-01',
            dateText: 'January 1, 2025',
            excerpt:
              "People choose Eastend for tanning because it’s clean, consistent, and designed around real\n      routines. This story shows how locals fit tanning into their day while handling laundry or\n      relaxing with a drink in the same visit.",
            serviceHref: '/tanning',
            serviceText: 'Learn more about tanning at Eastend'
          },
          {
            title: 'How Locals Combine Laundry and Self-Care at Eastend',
            href: '/blog/how-locals-combine-laundry-and-self-care',
            datetime: '2024-12-15',
            dateText: 'December 15, 2024',
            excerpt:
              'Many customers use Eastend to turn routine laundry into productive downtime. This story\n      explains how people tan, grab a drink, or relax while their laundry is running.',
            serviceHref: '/laundry',
            serviceText: 'View laundry services'
          },
          {
            title: 'What Kind of Place Is Eastend?',
            href: '/blog/what-kind-of-place-is-eastend',
            datetime: '2024-11-30',
            dateText: 'November 30, 2024',
            excerpt:
              'Eastend is more than a single-service business. This story answers what type of people come\n      here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.',
            serviceHref: '/tanning',
            serviceText: 'Explore the tanning studio'
          }
        ]
      }
    }
  };

  const data = content[page] || content.home;
  const isBlogPage = page === 'blog';

  // Render exact blog snippet markup for crawlers + noscript.
  const BlogSnippet = () => (
    <section id="people-of-eastend-blog">
      <h1>People of Eastend</h1>

      <p>
        People of Eastend shares real stories from customers and locals who use Eastend for tanning,
        laundry, drinks, and self-care. Each story answers common questions about what Eastend is like,
        who it’s for, and how people combine multiple services in one visit.
      </p>

      {/* BLOG ENTRY 1 */}
      <article>
        <h2>
          <a href="/blog/why-people-choose-tanning-at-eastend">Why People Choose Tanning at Eastend</a>
        </h2>
        <time dateTime="2025-01-01">January 1, 2025</time>
        <p>
          People choose Eastend for tanning because it’s clean, consistent, and designed around real
          routines. This story shows how locals fit tanning into their day while handling laundry or
          relaxing with a drink in the same visit.
        </p>
        <a href="/tanning">Learn more about tanning at Eastend</a>
      </article>

      {/* BLOG ENTRY 2 */}
      <article>
        <h2>
          <a href="/blog/how-locals-combine-laundry-and-self-care">
            How Locals Combine Laundry and Self-Care at Eastend
          </a>
        </h2>
        <time dateTime="2024-12-15">December 15, 2024</time>
        <p>
          Many customers use Eastend to turn routine laundry into productive downtime. This story
          explains how people tan, grab a drink, or relax while their laundry is running.
        </p>
        <a href="/laundry">View laundry services</a>
      </article>

      {/* BLOG ENTRY 3 */}
      <article>
        <h2>
          <a href="/blog/what-kind-of-place-is-eastend">What Kind of Place Is Eastend?</a>
        </h2>
        <time dateTime="2024-11-30">November 30, 2024</time>
        <p>
          Eastend is more than a single-service business. This story answers what type of people come
          here, why they stay longer than planned, and how Eastend functions as a local lifestyle hub.
        </p>
        <a href="/tanning">Explore the tanning studio</a>
      </article>
    </section>
  );

  return (
    <>
      {/* Noscript fallback - visible to crawlers and non-JS users */}
      <noscript>
        {isBlogPage ? (
          <BlogSnippet />
        ) : (
          <div
            className="seo-fallback"
            style={{
              padding: '20px',
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8'
            }}
          >
            <h1
              style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                color: '#1a1a1a',
                fontWeight: 'bold'
              }}
            >
              {data.h1}
            </h1>

            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#333', lineHeight: '1.8' }}>
              {data.intro}
            </p>

            {data.sections &&
              data.sections.map((section, i) => (
                <section key={i} style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>
                    {section.h2}
                  </h2>
                  <p style={{ color: '#444', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                    {section.content}
                  </p>
                </section>
              ))}

            {data.internalLinks && (
              <nav
                style={{
                  marginTop: '3rem',
                  padding: '1.5rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}
              >
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Explore Eastend Services</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {data.internalLinks.map((link, i) => (
                    <li key={i} style={{ marginBottom: '0.75rem' }}>
                      <a
                        href={link.url}
                        style={{ color: '#d97706', textDecoration: 'none', fontSize: '1rem' }}
                      >
                        → {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <footer style={{ marginTop: '3rem' }}>
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d97706' }}>
                  Eastend (Main Location) - Full Service Hub
                </h2>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Services:</strong> Tanning (Primary), Laundry (Free Drying), Fizze Drinks, Fast Nails,
                  Food Truck Stop
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Address:</strong> 818 Coshocton Ave, Mt Vernon, OH 43050
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:7403979632" style={{ color: '#fbbf24' }}>
                    (740) 397-9632
                  </a>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Hours:</strong> Monday - Sunday, 8:00 AM - 7:30 PM
                </p>
                <p>
                  <strong>Parking:</strong> Free lot behind building with front-door access
                </p>
              </div>

              <div style={{ padding: '2rem', backgroundColor: '#374151', color: '#fff', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#9ca3af' }}>
                  Westend Laundry - Laundry Only (24/7)
                </h2>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Services:</strong> Self-Service Coin Laundry ONLY (No tanning, drinks, nails, or food)
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Address:</strong> 3024 Coshocton Rd, Mt Vernon, OH 43050
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:7403979632" style={{ color: '#9ca3af' }}>
                    (740) 397-9632
                  </a>
                </p>
                <p>
                  <strong>Hours:</strong> Open 24/7/365 - Self Service
                </p>
              </div>
            </footer>

            {/* Schema.org structured data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'LocalBusiness',
                  name: 'Eastend Tanning & Laundry',
                  description:
                    'Tanning-centered local service hub in Mt Vernon, Ohio. Primary service: professional indoor tanning. Complementary services: coin laundry with free drying, Fizze bubble tea, Fast Nails, 818 Food Truck Stop.',
                  url: 'https://eastend.website',
                  telephone: '(740) 397-9632',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: '818 Coshocton Ave',
                    addressLocality: 'Mt Vernon',
                    addressRegion: 'OH',
                    postalCode: '43050',
                    addressCountry: 'US'
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 40.3834,
                    longitude: -82.4657
                  },
                  openingHours: 'Mo-Su 08:00-19:30',
                  priceRange: '$$',
                  areaServed: 'Knox County, Ohio',
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Eastend Services',
                    itemListElement: [
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Indoor Tanning',
                          description: 'Primary service. 6 professional tanning bed levels including the 40,740W Matrix.'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Coin Laundry',
                          description: 'Complementary service. FREE drying every day.'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Fizze Drinks',
                          description: 'Complementary service. 52+ flavors of bubble tea and smoothies.'
                        }
                      },
                      {
                        '@type': 'Offer',
                        itemOffered: {
                          '@type': 'Service',
                          name: 'Fast Nails',
                          description: 'Complementary service. Quick manicures and pedicures.'
                        }
                      }
                    ]
                  }
                })
              }}
            />
          </div>
        )}
      </noscript>

      {/* Hidden crawlable content - always in DOM for search engines */}
      <div
        className="seo-hidden-content"
        style={{ position: 'absolute', left: '-9999px', top: '0', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-hidden="true"
      >
        {isBlogPage ? (
          <BlogSnippet />
        ) : (
          <>
            <h1>{data.h1}</h1>
            <p>{data.intro}</p>

            {data.sections &&
              data.sections.map((section, i) => (
                <section key={i}>
                  <h2>{section.h2}</h2>
                  <p>{section.content}</p>
                </section>
              ))}

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

            <div itemScope itemType="https://schema.org/LocalBusiness">
              <span itemProp="name">Eastend Tanning & Laundry (Main Location)</span>
              <span itemProp="description">
                Tanning-centered local service hub. Primary: Indoor Tanning. Complementary: Laundry, Drinks,
                Nails, Food.
              </span>
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
              <span itemProp="description">
                Self-service coin laundry only. No tanning, drinks, nails, or food services. Sister location
                to Eastend.
              </span>
              <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="streetAddress">3024 Coshocton Rd</span>
                <span itemProp="addressLocality">Mt Vernon</span>
                <span itemProp="addressRegion">OH</span>
                <span itemProp="postalCode">43050</span>
              </div>
              <span itemProp="telephone">(740) 397-9632</span>
              <span itemProp="openingHours">Mo-Su 00:00-23:59</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
