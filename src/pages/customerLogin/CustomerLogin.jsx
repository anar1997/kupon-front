import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice';

const CustomerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        console.log('Gönderilen veriler:', { email, password });
        try {
            const res = await API.post('/auth/customer-login', { email, password });
            dispatch(loginSuccess(res.data.token)); // Redux'a token kaydet
            setMessage('Giriş başarılı!');
            navigate('/my-coupons');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Giriş mümkün olmadı');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Müştəri Giriş</h2>
            {message && <p>{message}</p>}
            <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button onClick={handleLogin}>Daxil olun</button>

            {/* ✅ Şifremi unuttum linki */}
            <p>
                <a href="/forgot-password">Şifrəni unutmusan?</a>
            </p>
        </div>
    );
};

export default CustomerLogin;