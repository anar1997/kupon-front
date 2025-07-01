// CouponDetail.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const CouponDetail = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await API.get(`/coupons/${id}`);
        setCoupon(res.data);
      } catch (error) {
        toast.error('❌ Kupon bilgisi alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  if (loading) return <p style={{ padding: '2rem' }}>Yüklənir...</p>;
  if (!coupon) return <p style={{ padding: '2rem' }}>Kupon tapılmadı.</p>;

  const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{coupon.title}</h2>
      <p>{coupon.description}</p>

      {coupon.category?.name && (
        <p><strong>Kategoriya:</strong> {coupon.category.name}</p>
      )}

      <p>
        <strong>Qiymət:</strong> {coupon.price} ₼ <br />
        <strong>Endirim:</strong> %{coupon.discount} <br />
        <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
      </p>

      {coupon.code ? (
        <>
          <p><strong>Kupon Kodu:</strong> {coupon.code}</p>
          <QRCode value={coupon.code} size={128} />
        </>
      ) : (
        <p><em>Bu kupon hələ ki, alınmayıb.</em></p>
      )}

      <p>
        <strong>Son istifadə tarixi:</strong>{' '}
        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('tr-TR') : '—'}
      </p>

      {coupon.usedAt && (
        <p><strong>İstifadə edilən tarix:</strong> {new Date(coupon.usedAt).toLocaleDateString('tr-TR')}</p>
      )}
      <button onClick={()=>navigate('/')}>Ana Səhifəyə qayıt</button>
    </div>
  );
};

export default CouponDetail;
