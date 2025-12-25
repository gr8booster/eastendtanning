# 818 EATS – Weekly Batch Voting System (Blueprint)

## Objectives
- Deliver a working weekly batch ordering/voting flow (single-item, $25), with prepayment via PayPal
- Aggregate orders by ISO week (YYYY-WXX), visualize progress to target (40)
- Provide customer tip input, fixed delivery fee ($5.99), order confirmation page
- Add Waakye (4th dish) and improved dish images
- Add admin tools to monitor batches, vote summary, and fulfillment readiness

## POC Requirement (Core-first)
- POC required: Validate PayPal create/capture flow against backend endpoints before full UI build
- Scope: Minimal endpoints to create a PayPal order for a known amount and capture it; verify status transitions and data persistence

## Phase 0: Payment POC (Isolation) — Status: Not Started
Implementation Steps
1) Backend: Add minimal EATS-specific PayPal endpoints
   - POST /api/eats/paypal/create-order (input: order_id), amount sourced server-side from eats_orders
   - POST /api/eats/paypal/capture-order/{paypal_order_id} (body: order_id)
2) Validate env vars are loaded; use existing paypal_routes.py pattern and credentials
3) cURL tests: create → capture (simulate approval by direct capture) and assert
   - Order document updated: paid=true, status=paid, paypal_txn fields
4) Fix until stable (errors, auth, network); log errors and ensure idempotency on capture
5) Document the working POC results in test report

User Stories
- As an engineer, I can create a PayPal order for an existing EATS order
- As an engineer, I can capture that PayPal order and mark the EATS order paid
- As an engineer, I can see precise totals derived from server-side order data
- As an engineer, I can rerun capture safely without double-charging
- As an engineer, I can read logs to diagnose failures quickly

## Phase 1: Frontend Rebuild (CRITICAL) — Status: Not Started
Implementation Steps
1) Replace cart model with card-based single selection in EatsOrdering.jsx
   - 4 cards (radio-like), click-to-select; CTA: “Vote & Prepay $25”
2) Batch status banner with progress bar
   - GET /api/eats/orders/current-batch → show X/40 and leading dish from vote_summary
3) Checkout modal (single item): customer_name, phone, email, required customer_address, quantity (default 1), tip input (preset chips + custom), notes
4) Submit order → POST /api/eats/orders with {customer_*, customer_address, menu_item_id, quantity, tip, notes}
5) On success, render PayPal Buttons (in modal) that call /api/eats/paypal/create-order using returned order.id; on approval, call capture endpoint and show success
6) Create order confirmation page /eats/order/:orderId (summary, status, batch info, totals)
7) Update UI copy: “Delivery this week once we reach 40 orders”

User Stories
- As a customer, I can select exactly one dish via a clear card selection
- As a customer, I can see batch progress toward the 40-order goal
- As a customer, I can add a tip during checkout
- As a customer, I can prepay securely via PayPal from the checkout modal
- As a customer, I receive an order confirmation page with my details

## Phase 2: Payment & Backend (EATS-specific) — Status: Not Started
Implementation Steps
1) Implement EATS PayPal endpoints (server-side amount of order.total)
   - Link PayPal order to EATS order.id; store paypal_order_id, capture_id, payer_email
2) On capture success → update eats_orders: {paid: true, status: 'paid', paid_at}
3) Fix status enum mismatch in eats_routes update endpoint
   - Valid statuses: pending_payment, paid, preparing, ready_for_pickup, out_for_delivery, delivered, cancelled
4) Harden POST /api/eats/orders: sanitize inputs, compute totals server-side, preserve batch fields
5) Add GET /api/eats/orders/:id (already exists) → ensure response contains payment fields
6) Emails (optional later): confirmation after payment (defer if time-constrained)

User Stories
- As a customer, my payment updates the order to paid instantly
- As a system, I always compute totals and amounts server-side
- As a system, I prevent paying twice for the same order
- As an admin, I can view PayPal transaction details on the order
- As a customer, I can revisit my order page to see up-to-date status

## Phase 3: Admin Dashboard — Status: Not Started
Implementation Steps
1) Add “818 EATS Batches” tab in Admin.jsx
2) Current week panel (GET /api/eats/orders/current-batch)
   - Progress bar, X/40, percentage, vote_summary (leaderboard)
3) Batch detail panel
   - Input batch_id, fetch GET /api/eats/orders/batch/{batch_id}; show orders table, per-item counts
4) Orders panel
   - GET /api/eats/orders list; status update actions via PUT /api/eats/orders/{order_id}/status
5) Visual indicator when target_reached (>= 40) → “Ready for vendor fulfillment”

User Stories
- As an admin, I can see the current week’s progress at a glance
- As an admin, I can view vote counts by dish for any batch
- As an admin, I can list all orders and update their statuses
- As an admin, I can identify when a batch is ready for vendor fulfillment
- As an admin, I can export or copy batch order details for vendors

## Phase 4: Menu Updates — Status: Not Started
Implementation Steps
1) Ensure initialize_menu adds 4 dishes (Ghana Jollof Rice, Egusi Stew, Suya & Fried Plantains, Waakye), all priced at $25 (enforced in response)
2) Use vision agent to finalize appetizing images
   - Egusi: green leafy soup; Jollof: avoid large peppers; Suya & Plantains; Waakye: rice and beans
3) Confirm GET /api/eats/menu returns 4 items with updated images and descriptions
4) Frontend: show 4 cards with images and prep times
5) Re-validate selection/checkout flow with updated menu

User Stories
- As a customer, I can see four authentic African dishes
- As a customer, I can trust the pricing and images to reflect the dishes accurately
- As a customer, I can select Waakye as my weekly vote
- As an admin, I can manage menu availability and images
- As a customer, I see consistent $25 pricing across dishes

## Cross-Cutting: Design & Quality
- UI: Follow design_guidelines.md tokens (primary sun-yellow, secondary teal), shadcn/ui only, lucide-react icons; light/dark ready
- Accessibility: labels, focus-visible, AA contrast; data-testid on every interactive element
- Performance: skeleton loaders for fetches >300ms; explicit states (loading/empty/error)

## Next Actions (Execution Order)
1) Phase 0 POC: Implement EATS PayPal create/capture endpoints; run cURL tests; fix until stable
2) Phase 1: Rebuild EatsOrdering.jsx (selection UI, banner, checkout modal, tip), integrate POC endpoints
3) Create order confirmation page and route
4) Phase 2: Status enums fix + robust backend updates, ensure totals/payment fields on order
5) Phase 3: Admin tab for EATS batches, batch detail + orders panels
6) Phase 4: Add Waakye + finalize images via vision agent
7) Call testing_agent after Phase 1 and Phase 3 for end-to-end coverage; address all findings

## Success Criteria
- Frontend: Single-item selection with visible batch progress; checkout with tip and PayPal works end-to-end
- Backend: Orders grouped by ISO week; accurate totals; payment capture sets paid=true and status=paid
- Admin: Batches tab shows current progress, vote summary, and batch detail; orders updatable
- Menu: 4 dishes displayed with improved images; all at $25; Waakye present
- Acceptance: Weekly batch system operational; prepayment enforced; 40-order threshold tracked; delivery messaging clear
