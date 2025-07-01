import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CouponCard from '../../components/couponCard/CouponCard';
import { useSelector } from 'react-redux';

const CustomerCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [emailInputs, setEmailInputs] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const customerToken = useSelector(state => state.user.token);

  const isLoggedIn = !!customerToken; // ✅ Giriş yapılıp yapılmadığını kontrol et

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
      return alert('Lütfen e-posta adresinizi girin.');
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
    <div style={{ padding: '2rem' }}>
      <h2>Mevcut Kuponlar</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {coupons.length === 0 ? (
        <p>Hiç kupon bulunamadı.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {coupons.map((coupon) => (
            <li key={coupon._id}>
              <CouponCard
                coupon={coupon}
                email={emailInputs[coupon._id] || ''}
                onEmailChange={handleEmailChange}
                onBuy={handleBuy}
                isLoggedIn={isLoggedIn} // ✅ Bilgiyi kupon kartına ilet
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerCoupons;