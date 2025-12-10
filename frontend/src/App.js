import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SocialMediaBar } from './components/SocialMediaBar';
import { Toaster } from './components/ui/sonner';
import { LeadCaptureManager } from './components/LeadCaptureManager';
import Home from './pages/Home';
import Tanning from './pages/Tanning';
import Laundry from './pages/Laundry';
import WestendLaundry from './pages/WestendLaundry';
import Drinks from './pages/Drinks';
import Nails from './pages/Nails';
import Locations from './pages/Locations';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SkinTypeEvaluation from './pages/SkinTypeEvaluation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Receipt from './pages/Receipt';
import OrderDrinks from './pages/OrderDrinks';
import Coupon from './pages/Coupon';
import TanningCheckout from './pages/TanningCheckout';
import TanningReceipt from './pages/TanningReceipt';
import BlackFridayCheckout from './pages/BlackFridayCheckout';
import BlackFridaySuccess from './pages/BlackFridaySuccess';
import UnifiedCheckout from './pages/UnifiedCheckout';
import UnifiedReceipt from './pages/UnifiedReceipt';
import LotionsShop from './pages/LotionsShop';
import FoodTruckStop from './pages/FoodTruckStop';
import FoodTruckPayment from './pages/FoodTruckPayment';
import { MaryWellChat } from './components/MaryWellChat';
import { BlackFridayPopup } from './components/BlackFridayPopup';
import { useEffect } from 'react';
import { initGA, trackPageView } from './utils/analytics';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Analytics tracker component
function AnalyticsTracker() {
  const location = useLocation();
  
  useEffect(() => {
    initGA();
  }, []);
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsTracker />
        <div className="App min-h-screen flex flex-col">
          <Header />
          <SocialMediaBar />
          <LeadCaptureManager />
          <MaryWellChat />
          <BlackFridayPopup />
          <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tanning" element={<Tanning />} />
            <Route path="/laundry" element={<Laundry />} />
            <Route path="/westend-laundry" element={<WestendLaundry />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/nails" element={<Nails />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/skin-type-evaluation" element={<SkinTypeEvaluation />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/receipt/:sessionId" element={<Receipt />} />
            <Route path="/order-drinks" element={<OrderDrinks />} />
            <Route path="/coupon/:couponId" element={<Coupon />} />
            <Route path="/tanning-checkout" element={<TanningCheckout />} />
            <Route path="/tanning-receipt/:orderId" element={<TanningReceipt />} />
            <Route path="/black-friday-checkout" element={<BlackFridayCheckout />} />
            <Route path="/black-friday-success" element={<BlackFridaySuccess />} />
            <Route path="/checkout" element={<UnifiedCheckout />} />
            <Route path="/receipt/:orderId" element={<UnifiedReceipt />} />
            <Route path="/lotions" element={<LotionsShop />} />
            <Route path="/foodtruck" element={<FoodTruckStop />} />
            <Route path="/foodtruck-payment/:bookingId" element={<FoodTruckPayment />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;