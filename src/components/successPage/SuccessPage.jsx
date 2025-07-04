import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { generateCouponPDF } from '../../utils/generateCouponPDF';
import QRCode from 'react-qr-code';

const SuccessPage = () => {
  const { couponId } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/coupons/${couponId}`)
      .then(res => setCoupon(res.data))
      .catch(() => alert('Kupon məlumatı alınmadı'));
  }, [couponId]);

  if (!coupon)
    return (
      <p className="p-4 text-center text-gray-600">
        Yüklenir...
      </p>
    );

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4">Satın Alma tamamlandı!</h2>
      <p className="mb-2">Kuponunuz satın alındı.</p>
      <p className="mb-4">
        <strong>Kupon Kodu:</strong> {coupon.code}
      </p>

      {/* QR Kodu Ekranda */}
      <div className="mx-auto mb-6 w-[150px] h-[150px]">
        <QRCode value={coupon.code} size={150} />
      </div>

      {/* PDF için görünmeyen QR kod */}
      <div id={`qr-${coupon._id}`}
        className="w-[150px] h-[150px] absolute -left-[9999px]"
      >
        <QRCode value={coupon.code} size={150} />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => generateCouponPDF(coupon)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Kuponu PDF Olaraq yüklə
        </button>

        <button onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition"
        >
          Ana Səhifəyə get
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;