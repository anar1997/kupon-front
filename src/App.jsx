import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminPanel from './pages/adminPanel/AdminPanel';
import CustomerCoupons from './pages/customerCoupons/CustomerCoupons';
import CustomerRegister from './pages/customerRegister/CustomerRegister';
import CustomerLogin from './pages/customerLogin/CustomerLogin';
import MyCoupons from './components/myCoupons/MyCoupons';
import Profile from './pages/profile/Profile';
import ForgotPassword from './components/Password/ForgotPassword';
import ResetPassword from './components/Password/ReseetPassword';
import SellerPanel from './pages/sellerPanel/SellerPanel';
import SellerCoupons from './components/sellerCoupons/SellerCoupons';
import PaymentPage from './components/paymentPage/PaymentPage';
import SuccessPage from './components/successPage/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/' element={<CustomerCoupons />} />
        <Route path='/register' element={<CustomerRegister />} />
        <Route path='/login' element={<CustomerLogin />} />
        <Route path='/my-coupons' element={<MyCoupons />} />
        <Route path='/profile' element={<Profile />} /> {/* ✅ yeni */}
        <Route path='/forgot-password' element={<ForgotPassword />} /> {/* ✅ yeni */}
        <Route path='/reset-password/:token' element={<ResetPassword />} /> {/* ✅ yeni */}
        <Route path="/seller" element={<SellerPanel />} />
        <Route path="/seller-coupons" element={<SellerCoupons />} />
        <Route path="/payment/:couponId" element={<PaymentPage />} />
        <Route path="/success/:couponId" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;