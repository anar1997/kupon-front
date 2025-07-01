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
    <div style={{ padding: '2rem' }}>
      <h2>Yeni Şifre Belirle</h2>
      {message && <p>{message}</p>}
      <input
        type="password"
        placeholder="Yeni Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Şifreyi Güncelle</button>
    </div>
  );
};

export default ResetPassword;