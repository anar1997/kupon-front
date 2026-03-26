import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMeAsync } from '../../../redux/slices/authSlice';
import { getMyReferralsAsync } from '../../../redux/slices/myReferalsSlice';

const Referal = () => {
  const dispatch = useDispatch();
  const me = useSelector(state => state.auth.me)
  const  { myReferrals, loading, error } = useSelector(state => state.myReferrals);
  const BONUS_PER_REFERRAL = 25;
  const totalBonus = myReferrals.length * BONUS_PER_REFERRAL;
  useEffect(() => {
    dispatch(getMeAsync());
    dispatch(getMyReferralsAsync());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Referal Proqramı */}
      <div className="bg-gradient-to-br from-[#F9F9F3] to-[#F9F9F1] rounded-2xl px-8 pt-5 flex flex-col gap-5">
        <div className="  ">Referal Proqramı</div>
        <div className="bg-[#FCFCF8] rounded-xl flex flex-col items-center justify-center py-8">
          <span className="text-4xl mb-2">🎁</span>
          <div className="text-lg font-semibold mb-2">Dostları Dəvət Edin</div>
          <div className="text-xs text-gray-500">Hər dəvət edilən dost üçün 25 ₼ bonus qazanın</div>
        </div>
        <div className="">
          <div className="font-medium text-xs">Referal Kodunuz</div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={me.referral_code}
              disabled
              className="bg-gray-50 border rounded px-2 py-1 text-xs w-full font-mono"
            />
            <button className="bg-white border rounded px-2 py-1 text-sm">📋</button>
            <button className="bg-white border rounded px-2 py-1 text-sm">🔗</button>
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Bu kodu dostlarınıza göndərərək hər biri üçün 25₼ qazanın
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#FFF283]">{myReferrals.length}</div>
          <div className="text-gray-500 text-xs">Dəvət Edilən Dostlar</div>
          <div className="text-green-600 text-xs font-normal mt-1 mb-4">{totalBonus} ₼ qazanılıb</div>
        </div>
      </div>
      {/* Referal Statistikalar */}
      <div className="bg-white rounded-2xl px-8 pt-5 flex flex-col gap-4">
        <div className="text-sm font-semibold">Referal Statistikalar</div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Yüklənir...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Xəta baş verdi</div>
          ) : myReferrals.length > 0 ? (
            myReferrals.map((referral, idx) => (
              <div key={idx} className="bg-white border rounded px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {referral.first_name} {referral.last_name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Qeydiyyat: {new Date(referral.date_joined).toLocaleDateString('az-AZ', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>
                </div>
                {/* <div className="text-green-600 font-semibold">+25 ₼</div> */}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Hələ ki, dəvət etdiyiniz dost yoxdur
            </div>
          )}
        </div>
        <button className="bg-[#FFF283] mb-12 text-black rounded px-4 py-2 mt-4 font-semibold w-40 mx-auto text-xs flex items-center gap-2 justify-center">
          <span>🔗</span> Dostları Dəvət Et
        </button>
      </div>
    </div>
  )
}

export default Referal