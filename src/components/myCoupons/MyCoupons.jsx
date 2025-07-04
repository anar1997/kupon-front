import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRemainingTime } from '../../utils/dateUtils';

const MyCoupons = () => {
  const [stats, setStats] = useState({ totalCoupons: 0, totalSpent: 0 });
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [passiveCoupons, setPassiveCoupons] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyCoupons = async () => {
      try {
        const res = await API.get('/coupons/my');
        setStats({
          totalCoupons: res.data.stats.totalCoupons,
          totalSpent: res.data.stats.totalSpent
        });
        setActiveCoupons(res.data.activeCoupons);
        setPassiveCoupons(res.data.passiveCoupons);
        setAllCoupons(res.data.allCoupons);

        const initialTimes = {};
        res.data.activeCoupons.forEach(coupon => {
          initialTimes[coupon._id] = getRemainingTime(coupon.expiresAt);
        });
        setRemainingTimes(initialTimes);
      } catch (error) {
        console.error('Kuponlar alınamadı:', error);
      }
    };

    fetchMyCoupons();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimes = {};
      activeCoupons.forEach(coupon => {
        updatedTimes[coupon._id] = getRemainingTime(coupon.expiresAt);
      });
      setRemainingTimes(updatedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCoupons]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('tr-TR') : '—';

  const sortedActiveCoupons = [...activeCoupons].sort(
    (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)
  );

  const totalSaved = passiveCoupons
    .filter(coupon => coupon.usedAt)
    .reduce((sum, coupon) => sum + (coupon.price * coupon.discount / 100), 0)
    .toFixed(2);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Əsas Səhifə
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Aldığım Kuponlar</h2>

      <div className="mb-6 space-y-2 text-sm md:text-base">
        <p><strong>Toplam Kupon:</strong> {stats.totalCoupons}</p>
        <p><strong>Toplam Xərc:</strong> {stats.totalSpent} ₼</p>
        <p><strong>Toplam Qazanc:</strong> {totalSaved} ₼</p>
      </div>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Aktiv Kuponlar</h3>
        {sortedActiveCoupons.length === 0 ? (
          <p className="text-gray-500">Aktiv kupon yoxdur.</p>
        ) : (
          sortedActiveCoupons.map(coupon => {
            const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
            return (
              <div key={coupon._id} className="border-2 border-green-600 rounded p-4 mb-4 shadow-sm bg-green-50">
                <h4 className="font-semibold text-lg mb-1">{coupon.title}</h4>
                <p className="mb-2 text-gray-700">{coupon.description}</p>
                <p className="mb-2"><strong>Kod:</strong> <code className="bg-gray-100 px-1 rounded">{coupon.code}</code></p>
                <p className="mb-1">
                  <strong>Endirim:</strong> %{coupon.discount} <br />
                  <strong>Qiymət:</strong> {coupon.price} ₼ <br />
                  <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
                </p>
                <p className="mb-1"><strong>Qalan müddət:</strong> {remainingTimes[coupon._id] || 'Hesaplanır...'}</p>
                <p><strong>İstifadəsi:</strong> Hələ ki, istifadə edilməyib</p>
              </div>
            );
          })
        )}
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Passiv Kuponlar</h3>
        {passiveCoupons.length === 0 ? (
          <p className="text-gray-500">Hələ ki, passiv kupon yoxdur.</p>
        ) : (
          passiveCoupons.map(coupon => {
            const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
            return (
              <div key={coupon._id} className="border border-gray-400 rounded p-4 mb-4 shadow-sm bg-gray-50">
                <h4 className="font-semibold text-lg mb-1">{coupon.title}</h4>
                <p className="mb-2 text-gray-700">{coupon.description}</p>
                <p className="mb-2"><strong>Kod:</strong> <code className="bg-gray-100 px-1 rounded">{coupon.code}</code></p>
                <p className="mb-1">
                  <strong>Endirim:</strong> %{coupon.discount} <br />
                  <strong>Qiymət:</strong> {coupon.price} ₼ <br />
                  <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
                </p>
                <p className="mb-1"><strong>Alınma Tarixi:</strong> {formatDate(coupon.createdAt)}</p>
                <p className="mb-1"><strong>İstifadə Tarixi:</strong> {coupon.usedAt ? formatDate(coupon.usedAt) : '—'}</p>
                <p className="mb-1"><strong>Bitmə Tarixi:</strong> {formatDate(coupon.expiresAt)}</p>
                <p><strong>Qalan müddət:</strong> {coupon.usedAt ? 'İstifadə edildi' : 'Bitmiş'}</p>
              </div>
            );
          })
        )}
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Bütün Kuponlar (Alınma Tarixinə Görə)</h3>
        {allCoupons.length === 0 ? (
          <p className="text-gray-500">Kupon tapılmadı.</p>
        ) : (
          allCoupons.map(coupon => (
            <div key={coupon._id} className="border border-gray-300 rounded p-4 mb-4 shadow-sm bg-white">
              <h4 className="font-semibold text-lg mb-1">{coupon.title}</h4>
              <p className="mb-1"><strong>Alınma Tarixi:</strong> {formatDate(coupon.createdAt)}</p>
              <p className="mb-1"><strong>İstifadəsi:</strong> {coupon.usedAt ? `İstifadə edildi (${formatDate(coupon.usedAt)})` : 'Hələ ki, istifadə edilməyib'}</p>
              <p><strong>Qalan müddət:</strong> {coupon.usedAt ? 'İstifadə edildi' : getRemainingTime(coupon.expiresAt)}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default MyCoupons;