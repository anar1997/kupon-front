import React from 'react'

const Tenzim = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Hesab Tənzimləmələri */}
      <div className="bg-white rounded-2xl px-8 pt-5 flex flex-col gap-4">
        <div className="text-sm font-semibold">Hesab Tənzimləmələri</div>
        <button className="bg-white text-sm border rounded px-4 py-1 flex items-center gap-2 font-medium">
          <span>⚙️</span> Şifrəni Dəyişdir
        </button>
        <button className="bg-white text-sm border rounded px-4 py-1 flex items-center gap-2 font-medium">
          <span>🔔</span> Bildiriş Tənzimləmələri
        </button>
        <button className="bg-white text-sm border rounded px-4 py-1 flex items-center gap-2 font-medium">
          <span>❤️</span> Sevimlilər
        </button>
        <button className="bg-white text-sm border rounded px-4 py-1 mb-5 flex items-center gap-2 font-medium">
          <span>💬</span> Dəstək və Yardım
        </button>
      </div>
      {/* Hesab Hərəkətləri */}
      <div className="bg-white rounded-2xl px-8 pt-5 flex flex-col gap-4">
        <div className="text-sm font-semibold">Hesab Hərəkətləri</div>
        <div className="bg-red-100 mb-12 rounded px-4 py-4">
          <div className="text-red-600 font-semibold text-sm mb-2">Diqqət</div>
          <div className="text-red-600 text-xs mb-4">Bu hərəkətlər geri qaytarıla bilməz</div>
          <button className="bg-red-600 text-xs text-white rounded px-4 py-2 font-medium flex items-center gap-2 w-full justify-center">
            <span>↩️</span> Hesabdan Çıx
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tenzim