import React from 'react';
import { Link } from "react-router-dom";
import irsad from '../images/irsad.svg';

function Header() {
  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="w-full max-w-full mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        {/* Logo ve Proje Adı */}
        <div className="flex items-center gap-2 py-6">
          {/* <img
            src=''
            alt=""
            className="h-12 w-12 md:h-16 md:w-16 object-contain"
          /> */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-gray-800"
          >
            kuponum.az
          </Link>
        </div>

        {/* Login Butonu */}
        <div>
          <Link to='/profile'
            className="bg-slate-100 hover:bg-slate-400 text-black px-3 py-2 rounded-md text-sm md:text-base transition">
            Profilim
          </Link>
          <Link
            to="/auth"
            className="bg-slate-100 hover:bg-slate-400 text-black px-3 py-2 rounded-md text-sm md:text-base transition"
          >
            Daxil ol
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
