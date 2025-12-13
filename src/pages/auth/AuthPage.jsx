import React, { useEffect, useState } from "react";
import "./AuthPage.css"; // CSS'i import ettik
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaRegEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthMessages, postLoginAsync, postRegisterAsync } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { getRegionsAsync } from "../../redux/slices/regionSlice";
import validations from "./validation";
import loginValidations from "./loginValidation";
import { message } from "antd";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regions = useSelector(state => state.region.regions);
  console.log(regions);
  const { error, successMsg, isLoading } = useSelector(state => state.auth);
  console.log(error);

  useEffect(() => {
    dispatch(getRegionsAsync());
  }, [dispatch]);


  // Success və Error mesajlarını göstər
  useEffect(() => {
    if (successMsg) {
      message.success(successMsg);
      dispatch(clearAuthMessages());
    }
    if (error) {
      message.error(error)
      dispatch(clearAuthMessages());
    }
  }, [successMsg, error, dispatch]);

  // Mesajları temizle
  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: loginValidations,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      dispatch(postLoginAsync(values))
        .unwrap()
        .then(() => {
          navigate("/");
          window.location.reload();
        })
        .catch(err => console.error("Login error:", err));
    }
  })

  const formikReg = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      region: "",
      password: "",
      password_confirm: "",
      referred_by_code: ""
    },
    validationSchema: validations,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const submitData = { ...values };
      if (!submitData.referred_by_code || submitData.referred_by_code.trim() === '') {
        delete submitData.referred_by_code;
      }

      dispatch(postRegisterAsync(submitData))
        .unwrap()
        .then(() => {
          setIsLogin(true);
          formikReg.resetForm();
        })
        .catch(err => console.error("Registration error:", err));
    },
  })

  // Mavi panelin sağa ve sola kayması için active state'i
  const toggleAuth = () => {
    setIsLogin((prevState) => !prevState);
    dispatch(clearAuthMessages());
    formik.resetForm();
    formikReg.resetForm();
  };

  return (
    <div className={`container ${!isLogin ? 'active' : ''}`}>
      {/* Login Box */}
      <div className="form-box login">
        <form action="#" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-center justify-center mb-6">
            <h1>Xoş gəlmisiniz!</h1>
            <p className="text-gray-500">Hesabınıza daxil olun</p>

            {/* Başarı mesajı */}
            {successMsg && !isLogin && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded px-4 py-3 text-green-700 text-sm">
                {successMsg}
              </div>
            )}

            {/* Hata mesajı - Login */}
            {error && isLogin && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded px-4 py-3 text-red-600 text-xs">
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </div>
            )}

          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-700 text-left">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // error={formik.errors.email}
                value={formik.values.email}
                required
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaEnvelope className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
            <div className="h-4">
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.email}</p>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrə</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.password}
                value={formik.values.password}
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
            <div className="h-4">
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.password}</p>
              )}
            </div>
          </div>
          <div className="forgot-link">
            <a href="#">Parolu unutmusunuz?</a>
          </div>
          <button className="btn transition disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isLoading}>
            {isLoading ? "Daxil olunur..." : "Daxil ol"}
          </button>
          <p className="mt-3 text-[11px] text-center text-gray-500">
            və ya&nbsp;
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              Ana səhifəyə qayıt
            </button>
          </p>
          {/* <p>Digər sosial şəbəkə səhifələrimiz</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
            <a href="#"><i className="bx bxl-facebook"></i></a>
            <a href="#"><i className="bx bxl-github"></i></a>
            <a href="#"><i className="bx bxl-linkedin"></i></a>
          </div> */}
        </form>
      </div>

      {/* Register Box */}
      <div className="form-box register flex items-center justify-center">
        <form onSubmit={formikReg.handleSubmit} className="w-full max-w-xs mx-auto bg-white">
          <h1 className="text-lg font-bold mb-4 text-center">Qeydiyyat</h1>

          {/* Başarı mesajı */}
          {successMsg && !isLogin && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded px-4 py-3 text-green-700 text-sm">
              {successMsg}
            </div>
          )}

          {/* Hata mesajı - Register */}
          {error && !isLogin && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded px-4 py-3 text-red-600 text-sm">
              {typeof error === 'object' ? JSON.stringify(error) : error}
            </div>
          )}
          <div className="flex gap-2 mb-2 mt-10">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 text-left">Ad</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Adınız"
                  id="first_name"
                  name="first_name"
                  onChange={formikReg.handleChange}
                  onBlur={formikReg.handleBlur}
                  // error={formikReg.errors.first_name}
                  value={formikReg.values.first_name}
                  className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
                />
                <FaUser className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              </div>
              {formikReg.touched.first_name && formikReg.errors.first_name && (
                <p className="text-red-500 text-[10px] mt-1">{formikReg.errors.first_name}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700 text-left">Soyad</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Soyadınız"
                  id="last_name"
                  name="last_name"
                  onChange={formikReg.handleChange}
                  onBlur={formikReg.handleBlur}
                  // error={formikReg.errors.last_name}
                  value={formikReg.values.last_name}
                  className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
                />
                <FaUser className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
              </div>
              {formikReg.touched.last_name && formikReg.errors.last_name && (
                <p className="text-red-500 text-[10px] mt-0.5">{formikReg.errors.last_name}</p>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-700 text-left">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                id="email"
                name="email"
                onChange={formikReg.handleChange}
                onBlur={formikReg.handleBlur}
                // error={formikReg.errors.email}
                value={formikReg.values.email}
                required
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaEnvelope className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
            {formikReg.touched.email && formikReg.errors.email && (
              <p className="text-red-500 text-[10px] mt-1">{formikReg.errors.email}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Telefon (istəyə bağlı)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="+994 50 123 45 67"
                id="phone"
                name="phone"
                onChange={formikReg.handleChange}
                onBlur={formikReg.handleBlur}
                error={formikReg.errors.phone}
                value={formikReg.values.phone}
                className="w-full py-1.5 pl-8 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
              />
              <FaPhone className="absolute left-2 top-1/2 -translate-y-1/2 text-base text-gray-400" />
            </div>
          </div>
          <div className="mb-3">
            <select
              id="region"
              name="region"
              onChange={formikReg.handleChange}
              onBlur={formikReg.handleBlur}
              // error={formikReg.errors.region}
              value={formikReg.values.region}
              required
              className="w-full py-1.5 pl-2 pr-2 rounded bg-gray-100 text-sm border-none outline-none"
            >
              <option className="text-slate-500" value="" label="Region seçin" />
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            {formikReg.touched.region && formikReg.errors.region && (
              <p className="text-red-500 text-[10px] mt-1">{formikReg.errors.region}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrə</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                id="password"
                name="password"
                onChange={formikReg.handleChange}
                onBlur={formikReg.handleBlur}
                // error={formikReg.errors.password}
                value={formikReg.values.password}
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
            {formikReg.touched.password && formikReg.errors.password && (
              <p className="text-red-500 text-[10px] mt-1">{formikReg.errors.password}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Şifrəni Təkrarla</label>
            <div className="relative">
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="••••••"
                id="password_confirm"
                name="password_confirm"
                onChange={formikReg.handleChange}
                onBlur={formikReg.handleBlur}
                // error={formikReg.errors.password_confirm}
                value={formikReg.values.password_confirm}
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
            {formikReg.touched.password_confirm && formikReg.errors.password_confirm && (
              <p className="text-red-500 text-[10px] mt-1">{formikReg.errors.password_confirm}</p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 text-left">Referal Kod (istəyə bağlı)</label>
            <input
              type="text"
              placeholder="FRIEND2024"
              id="referred_by_code"
              name="referred_by_code"
              onChange={formikReg.handleChange}
              onBlur={formikReg.handleBlur}
              error={formikReg.errors.referred_by_code}
              value={formikReg.values.referred_by_code}
              className="w-full py-1.5 pl-4 pr-2 rounded bg-gray-100 text-sm border-none outline-none text-gray-400"
            />
          </div>
          <button type="submit" className="w-full h-10 bg-[#ffcc00] rounded font-semibold text-sm text-black mt-4 transition hover:bg-yellow-400">
            Qeydiyyatdan keç
          </button>
          <p className="mt-3 text-[11px] text-center text-gray-500">
            və ya&nbsp;
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              Ana səhifəyə qayıt
            </button>
          </p>
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
