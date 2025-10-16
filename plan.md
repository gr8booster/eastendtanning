# Eastend Tanning & Laundry – Project Plan (Updated)

## 1) Executive Summary
Build a modern, mobile-first, SEO-optimized website for Eastend Tanning & Laundry in Mount Vernon, Ohio. The site will funnel visitors into three key divisions—Tanning Studio, Laundromat (Eastend + Westend), and Fizze Drinks—optimizing for conversions: call, directions, and in-person visits. Visual identity: sunny gold (primary), teal blue (secondary), soft whites, with Bento card layout and Swiss-grid clarity, following the provided design guidelines.

**Current Status:** Phase 1 (MVP Home + Nav) COMPLETED. Moving to Phase 2 (Core Pages).

## 2) Objectives
- Drive local conversions for "tanning in Mount Vernon," "laundromat near me," and "bubble tea Mount Vernon Ohio."
- Clear funnels to Tanning, Laundry, and Fizze Drinks from the home hero and navigation. ✅ DONE
- Show hours, addresses, and Google review links per location with one-tap Call/Directions on mobile. ✅ DONE (Home page)
- Provide an accessible, fast, and polished UX using Shadcn UI, Tailwind tokens, and strict test IDs. ✅ DONE (Phase 1)
- Simple contact form stored via FastAPI + MongoDB (UUID IDs, timezone-aware timestamps). → PENDING (Phase 3)

## 3) UI/UX Design Guidelines (from design_guidelines.md)
- Color tokens ✅ IMPLEMENTED
  - Primary (sunny gold): hsl(42 92% 55%) → main CTAs
  - Secondary (teal): hsl(183 55% 43%) → secondary CTAs/links/map pins
  - Surfaces: white and very light gold; avoid dark-on-dark
  - Gradients: only for large sections (hero), <20% viewport
- Typography ✅ IMPLEMENTED
  - Headings: Spectral (H1/H3, 600–700)
  - Body/UI: Manrope (400–600)
- Layout & components ✅ IMPLEMENTED
  - Swiss grid + Bento cards; glassmorphism accents sparingly
  - Use Shadcn components exclusively (Button, Card, Tabs, Accordion, Sonner, Sheet, Carousel, etc.)
  - Every interactive and critical info element requires data-testid
- Motion ✅ IMPLEMENTED
  - Subtle, targeted transitions (no transition: all). Framer-motion for micro-interactions
- Accessibility ✅ IMPLEMENTED
  - WCAG AA contrast; visible focus rings using --ring token; keyboard navigable; alt text on images

## 4) Real Business Data (from web search)
- **Eastend Tanning & Laundry**
  - Address: 818 Coshocton Ave, Mount Vernon, OH 43050
  - Phone: (740) 397-9632
  - Hours: Mon–Fri 8:00 AM–7:30 PM; Sun 8:00 AM–10:00 PM
- **Fizze Drinks** (inside Eastend)
  - Address: 818 Coshocton Ave, Mount Vernon, OH 43050
  - Phone: (740) 280-9400
  - Hours: Mon–Fri 7:30 AM–6:00 PM; Sat–Sun 8:00 AM–4:00 PM
  - Menu: Coffee, Dirty Soda, Meal Replacement Shakes, Energy Bombs
- **Westend Laundry**
  - Address: 116 S Norton St, Mount Vernon, OH 43050
  - Phone: (740) 393-3766
  - Hours: Daily 6:00 AM–10:00 PM

Note: Tanning levels (Matrix, stand-up, red-light therapy among 5 levels) details will be expanded in Phase 2 with benefit-led copy.

## 5) Scope and Deliverables
- **Pages:** Home ✅, Tanning (basic) ✅, Laundry (basic) ✅, Drinks (basic) ✅, Locations (basic) ✅, Contact (basic) ✅
- **Components:** Header ✅, Footer ✅, ServiceCard ✅, HoursTable (pending), Gallery (pending), LocationMap (pending), ContactForm (pending)
- **Backend:** POST /api/contact to store inquiries in MongoDB with UUIDs; basic healthcheck (pending Phase 3)
- **SEO & Analytics:** On-page SEO, meta tags, schema.org LocalBusiness JSON-LD, optimized images (pending Phase 6)

## 6) Implementation Plan (Phased)

### Phase 1 – MVP Home + Nav ✅ COMPLETED
**Status:** COMPLETED

**Completed Tasks:**
- ✅ Installed react-router-dom and framer-motion dependencies
- ✅ Updated index.css with complete design tokens (sunny gold primary, teal secondary, proper fonts)
- ✅ Added Google Fonts (Spectral for headings, Manrope for UI/body) to index.html
- ✅ Created Header component with responsive nav (desktop links + mobile Sheet menu) and Call/Directions CTAs
- ✅ Created Footer with business info, locations, and quick links
- ✅ Created ServiceCard component for the three service funnels (Tanning, Laundry, Drinks)
- ✅ Built complete Home page with:
  - Hero section with gradient background and noise texture
  - 3-up Bento ServiceCards showcasing all three services with images
  - About section with community messaging
  - Locations strip with cards for Eastend & Westend with hours, phone, directions
  - Google Reviews section
- ✅ Set up React Router with routes for all pages (/, /tanning, /laundry, /drinks, /locations, /contact)
- ✅ Created basic placeholder pages for Tanning, Laundry, Drinks, Locations, and Contact
- ✅ Updated App.js with full router integration and layout (Header + Main + Footer + Toaster)
- ✅ Tested and verified UI matches design guidelines with screenshots
- ✅ Fixed HTML validation issues (replaced <p> with <div> for icon containers)

**Design Compliance Verified:**
- ✅ Sunny gold and teal blue colors applied correctly
- ✅ Spectral font for headings, Manrope for body
- ✅ Bento card layout with proper gradients (<20% viewport)
- ✅ All interactive elements have data-testid attributes
- ✅ Responsive design works on desktop and mobile
- ✅ No console errors
- ✅ Clean, professional UI with proper spacing and shadows

### Phase 2 – Core Pages (In Progress)
**Status:** NOT STARTED

**Tasks:**
- [ ] Expand Tanning page:
  - Add detailed tanning levels section (5 levels: Matrix, stand-up, red-light therapy, etc.)
  - Use Tabs or Accordion component for level breakdown
  - Include benefits, features, and photos for each level
  - Add FAQ section using Accordion
  - Prominent CTA bar (Call/Directions)
- [ ] Expand Laundry page:
  - Two location cards with detailed amenities
  - Photos of clean, modern facilities
  - Machine types and payment info
  - Emphasize cleanliness, safety, convenience
  - CTA buttons for both locations
- [ ] Expand Drinks page:
  - Hero with colorful drinks imagery
  - Menu grid with popular items using Card components
  - Add Badge components for drink categories
  - Hours panel with location info
  - CTA to visit in-store

### Phase 3 – Contact + Backend (Not Started)
**Status:** NOT STARTED

**Tasks:**
- [ ] Build ContactForm component with Shadcn Input, Textarea, Select, Label
- [ ] Implement client-side validation
- [ ] Create FastAPI endpoint: POST /api/contact
- [ ] Define Pydantic models for contact form with UUID, created_at (timezone-aware)
- [ ] Connect MongoDB for storing contact inquiries
- [ ] Implement Sonner toast notifications for success/error feedback
- [ ] Add contact info and map embed to Contact page
- [ ] Test form submission flow

### Phase 4 – Locations & Maps (Not Started)
**Status:** NOT STARTED

**Tasks:**
- [ ] Expand Locations page with detailed cards for Eastend & Westend
- [ ] Add embedded Google Maps for each location
- [ ] Include hours table (HoursTable component)
- [ ] Add Call, Directions, and Reviews buttons with proper links
- [ ] Optional: Implement Leaflet for interactive maps (yarn add react-leaflet leaflet)
- [ ] Test map functionality and mobile responsiveness

### Phase 5 – Gallery & Reviews (Not Started)
**Status:** NOT STARTED

**Tasks:**
- [ ] Create Gallery component using Carousel from Shadcn
- [ ] Implement category tabs: All, Tanning, Laundry, Drinks
- [ ] Add images from design_guidelines.md image URLs
- [ ] Implement lazy-loading for images
- [ ] Add external Google review links prominently on Home and Locations
- [ ] Test carousel functionality and image loading

### Phase 6 – SEO, Performance, A11y (Not Started)
**Status:** NOT STARTED

**Tasks:**
- [ ] Add unique page titles and meta descriptions for each page
- [ ] Include "Mount Vernon, Ohio" in H1s where natural
- [ ] Implement LocalBusiness JSON-LD schema markup per location
- [ ] Optimize and compress images
- [ ] Implement lazy-loading for below-the-fold images
- [ ] Run Lighthouse audit and address issues
- [ ] Verify keyboard navigation and focus states
- [ ] Test with screen readers

### Phase 7 – Testing & Polish (Not Started)
**Status:** NOT STARTED

**Tasks:**
- [ ] Verify all interactive elements have data-testid attributes
- [ ] Run testing agent for comprehensive flow testing:
  - Navigation links
  - Call and Directions CTAs
  - Contact form submission
  - Hours visibility
  - Mobile responsiveness
- [ ] UI polish pass:
  - Spacing consistency
  - Hover and focus states
  - Loading states (skeleton loaders)
  - Error states
- [ ] Cross-browser testing
- [ ] Final QA and bug fixes

## 7) Technical Details
- **Tech stack**
  - Frontend: React + Tailwind + Shadcn/UI; React Router; framer-motion ✅ IMPLEMENTED
  - Backend: FastAPI; MongoDB via MONGO_URL env; bind 0.0.0.0:8001 (pending Phase 3)
- **Environment constraints**
  - Use yarn (never npm) for dependencies ✅ FOLLOWED
  - Frontend to backend via REACT_APP_BACKEND_URL + "/api" prefix ✅ CONFIGURED
  - Do not modify .env values ✅ FOLLOWED
- **Backend endpoints** (to be implemented in Phase 3)
  - POST /api/contact – payload: { id: uuid, full_name, email, phone, service_interest, message, created_at }
  - GET /api/health – basic healthcheck
- **Data & timestamps**
  - UUID4 string IDs; datetimes with timezone.utc
- **UI requirements** ✅ IMPLEMENTED
  - Use Shadcn components instead of base HTML when available
  - Include data-testid on all interactive and key info elements

## 8) Information Architecture & Content
- **Top Nav:** Tanning, Laundry, Fizze Drinks, Locations, Contact ✅ IMPLEMENTED
- **Home:** hero (H1 + primary Call now + secondary Directions) → ServiceCard trio funnels → About teaser → Location strip → Google reviews links ✅ IMPLEMENTED
- **Tanning:** levels overview (Tabs/Accordion), photos, benefits, CTA bar → TO BE EXPANDED (Phase 2)
- **Laundry:** amenities per location, hours, photos, Call/Directions buttons → TO BE EXPANDED (Phase 2)
- **Drinks:** colorful grid of popular items with brief tags; hours; CTA → TO BE EXPANDED (Phase 2)
- **Locations:** cards with maps (embed), hours, Call, Directions, Reviews → TO BE EXPANDED (Phase 4)
- **Contact:** form with toast feedback and address detail → TO BE BUILT (Phase 3)

## 9) SEO Strategy (Phase 6)
- **Keyword targets:** "tanning in Mount Vernon," "laundromat near me," "bubble tea Mount Vernon Ohio"
- Per-page H1s and meta; city/state mentions where natural
- LocalBusiness JSON-LD markup; consistent NAP data across pages
- Fast, responsive, accessible; optimized images; internal linking between divisions

## 10) Risks & Assumptions
- Some hours/menu details may change; site is built to update copy easily ✅ ADDRESSED
- Tanning level specifics may require confirmation; will launch with clean, benefit-led copy
- Interactive map via Leaflet is optional; Google Maps embeds will be default for speed
- Contact form backend requires MongoDB setup in Phase 3

## 11) Milestones & Progress
- ✅ **Phase 1 (COMPLETED):** MVP Home + Nav with full routing and responsive design
- **Phase 2 (NEXT):** Core Pages expansion (Tanning, Laundry, Drinks detail pages)
- **Phase 3:** Contact form + backend API integration
- **Phase 4:** Enhanced Locations page with maps
- **Phase 5:** Gallery and review integration
- **Phase 6:** SEO, performance, and accessibility optimization
- **Phase 7:** Comprehensive testing and final polish

## 12) Next Actions (Phase 2)
1. Expand Tanning page with detailed levels, benefits, and FAQ
2. Expand Laundry page with amenities and facility photos
3. Expand Drinks page with full menu grid and categories
4. Take screenshots to verify design compliance for all expanded pages
5. Test navigation and CTAs across all pages

## 13) Success Criteria
- ✅ Home funnels (Tanning, Laundry, Drinks) visible above the fold and working
- ✅ One-tap Call and Directions present on mobile and desktop
- ✅ Accurate hours and addresses displayed for Eastend, Westend, and Fizze Drinks
- ✅ Header and Footer with full navigation implemented
- ✅ Responsive design verified on desktop and mobile
- ✅ Design guidelines followed (colors, fonts, spacing, components)
- ✅ No console errors; clean build
- [ ] Detailed content on Tanning, Laundry, and Drinks pages (Phase 2)
- [ ] Contact form submits successfully to backend and shows toasts (Phase 3)
- [ ] Maps and enhanced location details (Phase 4)
- [ ] Gallery with image carousel (Phase 5)
- [ ] SEO optimization and Lighthouse score >90 (Phase 6)
- [ ] Comprehensive testing passed (Phase 7)

## 14) Files Created/Modified (Phase 1)
**Created:**
- `/app/frontend/src/components/Header.jsx` – Responsive header with nav and CTAs
- `/app/frontend/src/components/Footer.jsx` – Footer with business info and links
- `/app/frontend/src/components/ServiceCard.jsx` – Reusable service card component
- `/app/frontend/src/pages/Home.jsx` – Complete home page with hero, cards, locations
- `/app/frontend/src/pages/Tanning.jsx` – Basic tanning page (to be expanded)
- `/app/frontend/src/pages/Laundry.jsx` – Basic laundry page (to be expanded)
- `/app/frontend/src/pages/Drinks.jsx` – Basic drinks page (to be expanded)
- `/app/frontend/src/pages/Locations.jsx` – Basic locations page (to be expanded)
- `/app/frontend/src/pages/Contact.jsx` – Basic contact page (to be expanded)

**Modified:**
- `/app/frontend/public/index.html` – Added Google Fonts, updated meta tags
- `/app/frontend/src/index.css` – Added complete design tokens and custom styles
- `/app/frontend/src/App.js` – Implemented React Router with all routes and layout

**Dependencies Added:**
- `react-router-dom` – Client-side routing
- `framer-motion` – Animation library for micro-interactions
