import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CategoryManager from '../../components/categoryManager/CategoryManager';

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount: '',
    price: '',
    category: '' // ✅ kategori form state'e eklendi
  });
  const [categories, setCategories] = useState([]); // ✅ kategorileri tutmak için state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const fetchCoupons = async () => {
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data);
    } catch (error) {
      alert('Kuponlar alınamadı.');
    }
  };

  const fetchCategories = async () => { // ✅ kategorileri çek
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Kategoriler alınamadı:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCoupons();
      fetchCategories(); // ✅ token varsa kategorileri de getir
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculatePotentialSavings = (coupon) => {
    return (coupon.price * coupon.discount / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons/create', form); // ✅ category gönderiliyor
      setForm({ title: '', description: '', discount: '', price: '', category: '' }); // ✅ sıfırla
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Kupon oluşturulamadı');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kuponu silmek istediğinize emin misiniz?')) return;
    try {
      await API.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Kupon silinemedi');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.response?.data?.message || 'Giriş başarısız');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Admin Giriş</h2>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <button onClick={handleLogin}>Giriş Yap</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Panel</h2>
      <CategoryManager />

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Başlık"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Endirim (%)"
          value={form.discount}
          onChange={handleChange}
          required
          min="0"
          max="100"
        />
        <input
          type="number"
          name="price"
          placeholder="Fiyat (₼)"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
        />

        {/* ✅ Kategori Seçimi */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Kategori Seçin</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit">Kupon Əlavə et</button>
      </form>

      <h3>🔹 Satılmamış Kuponlar</h3>
      {coupons.filter(c => !c.isUsed).length === 0 ? (
        <p>Satılmamış kupon yok</p>
      ) : (
        <ul>
          {coupons
            .filter(c => !c.isUsed)
            .map((coupon) => (
              <li key={coupon._id}>
                <strong>{coupon.title}</strong> – %{coupon.discount} – {coupon.price} ₼ –
                Potensial Qazanc: {calculatePotentialSavings(coupon)} ₼
                <button onClick={() => handleDelete(coupon._id)} style={{ marginLeft: '1rem' }}>Sil</button>
              </li>
            ))}
        </ul>
      )}

      <h3 style={{ marginTop: '3rem' }}>✅ Satılan Kuponlar</h3>
      {coupons.filter(c => c.isUsed).length === 0 ? (
        <p>Henüz satılan kupon yok.</p>
      ) : (
        <ul>
          {coupons
            .filter(c => c.isUsed)
            .map((coupon) => (
              <li key={coupon._id} style={{ marginBottom: '1rem' }}>
                <strong>{coupon.title}</strong> – Kod: <code>{coupon.code}</code><br />
                Satın Alan: {coupon.buyerEmail} – Fiyat: {coupon.price} ₼<br />
                <p>
                  İndirim: %{coupon.discount}<br />
                  Potensial Qazanc: {calculatePotentialSavings(coupon)} ₼
                </p>
                <br />
                Tarix: {new Date(coupon.updatedAt).toLocaleString('tr-TR')}
              </li>
            ))}
        </ul>
      )}

      <button onClick={handleLogout} style={{ marginBottom: '2rem' }}>Çıkış Yap</button>
    </div>
  );
};

export default AdminPanel;
