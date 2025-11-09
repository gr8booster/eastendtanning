# Eastend Tanning & Laundry — Complete System Build Plan (Updated 2025-11-08)

## Context sync
- Scope delivered: (1) Discount Codes MVP with 5%, 10%, 15% tiers, (2) Bed Recommendations upgrade in chat (budget/recommended/premium, stronger upsell to Level 4 & Matrix), (3) Lotions Catalog with admin management, (4) Voice calls (mock mode with webhook infrastructure), (5) Blog scheduler ("People of the Eastend" every 2 days), (6) Chat-first UI across all pages.
- Preview URL for validation/screenshots: https://tanning-chatbot.preview.emergentagent.com
- Testing: Automated testing agent (frontend + backend) executed with screenshots; manual click-through to follow.
- Tech: FastAPI + React + MongoDB; Stripe test mode; Emergent LLM key configured (OpenAI GPT-4o + Claude Sonnet 4).

## 1) Objectives
- ✅ Implement secure discount-code lifecycle with 5/10/15% tiers and expiry. (COMPLETED)
- ✅ Apply optional discount in Stripe checkout creation (server-verified). (COMPLETED)
- ✅ Update Mary Well to present 3 options and emphasize Level 4 & Matrix; include pricing link. (COMPLETED)
- ✅ Add chat quick actions (5/10/15), pricing button, package chips, and copy-to-clipboard. (COMPLETED)
- ✅ Add Admin Discount Codes tab/list. (COMPLETED)
- ✅ Lotions catalog with admin CRUD and public browsing. (COMPLETED)
- ✅ Voice calls infrastructure (mock mode + webhook ready). (COMPLETED)
- ✅ Blog scheduler for "People of the Eastend" posts every 2 days. (COMPLETED)
- ✅ Replace "Call Us" with "Chat with Mary" and "Talk to Mary" across UI. (COMPLETED)
- 🔄 Add Admin Voice Calls tab to view recent calls and transcripts. (IN PROGRESS - Phase 5)
- 🔄 Integrate SendGrid (email) + Twilio (SMS) for scheduled marketing actions. (IN PROGRESS - Phase 6)
- 🔄 Polish UX/UI, error handling, and performance optimizations. (IN PROGRESS - Phase 7)

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

### Phase 4: Lotions, Voice, Blog & Chat-First UI — Status: COMPLETED
**Lotions Catalog:**
- Backend: /api/lotions (POST/PATCH admin; GET public list)
- Admin: Lotions tab with create form and table
- Chat: Browse Lotions quick action; checkout by lotion_id
- Payment: Lotion purchases via Stripe (no discounts on lotions)

**Voice Calls (Mock + Infrastructure):**
- Backend: /api/voice/calls/outbound (mock mode when credentials absent; real via Vapi when configured)
- Backend: /api/voice/webhook/calls (HMAC verification; persist transcripts to leads; start marketing journey)
- Backend: GET /api/voice/calls (list recent call records)
- Frontend: MaryWellChat "Have Mary Call Me" dialog; outbound call trigger
- Note: Currently in mock mode; ready for Vapi credentials (VAPI_PRIVATE_KEY, VAPI_WEBHOOK_SECRET, VAPI_PHONE_NUMBER_ID)

**Blog Scheduler:**
- Backend: blog_scheduler.py (every-other-day posting; hourly checks; enabled by default)
- AI Engine: Short magazine-style posts (300-600 words); subtle CTA only at end
- Frontend: Blog.jsx renamed to "People of the Eastend"; normalized post rendering
- Topics: wedding, prom, vacation, birthday, Valentine's, holiday, base tan, self care, SAD, trip, summer

**Chat-First UI:**
- Replaced "Call Us" with "Chat with Mary" in Header, Home hero, Tanning, Laundry, Drinks, Nails, Locations
- Added "Talk to Mary" (voice via Web Speech API) in Header and Home hero
- BookingCTA.jsx now opens chat instead of phone dial
- MaryWellChat: global window.openMaryChat() and window.openMaryChatAndListen() functions
- Mary Well prompt: aggressive but helpful sales; lotion discovery; skin type memory; tanning reason capture

### Phase 5: Admin Voice Calls Tab — Status: IN PROGRESS
**Objective:** Add Voice Calls section to Admin dashboard to view recent calls and transcript snippets.

**Implementation:**
- Add "Voice Calls" tab to Admin.jsx (6th tab after Lotions)
- Fetch /api/voice/calls (already exists; returns list with id, direction, customer_number, customer_name, status, summary, transcript, created_at)
- Display table: Customer, Phone, Direction, Status, Summary (truncated), Date
- Optional: "View Full Transcript" dialog/modal for detailed transcript
- Add data-testid attributes for testing

**Files to modify:**
- /app/frontend/src/pages/Admin.jsx (add tab, fetch, table)

### Phase 6: SMS/Email Integration (SendGrid + Twilio) — Status: IN PROGRESS
**Objective:** Integrate SendGrid (email) and Twilio (SMS) to process scheduled_marketing_actions from marketing journey system.

**Implementation:**
1. **Integration Playbooks:**
   - Call integration_playbook_expert_v2 for SendGrid integration
   - Call integration_playbook_expert_v2 for Twilio integration
   - Obtain credentials from user (SendGrid API key, Twilio Account SID, Auth Token, Phone Number)

2. **Backend Worker:**
   - Create /app/backend/marketing_worker.py (background task or scheduled job)
   - Query scheduled_marketing_actions where status='scheduled' and scheduled_for <= now
   - For each action:
     - If type='email': use SendGrid SDK to send template email
     - If type='sms': use Twilio SDK to send template SMS
     - Mark action status='sent' with sent_at timestamp
     - Handle failures: mark status='failed' with error message
   - Run worker loop every 5-10 minutes (or use APScheduler)

3. **Email Templates:**
   - Define templates in code or database (welcome, service_details, package_recommendations, etc.)
   - Use lead data to personalize (name, service_interest, etc.)

4. **SMS Templates:**
   - Define short SMS templates (first_visit_reminder, special_offer, booking_reminder, etc.)
   - Use lead phone number from marketing_actions

5. **Environment Variables:**
   - Add SENDGRID_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to /app/backend/.env
   - Update server.py to start marketing_worker on startup (similar to blog_scheduler)

6. **Testing:**
   - Create test lead and trigger journey
   - Verify scheduled_marketing_actions are created
   - Verify worker sends email/SMS (use test mode or sandbox)
   - Verify status updates in database

**Files to create:**
- /app/backend/marketing_worker.py

**Files to modify:**
- /app/backend/server.py (start worker on startup)
- /app/backend/.env (add credentials; do NOT commit to git)
- /app/backend/requirements.txt (add sendgrid, twilio SDKs)

### Phase 7: Polish & Improvements — Status: IN PROGRESS
**Objective:** General UX/UI enhancements, error handling, performance optimizations, and bug fixes.

**Implementation:**
1. **Error Handling:**
   - Add try/catch blocks to all API calls in frontend
   - Display user-friendly error messages via Sonner toasts
   - Backend: consistent error responses (HTTPException with detail)

2. **Performance:**
   - Optimize Admin dashboard fetches (already using Promise.all)
   - Add loading skeletons for slow API calls
   - Lazy load images on Blog and Drinks pages

3. **UX Enhancements:**
   - Add loading states to all buttons (spinner + disabled during async operations)
   - Add confirmation dialogs for destructive actions (e.g., invalidate discount code)
   - Improve mobile responsiveness (test on 360px width)
   - Add empty states for all tables/lists

4. **Design Consistency:**
   - Audit all pages for design guideline compliance (colors, spacing, typography)
   - Ensure all interactive elements have data-testid attributes
   - Replace any remaining transition-all with transition-colors/transition-shadow
   - Verify gradient usage < 20% viewport

5. **Blog Content Cleanup:**
   - Audit existing blog posts for JSON text fragments
   - Regenerate or clean legacy posts
   - Optionally add Admin toggle for blog scheduler (enable/disable, set cadence)
   - Add "Post Now" button to manually trigger blog post

6. **Rate Limiting:**
   - Add basic rate limits to AI endpoints (/api/ai/*, /api/chat/message)
   - Use in-memory cache or Redis (if available)
   - Return 429 Too Many Requests when exceeded

7. **Testing:**
   - Run comprehensive testing via testing_agent_v3
   - Fix all high-priority bugs before finishing
   - Take screenshots of all major pages and flows

**Files to modify:**
- Multiple frontend components (error handling, loading states)
- Multiple backend routes (error handling, rate limiting)
- /app/backend/blog_scheduler.py (optional admin controls)
- /app/frontend/src/pages/Admin.jsx (blog controls)

## 3) Next Actions (execution order)
1. ✅ Phase 5: Admin Voice Calls Tab (simple table view)
2. ✅ Phase 6: SMS/Email Integration (SendGrid + Twilio via playbooks)
3. ✅ Phase 7: Polish & Improvements (error handling, performance, design audit, testing)
4. 🔄 Voice Go-Live: Provide Vapi credentials to enable real telephony (user action required)
5. 🔄 Phone Forwarding: Provision new AI number and forward 740-397-9632 (user action required)

## 4) Success Criteria
**Phase 1-4 (COMPLETED):**
- ✅ API: /api/discounts endpoints validate, list, and reject invalid/expired codes
- ✅ Payments: discounted amount used in Stripe session; code marked redeemed on paid
- ✅ Chat: users can generate 5/10/15 codes, copy them, view pricing, and see package options
- ✅ Admin: codes list visible with accurate status and dates; no Response reuse errors
- ✅ Lotions: admin can add/update; public can browse; chat can checkout lotions
- ✅ Voice: mock calls create leads and journey events; webhook infrastructure ready
- ✅ Blog: "People of the Eastend" posts every 2 days; normalized rendering
- ✅ UI: Chat-first across all pages; Talk to Mary (voice) in header

**Phase 5 (IN PROGRESS):**
- Admin Voice Calls tab displays recent calls with customer info, status, and summary
- Table includes data-testid attributes
- Optional: View full transcript in modal/dialog

**Phase 6 (IN PROGRESS):**
- SendGrid and Twilio integrated via playbooks
- marketing_worker.py processes scheduled_marketing_actions
- Emails and SMS sent to leads based on journey stage
- Actions marked 'sent' with timestamp; failures logged
- Worker runs on server startup (background task)

**Phase 7 (IN PROGRESS):**
- All API calls have error handling and user-friendly messages
- All buttons show loading states during async operations
- Mobile responsiveness verified (360px+)
- Design guidelines compliance verified (colors, spacing, gradients < 20%)
- All interactive elements have data-testid attributes
- Comprehensive testing completed with all high-priority bugs fixed
- Screenshots of all major pages captured

## 5) Testing Artifacts
- Report: /app/test_reports/iteration_1.json (Phase 3)
- Backend API test script: /app/backend/backend_test.py
- Screenshots: /app/test_reports/s1_chat_discount.png, /app/test_reports/s2_admin_discounts.png
- Future: /app/test_reports/iteration_2.json (Phase 7 comprehensive testing)

## 6) Technical Notes
- All identifiers use UUIDs; all datetimes are timezone-aware (UTC)
- All new UI controls include data-testid for automation
- Voice calls in mock mode until Vapi credentials provided (VAPI_PRIVATE_KEY, VAPI_WEBHOOK_SECRET, VAPI_PHONE_NUMBER_ID)
- Marketing journey configured but not sending until Phase 6 complete
- Blog scheduler enabled by default; posts every 2 days
- Emergent LLM key used for AI (OpenAI GPT-4o + Claude Sonnet 4)
- Stripe in test mode

## 7) Known Limitations & Future Work
- Voice telephony requires Vapi credentials for live calls
- Phone forwarding (740-397-9632 → AI number) requires provisioning
- SMS/Email sending requires SendGrid + Twilio credentials
- Blog scheduler has no admin UI controls (enable/disable, cadence, manual post)
- No rate limiting on AI endpoints (potential abuse)
- No real-time dashboard updates (60s polling only; WebSockets future)
- Legacy blog posts may contain JSON text fragments (cleanup needed)

## 8) Dependencies & Credentials Required
**For Voice Go-Live (user action):**
- VAPI_PRIVATE_KEY
- VAPI_WEBHOOK_SECRET
- VAPI_PHONE_NUMBER_ID

**For SMS/Email Integration (Phase 6):**
- SENDGRID_API_KEY
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

**Already Configured:**
- MONGO_URL
- STRIPE_SECRET_KEY (test mode)
- STRIPE_WEBHOOK_SECRET
- EMERGENT_LLM_KEY (via environment)
