import React, { useEffect, useState } from 'react'
import API from '../../services/api';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [message, setMessage] = useState('');

    // ✅ Token'ı doğrudan localStorage'tan al (adminToken olarak)
    const token = localStorage.getItem('adminToken');

    // Kategorileri çek
    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories');
            setCategories(res.data);
        } catch (err) {
            setMessage('Kategori alınırken hata oluştu.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Yeni kategori ekle
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            await API.post(
                '/categories',
                { name: newCategory },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Admin token eklendi
            );
            setMessage('Kategori eklendi!');
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Kategori eklenemedi');
        }
    };

    return (
        <div>
            <h3>Kategori Yönetimi</h3>

            <input
                type="text"
                placeholder="Yeni kategori adı"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>Ekle</button>

            {message && <p>{message}</p>}

            <h4>Mevcut Kategoriler</h4>
            <ul>
                {categories.length === 0 && <li>Kategori yok</li>}
                {categories.map(cat => (
                    <li key={cat._id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;