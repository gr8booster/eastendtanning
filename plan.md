# Eastend Tanning & Laundry — Go-Live Preparation Plan (Phase 9-10)

## Context Sync
- **Current Status**: All Phase 1-8 features completed and tested (92.6% success rate)
- **Preview URL**: https://tan-laundry.preview.emergentagent.com
- **Tech Stack**: FastAPI + React + MongoDB; Stripe test mode; Emergent LLM (GPT-4o + Claude); SendGrid + Twilio ready
- **New Objective**: Prepare for production go-live with streamlined tanning funnel, Fizze menu management, enhanced lotions catalog, and social media integrations

## Phase 9: Go-Live Preparation (CURRENT) 🚀

### Objectives
1. **Simplified Tanning Funnel**: Focus on Monthly Unlimited & VIP packages only; hide single/5-session options
2. **First-Time Discount Popup**: Auto-display tanning discount popup for new visitors (gift card style with expiration)
3. **Enhanced Lotions Catalog**: Digital display with online payment + in-store pickup at Eastend
4. **Purchase Activation Flow**: Show purchase receipt with "Bring to Eastend for activation" message
5. **Fizze Admin Menu System**: Full CRUD for drinks menu with availability toggle and "Coming Soon" voting
6. **UI Streamlining**: Tanning page as marketing funnel; update all imagery and copy for conversion

### Implementation Plan

#### Part A: Tanning Funnel Simplification
**Backend Changes:**
- Update `mary_well.py` prompt: Only offer Monthly Unlimited ($59-89) and VIP/Premium Unlimited ($99)
- Keep single session pricing visible for reference but not purchasable online
- Update `/api/chat/packages` to return only monthly/VIP options

**Frontend Changes:**
- `Tanning.jsx`: Restructure as marketing funnel (Problem → Solution → Packages → Social Proof → CTA)
- `MaryWellChat.jsx`: Update quick actions to show only Monthly/VIP packages
- Hide single/5-session purchase buttons; show pricing table for reference only

#### Part B: First-Time Discount Popup
**Backend:**
- Create `/api/discounts/first-time` endpoint: generates 15% tanning discount with 7-day expiry
- Track visitor via localStorage + lead_id to show popup once

**Frontend:**
- Create `FirstTimeDiscountPopup.jsx`: Modal with gift card design showing code, expiration, and "Copy Code" button
- Trigger on homepage after 5 seconds for new visitors
- Store dismissal in localStorage

#### Part C: Enhanced Lotions Catalog
**Backend:**
- Add `featured` and `display_order` fields to lotions model
- Create `/api/lotions/catalog` endpoint: returns active lotions with images, prices, features
- Update payment flow: lotion purchases show "Pickup at Eastend" in receipt

**Frontend:**
- Create `LotionsCatalog.jsx`: Grid display with images, prices, features, "Add to Cart" button
- Add to Tanning page as section: "Enhance Your Results with Premium Lotions"
- Checkout flow: "Your lotion will be ready for pickup at Eastend location"

#### Part D: Purchase Activation Receipts
**Backend:**
- Update Stripe success webhook: create `purchase_receipt` record with activation instructions
- Add `/api/receipts/{session_id}` endpoint

**Frontend:**
- Create `PurchaseReceipt.jsx`: Display purchase details + "Bring this to Eastend for activation" message
- Show QR code or receipt ID for staff verification
- Redirect after Stripe checkout to `/receipt/{session_id}`

#### Part E: Fizze Drinks Admin Menu
**Backend:**
- Create `fizze_drinks` collection schema:
  ```python
  {
    id: UUID,
    name: str,
    category: str (Milk Teas, Fruit Teas, Blended Ice, Hot Boba, House Specials),
    flavor_profile: str,
    recipe: str,
    price: float,
    image_url: str (optional),
    available: bool,
    coming_soon: bool,
    votes: int,
    created_at: datetime,
    updated_at: datetime
  }
  ```
- Create `/api/fizze/admin/*` routes: CRUD operations (JWT protected)
- Create `/api/fizze/menu` public endpoint: returns available drinks grouped by category
- Create `/api/fizze/coming-soon` endpoint: returns items with coming_soon=true
- Create `/api/fizze/vote/{drink_id}` endpoint: increment vote count

**Frontend:**
- Add "Fizze Menu" tab to `Admin.jsx`: Table with name, category, price, available toggle, coming_soon toggle, votes, actions (edit/delete)
- Add create/edit form: All fields + image upload
- Update `Drinks.jsx`: Fetch from `/api/fizze/menu` and display by category
- Add "Coming Soon" section with vote buttons
- Use Fizze logo image: https://customer-assets.emergentagent.com/job_tanning-chatbot/artifacts/femzg13i_Screenshot_20251108_055345_Maps.jpg

#### Part F: UI/UX Streamlining
**Tanning Page Funnel Structure:**
1. Hero: Problem statement ("Want a perfect tan for [event]?")
2. Solution: 5 tanning levels + professional guidance
3. Video: Tanning bed showcase
4. Packages: Monthly Unlimited & VIP (focus)
5. Lotions: Digital catalog section
6. Social Proof: Testimonials/results
7. FAQ: Common questions
8. CTA: "Start Your Tanning Journey" → Chat with Mary

**Global Updates:**
- Replace remaining stock images with customer photos
- Ensure all CTAs lead to Monthly/VIP packages or Mary chat
- Mobile optimization: Test all new components at 360px width

### Files to Create
- `/app/backend/fizze_routes.py` (Fizze drinks CRUD + voting)
- `/app/backend/models/fizze_drink.py` (Pydantic model)
- `/app/backend/receipt_routes.py` (Purchase receipt generation)
- `/app/frontend/src/components/FirstTimeDiscountPopup.jsx`
- `/app/frontend/src/components/LotionsCatalog.jsx`
- `/app/frontend/src/components/PurchaseReceipt.jsx`
- `/app/frontend/src/pages/Receipt.jsx`

### Files to Modify
- `/app/backend/server.py` (add fizze_router, receipt_router)
- `/app/backend/mary_well.py` (update prompt for Monthly/VIP only)
- `/app/backend/payment_routes.py` (add activation instructions to receipts)
- `/app/backend/lotion_routes.py` (add featured, display_order fields)
- `/app/frontend/src/pages/Home.jsx` (add FirstTimeDiscountPopup)
- `/app/frontend/src/pages/Tanning.jsx` (restructure as funnel + lotions section)
- `/app/frontend/src/pages/Drinks.jsx` (fetch from Fizze API + voting)
- `/app/frontend/src/pages/Admin.jsx` (add Fizze Menu tab)
- `/app/frontend/src/components/MaryWellChat.jsx` (update package quick actions)

## Phase 10: Social Media Integrations (NEXT) 📱

### Objectives
1. **Facebook Integration**: Pages API, Lead Ads, Pixel tracking, Messenger bot
2. **Instagram Integration**: Business API, Stories, DM automation, Shopping tags
3. **TikTok Integration**: Business Center, Ads API, Analytics, Lead Gen forms

### Implementation Approach
- Call `integration_playbook_expert_v2` for each platform
- Create unified `/api/social/*` endpoints for lead capture, analytics, post scheduling
- Admin dashboard: Social Media tab with analytics, post composer, lead management
- Webhook handlers for incoming messages (route to Mary Well chat system)

### Success Criteria (Phase 10)
- ✅ Facebook Pixel installed; conversion tracking active
- ✅ Instagram DMs route to Mary Well for automated responses
- ✅ TikTok lead forms create leads in MongoDB
- ✅ Admin can schedule posts to all 3 platforms from dashboard
- ✅ Unified analytics view: impressions, clicks, conversions by platform

## Timeline & Priorities

### Immediate (Phase 9 - Current Session)
1. Fizze drinks admin menu + voting system
2. Simplified tanning funnel (Monthly/VIP focus)
3. First-time discount popup
4. Enhanced lotions catalog with pickup flow
5. Purchase activation receipts
6. Tanning page funnel restructure

### Next Session (Phase 10)
1. Facebook integration (lead ads + pixel)
2. Instagram integration (DMs + stories)
3. TikTok integration (ads + analytics)
4. Social media admin dashboard
5. Unified analytics and reporting

## Testing Strategy

### Phase 9 Testing
- **Unit Tests**: Fizze CRUD operations, discount popup logic, receipt generation
- **Integration Tests**: End-to-end tanning purchase → receipt → activation flow
- **UI Tests**: Mobile responsiveness (360px), popup behavior, funnel conversion tracking
- **User Acceptance**: Test with sample customers; gather feedback on simplified flow

### Phase 10 Testing
- **API Tests**: Social media webhook handling, post scheduling, analytics fetching
- **Integration Tests**: Lead capture from Facebook → MongoDB → Mary Well chat
- **Security Tests**: OAuth flows, token refresh, webhook signature verification

## Deployment Checklist

### Pre-Launch (Phase 9)
- [ ] All Fizze drinks seeded in database with recipes
- [ ] First-time discount popup tested across browsers
- [ ] Tanning funnel conversion tracking configured
- [ ] Lotions catalog images uploaded and optimized
- [ ] Purchase receipt QR codes tested with staff
- [ ] Mary Well updated to offer only Monthly/VIP packages
- [ ] Mobile UX verified on real devices (iOS + Android)
- [ ] Stripe test mode → production mode switch plan documented

### Post-Launch (Phase 10)
- [ ] Facebook Business Manager configured
- [ ] Instagram Business Account connected
- [ ] TikTok Business Center API access approved
- [ ] Social media posting schedule created
- [ ] Analytics dashboard reviewed by marketing team
- [ ] Lead response time SLA defined (<5 min via Mary Well)

## Technical Notes

### Database Collections (New)
- `fizze_drinks`: Drinks menu with availability and voting
- `purchase_receipts`: Activation receipts for tanning/lotion purchases
- `discount_popups`: Track popup displays and conversions
- `social_media_posts`: Scheduled posts across platforms (Phase 10)
- `social_media_leads`: Leads captured from Facebook/Instagram/TikTok (Phase 10)

### Environment Variables (New)
**Phase 9**: None required (uses existing Stripe, MongoDB)

**Phase 10**:
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `INSTAGRAM_ACCESS_TOKEN`
- `TIKTOK_APP_ID`, `TIKTOK_APP_SECRET`, `TIKTOK_ACCESS_TOKEN`

### API Rate Limits
- Fizze voting: 10 votes per IP per hour
- Social media post scheduling: 50 posts per day per platform (Phase 10)
- Analytics fetching: 100 requests per hour (Phase 10)

## Success Metrics

### Phase 9 KPIs
- **Conversion Rate**: Tanning page → Monthly/VIP purchase (target: 5%)
- **Popup Effectiveness**: First-time discount redemption rate (target: 20%)
- **Lotions Upsell**: Lotion purchases per tanning package (target: 30%)
- **Fizze Engagement**: Votes per coming-soon item (target: 50/week)
- **Activation Rate**: Receipts activated at Eastend (target: 95%)

### Phase 10 KPIs (Future)
- **Lead Volume**: Social media leads per week (target: 100)
- **Response Time**: Mary Well response to social leads (target: <5 min)
- **Engagement Rate**: Social post engagement (target: 5%)
- **Conversion**: Social leads → paying customers (target: 15%)

## Risk Mitigation

### Phase 9 Risks
1. **Risk**: Simplified funnel reduces conversion due to fewer options
   - **Mitigation**: A/B test with 50% traffic; monitor conversion rates
2. **Risk**: Popup annoys users; high bounce rate
   - **Mitigation**: Show once per visitor; easy dismiss; 5-second delay
3. **Risk**: Activation flow confuses customers
   - **Mitigation**: Clear instructions; staff training; QR code verification

### Phase 10 Risks
1. **Risk**: Social media API changes break integrations
   - **Mitigation**: Webhook retry logic; error monitoring; graceful degradation
2. **Risk**: High lead volume overwhelms Mary Well
   - **Mitigation**: Queue system; priority routing; human escalation for complex queries
3. **Risk**: Platform policy violations (TikTok/Facebook)
   - **Mitigation**: Legal review of ad copy; compliance monitoring; appeal process

## Next Steps

1. **Implement Phase 9** (current session):
   - Bulk file write for all backend routes (Fizze, receipts, discount popup)
   - Bulk file write for all frontend components (popup, catalog, receipt, funnel)
   - Update existing files (Mary Well, Tanning page, Admin dashboard)
   - Test end-to-end flows
   - Deploy to preview environment

2. **Prepare for Phase 10** (next session):
   - Obtain social media API credentials from user
   - Call integration playbook expert for each platform
   - Design unified social media dashboard mockup
   - Document webhook URLs for platform configuration

## Rollback Plan

If Phase 9 causes issues:
1. Revert `mary_well.py` to show all package options
2. Disable first-time discount popup via feature flag
3. Hide lotions catalog section on Tanning page
4. Keep existing simple purchase flow without activation receipts
5. Rollback Fizze menu to static content on Drinks page

All changes will be tracked via git commits for easy rollback.
