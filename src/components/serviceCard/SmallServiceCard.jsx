import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmallServiceCard = ({
    id,
    image,
    name,
    price,
    discountPercent = 0,
    duration,
    onAddToCart,
    onBuyNow,
}) => {
    const discountedPrice = discountPercent
        ? (price * (100 - discountPercent)) / 100
        : price;

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/service/${id}`);
    };

    return (
        <div className="w-52 group bg-white rounded-lg shadow hover:shadow-md transition p-2">
            <div onClick={handleCardClick} className="cursor-pointer">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-28 object-contain rounded mb-2"
                />
                <h3 className="text-sm font-semibold mb-1 line-clamp-2">{name}</h3>
                {/* ✅ Kullanım süresi bilgisi */}
                {duration && (
                    <p className="text-sm text-gray-500 mb-1">
                        İstifadə müddəti: <span className="text-black font-medium">{duration}</span>
                    </p>
                )}
                {discountPercent > 0 ? (
                    <div className="text-xs mb-2">
                        <p className="text-[#FAD800] font-bold">{discountedPrice.toFixed(2)} ₼</p>
                        <p className="line-through text-gray-500">{price.toFixed(2)} ₼</p>
                        <p className="text-green-600 font-semibold">-{discountPercent}%</p>
                    </div>
                ) : (
                    <p className="text-sm font-bold mb-2">{price.toFixed(2)} ₼</p>
                )}
            </div>

            <div className="flex gap-1 mt-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // ✅ tıklamayı kartın üst divine bulaştırmaz
                        onAddToCart();
                    }}
                    className="flex-1 bg-[#FAD800] text-black text-xs px-2 py-1 rounded hover:bg-[#ac9709] transition flex items-center justify-center gap-1"
                >
                    <FiShoppingCart size={14} />
                    Səbət
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // ✅ aynı şekilde
                        onBuyNow();
                    }}
                    className="flex-1 bg-slate-100 text-black text-xs px-2 py-1 rounded hover:bg-slate-200 transition"
                >
                    Al
                </button>
            </div>  
        </div>
    );
};

export default SmallServiceCard;
