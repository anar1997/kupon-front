import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CouponCard from '../../components/couponCard/CouponCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CustomerCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [emailInputs, setEmailInputs] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()
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
    <div style={{ padding: '2rem' }}>
      <button
        onClick={() => navigate('/my-coupons')}
        style={{
          marginTop: '2rem',
          marginRight: '1rem',
          backgroundColor: '#444',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Səbətim
      </button>
      <button
        onClick={() => navigate('/profile')}
        style={{
          marginTop: '2rem',
          marginRight: '1rem',
          backgroundColor: '#444',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Profilim
      </button>
      <h2>Mövcud Kuponlar</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {coupons.length === 0 ? (
        <p>Heç bir kupon tapılmadı.</p>
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