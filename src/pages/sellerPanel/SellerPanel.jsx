import React, { useState } from 'react';
import API from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../redux/slices/sellerSlice';
import QrScanner from '../../components/qrScanner/QrScanner';

const SellerPanel = () => {
  const dispatch = useDispatch();
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
      setMessage('✅ Giriş başarılı');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Giriş başarısız');
    }
  };

  const handleRegister = async () => {
    try {
      await API.post('/auth/seller-register', { name, email, password });
      setMessage('✅ Kayıt başarılı. Şimdi giriş yapabilirsiniz.');
      setMode('login');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Kayıt başarısız');
    }
  };

  const handleQrScan = async (scannedCode) => {
    setCode(scannedCode);
    setMessage(`📷 Tarandı: ${scannedCode}, kupon doğrulanıyor...`);
    setScanning(false);

    try {
      const res = await API.post(`/coupons/use-coupon/${scannedCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(`✅ Kupon kullanıldı: ${res.data.coupon.title}`);
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Kupon işlemi başarısız');
    }
  };

  const handleQrError = (error) => {
    console.warn('QR scan error:', error);
    setMessage(`🚫 Kamera erişimi başarısız: ${error}`);
    setScanning(false);
  };

  const handleManualScan = async () => {
    if (!code.trim()) {
      setMessage('🚫 Lütfen geçerli bir kupon kodu girin.');
      return;
    }

    try {
      const res = await API.post(`/coupons/use-coupon/${code}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage(`✅ Kupon kullanıldı: ${res.data.coupon.title}`);
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || '🚫 Kupon işlemi başarısız');
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>{mode === 'login' ? 'Satıcı Giriş' : 'Satıcı Kayıt'}</h2>

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
          placeholder="Şifre"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        />

        {mode === 'login' ? (
          <>
            <button onClick={handleLogin}>Giriş Yap</button>
            <p style={{ marginTop: '1rem' }}>
              Hesabınız yok mu?{' '}
              <button onClick={() => setMode('register')}>Kayıt Ol</button>
            </p>
          </>
        ) : (
          <>
            <button onClick={handleRegister}>Kayıt Ol</button>
            <p style={{ marginTop: '1rem' }}>
              Zaten hesabınız var mı?{' '}
              <button onClick={() => setMode('login')}>Giriş Yap</button>
            </p>
          </>
        )}

        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Kupon Kullan</h2>

      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Kupon Kodu (örn: KUPON-XXXXXX)"
        style={{ marginBottom: '0.5rem' }}
      />
      <br />
      <button onClick={handleManualScan} disabled={!code.trim()}>Kuponu Kullan</button>

      <hr style={{ margin: '1.5rem 0' }} />

      {!scanning ? (
        <button onClick={() => setScanning(true)}>📷 QR Kod Tara</button>
      ) : (
        <div>
          <QrScanner onScan={handleQrScan} onError={handleQrError} />
          <button onClick={() => setScanning(false)} style={{ marginTop: '1rem' }}>
            ❌ Tarama İptal
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default SellerPanel;
