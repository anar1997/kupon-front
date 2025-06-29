import React from 'react';
import QRCode from 'react-qr-code'; // react-qr-code paketinden import et

const CouponCard = ({ coupon, email, onEmailChange, onBuy, isLoggedIn }) => {
  // Potansiyel kazancı hesapla (indirim hep yüzde olduğu için)
  const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h4>{coupon.title}</h4>
      <p>{coupon.description}</p>
      <p>
        İndirim: %{coupon.discount} | Fiyat: {coupon.price} ₼ | Potensial Qazanc: {potentialSavings} ₼
      </p>

      {!isLoggedIn && (
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => onEmailChange(coupon._id, e.target.value)}
          required
          style={{ display: 'block', marginBottom: '0.5rem' }}
        />
      )}

      <button onClick={() => onBuy(coupon._id)}>Satın Al</button>

      {/* Kupon kodu varsa QR göster */}
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
