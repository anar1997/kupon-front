import React, { useState } from 'react';
import API from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../redux/slices/sellerSlice';
import QrScanner from '../../components/qrScanner/QrScanner';
import { useNavigate } from 'react-router-dom';

const SellerPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {mode === 'login' ? 'Satıcı Giriş' : 'Satıcı Qeydiyyatı'}
        </h2>

        {mode === 'register' && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Adınız"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Şifrə"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {mode === 'login' ? (
          <>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              Daxil olun
            </button>
            <p className="mt-4 text-center text-gray-600">
              Hesabınız yoxdur?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-600 hover:underline"
              >
                Qeydiyyatdan keç
              </button>
            </p>
          </>
        ) : (
          <>
            <button onClick={handleRegister}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              Qeydiyyatdan keç
            </button>
            <p className="mt-4 text-center text-gray-600">
              hesabınız var?{' '}
              <button onClick={() => setMode('login')} className="text-blue-600 hover:underline"
              >
                Daxil olun
              </button>
            </p>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-red-600 whitespace-pre-wrap">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Kupon istifadə et</h2>

      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Kupon Kodu (örn: KUPON-XXXXXX)"
        className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleManualScan}
        disabled={!code.trim()}
        className={`w-full py-2 rounded font-semibold transition
          ${code.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 cursor-not-allowed text-gray-600'}
        `}
      >
        Kupon istifadə et
      </button>

      <hr className="my-6" />

      {!scanning ? (
        <button
          onClick={() => setScanning(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition"
        >
          📷 QR Kod Skan et
        </button>
      ) : (
        <div>
          <QrScanner onScan={handleQrScan} onError={handleQrError} />
          <button
            onClick={() => setScanning(false)}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition"
          >
            ❌ Scan ləğv
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-red-600 whitespace-pre-wrap">{message}</p>
      )}

      <button
        onClick={() => navigate('/seller-coupons')}
        className="mt-8 mr-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded cursor-pointer transition"
      >
        İstifadə olunan Kuponlarım
      </button>

      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded cursor-pointer transition"
      >
        Sistemdən çıx
      </button>
    </div>
  );
};

export default SellerPanel;
