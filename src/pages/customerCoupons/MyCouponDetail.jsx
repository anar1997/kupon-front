import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const MyCouponDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const coupon = state?.coupon;

  if (!coupon) {
    // Əgər state gəlməyibsə, sadə info göstərib geri qaytarmaq imkanı veririk
    return (
      <div className="w-full xl:px-24 sm:px-10 px-6 my-8 flex flex-col gap-6">
        <div className="text-xs sm:text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
          <Link to="/coupons" className="hover:underline">Kuponlarım</Link> &gt;{" "}
          <span className="font-semibold text-black">Kupon detalı</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="mb-4">Kupon məlumatı tapılmadı (səhifə yenilənmiş ola bilər).</p>
          <button
            onClick={() => navigate('/coupons')}
            className="bg-black text-white rounded px-4 py-2 text-sm font-semibold"
          >
            Kuponlara qayıt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full xl:px-24 sm:px-10 px-6 my-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
        <Link to="/coupons" className="hover:underline">Kuponlarım</Link> &gt;{" "}
        <span className="font-semibold text-black">Kupon detalı</span>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
        {/* Sol tərəf: QR və əsas info */}
        <div className="w-full lg:w-1/3 flex flex-col items-center gap-4">
          {coupon.qrImage ? (
            <div className="border rounded-xl p-4 bg-gray-50 flex flex-col items-center">
              <img
                src={coupon.qrImage}
                alt="Kupon QR"
                className="w-40 h-40 object-contain mb-2"
              />
              <div className="text-xs text-gray-500 break-all">
                QR kod: {coupon.qrCode}
              </div>
            </div>
          ) : (
            <div className="border rounded-xl p-6 bg-gray-50 text-center text-sm text-gray-500">
              Bu kupon üçün QR şəkli mövcud deyil.
            </div>
          )}

          <div className="w-full bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="font-semibold text-sm">
              {coupon.status === 'used' ? 'İstifadə edilib' : 'Aktiv'}
            </div>
          </div>
        </div>

        {/* Sağ tərəf: detallı məlumat */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{coupon.title}</h1>
            <div className="text-gray-500 text-sm">{coupon.place}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm text-gray-700">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Ödənilən məbləğ</div>
              <div className="text-lg font-bold">{coupon.price.toFixed(2)} ₼</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Alınma tarixi</div>
              <div className="text-sm">{coupon.date || '-'}</div>
            </div>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4">
            Bu səhifədə yalnız satın aldığınız kuponun məlumatları göstərilir.
            Mağazada bu kuponu istifadə etmək üçün yuxarıdakı QR kodu göstərməyiniz kifayətdir.
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate('/coupons')}
              className="bg-black text-white rounded px-4 py-2 text-sm font-semibold"
            >
              Kuponlara qayıt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCouponDetail;
