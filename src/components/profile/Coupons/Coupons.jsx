import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyCouponsAsync } from '../../../redux/slices/myCouponsSlice'
import mobile from '../../images/mobile.webp'

const Coupons = () => {
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: coupons, isLoading } = useSelector((state) => state.myCoupons);

    useEffect(() => {
        dispatch(fetchMyCouponsAsync());
    }, [dispatch]);

    const mappedCoupons = useMemo(
        () => (coupons || []).map((item) => ({
            id: item.id,
            status: item.is_used ? 'used' : 'active',
            title: item.coupon_name,
            slug: item.coupon_slug,
            place: item.shop_name,
            date: item.used_at || '',
            // Backend Decimal-lar string gələ bilər, mütləq ədədə çeviririk
            price: Number(item.subtotal) || 0,
            image: mobile,
            emailSent: true,
            hasQr: !!item.qr_code_image,
            qrImage: item.qr_code_image,
            qrCode: item.qr_code,
        })),
        [coupons]
    );

    const stats = useMemo(
        () => {
            const total = mappedCoupons.length;
            const active = mappedCoupons.filter((c) => c.status === 'active').length;
            const used = mappedCoupons.filter((c) => c.status === 'used').length;
            const paid = mappedCoupons.reduce((sum, c) => sum + (c.price || 0), 0);
            // Qənaət hazırda backend-dən gəlmir; placeholder kimi 0 saxlayırıq
            const saved = 0;
            return { total, active, used, paid, saved };
        },
        [mappedCoupons]
    );

    const tabList = [
        { key: 'active', label: 'Aktiv', count: stats.active },
        { key: 'used', label: 'İstifadə edilib', count: stats.used },
        { key: 'all', label: 'Hamısı', count: stats.total }
    ];

    const filteredCoupons = activeTab === 'all'
        ? mappedCoupons
        : mappedCoupons.filter(c => c.status === activeTab);

    return (
        <div className="w-full xl:px-24 sm:px-10 px-6 my-8 flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="w-full">
                <div className="text-xs sm:text-sm text-gray-600 mb-4">
                    <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                    <Link to="/profile" className="hover:underline">Profil</Link> &gt;{" "}
                    <span className="font-semibold text-black">Profilim</span>
                </div>
            </div>
            {/* Stats */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 sm:p-8 flex flex-col items-center shadow">
                    <div className="text-2xl sm:text-4xl font-bold mb-2">{stats.total}</div>
                    <div className="text-gray-500 text-xs sm:text-base">Ümumi Kupon</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 sm:p-8 flex flex-col items-center shadow">
                    <div className="text-2xl sm:text-4xl font-bold mb-2">{stats.active}</div>
                    <div className="text-gray-500 text-xs sm:text-base">Aktiv</div>
                </div>
                <div className="flex-1 bg-red-100 rounded-xl p-4 sm:p-8 flex flex-col items-center shadow">
                    <div className="text-2xl sm:text-4xl font-bold mb-2 text-red-600">{stats.paid.toFixed(2)} ₼</div>
                    <div className="text-gray-500 text-xs sm:text-base">Ödənilib</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 sm:p-8 flex flex-col items-center shadow">
                    <div className="text-2xl sm:text-4xl font-bold mb-2">{stats.saved.toFixed(2)} ₼</div>
                    <div className="text-gray-500 text-xs sm:text-base">Qənaət</div>
                </div>
            </div>
            {/* Email Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-4">
                <span className="text-xl sm:text-2xl text-blue-600">✉️</span>
                <div>
                    <div className="font-semibold text-blue-700 text-xs sm:text-base">Email ilə Göndərilən Kuponlar</div>
                    <div className="text-blue-700 text-xs sm:text-base">
                        Bütün kuponlarınız QR kodları ilə birlikdə qeydiyyat email ünvanınıza göndərilir. Email tapmırsınızsa spam qovluğunu yoxlayın.
                    </div>
                </div>
            </div>
            {/* Tabs */}
            <div className="w-full">
                <div className="flex gap-1 sm:gap-2 bg-gray-100 rounded-full p-1 mb-8">
                    {tabList.map(tab => (
                        <button
                            key={tab.key}
                            className={`flex-1 py-1 sm:py-2 rounded-md md:rounded-full px-2 font-medium text-xs sm:text-base ${activeTab === tab.key ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
                {/* Coupon Cards */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-lg sm:text-xl font-bold mt-6 mb-2">Yüklənir...</div>
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg width="48" height="48" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="4" y="7" width="16" height="13" rx="2" />
                            <path d="M8 3v4M16 3v4" />
                        </svg>
                        <div className="text-lg sm:text-xl font-bold mt-6 mb-2">Məhsul tapılmadı</div>
                        <div className="text-gray-500 mb-6 text-xs sm:text-base">Bu kateqoriyada hələ kuponunuz yoxdur.</div>
                        <button className="bg-black text-white rounded px-4 sm:px-6 py-2 font-semibold text-xs sm:text-base">Kupon Almağa Başlayın</button>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 ${activeTab === 'end' || activeTab === 'all' ? 'md:grid-cols-2' : ''} gap-4 sm:gap-6`}>
                        {filteredCoupons.map(coupon => (
                            <div key={coupon.id} className="bg-white rounded-2xl shadow flex flex-col md:flex-row overflow-hidden p-4 sm:p-6 relative">
                                <img src={coupon.image} alt={coupon.title} className="w-full md:w-48 h-32 object-cover rounded-xl mb-4 md:mb-0 md:mr-6" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col md:flex-row justify-between items-start">
                                            <div>
                                                <div className="text-base sm:text-lg font-bold">{coupon.title}</div>
                                                <div className="text-gray-500 text-xs sm:text-sm">{coupon.place}</div>
                                            </div>
                                            {coupon.status === 'used' && (
                                                <span className="absolute top-4 right-4 text-xs sm:text-sm font-medium text-gray-700">istifadə edilib</span>
                                            )}
                                            {coupon.status === 'end' && (
                                                <span className="absolute top-4 right-4 text-xs sm:text-sm font-medium text-gray-700">Vaxtı bitib</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 mt-2 text-gray-700 text-xs sm:text-sm">
                                            <div>Alındı: {coupon.date}</div>
                                            {(coupon.status === 'end' || coupon.status === 'active') && coupon.end && (
                                                <div>Biter: {coupon.end}</div>
                                            )}
                                            {coupon.status === 'used' && coupon.used && (
                                                <div>İstifadə: {coupon.used}</div>
                                            )}
                                            {coupon.emailSent && (
                                                <div>
                                                    <span className="text-blue-600">✉️ Email göndərildi</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-lg sm:text-xl font-bold">{coupon.price} ₼</div>
                                        <div className="flex gap-2">
                                            {coupon.status === 'end' && (
                                                <button className="bg-white border rounded px-2 sm:px-3 py-1 flex items-center gap-1 text-xs sm:text-sm">
                                                    <span>QR Kod</span>
                                                </button>
                                            )}
                                            <button
                                                className="bg-white border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                                onClick={() => navigate(`/my-coupons/${coupon.id}`, { state: { coupon } })}
                                            >
                                                Detallar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Coupons