import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const token = localStorage.getItem('customerToken');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;

  return (
    <div style={{ padding: '2rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '2rem',
          marginRight: '1rem',
          backgroundColor: '#444',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Əsas səhifə
      </button>
      <h2>Profil</h2>
      <p><strong>E-posta:</strong> {payload?.email}</p>
      <p><strong>Rol:</strong> {payload?.role}</p>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
};

export default Profile;