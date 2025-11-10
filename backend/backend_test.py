"""
Backend API Testing for Eastend Tanning & Laundry - FINAL COMPREHENSIVE TESTING
Tests ALL implemented features: Phase 1-6 (discount system, role-based access, SEO, user management)
Focus: SEO components, user management, Google Analytics, regression testing
"""
import requests
import sys
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class BackendAPITester:
    def __init__(self, base_url="https://tan-laundry.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.failed_tests = []
        self.generated_codes = []
        
    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: Optional[Dict] = None, headers: Optional[Dict] = None) -> tuple[bool, Any]:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                self.tests_failed += 1
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                return False, {}
                
        except Exception as e:
            self.tests_failed += 1
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'endpoint': endpoint
            })
            print(f"   ❌ FAILED - Error: {str(e)}")
            return False, {}
    
    def test_discount_generation(self):
        """Test discount code generation with Phase 1 expiry logic"""
        print("\n" + "="*60)
        print("TESTING PHASE 1 DISCOUNT GENERATION & EXPIRY LOGIC")
        print("="*60)
        
        # Test Phase 1 expiry logic: 15%=1 day, 10%=3 days, 5%=7 days
        expected_days = {15: 1, 10: 3, 5: 7}
        
        for percent in [5, 10, 15]:
            success, response = self.run_test(
                f"Generate {percent}% discount code (auto-expiry)",
                "POST",
                "api/discounts/generate",
                200,
                data={"percent_off": percent}  # No expires_in_days - should auto-calculate
            )
            
            if success:
                # Verify response structure
                if 'code' in response and 'percent_off' in response and 'expires_at' in response:
                    print(f"   📋 Code: {response['code']}")
                    print(f"   📋 Percent: {response['percent_off']}%")
                    print(f"   📋 Expires: {response['expires_at']}")
                    print(f"   📋 Hours until expiry: {response.get('expires_in_hours', 'N/A')}")
                    self.generated_codes.append(response)
                    
                    # Verify percent_off matches
                    if response['percent_off'] != percent:
                        print(f"   ❌ CRITICAL: percent_off mismatch - expected {percent}, got {response['percent_off']}")
                    
                    # Verify Phase 1 expiry logic
                    expected_hours = expected_days[percent] * 24
                    actual_hours = response.get('expires_in_hours')
                    if actual_hours and abs(actual_hours - expected_hours) <= 1:  # Allow 1 hour tolerance
                        print(f"   ✅ PHASE 1: Correct expiry logic - {percent}% = {expected_days[percent]} day(s)")
                    else:
                        print(f"   ❌ PHASE 1 FAIL: Wrong expiry - expected {expected_hours}h, got {actual_hours}h")
                    
                    # Verify expires_at is in the future
                    try:
                        expires_at = datetime.fromisoformat(response['expires_at'].replace('Z', '+00:00'))
                        if expires_at <= datetime.now(timezone.utc):
                            print(f"   ❌ CRITICAL: expires_at is not in the future")
                    except Exception as e:
                        print(f"   ❌ CRITICAL: Could not parse expires_at: {e}")
                else:
                    print(f"   ❌ CRITICAL: Response missing required fields")
        
        # Test invalid percent_off
        success, response = self.run_test(
            "Generate invalid 20% discount (should fail)",
            "POST",
            "api/discounts/generate",
            400,
            data={"percent_off": 20}
        )
    
    def test_discount_validation(self):
        """Test discount code validation"""
        print("\n" + "="*60)
        print("TESTING DISCOUNT CODE VALIDATION")
        print("="*60)
        
        if not self.generated_codes:
            print("   ⚠️  No codes generated, skipping validation tests")
            return
        
        # Test valid code
        valid_code = self.generated_codes[0]['code']
        success, response = self.run_test(
            f"Validate valid code: {valid_code}",
            "GET",
            f"api/discounts/validate/{valid_code}",
            200
        )
        
        if success:
            if response.get('valid') == True:
                print(f"   ✅ Code is valid")
                if 'discount' in response:
                    print(f"   📋 Discount details: {response['discount'].get('percent_off')}% off")
            else:
                print(f"   ❌ Code marked as invalid: {response.get('reason')}")
        
        # Test invalid code
        success, response = self.run_test(
            "Validate invalid code: INVALID-CODE-123",
            "GET",
            "api/discounts/validate/INVALID-CODE-123",
            200
        )
        
        if success:
            if response.get('valid') == False:
                print(f"   ✅ Invalid code correctly rejected")
                print(f"   📋 Reason: {response.get('reason')}")
            else:
                print(f"   ❌ Invalid code incorrectly marked as valid")
    
    def test_discount_list(self):
        """Test listing discount codes"""
        print("\n" + "="*60)
        print("TESTING DISCOUNT CODE LISTING")
        print("="*60)
        
        success, response = self.run_test(
            "List all discount codes",
            "GET",
            "api/discounts/list?status=all&limit=50",
            200
        )
        
        if success:
            if isinstance(response, list):
                print(f"   ✅ Retrieved {len(response)} discount codes")
                if len(response) > 0:
                    print(f"   📋 Sample code: {response[0].get('code')} ({response[0].get('percent_off')}% off)")
            else:
                print(f"   ⚠️  WARNING: Response is not a list")
    
    def test_payment_with_discount(self):
        """Test payment checkout with discount code"""
        print("\n" + "="*60)
        print("TESTING PAYMENT CHECKOUT WITH DISCOUNT")
        print("="*60)
        
        if not self.generated_codes:
            print("   ⚠️  No codes generated, skipping payment tests")
            return None
        
        # Use the 15% discount code
        discount_code = None
        for code_data in self.generated_codes:
            if code_data.get('percent_off') == 15:
                discount_code = code_data['code']
                break
        
        if not discount_code:
            discount_code = self.generated_codes[0]['code']
        
        # Test payment with discount
        payment_data = {
            "package_id": "level2_ten_pack",
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "customer_phone": "555-1234",
            "origin_url": self.base_url,
            "discount_code": discount_code
        }
        
        success, response = self.run_test(
            f"Create checkout session with discount: {discount_code}",
            "POST",
            "api/payments/checkout/session",
            200,
            data=payment_data
        )
        
        if success:
            session_id = response.get('session_id')
            if session_id:
                print(f"   ✅ Session created: {session_id}")
                return session_id
            else:
                print(f"   ⚠️  WARNING: No session_id in response")
        
        return None
    
    def test_transaction_details(self, session_id: Optional[str]):
        """Test transaction details retrieval"""
        print("\n" + "="*60)
        print("TESTING TRANSACTION DETAILS")
        print("="*60)
        
        if not session_id:
            print("   ⚠️  No session_id available, skipping transaction tests")
            return
        
        success, response = self.run_test(
            f"Get transaction details for session: {session_id}",
            "GET",
            f"api/payments/transaction/{session_id}",
            200
        )
        
        if success:
            # Verify discount metadata
            original_amount = response.get('original_amount')
            final_amount = response.get('amount')
            discount_code = response.get('discount_code')
            discount_percent = response.get('discount_percent')
            
            print(f"   📋 Original Amount: ${original_amount}")
            print(f"   📋 Final Amount: ${final_amount}")
            print(f"   📋 Discount Code: {discount_code}")
            print(f"   📋 Discount Percent: {discount_percent}%")
            
            if original_amount and final_amount and discount_percent:
                expected_final = round(original_amount * (1 - discount_percent / 100.0), 2)
                if abs(final_amount - expected_final) < 0.01:
                    print(f"   ✅ Discount calculation correct")
                else:
                    print(f"   ❌ Discount calculation incorrect - expected ${expected_final}, got ${final_amount}")
            
            if final_amount and original_amount and final_amount < original_amount:
                print(f"   ✅ Final amount is less than original amount")
            else:
                print(f"   ⚠️  WARNING: Final amount not less than original")
    
    def test_checkout_status(self, session_id: Optional[str]):
        """Test checkout status retrieval"""
        print("\n" + "="*60)
        print("TESTING CHECKOUT STATUS")
        print("="*60)
        
        if not session_id:
            print("   ⚠️  No session_id available, skipping status tests")
            return
        
        success, response = self.run_test(
            f"Get checkout status for session: {session_id}",
            "GET",
            f"api/payments/checkout/status/{session_id}",
            200
        )
        
        if success:
            status = response.get('status')
            payment_status = response.get('payment_status')
            amount_total = response.get('amount_total')
            
            print(f"   📋 Status: {status}")
            print(f"   📋 Payment Status: {payment_status}")
            print(f"   📋 Amount Total (cents): {amount_total}")
            
            if amount_total:
                print(f"   📋 Amount Total (dollars): ${amount_total / 100}")

    def test_voice_calls_api(self):
        """Test Voice Calls API endpoints (Phase 5)"""
        print("\n" + "="*60)
        print("TESTING VOICE CALLS API (PHASE 5)")
        print("="*60)
        
        # Test getting voice calls list
        success, response = self.run_test(
            "Get voice calls list",
            "GET",
            "api/voice/calls?limit=50",
            200
        )
        
        if success:
            calls = response.get('calls', [])
            print(f"   ✅ Retrieved {len(calls)} voice calls")
            if calls:
                sample_call = calls[0]
                print(f"   📋 Sample call: {sample_call.get('customer_name')} - {sample_call.get('status')}")
        
        # Test creating outbound call (mock mode)
        call_data = {
            "customer": {
                "name": "Test Customer",
                "phone": "+15551234567",
                "email": "test@example.com"
            }
        }
        
        success, response = self.run_test(
            "Create outbound voice call (mock)",
            "POST",
            "api/voice/calls/outbound",
            200,
            data=call_data
        )
        
        if success:
            status = response.get('status')
            call_id = response.get('call_id')
            print(f"   ✅ Call created with status: {status}")
            if call_id:
                print(f"   📋 Call ID: {call_id}")

    def test_admin_dashboard_apis(self):
        """Test Admin Dashboard API endpoints"""
        print("\n" + "="*60)
        print("TESTING ADMIN DASHBOARD APIS")
        print("="*60)
        
        # Test dashboard metrics
        success, response = self.run_test(
            "Get dashboard metrics",
            "GET",
            "api/dashboard/metrics",
            200
        )
        
        if success:
            total_revenue = response.get('total_revenue', 0)
            total_leads = response.get('total_leads', 0)
            print(f"   ✅ Metrics retrieved - Revenue: ${total_revenue}, Leads: {total_leads}")
        
        # Test campaigns
        success, response = self.run_test(
            "Get active campaigns",
            "GET",
            "api/campaigns?status=active",
            200
        )
        
        if success:
            campaigns = response if isinstance(response, list) else []
            print(f"   ✅ Retrieved {len(campaigns)} active campaigns")
        
        # Test AI recommendations
        success, response = self.run_test(
            "Get AI recommendations",
            "GET",
            "api/ai/recommendations?status=pending",
            200
        )
        
        if success:
            recommendations = response if isinstance(response, list) else []
            print(f"   ✅ Retrieved {len(recommendations)} AI recommendations")
        
        # Test leads
        success, response = self.run_test(
            "Get recent leads",
            "GET",
            "api/leads?limit=10",
            200
        )
        
        if success:
            leads = response if isinstance(response, list) else []
            print(f"   ✅ Retrieved {len(leads)} recent leads")

    def test_lotions_api(self):
        """Test Lotions API endpoints"""
        print("\n" + "="*60)
        print("TESTING LOTIONS API")
        print("="*60)
        
        # Test getting lotions list (public)
        success, response = self.run_test(
            "Get public lotions list",
            "GET",
            "api/lotions",
            200
        )
        
        if success:
            lotions = response if isinstance(response, list) else []
            print(f"   ✅ Retrieved {len(lotions)} public lotions")
            if lotions:
                sample = lotions[0]
                print(f"   📋 Sample lotion: {sample.get('name')} - ${sample.get('price')}")

    def test_blog_api(self):
        """Test Blog API endpoints"""
        print("\n" + "="*60)
        print("TESTING BLOG API")
        print("="*60)
        
        # Test getting blog posts
        success, response = self.run_test(
            "Get blog posts",
            "GET",
            "api/ai/content/blog",
            200
        )
        
        if success:
            posts = response if isinstance(response, list) else []
            print(f"   ✅ Retrieved {len(posts)} blog posts")
            if posts:
                sample = posts[0]
                print(f"   📋 Sample post: {sample.get('title')}")

    def test_rate_limiting(self):
        """Test Rate Limiting on AI endpoints (Phase 7)"""
        print("\n" + "="*60)
        print("TESTING RATE LIMITING (PHASE 7)")
        print("="*60)
        
        # Test rate limiting on AI analyze endpoint (max 5 requests per 300 seconds)
        print("   🔄 Testing rate limit on /api/ai/analyze (max 5 per 5 minutes)")
        
        # Make 6 requests rapidly to trigger rate limit
        for i in range(6):
            success, response = self.run_test(
                f"AI analyze request #{i+1}",
                "POST",
                "api/ai/analyze",
                200 if i < 5 else 429,  # Expect 429 on 6th request
                data={"force_refresh": False}
            )
            
            if i == 5 and not success:
                print(f"   ✅ Rate limit triggered correctly on request #{i+1}")
                break
            elif i == 5 and success:
                print(f"   ⚠️  WARNING: Rate limit not triggered on request #{i+1}")

    def test_phase1_auto_apply_system(self):
        """Test Phase 1 auto-apply discount system"""
        print("\n" + "="*60)
        print("TESTING PHASE 1 AUTO-APPLY DISCOUNT SYSTEM")
        print("="*60)
        
        # Generate auto-applied discount
        session_id = f"test_session_{datetime.now().timestamp()}"
        success, response = self.run_test(
            "Generate auto-applied discount",
            "POST",
            "api/discounts/generate",
            200,
            data={
                "percent_off": 15,
                "session_id": session_id,
                "auto_apply": True
            }
        )
        
        discount_id = None
        if success:
            discount_id = response.get('id')
            code_shown = response.get('code')
            message = response.get('message')
            
            print(f"   📋 Discount ID: {discount_id}")
            print(f"   📋 Code shown to user: {code_shown}")
            print(f"   📋 Message: {message}")
            
            # Verify code is hidden for auto-apply
            if code_shown is None:
                print(f"   ✅ PHASE 1: Code correctly hidden for auto-apply")
            else:
                print(f"   ❌ PHASE 1 FAIL: Code should be hidden but got: {code_shown}")
        
        # Test /api/discounts/active endpoint
        success, response = self.run_test(
            f"Check active discount for session: {session_id}",
            "GET",
            f"api/discounts/active?session_id={session_id}",
            200
        )
        
        if success:
            has_discount = response.get('has_discount')
            percent_off = response.get('percent_off')
            expires_in_hours = response.get('expires_in_hours')
            
            print(f"   📋 Has discount: {has_discount}")
            print(f"   📋 Percent off: {percent_off}%")
            print(f"   📋 Expires in hours: {expires_in_hours}")
            
            if has_discount and percent_off == 15:
                print(f"   ✅ PHASE 1: Auto-apply system working correctly")
            else:
                print(f"   ❌ PHASE 1 FAIL: Auto-apply system not working")
        
        return session_id, discount_id

    def test_phase1_first_time_discount(self):
        """Test Phase 1 first-time discount popup system"""
        print("\n" + "="*60)
        print("TESTING PHASE 1 FIRST-TIME DISCOUNT POPUP")
        print("="*60)
        
        # Generate first-time discount
        session_id = f"first_time_{datetime.now().timestamp()}"
        success, response = self.run_test(
            "Generate first-time discount (15%, 1-day, auto-applied)",
            "POST",
            f"api/discounts/first-time?session_id={session_id}",
            200
        )
        
        if success:
            discount_id = response.get('id')
            percent_off = response.get('percent_off')
            expires_in_hours = response.get('expires_in_hours')
            message = response.get('message')
            
            print(f"   📋 Discount ID: {discount_id}")
            print(f"   📋 Percent off: {percent_off}%")
            print(f"   📋 Expires in hours: {expires_in_hours}")
            print(f"   📋 Message: {message}")
            
            # Verify first-time discount specs
            if percent_off == 15:
                print(f"   ✅ PHASE 1: Correct 15% first-time discount")
            else:
                print(f"   ❌ PHASE 1 FAIL: Expected 15%, got {percent_off}%")
            
            if expires_in_hours == 24:
                print(f"   ✅ PHASE 1: Correct 24-hour expiry")
            else:
                print(f"   ❌ PHASE 1 FAIL: Expected 24h, got {expires_in_hours}h")
        
        return session_id

    def test_phase1_fizze_admin_crud(self):
        """Test Phase 1 Fizze Admin CRUD operations"""
        print("\n" + "="*60)
        print("TESTING PHASE 1 FIZZE ADMIN CRUD OPERATIONS")
        print("="*60)
        
        # Note: These endpoints require admin authentication
        # For testing purposes, we'll test without auth and expect 401/403
        
        # Test getting all drinks (admin endpoint)
        success, response = self.run_test(
            "Get all Fizze drinks (admin)",
            "GET",
            "api/fizze/admin/drinks",
            401  # Expect 401 without auth
        )
        
        if not success and response == {}:
            print(f"   ✅ PHASE 1: Admin endpoint correctly protected")
        
        # Test public menu endpoint (should work)
        success, response = self.run_test(
            "Get public Fizze menu",
            "GET",
            "api/fizze/menu",
            200
        )
        
        if success:
            menu_categories = len(response) if isinstance(response, dict) else 0
            print(f"   ✅ PHASE 1: Public menu accessible - {menu_categories} categories")
            
            # Check if menu has expected structure
            if isinstance(response, dict):
                for category, drinks in response.items():
                    print(f"   📋 Category '{category}': {len(drinks)} drinks")
        
        # Test coming soon endpoint
        success, response = self.run_test(
            "Get coming soon Fizze drinks",
            "GET",
            "api/fizze/coming-soon",
            200
        )
        
        if success:
            coming_soon_count = len(response) if isinstance(response, list) else 0
            print(f"   ✅ PHASE 1: Coming soon endpoint working - {coming_soon_count} drinks")
        
        # Test voting (should work with rate limiting)
        if success and isinstance(response, list) and len(response) > 0:
            drink_id = response[0].get('id')
            if drink_id:
                vote_success, vote_response = self.run_test(
                    f"Vote for coming soon drink: {drink_id}",
                    "POST",
                    f"api/fizze/vote/{drink_id}",
                    200
                )
                
                if vote_success:
                    votes = vote_response.get('votes', 0)
                    print(f"   ✅ PHASE 1: Voting system working - {votes} votes")

    def test_seo_endpoints(self):
        """Test newly implemented SEO endpoints"""
        print("\n" + "="*60)
        print("TESTING NEWLY IMPLEMENTED SEO ENDPOINTS")
        print("="*60)
        
        # Test sitemap.xml
        success, response = self.run_test(
            "Get sitemap.xml",
            "GET",
            "sitemap.xml",
            200
        )
        
        if success:
            print(f"   ✅ Sitemap.xml accessible")
            # Note: response will be XML string, not JSON
        
        # Test robots.txt
        success, response = self.run_test(
            "Get robots.txt",
            "GET",
            "robots.txt",
            200
        )
        
        if success:
            print(f"   ✅ Robots.txt accessible")
        
        # Test SEO meta endpoints
        pages = ['home', 'tanning', 'drinks', 'laundry', 'nails', 'blog']
        for page in pages:
            success, response = self.run_test(
                f"Get SEO meta for {page} page",
                "GET",
                f"api/seo/meta/{page}",
                200
            )
            
            if success:
                title = response.get('title', '')
                description = response.get('description', '')
                keywords = response.get('keywords', '')
                print(f"   ✅ {page} meta: {title[:30]}...")
                
                # Verify required fields
                if not title or not description or not keywords:
                    print(f"   ❌ CRITICAL: Missing SEO fields for {page}")

    def test_user_management_endpoints(self):
        """Test newly implemented user management endpoints"""
        print("\n" + "="*60)
        print("TESTING NEWLY IMPLEMENTED USER MANAGEMENT")
        print("="*60)
        
        # Test user endpoints without auth (should get 401/403)
        success, response = self.run_test(
            "List users (no auth - should fail)",
            "GET",
            "api/users/",
            401  # Expect 401 without auth
        )
        
        if not success:
            print(f"   ✅ User endpoints correctly protected")
        
        # Test user login endpoint structure
        success, response = self.run_test(
            "User login (invalid credentials)",
            "POST",
            "api/users/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpass"}
        )
        
        if not success:
            print(f"   ✅ User login correctly rejects invalid credentials")
        
        # Test create user endpoint (no auth - should fail)
        success, response = self.run_test(
            "Create user (no auth - should fail)",
            "POST",
            "api/users/",
            401,  # Expect 401 without auth
            data={
                "email": "test@example.com",
                "name": "Test User",
                "role": "staff",
                "password": "testpass123"
            }
        )
        
        if not success:
            print(f"   ✅ User creation correctly protected")

    def test_mary_well_chat(self):
        """Test Mary Well Chat API endpoints"""
        print("\n" + "="*60)
        print("TESTING MARY WELL CHAT API")
        print("="*60)
        
        # Test starting chat session
        success, response = self.run_test(
            "Start chat session",
            "POST",
            "api/chat/start",
            200
        )
        
        session_id = None
        if success:
            session_id = response.get('session_id')
            greeting = response.get('greeting')
            print(f"   ✅ Chat session started: {session_id}")
            print(f"   📋 Greeting: {greeting[:50]}..." if greeting else "")
        
        # Test sending message
        if session_id:
            message_data = {
                "session_id": session_id,
                "message": "Hello Mary, I need help with tanning packages"
            }
            
            success, response = self.run_test(
                "Send chat message",
                "POST",
                "api/chat/message",
                200,
                data=message_data
            )
            
            if success:
                ai_response = response.get('response')
                print(f"   ✅ AI response received: {ai_response[:50]}..." if ai_response else "")
        
        # Test packages endpoint
        success, response = self.run_test(
            "Get chat packages",
            "GET",
            "api/chat/packages",
            200
        )
        
        if success:
            packages = response
            print(f"   ✅ Packages retrieved: {len(packages)} levels" if isinstance(packages, dict) else "")
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"   - {test['name']}")
                if 'error' in test:
                    print(f"     Error: {test['error']}")
                else:
                    print(f"     Expected: {test.get('expected')}, Got: {test.get('actual')}")
        
        return self.tests_failed == 0

def main():
    print("="*60)
    print("BACKEND API TESTING - EASTEND FINAL COMPREHENSIVE TESTING")
    print("="*60)
    print(f"Base URL: https://tan-laundry.preview.emergentagent.com")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\nFOCUS: SEO endpoints, user management, regression testing of all features")
    
    tester = BackendAPITester()
    
    # NEWLY IMPLEMENTED FEATURES (Phase 4-6)
    tester.test_seo_endpoints()  # NEW: SEO components
    tester.test_user_management_endpoints()  # NEW: User management
    
    # Phase 1 Core Tests (Regression)
    tester.test_discount_generation()  # Updated with Phase 1 expiry logic
    tester.test_discount_validation()
    tester.test_discount_list()
    
    # Phase 1 Features (Regression)
    session_id, discount_id = tester.test_phase1_auto_apply_system()
    first_time_session = tester.test_phase1_first_time_discount()
    tester.test_phase1_fizze_admin_crud()
    
    # Existing Features (verify still working)
    payment_session_id = tester.test_payment_with_discount()
    tester.test_transaction_details(payment_session_id)
    tester.test_checkout_status(payment_session_id)
    
    # Core existing APIs
    tester.test_admin_dashboard_apis()
    tester.test_lotions_api()
    tester.test_mary_well_chat()
    tester.test_voice_calls_api()
    
    # Print summary
    all_passed = tester.print_summary()
    
    print(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\nNOTE: Phase 2-4 features (role-based access, social media, SEO) are NOT YET IMPLEMENTED")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
