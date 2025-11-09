"""
Backend API Testing for Discount Codes and Payment Integration
Tests all discount and payment endpoints
"""
import requests
import sys
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class BackendAPITester:
    def __init__(self, base_url="https://tanning-chatbot.preview.emergentagent.com"):
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
        """Test discount code generation for 5%, 10%, 15%"""
        print("\n" + "="*60)
        print("TESTING DISCOUNT CODE GENERATION")
        print("="*60)
        
        for percent in [5, 10, 15]:
            success, response = self.run_test(
                f"Generate {percent}% discount code",
                "POST",
                "api/discounts/generate",
                200,
                data={"percent_off": percent, "expires_in_days": 7}
            )
            
            if success:
                # Verify response structure
                if 'code' in response and 'percent_off' in response and 'expires_at' in response:
                    print(f"   📋 Code: {response['code']}")
                    print(f"   📋 Percent: {response['percent_off']}%")
                    print(f"   📋 Expires: {response['expires_at']}")
                    self.generated_codes.append(response)
                    
                    # Verify percent_off matches
                    if response['percent_off'] != percent:
                        print(f"   ⚠️  WARNING: percent_off mismatch - expected {percent}, got {response['percent_off']}")
                    
                    # Verify expires_at is in the future
                    try:
                        expires_at = datetime.fromisoformat(response['expires_at'].replace('Z', '+00:00'))
                        if expires_at <= datetime.now(timezone.utc):
                            print(f"   ⚠️  WARNING: expires_at is not in the future")
                    except Exception as e:
                        print(f"   ⚠️  WARNING: Could not parse expires_at: {e}")
                else:
                    print(f"   ⚠️  WARNING: Response missing required fields")
        
        # Test invalid percent_off
        success, response = self.run_test(
            "Generate invalid 20% discount (should fail)",
            "POST",
            "api/discounts/generate",
            400,
            data={"percent_off": 20, "expires_in_days": 7}
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
    print("BACKEND API TESTING - DISCOUNT CODES & PAYMENTS")
    print("="*60)
    print(f"Base URL: https://tanning-chatbot.preview.emergentagent.com")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = BackendAPITester()
    
    # Run all tests
    tester.test_discount_generation()
    tester.test_discount_validation()
    tester.test_discount_list()
    session_id = tester.test_payment_with_discount()
    tester.test_transaction_details(session_id)
    tester.test_checkout_status(session_id)
    
    # Print summary
    all_passed = tester.print_summary()
    
    print(f"\nCompleted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
