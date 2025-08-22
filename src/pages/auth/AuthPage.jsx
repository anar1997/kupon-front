import React, { useState } from "react";
import "./AuthPage.css"; // CSS'i import ettik
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaRegEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Mavi panelin sağa ve sola kayması için active state'i
  const toggleAuth = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className={`container ${!isLogin ? 'active' : ''}`}>
      {/* Login Box */}
      <div className="form-box login">
        <form action="#">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1>Xoş gəlmisiniz!</h1>
            <p className="text-gray-500">Hesabınıza daxil olun</p>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-700 text-left">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaEnvelope className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrə</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                required
                autoComplete="new-password"
                className="w-full py-1.5 pl-8 pr-8 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaLock className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="forgot-link">
            <a href="#">Parolu unutmusunuz?</a>
          </div>
          <button className="btn" type="submit">
            Daxil ol
          </button>
          <p>Digər sosial şəbəkə səhifələrimiz</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
        </form>
      </div>

      {/* Register Box */}
      <div className="form-box register flex items-center justify-center">
        <form className="w-full max-w-xs mx-auto bg-white" action="#">
          <h1 className="text-lg font-bold mb-4 text-center">Qeydiyyat</h1>
          <div className="flex gap-2 mb-2 mt-10">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 text-left">Ad</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Adınız"
                  required
                  className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
                />
                <FaUser className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 text-left">Soyad</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Soyadınız"
                  required
                  className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
                />
                <FaUser className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaEnvelope className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Telefon (istəyə bağlı)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="+994 50 123 45 67"
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaPhone className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrə</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                required
                autoComplete="new-password"
                className="w-full py-1.5 pl-8 pr-8 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaLock className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrəni Təkrarla</label>
            <div className="relative">
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="••••••"
                required
                autoComplete="new-password"
                className="w-full py-1.5 pl-8 pr-8 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaLock className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base text-gray-400 cursor-pointer"
                onClick={() => setShowRepeatPassword((v) => !v)}
              >
                {showRepeatPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Referal Kod (istəyə bağlı)</label>
            <input
              type="text"
              placeholder="FRIEND2024"
              className="w-full py-1.5 pl-4 pr-2 rounded bg-gray-100 text-sm border-none outline-none text-gray-400"
            />
          </div>
          <button className="w-full h-10 bg-[#ffcc00] rounded font-semibold text-sm text-black mt-4 transition hover:bg-yellow-400">
            Qeydiyyatdan keç
          </button>
        </form>
      </div>

      {/* Toggle Box */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Xoş gəlmisiniz!</h1>
          <p>Hesabınız yoxdur?</p>
          <button className="btn register-btn" onClick={toggleAuth}>Qeydiyyatdan keçin</button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Xoş gəlmisiniz!</h1>
          <p>artıq hesabınız var?</p>
          <button className="btn login-btn" onClick={toggleAuth}>Daxil ol</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
