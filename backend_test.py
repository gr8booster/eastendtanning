#!/usr/bin/env python3
"""
818 EATS Backend API Testing Suite
Tests the weekly batch aggregation system for African cuisine ordering
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

class EatsAPITester:
    def __init__(self, base_url="https://eastend-tanning.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_order_id = None
        self.test_paypal_order_id = None

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"name": name, "details": details})
        print()

    def test_menu_endpoint(self) -> bool:
        """Test GET /api/eats/menu - should return 4 items all priced at $25"""
        try:
            response = requests.get(f"{self.base_url}/api/eats/menu", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Menu Endpoint", False, f"Expected 200, got {response.status_code}")
                return False
            
            data = response.json()
            menu = data.get("menu", [])
            
            # Check we have 4 items
            if len(menu) != 4:
                self.log_test("Menu Endpoint", False, f"Expected 4 menu items, got {len(menu)}")
                return False
            
            # Check all items are $25
            expected_items = ["Ghana Jollof Rice", "Egusi Stew", "Suya & Fried Plantains", "Waakye"]
            found_items = [item["name"] for item in menu]
            
            for item in menu:
                if item["price"] != 25.00:
                    self.log_test("Menu Endpoint", False, f"Item {item['name']} price is ${item['price']}, expected $25.00")
                    return False
            
            # Check all expected items are present
            for expected_item in expected_items:
                if expected_item not in found_items:
                    self.log_test("Menu Endpoint", False, f"Missing expected item: {expected_item}")
                    return False
            
            self.log_test("Menu Endpoint", True, f"Found all 4 items at $25: {', '.join(found_items)}")
            return True
            
        except Exception as e:
            self.log_test("Menu Endpoint", False, f"Request failed: {str(e)}")
            return False

    def test_create_order(self) -> bool:
        """Test POST /api/eats/orders - creates order with batch tracking"""
        try:
            # First get menu to get a valid item ID
            menu_response = requests.get(f"{self.base_url}/api/eats/menu", timeout=10)
            if menu_response.status_code != 200:
                self.log_test("Create Order", False, "Could not fetch menu for test")
                return False
            
            menu_items = menu_response.json()["menu"]
            test_item = menu_items[0]  # Use first item (Ghana Jollof Rice)
            
            order_data = {
                "customer_name": "Test Customer",
                "customer_phone": "(740) 555-1234",
                "customer_email": "test@example.com",
                "customer_address": "123 Test St, Mt Vernon, OH 43050",
                "menu_item_id": test_item["id"],
                "quantity": 1,
                "tip": 3.00,
                "notes": "Test order for API validation"
            }
            
            response = requests.post(
                f"{self.base_url}/api/eats/orders",
                json=order_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_test("Create Order", False, f"Expected 200, got {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            if data.get("status") != "success":
                self.log_test("Create Order", False, f"Expected success status, got: {data}")
                return False
            
            order = data.get("order", {})
            batch_info = data.get("batch_info", {})
            
            # Store order ID for later tests
            self.test_order_id = order.get("id")
            
            # Validate order structure
            required_fields = ["id", "order_number", "customer_name", "menu_item_name", "total", "batch_id"]
            for field in required_fields:
                if field not in order:
                    self.log_test("Create Order", False, f"Missing required field: {field}")
                    return False
            
            # Validate total calculation (item + delivery + tax + tip)
            expected_subtotal = 25.00
            expected_delivery = 5.99
            expected_tax = round(expected_subtotal * 0.08, 2)  # 8% tax
            expected_tip = 3.00
            expected_total = round(expected_subtotal + expected_delivery + expected_tax + expected_tip, 2)
            
            if abs(order["total"] - expected_total) > 0.01:
                self.log_test("Create Order", False, f"Total calculation error. Expected ${expected_total}, got ${order['total']}")
                return False
            
            # Validate batch info
            if "batch_id" not in batch_info or "current_orders" not in batch_info:
                self.log_test("Create Order", False, f"Missing batch info: {batch_info}")
                return False
            
            self.log_test("Create Order", True, f"Order {order['order_number']} created successfully. Total: ${order['total']}, Batch: {batch_info['batch_id']}")
            return True
            
        except Exception as e:
            self.log_test("Create Order", False, f"Request failed: {str(e)}")
            return False

    def test_current_batch_status(self) -> bool:
        """Test GET /api/eats/orders/current-batch - returns batch progress"""
        try:
            response = requests.get(f"{self.base_url}/api/eats/orders/current-batch", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Current Batch Status", False, f"Expected 200, got {response.status_code}")
                return False
            
            data = response.json()
            
            # Check required fields
            required_fields = ["batch_id", "week", "current_orders", "target_orders", "progress_percentage", "status", "vote_summary"]
            for field in required_fields:
                if field not in data:
                    self.log_test("Current Batch Status", False, f"Missing required field: {field}")
                    return False
            
            # Validate target is 40
            if data["target_orders"] != 40:
                self.log_test("Current Batch Status", False, f"Expected target_orders=40, got {data['target_orders']}")
                return False
            
            # Validate progress calculation
            expected_progress = round((data["current_orders"] / 40) * 100, 1)
            if abs(data["progress_percentage"] - expected_progress) > 0.1:
                self.log_test("Current Batch Status", False, f"Progress calculation error. Expected {expected_progress}%, got {data['progress_percentage']}%")
                return False
            
            self.log_test("Current Batch Status", True, f"Batch {data['batch_id']}: {data['current_orders']}/40 orders ({data['progress_percentage']}%)")
            return True
            
        except Exception as e:
            self.log_test("Current Batch Status", False, f"Request failed: {str(e)}")
            return False

    def test_all_batches(self) -> bool:
        """Test GET /api/eats/orders/all-batches - returns batch history"""
        try:
            response = requests.get(f"{self.base_url}/api/eats/orders/all-batches", timeout=10)
            
            if response.status_code != 200:
                self.log_test("All Batches", False, f"Expected 200, got {response.status_code}")
                return False
            
            data = response.json()
            
            if "batches" not in data:
                self.log_test("All Batches", False, "Missing 'batches' field in response")
                return False
            
            batches = data["batches"]
            
            # If we have batches, validate structure
            if batches:
                batch = batches[0]
                required_fields = ["batch_id", "total_orders", "paid_orders", "total_revenue", "target_reached"]
                for field in required_fields:
                    if field not in batch:
                        self.log_test("All Batches", False, f"Missing required field in batch: {field}")
                        return False
            
            self.log_test("All Batches", True, f"Found {len(batches)} batch(es) in history")
            return True
            
        except Exception as e:
            self.log_test("All Batches", False, f"Request failed: {str(e)}")
            return False

    def test_paypal_create_order(self) -> bool:
        """Test POST /api/eats/paypal/create-order - creates PayPal order"""
        if not self.test_order_id:
            self.log_test("PayPal Create Order", False, "No test order ID available")
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/api/eats/paypal/create-order",
                json={"order_id": self.test_order_id},
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code != 200:
                self.log_test("PayPal Create Order", False, f"Expected 200, got {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            if data.get("status") != "success":
                self.log_test("PayPal Create Order", False, f"Expected success status, got: {data}")
                return False
            
            # Check required fields
            required_fields = ["paypal_order_id", "amount"]
            for field in required_fields:
                if field not in data:
                    self.log_test("PayPal Create Order", False, f"Missing required field: {field}")
                    return False
            
            self.test_paypal_order_id = data["paypal_order_id"]
            
            self.log_test("PayPal Create Order", True, f"PayPal order created: {data['paypal_order_id']}, Amount: ${data['amount']}")
            return True
            
        except Exception as e:
            self.log_test("PayPal Create Order", False, f"Request failed: {str(e)}")
            return False

    def test_get_order(self) -> bool:
        """Test GET /api/eats/orders/{order_id} - retrieves specific order"""
        if not self.test_order_id:
            self.log_test("Get Order", False, "No test order ID available")
            return False
        
        try:
            response = requests.get(f"{self.base_url}/api/eats/orders/{self.test_order_id}", timeout=10)
            
            if response.status_code != 200:
                self.log_test("Get Order", False, f"Expected 200, got {response.status_code}")
                return False
            
            order = response.json()
            
            # Validate order structure
            required_fields = ["id", "order_number", "customer_name", "menu_item_name", "total", "status"]
            for field in required_fields:
                if field not in order:
                    self.log_test("Get Order", False, f"Missing required field: {field}")
                    return False
            
            if order["id"] != self.test_order_id:
                self.log_test("Get Order", False, f"Order ID mismatch. Expected {self.test_order_id}, got {order['id']}")
                return False
            
            self.log_test("Get Order", True, f"Retrieved order {order['order_number']} successfully")
            return True
            
        except Exception as e:
            self.log_test("Get Order", False, f"Request failed: {str(e)}")
            return False

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all backend tests"""
        print("🍛 818 EATS Backend API Testing Suite")
        print("=" * 50)
        print(f"Testing against: {self.base_url}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Run tests in order
        test_methods = [
            self.test_menu_endpoint,
            self.test_create_order,
            self.test_current_batch_status,
            self.test_all_batches,
            self.test_get_order,
            self.test_paypal_create_order,
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                self.log_test(test_method.__name__, False, f"Test execution error: {str(e)}")
        
        # Print summary
        print("=" * 50)
        print(f"📊 TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failed in self.failed_tests:
                print(f"  - {failed['name']}: {failed['details']}")
        
        return {
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "tests_failed": len(self.failed_tests),
            "success_rate": (self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0,
            "failed_tests": self.failed_tests
        }

def main():
    """Main test execution"""
    tester = EatsAPITester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    return 0 if results["tests_failed"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())