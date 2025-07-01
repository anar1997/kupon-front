import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { generateCouponPDF } from '../../utils/generateCouponPDF';

const SuccessPage = () => {
  const { couponId } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/coupons/${couponId}`)
      .then(res => setCoupon(res.data))
      .catch(() => alert('Kupon bilgisi alınamadı'));
  }, [couponId]);

  if (!coupon) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Satın Alma Başarılı!</h2>
      <p>Kuponunuz başarıyla satın alındı.</p>
      <p><strong>Kupon Kodu:</strong> {coupon.code}</p>

      {/* QR Kodu görünmeden bile PDF'e aktarılacak */}
      <div
        id={`qr-${coupon._id}`}
        style={{ width: 150, height: 150, marginBottom: '1rem' }}
      >
        {/* Örnek: Eğer QR code bileşeni kullanıyorsan */}
        {/* <QRCode value={coupon.code} size={150} /> */}
      </div>

      <button onClick={() => generateCouponPDF(coupon)}>
        Kuponu PDF Olarak İndir
      </button>

      <button
        onClick={() => navigate('/')}
        style={{ marginLeft: '1rem' }}
      >
        Ana Sayfaya Git
      </button>
    </div>
  );
};

export default SuccessPage;
