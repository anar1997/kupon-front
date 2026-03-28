import React from "react";
import TikTok from '../images/newFolder/Tik-Tok.jpg';
import Nstagram from '../images/newFolder/Nstagram.jpg';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const { phone, email, instagram_url, tiktok_url, facebook_url } = useSelector(state => state.siteSettings);

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl xl:mx-24 sm:mx-10 mx-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo ve Açıklama */}
        <div>
          <div className="flex items-center mb-2">
            <span className="bg-yellow-300 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3">K</span>
            <div>
              <div className="font-bold text-xl text-yellow-400">Kuponum</div>
              <div className="text-xs font-thin text-gray-500">Bakının ən yaxşı kuponları</div>
            </div>
          </div>
          <p className="text-sm font-thin mt-2 mb-4 text-gray-500">
            Bakı şəhərinin ən yaxşı kupon və endirimlərini bir araya gətirən platform. Minlərlə müəssisədən ən sərfəli təklifləri tapın.
          </p>
          <div className="flex gap-1">
            {tiktok_url
              ? <a href={tiktok_url} target="_blank" rel="noreferrer"><img src={TikTok} className="w-8 h-8" alt="TikTok" /></a>
              : <Link to="#"><img src={TikTok} className="w-8 h-8" alt="TikTok" /></Link>
            }
            {instagram_url
              ? <a href={instagram_url} target="_blank" rel="noreferrer"><img src={Nstagram} className="w-8 h-8" alt="Instagram" /></a>
              : <Link to="#"><img src={Nstagram} className="w-8 h-8" alt="Instagram" /></Link>
            }
            {facebook_url
              ? <a href={facebook_url} target="_blank" rel="noreferrer"><img src={TikTok} className="w-8 h-8" alt="Facebook" /></a>
              : null
            }
          </div>
        </div>
        {/* Kateqoriyalar */}
        <div>
          <h3 className="font-bold text-sm mb-4">Kateqoriyalar</h3>
          <ul className="space-y-2 text-sm  font-thin text-gray-500">
            <li>Sağlamlıq</li>
            <li>Gözəllik</li>
            <li>Yemək</li>
            <li>Əyləncə</li>
            <li>Alış-veriş</li>
            <li>Təhsil</li>
          </ul>
        </div>
        {/* Şirkət */}
        <div>
          <h3 className="font-bold text-sm mb-4">Şirkət</h3>
          <ul className="space-y-2 text-sm font-thin text-gray-500">
            <li><Link to="/about" className="hover:underline">Haqqımızda</Link></li>
            <li>Karyera</li>
            <li>Tərəfdaşlar</li>
            <li><Link to="/connection" className="hover:underline">Əlaqə</Link></li>
            <li>Blog</li>
            <li>Press</li>
          </ul>
        </div>
        {/* Dəstək */}
        <div>
          <h3 className="font-bold text-sm mb-4">Dəstək</h3>
          <ul className="space-y-2 text-sm font-thin mb-5 text-gray-500">
            <li>Yardım Mərkəzi</li>
            <li>FAQ</li>
            <li><Link to="/terms" className="hover:underline">İstifadə Şərtləri</Link></li>
            <li>Məxfilik Siyasəti</li>
            <li>Geri Qaytarma</li>
          </ul>
          <div className="font-bold text-sm mb-3">Müştəri Xidməti</div>
          {phone && <div className="text-sm text-gray-500 font-thin">{phone}</div>}
          {email && <div className="text-sm text-gray-500 font-thin">{email}</div>}
        </div>
      </div>
      <div className="border-t border-gray-300 mx-24 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© 2024 Kuponum. Bütün hüquqlar qorunur.</div>
          <div className="flex gap-6 mt-2 md:mt-0">
            <Link to="/rules">Qaydalar</Link>
            <Link to="/terms">Şərtlər</Link>
            <Link to="/cookie-policy">Cookie Siyasəti</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
