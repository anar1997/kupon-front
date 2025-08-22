import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const couponData = [
    {
        id: 1,
        status: 'active',
        title: 'Professional Diş Təmizliyi',
        place: 'Dr. Əli Həkimov klinikası',
        date: '2024-01-28',
        end: '2024-02-29',
        price: 50,
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
        emailSent: true,
    },
    {
        id: 2,
        status: 'used',
        title: 'Tam Bədən Massajı',
        place: 'Beauty Center',
        date: '2024-01-25',
        used: '2024-01-27',
        price: 80,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        emailSent: true,
    },
    {
        id: 3,
        status: 'end',
        title: 'Pizza və İçki Menyu',
        place: 'PizzaLand',
        date: '2024-01-01',
        end: '2024-01-31',
        price: 30,
        image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80',
        emailSent: true,
    }
];

const tabList = [
    { key: 'active', label: 'Aktiv', count: couponData.filter(c => c.status === 'active').length },
    { key: 'used', label: 'İstifadə edilib', count: couponData.filter(c => c.status === 'used').length },
    { key: 'end', label: 'Vaxtı bitib', count: couponData.filter(c => c.status === 'end').length },
    { key: 'all', label: 'Hamısı', count: couponData.length }
];

const Coupons = () => {
    const [activeTab, setActiveTab] = useState('active');

    const filteredCoupons = activeTab === 'all'
        ? couponData
        : couponData.filter(c => c.status === activeTab);

    return (
        <div className="w-full px-24 my-8 flex flex-col gap-6">
            {/* Breadcrumb */}
            <div className="w-full">
                <div className="text-sm text-gray-600 mb-4">
                    <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                    <Link to="/profile" className="hover:underline">Profil</Link> &gt;{" "}
                    <span className="font-semibold text-black">Profilim</span>
                </div>
            </div>
            {/* Stats */}
            <div className="flex gap-6">
                <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 flex flex-col items-center shadow">
                    <div className="text-4xl font-bold mb-2">{couponData.length}</div>
                    <div className="text-gray-500">Ümumi Kupon</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 flex flex-col items-center shadow">
                    <div className="text-4xl font-bold mb-2">{couponData.filter(c => c.status === 'active').length}</div>
                    <div className="text-gray-500">Aktiv</div>
                </div>
                <div className="flex-1 bg-red-100 rounded-xl p-8 flex flex-col items-center shadow">
                    <div className="text-4xl font-bold mb-2 text-red-600">160 ₼</div>
                    <div className="text-gray-500">Ödənilib</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 flex flex-col items-center shadow">
                    <div className="text-4xl font-bold mb-2">107 ₼</div>
                    <div className="text-gray-500">Qənaət</div>
                </div>
            </div>
            {/* Email Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center gap-4 mt-4">
                <span className="text-2xl text-blue-600">✉️</span>
                <div>
                    <div className="font-semibold text-blue-700">Email ilə Göndərilən Kuponlar</div>
                    <div className="text-blue-700">
                        Bütün kuponlarınız QR kodları ilə birlikdə <span className="font-bold">abbasquliyev111@gmail.com</span> ünvanına göndərilmişdir. Email tapmırsınızsa spam qovluğunu yoxlayın.
                    </div>
                </div>
            </div>
            {/* Tabs */}
            <div className="w-full">
                <div className="flex gap-2 bg-gray-100 rounded-full p-1 mb-8">
                    {tabList.map(tab => (
                        <button
                            key={tab.key}
                            className={`flex-1 py-2 rounded-full font-medium ${activeTab === tab.key ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
                {/* Coupon Cards */}
                {filteredCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg width="64" height="64" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="4" y="7" width="16" height="13" rx="2" />
                            <path d="M8 3v4M16 3v4" />
                        </svg>
                        <div className="text-xl font-bold mt-6 mb-2">Kupon tapılmadı</div>
                        <div className="text-gray-500 mb-6">Bu kateqoriyada hələ kuponunuz yoxdur.</div>
                        <button className="bg-black text-white rounded px-6 py-2 font-semibold">Kupon Almağa Başlayın</button>
                    </div>
                ) : (
                    <div className={`grid ${activeTab === 'end' || activeTab === 'all' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                        {filteredCoupons.map(coupon => (
                            <div key={coupon.id} className="bg-white rounded-2xl shadow flex flex-col md:flex-row overflow-hidden p-6 relative">
                                <img src={coupon.image} alt={coupon.title} className="w-48 h-32 object-cover rounded-xl mr-6" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-lg font-bold">{coupon.title}</div>
                                                <div className="text-gray-500 text-sm">{coupon.place}</div>
                                            </div>
                                            {coupon.status === 'used' && (
                                                <span className="absolute top-6 right-6 text-sm font-medium text-gray-700">istifadə edilib</span>
                                            )}
                                            {coupon.status === 'end' && (
                                                <span className="absolute top-6 right-6 text-sm font-medium text-gray-700">Vaxtı bitib</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 mt-2 text-gray-700 text-sm">
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
                                        <div className="text-xl font-bold">{coupon.price} ₼</div>
                                        <div className="flex gap-2">
                                            {coupon.status === 'end' && (
                                                <button className="bg-white border rounded px-3 py-1 flex items-center gap-1 text-sm">
                                                    <span>QR Kod</span>
                                                </button>
                                            )}
                                            <button className="bg-white border rounded px-3 py-1 text-sm">Detallar</button>
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