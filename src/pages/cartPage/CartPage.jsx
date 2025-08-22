import React, { useState } from "react";
import { Link } from "react-router-dom";
import mobile from "../../components/images/mobile.webp"; // sahte resim
import { FiPlus, FiMinus, FiTag } from "react-icons/fi";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Stomatoloq Xidməti",
            image: mobile,
            price: 100,
            discountPercent: 20,
            couponPrice: 8,
            quantity: 1,
            duration: "30 gün", // burada duration ekledik
        },
        {
            id: 2,
            name: "Stomatoloq Xidməti",
            image: mobile,
            price: 100,
            discountPercent: 20,
            couponPrice: 8,
            quantity: 1,
            duration: "30 gün", // ekledik
        },
    ]);

    const handleIncrease = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const totalServices = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalCouponPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.couponPrice,
        0
    );

    const userBalance = 150;

    return (
        <div className="bg-slate-100 px-24 p-4 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt; <span className="font-semibold text-black">Səbət</span>
            </div>

            {cartItems.length === 0 ? (
                <div className="bg-white p-6 rounded-xl text-center shadow">
                    <h2 className="text-xl font-semibold mb-2">Səbət (0)</h2>
                    <p className="text-gray-600 mb-1">Səbətində məhsul yoxdur</p>
                    <p className="text-gray-500 mb-4">İstədiyin məhsulu səbətinə əlavə et</p>
                    <Link
                        to="/"
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Ana Səhifəyə Qayıt
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sol Kısım */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Üst */}
                        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Səbət ({totalServices})</h2>
                            <button
                                onClick={handleClearCart}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Səbəti Boşalt
                            </button>
                        </div>

                        {/* Ürün Listesi */}
                        {cartItems.map((item) => {
                            const discounted = (item.price * (100 - item.discountPercent)) / 100;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-contain rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                                        <p className="text-gray-700 mb-1">
                                            İstifadə müddəti: <strong>{item.duration}</strong>
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                onClick={() => handleDecrease(item.id)}
                                                className="border p-1 rounded hover:bg-slate-200"
                                            >
                                                <FiMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncrease(item.id)}
                                                className="border p-1 rounded hover:bg-slate-200"
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <p className="text-gray-500 line-through text-sm">
                                            {(item.price * item.quantity).toFixed(2)} ₼
                                        </p>
                                        <p className="text-red-600 font-semibold">
                                            {(discounted * item.quantity).toFixed(2)} ₼
                                        </p>
                                        <p className="text-green-600 text-sm">
                                            Kupon Qiyməti: {(item.couponPrice * item.quantity).toFixed(2)} ₼
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sağ Kısım - c-1.png dizaynı */}
                    <div className="bg-white p-6 rounded-2xl shadow h-fit border">
                        <h3 className="text-lg font-semibold mb-4">Sifariş Xülasəsi</h3>
                        {/* Promo kod */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Promo kod daxil edin"
                                className="flex-1 border rounded-lg px-3 py-2 bg-gray-50 outline-none"
                            />
                            <button className="flex items-center gap-1 border px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-gray-700">
                                <FiTag /> Təsdiq
                            </button>
                        </div>
                        <hr className="my-3" />
                        {/* Alt cəmi və endirim */}
                        <div className="flex justify-between mb-2 text-gray-700">
                            <span>Alt cəmi</span>
                            <span>
                                {(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)} ₼
                            </span>
                        </div>
                        <div className="flex justify-between mb-2 text-green-600">
                            <span>Kupon endirimi</span>
                            <span>
                                -{(cartItems.reduce((sum, item) => sum + (item.price - ((item.price * (100 - item.discountPercent)) / 100)) * item.quantity, 0)).toFixed(2)} ₼
                            </span>
                        </div>
                        <hr className="my-3" />
                        {/* Cəmi */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-2xl">CƏMİ</span>
                            <span className="font-bold text-2xl text-[#FFEB3B]">
                                {(cartItems.reduce((sum, item) => sum + ((item.price * (100 - item.discountPercent)) / 100) * item.quantity, 0)).toFixed(2)} ₼
                            </span>
                        </div>
                        <hr className="my-3" />
                        {/* Balans istifadəsi */}
                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-gray-700">Balans istifadəsi</span>
                            <span className="text-[#FFEB3B] font-semibold">Mövcud: {userBalance} ₼</span>
                        </div>
                        <button className="w-full border rounded-lg py-2 mb-4 bg-white hover:bg-gray-100 transition font-semibold">
                            Bütün balansı istifadə et
                        </button>
                        {/* Sifarişi tamamla */}
                        <button className="w-full bg-[#FFEB3B] hover:bg-yellow-300 transition rounded-lg py-3 font-semibold text-black text-base mb-2">
                            Sifarişi Tamamla
                        </button>
                        <div className="text-center text-xs text-gray-400 mt-2">
                            Ödəniş təhlükəsiz şəkildə həyata keçirilir
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;