import React, { useEffect, useState } from 'react'
import API from '../../services/api';

const CategoryManager = ({ onCategoryAdded }) => { // <-- onCategoryAdded prop'u eklendi
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('adminToken');

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

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            await API.post(
                '/categories',
                { name: newCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Kategoriya əlavə edildi!');
            setNewCategory('');
            fetchCategories();

            // Yeni kategori eklendiğini parent'a bildir
            if (onCategoryAdded) {
                onCategoryAdded();
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Kategoriya əlavə edilmədi');
        }
    };

    return (
        <div>
            <h3>Kategoriya bölməsi</h3>

            <input
                type="text"
                placeholder="Yeni kategoriya adı"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory}>Əlavə et</button>

            {message && <p>{message}</p>}

            <h4>Mövcud Kategoriyalar</h4>
            <ul>
                {categories.length === 0 && <li>Kategoriya yoxdur</li>}
                {categories.map(cat => (
                    <li key={cat._id}>{cat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;