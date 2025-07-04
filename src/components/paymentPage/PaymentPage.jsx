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

  if (loading)
    return <p className="p-4 text-center text-gray-600">Yüklənir...</p>;

  if (!coupon)
    return <p className="p-4 text-center text-red-600">Kupon tapılmadı</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Ödəmə Səhifəsi</h2>

      <p className="mb-2">
        <strong>Kupon:</strong> {coupon.title}
      </p>
      <p className="mb-4">
        <strong>Qiymət:</strong> {coupon.price} ₼
      </p>

      {!isLoggedIn && (
        <div className="mb-6">
          <label className="block mb-2 font-medium" htmlFor="email">
            E-posta adresiniz:
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="example@mail.com"
          />
        </div>
      )}

      <button onClick={handlePayment} disabled={!isLoggedIn && !email.trim()}
        className={`w-full py-3 rounded-md font-semibold text-white transition ${
          (!isLoggedIn && !email.trim())
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Ödəniş edin
      </button>
    </div>
  );
};

export default PaymentPage;