import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { generateCouponPDF } from '../../utils/generateCouponPDF';
import QRCode from 'react-qr-code'; // ✅ QRCode bileşeni eklendi

const SuccessPage = () => {
  const { couponId } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/coupons/${couponId}`)
      .then(res => setCoupon(res.data))
      .catch(() => alert('Kupon məlumatı alınmadı'));
  }, [couponId]);

  if (!coupon) return <p>Yüklenir...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Satın Alma tamamlandı!</h2>
      <p>Kuponunuz satın alındı.</p>
      <p><strong>Kupon Kodu:</strong> {coupon.code}</p>

      {/* ✅ Ekranda gösterilecek QR kod */}
      <div style={{ margin: '1rem 0' }}>
        <QRCode value={coupon.code} size={150} />
      </div>

      {/* ✅ PDF için görünmeyen QR div */}
      <div
        id={`qr-${coupon._id}`}
        style={{ width: 150, height: 150, position: 'absolute', left: '-9999px' }}
      >
        <QRCode value={coupon.code} size={150} />
      </div>

      <button onClick={() => generateCouponPDF(coupon)}>
        Kuponu PDF Olaraq yüklə
      </button>

      <button
        onClick={() => navigate('/')}
        style={{ marginLeft: '1rem' }}
      >
        Ana Səhifəyə get
      </button>
    </div>
  );
};

export default SuccessPage;
