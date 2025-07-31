import React, { useState } from "react";
import { Link } from "react-router-dom";
import mobile from "../../components/images/mobile.webp"; // sahte resim
import { FiPlus, FiMinus } from "react-icons/fi";

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

    return (
        <div className="bg-slate-100 p-4 min-h-screen">
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

                    {/* Sağ Kısım */}
                    <div className="bg-white p-4 rounded-xl shadow h-fit">
                        <h3 className="text-lg font-semibold mb-4">Xİdmətlər: {totalServices} xidmət</h3>
                        <ul className="text-sm space-y-2 mb-4">
                            {cartItems.map((item) => (
                                <li key={item.id}>
                                    {item.name} ({item.quantity}x) –
                                    <span className="text-green-700 font-semibold ml-1">
                                        {(item.couponPrice * item.quantity).toFixed(2)} ₼
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <hr className="my-3" />
                        <div className="flex justify-between text-md font-semibold">
                            <span>Ümumi Kupon Qiyməti:</span>
                            <span>{totalCouponPrice.toFixed(2)} ₼</span>
                        </div>
                        <button className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                            Al
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;