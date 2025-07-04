import React from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import './CouponCard.css';  // <-- CSS importu

const CouponCard = ({ coupon }) => {
  const navigate = useNavigate();
  const potentialSavings = ((coupon.price * coupon.discount) / 100).toFixed(2);

  return (
    <div className="coupon-card border border-gray-300 rounded-lg mb-6 shadow-sm
                flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex-1">
        <h4 className="text-lg font-semibold mb-1">{coupon.title}</h4>
        <p className="text-gray-700 mb-2">{coupon.description}</p>

        {coupon.category?.name && (
          <p className="text-sm text-gray-800 mb-2">
            <strong>Kategoriya:</strong> {coupon.category.name}
          </p>
        )}

        <p className="text-sm font-medium">
          Endirim: <span className="text-red-700">%{coupon.discount}</span> |
          Qiymət: <span className="text-gray-800">{coupon.price} ₼</span> |
          Potensial Qazanc: <span className="text-green-800">{potentialSavings} ₼</span>
        </p>

        <button
          onClick={() => navigate(`/payment/${coupon._id}`)}
          className="buy-btn"
          aria-label={`Satın al ${coupon.title}`}
        >
          Satın Al
        </button>

      </div>

      {coupon.code && (
        <div className="flex flex-col items-center sm:items-end">
          <p className="font-semibold mb-2 break-all text-center sm:text-right">
            Kupon Kodu: <span className="text-indigo-600">{coupon.code}</span>
          </p>
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <QRCode value={coupon.code} size={128} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponCard;
