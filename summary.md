<analysis>
Implemented discount codes, upgraded Mary Well’s sales and memory flow, added a staff-managed lotions catalog, extended payments, introduced chat-first and voice options, normalized and fixed the blog, and set up an every-other-day blog scheduler. Key code changes:
- Backend: Created discount_routes.py (generate/validate/list/invalidate 5/10/15%), created lotion_routes.py (JWT-protected CRUD, public list), created voice_routes.py (outbound calls + webhook + mock mode), created blog_scheduler.py (every-other-day posts, enabled on startup), updated payment_routes.py (discount_code support; lotion checkout by lotion_id), updated server.py (include new routers; start blog scheduler), updated chat_routes.py (auto-capture lead_id, tanning_reason detection), updated skin_type_routes.py (persist skin_type to leads), updated routes.py (robust datetime parsing for leads/campaigns/bookings), updated ai_routes.py (normalize blog list/single responses; publish), updated ai_engine.py (blog prompt to “magazine” style, subtle CTA; general LLM usage).
- Frontend: Enhanced MaryWellChat.jsx (discount quick actions; packages; checkout flows; Browse Lotions; “Talk to Mary” voice via Web Speech; “Have Mary Call Me” outbound call; global window.openMaryChat/openMaryChatAndListen), updated Header.jsx (Chat with Mary + Talk to Mary), BookingCTA.jsx (Chat with Mary), Home.jsx (hero text to “Bubble Tea”; hero CTAs to chat/talk), Tanning.jsx/Laundry.jsx/Drinks.jsx/Nails.jsx/Locations.jsx (replace Call with Chat/Talk; media updates; bubble tea + pretzel/nachos menu), Admin.jsx (Discount Codes tab; Lotions tab with create form/list), LeadCapturePopup.jsx and BookingForm.jsx copy tweaked, Blog.jsx (rename to People of the Eastend), BlogPost.jsx (back label + rendering).
- Blog errors fixed by normalizing backend blog payloads (strip code fences; ensure title/meta/content/keywords/cta/created_at). Verified with screenshots (listing and post load).
- Voice calls run in mock mode until Vapi credentials are provided; outbound calls create leads and journey events; transcripts persisted when webhooks are live.
</analysis>

<product_requirements>
- Primary problem: Build an autonomous AI marketing + analytics system for Eastend Tanning & Laundry that acquires leads, books, processes payments, runs chat, and provides live KPIs.
- Specific features requested:
  - Fix dashboard zeros (done earlier in project).
  - AI chat (Mary Well) with aggressive but helpful sales flow; now updated to ask about lotion usage, skin type, and remember tanning reasons.
  - Discount codes (5%, 10%, 15%) generated in chat and tracked server-side.
  - Admin authentication and dashboard tabs (existing); add Discount Codes & Lotions management.
  - Blog (“People of the Eastend”): fix errors; write short, magazine-style posts; every-other-day cadence; subtle CTA only at end; cover real reasons for tanning (wedding, vacation, birthday, prom/homecoming, Valentine’s, holiday, base tan, self care, SAD, trip, summer).
  - Replace “Call Us” with “Chat with Mary” and add “Talk to Mary” (voice).
  - Voice calls: inbound+outbound via AI; friendly female voice; do not record; save transcripts and enroll lead in marketing journey; forward existing number later.
  - Tanning/lotion flows: capture and persist skin type; recommend lotions from staff-managed catalog (no arbitrary prices).
  - Drinks (Fizze) page reflects Bubble Tea, warm soft Amish pretzels, and nachos.
- Acceptance criteria:
  - Features accessible from UI; mobile friendly.
  - Discount codes apply to checkout; redemption tracked.
  - Blog articles render correctly; subtle CTA; scheduled cadence.
  - Mary Well remembers skin type and reasons; buttons to chat/talk present globally.
  - Voice flow: supported (mock until keys); transcripts/logging ready.
- Constraints and preferences:
  - Tech stack: FastAPI + React + MongoDB.
  - Use Emergent LLM key for AI (GPT-4o + Claude).
  - Stripe test mode.
  - Do not hardcode prices; lotions managed by staff via admin.
  - Chat-first; de-emphasize direct calling.
- Technical requirements:
  - API-first; FastAPI on 0.0.0.0:8001; Mongo via env.
  - JWT admin routes.
  - Webhooks for payments and voice.
  - Scheduled blog posting.
</product_requirements>

<key_technical_concepts>
- Languages/runtimes: Python 3.11 (backend), JavaScript/JSX (React 18 frontend).
- Frameworks/libs: FastAPI, Motor (MongoDB), Pydantic, PyJWT, emergentintegrations LlmChat (OpenAI/Anthropic), Stripe Checkout, React Router, Shadcn UI, Tailwind utilities, Lucide icons, Sonner toasts, Web Speech API (voice in browser).
- Design patterns: RESTful services, event/webhook-driven updates, background scheduler loop, repository-like Mongo collections, AI prompt engineering for content, server-side price enforcement, JWT-protected admin actions.
- Architecture: SPA frontend → REST API → MongoDB; background scheduler for blog; chat -> AI; payment → Stripe; voice calls → provider webhooks (mock/live).
- External services/APIs: Stripe (test), Emergent LLM (OpenAI GPT-4o / Claude Sonnet 4), Vapi (planned/live via credentials), Google Maps links.
</key_technical_concepts>

<code_architecture>
Architecture overview:
- Frontend uses React SPA with routing; MaryWellChat is globally accessible with a floating button and exposes window.openMaryChat/openMaryChatAndListen. Admin dashboard contains tabs including Discounts and Lotions.
- Backend exposes REST endpoints under /api; includes analytics/leads/bookings/campaigns, AI content routes, auth, chat, payments, skin type eval, journey, discounts, lotions, voice, and blog scheduler startup.
- Data flow: user interacts via chat → backend chat_routes auto-captures leads + reasons; skin type form persists skin_type to lead; checkout session created via payment_routes (optional discount code, or lotion purchase by lotion_id); Stripe webhook/status store payments and redeem codes; blog content stored in blog_posts; scheduler creates posts every other day.

Directory additions:
- /app/backend/blog_scheduler.py (new)
- /app/backend/discount_routes.py (new)
- /app/backend/lotion_routes.py (new)
- /app/backend/voice_routes.py (new)

Files created/modified:
- /app/backend/discount_routes.py (created)
  - Adds POST /api/discounts/generate, GET /validate/{code}, GET /list, PATCH /{code}/invalidate; enforces 5/10/15%; UUID ids; tz-aware datetimes.
- /app/backend/payment_routes.py (modified)
  - Accepts discount_code for tanning; computes final_amount; marks discounts redeemed on paid; supports lotion purchases via lotion_id (no discounts), metadata stored.
- /app/backend/mary_well.py (modified)
  - System prompt expanded for lotion discovery, bed recommendations (budget/recommended/premium), Ohio skin form link, persistent memory guidance, subtle sales. get_tanning_packages unchanged pricing.
- /app/backend/chat_routes.py (modified)
  - Auto-capture lead from messages; link lead_id to chat_sessions; extract tanning_reason keywords (wedding, vacation, etc.) and save to lead; endpoints: /start, /message, /history, /packages, /end.
- /app/backend/lotion_routes.py (created)
  - JWT-protected POST/PATCH/GET admin endpoints; public GET list of active lotions; fields: id, name, brand, price, features, tattoo_guard, image_url, active, timestamps.
- /app/backend/skin_type_routes.py (modified)
  - On submit, store evaluation and update or create lead with skin_type, skin_type_evaluation_id; timestamps.
- /app/backend/routes.py (modified)
  - Hardened datetime parsing/serialization for leads/bookings/campaigns to prevent 500s due to naïve datetimes.
- /app/backend/ai_routes.py (modified)
  - Normalized blog create/list/get: strip fenced code blocks, flatten fields (title, meta_description, content, keywords, cta, created_at), mark status=published; now returns consistent shapes; keeps other AI endpoints.
- /app/backend/ai_engine.py (modified)
  - generate_blog_post now produces short, magazine-style 300–600 word pieces with one subtle closing line; no code fences; other methods unchanged (GPT-4o/Claude through emergent LLM).
- /app/backend/voice_routes.py (created)
  - POST /api/voice/calls/outbound: real via Vapi when configured; otherwise mock mode (creates call record, lead, starts journey).
  - POST /api/voice/webhook/calls: verifies HMAC (when secret present), saves transcripts/summaries to lead and voice_calls; supports transcript-update and end-of-call-report.
  - GET /api/voice/calls: list recent voice call records.
- /app/backend/blog_scheduler.py (created)
  - Scheduler loop (enabled by default) that posts every other day, cycling through user-specified reasons; uses ai_engine.generate_blog_post and stores normalized posts; runs hourly checks.
- /app/backend/server.py (modified)
  - Includes discount_router, lotion_router, voice_router; starts blog scheduler on startup; CORS unchanged.
- /app/frontend/src/components/MaryWellChat.jsx (modified)
  - Adds quick actions for 15/10/5 discounts; Show Packages; Browse Lotions; Checkout Tanning/Lotion; Copy Code; “Talk to Mary” (browser voice using Web Speech); “Have Mary Call Me” dialog calling /api/voice/calls/outbound; exposes window.openMaryChat/openMaryChatAndListen.
- /app/frontend/src/components/Header.jsx (modified)
  - Replaces Call with “Chat with Mary” and adds “Talk to Mary” (desktop + mobile).
- /app/frontend/src/components/BookingCTA.jsx (modified)
  - Button opens chat; directions retained.
- /app/frontend/src/pages/Admin.jsx (modified)
  - Adds Discounts tab (table) and Lotions tab (create form + table); concurrent fetch optimizations.
- /app/frontend/src/pages/Home.jsx (modified)
  - Hero line changed to “Tanning Studio. Laundromat. Bubble Tea. Nails.”; primary CTA “Talk to Mary”; location cards include Talk to Mary.
- /app/frontend/src/pages/Tanning.jsx (modified)
  - Hero Talk to Mary; CTA uses BookingCTA to chat; media poster placeholder; copy consistent.
- /app/frontend/src/pages/Laundry.jsx (modified)
  - Eastend photo hero; CTA updated to remove Call; BookingCTA configured.
- /app/frontend/src/pages/Drinks.jsx (modified)
  - Menu reordered to highlight Bubble Tea; adds Snacks (Warm Soft Amish Pretzels, Nachos); hero badge/title/description updated.
- /app/frontend/src/pages/Nails.jsx (modified)
  - CTA updated to Chat with Mary.
- /app/frontend/src/pages/Locations.jsx (modified)
  - Chat buttons for Eastend/Westend, remove Call.
- /app/frontend/src/components/LeadCapturePopup.jsx (modified)
  - Copy: reference chat instead of calling.
- /app/frontend/src/components/BookingForm.jsx (modified)
  - Copy: follow up via SMS/chat instead of call.
- /app/frontend/src/pages/Blog.jsx (modified)
  - Title renamed “People of the Eastend”; listing renders normalized posts.
- /app/frontend/src/pages/BlogPost.jsx (modified)
  - Back button text; renders post.content as HTML (newline → <br/>).
</code_architecture>

<pending_tasks>
- Voice calls (live): Need Vapi credentials (private key, webhook secret, phone number id) to enable real telephony; currently in mock mode only.
- Phone number: Provision new AI number and forward 740-397-9632 to it; or port later.
- Admin “Voice Calls” UI: Optional table not added; backend list endpoint exists.
- Blog content tone/audit: While prompts and normalizer are updated, existing older posts in DB may contain JSON text fragments; over time scheduler will publish new short “magazine” posts; consider cleaning legacy posts or regenerating.
- Scheduler oversight: Add admin toggle for blog cadence/reasons and a manual “Post now” button (not implemented).
- AI rate limiting and abuse protection on AI routes (not implemented).
- SMS/Email sending of scheduled journeys (SendGrid/Twilio integration still pending).
- Real-time dashboard via websockets (nice-to-have).
- Payment success UX: optional direct redirect to Stripe URL when session returns without .url (handled but could be refined).
</pending_tasks>

<current_work>
- Features working:
  - Discount codes: generation (5/10/15), validation, listing, invalidation; applied to tanning checkout; redeemed on payment completion.
  - Payments: Tanning (server-priced + optional discount), Lotion (via lotion_id, no discount); transactions stored; webhook/status synced.
  - Lotions: Admin can add/update; public can browse; chat can browse and buy.
  - Chat: Mary Well with enhanced sales + lotion discovery; quick actions; packages; checkout; remembers skin type (linked from form) and tanning reason; global “Chat with Mary” and “Talk to Mary” buttons.
  - Voice (mock): “Have Mary Call Me” available; creates lead and journey; endpoints ready for live Vapi.
  - Blog: “People of the Eastend” loads; individual posts render; backend normalizes posts; scheduler runs hourly to publish every 2 days (enabled).
  - UI: Replaced Call with Chat/Talk across header, hero CTAs, CTAs, and location cards; Home hero line updated; Drinks menu updated (Bubble Tea + Pretzels + Nachos).
- Configuration:
  - Server includes new routers; background scheduler started on startup.
  - Stripe remains in test mode.
- Testing:
  - Verified blog list/post pages with screenshots; chat features tested; admin tabs for Discounts/Lotions load; fixed earlier leads datetime 500 by hardening serialization.
- Known limitations:
  - Voice telephony is mock until credentials; no recordings per preference; transcripts saved only when live webhooks are enabled.
  - Existing legacy blog posts may still display JSON-like text if created before normalization; new posts are normalized and short-form.
  - No automated test suite beyond ad-hoc validation; no CI/CD pipeline changes.
</current_work>

<optional_next_step>
- Voice go-live: Provide Vapi credentials (private key, webhook secret, phone number id), I’ll switch to live calling, set webhook URL, and test inbound/outbound; share number for forwarding from 740-397-9632.
- Blog editorial calibration: Purge or regenerate legacy posts; seed 6–10 new short magazine-style posts aligned to events (wedding, prom, vacation, etc.); add Admin toggle for scheduler and a “Post now” action.
- Admin voice log: Add Voice Calls tab to view recent calls and transcript snippets.
- SMS/Email sending: Integrate Twilio/SendGrid to process scheduled_marketing_actions.
- Rate limiting: Add basic rate limits to AI endpoints.
</optional_next_step>