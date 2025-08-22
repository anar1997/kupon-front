import React, { useState } from 'react'

const initialData = {
  name: 'Anar',
  surname: 'Quliyev',
  email: 'abbasquliyev111@gmail.com',
  phone: '+994 50 123 45 67'
}

const ProfileAbout = () => {
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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6 relative">
      <div className="text-base font-semibold mb-1">Şəxsi Məlumatlar</div>
      {!edit ? (
        <button
          className="absolute top-8 right-8 bg-gray-100 border border-gray-300 rounded px-4 py-1 text-sm font-medium"
          onClick={() => setEdit(true)}
        >
          Düzəlt
        </button>
      ) : (
        <button
          className="absolute top-8 right-8 bg-gray-100 hover:bg-[#FFF9C4] border border-gray-300 rounded px-4 py-1 text-sm font-medium"
          onClick={handleSave}
        >
          Saxla
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium mb-2">Ad</label>
          <input
            type="text"
            name="name"
            value={form.name}
            disabled={!edit}
            onChange={handleChange}
            className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">Soyad</label>
          <input
            type="text"
            name="surname"
            value={form.surname}
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
          value={form.email}
          disabled={!edit}
          onChange={handleChange}
          className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`}/>
      </div>
      <div>
        <label className="block text-xs font-medium mb-2">Telefon</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          disabled={!edit}
          onChange={handleChange}
          className={`w-full border border-gray-200 rounded px-4 py-1 text-xs 
  ${edit ? 'bg-white text-black' : 'bg-gray-50 text-gray-400'}`}/>
      </div>
      {edit && (
        <div className="flex gap-4 mt-4">
          <button
            className="bg-[#FFF283] text-black text-xs rounded px-3 py-2 font-medium"
            onClick={handleSave}
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
    </div>
  )
}

export default ProfileAbout