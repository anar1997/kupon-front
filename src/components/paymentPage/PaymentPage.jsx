import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../../services/api';

const PaymentPage = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  const customerToken = useSelector(state => state.user.token);
  const isLoggedIn = !!customerToken;

  useEffect(() => {
    API.get(`/coupons/${couponId}`)
      .then(res => {
        setCoupon(res.data);
        setLoading(false);
      })
      .catch(() => alert('Kupon bulunamadı'));
  }, [couponId]);

  const handlePayment = async () => {
    try {
      const endpoint = isLoggedIn
        ? `/coupons/buy/${couponId}`
        : `/coupons/public-buy/${couponId}`;

      const payload = isLoggedIn ? {} : { email };

      const headers = isLoggedIn
        ? { Authorization: `Bearer ${customerToken}` }
        : {};

      await API.post(endpoint, payload, { headers });

      navigate(`/success/${couponId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Ödəmə baş tutmadı');
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (!coupon) return <p>Kupon tapılmadı</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ödəmə Səhifəsi</h2>
      <p><strong>Kupon:</strong> {coupon.title}</p>
      <p><strong>Qiymət:</strong> {coupon.price} ₼</p>

      {!isLoggedIn && (
        <div style={{ margin: '1rem 0' }}>
          <label>
            E-posta adresiniz:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>
      )}

      <button onClick={handlePayment} disabled={!isLoggedIn && !email.trim()}>
        Ödəniş edin
      </button>
    </div>
  );
};

export default PaymentPage;
