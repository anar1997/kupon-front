import React, { useState } from "react";
import "./AuthPage.css"; // CSS'i import ettik

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Mavi panelin sağa ve sola kayması için active state'i
  const toggleAuth = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className={`container ${!isLogin ? 'active' : ''}`}>
      {/* Login Box */}
      <div className="form-box login">
        <form action="#">
          <h1>Daxil ol</h1>
          <div className="input-box">
            <input type="text" placeholder="İstifadəçi adı" required />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Parol" required />
            <i className="bx bxs-lock-alt"></i>
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
      <div className="form-box register">
        <form action="#">
          <h1>Qeydiyyat</h1>
          <div className="input-box">
            <input type="text" placeholder="İstifadəçi adı" required />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Parol" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button className="btn">Qeydiyyatdan keç</button>
          <p>Digər sosial şəbəkə səhifələrimiz</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div>
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
