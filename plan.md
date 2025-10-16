# Eastend Tanning & Laundry – Project Plan

## 1) Executive Summary
Build a modern, mobile-first, SEO-optimized website for Eastend Tanning & Laundry in Mount Vernon, Ohio. The site will funnel visitors into three key divisions—Tanning Studio, Laundromat (Eastend + Westend), and Fizze Drinks—optimizing for conversions: call, directions, and in-person visits. Visual identity: sunny gold (primary), teal blue (secondary), soft whites, with Bento card layout and Swiss-grid clarity, following the provided design guidelines.

## 2) Objectives
- Drive local conversions for “tanning in Mount Vernon,” “laundromat near me,” and “bubble tea Mount Vernon Ohio.”
- Clear funnels to Tanning, Laundry, and Fizze Drinks from the home hero and navigation.
- Show hours, addresses, and Google review links per location with one-tap Call/Directions on mobile.
- Provide an accessible, fast, and polished UX using Shadcn UI, Tailwind tokens, and strict test IDs.
- Simple contact form stored via FastAPI + MongoDB (UUID IDs, timezone-aware timestamps).

## 3) UI/UX Design Guidelines (from design_guidelines.md)
- Color tokens
  - Primary (sunny gold): hsl(42 92% 55%) → main CTAs
  - Secondary (teal): hsl(183 55% 43%) → secondary CTAs/links/map pins
  - Surfaces: white and very light gold; avoid dark-on-dark
  - Gradients: only for large sections (hero), <20% viewport
- Typography
  - Headings: Spectral (H1/H3, 600–700)
  - Body/UI: Manrope (400–600)
- Layout & components
  - Swiss grid + Bento cards; glassmorphism accents sparingly
  - Use Shadcn components exclusively (Button, Card, Tabs, Accordion, Sonner, Sheet, Carousel, etc.)
  - Every interactive and critical info element requires data-testid
- Motion
  - Subtle, targeted transitions (no transition: all). Prefer framer-motion for micro-interactions
- Accessibility
  - WCAG AA contrast; visible focus rings using --ring token; keyboard navigable; alt text on images

## 4) Real Business Data (from web search; can be refined with owner confirmation)
- Eastend Tanning & Laundry
  - Address: 818 Coshocton Ave, Mount Vernon, OH 43050
  - Phone: (740) 397-9632
  - Hours: Mon–Fri 8:00 AM–7:30 PM; Sun 8:00 AM–10:00 PM (Saturday TBD/verify)
- Fizze Drinks (inside Eastend)
  - Address: 818 Coshocton Ave, Mount Vernon, OH 43050
  - Phone: (740) 280-9400
  - Hours: Mon–Fri 7:30 AM–6:00 PM; Sat–Sun 8:00 AM–4:00 PM
- Westend Laundry
  - Address: 116 S Norton St, Mount Vernon, OH 43050
  - Phone: (740) 393-3766
  - Hours: Daily 6:00 AM–10:00 PM

Note: Tanning levels (Matrix, stand-up, red-light therapy among 5 levels) and Fizze menu specifics will be presented with concise benefits and sample copy if exact details aren’t publicly listed.

## 5) Scope and Deliverables
- Pages: Home, Tanning, Laundry, Drinks, Locations, Contact
- Components: Header, Footer, ServiceCard, HoursTable, Gallery (carousel), LocationMap (embed first), ContactForm
- Backend: POST /api/contact to store inquiries in MongoDB with UUIDs; basic healthcheck
- SEO & Analytics: On-page SEO, meta tags, schema.org LocalBusiness JSON-LD, optimized images

## 6) Implementation Plan (Phased)

Phase 1 – MVP Home + Nav (In Progress)
- Add global design tokens, fonts, and base styles per design_guidelines.md
- Header with responsive nav (Sheet on mobile) + “Call” and “Directions” CTAs
- Home hero with 3 ServiceCard funnels (Tanning, Laundry, Drinks) and About teaser
- Display mini location strip (Eastend + Westend) with hours and CTA buttons

Phase 2 – Core Pages
- Tanning page: levels overview (Tabs), benefits, photos, CTA (Call/Directions)
- Laundry page: two location cards with amenities/hours/photos
- Drinks page: hero + menu highlight grid; CTA with hours

Phase 3 – Contact + Backend
- Contact page: validated form using Shadcn components; POST /api/contact; toasts via Sonner
- FastAPI model with UUID id, created_at (timezone-aware), basic input validation via Pydantic

Phase 4 – Locations & Maps
- Locations page: cards for Eastend & Westend with embedded Google Maps, Call/Directions/Reviews
- Optional: upgrade to Leaflet for interactive map (yarn add react-leaflet leaflet)

Phase 5 – Gallery & Reviews
- Photo gallery (Carousel) per category tabs: All, Tanning, Laundry, Drinks
- External Google review links prominently placed on Home and Locations

Phase 6 – SEO, Performance, A11y
- Titles/meta descriptions, H1s with “Mount Vernon, Ohio” where natural
- LocalBusiness JSON-LD per location
- Image compression, lazy-loading; lighthouse pass targets; keyboard nav and focus states

Phase 7 – Testing & Polish
- Add data-testid across interactive/critical info items
- Run testing agent for flows (nav links, CTAs, contact submit, hours visibility)
- UI polish per guidelines (spacing, hover/focus states, skeleton loaders)

## 7) Technical Details
- Tech stack
  - Frontend: React + Tailwind + Shadcn/UI; React Router; framer-motion
  - Backend: FastAPI; MongoDB via MONGO_URL env; bind 0.0.0.0:8001
- Environment constraints
  - Use yarn (never npm) for dependencies
  - Frontend to backend via REACT_APP_BACKEND_URL + “/api” prefix
  - Do not modify .env values
- Backend endpoints (initial)
  - POST /api/contact – payload: { id: uuid, full_name, email, phone, service_interest, message, created_at }
  - GET /api/health – basic healthcheck
- Data & timestamps
  - UUID4 string IDs; datetimes with timezone.utc
- UI requirements
  - Use Shadcn components instead of base HTML when available
  - Include data-testid on all interactive and key info elements

## 8) Information Architecture & Content
- Top Nav: Tanning, Laundry, Fizze Drinks, Locations, Contact
- Home: hero (H1 + primary Call now + secondary Directions) → ServiceCard trio funnels → About teaser → Location strip → Gallery preview → Google reviews links
- Tanning: levels overview (Tabs), photos, benefits, CTA bar
- Laundry: amenities per location, hours, photos, Call/Directions buttons
- Drinks: colorful grid of popular items with brief tags; hours; CTA
- Locations: cards with maps (embed), hours, Call, Directions, Reviews
- Contact: form with toast feedback and address detail

## 9) SEO Strategy
- Keyword targets: “tanning in Mount Vernon,” “laundromat near me,” “bubble tea Mount Vernon Ohio”
- Per-page H1s and meta; city/state mentions where natural
- LocalBusiness JSON-LD markup; consistent NAP data across pages
- Fast, responsive, accessible; optimized images; internal linking between divisions

## 10) Risks & Assumptions
- Some hours/menu details may change; site will be built to update copy easily
- Tanning level specifics may require confirmation; launch with clean, benefit-led copy
- Interactive map via Leaflet is optional; Google Maps embeds will be default for speed

## 11) Milestones & Timeline (agile, subject to change)
- Day 1–2: Phase 1 MVP Home + Nav
- Day 2–3: Phase 2 core pages
- Day 3–4: Contact + backend endpoint
- Day 4: Locations page + maps
- Day 5: Gallery + reviews + SEO pass + testing & polish

## 12) Next Actions
- Implement Phase 1 (Home + Nav + Location strip)
- Install any required frontend libs via yarn (react-router-dom, framer-motion if not present)
- Add backend POST /api/contact
- Prepare initial gallery images from design_guidelines.md image URLs

## 13) Success Criteria
- Home funnels (Tanning, Laundry, Drinks) visible above the fold and working
- One-tap Call and Directions present on mobile and desktop
- Accurate hours and addresses displayed for Eastend, Westend, and Fizze Drinks
- Contact form submits successfully to backend and shows toasts
- Lint/build checks pass; app loads without console errors; accessible and responsive
