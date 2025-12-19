import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiMinus, FiTag, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartAsync, updateCartItemAsync, clearCartAsync, removeCartItemAsync } from '../../redux/slices/cartSlice';
import { createOrderFromCartAsync } from '../../redux/slices/ordersSlice';
import placeholder from "../../components/images/placeholder.jpg";

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, itemsCount } = useSelector(state => state.cart);

    const handleIncrease = (item) => {
        dispatch(updateCartItemAsync({ id: item.id, quantity: item.quantity + 1 }));
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(updateCartItemAsync({ id: item.id, quantity: item.quantity - 1 }));
        }
    };

    const handleClearCart = () => {
        dispatch(clearCartAsync());
    };

    const handleRemoveItem = (id) => {
        dispatch(removeCartItemAsync(id));
    };

    const totalServices = items.reduce((sum, item) => sum + item.quantity, 0);

    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleCheckout = async () => {
        try {
            const action = await dispatch(createOrderFromCartAsync());
            if (createOrderFromCartAsync.fulfilled.match(action)) {
                // Sifariş uğurludursa, səbəti yenilə və kuponlara yönləndir
                dispatch(fetchCartAsync());
                navigate('/coupons');
            }
        } catch (e) {
            // Xətalar notify içində göstərilir
        }
    };

    useEffect(() => {
        dispatch(fetchCartAsync());
    }, [dispatch]);

    return (
        <div className="bg-slate-100 xl:px-24 sm:px-10 px-6 py-4 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt; <span className="font-semibold text-black">Səbət</span>
            </div>

            {items.length === 0 ? (
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
                                onClick={() => setShowConfirm(true)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Səbəti Boşalt
                            </button>
                        </div>

                        {/* Ürün Listesi */}
                        {items.map((item) => {
                            const coupon = item.coupon;
                            const price = Number(coupon?.price || 0);
                            const discounted = Number(coupon?.discount || 0);
                            const image = coupon?.shop?.images?.[0]?.image || placeholder;
                            const name = coupon?.name || '';
                            const discountPercent = price > 0 ? Math.round(((price - discounted) / price) * 100) : 0;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
                                >
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-24 h-24 object-contain rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{name}</h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                onClick={() => handleDecrease(item)}
                                                className="border p-1 rounded hover:bg-slate-200"
                                            >
                                                <FiMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncrease(item)}
                                                className="border p-1 rounded hover:bg-slate-200"
                                            >
                                                <FiPlus />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="ml-4 border p-1 rounded text-red-600 hover:bg-red-50"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                        <p className="text-gray-500 line-through text-sm">
                                            {(price * item.quantity).toFixed(2)} ₼
                                        </p>
                                        <p className="text-red-600 font-semibold">
                                            {(discounted * item.quantity).toFixed(2)} ₼
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sağ Kısım - c-1.png dizaynı */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow h-fit border">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">Sifariş Xülasəsi</h3>
                        {/* Promo kod */}
                        <div className="flex flex-col xl:flex-row gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Promo kod daxil edin"
                                className="flex-1 border rounded-lg px-3 py-2 bg-gray-50 outline-none text-xs sm:text-sm"
                            />
                            <button className="flex items-center gap-1 border px-3 sm:px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-gray-700 text-xs sm:text-sm">
                                <FiTag /> Təsdiq
                            </button>
                        </div>
                        <hr className="my-3" />
                        {/* Alt cəmi və endirim */}
                        <div className="flex justify-between mb-2 text-gray-700 text-xs lg:text-base">
                            <span>Alt cəmi</span>
                            <span>{items
                                .reduce((sum, item) => {
                                    const price = Number(item.coupon?.price || 0);
                                    return sum + price * item.quantity;
                                }, 0)
                                .toFixed(2)} ₼
                            </span>
                        </div>
                        <div className="flex justify-between mb-2 text-green-600 text-xs lg:text-base">
                            <span>Kupon endirimi</span>
                            <span>
                                -{items
                                    .reduce((sum, item) => {
                                        const price = Number(item.coupon?.price || 0);
                                        const discounted = Number(item.coupon?.discount || 0);
                                        return sum + (price - discounted) * item.quantity;
                                    }, 0)
                                    .toFixed(2)} ₼
                            </span>
                        </div>
                        <hr className="my-3" />
                        {/* Cəmi */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg lg:text-2xl">CƏMİ</span>
                            <span className="font-bold text-lg lg:text-2xl text-[#FFEB3B]">
                                {Number(totalAmount).toFixed(2)} ₼
                            </span>
                        </div>
                        <hr className="my-3" />
                        {/* Balans istifadəsi */}
                        {/* Balans hissəsi hələ backend ilə bağlı deyil, gələcəkdə wallet inteqrasiyası üçün saxlanılıb */}
                        {/* Sifarişi tamamla */}
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#FFEB3B] hover:bg-yellow-300 transition rounded-lg py-3 font-semibold text-black text-xs lg:text-base mb-2"
                        >
                            Sifarişi Tamamla
                        </button>
                        <div className="text-center text-xs text-gray-400 mt-2">
                            Ödəniş təhlükəsiz şəkildə həyata keçirilir
                        </div>
                    </div>
                </div>
            )}

            {/* Onay Modalı */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                        <h3 className="text-lg font-semibold mb-4">Səbəti boşaltmaq istədiyinizə əminsiniz?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    handleClearCart();
                                    setShowConfirm(false);
                                }}
                                className="bg-[#FFEB3B] text-black px-4 py-2 rounded hover:bg-red-700"
                            >
                                Bəli
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Xeyr
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;