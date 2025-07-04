import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CouponCard from '../../components/couponCard/CouponCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomerCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [emailInputs, setEmailInputs] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const customerToken = useSelector(state => state.user.token);

  const isLoggedIn = !!customerToken;

  const fetchCoupons = async () => {
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data.filter(c => !c.isUsed));
    } catch {
      alert('Kuponlar alınamadı.');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEmailChange = (couponId, value) => {
    setEmailInputs(prev => ({ ...prev, [couponId]: value }));
  };

  const handleBuy = async (couponId) => {
    const email = emailInputs[couponId];

    if (!isLoggedIn && !email) {
      return alert('Xahiş olunur e-posta adresinizi yazın.');
    }

    try {
      const endpoint = isLoggedIn
        ? `/coupons/buy/${couponId}`
        : `/coupons/public-buy/${couponId}`;

      const payload = isLoggedIn ? {} : { email };

      const res = await API.post(endpoint, payload);
      setSuccessMessage(`Kupon kodu "${res.data.code}" e-mail adresinizə göndərildi.`);
      fetchCoupons();
      setTimeout(() => setSuccessMessage(''), 8000);
    } catch (error) {
      alert(error.response?.data?.message || 'Satın alma başarısız.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start">
        <button
          onClick={() => navigate('/my-coupons')}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Səbətim
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Profilim
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Mövcud Kuponlar</h2>

      {successMessage && (
        <p className="mb-4 text-green-600 font-medium text-center">{successMessage}</p>
      )}

      {coupons.length === 0 ? (
        <p className="text-center text-gray-600">Heç bir kupon tapılmadı.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <li key={coupon._id}>
              <CouponCard
                coupon={coupon}
                email={emailInputs[coupon._id] || ''}
                onEmailChange={handleEmailChange}
                onBuy={handleBuy}
                isLoggedIn={isLoggedIn}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerCoupons;
