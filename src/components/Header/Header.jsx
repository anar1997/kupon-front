import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import irsad from '../images/irsad.svg';
import { FiSearch, FiBell, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Dummy auth state (əslində bunu context və ya redux ilə idarə edin)
  const isLoggedIn = true; // true: h-1.png, false: h-2.png
  const user = {
    name: "Anar Quliyev",
    balance: 150,
    notifications: 3,
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="xl:mx-24 sm:mx-10 mx-2 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-2">
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
        {/* Mobile: yalnız search icon */}
        <div className="md:hidden flex items-center justify-center">
          {!isSearchOpen ? (
            <button onClick={() => setIsSearchOpen(true)}>
              <FiSearch className="text-gray-400" size={20} />
            </button>
          ) : (
            <div className="flex items-center border border-[#FFF281] rounded-lg bg-[#FFFDED] px-1.5 py-1.5 w-full">
              <FiSearch className="text-gray-400 ml-2" size={20} />
              <input
                type="text"
                placeholder="Kupon və ya xidmət axtarın..."
                className="flex-1 text-xs bg-transparent outline-none px-3 py-1 text-gray-700"
                autoFocus
              />
              <button className="bg-[#FFF281] text-xs font-medium text-black rounded-md px-3 py-1.5" style={{ height: "28px" }}>
                Axtar
              </button>
              <button className="ml-2" onClick={() => setIsSearchOpen(false)}>
                &#10005;
              </button>
            </div>
          )}
        </div>
        {/* Sağ hissə */}
        <div className="flex items-center gap-3 justify-center md:justify-end flex-wrap">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <FiBell size={16} />
              </div>
              <FiHeart size={16} />
              <FiShoppingCart size={16} className="cursor-pointer" onClick={() => navigate("/my-cart")} />
              <FiUser size={16} className="cursor-pointer" onClick={() => navigate("/profile")} />
              <div className="flex flex-col items-start">
                <span className="font-medium text-xs text-gray-800">{user.name}</span>
                <span className="text-xs text-[#FAD800] font-semibold">{user.balance} AZN</span>
              </div>
              <button className="border text-xs border-gray-300 rounded-md px-2 py-1 bg-white hover:bg-gray-100 font-semibold">
                Çıxış
              </button>
            </>
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
