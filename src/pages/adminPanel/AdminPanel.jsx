import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CategoryManager from '../../components/categoryManager/CategoryManager';
import { getRemainingTime } from '../../utils/dateUtils';

const AdminPanel = () => {
  const [coupons, setCoupons] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount: '',
    price: '',
    category: '',
    expiresAt: ''
  });
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const fetchCoupons = async () => {
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data);
    } catch (error) {
      alert('Kuponlar alınmadı.');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Kategoriyalar alınmadı:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCoupons();
      fetchCategories();
    }
  }, [token]);

  // Kalan süreleri başlat ve her saniye güncelle
  useEffect(() => {
    if (coupons.length === 0) return;

    const initialTimes = {};
    coupons.forEach(coupon => {
      initialTimes[coupon._id] = getRemainingTime(coupon.expiresAt);
    });
    setRemainingTimes(initialTimes);

    const interval = setInterval(() => {
      const updatedTimes = {};
      coupons.forEach(coupon => {
        updatedTimes[coupon._id] = getRemainingTime(coupon.expiresAt);
      });
      setRemainingTimes(updatedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [coupons]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculatePotentialSavings = (coupon) => {
    return ((coupon.price * coupon.discount) / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons/create', form);
      setForm({ title: '', description: '', discount: '', price: '', category: '', expiresAt: '' });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Kupon oluşturulamadı');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kuponu silmək istədiyinizə əminsiniz?')) return;
    try {
      await API.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Kupon silinə bilmədi');
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
      alert(error.response?.data?.message || 'Giriş uğursuz oldu');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Giriş</h2>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input type="password" placeholder="Şifrə" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Daxil olun
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center">Admin Panel</h2>

      <CategoryManager onCategoryAdded={fetchCategories} />

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <input type="text" name="title" placeholder="Başlıq" value={form.title} onChange={handleChange} required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input type="text" name="description" placeholder="Açıqlama" value={form.description} onChange={handleChange} required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input type="number" name="discount" placeholder="Endirim (%)" value={form.discount} onChange={handleChange} required min="0" max="100"
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 sm:mb-0"
          />
          <input type="number" name="price" placeholder="Qiymət (₼)" value={form.price} onChange={handleChange} required min="0"
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} required
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 sm:mb-0"
          />
          <select name="category" value={form.category} onChange={handleChange} required
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Kategoriya Seçin</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.icon && '🖼️ '} {cat.name} {cat.description ? `– ${cat.description}` : ''}
              </option>
            ))}
          </select>
        </div>
        <button type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
        >
          Kupon Əlavə et
        </button>
      </form>

      <section>
        <h3 className="text-xl font-semibold mb-4">🔹 Satılmamış Kuponlar</h3>
        {coupons.filter(c => !c.isUsed).length === 0 ? (
          <p className="mb-6">Satılmamış kupon yoxdur</p>
        ) : (
          <ul className="space-y-4 mb-10">
            {coupons.filter(c => !c.isUsed).map((coupon) => (
              <li key={coupon._id} className="p-4 border rounded shadow-sm">
                <strong className="text-lg">{coupon.title}</strong> – %{coupon.discount} – {coupon.price} ₼ <br />
                Potensial Qazanc: {calculatePotentialSavings(coupon)} ₼<br />
                Son istifadə tarixi: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('tr-TR') : '—'}<br />
                Kalan müddət: {remainingTimes[coupon._id] || getRemainingTime(coupon.expiresAt)}
                <button onClick={() => handleDelete(coupon._id)}
                  className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition" >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">✅ Satılan Kuponlar</h3>
        {coupons.filter(c => c.isUsed).length === 0 ? (
          <p className="mb-6">Hələ ki, heç bir kupon satılmayıb.</p>
        ) : (
          <ul className="space-y-6">
            {coupons.filter(c => c.isUsed).map((coupon) => (
              <li key={coupon._id} className="p-4 border rounded shadow-sm">
                <strong className="text-lg">{coupon.title}</strong> – Kod: <code className="bg-gray-100 px-1 rounded">{coupon.code}</code><br />
                Satın Alan: {coupon.buyerEmail} – Qiymət: {coupon.price} ₼<br />
                <p className="mt-2">
                  Endirim: %{coupon.discount}<br />
                  Potensial Qazanc: {calculatePotentialSavings(coupon)} ₼<br />
                  Son istifadə tarixi: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('tr-TR') : '—'}<br />
                  Kalan müddət: {coupon.usedAt ? 'İstifadə edildi' : (remainingTimes[coupon._id] || getRemainingTime(coupon.expiresAt))}
                </p>
                Tarix: {new Date(coupon.updatedAt).toLocaleString('tr-TR')}
              </li>
            ))}
          </ul>
        )}
      </section>

      <button onClick={handleLogout}
        className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
      >
        Sistemdən çıxın
      </button>
    </div>
  );
};

export default AdminPanel;
