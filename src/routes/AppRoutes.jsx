import { Routes, Route } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ChatWidget from "../components/customer/ChatWidget";
import ForgotPassword from "../pages/customer/ForgotPassword";

// Customer pages
import Profile from "../pages/customer/Profile";
import Home from "../pages/customer/Home";
import Shop from "../pages/customer/Shop";
import ProductDetails from "../pages/customer/ProductDetails";
import Login from "../pages/customer/Login";
import Signup from "../pages/customer/Signup";
import Contact from "../pages/customer/Contact";
import Wishlist from "../pages/customer/Wishlist";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderConfirmation from "../pages/customer/OrderConfirmation";
import Nightwear from "../pages/customer/Nightwear";
import Abayas from "../pages/customer/Abayas";
import Kaftans from "../pages/customer/Kaftans";
import CoordSets from "../pages/customer/CoordSets";
import NewArrivals from "../pages/customer/NewArrivals";
import BestSellerPage from "../pages/customer/BestSellerPage";
import OurStoryPage from "../pages/customer/OurStoryPage";
import OrderDetails from "../pages/customer/OrderDetails";
import OrderHistory from "../pages/customer/OrderHistory";
import SearchResults from "../pages/customer/SearchResults";
import FAQ from "../pages/customer/FAQ";
import Shipping from "../pages/customer/Shipping";
import Returns from "../pages/customer/Returns";
import PrivacyPolicy from "../pages/customer/PrivacyPolicy";
import Terms from "../pages/customer/Terms";

// Admin
import AdminLayout from "../components/admin/AdminLayout";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";
import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/ProductList";
import ProductForm from "../pages/admin/ProductForm";
import Inventory from "../pages/admin/Inventory";
import OrderList from "../pages/admin/OrderList";
import OrderDetail from "../pages/admin/OrderDetail";
import CustomerList from "../pages/admin/CustomerList";
import CustomerDetail from "../pages/admin/CustomerDetail";
import GuestOrders from "../pages/admin/GuestOrders";
import ReviewList from "../pages/admin/ReviewList";
import Coupons from "../pages/admin/Coupons";
import CouponForm from "../pages/admin/CouponForm";
import ContactMessages from "../pages/admin/ContactMessages";
import AdminReturns from "../pages/admin/Returns";
import Reports from "../pages/admin/Reports";
import Newsletter from "../pages/admin/Newsletter";
import CancelledOrders from "../pages/admin/CancelledOrders";
import Addresses from "../pages/customer/Addresses";
import DiscountProduct from "../pages/admin/DiscountProduct";
import CustomerOrders from "../pages/admin/CustomerOrders";
import SalesStockProfit from "../pages/admin/SalesStockProfit";
import AdminLogin from "../pages/admin/AdminLogin";
function CustomerLayout({ children }) {
  return (
    <>
  <Navbar />
  {children}
  <Footer />
  <ChatWidget />
</>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Customer-facing ---------- */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
      <Route path="/product/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/signup" element={<CustomerLayout><Signup /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
      <Route path="/wishlist" element={<CustomerLayout><Wishlist /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
      <Route path="/nightwear" element={<CustomerLayout><Nightwear /></CustomerLayout>} />
      <Route path="/abayas" element={<CustomerLayout><Abayas /></CustomerLayout>} />
      <Route path="/kaftans" element={<CustomerLayout><Kaftans /></CustomerLayout>} />
      <Route path="/coord-sets" element={<CustomerLayout><CoordSets /></CustomerLayout>} />
      <Route path="/new-arrivals" element={<CustomerLayout><NewArrivals /></CustomerLayout>} />
      <Route path="/best-sellers" element={<CustomerLayout><BestSellerPage /></CustomerLayout>} />
      <Route path="/our-story" element={<CustomerLayout><OurStoryPage /></CustomerLayout>} />
      <Route path="/about" element={<CustomerLayout><OurStoryPage /></CustomerLayout>} />
      <Route path="/about-us" element={<CustomerLayout><OurStoryPage /></CustomerLayout>} />
      <Route path="/review-us" element={<CustomerLayout><Contact /></CustomerLayout>} />
      <Route path="/profile/orders" element={<CustomerLayout><OrderHistory /></CustomerLayout>} />
      <Route path="/profile/orders/:orderId" element={<CustomerLayout><OrderDetails /></CustomerLayout>} />
      <Route path="/order-confirmation/:orderId" element={<CustomerLayout><OrderConfirmation /></CustomerLayout>} />
      <Route path="/search" element={<CustomerLayout><SearchResults /></CustomerLayout>} />
      <Route path="/faq" element={<CustomerLayout><FAQ /></CustomerLayout>} />
      <Route path="/shipping" element={<CustomerLayout><Shipping /></CustomerLayout>} />
      <Route path="/returns" element={<CustomerLayout><Returns /></CustomerLayout>} />
      <Route path="/privacy" element={<CustomerLayout><PrivacyPolicy /></CustomerLayout>} />
      <Route path="/terms" element={<CustomerLayout><Terms /></CustomerLayout>} />
      <Route
        path="/forgot-password"
        element={<CustomerLayout><ForgotPassword /></CustomerLayout>}
      />
      
      <Route path="/addresses" element={<Addresses />} />

      {/* ---------- Admin ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/guests" element={<GuestOrders />} />
        <Route path="customers/:customerId" element={<CustomerDetail />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="reviews" element={<ReviewList />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/new" element={<CouponForm />} />
        <Route path="returns" element={<AdminReturns />} />
        <Route path="reports" element={<Reports />} />
        <Route path="newsletter" element={<Newsletter />} />

    <Route path="cancelled-orders" element={<CancelledOrders />} />
    <Route path="customer-orders" element={<CustomerOrders />} />
    <Route path="sales-profit" element={<SalesStockProfit />} />

<Route
  path="products/discount/:id"
  element={<DiscountProduct />}
/>

</Route>

</Routes>
  );
}