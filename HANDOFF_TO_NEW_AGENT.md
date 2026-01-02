# HANDOFF TO NEW AGENT: Eastend Tanning Laundry Setup

## CRITICAL INSTRUCTIONS FROM USER

**User's Direct Instruction:**
"Name the project Eastend Tanning laundry before working. This is a direct instruction. Follow it."

**Project Name MUST BE:** `eastend-tanning-laundry`
**Preview URL MUST BE:** `https://holiday-discounts-2.preview.emergentagent.com`

---

## IMMEDIATE FIRST STEPS - DO THESE NOW

### 1. Verify Project Name
**BEFORE DOING ANYTHING ELSE**, confirm:
- [ ] Project name is: `eastend-tanning-laundry`
- [ ] Preview URL is: `https://holiday-discounts-2.preview.emergentagent.com`

If not, STOP and ask user to recreate the task with correct name.

### 2. Read Complete Documentation
- [ ] Read `/app/PROJECT_SETUP_GUIDE.md` (500+ lines, comprehensive)
- [ ] Read `/app/plan.md` (20 pages, full project history)
- [ ] Read this file completely before proceeding

### 3. Environment Setup

**Backend `.env` file:**
```bash
# Copy this EXACTLY to /app/backend/.env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="eastend_db"

# PayPal Production (user will provide secret)
PAYPAL_CLIENT_ID="AfDT4xEbDBYJbkqevhCTf0-hgchxACo55xgXMjgoMyElbFG0SaE52w1B066P_Jbn0YGNY6RSlUY31qob"
PAYPAL_CLIENT_SECRET="[ASK USER FOR THIS]"

# Admin Auth
JWT_SECRET="eastend_jwt_secret_key_2024"
ADMIN_EMAIL="admin@eastend.com"
ADMIN_PASSWORD="eastend2025"

# Emergent LLM (auto-provided by platform)
EMERGENT_LLM_KEY="[AUTO-SET]"

# Optional (not required)
SENDGRID_API_KEY=""
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
VAPI_API_KEY=""
STRIPE_API_KEY=""
STRIPE_WEBHOOK_SECRET=""
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
CORS_ORIGINS="*"
```

**Frontend `.env` file:**
```bash
# /app/frontend/.env - DO NOT MODIFY THIS
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### 4. Critical: Seed Database

**THIS IS MANDATORY - Run immediately after setup:**
```bash
cd /app/backend
python3 seed_fizze.py
```

Expected output:
```
Seeding Fizze drinks...
✅ Seeded 52 drinks successfully!

Drinks by category:
  Milk Teas: 7
  Fruit Teas: 7
  Blended Ice: 7
  Hot Boba: 3
  House Specials: 3
  Toppings: 7
  Dirty Sodas: 9
  Shakes: 9

Done! Fizze menu is ready.
```

**Verify seed worked:**
```bash
curl http://localhost:8001/api/fizze/menu | jq 'keys'
```

Should return:
```json
[
  "Blended Ice",
  "Dirty Sodas",
  "Fruit Teas",
  "Hot Boba",
  "House Specials",
  "Milk Teas",
  "Shakes",
  "Toppings"
]
```

---

## PROJECT OVERVIEW

**Complete E-Commerce Platform for Eastend Tanning & Laundry**

### Features (100% Complete in Previous Project)
1. **52 Fizze Drinks** - Bubble tea, smoothies, dirty sodas with recipes
2. **24 Tanning Packages** - 6 bed levels × 4 package types
3. **8 Tanning Lotions** - Professional brands with strategic pricing
4. **Unified Shopping Cart** - Multi-item checkout
5. **818 Food Truck Stop** - Booking system with custom logo
6. **Mary Well AI Chat** - Customer consultation with memory
7. **Customer Profiles** - Persistent memory across visits
8. **PayPal Integration** - Production mode, dynamic amounts
9. **Admin Dashboard** - 10+ tabs including Recipe tab
10. **SEO Optimized** - 95/100 score

### Tech Stack
- **Backend:** FastAPI (Python 3.11)
- **Frontend:** React 18 with hooks
- **Database:** MongoDB (`eastend_db`)
- **Payment:** PayPal Orders API v2 (PRODUCTION)
- **AI:** Emergent LLM (GPT-4o + Claude Sonnet 4)
- **UI:** Shadcn components + Tailwind CSS

---

## VERIFICATION CHECKLIST - DO THIS IN ORDER

### Phase 1: Services (2 minutes)
```bash
# Check all services running
supervisorctl status

# Expected:
# backend   RUNNING
# frontend  RUNNING
# mongodb   RUNNING
```

### Phase 2: Database (2 minutes)
```bash
# Seed Fizze drinks
cd /app/backend && python3 seed_fizze.py

# Verify API returns drinks
curl http://localhost:8001/api/fizze/menu | jq 'keys'
```

### Phase 3: Frontend (5 minutes)
Take screenshots of these pages:

1. **Homepage** (`/`)
   - [ ] 5 service cards visible
   - [ ] Last card is "818 Food Truck Stop"
   - [ ] Food Truck CTA section before FAQ
   - [ ] Header has "Book Your Spot" button (last position)

2. **Fizze Drinks** (`/drinks`)
   - [ ] Hero with "FIZZE DRINKS" title
   - [ ] 8 category headers with gradients
   - [ ] Individual drink cards with prices
   - [ ] "Order Now" buttons

3. **Tanning** (`/tanning`)
   - [ ] 6 bed levels displayed
   - [ ] Consultation banners clickable
   - [ ] "Not Sure Which Bed" section

4. **Food Truck Stop** (`/foodtruck`)
   - [ ] Custom orange truck logo in hero
   - [ ] 4 amenity cards (Electricity, Water, Traffic, $70)
   - [ ] Date availability checker
   - [ ] Booking form with photo uploads

5. **Unified Checkout** (`/checkout`)
   - [ ] Can add multiple tanning packages
   - [ ] Can add multiple lotions
   - [ ] Cart with quantity controls
   - [ ] Tax calculation working

### Phase 4: Backend APIs (3 minutes)
Test these endpoints:

```bash
# Fizze menu
curl http://localhost:8001/api/fizze/menu | jq 'keys'

# Food truck availability (should return empty array initially)
curl http://localhost:8001/api/foodtruck/upcoming-bookings?days=7

# PayPal routes exist
curl http://localhost:8001/docs | grep -i paypal
```

### Phase 5: Admin Dashboard (5 minutes)
1. Navigate to `/admin`
2. Login: `admin@eastend.com` / `eastend2025`
3. Verify tabs: Recommendations, Campaigns, Leads, Discounts, Lotions, Voice Calls, Fizze, Orders, Users, **Recipes**
4. Click **Recipes tab**
5. Verify: All 52 drinks with recipes visible
6. Test: "Print Recipes" button

### Phase 6: PayPal Integration (Check Only)
**DO NOT TEST REAL PAYMENTS - Just verify:**
- [ ] PayPal SDK loaded in `/app/frontend/public/index.html`
- [ ] Backend has PayPal routes: `/api/paypal/create-order`, `/api/paypal/capture-order`
- [ ] Client ID in .env matches index.html
- [ ] Buttons will appear on receipt pages (don't trigger them)

---

## CRITICAL REQUIREMENTS - USER'S EXPECTATIONS

### 1. Project Name
✅ MUST be: `eastend-tanning-laundry`
✅ Preview URL MUST show: `https://holiday-discounts-2.preview.emergentagent.com`

### 2. Fizze Drinks Menu
✅ MUST show 52 drinks across 8 categories
✅ MUST include recipes (visible in admin)
✅ MUST have prices displayed

### 3. Food Truck Stop
✅ MUST have custom logo (orange truck SVG)
✅ MUST be last service card on homepage
✅ "Book Your Spot" button MUST be last in header

### 4. Database Population
✅ MUST run seed_fizze.py (52 drinks)
✅ Database name MUST be `eastend_db`

### 5. Admin Recipes
✅ Recipe tab MUST exist
✅ MUST show all 52 drink recipes
✅ MUST be printable for staff

---

## COMMON ISSUES & SOLUTIONS

### Issue: Fizze drinks not showing
**Solution:** Run `python3 /app/backend/seed_fizze.py`
**Verify:** `curl http://localhost:8001/api/fizze/menu | jq 'keys'`

### Issue: Services not starting
**Solution:** Check logs
```bash
tail -n 50 /var/log/supervisor/backend.err.log
tail -n 50 /var/log/supervisor/frontend.err.log
```

### Issue: Frontend won't compile
**Solution:** Use `yarn` not `npm`
```bash
cd /app/frontend
yarn install
yarn build
```

### Issue: PayPal button not showing
**Cause:** Either SDK not loaded OR client ID mismatch
**Solution:** Check `/app/frontend/public/index.html` line 14 has PayPal SDK

### Issue: Admin recipes tab empty
**Cause:** Database not seeded
**Solution:** Run seed script again

---

## FILE STRUCTURE REFERENCE

```
/app/
├── PROJECT_SETUP_GUIDE.md       ← Complete setup (500+ lines)
├── FORK_INSTRUCTIONS.md         ← Fork steps
├── HANDOFF_TO_NEW_AGENT.md      ← This file
├── plan.md                      ← Full project history (20 pages)
│
├── backend/
│   ├── server.py                ← Main FastAPI app
│   ├── seed_fizze.py            ← 52 drinks seed script ⚠️ RUN THIS
│   ├── fizze_routes.py          ← Fizze API
│   ├── paypal_routes.py         ← PayPal integration
│   ├── foodtruck_routes.py      ← Food truck bookings
│   ├── customer_routes.py       ← Customer profiles
│   ├── cart_routes.py           ← Unified cart
│   ├── mary_well.py             ← AI system prompt
│   └── .env                     ← Configure this
│
└── frontend/
    ├── src/
    │   ├── App.js               ← 20+ routes
    │   ├── pages/
    │   │   ├── Drinks.jsx       ← Fizze menu (must show 52)
    │   │   ├── FoodTruckStop.jsx ← With logo
    │   │   ├── Admin.jsx        ← Recipe tab
    │   │   └── [18 other pages]
    │   └── components/
    │       ├── FoodTruckLogo.jsx ← Custom SVG logo
    │       └── ui/              ← Shadcn components
    └── package.json             ← Name: "eastend-tanning-laundry"
```

---

## FINAL CHECKLIST BEFORE REPORTING TO USER

Before saying "Setup complete", verify:

- [ ] Project name is `eastend-tanning-laundry`
- [ ] Preview URL shows correct name
- [ ] All services running (supervisorctl status)
- [ ] Database seeded (52 drinks confirmed)
- [ ] Fizze drinks page shows menu
- [ ] Food truck page has logo
- [ ] Admin recipes tab has 52 recipes
- [ ] "Book Your Spot" button in header (last position)
- [ ] Food Truck Stop card on homepage (last position)
- [ ] Zero console errors
- [ ] Zero compilation errors
- [ ] Screenshots taken of all key pages

---

## REPORTING TO USER - USE THIS FORMAT

After completing setup, report with this structure:

```
✅ Eastend Tanning Laundry Project Setup Complete

Project Details:
- Name: eastend-tanning-laundry
- Preview URL: https://holiday-discounts-2.preview.emergentagent.com
- Database: eastend_db (populated)

Verification Results:
✅ Services: All running (backend, frontend, mongodb)
✅ Database: 52 Fizze drinks seeded successfully
✅ Fizze Menu: Displaying 8 categories with drinks
✅ Food Truck: Custom logo visible, booking form functional
✅ Admin: Recipe tab shows all 52 recipes
✅ Navigation: "Book Your Spot" in header (last position)
✅ Homepage: Food Truck Stop card (last position)
✅ PayPal: Integration configured (production mode)
✅ Compilation: Zero errors

[Include 4-5 screenshots showing key pages]

Ready for use! All features operational.
```

---

## EMERGENCY CONTACT

If issues arise:
- **Full Documentation:** `/app/PROJECT_SETUP_GUIDE.md`
- **Project History:** `/app/plan.md`
- **Emergent Support:** support@emergent.sh
- **Discord:** https://discord.gg/VzKfwCXC4A

---

**USER'S REQUIREMENT:** Project name MUST be "eastend-tanning-laundry"
**CRITICAL:** Verify this FIRST before any other work!

**Everything is documented and ready for immediate setup!** 🚀
