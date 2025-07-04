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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Şifremi Unuttum</h2>

      {message && (
        <p className="mb-4 text-center text-green-600 font-medium">
          {message}
        </p>
      )}

      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
      >
        Şifre Sıfırlama Bağlantısı Gönder
      </button>
    </div>
  );
};

export default ForgotPassword; 