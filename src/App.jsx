import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomerCoupons from './pages/customerCoupons/CustomerCoupons';
import Footer from './components/footer/Footer';
import ServiceDetail from './pages/serviceDetail/ServiceDetail';
import CartPage from './pages/cartPage/CartPage';
import AuthPage from './pages/auth/AuthPage';
import Layout from './components/Header/Layout';
import ServicePaginationPage from './pages/ServicePaginationPage/ServicePaginationPage';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <Router>
      <div className="bg-slate-100 min-h-screen">
        {/* AuthPage dışında Header ve Footer'ı göster */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} /> {/* AuthPage'de Header ve Footer gösterilmez */}
          <Route path="/" element={<><Layout /><CustomerCoupons /><Footer /></>} />
          <Route path="/service/:id" element={<><Layout /><ServiceDetail /><Footer /></>} />
          <Route path="/my-cart" element={<><Layout /><CartPage /><Footer /></>} />
          <Route path="/services/:serviceName" element={<><Layout /><ServicePaginationPage /><Footer /></>} /> {/* ✅ */}
          <Route path='/profile' element={<><Layout /><Profile /><Footer /></>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
