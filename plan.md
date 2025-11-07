# Eastend Tanning & Laundry — Discount Codes + Bed Recommendations Plan (Updated 2025-11-07)

## Context sync
- Scope delivered: (1) Discount Codes MVP with 5%, 10%, 15% tiers, (2) Bed Recommendations upgrade in chat (budget/recommended/premium, stronger upsell to Level 4 & Matrix), pricing link and package chips.
- Preview URL for validation/screenshots: https://tanmarketing.preview.emergentagent.com
- Testing: Automated testing agent (frontend + backend) executed with screenshots; manual click-through to follow.
- Tech: FastAPI + React + MongoDB; Stripe test mode; Emergent LLM key configured.

## POC decision
- Payment flow changes (Stripe) required POC.
- Status: COMPLETED — end-to-end discount application verified; amounts reduced server-side; webhook/status path persists transactions.

## 1) Objectives
- Implement secure discount-code lifecycle with 5/10/15% tiers and expiry. (COMPLETED)
- Apply optional discount in Stripe checkout creation (server-verified). (COMPLETED)
- Update Mary Well to present 3 options and emphasize Level 4 & Matrix; include pricing link. (COMPLETED)
- Add chat quick actions (5/10/15), pricing button, package chips, and copy-to-clipboard. (COMPLETED)
- Add Admin Discount Codes tab/list. (COMPLETED)
- Deliver with automated tests and screenshots. (COMPLETED)

## 2) Implementation Steps (Phased)

### Phase 1: Core POC (Discounted Stripe Session) — Status: COMPLETED
- Created /api/discounts endpoints:
  - POST /api/discounts/generate (5/10/15, 7-day default expiry)
  - GET /api/discounts/validate/{code}
  - GET /api/discounts/list?status=active|redeemed|expired|all
  - PATCH /api/discounts/{code}/invalidate
- Extended payments endpoint to accept optional discount_code and compute discounted amount server-side.
- Webhook/status updates mark codes redeemed.

### Phase 2: V1 App Development — Status: COMPLETED
- Chat UX (MaryWellChat.jsx): quick actions (5%/10%/15%), See Pricing, Show Packages; code display + copy.
- Prompt upgrade (mary_well.py): always show 3 options; push Level 4 & Matrix; pricing link updated to preview domain.
- Admin UI (Admin.jsx): new Discounts tab and table (code, percent, status, expires, created_at).

### Phase 3: Testing & Fix Round — Status: COMPLETED
- Ran automated testing agent (frontend + backend). Core flows passed; fixed issues:
  - Backend: Leads endpoint datetime parsing (TypeError fromisoformat) — made parsing tolerant and tz-aware in /app/backend/routes.py.
  - Backend: Discount expiry comparisons — ensure timezone-aware datetimes.
  - Backend: Stripe metadata types — cast numeric metadata to strings.
  - Frontend: Admin fetchDashboardData — switched to Promise.all with single-use responses to avoid Response body reuse/clone error; Discounts table now populates.
- Visual checks and screenshots captured.

### Phase 4: Polish & Extensions (Post-MVP) — Status: In Planning (Next sprint)
- Rate limiting and audit logging on /api/discounts/generate to prevent abuse.
- Admin: add invalidate action + CSV export for codes.
- Chat: one-click "Checkout with selected package" (deep link with discount) and structured package pickers.
- Real-time dashboard updates via WebSockets (60s polling exists; upgrade to live events).
- Analytics: code usage metrics in dashboard.

## 3) Next Actions (execution order)
1. Lotion Catalog + Delivery (skeleton): catalog in DB, chat selection UI, shipping capture, create order record (manual fulfillment); track lotion commitments separately.
2. Email/SMS Sending Engine: integrate SendGrid (email) + Twilio (SMS) via integration playbooks; worker to process scheduled_marketing_actions; mark completion in DB.
3. Discount System Polish: add admin invalidate UI, CSV export, rate limits, abuse monitoring.
4. Real-time Dashboard: introduce server-sent events or WebSockets; push lead/booking/payments changes live.
5. Chat → Checkout Bridge: buttons that open checkout prefilled with package + optional discount_code.

## 4) Success Criteria
- API: /api/discounts endpoints validate, list, and reject invalid/expired codes (ACHIEVED).
- Payments: discounted amount used in Stripe session; code marked redeemed on paid (ACHIEVED).
- Chat: users can generate 5/10/15 codes, copy them, view pricing, and see package options (ACHIEVED).
- Admin: codes list visible with accurate status and dates; no Response reuse errors (ACHIEVED).
- Tests: automated report green for critical paths; screenshots stored (ACHIEVED).

## Testing Artifacts
- Report: /app/test_reports/iteration_1.json
- Backend API test script: /app/backend/backend_test.py
- Screenshots: /app/test_reports/s1_chat_discount.png, /app/test_reports/s2_admin_discounts.png

## Notes
- All identifiers use UUIDs; all datetimes are timezone-aware (UTC).
- All new UI controls include data-testid for automation.
- Next sprint will require integration playbooks and credentials for SendGrid/Twilio before coding.
