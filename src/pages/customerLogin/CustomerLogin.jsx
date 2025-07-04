import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    console.log('Gönderilen veriler:', { email, password });
    try {
      const res = await API.post('/auth/customer-login', { email, password });
      dispatch(loginSuccess(res.data.token)); // Redux'a token kaydet
      setMessage('Giriş başarılı!');
      navigate('/my-coupons');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Giriş mümkün olmadı');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Müştəri Giriş</h2>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes('başarılı') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="password"
        placeholder="Şifrə"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        Daxil olun
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        <a href="/forgot-password" className="text-indigo-600 hover:underline">
          Şifrəni unutmusan?
        </a>
      </p>
    </div>
  );
};

export default CustomerLogin;
