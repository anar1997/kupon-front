import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ EKLENDİ

const ServiceCard = ({
    id,
    image,
    name,
    price,
    discountPercent = 0,
    duration, // ✅ yeni prop
    onAddToCart,
    onBuyNow,
}) => {
    const navigate = useNavigate();

    const discountedPrice = discountPercent
        ? (price * (100 - discountPercent)) / 100
        : price;

    return (
        <div
            className="w-72 group flex-shrink-0 transform transition duration-300 hover:shadow-xl hover:scale-[1.03] rounded-lg cursor-pointer"
            onClick={() => navigate(`/service/${id}`)}
        >
            <div className="bg-white rounded-t-2xl shadow-md p-4 flex flex-col h-[460px]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-80 object-contain rounded-md mb-3"
                />

                <h3 className="text-lg font-semibold mb-1">{name}</h3>

                {/* ✅ Kullanım süresi bilgisi */}
                {duration && (
                    <p className="text-sm text-gray-500 mb-1">
                        İstifadə müddəti: <span className="text-black font-medium">{duration}</span>
                    </p>
                )}

                <div className="mb-8 mt-1">
                    {discountPercent > 0 ? (
                        <>
                            <p className="text-red-600 font-bold text-lg">
                                {discountedPrice.toFixed(2)} ₼
                            </p>
                            <p className="line-through text-gray-500">
                                {price.toFixed(2)} ₼
                            </p>
                            <p className="text-green-600 font-semibold">-{discountPercent}%</p>
                        </>
                    ) : (
                        <p className="font-bold text-lg">{price.toFixed(2)} ₼</p>
                    )}
                </div>
            </div>

            <div
                className="bg-white rounded-b-lg shadow-md mt-0 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-24 px-0 group-hover:px-4 py-0 group-hover:py-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-3">
                    <button
                        onClick={onAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                        <FiShoppingCart size={20} />
                        Səbət
                    </button>
                    <button
                        onClick={onBuyNow}
                        className="flex-1 bg-slate-100 text-black py-2 rounded hover:bg-slate-200 transition"
                    >
                        Satın Al
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ServiceCard;
