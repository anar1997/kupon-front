import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import irsad from '../images/irsad.svg';
import { FiSearch, FiBell, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getMeAsync } from '../../redux/slices/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const me = useSelector(state => state.auth.me)
  // Dummy auth state (əslində bunu context və ya redux ilə idarə edin)
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const user = {
    name: `${me.first_name} ${me.last_name}`,
    balance: 150,
    notifications: 3,
  };

  const logout = () => {
    // Çıxış funksiyası
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate("/auth");
  }

  useEffect(() => {
    dispatch(getMeAsync());
  }, []);

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="xl:mx-24 sm:mx-10 mx-6 border-t border-gray-200 flex flex-col sm:flex-row md:items-center justify-between md:justify-between gap-2 py-2">
        {/* Logo ve Proje Adı */}
        <div className="flex items-center gap-2 py-2 justify-center md:justify-start">
          <Link
            to="/"
            className="text-lg md:text-xl font-bold text-[#FAD800]"
          >
            kuponum.az
          </Link>
        </div>
        {/* Arama Bölümü */}
        <div className="flex-grow max-w-lg hidden md:block">
          <div className="flex items-center border border-[#FFF281] rounded-lg bg-[#FFFDED] px-1.5 py-1.5">
            <FiSearch className="text-gray-400 ml-2" size={20} />
            <input
              type="text"
              placeholder="Kupon və ya xidmət axtarın..."
              className="flex-1 text-xs bg-transparent outline-none px-3 py-1 text-gray-700"
            />
            <button className="bg-[#FAD800] text-xs font-medium text-black rounded-md px-3 py-1.5" style={{ height: "28px" }}>
              Axtar
            </button>
          </div>
        </div>

        {/* Sağ hissə */}
        <div className="flex items-center gap-3 md:justify-end flex-wrap">
          {isLoggedIn ? (
            <div className="flex justify-between w-full gap-2">
              <div className='flex items-center gap-2'>
                <div className="relative">
                  <FiBell size={16} />
                </div>
                <FiHeart size={16} />
                <FiShoppingCart size={16} className="cursor-pointer" onClick={() => navigate("/my-cart")} />
                <FiUser size={16} className="cursor-pointer" onClick={() => navigate("/profile")} />
              </div>
              <div className='flex gap-2'>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-xs text-gray-800">{user.name}</span>
                  <span className="text-xs text-[#FAD800] font-semibold">{user.balance} AZN</span>
                </div>
                <button onClick={() => logout()} className="border text-xs items-center border-gray-300 rounded-md px-2 py-1 bg-white hover:bg-gray-100 font-semibold">
                  Çıxış
                </button>
              </div>
            </div>
          ) : (
            <>
              <FiHeart size={16} />
              <FiShoppingCart size={16} />
              <Link
                to="/auth"
                className="bg-[#FFEB70] hover:bg-[#FFCC00] text-black text-xs px-2 py-1 rounded-md font-semibold transition"
              >
                Daxil ol
              </Link>
            </>
          )}
        </div>
      </div>

    </header>
  );
}

export default Header;
