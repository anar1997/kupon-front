import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SellerCoupons = () => {
  const [usedCoupons, setUsedCoupons] = useState([]);
  const { isAuthenticated } = useSelector(state => state.seller);
  const role = 'seller';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'seller') {
      navigate('/login');
      return;
    }

    const fetchUsedCoupons = async () => {
      try {
        const res = await API.get('/coupons/used-by-seller');
        setUsedCoupons(res.data.usedCoupons);
      } catch (err) {
        console.error('Kuponlar alınamadı:', err);
      }
    };

    fetchUsedCoupons();
  }, [isAuthenticated, navigate, role]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('tr-TR') : '—';

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate('/seller')}
        className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
      >
        Skan səhifəsinə geri dön
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-center">Skan etdiyim kuponlar</h2>

      {usedCoupons.length === 0 ? (
        <p className="text-center text-gray-600">Henüz kullandığınız kupon yok.</p>
      ) : (
        usedCoupons.map(coupon => {
          const potentialSavings = ((coupon.price * coupon.discount) / 100).toFixed(2);
          return (
            <div
              key={coupon._id}
              className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm bg-white"
            >
              <h4 className="text-xl font-semibold mb-1">{coupon.title}</h4>
              <p className="mb-2 text-gray-700">{coupon.description}</p>
              <p className="mb-2">
                <strong>Kod:</strong>{' '}
                <code className="bg-gray-100 px-1 rounded">{coupon.code}</code>
              </p>
              <p className="mb-2">
                <strong>Endirim:</strong> %{coupon.discount} ₼ <br />
                <strong>Qiymət:</strong> {coupon.price} ₼ <br />
                <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
              </p>
              <p className="mb-1"><strong>Alınma Tarixi:</strong> {formatDate(coupon.createdAt)}</p>
              <p className="mb-1"><strong>İstifadə Tarixi:</strong> {coupon.usedAt ? formatDate(coupon.usedAt) : '—'}</p>
              <p><strong>Bitmə Tarixi:</strong> {formatDate(coupon.expiresAt)}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SellerCoupons;