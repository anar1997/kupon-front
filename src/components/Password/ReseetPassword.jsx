import React, { useState } from 'react';
import API from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Şifre sıfırlama başarısız');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Yeni Şifre Belirle</h2>

      {message && (
        <p className="mb-4 text-center text-green-600 font-medium">
          {message}
        </p>
      )}

      <input type="password" placeholder="Yeni Şifre" value={password} onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button onClick={handleReset}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
      >
        Şifreyi Güncelle
      </button>
    </div>
  );
};

export default ResetPassword;