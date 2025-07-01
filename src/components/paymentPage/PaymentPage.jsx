import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const PaymentPage = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

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
      // Fake ödeme başarılı, backend'e satın alma isteği gönder
      await API.post(`/coupons/buy/${couponId}`, { /* burada istersen e-posta falan gönderebilirsin */ });

      // Başarı sayfasına yönlendir
      navigate(`/success/${couponId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Ödeme yapılamadı');
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!coupon) return <p>Kupon bulunamadı</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ödeme Sayfası</h2>
      <p>Kupon: {coupon.title}</p>
      <p>Fiyat: {coupon.price} ₼</p>
      <button onClick={handlePayment}>Ödeme Yap</button>
    </div>
  );
};

export default PaymentPage;
