# Eastend Tanning & Laundry – Comprehensive Sales & Marketing Platform

## 1) Executive Summary
Build a modern, mobile-first, SEO-optimized sales and marketing platform for Eastend's multi-service business in Mount Vernon, Ohio. The platform will showcase FOUR divisions—Tanning Studio, Laundromat (Eastend + Westend), Fizze Drinks, and Fast Nails—with comprehensive e-commerce capabilities to drive online bookings, package sales, and conversions. Visual identity: sunny gold (primary), teal blue (secondary), soft whites, with Bento card layout and Swiss-grid clarity.

**Updated Tagline:** "Tanning Studio. Laundromat. Fizze Drinks. Nails."

**Current Status:** Phase 1 (MVP Home + Nav) COMPLETED. Ready to start Phase 2A (Expand All Service Pages).

**Vision:** An AI-enhanced sales and marketing platform that serves as a 24/7 digital storefront, converting online visitors into paying customers through seamless booking systems, informative content, social proof, and local SEO dominance.

**Live Preview:** https://tan-wash-drink.preview.emergentagent.com

---

## 2) Objectives

### Primary Business Goals:
- **Drive Online Conversions:** Enable customers to book appointments, purchase packages, and order services online
- **Local SEO Dominance:** Rank #1 for "tanning in Mount Vernon," "laundromat near me," "bubble tea Mount Vernon Ohio," "nail salon Mount Vernon"
- **Build Community Trust:** AI-generated blog content + Facebook feed integration for social proof and engagement
- **Increase Revenue:** Streamline customer journey from discovery to purchase with optimized sales funnels

### Completed Phase 1 Objectives: ✅
- ✅ Professional website foundation with modern design (sunny gold + teal blue)
- ✅ Clear funnels to all services from home hero and navigation
- ✅ One-tap Call/Directions on mobile and desktop
- ✅ Professional UX with Shadcn UI, Tailwind tokens, and test IDs
- ✅ Responsive design verified on desktop and mobile
- ✅ Header with desktop nav + mobile Sheet menu
- ✅ Footer with complete business information
- ✅ React Router with all page routes configured

### Pending Objectives (Phases 2-3):
- [ ] Add Fast Nails as 4th service across all pages (Phase 2A)
- [ ] Comprehensive service pages with pricing, services, and FAQs (Phase 2A)
- [ ] Blog section with AI-generated local content (Phase 2B)
- [ ] Facebook feed integration on all service pages (Phase 2C)
- [ ] E-commerce booking and payment systems (Phase 3)
- [ ] Advanced SEO with schema markup and meta optimization (Phase 4)

---

## 3) UI/UX Design Guidelines (from design_guidelines.md)

All design elements from Phase 1 remain in effect and must be followed:

- **Color tokens** ✅ IMPLEMENTED: 
  - Primary (sunny gold): `hsl(42 92% 55%)` for main CTAs
  - Secondary (teal): `hsl(183 55% 43%)` for secondary CTAs/links
  - Surfaces: white and very light gold backgrounds
  - Gradients: only for large sections (hero), max 20% viewport

- **Typography** ✅ IMPLEMENTED: 
  - Headings: Spectral (H1/H3, 600–700 weight)
  - Body/UI: Manrope (400–600 weight)

- **Layout** ✅ IMPLEMENTED: 
  - Swiss grid + Bento cards + subtle glassmorphism accents
  - Container: `container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1200px]`

- **Components** ✅ IMPLEMENTED: 
  - Shadcn UI exclusively (Button, Card, Tabs, Accordion, Sheet, etc.)
  - All interactive elements require `data-testid` attributes

- **Motion** ✅ IMPLEMENTED: 
  - Framer-motion for subtle micro-interactions
  - No `transition: all` - specific property transitions only

- **Accessibility** ✅ IMPLEMENTED: 
  - WCAG AA contrast
  - Keyboard navigation
  - Visible focus rings using `--ring` token
  - Alt text on all images

---

## 4) Real Business Data

### Eastend Location (818 Coshocton Ave, Mount Vernon, OH 43050)

**Services at this location:**

1. **Tanning Studio**
   - Phone: (740) 397-9632
   - Hours: Mon–Fri 8:00 AM–7:30 PM; Sun 8:00 AM–10:00 PM
   - Services: 5 tanning levels (Matrix, stand-up, red-light therapy, etc.)
   - To add: Detailed level descriptions, pricing, packages

2. **Eastend Laundry**
   - Phone: (740) 397-9632
   - Hours: Mon–Fri 8:00 AM–7:30 PM; Sun 8:00 AM–10:00 PM
   - Services: Coin-operated washers/dryers, drop-off service (to be added)
   - To add: Machine sizes, pricing per load, amenities

3. **Fizze Drinks** 🆕 SEPARATE LISTING NEEDED
   - Phone: (740) 280-9400
   - Hours: Mon–Fri 7:30 AM–6:00 PM; Sat–Sun 8:00 AM–4:00 PM
   - Menu: Coffee, Dirty Soda, Meal Replacement Shakes, Energy Bombs, Bubble Tea
   - Location: Inside Eastend at 818 Coshocton Ave
   - To add: Full menu with pricing, drink categories

4. **Fast Nails** 🆕 NEW SERVICE TO ADD
   - Phone: (740) 397-9632 (shared with Eastend - to be confirmed)
   - Hours: Mon–Sat 9:00 AM–[closing time TBD]
   - Location: Inside Eastend at 818 Coshocton Ave
   - Services: Manicures, Pedicures, Gel, Nail Art
   - Estimated Pricing (industry standard):
     - Basic Manicure: $25-35
     - Basic Pedicure: $40-60
     - Gel Manicure: $40-45
     - Gel Pedicure: $60-75
     - Polish Change: $15-20
   - To add: Exact pricing, service menu, gallery photos

### Westend Location (116 S Norton St, Mount Vernon, OH 43050)

- **Westend Laundry**
  - Phone: (740) 393-3766
  - Hours: Daily 6:00 AM–10:00 PM
  - Services: Coin-operated washers/dryers
  - To add: Machine details, pricing

---

## 5) Scope and Deliverables

### Pages Status:

| Page | Status | Phase 2A Tasks |
|------|--------|----------------|
| **Home** | ✅ COMPLETE | Update for 4th service (Fast Nails) |
| **Tanning** | ✅ BASIC | Expand: 5 levels, pricing, FAQ, booking CTA |
| **Laundry** | ✅ BASIC | Expand: amenities, pricing, drop-off service |
| **Fizze Drinks** | ✅ BASIC | Expand: full menu, pricing, online ordering CTA |
| **Fast Nails** | ❌ NOT CREATED | Create: services, pricing, gallery, booking CTA |
| **Locations** | ✅ BASIC | Expand: all 4 services, separate Fizze/Nails entries |
| **Contact** | ✅ BASIC | Add contact form (Phase 5) |
| **Blog** | ❌ NOT CREATED | Create blog section (Phase 2B) |

### Components Status:

**Existing (Phase 1):**
- ✅ Header (with responsive nav)
- ✅ Footer (with business info)
- ✅ ServiceCard (for home page Bento cards)

**To Create (Phase 2A):**
- [ ] PricingTable (reusable pricing display)
- [ ] FAQAccordion (reusable FAQ sections)
- [ ] BookingCTA (prominent call-to-action buttons)

**To Create (Phase 2B):**
- [ ] BlogCard (blog article previews)

**To Create (Phase 2C):**
- [ ] FacebookFeed (social proof integration)

**To Create (Phase 5):**
- [ ] ContactForm (inquiry form)

### Backend Features (Phase 3 & Beyond):

**E-commerce Endpoints (Phase 3):**
- POST /api/tanning/skin-quiz
- POST /api/tanning/cosmetology-form
- POST /api/tanning/packages/purchase
- POST /api/tanning/bookings
- GET /api/tanning/availability
- POST /api/nails/bookings
- POST /api/laundry/dropoff-signup
- POST /api/fizze/orders
- POST /api/products/purchase

**Blog Endpoints (Phase 2B):**
- GET /api/blog/posts
- GET /api/blog/posts/:slug

**Contact Endpoint (Phase 5):**
- POST /api/contact

**Utility:**
- GET /api/health

### Content Strategy:

**Phase 2A Content Needs:**
- Detailed service descriptions for all 4 services
- Pricing tables for each service
- FAQ sections (8-10 questions per service)
- Call-to-action copy for conversions

**Phase 2B Content (AI-Generated Blog):**
- 15-20 initial blog articles targeting local SEO
- Categories: Tanning Tips, Laundry Hacks, Drink Recipes, Nail Trends, Mount Vernon Community
- Publication schedule: 2-3 articles per week

**Phase 2C Content (Facebook Integration):**
- Pull latest 3-5 posts from each service's Facebook page
- Display on respective service pages for social proof

---

## 6) Implementation Plan (Detailed Phases)

### Phase 1 – MVP Home + Nav ✅ COMPLETED

**Status:** ✅ COMPLETED

**What Was Accomplished:**
- ✅ Installed react-router-dom and framer-motion dependencies
- ✅ Updated index.css with complete design tokens (sunny gold primary, teal secondary)
- ✅ Added Google Fonts (Spectral for headings, Manrope for UI/body) to index.html
- ✅ Created Header component with responsive nav (desktop links + mobile Sheet menu)
- ✅ Created Footer with business info, locations, and quick links
- ✅ Created ServiceCard component for service funnels
- ✅ Built complete Home page with:
  - Hero section with gradient background and noise texture
  - 3-up Bento ServiceCards (Tanning, Laundry, Fizze Drinks) with images
  - About section with community messaging
  - Locations strip with cards for Eastend & Westend
  - Google Reviews section
- ✅ Set up React Router with routes for all pages
- ✅ Created basic placeholder pages for Tanning, Laundry, Drinks, Locations, Contact
- ✅ Updated App.js with full router integration (Header + Main + Footer + Toaster)
- ✅ Tested and verified UI matches design guidelines with screenshots
- ✅ Fixed HTML validation issues (replaced `<p>` with `<div>` for icon containers)
- ✅ No console errors, clean build verified

**Design Compliance Verified:**
- ✅ Sunny gold and teal blue colors applied correctly
- ✅ Spectral font for headings, Manrope for body
- ✅ Bento card layout with proper gradients (<20% viewport)
- ✅ All interactive elements have data-testid attributes
- ✅ Responsive design works on desktop and mobile
- ✅ Professional UI with proper spacing and shadows

---

### Phase 2A – Expand All Service Pages + Add Fast Nails 🔄 READY TO START

**Status:** 🔄 READY TO START

**Objective:** Transform basic placeholder pages into comprehensive, conversion-optimized service pages. Add Fast Nails as the 4th service across the entire site.

**Priority Order:**
1. Update Home page for Fast Nails
2. Create Fast Nails page
3. Expand Tanning page
4. Expand Laundry page
5. Expand Fizze Drinks page
6. Update Locations page
7. Create reusable components (PricingTable, FAQAccordion, BookingCTA)

---

#### Task 1: Update Home Page for 4th Service (Fast Nails)

**Changes Needed:**
- [ ] Update hero tagline from "Sun. Clean. Fizze." to "Tanning Studio. Laundromat. Fizze Drinks. Nails."
- [ ] Modify ServiceCard grid from 3-column to 2x2 grid layout (4 cards)
- [ ] Add 4th ServiceCard for Fast Nails with:
  - Title: "Fast Nails"
  - Description: "Professional nail care with manicures, pedicures, gel services, and nail art. Pamper yourself today."
  - CTA: "Book Nail Appointment"
  - href: "/nails"
  - Image: Nail salon/manicure image
  - Tone: "drinks" (use similar pastel gradient)
- [ ] Update "Visit Us" section to show 4 separate entries:
  - **Eastend Tanning & Laundry** (existing)
  - **Westend Laundry** (existing)
  - **Fizze Drinks** 🆕 (separate card with phone (740) 280-9400, hours Mon-Fri 7:30am-6pm, Sat-Sun 8am-4pm)
  - **Fast Nails** 🆕 (separate card with phone (740) 397-9632, hours Mon-Sat 9am-[TBD])
- [ ] Update Header navigation to include "Nails" link
- [ ] Update Footer to include "Nails" in Quick Links section

**Files to Modify:**
- `/app/frontend/src/pages/Home.jsx`
- `/app/frontend/src/components/Header.jsx`
- `/app/frontend/src/components/Footer.jsx`

---

#### Task 2: Create Fast Nails Page 🆕

**Page Structure:**
```
/nails
├── Hero Section
│   ├── H1: "Fast Nails - Professional Nail Care in Mount Vernon"
│   ├── Subheading: "Manicures, pedicures, gel services, and stunning nail art"
│   └── Gradient background (pastel pink/purple or use drinks gradient)
├── Services Section
│   ├── H2: "Our Services"
│   ├── Service cards or list:
│   │   ├── Manicures (basic, gel, French, nail art)
│   │   ├── Pedicures (basic, spa, gel, luxury)
│   │   └── Add-ons (polish change, nail repair, designs, nail extensions)
├── Pricing Table Component
│   ├── Service name, description, price
│   ├── Basic Manicure: $25-35
│   ├── Basic Pedicure: $40-60
│   ├── Gel Manicure: $40-45
│   ├── Gel Pedicure: $60-75
│   ├── Polish Change: $15-20
│   └── Note: "Prices may vary. Call for exact pricing."
├── FAQ Section (Accordion)
│   ├── Do you accept walk-ins or appointments only?
│   ├── How long does a manicure/pedicure take?
│   ├── What brands of polish do you use?
│   ├── Do you sanitize tools between clients?
│   ├── Can I bring my own polish?
│   ├── Do you offer nail art and designs?
│   ├── What payment methods do you accept?
│   └── Do you have a loyalty program?
├── Hours & Location Section
│   ├── Hours: Mon-Sat 9:00 AM - [TBD]
│   ├── Location: Inside Eastend at 818 Coshocton Ave
│   ├── Phone: (740) 397-9632
│   └── Embedded map or link to directions
├── Booking CTA Section
│   ├── Large CTA button: "Book Your Nail Appointment"
│   ├── Subtext: "Call us or book online" (Phase 3 will add booking functionality)
│   └── Secondary CTA: Call button, Directions button
└── Facebook Feed Section (Phase 2C)
    └── Placeholder for Facebook posts
```

**Files to Create:**
- `/app/frontend/src/pages/Nails.jsx`

**Files to Modify:**
- `/app/frontend/src/App.js` (add /nails route)

---

#### Task 3: Expand Tanning Page

**Current State:** Basic placeholder with minimal content

**Expansion Needed:**

**Hero Section:**
- [ ] Update hero image (tanning bed or person with tan)
- [ ] Compelling H1: "Premium Tanning Studio in Mount Vernon, Ohio"
- [ ] Subheading: "Achieve your perfect glow with our 5 tanning levels, including Matrix technology, stand-up beds, and red-light therapy"

**Services Section (Use Tabs Component):**
- [ ] H2: "Our Tanning Levels"
- [ ] Tabs for each level:
  - **Level 1 - Starter Beds**
    - Description: Perfect for beginners or maintaining a base tan
    - Features: 12-minute sessions, gentle UV exposure
    - Best for: Fair to medium skin tones
    - Pricing: [TBD]
  - **Level 2 - Bronze Beds**
    - Description: Step up your tanning game
    - Features: 10-minute sessions, enhanced bronzing lamps
    - Best for: Medium skin tones, faster results
    - Pricing: [TBD]
  - **Level 3 - Matrix Technology**
    - Description: Our most advanced horizontal bed
    - Features: 8-minute sessions, facial tanners, cooling fans
    - Best for: Experienced tanners seeking deep color
    - Pricing: [TBD]
  - **Level 4 - Stand-Up Beds**
    - Description: 360-degree even tan without pressure points
    - Features: 7-minute sessions, high-pressure bulbs
    - Best for: All skin types, no tan lines
    - Pricing: [TBD]
  - **Level 5 - Red-Light Therapy**
    - Description: Skin rejuvenation and anti-aging benefits
    - Features: Collagen production, reduced wrinkles, improved skin tone
    - Best for: Anyone seeking skin health benefits
    - Pricing: [TBD]

**Pricing Section (PricingTable Component):**
- [ ] H2: "Tanning Packages"
- [ ] Pricing table with:
  - Single Session (per level)
  - 5-Session Package (save 10%)
  - 10-Session Package (save 15%)
  - Monthly Unlimited (best value)
  - Note: "Ask about our first-time customer discount!"

**Products Section:**
- [ ] H2: "Tanning Lotions & Products"
- [ ] Grid of product cards (placeholder images):
  - Bronzing Lotions
  - Intensifiers
  - Moisturizers
  - After-tan care
  - Each with price: [TBD]
- [ ] CTA: "Buy Lotions In-Store" (Phase 3 will add e-commerce)

**FAQ Section (FAQAccordion Component):**
- [ ] H2: "Frequently Asked Questions"
- [ ] Questions:
  - How do I choose the right tanning level?
  - How often should I tan?
  - What should I wear while tanning?
  - Can I tan if I have sensitive skin?
  - Do I need to bring my own lotion?
  - What is red-light therapy?
  - Are there any age restrictions?
  - How do I maintain my tan?

**Booking CTA Section:**
- [ ] Large prominent CTA: "Book Your Tanning Session"
- [ ] Subtext: "Take our skin quiz and complete forms online" (Phase 3 functionality)
- [ ] Secondary CTAs: Call, Directions

**Facebook Feed Section (Phase 2C):**
- [ ] Placeholder for live Facebook posts

**Files to Modify:**
- `/app/frontend/src/pages/Tanning.jsx`

---

#### Task 4: Expand Laundry Page

**Current State:** Basic placeholder

**Expansion Needed:**

**Hero Section:**
- [ ] Update with laundromat image
- [ ] H1: "Clean, Safe, Convenient Laundromats in Mount Vernon"
- [ ] Subheading: "Two locations with modern washers and dryers. Self-service or drop-off available."

**Two Locations Comparison Section:**
- [ ] H2: "Our Locations"
- [ ] Side-by-side cards for Eastend vs Westend:
  - **Eastend Laundry**
    - Address, phone, hours
    - Services: Self-service, Drop-off (coming soon)
    - Amenities: WiFi, seating, vending, security cameras
    - Machine sizes: Small, medium, large, extra-large
  - **Westend Laundry**
    - Address, phone, hours
    - Services: Self-service
    - Amenities: 24/7 security, well-lit, ample parking
    - Machine sizes: Standard to extra-large

**Services & Amenities Section:**
- [ ] H2: "Services & Amenities"
- [ ] Grid of feature cards:
  - **Self-Service Coin-Op**
    - Modern washers and dryers
    - Multiple machine sizes
    - Fast drying times
  - **Drop-Off Service** (coming soon)
    - Wash, dry, and fold
    - Same-day or next-day turnaround
    - Pricing per pound
  - **Amenities**
    - Free WiFi
    - Comfortable seating
    - Vending machines
    - Well-lit, secure facilities

**Pricing Section (PricingTable Component):**
- [ ] H2: "Pricing"
- [ ] Table:
  - Small Washer: $[TBD]
  - Medium Washer: $[TBD]
  - Large Washer: $[TBD]
  - Extra-Large Washer: $[TBD]
  - Dryers (per 10 minutes): $[TBD]
  - Drop-Off Service: $[TBD] per pound (coming soon)
  - Detergent/Softener available for purchase

**FAQ Section (FAQAccordion Component):**
- [ ] Questions:
  - What forms of payment do you accept?
  - Do you sell detergent and fabric softener?
  - How long does a typical wash/dry cycle take?
  - Is there an attendant on-site?
  - What should I do if I lose an item?
  - Can I leave my laundry unattended?
  - Do you have security cameras?
  - Is parking available?

**CTA Section:**
- [ ] Primary CTA: "Sign Up for Drop-Off Service" (Phase 3)
- [ ] Secondary CTAs: Call, Directions to both locations

**Facebook Feed Section (Phase 2C):**
- [ ] Placeholder for Facebook posts

**Files to Modify:**
- `/app/frontend/src/pages/Laundry.jsx`

---

#### Task 5: Expand Fizze Drinks Page

**Current State:** Basic placeholder with menu overview

**Expansion Needed:**

**Hero Section:**
- [ ] Vibrant drinks image (bubble tea, colorful sodas)
- [ ] H1: "Fizze Drinks - Mount Vernon's Bubble Tea & Specialty Drink Shop"
- [ ] Subheading: "Refreshing flavors to brighten your day. Coffee, dirty sodas, bubble tea, energy bombs, and more!"

**Menu Section (Grid Layout with Card Components):**
- [ ] H2: "Our Menu"
- [ ] Category tabs or sections:
  - **Coffee**
    - Hot Coffee (various sizes)
    - Iced Coffee
    - Flavored Lattes
    - Espresso drinks
    - Pricing: $[TBD]
  - **Dirty Sodas**
    - Flavor combinations (list 5-8 popular combos)
    - Build your own
    - Pricing: $[TBD]
  - **Bubble Tea**
    - Classic flavors (Taro, Thai Tea, Matcha, etc.)
    - Fruit flavors (Mango, Strawberry, Passion Fruit, etc.)
    - Toppings: Boba, Jelly, Popping Boba
    - Pricing: $[TBD]
  - **Energy Bombs**
    - Pre-workout boost
    - Afternoon pick-me-up
    - Custom energy levels
    - Pricing: $[TBD]
  - **Meal Replacement Shakes**
    - Protein-packed
    - Low-calorie options
    - Flavor varieties
    - Pricing: $[TBD]
- [ ] Use Badge components for: "Bestseller", "New", "Seasonal"

**Hours & Location Panel:**
- [ ] Prominent display with icon
- [ ] Hours: Mon-Fri 7:30 AM - 6:00 PM, Sat-Sun 8:00 AM - 4:00 PM
- [ ] Location: Inside Eastend at 818 Coshocton Ave
- [ ] Phone: (740) 280-9400
- [ ] Map link

**FAQ Section (FAQAccordion Component):**
- [ ] Questions:
  - What makes your drinks special?
  - Can I customize my drink?
  - Do you have sugar-free options?
  - What are dirty sodas?
  - What is bubble tea?
  - Do you offer dairy-free milk alternatives?
  - Can I order online for pickup?
  - Do you have a loyalty program?

**CTA Section:**
- [ ] Primary CTA: "Order Online" (Phase 3 functionality)
- [ ] Secondary CTAs: Call, Visit Us Today

**Facebook Feed Section (Phase 2C):**
- [ ] Placeholder for Facebook posts

**Files to Modify:**
- `/app/frontend/src/pages/Drinks.jsx`

---

#### Task 6: Update Locations Page

**Current State:** Basic cards for Eastend and Westend

**Expansion Needed:**
- [ ] Update Eastend card to list all 4 services:
  - Tanning Studio (hours)
  - Laundry (hours)
  - Fizze Drinks (hours with separate phone)
  - Fast Nails (hours)
- [ ] Keep Westend card for Westend Laundry only
- [ ] Add comprehensive hours table showing all services at a glance
- [ ] Embedded Google Maps for both locations
- [ ] Call, Directions, and Reviews buttons for each location

**Files to Modify:**
- `/app/frontend/src/pages/Locations.jsx`

---

#### Task 7: Create Reusable Components

**PricingTable Component:**
- [ ] Create `/app/frontend/src/components/PricingTable.jsx`
- [ ] Props: `items` array with { service, description, price }
- [ ] Responsive table with Shadcn Table component
- [ ] Alternating row colors for readability
- [ ] Mobile-friendly (stacks on small screens)

**FAQAccordion Component:**
- [ ] Create `/app/frontend/src/components/FAQAccordion.jsx`
- [ ] Props: `faqs` array with { question, answer }
- [ ] Use Shadcn Accordion component
- [ ] Smooth expand/collapse animations
- [ ] data-testid on each accordion item

**BookingCTA Component:**
- [ ] Create `/app/frontend/src/components/BookingCTA.jsx`
- [ ] Props: `title`, `subtitle`, `primaryAction`, `secondaryAction`
- [ ] Large prominent button with icon
- [ ] Subtext below button
- [ ] Optional secondary CTA buttons (Call, Directions)
- [ ] Gradient background or card style

---

### Phase 2B – Blog Section with AI-Generated Content 📝 NOT STARTED

**Status:** NOT STARTED

**Objective:** Create a blog section with AI-generated articles to boost SEO, build community trust, and establish local authority.

**Tasks:**

#### 1. Create Blog Landing Page
- [ ] Create `/app/frontend/src/pages/Blog.jsx`
- [ ] Layout:
  - Hero section with "Blog" title and tagline
  - Grid of blog article cards (3 columns on desktop, 1 on mobile)
  - Category filter buttons: All, Tanning Tips, Laundry Hacks, Drink Recipes, Nail Trends, Community
  - Search bar (functional in future phase)
  - Pagination (if more than 12 articles)
- [ ] Add "Blog" link to Header navigation

#### 2. Create BlogCard Component
- [ ] Create `/app/frontend/src/components/BlogCard.jsx`
- [ ] Display:
  - Featured image
  - Category badge
  - Title (H3)
  - Excerpt (2-3 sentences)
  - Author, publish date, read time
  - "Read More" link
- [ ] Hover effects (shadow, slight scale)

#### 3. Create Individual Blog Post Page
- [ ] Create `/app/frontend/src/pages/BlogPost.jsx`
- [ ] Route: `/blog/:slug`
- [ ] Layout:
  - Hero with featured image
  - Article title (H1)
  - Author info, publish date, read time
  - Article content (formatted with proper headings, lists, images)
  - Related articles section (3-4 cards)
  - Social share buttons (Facebook, Twitter, LinkedIn)
  - CTA to relevant service page

#### 4. Backend: Blog Data Structure
- [ ] Create MongoDB schema for blog posts
- [ ] Fields:
  - `id` (UUID)
  - `title` (string)
  - `slug` (string, unique, URL-friendly)
  - `content` (markdown or HTML)
  - `excerpt` (string, 150-200 chars)
  - `category` (enum: tanning, laundry, drinks, nails, community)
  - `author` (string, default: "Eastend Team")
  - `publish_date` (datetime)
  - `featured_image` (URL)
  - `tags` (array of strings)
  - `seo_title` (string)
  - `seo_description` (string)

#### 5. Backend: Blog API Endpoints
- [ ] GET /api/blog/posts
  - Query params: category, page, limit
  - Returns: array of blog posts with pagination
- [ ] GET /api/blog/posts/:slug
  - Returns: single blog post by slug
- [ ] POST /api/blog/posts (admin only - future)
  - Create new blog post

#### 6. Generate Initial Blog Articles (AI-Generated)
Generate 15-20 articles with the following titles and optimize for local SEO:

**Tanning Tips (5 articles):**
1. "5 Tanning Tips for Mount Vernon Residents: Get Your Best Glow"
2. "How to Choose the Right Tanning Level: A Guide to Eastend's 5 Options"
3. "Red-Light Therapy Benefits: More Than Just a Tan"
4. "Tanning Safety 101: Protecting Your Skin While Getting Golden"
5. "How to Make Your Tan Last Longer: Expert Tips from Eastend"

**Laundry Hacks (4 articles):**
6. "Laundry Day Made Easy: Time-Saving Hacks for Busy Mount Vernon Families"
7. "Self-Service Laundry vs Drop-Off: Which is Right for You?"
8. "How to Remove Tough Stains: A Complete Guide"
9. "The Ultimate Laundry Checklist: Never Forget a Step Again"

**Drink Recipes & Tips (3 articles):**
10. "The Ultimate Guide to Bubble Tea at Fizze Drinks"
11. "Dirty Soda Recipes You Can Try at Home (But Ours Are Better!)"
12. "5 Energy-Boosting Drinks to Power Through Your Day in Mount Vernon"

**Nail Trends (3 articles):**
13. "Nail Care 101: Keeping Your Manicure Fresh Between Appointments"
14. "Gel Manicure vs Regular Polish: What You Need to Know"
15. "Top 5 Nail Trends for 2025: What's Hot at Fast Nails"

**Mount Vernon Community (3-4 articles):**
16. "Mount Vernon's Best-Kept Secret: Eastend's Multi-Service Hub"
17. "Supporting Local: Why Shopping Small Matters in Mount Vernon"
18. "A Day in the Life: How Eastend Serves the Mount Vernon Community"
19. "Your One-Stop Shop: Tanning, Laundry, Drinks, and Nails Under One Roof"

#### 7. SEO Optimization for Blog
- [ ] Meta titles and descriptions for each article
- [ ] Keyword optimization for local search (include "Mount Vernon" naturally)
- [ ] Internal linking to service pages
- [ ] Image alt text with descriptive keywords
- [ ] Schema markup for Article type

---

### Phase 2C – Facebook Feed Integration 📱 NOT STARTED

**Status:** NOT STARTED

**Objective:** Integrate live Facebook posts on each service page for social proof and community engagement.

**Tasks:**

#### 1. Research Facebook Integration Options
- [ ] Option A: Facebook Graph API (requires app approval, access tokens)
- [ ] Option B: Facebook Page Plugin (embed widget, simpler but less customizable)
- [ ] Option C: Manual curation (screenshot posts, update periodically)
- [ ] Decide on best approach based on complexity and maintenance

#### 2. Create FacebookFeed Component
- [ ] Create `/app/frontend/src/components/FacebookFeed.jsx`
- [ ] Display:
  - Section title: "Latest from Our Facebook"
  - 3-5 most recent posts
  - Each post shows: text, image (if any), date, engagement (likes/comments)
  - Link to full post on Facebook ("See on Facebook" button)
- [ ] Responsive card layout
- [ ] Loading state (skeleton loaders)
- [ ] Error state (fallback message if posts fail to load)

#### 3. Add FacebookFeed to Service Pages
- [ ] Tanning page: Posts from Eastend Tanning & Laundry Facebook
- [ ] Laundry page: Posts from Eastend/Westend Laundry Facebook
- [ ] Fizze Drinks page: Posts from Fizze Drinks Facebook
- [ ] Fast Nails page: Posts from Fast Nails Facebook (or Eastend if no separate page)

#### 4. Backend: Facebook API Integration (if using Graph API)
- [ ] Create `/app/backend/services/facebook_api.py`
- [ ] Functions:
  - `fetch_facebook_posts(page_id, limit=5)` - fetch recent posts
  - `cache_posts()` - cache posts to avoid rate limits
- [ ] Caching strategy:
  - Cache posts in MongoDB or Redis
  - Refresh every 1-2 hours
  - Manual refresh endpoint for admin
- [ ] Error handling and fallback

#### 5. Alternative: Facebook Page Plugin Embed
- [ ] If Graph API is too complex, use Facebook Page Plugin
- [ ] Generate embed code from Facebook's Page Plugin tool
- [ ] Embed in FacebookFeed component via iframe
- [ ] Customize width, height, and display options

#### 6. Test and Optimize
- [ ] Test loading performance
- [ ] Mobile responsiveness
- [ ] Ensure posts display correctly
- [ ] Handle cases where no posts are available

---

### Phase 3 – E-Commerce & Booking Systems 🛒 NOT STARTED

**Status:** NOT STARTED

**Objective:** Build comprehensive e-commerce functionality to enable online bookings, package purchases, and service orders.

**User's Priority Order:**
1. Tanning bookings (with skin quiz and cosmetology forms)
2. Tanning package and lotion purchases
3. Nail appointment bookings
4. Laundry drop-off service signup
5. Fizze Drinks online ordering

**Note:** Payment gateway (Stripe) integration will be added in a future phase. For now, build the UI and data collection flows with placeholder "Complete Order" buttons.

---

#### 3.1 Tanning E-Commerce System (Priority 1 & 2)

**A. Skin Type Quiz:**
- [ ] Create multi-step quiz component
- [ ] Questions (5-7):
  1. What is your natural skin tone? (Fair, Medium, Olive, Dark)
  2. How does your skin typically react to sun exposure? (Burns easily, Tans slowly, Tans easily, Rarely burns)
  3. Have you tanned before? (Never, Occasionally, Regularly)
  4. Do you have sensitive skin? (Yes/No)
  5. What is your tanning goal? (Base tan, Deep bronze, Maintenance, Red-light therapy)
- [ ] Recommendation engine based on answers:
  - Fair + Burns easily → Level 1 or 2
  - Medium + Tans slowly → Level 2 or 3
  - Experienced + Deep bronze → Level 4 or 5
  - Red-light therapy goal → Level 5
- [ ] Display recommended level with explanation
- [ ] Store quiz results with user profile (MongoDB)

**B. Board of Cosmetology Form:**
- [ ] Create digital form component with all required fields:
  - Personal info (name, DOB, address, phone, email)
  - Medical history checkboxes (skin conditions, medications, allergies)
  - Consent and liability waiver
  - Signature capture (canvas-based or typed signature)
  - Date and timestamp
- [ ] Generate PDF for records (use library like jsPDF)
- [ ] Store signed form in MongoDB with timestamp
- [ ] Display confirmation after submission

**C. Tanning Package Purchase:**
- [ ] Create Tanning Packages page (`/tanning/packages`)
- [ ] Display package options:
  - Single Session (per level) - $[TBD]
  - 5-Session Package (save 10%) - $[TBD]
  - 10-Session Package (save 15%) - $[TBD]
  - Monthly Unlimited (best value) - $[TBD]
- [ ] Add to cart functionality
- [ ] Shopping cart component (Shadcn Sheet or Dialog)
- [ ] Checkout flow:
  1. Review cart
  2. Customer info form (if not logged in)
  3. Payment placeholder ("Complete Purchase" button)
  4. Order confirmation page
- [ ] Backend: Store order in MongoDB with status "pending_payment"

**D. Tanning Lotion Products:**
- [ ] Create Products page (`/tanning/products`)
- [ ] Product grid with:
  - Product image
  - Name and description
  - Price
  - "Add to Cart" button
- [ ] Product categories: Bronzers, Intensifiers, Moisturizers, After-care
- [ ] Same cart and checkout flow as packages

**E. Appointment Booking:**
- [ ] Create Booking page (`/tanning/book`)
- [ ] Calendar component showing available time slots
- [ ] Select:
  - Date
  - Time slot (15-minute intervals)
  - Tanning level
  - Duration
- [ ] Customer info form
- [ ] Review and confirm
- [ ] Backend: Store booking in MongoDB with status "confirmed"
- [ ] Confirmation page with booking details
- [ ] Email confirmation (future phase)

**F. Backend Endpoints:**
- [ ] POST /api/tanning/skin-quiz (submit quiz, return recommendation)
- [ ] POST /api/tanning/cosmetology-form (store signed form)
- [ ] POST /api/tanning/packages/purchase (create order)
- [ ] POST /api/tanning/products/purchase (create order)
- [ ] POST /api/tanning/bookings (create appointment)
- [ ] GET /api/tanning/availability (return available time slots)

---

#### 3.2 Nail Appointment Booking (Priority 3)

- [ ] Create Nail Booking page (`/nails/book`)
- [ ] Calendar component with available time slots
- [ ] Service selection dropdown:
  - Basic Manicure
  - Gel Manicure
  - Basic Pedicure
  - Gel Pedicure
  - Mani + Pedi Combo
  - Nail Art (add-on)
- [ ] Technician selection (if applicable, or "Next Available")
- [ ] Customer info form
- [ ] Review and confirm
- [ ] Backend: POST /api/nails/bookings (store booking in MongoDB)
- [ ] Confirmation page

---

#### 3.3 Laundry Drop-Off Service Signup (Priority 4)

- [ ] Create Drop-Off Signup page (`/laundry/dropoff`)
- [ ] Signup form:
  - Customer info (name, phone, email, address)
  - Pickup/delivery preferences (day of week, time window)
  - Frequency (one-time, weekly, bi-weekly, monthly)
  - Special instructions (detergent preferences, folding instructions)
  - Estimated load size
- [ ] Review and submit
- [ ] Backend: POST /api/laundry/dropoff-signup (store signup in MongoDB)
- [ ] Confirmation page: "We'll call you within 24 hours to confirm pickup details"

---

#### 3.4 Fizze Drinks Online Ordering (Priority 5)

- [ ] Create Online Ordering page (`/drinks/order`)
- [ ] Menu with add-to-cart functionality
- [ ] Customization options for each drink:
  - Size (Small, Medium, Large)
  - Ice level (No ice, Light, Regular, Extra)
  - Sweetness (0%, 25%, 50%, 75%, 100%)
  - Toppings (for bubble tea): Boba, Jelly, Popping Boba
- [ ] Add to cart
- [ ] Cart review
- [ ] Pickup time selection (ASAP, or schedule for later)
- [ ] Customer info form
- [ ] Order summary
- [ ] Backend: POST /api/fizze/orders (store order in MongoDB)
- [ ] Confirmation page: "Your order will be ready in 10-15 minutes"

---

#### 3.5 Payment Integration Preparation (Future Phase)

- [ ] Design checkout flow UI (ready for Stripe)
- [ ] Create order confirmation pages for all services
- [ ] Email notification templates (for future implementation)
- [ ] Admin order management interface (basic dashboard to view orders/bookings)

**Note:** Payment processing will be added in a later phase when Stripe account is set up.

---

### Phase 4 – Advanced SEO & Schema Markup 🔍 NOT STARTED

**Status:** NOT STARTED

**Objective:** Dominate local search results for all four services in Mount Vernon, Ohio.

**Tasks:**

#### 1. Page-Level SEO
- [ ] Unique meta titles for every page (max 60 chars)
- [ ] Unique meta descriptions for every page (max 155 chars)
- [ ] H1 tags with "Mount Vernon, Ohio" where natural
- [ ] Alt text for all images (descriptive + keywords)
- [ ] Internal linking strategy between services and blog
- [ ] URL structure optimization (clean, keyword-rich slugs)

#### 2. Schema.org Markup (JSON-LD)
- [ ] **LocalBusiness schema** for each service:
  - Tanning Studio
  - Laundry (Eastend & Westend)
  - Fizze Drinks
  - Fast Nails
- [ ] **Service schema** for specific offerings
- [ ] **Review schema** for Google reviews (aggregate rating)
- [ ] **FAQPage schema** for FAQ sections
- [ ] **Article schema** for blog posts
- [ ] **BreadcrumbList schema** for navigation

#### 3. Technical SEO
- [ ] Generate XML sitemap (`/sitemap.xml`)
- [ ] Optimize `robots.txt`
- [ ] Canonical URLs for all pages
- [ ] Open Graph tags for social sharing (Facebook, LinkedIn)
- [ ] Twitter Card tags
- [ ] Structured data testing (Google Rich Results Test)

#### 4. Performance Optimization
- [ ] Image compression (WebP format, lazy-loading)
- [ ] Code splitting and bundle optimization
- [ ] CDN for static assets (if applicable)
- [ ] Lighthouse audit score >90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Core Web Vitals optimization (LCP, FID, CLS)

#### 5. Local SEO
- [ ] Google My Business optimization (external task for business owner)
- [ ] NAP (Name, Address, Phone) consistency across all pages
- [ ] Local business directory submissions (Yelp, Yellow Pages, etc. - external)
- [ ] Location-specific landing pages (already covered with service pages)
- [ ] Embed Google Maps on Locations page

---

### Phase 5 – Contact Form & Backend Integration 📧 NOT STARTED

**Status:** NOT STARTED

**Tasks:**

#### 1. Build ContactForm Component
- [ ] Create `/app/frontend/src/components/ContactForm.jsx`
- [ ] Form fields (using Shadcn Input, Textarea, Select, Label):
  - Full Name (required)
  - Email (required, validated)
  - Phone (required)
  - Service Interest (dropdown: Tanning, Laundry, Fizze Drinks, Fast Nails, General Inquiry)
  - Message (textarea, required)
- [ ] Client-side validation with error messages
- [ ] Submit button with loading state

#### 2. Backend: Contact API
- [ ] Create FastAPI endpoint: POST /api/contact
- [ ] Pydantic model:
  ```python
  class ContactInquiry(BaseModel):
      id: str = Field(default_factory=lambda: str(uuid.uuid4()))
      full_name: str
      email: EmailStr
      phone: str
      service_interest: str
      message: str
      created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
  ```
- [ ] Store inquiry in MongoDB
- [ ] Return success response

#### 3. Frontend: Form Submission
- [ ] On submit, POST to `/api/contact`
- [ ] Display Sonner toast notification:
  - Success: "Thank you! We'll get back to you soon."
  - Error: "Something went wrong. Please call us at (740) 397-9632."
- [ ] Clear form on success

#### 4. Update Contact Page
- [ ] Add ContactForm component to Contact page
- [ ] Display business info (phone, email, address)
- [ ] Embed Google Map for Eastend location
- [ ] Hours of operation for all services

#### 5. Email Notifications (Future Phase)
- [ ] Set up email service (SendGrid, Mailgun, or SMTP)
- [ ] Send email to business owner when inquiry is submitted
- [ ] Send confirmation email to customer

---

### Phase 6 – Gallery & Social Proof 📸 NOT STARTED

**Status:** NOT STARTED

**Tasks:**

#### 1. Create Gallery Component
- [ ] Create `/app/frontend/src/components/Gallery.jsx`
- [ ] Use Shadcn Carousel component
- [ ] Category tabs: All, Tanning, Laundry, Fizze Drinks, Fast Nails
- [ ] Display images in carousel format
- [ ] Lazy-loading for performance
- [ ] Lightbox functionality for full-size viewing (use Shadcn Dialog)

#### 2. Pull Images from Facebook and Google
- [ ] Web search for images:
  - "Eastend Tanning Laundry Mount Vernon photos"
  - "Fizze Drinks Mount Vernon photos"
  - "Fast Nails Mount Vernon photos"
- [ ] Download high-quality images (with permission if needed)
- [ ] Organize images by category (tanning, laundry, drinks, nails)
- [ ] Compress and optimize images (WebP format)
- [ ] Store images in `/app/frontend/public/images/gallery/`

#### 3. Add Gallery to Home Page
- [ ] Add Gallery section to Home page
- [ ] Display 6-8 featured images in grid
- [ ] "View Full Gallery" button linking to dedicated Gallery page

#### 4. Create Dedicated Gallery Page
- [ ] Create `/app/frontend/src/pages/Gallery.jsx`
- [ ] Full gallery with category filters
- [ ] Pagination or infinite scroll
- [ ] Lightbox for full-size viewing

#### 5. Google Reviews Integration
- [ ] Add Google Reviews widget or embed on Home page
- [ ] Add Google Reviews link on Locations page
- [ ] Display aggregate rating (star rating + number of reviews)
- [ ] Link to "Leave a Review" on Google

---

### Phase 7 – Testing, Polish & Launch 🚀 NOT STARTED

**Status:** NOT STARTED

**Tasks:**

#### 1. Comprehensive Testing with Testing Agent
- [ ] Call testing agent with detailed test plan:
  - All navigation links (Header, Footer, service cards)
  - All CTA buttons (Call, Directions, Bookings)
  - Form submissions (Contact, Booking, Orders)
  - Mobile responsiveness (all pages)
  - Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Review test results and fix all bugs (high to low priority)

#### 2. UI Polish Pass
- [ ] Spacing and alignment consistency across all pages
- [ ] Hover and focus states for all interactive elements
- [ ] Loading states (skeleton loaders for async content)
- [ ] Error states for forms (validation messages)
- [ ] Empty states (e.g., "No blog posts yet")
- [ ] Smooth transitions and animations (Framer Motion)

#### 3. Accessibility Audit
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Color contrast verification (WCAG AA minimum)
- [ ] ARIA labels where needed
- [ ] Focus indicators visible and clear

#### 4. Performance Testing
- [ ] Page load times (target: <3 seconds)
- [ ] Mobile performance (target: <4 seconds on 3G)
- [ ] Lighthouse audit (target: >90 for all metrics)
- [ ] Core Web Vitals (LCP, FID, CLS)

#### 5. Final QA and Bug Fixes
- [ ] Review all pages on desktop and mobile
- [ ] Test all forms and CTAs
- [ ] Verify all links work
- [ ] Check for console errors
- [ ] Verify all images load correctly
- [ ] Test on multiple devices (iPhone, Android, iPad, laptop)

#### 6. Pre-Launch Checklist
- [ ] All placeholder content replaced with real content
- [ ] All "TBD" pricing updated with actual prices
- [ ] Favicon and app icons added
- [ ] Social media meta tags verified
- [ ] Google Analytics set up (if applicable)
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google

#### 7. Launch! 🎉
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Announce on Facebook and social media
- [ ] Celebrate! 🎊

---

## 7) Technical Details

### Tech Stack:
- **Frontend:** React + Tailwind CSS + Shadcn/UI + React Router + Framer Motion ✅ IMPLEMENTED
- **Backend:** FastAPI + MongoDB (via MONGO_URL env) + Pydantic models (to be built in Phase 3+)
- **Future Payment:** Stripe integration (placeholder in Phase 3, full integration in future phase)
- **Content:** AI-generated blog articles (GPT-based, Phase 2B)
- **Social:** Facebook Graph API or embed for post integration (Phase 2C)

### Environment Constraints:
- ✅ Use yarn (never npm)
- ✅ Frontend → Backend via REACT_APP_BACKEND_URL + "/api" prefix
- ✅ Do not modify .env values
- Backend binds to 0.0.0.0:8001

### Data Models (MongoDB):

**Customers:**
```python
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "created_at": "datetime (UTC)"
}
```

**Bookings:**
```python
{
  "id": "uuid",
  "customer_id": "uuid",
  "service_type": "tanning | nails",
  "service_details": "object (level, duration, etc.)",
  "date": "date",
  "time": "time",
  "status": "confirmed | completed | cancelled",
  "created_at": "datetime (UTC)"
}
```

**Orders:**
```python
{
  "id": "uuid",
  "customer_id": "uuid",
  "order_type": "tanning_package | lotion | fizze_drink",
  "items": "array of objects",
  "total": "float",
  "status": "pending_payment | paid | completed",
  "created_at": "datetime (UTC)"
}
```

**Products:**
```python
{
  "id": "uuid",
  "name": "string",
  "category": "tanning_lotion | tanning_package",
  "price": "float",
  "description": "string",
  "image_url": "string"
}
```

**BlogPosts:**
```python
{
  "id": "uuid",
  "title": "string",
  "slug": "string (unique)",
  "content": "string (markdown or HTML)",
  "excerpt": "string",
  "category": "tanning | laundry | drinks | nails | community",
  "author": "string",
  "publish_date": "datetime",
  "featured_image": "string (URL)",
  "tags": "array of strings",
  "seo_title": "string",
  "seo_description": "string"
}
```

**ContactInquiries:**
```python
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "service_interest": "string",
  "message": "string",
  "created_at": "datetime (UTC)"
}
```

**CosmetologyForms:**
```python
{
  "id": "uuid",
  "customer_id": "uuid",
  "form_data": "object (all form fields)",
  "signature": "string (base64 or URL)",
  "signed_at": "datetime (UTC)"
}
```

---

## 8) Information Architecture

### Top Navigation (Header):
- Home
- Tanning
- Laundry
- Fizze Drinks
- **Nails** 🆕 (to be added in Phase 2A)
- Locations
- **Blog** 🆕 (to be added in Phase 2B)
- Contact

### Footer Quick Links:
- Tanning Services
- Laundry Services
- Fizze Drinks
- **Fast Nails** 🆕 (to be added in Phase 2A)
- Find Us
- Contact Us

### Page Structure Summary:

| Page | Route | Status | Phase 2A Updates |
|------|-------|--------|------------------|
| Home | `/` | ✅ Complete | Update for 4th service |
| Tanning | `/tanning` | ✅ Basic | Expand with 5 levels, pricing, FAQ |
| Laundry | `/laundry` | ✅ Basic | Expand with amenities, pricing |
| Fizze Drinks | `/drinks` | ✅ Basic | Expand with full menu, pricing |
| Fast Nails | `/nails` | ❌ Not created | Create complete page |
| Locations | `/locations` | ✅ Basic | Add all 4 services |
| Contact | `/contact` | ✅ Basic | Add form (Phase 5) |
| Blog | `/blog` | ❌ Not created | Create (Phase 2B) |
| Blog Post | `/blog/:slug` | ❌ Not created | Create (Phase 2B) |

---

## 9) SEO Strategy

### Keyword Targets:

**Primary Keywords (High Priority):**
- "tanning salon Mount Vernon Ohio"
- "laundromat Mount Vernon OH"
- "bubble tea Mount Vernon"
- "nail salon Mount Vernon Ohio"

**Secondary Keywords:**
- "tanning near me"
- "laundry service Mount Vernon"
- "Fizze Drinks Mount Vernon"
- "manicure pedicure Mount Vernon"
- "red light therapy Mount Vernon"
- "self-service laundry Mount Vernon"
- "nail appointments Mount Vernon"

**Long-Tail Keywords:**
- "best tanning salon in Mount Vernon"
- "24 hour laundromat near Mount Vernon"
- "where to get bubble tea in Mount Vernon Ohio"
- "gel manicure Mount Vernon"
- "tanning packages Mount Vernon"
- "drop-off laundry service Mount Vernon"
- "dirty soda Mount Vernon"

### Content Strategy:
- **Service Pages:** Detailed descriptions with local keywords naturally integrated
- **Blog Articles:** 15-20 initial articles targeting local + service keywords
- **FAQ Sections:** Answer common questions (great for featured snippets)
- **Schema Markup:** LocalBusiness, Service, FAQPage, Article for rich snippets
- **Regular Updates:** 2-3 blog posts per week for freshness signals

### Local SEO Tactics:
- NAP (Name, Address, Phone) consistency across all pages
- Embedded Google Maps on Locations page
- Google My Business optimization (external)
- Local business directory submissions (external)
- Customer reviews and testimonials

---

## 10) Risks & Assumptions

### Known Risks:
1. **Facebook API Limitations:** May need to use embed widgets instead of full API integration
2. **Fast Nails Pricing:** Estimated pricing needs confirmation from business owner
3. **E-Commerce Complexity:** Booking systems require significant backend development
4. **Payment Gateway:** Stripe integration deferred; placeholder UI needed for now
5. **Content Volume:** AI blog generation requires quality control and editing
6. **Facebook Page Access:** Need to verify public access to Facebook pages for feed integration

### Assumptions:
1. Fast Nails operates inside Eastend at 818 Coshocton Ave (same as Tanning & Laundry)
2. Business owner will provide accurate pricing for all services
3. Facebook pages are publicly accessible for feed integration
4. MongoDB is available and configured correctly
5. Future Stripe account will be set up by business owner when ready
6. Business owner will review and approve AI-generated blog content

---

## 11) Milestones & Progress

### Completed:
- ✅ **Phase 1 (COMPLETED):** MVP Home + Nav with 3 services, professional design, responsive layout

### Current Phase:
- 🔄 **Phase 2A (READY TO START):** Expand all service pages + add Fast Nails as 4th service

### Upcoming Phases:
- **Phase 2B:** Blog section with AI-generated content
- **Phase 2C:** Facebook feed integration
- **Phase 3:** E-commerce and booking systems
- **Phase 4:** Advanced SEO and schema markup
- **Phase 5:** Contact form and backend
- **Phase 6:** Gallery and social proof
- **Phase 7:** Testing, polish, and launch

---

## 12) Next Actions (Immediate - Phase 2A)

### Priority Order for Phase 2A:

**Step 1: Update Home Page for Fast Nails**
1. Update hero tagline to "Tanning Studio. Laundromat. Fizze Drinks. Nails."
2. Modify ServiceCard grid to 2x2 layout (4 cards)
3. Add 4th ServiceCard for Fast Nails
4. Update "Visit Us" section with separate entries for Fizze Drinks and Fast Nails
5. Update Header navigation to include "Nails" link
6. Update Footer to include "Fast Nails" in Quick Links

**Step 2: Create Fast Nails Page**
1. Build complete Fast Nails page (`/nails`)
2. Hero, services, pricing table, FAQ, booking CTA, hours/location
3. Add route to App.js

**Step 3: Create Reusable Components**
1. PricingTable component
2. FAQAccordion component
3. BookingCTA component

**Step 4: Expand Tanning Page**
1. Add 5 tanning levels with Tabs component
2. Add pricing table
3. Add products section
4. Add FAQ section
5. Add booking CTA

**Step 5: Expand Laundry Page**
1. Add two location comparison
2. Add services & amenities section
3. Add pricing table
4. Add FAQ section
5. Add drop-off signup CTA

**Step 6: Expand Fizze Drinks Page**
1. Add full menu grid with categories
2. Add pricing
3. Add FAQ section
4. Add order online CTA

**Step 7: Update Locations Page**
1. Add all 4 services to Eastend card
2. Add separate entries for Fizze Drinks and Fast Nails
3. Add comprehensive hours table

**Step 8: Test and Verify**
1. Take screenshots of all updated pages
2. Verify design compliance
3. Test navigation and CTAs
4. Check mobile responsiveness
5. Run frontend build check

---

## 13) Success Criteria

### Phase 1 (Completed): ✅
- ✅ Home page with 3 service funnels
- ✅ Responsive navigation with Call/Directions CTAs
- ✅ Professional design matching guidelines (sunny gold + teal)
- ✅ All basic pages created
- ✅ No console errors, clean build

### Phase 2A (Current - Success Criteria):
- [ ] Home page updated with 4th service (Fast Nails)
- [ ] All 4 service pages have detailed content, pricing, and FAQs
- [ ] Fast Nails page created and functional
- [ ] Locations page shows all 4 services with accurate hours
- [ ] All pages optimized for conversions with clear CTAs
- [ ] Reusable components created (PricingTable, FAQAccordion, BookingCTA)
- [ ] Frontend build passes with no errors
- [ ] Mobile responsive design verified
- [ ] Screenshots confirm design compliance

### Phase 2B (Blog Section):
- [ ] Blog landing page live with 15-20 AI-generated articles
- [ ] Blog articles indexed by Google
- [ ] Internal linking from blog to service pages
- [ ] Individual blog post pages functional

### Phase 2C (Facebook Integration):
- [ ] Facebook feeds integrated on all 4 service pages
- [ ] Live posts displaying correctly
- [ ] Mobile-responsive social proof

### Phase 3 (E-Commerce):
- [ ] Tanning booking system functional (skin quiz, forms, appointments)
- [ ] Tanning package purchase flow complete
- [ ] Nail appointment booking functional
- [ ] Laundry drop-off signup working
- [ ] Fizze Drinks online ordering operational
- [ ] All forms storing data in MongoDB correctly

### Phase 4 (SEO):
- [ ] Schema markup implemented for all services
- [ ] Lighthouse SEO score >90
- [ ] Local search rankings improved

### Phase 5 (Contact):
- [ ] Contact form functional with backend integration
- [ ] Inquiry emails sent to business owner

### Phase 6 (Gallery):
- [ ] Gallery with 50+ images from Facebook/Google
- [ ] Google Reviews prominently displayed

### Phase 7 (Launch):
- [ ] All tests passing
- [ ] Zero console errors
- [ ] Accessibility audit passed
- [ ] Ready for production launch

---

## 14) Files Created/Modified

### Phase 1 (Completed):

**Created:**
- `/app/frontend/src/components/Header.jsx` - Responsive header with nav
- `/app/frontend/src/components/Footer.jsx` - Footer with business info
- `/app/frontend/src/components/ServiceCard.jsx` - Reusable service card
- `/app/frontend/src/pages/Home.jsx` - Complete home page
- `/app/frontend/src/pages/Tanning.jsx` - Basic tanning page
- `/app/frontend/src/pages/Laundry.jsx` - Basic laundry page
- `/app/frontend/src/pages/Drinks.jsx` - Basic drinks page
- `/app/frontend/src/pages/Locations.jsx` - Basic locations page
- `/app/frontend/src/pages/Contact.jsx` - Basic contact page

**Modified:**
- `/app/frontend/public/index.html` - Added Google Fonts, updated meta
- `/app/frontend/src/index.css` - Added design tokens and custom styles
- `/app/frontend/src/App.js` - Implemented React Router with routes

**Dependencies Added:**
- `react-router-dom` - Client-side routing
- `framer-motion` - Animation library

---

### Phase 2A (To Be Created/Modified):

**To Create:**
- `/app/frontend/src/pages/Nails.jsx` 🆕 - Fast Nails page
- `/app/frontend/src/components/PricingTable.jsx` - Reusable pricing table
- `/app/frontend/src/components/FAQAccordion.jsx` - Reusable FAQ section
- `/app/frontend/src/components/BookingCTA.jsx` - Reusable booking CTA

**To Modify:**
- `/app/frontend/src/pages/Home.jsx` - Add 4th service, update Visit Us section
- `/app/frontend/src/pages/Tanning.jsx` - Expand with 5 levels, pricing, FAQ
- `/app/frontend/src/pages/Laundry.jsx` - Expand with amenities, pricing
- `/app/frontend/src/pages/Drinks.jsx` - Expand with full menu, pricing
- `/app/frontend/src/pages/Locations.jsx` - Add Fizze & Nails, hours table
- `/app/frontend/src/components/Header.jsx` - Add "Nails" link
- `/app/frontend/src/components/Footer.jsx` - Add "Fast Nails" link
- `/app/frontend/src/App.js` - Add `/nails` route

---

### Phase 2B (To Be Created):
- `/app/frontend/src/pages/Blog.jsx` - Blog landing page
- `/app/frontend/src/pages/BlogPost.jsx` - Individual blog post page
- `/app/frontend/src/components/BlogCard.jsx` - Blog article preview card
- `/app/backend/models/blog.py` - Blog post data model
- `/app/backend/routes/blog.py` - Blog API endpoints

---

### Phase 2C (To Be Created):
- `/app/frontend/src/components/FacebookFeed.jsx` - Facebook feed component
- `/app/backend/services/facebook_api.py` - Facebook API integration

---

### Phase 3+ (To Be Created):
- Booking, order, and form components
- Backend API routes for e-commerce
- MongoDB data models

---

## 15) Marketing & Sales Funnel Strategy

### Customer Journey Map:

**Discovery (Top of Funnel):**
- Google Search → Service page (SEO-optimized)
- Facebook Post → Service page (social proof)
- Blog Article → Service page (educational content)
- Word of mouth → Home page

**Consideration (Middle of Funnel):**
- Service Page → Pricing, FAQ, testimonials
- Facebook Feed → Recent posts, social proof
- Blog Articles → Expert advice, community trust
- Google Reviews → Trust signals

**Conversion (Bottom of Funnel):**
- Booking CTA → Appointment booking flow (Phase 3)
- Buy Package CTA → Package purchase flow (Phase 3)
- Order Online CTA → Online ordering flow (Phase 3)
- Call/Directions → Immediate action (current)

**Retention (Post-Purchase):**
- Email Notifications → Booking confirmations, reminders (future)
- Blog Subscriptions → Regular content updates (future)
- Loyalty Programs → Repeat customer incentives (future)

### Conversion Optimization Tactics:
- **Clear CTAs:** Every page has prominent, action-oriented buttons
- **Trust Signals:** Facebook feed, Google reviews, professional design
- **Reduced Friction:** One-click call/directions, streamlined forms
- **Social Proof:** Live Facebook posts, customer testimonials
- **Educational Content:** Blog articles, FAQs to address objections
- **Mobile-First:** Optimized for on-the-go bookings and orders
- **Visual Hierarchy:** Important info above the fold, clear navigation
- **Urgency:** "Book Now", "Order Today", "Call Now" language

---

**END OF UPDATED PLAN**
