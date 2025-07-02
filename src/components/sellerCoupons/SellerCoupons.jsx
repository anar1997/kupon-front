import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SellerCoupons = () => {
    const [scanResult, setScanResult] = useState('');
    const [message, setMessage] = useState('');
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
        <div style={{ padding: '2rem' }}>
            <button
                onClick={() => navigate('/seller')}
                style={{
                    marginTop: '2rem',
                    marginRight: '1rem',
                    backgroundColor: '#444',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Skan səhifəsinə geri dön
            </button>
            <h2>Skan etdiyim kuponlar</h2>
            {usedCoupons.length === 0 ? (
                <p>Henüz kullandığınız kupon yok.</p>
            ) : (
                usedCoupons.map(coupon => {
                    const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
                    return (
                        <div key={coupon._id} style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
                            <h4>{coupon.title}</h4>
                            <p>{coupon.description}</p>
                            <p><strong>Kod:</strong> <code>{coupon.code}</code></p>
                            <p>
                                <strong>Endirim:</strong> %{coupon.discount} ₼ <br />
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
        </div>
    );
};

export default SellerCoupons;