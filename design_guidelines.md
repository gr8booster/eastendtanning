{
  "brand": {
    "name": "Eastend Tanning & Laundry",
    "tagline": "Sun. Clean. Fizze.",
    "attributes": ["welcoming", "local", "energetic", "clean", "trustworthy"],
    "personality_notes": "Bright, friendly, community-first. Visuals should blend warm sunshine (tanning), crisp water/cleanliness (laundry), and bubbly playfulness (Fizze drinks)."
  },
  "app_type": "Local multi-service business website (tanning studio, laundromat, drinks)",
  "audience": ["Mount Vernon residents", "young adults & students", "families", "walk-ins"],
  "primary_success_actions": ["tap CTA to call", "open maps for directions", "view hours per location", "browse services & pricing", "view gallery", "leave/read Google reviews"],
  "routing_structure": {
    "pages": [
      {"file": "src/pages/Home.jsx", "route": "/"},
      {"file": "src/pages/Tanning.jsx", "route": "/tanning"},
      {"file": "src/pages/Laundry.jsx", "route": "/laundry"},
      {"file": "src/pages/Drinks.jsx", "route": "/drinks"},
      {"file": "src/pages/Locations.jsx", "route": "/locations"},
      {"file": "src/pages/Contact.jsx", "route": "/contact"}
    ],
    "notes": "Use react-router-dom. Pages must use default exports. All new code examples in .jsx/.js (not .tsx)."
  },
  "typography": {
    "fonts": {
      "heading": "Spectral",
      "ui_and_body": "Manrope"
    },
    "google_import": "<link href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Spectral:wght@600;700&display=swap\" rel=\"stylesheet\">",
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-[-0.01em]",
      "h2": "text-base md:text-lg leading-snug",
      "h3": "text-xl sm:text-2xl leading-tight",
      "body": "text-base sm:text-sm leading-relaxed",
      "small": "text-sm",
      "overline": "uppercase tracking-[0.18em] text-xs"
    },
    "usage": {
      "headings": "Use Spectral for H1/H3 only to add warmth; keep H2 small as spec. Manrope for navigation, CTA, body, labels.",
      "weights": "Headings 600–700; body 400–500; buttons 600.",
      "line_length": "45–75ch for text blocks"
    }
  },
  "design_tokens": {
    "colors_hsl": {
      "--background": "48 100% 99%", 
      "--foreground": "210 15% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "210 15% 10%",
      "--primary": "42 92% 55%", 
      "--primary-foreground": "210 20% 5%",
      "--secondary": "183 55% 43%", 
      "--secondary-foreground": "0 0% 100%",
      "--accent": "172 45% 84%", 
      "--accent-foreground": "210 15% 15%",
      "--muted": "210 25% 96%",
      "--muted-foreground": "210 10% 40%",
      "--border": "210 18% 88%",
      "--input": "210 18% 88%",
      "--ring": "183 55% 43%",
      "--destructive": "8 78% 55%",
      "--destructive-foreground": "0 0% 100%",
      "--radius": "0.75rem",
      "--sun-50": "43 100% 97%",
      "--sun-200": "43 96% 85%",
      "--sun-400": "42 92% 55%",
      "--teal-50": "183 45% 96%",
      "--teal-300": "183 55% 60%",
      "--teal-600": "183 55% 36%"
    },
    "css_snippet": "@layer base{ :root{ --background:48 100% 99%; --foreground:210 15% 10%; --card:0 0% 100%; --card-foreground:210 15% 10%; --primary:42 92% 55%; --primary-foreground:210 20% 5%; --secondary:183 55% 43%; --secondary-foreground:0 0% 100%; --accent:172 45% 84%; --accent-foreground:210 15% 15%; --muted:210 25% 96%; --muted-foreground:210 10% 40%; --border:210 18% 88%; --input:210 18% 88%; --ring:183 55% 43%; --destructive:8 78% 55%; --destructive-foreground:0 0% 100%; --radius:0.75rem; } .dark{ --background:210 15% 7%; --foreground:0 0% 100%; --card:210 15% 9%; --card-foreground:0 0% 100%; --primary:42 92% 60%; --primary-foreground:210 20% 5%; --secondary:183 55% 46%; --secondary-foreground:0 0% 100%; --accent:172 35% 22%; --accent-foreground:0 0% 100%; --muted:210 15% 16%; --muted-foreground:210 10% 70%; --border:210 15% 18%; --input:210 15% 18%; --ring:183 55% 52%; } }",
    "spacing": {
      "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 40, "2xl": 64
    },
    "shadows": {
      "elev-1": "0 1px 2px rgba(20,24,40,0.06), 0 1px 1px rgba(20,24,40,0.04)",
      "elev-2": "0 6px 16px rgba(20,24,40,0.08)",
      "glow-teal": "0 0 0 3px hsl(183 55% 86%)"
    },
    "buttons": {
      "radius": "var(--radius)",
      "shadow": "var(--btn-shadow, 0 6px 16px rgba(20,24,40,0.10))",
      "motion": "transition-colors 200ms ease, box-shadow 200ms ease"
    },
    "textures": {
      "noise_css": ".noise{ position:absolute; inset:0; pointer-events:none; background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.025\\' /></svg>'); }"
    }
  },
  "color_system_usage": {
    "primary": "Sunny gold for brand highlights and main CTAs.",
    "secondary": "Teal for links, secondary CTAs, accents, map pins.",
    "surfaces": "White and very light gold for cards and content. Avoid dark-on-dark.",
    "gradients": {
      "rules": "Use only for large section backgrounds (hero, split sections). Keep light/pastel, max 20% viewport, no saturated purple/pink/blue stacks.",
      "examples": [
        "bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))]",
        "bg-[radial-gradient(60%_40%_at_20%_10%,hsl(43_96%_92%)_0%,transparent_60%)]"
      ]
    }
  },
  "layout": {
    "style_mix": "Fusion of Swiss grid clarity + Bento cards + subtle Glassmorphism accents for hero CTAs only.",
    "container": "container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]",
    "grid_system": {
      "mobile_first": true,
      "cols": {"base": 4, "md": 8, "lg": 12},
      "gaps": "gap-4 md:gap-6 lg:gap-8"
    },
    "header_nav": {
      "desktop": "sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b",
      "mobile": "use Sheet from shadcn for hamburger. CTA buttons always visible.",
      "avoid": ".App { text-align:center } is not allowed; keep left-aligned content flow."
    },
    "home_hero": {
      "structure": "Two rows: Row 1 brand + claim + CTA buttons; Row 2 a 3-up Bento for Tanning/Laundry/Drinks with illustrations/photos.",
      "classes": "relative py-12 sm:py-16 lg:py-20 bg-[linear-gradient(135deg,hsl(43_96%_96%),hsl(183_45%_96%))] overflow-hidden",
      "parallax": "Decorative sunburst radial and floating bubbles (CSS transform with framer-motion on scroll)."
    },
    "bento_cards": {
      "wrapper": "grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6",
      "card": "relative rounded-xl p-5 bg-white/80 backdrop-blur border shadow-sm hover:shadow-md transition-[box-shadow,background-color] duration-200",
      "variants": {
        "tanning": "from-[hsl(43_96%_96%)] to-transparent",
        "laundry": "from-[hsl(183_45%_96%)] to-transparent",
        "drinks": "from-[hsl(172_45%_94%)] to-transparent"
      }
    },
    "sections": [
      {"id": "about", "classes": "py-12 lg:py-20 bg-white"},
      {"id": "locations", "classes": "py-12 lg:py-20 bg-muted"},
      {"id": "gallery", "classes": "py-12 lg:py-20 bg-white"},
      {"id": "contact", "classes": "py-12 lg:py-20 bg-muted"}
    ]
  },
  "components": {
    "component_path": {
      "button": "./components/ui/button",
      "card": "./components/ui/card",
      "accordion": "./components/ui/accordion",
      "navigationMenu": "./components/ui/navigation-menu",
      "sheet": "./components/ui/sheet",
      "badge": "./components/ui/badge",
      "tabs": "./components/ui/tabs",
      "dialog": "./components/ui/dialog",
      "carousel": "./components/ui/carousel",
      "pagination": "./components/ui/pagination",
      "sonner": "./components/ui/sonner",
      "input": "./components/ui/input",
      "textarea": "./components/ui/textarea",
      "select": "./components/ui/select",
      "label": "./components/ui/label",
      "separator": "./components/ui/separator",
      "switch": "./components/ui/switch",
      "table": "./components/ui/table"
    },
    "new_components_to_create": [
      {"file": "src/components/ServiceCard.jsx", "export": "named", "desc": "Icon/image + short copy + CTA for Tanning/Laundry/Drinks.", "testid_required": true},
      {"file": "src/components/HoursTable.jsx", "export": "named", "desc": "Tabular hours per location with day grouping.", "testid_required": true},
      {"file": "src/components/LocationMap.jsx", "export": "named", "desc": "Leaflet map with markers and Directions/Call buttons.", "testid_required": true},
      {"file": "src/components/Gallery.jsx", "export": "named", "desc": "Carousel-based photo gallery; supports category filters.", "testid_required": true}
    ],
    "buttons": {
      "style": "Professional / Corporate",
      "classes": {
        "primary": "inline-flex items-center justify-center rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-3 font-semibold shadow-sm hover:bg-[hsl(42_92%_50%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))] disabled:opacity-50 disabled:cursor-not-allowed",
        "secondary": "inline-flex items-center justify-center rounded-md bg-[hsl(var(--secondary))] text-white px-5 py-3 font-semibold shadow-sm hover:bg-[hsl(183_55%_38%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))]",
        "ghost": "inline-flex items-center justify-center rounded-md border px-5 py-3 hover:bg-muted"
      },
      "sizes": {"sm": "h-9 px-3 text-sm", "md": "h-11 px-5", "lg": "h-12 px-6 text-base"}
    },
    "forms": {
      "rules": "Use shadcn Input, Textarea, Select only. Each interactive element must have a unique data-testid.",
      "contact_fields": ["full_name", "email", "phone", "message", "service_interest"],
      "validation": "Client-side required + FastAPI validation server-side. Use sonner for success/error."
    },
    "micro_interactions": [
      "Buttons: subtle shade shift and ring on focus; no transition: all.",
      "Hero bubbles: slow float via framer-motion y-axis oscillation.",
      "Gallery slides: fade + scale in.",
      "Navigation: underline-from-left hover using bg-gradient-size on link." 
    ]
  },
  "sample_components_jsx": {
    "service_card": "export const ServiceCard = ({ title, description, ctaText, href, imageUrl, tone = 'tanning' }) => { return ( <div data-testid=\"service-card\" className=\"group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-[box-shadow,transform] duration-200 hover:shadow-md\"> <img src={imageUrl} alt=\"\" className=\"h-40 w-full object-cover\"/> <div className=\"p-4 space-y-2\"> <h3 className=\"font-semibold text-lg\">{title}</h3> <p className=\"text-sm text-muted-foreground\">{description}</p> <a data-testid=\"service-card-cta\" href={href} className=\"inline-flex items-center gap-2 text-[hsl(var(--secondary))] font-semibold hover:underline\">{ctaText}<span aria-hidden>→</span></a> </div> <div aria-hidden className=\"pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/0\"/> </div> ); }",
    "contact_form": "export const ContactForm = () => { return ( <form data-testid=\"contact-form\" className=\"grid grid-cols-1 sm:grid-cols-2 gap-4\"> <div className=\"sm:col-span-1\"><label htmlFor=\"full_name\" className=\"block text-sm font-medium\">Full name</label><input data-testid=\"contact-form-full-name-input\" id=\"full_name\" className=\"mt-1 w-full h-11 rounded-md border px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]\" placeholder=\"Jane Doe\"/></div> <div className=\"sm:col-span-1\"><label htmlFor=\"email\" className=\"block text-sm font-medium\">Email</label><input type=\"email\" data-testid=\"contact-form-email-input\" id=\"email\" className=\"mt-1 w-full h-11 rounded-md border px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]\" placeholder=\"you@email.com\"/></div> <div className=\"sm:col-span-1\"><label htmlFor=\"phone\" className=\"block text-sm font-medium\">Phone</label><input data-testid=\"contact-form-phone-input\" id=\"phone\" className=\"mt-1 w-full h-11 rounded-md border px-3\" placeholder=\"(740) 000-0000\"/></div> <div className=\"sm:col-span-1\"><label htmlFor=\"service_interest\" className=\"block text-sm font-medium\">Interested in</label><select id=\"service_interest\" data-testid=\"contact-form-service-select\" className=\"mt-1 w-full h-11 rounded-md border px-3\"><option>Tanning</option><option>Laundry</option><option>Fizze Drinks</option></select></div> <div className=\"sm:col-span-2\"><label htmlFor=\"message\" className=\"block text-sm font-medium\">Message</label><textarea id=\"message\" data-testid=\"contact-form-message-textarea\" className=\"mt-1 w-full h-28 rounded-md border px-3 py-2\" placeholder=\"How can we help?\"/></div> <div className=\"sm:col-span-2\"><button data-testid=\"contact-form-submit-button\" type=\"submit\" className=\"inline-flex items-center justify-center rounded-md bg-[hsl(var(--secondary))] text-white px-6 h-12 font-semibold hover:bg-[hsl(183_55%_38%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))]\">Send</button></div> </form> ); }"
  },
  "navigation_and_ia": {
    "topbar": "Left: wordmark; Center/Right: links (Tanning, Laundry, Fizze Drinks, Locations, Gallery, Contact). Mobile: hamburger -> Sheet with same links, plus Call and Directions CTAs.",
    "home_split_funnels": "Above the fold, show three bento cards: each with short copy and a bold CTA to its service page.",
    "footer": "Include address, hours highlights, social, and Google review links."
  },
  "pages_blueprints": {
    "Home.jsx": [
      "Hero with H1 + two CTAs: 'Call now' (primary) and 'Find a location' (secondary).",
      "Three ServiceCard entries (Tanning, Laundry, Drinks) with respective imagery.",
      "About teaser (2–3 sentences) + link to About section on same page.",
      "Locations strip: mini cards for Eastend & Westend with hours and 'Directions' button.",
      "Gallery carousel preview.",
      "Google reviews logos/buttons linking out."
    ],
    "Tanning.jsx": [
      "Explain 5 levels: Matrix, stand-up, red-light therapy, etc.",
      "Use Tabs for levels with photos and benefits.",
      "Pricing and FAQs (Accordion).",
      "CTA: Call, Directions to Eastend."
    ],
    "Laundry.jsx": [
      "Two locations (Eastend & Westend) with amenities, hours, machine types.",
      "Map with markers and 'Get Directions'.",
      "Cleanliness and convenience photos.",
      "CTA bar fixed at bottom on mobile with Call + Directions."
    ],
    "Drinks.jsx": [
      "Hero with colorful drinks, seasonal feature, and menu highlight.",
      "Grid of popular drinks (Card) with tags (Badge).",
      "CTA: Visit in-store, Hours panel."
    ],
    "Locations.jsx": [
      "Map + cards of each location with hours table, tap-to-call, review link."] ,
    "Contact.jsx": [
      "Contact form, address info, map embed, and sonner toast feedback."]
  },
  "images_and_media": {
    "image_urls": [
      {"url": "https://images.unsplash.com/photo-1543692276-3749f8b1ddd6?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Washing machine close-up", "category": "laundry gallery"},
      {"url": "https://images.unsplash.com/photo-1583810266903-fb9cc6e84376?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Self-service laundromat row", "category": "laundry hero or gallery"},
      {"url": "https://images.unsplash.com/photo-1677666939395-fbeb465f80d0?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Washer/dryer room", "category": "locations section"},
      {"url": "https://images.pexels.com/photos/9090072/pexels-photo-9090072.jpeg", "description": "Colorful bubble tea set", "category": "drinks hero"},
      {"url": "https://images.pexels.com/photos/33212310/pexels-photo-33212310.jpeg", "description": "Bubble tea logo row", "category": "drinks section accent"},
      {"url": "https://images.unsplash.com/photo-1718890059333-c9bcec18dccb?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Teapot pour vibrant drink", "category": "drinks gallery"}
    ],
    "usage_rules": [
      "Optimize images (<=1600px width), lazy-load below the fold.",
      "Avoid gradients over text-heavy areas; keep copy on solid surfaces.",
      "All images require alt text for accessibility."
    ]
  },
  "motion": {
    "library": "framer-motion",
    "install": "npm i framer-motion",
    "principles": ["subtle, purposeful", "delay-25ms staggering", "reduced motion respects prefers-reduced-motion"],
    "patterns": {
      "fade_in_up": "initial:{opacity:0,y:8} animate:{opacity:1,y:0} transition:{duration:0.35,ease:'easeOut'}",
      "bubble_float": "animate y:[-4,4] transition:{repeat:Infinity, repeatType:'mirror', duration:3.2}"
    }
  },
  "maps_and_locations": {
    "options": [
      "Embed Google Maps per location (simple, no extra lib).",
      "React-Leaflet for interactive map: npm i react-leaflet leaflet; import 'leaflet/dist/leaflet.css'"
    ],
    "ui": "Each location card has Call and Directions buttons with data-testid attributes.",
    "schema": {
      "location_doc": {
        "name": "string",
        "division": "'tanning' | 'laundry' | 'drinks'",
        "address": "string",
        "city": "Mount Vernon",
        "state": "OH",
        "zip": "string",
        "phone": "string",
        "hours": {"mon_fri": "8am–9pm", "sat": "8am–9pm", "sun": "9am–7pm"},
        "lat": 40.393, "lng": -82.485,
        "google_place_url": "string",
        "google_review_url": "string"
      }
    }
  },
  "seo_local": {
    "meta": ["Unique H1 per page with \"Mount Vernon, Ohio\" mention where natural.", "Title <= 60 chars; meta description <= 155 chars."],
    "url_structure": "/tanning, /laundry, /drinks, /locations/mount-vernon-eastend, /locations/mount-vernon-westend",
    "schema_org": {
      "type": "LocalBusiness",
      "json_ld_example": "{ \n  '@context': 'https://schema.org',\n  '@type': 'LocalBusiness',\n  'name': 'Eastend Tanning & Laundry',\n  'address': { '@type': 'PostalAddress', 'streetAddress': '123 E Main St', 'addressLocality': 'Mount Vernon', 'addressRegion': 'OH', 'postalCode': '43050' },\n  'telephone': '(740) 000-0000',\n  'openingHours': ['Mo-Sa 08:00-21:00','Su 09:00-19:00'],\n  'url': 'https://eastendtandl.com'\n}"
    },
    "performance": ["preload key fonts", "compress images", "avoid large gradients over 20% viewport"]
  },
  "accessibility": {
    "contrast": "Maintain WCAG AA (buttons and body text).",
    "focus": "Visible focus ring using --ring token.",
    "motion": "Respect prefers-reduced-motion; disable parallax/bubble animation if set.",
    "aria": "Label landmarks (header, nav, main, footer). Provide descriptive link names (e.g., 'Directions to Eastend').",
    "testing_ids": "All interactive elements AND key info must include data-testid attributes in kebab-case indicating role (e.g., data-testid='locations-directions-button', 'hours-today-text')."
  },
  "shadcn_mapping": {
    "nav": ["navigation-menu", "sheet"],
    "content": ["card", "separator", "accordion", "tabs"],
    "forms": ["input", "textarea", "select", "label"],
    "feedback": ["sonner", "dialog", "toast", "alert"],
    "media": ["carousel", "avatar", "badge"]
  },
  "microcopy": {
    "hero": "Sun-kissed tans. Sparkling laundry. Fizze drinks you’ll love.",
    "tanning_cta": "Explore tanning levels",
    "laundry_cta": "Find washers near you",
    "drinks_cta": "Sip Fizze specials"
  },
  "sample_layout_snippets": {
    "header_jsx": "import { Button } from './components/ui/button'; import { Sheet, SheetTrigger, SheetContent } from './components/ui/sheet'; export default function Header(){ return (<header className=\"sticky top-0 z-40 bg-white/80 backdrop-blur border-b\"> <div className=\"container mx-auto px-4 h-16 flex items-center justify-between\"> <a href=\"/\" className=\"font-serif text-xl\">Eastend</a> <nav className=\"hidden md:flex items-center gap-6\"> <a data-testid=\"nav-tanning-link\" href=\"/tanning\" className=\"hover:underline\">Tanning</a> <a data-testid=\"nav-laundry-link\" href=\"/laundry\" className=\"hover:underline\">Laundry</a> <a data-testid=\"nav-drinks-link\" href=\"/drinks\" className=\"hover:underline\">Fizze Drinks</a> <a data-testid=\"nav-locations-link\" href=\"/locations\" className=\"hover:underline\">Locations</a> <a data-testid=\"nav-contact-link\" href=\"/contact\" className=\"hover:underline\">Contact</a> </nav> <div className=\"hidden md:flex gap-3\"> <a data-testid=\"nav-call-button\" href=\"tel:+17400000000\" className=\"inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-4 h-10 font-semibold\">Call</a> <a data-testid=\"nav-directions-button\" href=\"https://maps.google.com/?q=Mount+Vernon+OH\" className=\"inline-flex items-center rounded-md border px-4 h-10\">Directions</a> </div> <div className=\"md:hidden\"> <Sheet> <SheetTrigger data-testid=\"nav-menu-button\" className=\"h-10 w-10 grid place-items-center border rounded-md\">☰</SheetTrigger> <SheetContent side=\"right\" className=\"w-72\"> <nav className=\"grid gap-4 mt-8\"> <a href=\"/tanning\">Tanning</a><a href=\"/laundry\">Laundry</a><a href=\"/drinks\">Fizze Drinks</a><a href=\"/locations\">Locations</a><a href=\"/contact\">Contact</a> <a data-testid=\"sheet-call-button\" className=\"mt-4 inline-flex items-center justify-center rounded-md bg-[hsl(var(--secondary))] text-white h-11\" href=\"tel:+17400000000\">Call now</a> </nav> </SheetContent> </Sheet> </div> </div></header> ); }",
    "locations_card_jsx": "export const LocationCard = ({name,address,hours,phone,placeUrl,reviewUrl})=> ( <div data-testid=\"location-card\" className=\"rounded-xl border bg-white p-5 shadow-sm\"> <h3 className=\"font-semibold text-lg\">{name}</h3> <p className=\"text-sm text-muted-foreground\">{address}</p> <div className=\"mt-3 text-sm\"> <div data-testid=\"hours-today-text\">Today: {hours.today}</div> </div> <div className=\"mt-4 flex gap-2\"> <a data-testid=\"location-call-button\" className=\"inline-flex items-center rounded-md bg-[hsl(var(--secondary))] text-white h-10 px-4\" href={`tel:${phone}`}>Call</a> <a data-testid=\"location-directions-button\" className=\"inline-flex items-center rounded-md border h-10 px-4\" href={placeUrl}>Directions</a> <a data-testid=\"location-reviews-link\" className=\"inline-flex items-center rounded-md border h-10 px-4\" href={reviewUrl}>Reviews</a> </div> </div> );"
  },
  "gallery": {
    "component": "./components/ui/carousel",
    "empty_state": "Use Skeletons while images load; show friendly copy if no images.",
    "filters": "Tabs: All, Tanning, Laundry, Drinks"
  },
  "analytics_and_toasts": {
    "toasts": "Use sonner for success/failure states (contact form submit, copy address).",
    "events_testids": ["contact-form-submit-button", "location-directions-button", "service-card-cta"]
  },
  "web_search_inspiration": {
    "queries": [
      "tanning salon website design on Dribbble",
      "bubble tea vibrant website case studies; laundromat UI; local business hours/maps CTA"
    ],
    "citations": [
      "https://dribbble.com/tags/tanning-salon",
      "https://artversion.com/portfolio/bobastraw/"
    ],
    "takeaways": [
      "Use bento card layouts to compartmentalize multi-service offerings.",
      "Vibrant drinks imagery benefits from playful accents; laundromat benefits from bright, clean photography."
    ]
  },
  "libraries": {
    "required": [
      {"name": "react-router-dom", "install": "npm i react-router-dom"},
      {"name": "framer-motion", "install": "npm i framer-motion"}
    ],
    "optional": [
      {"name": "react-leaflet + leaflet", "install": "npm i react-leaflet leaflet", "note": "Interactive maps; otherwise use Google Maps embed."},
      {"name": "lottie-react", "install": "npm i lottie-react", "note": "Optional subtle bubble animation if not using Framer Motion."}
    ]
  },
  "qa_testing": {
    "policy": "Every interactive and key informational element MUST include a data-testid attribute in kebab-case that indicates role.",
    "examples": [
      "data-testid=\"home-hero-primary-cta-button\"",
      "data-testid=\"locations-map\"",
      "data-testid=\"google-reviews-link\""
    ]
  },
  "instructions_to_main_agent": [
    "Update index.css :root tokens with design_tokens.css_snippet. Keep dark class as provided, aligned to brand.",
    "Load Google Fonts link in index.html and set body { font-family: Manrope } and .font-serif { font-family: Spectral }.",
    "Build Header.jsx from sample, ensure Sheet on mobile with dedicated call/directions buttons.",
    "Create ServiceCard.jsx, HoursTable.jsx, LocationMap.jsx, Gallery.jsx as named exports. Implement data-testid attributes on all interactive elements.",
    "Home.jsx: implement hero + bento 3-up using cards. Add subtle radial gradient decoration, ensure gradient area <= 20% viewport.",
    "Locations.jsx: if using Leaflet, remember to import CSS and set height on map container.",
    "Contact.jsx: use provided ContactForm; on submit, call FastAPI endpoint POST /api/contact. Use sonner for feedback.",
    "Ensure all CTAs are tel: links or Google Maps links for easy conversions on mobile.",
    "Do not add universal CSS transitions (transition: all). Only on specific properties.",
    "Avoid center aligning entire app container; keep natural left-aligned flow."
  ]
}


<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
