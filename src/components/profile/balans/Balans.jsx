import React from 'react'
import { useNavigate } from 'react-router-dom';

const Balans = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Balans Məlumatları */}
      <div className="bg-gradient-to-br from-[#F9F9F3] to-[#F8F8EF] rounded-2xl px-8 py-4 flex flex-col gap-3">
        <div className="text-sm font-normal mb-4">Balans Məlumatları</div>
        <div className="text-center mb-4 border-b-2 pb-7">
          <div className="text-4xl font-bold flex items-center justify-center gap-2">
            150 <span className="text-2xl">₼</span>
          </div>
          <div className="text-gray-500 text-sm mt-2">Mövcud Balans</div>
        </div>
        <button onClick={() => navigate('/increase-balans')} className="bg-[#FEF181] text-black text-xs rounded px-4 py-1 font-medium flex items-center justify-center gap-2">
          <span className="text-base font-semibold">+</span> Balans Artır
        </button>
        <button className="bg-white border rounded text-xs px-4 py-1 flex items-center justify-center gap-2">
          <span className='text-base font-semibold'>🎁</span> Hədiyyə Kartı Al
        </button>
        <button onClick={() => navigate('/increase-balans')} className="bg-white border rounded text-xs px-4 py-1 flex items-center justify-center gap-2">
          <span className='text-base font-semibold'>📈</span> Əməliyyat Tarixçəsi
        </button>
      </div>
      {/* Son Əməliyyatlar */}
      <div className="bg-white rounded-2xl px-8 py-4 flex flex-col gap-4">
        <div className="text-sm font-normal mb-4">Son Əməliyyatlar</div>
        <div className="flex flex-col gap-3">
          <div className="bg-white border rounded px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">Kupon alışı</div>
              <div className="text-gray-500 text-xs">28.01.2024</div>
            </div>
            <div className="text-red-500 font-semibold">-50 ₼</div>
          </div>
          <div className="bg-white border rounded px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">Balans artırılması</div>
              <div className="text-gray-500 text-xs">25.01.2024</div>
            </div>
            <div className="text-green-600 font-semibold">+100 ₼</div>
          </div>
          <div className="bg-white border rounded px-4 py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">Referal bonusu</div>
              <div className="text-gray-500 text-xs">22.01.2024</div>
            </div>
            <div className="text-green-600 font-semibold">+25 ₼</div>
          </div>
        </div>
        <button  onClick={()=>navigate('/increase-balans')} className="bg-white text-xs border rounded px-4 py-2 mt-1 font-medium">Hamısını Gör</button>
      </div>
    </div>
  )
}

export default Balans