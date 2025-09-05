import { useFormik } from 'formik';
import React, { use, useEffect, useState } from 'react'
import { getMeAsync, putMeAsync } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const initialData = {
  name: 'Anar',
  surname: 'Quliyev',
  email: 'abbasquliyev111@gmail.com',
  phone: '+994 50 123 45 67'
}

const ProfileAbout = () => {
  const dispatch = useDispatch();
  const me = useSelector(state => state.auth.me)

  useEffect(() => {
    dispatch(getMeAsync());
  }, []);

  const formik = useFormik({
    initialValues: {
      name: me?.first_name,
      surname: me?.last_name,
      email: me?.email,
      phone: me?.phone,
      id: me?.id
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(putMeAsync(values))
    }
  })
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(initialData)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    setForm(initialData)
    setEdit(false)
  }

  const handleSave = () => {
    // Burada API isteği ile güncelleme yapılabilir
    setEdit(false)
  }

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6 relative">
      <div className='flex flex-col 418:flex-row justify-between gap-4'>
        <div className="text-base font-semibold mb-1">Şəxsi Məlumatlar</div>
        {!edit ? (
          <button
            className="bg-gray-100 border border-gray-300 rounded px-4 py-1 text-sm font-medium"
            onClick={() => setEdit(true)}
          >
            Düzəlt
          </button>
        ) : (
          <button
            className="bg-gray-100 hover:bg-[#FFF9C4] border border-gray-300 rounded px-4 py-1 text-sm font-medium"
            type='submit'
          >
            Saxla
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium mb-2">Ad</label>
          <input
            type="text"
            name="name"
            id='name'
            value={formik.values.name}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            disabled={!edit}
            onChange={formik.handleChange}
            className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">Soyad</label>
          <input
            type="text"
            name="surname"
            id='surname'
            value={formik.values.surname}
            onBlur={formik.handleBlur}
            error={formik.errors.surname}
            disabled={!edit}
            onChange={handleChange}
            className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          id='email'
          value={formik.values.email}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          disabled={!edit}
          onChange={handleChange}
          className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-2">Telefon</label>
        <input
          type="text"
          name="phone"
          id='phone'
          value={formik.values.phone}
          onBlur={formik.handleBlur}
          error={formik.errors.phone}
          disabled={!edit}
          onChange={handleChange}
          className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`} />
      </div>
      {edit && (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-[#FFF283] text-black text-xs rounded px-3 py-2 font-medium"
            type='submit'
          >
            Saxla
          </button>
          <button
            className="bg-white border rounded text-xs px-3  py-2 hover:bg-[#FFF9C4] font-medium"
            onClick={handleCancel}
          >
            Ləğv et
          </button>
        </div>
      )}
    </form>
  )
}

export default ProfileAbout