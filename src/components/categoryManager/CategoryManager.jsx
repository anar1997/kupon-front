import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const CategoryManager = ({ onCategoryAdded }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('adminToken');

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setMessage('Kategoriler alınırken hata oluştu.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      return setMessage('Kategori adı boş olamaz.');
    }

    try {
      await API.post(
        '/categories',
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Kategoriya əlavə edildi!');
      setNewCategory({ name: '', description: '', icon: '' });
      fetchCategories();

      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Kategoriya əlavə edilmədi');
    }
  };

  return (
    <div className="mb-8 p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Kategoriya bölməsi</h3>

      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 mb-4">
        <input type="text" name="name" placeholder="Kategoriya adı" value={newCategory.name} onChange={handleChange}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="description" placeholder="Açıqlama (opsiyonel)" value={newCategory.description} onChange={handleChange}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="icon" placeholder="İkon URL (opsiyonel)" value={newCategory.icon} onChange={handleChange}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button onClick={handleAddCategory}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500" >
        Əlavə et
      </button>

      {message && <p className="mb-4 text-center text-sm text-green-600">{message}</p>}

      <h4 className="text-lg font-semibold mb-2">Mövcud Kategoriyalar</h4>
      <ul className="list-disc list-inside space-y-2 max-h-64 overflow-y-auto">
        {categories.length === 0 && <li className="text-gray-500">Kategoriya yoxdur</li>}
        {categories.map(cat => (
          <li key={cat._id} className="flex items-center space-x-2">
            {cat.icon && (
              <img src={cat.icon} alt={`${cat.name} ikon`} className="w-5 h-5 object-contain" loading="lazy"
              />
            )}
            <strong>{cat.name}</strong>
            {cat.description && <span className="text-gray-600"> – {cat.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;