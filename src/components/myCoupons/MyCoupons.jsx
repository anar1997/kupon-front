import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyCoupons = () => {
  const [stats, setStats] = useState({ totalCoupons: 0, totalSpent: 0, totalSaved: 0 });
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [passiveCoupons, setPassiveCoupons] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const calculateRemainingTime = (expiresAt) => {
    const now = new Date();
    const end = new Date(expiresAt);
    const diff = end - now;

    if (diff <= 0) return 'Süresi doldu';

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${days} gün ${hours} saat ${minutes} dəqiqə ${seconds} saniyə`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyCoupons = async () => {
      try {
        const res = await API.get('/coupons/my');
        setStats(res.data.stats);
        setActiveCoupons(res.data.activeCoupons);
        setPassiveCoupons(res.data.passiveCoupons);
        setAllCoupons(res.data.allCoupons);

        // Kalan süreleri başlat
        const initialTimes = {};
        res.data.activeCoupons.forEach(coupon => {
          initialTimes[coupon._id] = calculateRemainingTime(coupon.expiresAt);
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
        updatedTimes[coupon._id] = calculateRemainingTime(coupon.expiresAt);
      });
      setRemainingTimes(updatedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCoupons]);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('tr-TR') : '—';

  // Aktif kuponları bitiş tarihine göre sırala
  const sortedActiveCoupons = [...activeCoupons].sort(
    (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Aldığım Kuponlar</h2>

      <p><strong>Toplam Kupon:</strong> {stats.totalCoupons}</p>
      <p><strong>Toplam Xərc:</strong> {stats.totalSpent} ₼</p>
      <p><strong>Toplam Qazanc:</strong> {stats.totalSaved} ₼</p>

      <h3>Aktiv Kuponlar</h3>
      {sortedActiveCoupons.length === 0 ? (
        <p>Aktif kupon yok.</p>
      ) : (
        sortedActiveCoupons.map(coupon => {
          const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
          return (
            <div key={coupon._id} style={{ border: '1px solid green', padding: '1rem', marginBottom: '1rem' }}>
              <h4>{coupon.title}</h4>
              <p>{coupon.description}</p>
              <p><strong>Kod:</strong> <code>{coupon.code}</code></p>
              <p>
                <strong>Endirim:</strong> %{coupon.discount} <br />
                <strong>Qiymət:</strong> {coupon.price} ₼ <br />
                <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
              </p>
              <p><strong>Qalan vaxt:</strong> {remainingTimes[coupon._id] || 'Hesaplanıyor...'}</p>
              <p><strong>İstifadəsi:</strong> Hələ ki, istifadə edilməyib</p>
            </div>
          );
        })
      )}

      <h3>Passiv Kuponlar</h3>
      {passiveCoupons.length === 0 ? (
        <p>Hələ ki, passiv kupon yoxdur.</p>
      ) : (
        passiveCoupons.map(coupon => {
          const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
          return (
            <div key={coupon._id} style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
              <h4>{coupon.title}</h4>
              <p>{coupon.description}</p>
              <p><strong>Kod:</strong> <code>{coupon.code}</code></p>
              <p>
                <strong>Endirim:</strong> %{coupon.discount} <br />
                <strong>Qiymət:</strong> {coupon.price} ₼ <br />
                <strong>Potensial Qazanc:</strong> {potentialSavings} ₼
              </p>
              <p><strong>Alınma Tarixi:</strong> {formatDate(coupon.createdAt)}</p>
              <p><strong>İstifadə Tarixi:</strong> {coupon.usedAt ? formatDate(coupon.usedAt) : '—'}</p>
              <p><strong>Bitmə Tarixi:</strong> {formatDate(coupon.expiresAt)}</p>
            </div>
          );
        })
      )}

      <h3>Bütün Kuponlar (Alınma Tarixinə Görə)</h3>
      {allCoupons.length === 0 ? (
        <p>Heç bir kupon alınmayıb.</p>
      ) : (
        allCoupons.map(coupon => (
          <div key={coupon._id} style={{ border: '1px solid #aaa', padding: '1rem', marginBottom: '1rem' }}>
            <h4>{coupon.title}</h4>
            <p><strong>Alınma Tarixi:</strong> {formatDate(coupon.createdAt)}</p>
            <p><strong>İstifadəsi:</strong> {coupon.usedAt ? `İstifadə edildi (${formatDate(coupon.usedAt)})` : 'Hələ ki, istifadə edilməyib'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCoupons;