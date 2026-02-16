import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordAsync, clearPasswordMessages } from '../../../redux/slices/changePasswordSlice';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import changePasswordValidation from './validation';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector((state) => state.changePassword);

  useEffect(() => {
    return () => {
      dispatch(clearPasswordMessages());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: changePasswordValidation,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const submitData = {
        old_password: values.old_password,
        new_password: values.new_password,
      };
      dispatch(changePasswordAsync(submitData))
        .unwrap()
        .then(() => {
          formik.resetForm();
        })
        .catch((err) => {
          console.error('Change password error:', err);
        });
    },
  });

  return (
    <div className="w-full px-24 my-8">
      <div className="w-full">
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{' '}
          <Link to="/profile" className="hover:underline">Profil</Link> &gt;{' '}
          <span className="font-semibold text-black">Şifrəni Dəyişdir</span>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-8">
        <h2 className="text-2xl font-bold mb-6">Şifrəni Dəyişdir</h2>

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Köhnə Şifrə *</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="old_password"
                value={formik.values.old_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••"
                className="w-full py-2 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowOldPassword((v) => !v)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="h-4">
              {formik.touched.old_password && formik.errors.old_password && (
                <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.old_password}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifrə *</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="new_password"
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••"
                className="w-full py-2 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowNewPassword((v) => !v)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="h-4">
              {formik.touched.new_password && formik.errors.new_password && (
                <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.new_password}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifrəni Təsdiqlə *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••"
                className="w-full py-2 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="h-4">
              {formik.touched.confirm_password && formik.errors.confirm_password && (
                <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.confirm_password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Dəyişdirilir...' : 'Şifrəni Dəyişdir'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
