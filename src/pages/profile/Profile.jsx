import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import mobile from "../../components/images/mobile.webp";
import { fetchMyCouponsAsync } from "../../redux/slices/myCouponsSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { items: coupons, isLoading } = useSelector((state) => state.myCoupons);

    useEffect(() => {
        dispatch(fetchMyCouponsAsync());
    }, [dispatch]);

    const activeCoupons = (coupons || []).filter((c) => !c.is_used);
    const passiveCoupons = (coupons || []).filter((c) => c.is_used);

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
                {isLoading ? (
                    <p>Yüklənir...</p>
                ) : activeCoupons.length === 0 ? (
                    <p>Aktiv kuponunuz yoxdur.</p>
                ) : (
                    activeCoupons.map(coupon => {
                        return (
                            <div
                                key={coupon.id}
                                className="flex items-center gap-4 bg-white rounded p-4 mb-4 shadow"
                            >
                                <img
                                    src={mobile}
                                    alt={coupon.coupon_name}
                                    className="w-24 h-24 object-contain rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl">{coupon.coupon_name}</h3>
                                    <p>Mağaza: <strong>{coupon.shop_name}</strong></p>
                                    <p>Say: {coupon.quantity}</p>
                                    <p className="text-red-600 font-bold">
                                        {(coupon.subtotal || 0).toFixed(2)} ₼
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {coupon.qr_code_image && (
                                        <img
                                            src={coupon.qr_code_image}
                                            alt="Kupon QR kodu"
                                            className="w-20 h-20 object-contain border rounded"
                                        />
                                    )}
                                    <span className="text-green-700 text-sm font-semibold">
                                        Aktiv
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Passiv Kuponlar</h2>
                {isLoading ? (
                    <p>Yüklənir...</p>
                ) : passiveCoupons.length === 0 ? (
                    <p>İstifadə edilmiş kupon yoxdur.</p>
                ) : (
                    passiveCoupons.map(coupon => (
                        <div
                            key={coupon.id}
                            className="flex items-center gap-4 bg-gray-200 rounded p-4 mb-4 shadow-inner"
                        >
                            <img
                                src={mobile}
                                alt={coupon.coupon_name}
                                className="w-24 h-24 object-contain rounded opacity-70"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-xl">{coupon.coupon_name}</h3>
                                <p>Mağaza: <strong>{coupon.shop_name}</strong></p>
                                <p>Say: {coupon.quantity}</p>
                                <p className="text-red-600 font-bold line-through">
                                    {(coupon.subtotal || 0).toFixed(2)} ₼
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
                {isLoading ? (
                    <p>Yüklənir...</p>
                ) : !coupons || coupons.length === 0 ? (
                    <p>Hələ heç bir kupon almamısınız.</p>
                ) : (
                    coupons.map((coupon) => {
                        return (
                            <div
                                key={coupon.id}
                                className={`flex items-center gap-4 rounded p-4 mb-4 shadow ${coupon.isActive
                                        ? "bg-white"
                                        : "bg-gray-200 shadow-inner"
                                    }`}
                            >
                                <img
                                    src={mobile}
                                    alt={coupon.coupon_name}
                                    className={`w-24 h-24 object-contain rounded ${!coupon.isActive ? "opacity-70" : ""
                                        }`}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl">{coupon.coupon_name}</h3>
                                    <p>Mağaza: <strong>{coupon.shop_name}</strong></p>
                                    <p>Adet: {coupon.quantity}</p>
                                    <p
                                        className={`font-bold ${coupon.isActive
                                                ? "text-red-600"
                                                : "text-red-600 line-through"
                                            }`}
                                    >
                                        {(coupon.subtotal || 0).toFixed(2)} ₼
                                    </p>
                                    <p
                                        className={`mt-1 text-sm font-semibold ${coupon.isActive ? "text-green-700" : "text-red-700"
                                            }`}
                                    >
                                        {coupon.is_used ? "İstifadə olunub" : "Aktiv"}
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

