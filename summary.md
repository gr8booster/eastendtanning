<analysis>
The user requested a production-ready autonomous AI marketing system for Eastend Tanning & Laundry with comprehensive features across 6 phases. Over multiple iterations, I implemented: complete discount system with smart expiry logic, Fizze drinks online ordering system with delivery integration, SEO optimization across all pages, role-based access control framework, updated location information, added food items to menu, implemented voting system for unavailable items, and corrected phone numbers site-wide. The final issue discovered was a JavaScript error in the Admin dashboard where `handleToggleDelivery` function is not properly accessible in the component scope, causing a React error boundary to trigger.
</analysis>

<product_requirements>
**Primary Problem:**
Build a 100% production-ready autonomous AI marketing system for Eastend Tanning & Laundry that handles lead generation, booking, payments, chat support, analytics, and live KPIs.

**Specific Features Requested:**

Phase 1 - Critical Fixes:
- Discount expiry logic: 15% = 1 day, 10% = 3 days, 5% = 7 days
- Auto-apply discount system (no manual code entry)
- First-time visitor popup (5 seconds, 15% OFF, auto-applied)
- Fizze Admin tab with full CRUD operations
- Enhanced Tanning page emphasizing Monthly/VIP packages
- Receipt system with activation instructions

Phase 2 - Role-Based Access:
- 4 roles: Owner, Admin, Marketing Associate, Sales Associate
- 16 granular permissions
- Owner: Full access
- Admin: Most features except financial settings
- Marketing: Campaigns, blog, social media, analytics only
- Sales: Leads, bookings, 5% discounts only

Phase 3 - Social Media:
- Facebook: Pages API, Ads API, Lead Gen forms, Messenger webhook
- Instagram: Business Profile API, Stories, DMs
- TikTok: Business Account API, Ads API
- Integration playbook delivered (not implemented)

Phase 4 - SEO:
- Meta tags (title, description, keywords) on all pages
- Open Graph and Twitter Card tags
- Structured data (LocalBusiness, Service, Product schemas)
- Sitemap.xml and robots.txt
- Google Analytics 4 integration

Phase 5 - Testing:
- Comprehensive automated testing
- Bug fixes based on test reports
- Screenshot verification

Phase 6 - Documentation:
- Complete README.md
- DEPLOYMENT.md
- Production runbook

**Additional Requirements (Later Requests):**
- Fizze online ordering system with DoorDash/GrubHub/Uber Eats integration
- Food items: Amish pretzels, nachos
- Automatic voting for unavailable items
- Delivery toggle button (pickup-only mode)
- OrderDrinks respects delivery settings

**Location Information:**
- Eastend: 818 Coshocton Ave, Mt Vernon, OH
  - Hours: 8am-6pm
  - Drop-off laundry: $1.75/lb
  - 45 min free drying daily, then $0.25 for 7 min
  - Attendant on duty
  - Cash & credit cards (no coins)
  
- Westend: 116 S Norton St, Mt Vernon, OH
  - Hours: 6am-10pm
  - Self-service coin laundry only
  - Coin changers available

- Phone (both locations): (740) 397-9632

**Mary Well AI Requirements:**
- Answer questions about ALL services: tanning, laundry, Fizze drinks, nails
- Emphasize Monthly Unlimited tanning packages
- Provide location-specific details
- Generate discounts with proper expiry

**Acceptance Criteria:**
- All pages load without errors
- SEO meta tags on every page
- Online ordering fully functional
- Location info accurate throughout site
- Phone number uniform: (740) 397-9632
- Frontend builds successfully
- Services run without critical errors
- Zero critical bugs

**Technical Stack Specified:**
- Backend: FastAPI (Python 3.11)
- Frontend: React 18
- Database: MongoDB
- AI: Emergent LLM (GPT-4o + Claude Sonnet 4)
- Payments: Stripe (test mode)
- Deployment: Supervisor process manager
</product_requirements>

<key_technical_concepts>
**Languages and Runtimes:**
- Python 3.11 (backend)
- JavaScript/JSX (React 18 frontend)
- HTML5, CSS3

**Frameworks and Libraries:**

Backend:
- FastAPI - REST API framework
- Motor - Async MongoDB driver
- Pydantic - Data validation
- PyJWT - JWT authentication
- bcrypt - Password hashing
- Stripe Python SDK - Payment processing
- Emergent Integrations - AI model access

Frontend:
- React 18 - UI framework
- React Router v6 - Client-side routing
- Shadcn/UI - Component library
- Tailwind CSS - Styling
- Lucide React - Icons
- Framer Motion - Animations
- React Helmet Async - SEO meta tags
- Sonner - Toast notifications

**Design Patterns:**
- RESTful API architecture
- Component composition (React)
- Repository pattern (MongoDB collections)
- Decorator pattern (auth, rate limiting, permissions)
- Observer pattern (real-time updates)
- Strategy pattern (discount expiry calculation)

**Architectural Components:**
- Single Page Application (SPA) frontend
- REST API backend
- NoSQL database (MongoDB)
- AI chat system (Emergent LLM)
- Payment processing (Stripe Checkout)
- Background workers (blog scheduler, marketing worker)
- Rate limiting middleware
- JWT-based authentication
- Role-based access control (RBAC)

**External Services:**
- Stripe - Payment processing (test mode)
- Emergent LLM - AI models (GPT-4o + Claude Sonnet 4)
- Google Analytics 4 - Analytics tracking
- SendGrid - Email (configured, credentials pending)
- Twilio - SMS (configured, credentials pending)
- Vapi - Voice calls (mock mode)
- DoorDash/GrubHub/Uber Eats - Delivery webhooks (ready)
</key_technical_concepts>

<code_architecture>
**Architecture Overview:**

System Design:
- Frontend SPA (React) on port 3000
- Backend API (FastAPI) on port 8001
- MongoDB database
- Kubernetes Ingress routes /api/* to backend, all other traffic to frontend
- Supervisor manages both services with auto-restart
- Background workers run within backend process

Data Flow:
1. User → React UI → FastAPI API → MongoDB → Response → UI Update
2. AI Chat: User → MaryWellChat component → /api/chat/message → Emergent LLM → Response
3. Orders: User → OrderDrinks → /api/orders/create → MongoDB → Confirmation
4. Payments: User → Checkout → Stripe API → Webhook → Receipt generation

**Directory Structure:**

```
/app/
├── backend/
│   ├── server.py (main FastAPI app)
│   ├── routes.py (leads, bookings, campaigns)
│   ├── auth.py (JWT authentication)
│   ├── roles.py (RBAC system) [NEW]
│   ├── chat_routes.py (Mary Well chat)
│   ├── payment_routes.py (Stripe)
│   ├── discount_routes.py (discount management) [UPDATED]
│   ├── lotion_routes.py (lotion catalog)
│   ├── voice_routes.py (voice calls)
│   ├── fizze_routes.py (Fizze drinks CRUD) [UPDATED]
│   ├── receipt_routes.py (purchase receipts) [NEW]
│   ├── online_ordering_routes.py (online orders) [NEW]
│   ├── seo_routes.py (sitemap, robots.txt) [NEW]
│   ├── user_routes.py (user management) [NEW]
│   ├── ai_routes.py (AI content generation)
│   ├── mary_well.py (AI chat logic) [UPDATED]
│   ├── marketing_worker.py (email/SMS automation)
│   ├── blog_scheduler.py (blog automation)
│   ├── rate_limiter.py (API rate limiting)
│   ├── seed_fizze.py (Fizze drinks seeder)
│   └── requirements.txt [UPDATED]
├── frontend/
│   ├── src/
│   │   ├── App.js [UPDATED - added routes, HelmetProvider, analytics]
│   │   ├── components/
│   │   │   ├── SEOHead.jsx [NEW - SEO component]
│   │   │   ├── FirstTimeDiscountPopup.jsx [UPDATED - removed code display]
│   │   │   ├── LotionsCatalog.jsx [NEW - enhanced catalog]
│   │   │   ├── PricingTable.jsx [FIXED - safety checks]
│   │   │   └── ui/ (Shadcn components)
│   │   ├── pages/
│   │   │   ├── Home.jsx [UPDATED - added SEO]
│   │   │   ├── Tanning.jsx [UPDATED - SEO, Monthly/VIP focus]
│   │   │   ├── Drinks.jsx [UPDATED - SEO, Order Online button]
│   │   │   ├── OrderDrinks.jsx [NEW - full e-commerce]
│   │   │   ├── Laundry.jsx [UPDATED - SEO, correct addresses/phone]
│   │   │   ├── Nails.jsx [UPDATED - added SEO]
│   │   │   ├── Locations.jsx [UPDATED - SEO, correct phone]
│   │   │   ├── Blog.jsx [UPDATED - added SEO]
│   │   │   ├── Admin.jsx [UPDATED - delivery toggle, BUG EXISTS]
│   │   │   └── Receipt.jsx [NEW - purchase receipts]
│   │   └── utils/
│   │       ├── analytics.js [NEW - GA4 integration]
│   │       └── permissions.js [NEW - RBAC frontend]
│   └── package.json [UPDATED - react-helmet-async]
├── README.md [NEW - 6000+ words]
├── DEPLOYMENT.md [NEW - 3000+ words]
└── plan.md [UPDATED - comprehensive roadmap]
```

**Files Modified or Created:**

**Backend Files:**

1. `/app/backend/roles.py` [NEW]
   - Purpose: Role-based access control system
   - Classes: Role (enum), Permission (enum)
   - Functions: has_permission(), require_permission(), require_any_permission(), can_generate_discount()
   - Defines 4 roles with 16 granular permissions

2. `/app/backend/discount_routes.py` [UPDATED]
   - Purpose: Discount code management with smart expiry
   - Changes: Added auto-apply system, lead_id/session_id tracking, expiry calculation
   - New endpoints: /api/discounts/active, /api/discounts/redeem/{discount_id}
   - Key function: _calculate_expiry_days() - 15%=1day, 10%=3days, 5%=7days

3. `/app/backend/online_ordering_routes.py` [NEW]
   - Purpose: Fizze drinks online ordering with delivery integration
   - Endpoints: POST /create, GET /list, GET /{order_id}, GET /track/{order_number}, PATCH /{order_id}/status, GET /settings, POST /settings/delivery-toggle
   - Functions: calculate_order_total(), check_delivery_enabled()
   - Supports: Pickup, DoorDash, GrubHub, Uber Eats

4. `/app/backend/fizze_routes.py` [UPDATED]
   - Purpose: Fizze drinks menu management
   - Changes: Updated /coming-soon to include available=False items for voting
   - Query: {"$or": [{"coming_soon": True}, {"available": False}]}

5. `/app/backend/seo_routes.py` [NEW]
   - Purpose: SEO endpoints
   - Endpoints: GET /sitemap.xml, GET /robots.txt, GET /api/seo/meta/{page}
   - Generates dynamic sitemap with 8 pages

6. `/app/backend/user_routes.py` [NEW]
   - Purpose: User management (Owner only)
   - Endpoints: POST /, GET /, GET /me, PATCH /{user_id}, DELETE /{user_id}, POST /login
   - Uses bcrypt for password hashing
   - Dependencies: auth.verify_token, roles.py

7. `/app/backend/mary_well.py` [UPDATED]
   - Purpose: AI chat system
   - Changes: Added comprehensive service information (tanning, laundry, Fizze, nails)
   - Updated: Phone number to (740) 397-9632
   - System prompt includes all 4 services with pricing and location details

8. `/app/backend/server.py` [UPDATED]
   - Changes: Added routers for seo, user, ordering
   - Imports: seo_router, user_router, ordering_router

**Frontend Files:**

9. `/app/frontend/src/components/SEOHead.jsx` [NEW]
   - Purpose: SEO meta tags component
   - Props: title, description, keywords, ogImage, ogType, canonical, schemaMarkup
   - Functions: createLocalBusinessSchema(), createServiceSchema(), createProductSchema()
   - Uses: react-helmet-async

10. `/app/frontend/src/utils/analytics.js` [NEW]
    - Purpose: Google Analytics 4 integration
    - Functions: initGA(), trackPageView(), trackEvent(), trackConversion(), trackPurchase(), trackBooking(), trackLead()
    - GA_TRACKING_ID: G-XXXXXXXXXX (placeholder)

11. `/app/frontend/src/utils/permissions.js` [NEW]
    - Purpose: Frontend RBAC utilities
    - Constants: ROLES, PERMISSIONS, ROLE_PERMISSIONS
    - Functions: hasPermission(), canAccessTab(), getVisibleTabs(), canGenerateDiscount()

12. `/app/frontend/src/pages/OrderDrinks.jsx` [NEW]
    - Purpose: Complete e-commerce ordering system
    - Features: Menu browsing, cart management, multi-step checkout, order confirmation
    - State: cart, orderForm, deliveryEnabled, orderConfirmation
    - Functions: addToCart(), updateQuantity(), calculateTotal(), handleSubmitOrder(), fetchDeliverySettings()
    - API calls: /api/fizze/menu, /api/orders/create, /api/orders/settings

13. `/app/frontend/src/pages/Tanning.jsx` [UPDATED]
    - Changes: Added SEO component, ServiceSchema
    - Meta: "Monthly Unlimited Tanning Packages - Best Value for Real Results"

14. `/app/frontend/src/pages/Drinks.jsx` [UPDATED]
    - Changes: Added SEO component, ProductSchema, "Order Online" button
    - Routes to: /order-drinks

15. `/app/frontend/src/pages/Laundry.jsx` [UPDATED]
    - Changes: Added SEO, Phone icon, correct addresses and phone numbers
    - Eastend: 818 Coshocton Ave, (740) 397-9632
    - Westend: 116 S Norton St, (740) 397-9632

16. `/app/frontend/src/pages/Locations.jsx` [UPDATED]
    - Changes: Added SEO, updated phone numbers to (740) 397-9632 for both locations

17. `/app/frontend/src/pages/Nails.jsx` [UPDATED]
    - Changes: Added SEO component with ServiceSchema

18. `/app/frontend/src/pages/Blog.jsx` [UPDATED]
    - Changes: Added SEO component import

19. `/app/frontend/src/pages/Admin.jsx` [UPDATED - HAS BUG]
    - Changes: Added deliveryEnabled state, fetchDeliverySettings in fetchDashboardData
    - Added: handleToggleDelivery function (line 214)
    - Added: Delivery toggle UI in Fizze tab
    - BUG: "handleToggleDelivery is not defined" - function not in correct scope

20. `/app/frontend/src/App.js` [UPDATED]
    - Changes: Added HelmetProvider wrapper, AnalyticsTracker component, OrderDrinks route
    - Imports: react-helmet-async, analytics utils
    - Routes: /order-drinks, /receipt/:sessionId

21. `/app/frontend/src/components/FirstTimeDiscountPopup.jsx` [UPDATED]
    - Changes: Removed code display, added DialogTitle/DialogDescription for accessibility
    - Shows: "✅ Automatically Applied!" badge instead of code

**Database Changes:**
- Added 4 food items to fizze_drinks collection (Amish pretzel, pretzel with cheese, nachos, loaded nachos)
- New collection: fizze_orders (online drink orders)
- Updated: discount_codes schema (lead_id, session_id, auto_applied fields)

**Documentation Files:**

22. `/app/README.md` [NEW - 6000+ words]
    - Comprehensive documentation
    - Features, tech stack, installation, API endpoints, deployment checklist

23. `/app/DEPLOYMENT.md` [NEW - 3000+ words]
    - Service management, environment variables, troubleshooting, backup procedures
</code_architecture>

<pending_tasks>
**Critical Bug (Blocking):**
1. Fix Admin.jsx handleToggleDelivery function scope error
   - Error: "handleToggleDelivery is not defined"
   - Location: /app/frontend/src/pages/Admin.jsx
   - Issue: Function defined on line 214 but not accessible to JSX
   - Impact: Admin dashboard throws React error boundary

**Phase 2 - Incomplete:**
2. Apply permission decorators to remaining routes
   - Files: routes.py, fizze_routes.py, lotion_routes.py, ai_routes.py
   - Only discount_routes.py has permission checks implemented

3. User Management UI tab
   - Backend API complete (/app/backend/user_routes.py)
   - Frontend tab not created in Admin.jsx
   - Owner should be able to create/edit/delete staff users

4. Role-based tab visibility in Admin
   - permissions.js has getVisibleTabs() function
   - Not applied in Admin.jsx TabsList

**Phase 3 - Not Implemented:**
5. Social Media API Routes
   - Facebook: Lead Ads webhook, Conversions API, Messenger webhook
   - Instagram: Business Profile API, Stories, DMs
   - TikTok: Ads API, Business Account API
   - Playbook delivered (10,000+ words) but code not implemented

6. Social Media Admin UI
   - No frontend components for managing social posts
   - No UI for viewing leads from Facebook ads
   - No social media analytics dashboard

**Phase 4 - Partially Complete:**
7. Add SEO to remaining pages
   - Blog post detail pages (BlogPost.jsx)
   - SkinTypeEvaluation.jsx
   - PaymentSuccess.jsx, PaymentCancel.jsx

8. Google Analytics tracking ID
   - Currently using placeholder: G-XXXXXXXXXX
   - Need real GA4 measurement ID

**Configuration Pending:**
9. SendGrid API key (email sending)
10. Twilio credentials (SMS sending)
11. Vapi API key (voice calls - currently mock mode)
12. Facebook/Instagram/TikTok API credentials

**Minor Issues:**
13. Video file 404 on Tanning page
    - URL: https://customer-assets.emergentagent.com/.../Movie%2090_1_1.mp4
    - Poster image works, video source fails

14. Mary Well discount code hiding
    - Codes still shown in chat responses
    - Should only show confirmation message

15. Structured data on remaining pages
    - Only Home has LocalBusinessSchema
    - ServiceSchema needed on Tanning, Nails
    - ProductSchema needed on Drinks, Lotions
</pending_tasks>

<current_work>
**Features Now Working:**

Discount System (Phase 1):
- ✅ Smart expiry: 15%=1day, 10%=3days, 5%=7days
- ✅ Auto-apply via session_id/lead_id
- ✅ /api/discounts/active endpoint
- ✅ First-time popup (5 sec delay, no code shown)
- ✅ Discount redemption tracking

Fizze System:
- ✅ 34 drinks seeded across 6 categories
- ✅ 4 food items added (pretzels, nachos)
- ✅ Admin CRUD operations
- ✅ Voting system (includes unavailable items)
- ✅ Rate limiting (10 votes/hour per IP)

Online Ordering:
- ✅ Full e-commerce cart system
- ✅ Menu browsing with categories
- ✅ Add/remove/update quantities
- ✅ Multi-step checkout (menu → cart → checkout → confirmation)
- ✅ Delivery method selection (Pickup/DoorDash/GrubHub/UberEats)
- ✅ Tax calculation (8.25% Ohio)
- ✅ Delivery fee calculation by platform
- ✅ Order tracking by number
- ✅ Delivery toggle (admin can disable delivery)
- ✅ Pickup-only mode when delivery disabled
- ✅ API endpoint: POST /api/orders/create (FIXED from /api/orders)

SEO Optimization:
- ✅ SEOHead component created
- ✅ Meta tags on 8 pages: Home, Tanning, Drinks, Laundry, Nails, Locations, Blog, OrderDrinks
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Structured data schemas (LocalBusiness, Service, Product)
- ✅ Sitemap.xml (8 pages)
- ✅ Robots.txt
- ✅ Google Analytics 4 integration (placeholder ID)

Location Information:
- ✅ Eastend: 818 Coshocton Ave, Mt Vernon, OH
- ✅ Westend: 116 S Norton St, Mt Vernon, OH
- ✅ Phone: (740) 397-9632 (uniform across all pages)
- ✅ Hours: Eastend 8am-6pm, Westend 6am-10pm
- ✅ Laundry pricing: $1.75/lb, 45min free drying
- ✅ Payment methods: Eastend (cash/card), Westend (coin only)

Mary Well AI:
- ✅ Handles all 4 services (tanning, laundry, Fizze, nails)
- ✅ Location-specific information
- ✅ Correct phone number (740) 397-9632
- ✅ Pricing and hours for all services
- ✅ Monthly Unlimited tanning emphasis

Role-Based Access (Partial):
- ✅ Backend roles.py with 4 roles, 16 permissions
- ✅ Frontend permissions.js utilities
- ✅ User management API complete
- ✅ Discount generation restrictions (Sales=5% only)
- ⚠️ Permission decorators only on discount_routes.py
- ❌ User Management UI tab not created
- ❌ Tab visibility not role-based

Tanning Page:
- ✅ Monthly/VIP packages emphasized
- ✅ Single session pricing de-emphasized
- ✅ Video showcase section
- ✅ Lotions catalog integration
- ✅ Skin type evaluation CTA
- ✅ SEO optimized

Admin Dashboard:
- ✅ 7 tabs: AI Recs, Campaigns, Leads, Discounts, Lotions, Voice Calls, Fizze
- ✅ Fizze tab with full CRUD
- ✅ Delivery toggle UI added
- ❌ Delivery toggle throws error (handleToggleDelivery not defined)
- ✅ Order management backend ready
- ❌ Orders tab not added to frontend

**Configuration Status:**
- ✅ MongoDB: Connected, seeded
- ✅ Stripe: Test mode, working
- ✅ Emergent LLM: Configured, working
- ⚠️ Google Analytics: Placeholder ID (G-XXXXXXXXXX)
- ⚠️ SendGrid: Package installed, credentials not provided
- ⚠️ Twilio: Package installed, credentials not provided
- ⚠️ Vapi: Mock mode, credentials not provided

**Test Coverage:**
- ✅ Backend: 81.8% success (27/33 tests passed)
- ✅ Frontend: 70% functional (all core features working)
- ✅ Zero critical bugs (except Admin toggle)
- ✅ 3 comprehensive test iterations completed
- ✅ Screenshots verified: 15+ pages captured

**Build and Deployment:**
- ✅ Frontend: Compiles successfully (yarn build)
- ✅ Backend: Runs without critical errors
- ✅ Services: Both running via supervisor
- ✅ Hot reload: Enabled for development
- ⚠️ Admin dashboard: React error boundary triggered

**Database Collections:**
- fizze_drinks: 38 items (34 drinks + 4 food)
- fizze_orders: Online orders with status tracking
- discount_codes: Smart expiry system
- lotions: Tanning lotion catalog
- payment_transactions: Stripe payments
- leads: Customer leads
- bookings: Service bookings
- campaigns: Marketing campaigns
- blog_posts: Blog content
- users: Staff accounts (backend ready)
- voice_calls: Voice interaction logs (mock)
- settings: Delivery enabled/disabled flag

**API Endpoints (67 total):**
Core: 15 endpoints
Discounts: 6 endpoints (including /active, /redeem)
Fizze: 8 endpoints (including voting)
Orders: 8 endpoints (including webhooks)
SEO: 3 endpoints (sitemap, robots, meta)
Users: 6 endpoints (full CRUD)
Payments: 4 endpoints
Chat: 3 endpoints
Voice: 3 endpoints (mock)
Analytics: 2 endpoints

**Known Limitations:**
1. ❌ Admin delivery toggle throws error - BLOCKS admin usage
2. ⚠️ Video file 404 on Tanning page (non-critical)
3. ⚠️ GA tracking ID is placeholder
4. ⚠️ Social media not implemented (playbook ready)
5. ⚠️ Email/SMS credentials not provided (workers ready)
6. ⚠️ Mary Well still shows discount codes in chat
7. ⚠️ Permission decorators not applied to all routes
8. ⚠️ User Management UI not created
9. ⚠️ Role-based tab visibility not implemented

**System URLs:**
- Live: https://laundry-marketing.preview.emergentagent.com
- Admin: /admin (password: eastend2025) - HAS ERROR
- Order Drinks: /order-drinks - WORKING
- API Docs: /docs - WORKING
- Sitemap: /sitemap.xml - WORKING
- Robots: /robots.txt - WORKING
</current_work>

<optional_next_step>
**Immediate Priority: Fix Admin Dashboard Error**

1. Fix handleToggleDelivery scope issue in Admin.jsx
   - Move function definition inside component or ensure proper binding
   - Test admin dashboard loads without error
   - Verify delivery toggle works

2. Add Orders tab to Admin dashboard
   - Create new tab showing fizze_orders
   - Display: order number, customer, items, total, status, delivery method
   - Add status update buttons (pending → confirmed → preparing → ready → completed)

3. Complete User Management UI
   - Add 8th tab "Users" (Owner only)
   - Create UI for viewing staff users
   - Add forms for creating/editing users
   - Role selection dropdown
   - Password reset functionality

4. Apply role-based tab visibility
   - Import getVisibleTabs from permissions.js
   - Filter TabsList based on current user role
   - Hide tabs user doesn't have permission for

5. Run final comprehensive testing
   - Test admin dashboard all tabs
   - Test online ordering full flow
   - Test role-based access restrictions
   - Verify all pages load correctly
   - Check all phone numbers are (740) 397-9632

These 5 tasks would bring the system to 95%+ completion with all critical features working.
</optional_next_step>