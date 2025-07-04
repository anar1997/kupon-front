import React, { useState } from 'react';
import API from '../../services/api'; // axios instance

const CustomerRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/customer-register', form);
      setMessage('Qeydiyyat tamamlandı! Daxil ola bilərsiniz.');
      setForm({ name: '', email: '', password: '', referralCode: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Qeydiyyat baş tutmadı');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Müştəri Qeydiyyatı</h2>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes('tamamlandı') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="name"
          placeholder="Adınız"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="referralCode"
          placeholder="Davet Kodu (varsa)"
          value={form.referralCode}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Qeydiyyatdan keç
        </button>
      </form>
    </div>
  );
};

export default CustomerRegister;
