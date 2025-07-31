import React, { useState } from "react";
import { Link } from "react-router-dom";
import mobile from "../../components/images/mobile.webp";

const Profile = () => {
    // Kullanıcının kuponları
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            name: "Stomatoloq Xidməti",
            image: mobile,
            price: 100,
            discountPercent: 20,
            couponPrice: 8,
            quantity: 2,
            duration: "6 ay",
            isActive: true,
        },
        {
            id: 2,
            name: "Ortopediya Xidməti",
            image: mobile,
            price: 150,
            discountPercent: 10,
            couponPrice: 10,
            quantity: 1,
            duration: "3 ay",
            isActive: false,
        },
    ]);

    const useCoupon = (id) => {
        setCoupons((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, isActive: false } : c
            )
        );
    };

    const activeCoupons = coupons.filter(c => c.isActive);
    const passiveCoupons = coupons.filter(c => !c.isActive);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-slate-100 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <span className="font-semibold text-black">Profilim</span>
            </div>

            <h1 className="text-3xl font-bold mb-8">Profilim</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Aktiv Kuponlar</h2>
                {activeCoupons.length === 0 ? (
                    <p>Aktiv kuponunuz yoxdur.</p>
                ) : (
                    activeCoupons.map(coupon => {
                        const discountedPrice = (coupon.price * (100 - coupon.discountPercent)) / 100;
                        return (
                            <div
                                key={coupon.id}
                                className="flex items-center gap-4 bg-white rounded p-4 mb-4 shadow"
                            >
                                <img
                                    src={coupon.image}
                                    alt={coupon.name}
                                    className="w-24 h-24 object-contain rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl">{coupon.name}</h3>
                                    <p>İstifadə müddəti: <strong>{coupon.duration}</strong></p>
                                    <p>Say: {coupon.quantity}</p>
                                    <p className="line-through text-gray-500">
                                        {(coupon.price * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                    <p className="text-red-600 font-bold">
                                        {(discountedPrice * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        Kupon Qiyməti: {(coupon.couponPrice * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                </div>
                                <button
                                    onClick={() => useCoupon(coupon.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Kuponu İstifadə Et
                                </button>
                            </div>
                        );
                    })
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Passiv Kuponlar</h2>
                {passiveCoupons.length === 0 ? (
                    <p>İstifadə edilmiş kupon yoxdur.</p>
                ) : (
                    passiveCoupons.map(coupon => (
                        <div
                            key={coupon.id}
                            className="flex items-center gap-4 bg-gray-200 rounded p-4 mb-4 shadow-inner"
                        >
                            <img
                                src={coupon.image}
                                alt={coupon.name}
                                className="w-24 h-24 object-contain rounded opacity-70"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-xl">{coupon.name}</h3>
                                <p>İstifadə müddəti: <strong>{coupon.duration}</strong></p>
                                <p>Say: {coupon.quantity}</p>
                                <p className="line-through text-gray-600">
                                    {(coupon.price * coupon.quantity).toFixed(2)} ₼
                                </p>
                                <p className="text-red-600 font-bold line-through">
                                    {(((coupon.price * (100 - coupon.discountPercent)) / 100) * coupon.quantity).toFixed(2)} ₼
                                </p>
                                <p className="text-green-600 text-sm line-through">
                                    Kupon Qiyməti: {(coupon.couponPrice * coupon.quantity).toFixed(2)} ₼
                                </p>
                                <p className="text-red-700 font-semibold mt-1">İstifadə Edilib</p>
                            </div>
                        </div>
                    ))
                )}
            </section>
            {/* ✅ Bütün Kuponlar */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    İndiyə qədər aldığınız bütün kuponlar
                </h2>
                {coupons.length === 0 ? (
                    <p>Hələ heç bir kupon almamısınız.</p>
                ) : (
                    coupons.map((coupon) => {
                        const discountedPrice =
                            (coupon.price * (100 - coupon.discountPercent)) / 100;
                        return (
                            <div
                                key={coupon.id}
                                className={`flex items-center gap-4 rounded p-4 mb-4 shadow ${coupon.isActive
                                        ? "bg-white"
                                        : "bg-gray-200 shadow-inner"
                                    }`}
                            >
                                <img
                                    src={coupon.image}
                                    alt={coupon.name}
                                    className={`w-24 h-24 object-contain rounded ${!coupon.isActive ? "opacity-70" : ""
                                        }`}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl">{coupon.name}</h3>
                                    <p>
                                        İstifadə müddəti: <strong>{coupon.duration}</strong>
                                    </p>
                                    <p>Adet: {coupon.quantity}</p>
                                    <p className="line-through text-gray-500">
                                        {(coupon.price * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                    <p
                                        className={`font-bold ${coupon.isActive
                                                ? "text-red-600"
                                                : "text-red-600 line-through"
                                            }`}
                                    >
                                        {(discountedPrice * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                    <p
                                        className={`text-green-600 text-sm ${!coupon.isActive ? "line-through" : ""
                                            }`}
                                    >
                                        Kupon Qiyməti:{" "}
                                        {(coupon.couponPrice * coupon.quantity).toFixed(2)} ₼
                                    </p>
                                    <p
                                        className={`mt-1 text-sm font-semibold ${coupon.isActive ? "text-green-700" : "text-red-700"
                                            }`}
                                    >
                                        {coupon.isActive ? "Aktiv" : "İstifadə olunub"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default Profile;

