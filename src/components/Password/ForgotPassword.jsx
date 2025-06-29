import React, { useState } from 'react';
import API from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'İşlem başarısız');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Şifremi Unuttum</h2>
      {message && <p>{message}</p>}
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Şifre Sıfırlama Bağlantısı Gönder</button>
    </div>
  );
};

export default ForgotPassword;
