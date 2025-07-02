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
    <div style={{ padding: '2rem' }}>
      <h2>Müştəri Qeydiyyatı</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Adınız" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required />
        <input name="referralCode" placeholder="Davet Kodu (varsa)" value={form.referralCode} onChange={handleChange} />
        <button type="submit">Qeydiyyatdan keç</button>
      </form>
    </div>
  );
};

export default CustomerRegister;