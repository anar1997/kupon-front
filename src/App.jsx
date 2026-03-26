import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import CustomerCoupons from './pages/customerCoupons/CustomerCoupons';
import Footer from './components/footer/Footer';
import ServiceDetail from './pages/serviceDetail/ServiceDetail';
import CartPage from './pages/cartPage/CartPage';
import AuthPage from './pages/auth/AuthPage';
import Layout from './components/Header/Layout';
import ServicePaginationPage from './pages/ServicePaginationPage/ServicePaginationPage';
import ManuelTest from './pages/profile/ManuelTest';
import Coupons from './components/profile/Coupons/Coupons';
import Connection from './pages/connection/Connection';
import AcceptRequest from './pages/connection/AcceptRequest';
import ScrollToTop from './components/ScroolTop';
import ChangePassword from './components/profile/settings/ChangePassword';
import IncreaseBalans from './components/profile/increaseBalans/IncreaseBalans';
import CardPayment from './pages/cardPayment/CardPayment';
import MyCouponDetail from './pages/customerCoupons/MyCouponDetail';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerApply from './pages/seller/SellerApply';
import PrivateRoute from './components/PrivateRoute';
import { getMeAsync } from './redux/slices/authSlice';
import { fetchCartAsync } from './redux/slices/cartSlice';

function App() {
  const dispatch = useDispatch();

  // Run once on app load: check if user is already logged in via cookie.
  // This must happen ABOVE PrivateRoute so auth state is ready before
  // any route decides to redirect to /auth.
  useEffect(() => {
    dispatch(getMeAsync());
    dispatch(fetchCartAsync());
  }, [dispatch]);

  return (
    <Router>
      <div className="bg-slate-100 min-h-screen">
        <ScrollToTop/>
        {/* AuthPage dışında Header ve Footer'ı göster */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} /> {/* AuthPage'de Header ve Footer gösterilmez */}
          <Route path="/" element={<><Layout /><CustomerCoupons /><Footer /></>} />
          <Route path="/service/:slug" element={<><Layout /><ServiceDetail /><Footer /></>} />
          <Route path="/my-cart" element={<><Layout /><CartPage /><Footer /></>} />
          <Route path="/services/:serviceName" element={<><Layout /><ServicePaginationPage /><Footer /></>} /> {/* ✅ */}
          <Route path='/profile-m' element={<PrivateRoute><Layout /><ManuelTest /><Footer /></PrivateRoute>}/>
          <Route path='/profile' element={<PrivateRoute><Layout /><ManuelTest /><Footer /></PrivateRoute>}/>
          <Route path="/coupons" element={<PrivateRoute><Layout /><Coupons /><Footer /></PrivateRoute>} />
          <Route path="/my-coupons/:id" element={<PrivateRoute><Layout /><MyCouponDetail /><Footer /></PrivateRoute>} />
          <Route path="/seller" element={<PrivateRoute><Layout /><SellerDashboard /><Footer /></PrivateRoute>} />
          <Route path="/seller-apply" element={<PrivateRoute><Layout /><SellerApply /><Footer /></PrivateRoute>} />
          <Route path="/increase-balans" element={<PrivateRoute><Layout /><IncreaseBalans /><Footer /></PrivateRoute>} />
          <Route path="/card-payment" element={<PrivateRoute><Layout /><CardPayment /><Footer /></PrivateRoute>} />
          <Route path="/connection" element={<><Layout /><Connection /><Footer /></>} />
          <Route path="/accept-request" element={<><Layout /><AcceptRequest /><Footer /></>} />
          <Route path="/profile/settings/change-password" element={<PrivateRoute><Layout /><ChangePassword /><Footer /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
