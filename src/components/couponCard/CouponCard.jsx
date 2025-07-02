import React from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const CouponCard = ({ coupon }) => {
  const navigate = useNavigate();
  const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h4>{coupon.title}</h4>
      <p>{coupon.description}</p>

      {coupon.category?.name && (
        <p><strong>Kategori:</strong> {coupon.category.name}</p>
      )}

      <p>
        İndirim: %{coupon.discount} | Fiyat: {coupon.price} ₼ | Potensial Qazanc: {potentialSavings} ₼
      </p>

      <button onClick={() => navigate(`/payment/${coupon._id}`)}>Satın Al</button>

      {coupon.code && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Kupon Kodu:</strong> {coupon.code}</p>
          <QRCode value={coupon.code} size={128} />
        </div>
      )}
    </div>
  );
};

export default CouponCard;
