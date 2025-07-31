// components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Şirket Hakkında */}
        <div>
          <h3 className="text-lg font-bold mb-2">Biz Kimik?</h3>
          <p className="text-sm">
            Müştərilər üçün ən yaxşı xidmətləri təqdim etməyə çalışırıq. Etibarlı və sürətli həllər üçün buradayıq.
          </p>
        </div>

        {/* Navigasiya */}
        <div>
          <h3 className="text-lg font-bold mb-2">Menyular</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Ana Səhifə</a></li>
            <li><a href="#" className="hover:underline">Xidmətlər</a></li>
            <li><a href="#" className="hover:underline">Əlaqə</a></li>
            <li><a href="#" className="hover:underline">Haqqımızda</a></li>
          </ul>
        </div>

        {/* Əlaqə */}
        <div>
          <h3 className="text-lg font-bold mb-2">Əlaqə</h3>
          <p className="text-sm">Email: info@example.com</p>
          <p className="text-sm">Telefon: +994 50 123 45 67</p>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-bold mb-2">Bizi izləyin</h3>
          <div className="flex gap-4 mt-2">
            <a href="#"><FaFacebookF className="hover:text-blue-600" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="#"><FaTwitter className="hover:text-sky-500" /></a>
            <a href="#"><FaLinkedin className="hover:text-blue-700" /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t border-gray-100 py-4">
        © {new Date().getFullYear()} Kuponum.az
      </div>
    </footer>
  );
};

export default Footer;