# Eastend Tanning & Laundry — Discount Codes + Bed Recommendations Plan

Context sync
- Approved scope now: (1) Discount Codes MVP with 5%, 10%, 15% tiers, (2) Bed Recommendations upgrade in chat
- Preview URL to validate/screenshots: https://tanmarketing.preview.emergentagent.com
- Testing: Run automated testing agent (frontend + backend) with screenshots; user will also click through
- Tech: FastAPI + React + MongoDB; Stripe test mode; Emergent LLM key already configured

POC decision
- Complexity level: Payment flow changes (Stripe) → Level 4 → POC REQUIRED
- POC scope: Prove end-to-end discount application affects checkout amount and lifecycle updates (pending → paid) without breaking existing flow

1) Objectives
- Implement secure discount-code lifecycle with 5/10/15% tiers and expiry
- Apply optional discount in Stripe checkout creation (server-verified)
- Update Mary Well to mention available 5/10/15% discounts and always show 3 bed options (budget/recommended/premium) with stronger upsell to Level 4 & Matrix
- Add chat UI actions to generate and display discount codes; add “See full pricing” button and package chips
- Add Admin tab to list discount codes with statuses
- Deliver with automated tests and screenshots

2) Implementation Steps (Phased)

Phase 1: Core POC (Discounted Stripe Session) — REQUIRED
- Backend scratch endpoints/tests: 
  - POST /api/discounts/generate (percent_off ∈ {5,10,15}, expires_at=7 days default) → returns {code, percent_off, expires_at, id}
  - GET /api/discounts/validate/{code} → returns validity + meta
- Add optional discount_code to POST /api/payments/checkout/session request model; server validates and computes discounted amount (no client-side math)
- Stripe webhook: when paid, mark discount code redeemed
- POC test: curl sequence to generate code → create checkout with discount → verify amount_total reflects discount via /api/payments/checkout/status/{session_id} (simulated in test) 
- User stories (POC):
  1. As a customer, I can request a discount code and get a valid code back
  2. As a payer, my checkout session total reflects my discount
  3. As the system, a redeemed code is marked used after payment
  4. As a developer, I can verify discount application via a single API flow
  5. As an admin, invalid/expired codes are rejected by the server

Phase 2: V1 App Development (MVP delivery)
- Data model: DiscountCode {id(uuid), code(str), percent_off(int), status(active|redeemed|expired|invalidated), expires_at(dt, tz=UTC), created_at, created_by(session/lead?), redeemed_at?, notes?}
- Backend routes (/api/discounts):
  - POST /generate, GET /validate/{code}, GET /list?status=active|redeemed|expired|all, PATCH /{code}/invalidate
- Payment integration:
  - Extend PaymentRequest with discount_code (optional); compute discounted amount; store code ref in payment_transactions metadata; set redeemed on webhook
- Chat UX:
  - MaryWellChat: add quick-actions row → “Get 5%”, “Get 10%”, “Get 15%” (calls /api/discounts/generate)
  - Show returned code as assistant message with Copy button; add “See Full Pricing” button (links to /tanning)
  - Add “Show Packages” chips (fetch /api/chat/packages) to make selection visual (non-blocking to checkout for this phase)
- Prompt upgrade (mary_well.py):
  - Always present 3 options; push Level 4 & Matrix more strongly; mention 5/10/15% tiers (15% for immediate prepay; 10% & 5% fallback if hesitating)
- Admin UI:
  - New tab “Discount Codes”: table with code, percent, status, expires, created_at; basic filter by status
- User stories (V1):
  1. As a visitor, I can click “See full pricing” from chat to view all options
  2. As a visitor, I can generate a 15% code instantly from chat and copy it
  3. As a hesitant buyer, I can choose a 10% or 5% code instead
  4. As a visitor, I can view package chips in chat to understand options quickly
  5. As an admin, I can view recent discount codes and their statuses

Phase 3: Testing & Fix Round
- Call testing agent (frontend+backend) to cover:
  - Discount endpoints (generate/validate/list/invalidate)
  - Checkout session with discount_code (amount math)
  - Webhook status update handling (simulated/asserted)
  - MaryWellChat quick-actions → code shown and copy works; pricing button works; packages chips render
  - Admin “Discount Codes” tab renders and lists codes
- Review /app/test_reports/iteration_*.json, fix issues, re-run until pass
- Screenshots: landing with chat open (code shown), admin tab, and any error state
- User stories (Testing):
  1. As QA, I see error toasts when API fails and recovery on retry
  2. As QA, I confirm accessibility of buttons via data-testid
  3. As QA, I see correct discounted totals returned by API
  4. As QA, I can list active and redeemed codes
  5. As QA, I can validate code expiration behavior

Phase 4: Polish & Extensions (post-MVP)
- Hold code reservation during session; release if abandoned (optional)
- Rate limiting on /api/discounts/generate; audit logging
- Admin: invalidate code, export CSV
- Chat: one-click “Checkout with selected package” (future)
- User stories (Polish):
  1. As an admin, I can invalidate abusive codes
  2. As a marketer, I can export codes for in-store redemption
  3. As a customer, I get clear errors if a code is expired/used
  4. As a customer, I can retry code generation if the first failed
  5. As a manager, I can see code usage analytics

3) Next Actions (execution order)
1. Backend: Add DiscountCode model + /api/discounts routes (generate/validate/list/invalidate)
2. Payments: Extend checkout to accept discount_code; compute server-side discounted amount; webhook marks redeemed
3. Chat frontend: Add quick-action buttons (5/10/15), display code + copy, add “See Full Pricing” and package chips
4. Mary Well prompt: update sales script for 3-tier discount + stronger Level 4/Matrix upsell
5. Admin: Add “Discount Codes” tab and list view
6. Run automated testing agent (both); collect screenshots; fix and re-run once to green

4) Success Criteria
- API: /api/discounts endpoints return expected data; invalid/expired codes properly rejected
- Payments: Checkout with discount_code returns discounted amount; webhook/ status endpoint updates reflect paid and code redeemed
- Chat: Users can create and see codes (5/10/15), copy them, and navigate to pricing; package chips render
- Admin: Codes list visible with accurate status counts and dates
- Tests: Automated report passes critical paths; screenshots captured on https://tanmarketing.preview.emergentagent.com
- No regressions: existing chat, admin metrics, and payments without codes still work

Notes
- Use UUIDs and timezone.utc everywhere; keep /api prefix; reuse Shadcn components and design tokens; add data-testid on all new interactive elements.
