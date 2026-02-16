import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../../redux/slices/authSlice';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangePassword = () => {
    navigate('/profile/settings/change-password');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/auth');
    } catch {
      // logoutAsync already notifies on error
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl px-8 pt-5 flex flex-col gap-4">
        <div className="text-sm font-semibold">Hesab Tənzimləmələri</div>
        <button
          onClick={handleChangePassword}
          className="bg-white text-sm border rounded px-4 py-1 flex items-center gap-2 font-medium"
        >
          <span>⚙️</span> Şifrəni Dəyişdir
        </button>
      </div>

      <div className="bg-white rounded-2xl px-8 pt-5 flex flex-col gap-4">
        <div className="text-sm font-semibold">Hesab Hərəkətləri</div>
        <div className="bg-red-100 mb-12 rounded px-4 py-4">
          <div className="text-red-600 font-semibold text-sm mb-2">Diqqət</div>
          <div className="text-red-600 text-xs mb-4">Bu hərəkətlər geri qaytarıla bilməz</div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-xs text-white rounded px-4 py-2 font-medium flex items-center gap-2 w-full justify-center"
          >
            <span>↩️</span> Hesabdan Çıx
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
