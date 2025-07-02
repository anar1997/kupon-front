import React, { useState } from 'react';
import API from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../redux/slices/sellerSlice';
import QrScanner from '../../components/qrScanner/QrScanner';
import { useNavigate } from 'react-router-dom'; // ✅ yönlendirme için eklendi

const SellerPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ yönlendirme fonksiyonu
  const token = useSelector(state => state.seller.token);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [scanning, setScanning] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/seller-login', { email, password });
      dispatch(loginSuccess(res.data.token));
      setEmail('');
      setPassword('');
      setMessage('✅ Giriş tamamlandı');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Giriş baş tutmadı');
    }
  };

  const handleRegister = async () => {
    try {
      await API.post('/auth/seller-register', { name, email, password });
      setMessage('✅ Qeydiyyat tamamlandı. Artıq daxil ola bilərsiniz.');
      setMode('login');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Qeydiyyat baş tutmadı');
    }
  };

  const handleQrScan = async (scannedCode) => {
    setCode(scannedCode);
    setMessage(`📷 Skan edildi: ${scannedCode}, kupon doğrulanır...`);
    setScanning(false);

    try {
      const res = await API.post(`/coupons/use-coupon/${scannedCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(`✅ Kupon istifadə edildi: ${res.data.coupon.title}`);
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Kupon əməliyyatı baş tutmadı');
    }
  };

  const handleQrError = (error) => {
    console.warn('QR scan error:', error);
    setMessage(`🚫 Kamera əlaqəsi baş tutmadı: ${error}`);
    setScanning(false);
  };

  const handleManualScan = async () => {
    if (!code.trim()) {
      setMessage('🚫 Yanlışlıq var. Kupon kodunu doğru yazın.');
      return;
    }

    try {
      const res = await API.post(`/coupons/use-coupon/${code}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(`✅ Kupon istifadə edildi: ${res.data.coupon.title}`);
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Kupon əməliyyatı baş tutmadı');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!token) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>{mode === 'login' ? 'Satıcı Giriş' : 'Satıcı Qeydiyyatı'}</h2>

        {mode === 'register' && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Adınız"
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
        )}

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-posta"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Şifrə"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        />

        {mode === 'login' ? (
          <>
            <button onClick={handleLogin}>Daxil olun</button>
            <p style={{ marginTop: '1rem' }}>
              Hesabınız yoxdur?{' '}
              <button onClick={() => setMode('register')}>Qeydiyyatdan keç</button>
            </p>
          </>
        ) : (
          <>
            <button onClick={handleRegister}>Qeydiyyatdan keç</button>
            <p style={{ marginTop: '1rem' }}>
              hesabınız var?{' '}
              <button onClick={() => setMode('login')}>Daxil olun</button>
            </p>
          </>
        )}

        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Kupon istifadə et</h2>

      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Kupon Kodu (örn: KUPON-XXXXXX)"
        style={{ marginBottom: '0.5rem' }}
      />
      <br />
      <button onClick={handleManualScan} disabled={!code.trim()}>
        Kupon istifadə et
      </button>

      <hr style={{ margin: '1.5rem 0' }} />

      {!scanning ? (
        <button onClick={() => setScanning(true)}>📷 QR Kod Skan et</button>
      ) : (
        <div>
          <QrScanner onScan={handleQrScan} onError={handleQrError} />
          <button onClick={() => setScanning(false)} style={{ marginTop: '1rem' }}>
            ❌ Scan ləğv
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

      {/* ✅ Kullanılan Kuponlar Sayfası Butonu */}
      <button
        onClick={() => navigate('/seller-coupons')}
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
        İstifadə olunan Kuponlarım
      </button>

      {/* ✅ ÇIKIŞ YAP BUTONU */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: '2rem',
          backgroundColor: 'tomato',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Sistemdən çıx
      </button>
    </div>
  );
};

export default SellerPanel;
