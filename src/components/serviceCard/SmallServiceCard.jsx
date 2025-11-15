import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmallServiceCard = ({
    id,
    slug,              // CardElement ile uyum için
    title,             // name yerine
    image,
    discountPercent,
    oldPrice,
    price,
    saved,
    location,
    duration,
    rating,
    ratingCount,
    isVip,
    isPremium,
    onAddToCart = () => {},
    onBuyNow = () => {},
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/service/${slug || id}`);
    };

    return (
        <div
            className="bg-white rounded-xl shadow border hover:shadow-lg transition cursor-pointer flex flex-col w-44" /* küçültüldü */
            onClick={handleClick}
        >
            <div className="relative rounded-t-xl overflow-hidden h-28 bg-gray-100 flex items-center justify-center">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-28 object-cover"
                />
                {isVip && (
                    <span className="absolute top-1 left-1 bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded font-medium shadow">
                        VIP
                    </span>
                )}
                {isPremium && (
                    <span className="absolute top-6 left-1 bg-[#FF9800] text-white text-[9px] px-1.5 py-0.5 rounded font-medium shadow">
                        Premium
                    </span>
                )}
                {discountPercent > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            <div className="flex flex-col px-2.5 py-2 flex-1">
                <div className="font-semibold text-[12px] leading-snug line-clamp-2 mb-1">{title}</div>

                <div className="flex flex-wrap items-center text-[10px] text-gray-500 mb-1 leading-tight">
                    {location && <span className="truncate mr-1">📍 {location}</span>}
                    {duration && <span className="text-gray-400">| {duration}</span>}
                </div>

                <div className="flex items-center mb-1">
                    <span className="text-yellow-400 mr-1 text-[10px]">★★★★★</span>
                    <span className="font-semibold text-[10px] text-black mr-1">{rating}</span>
                    <span className="text-gray-500 text-[10px]">({ratingCount})</span>
                </div>

                <div className="flex items-end gap-1 mb-3">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-[#FFD600] leading-none">
                            {Number(price).toFixed(2)} ₼
                        </span>
                        {oldPrice && (
                            <span className="line-through text-gray-400 text-[10px]">
                                {Number(oldPrice).toFixed(2)} ₼
                            </span>
                        )}
                    </div>
                    {saved > 0 && (
                        <span className="text-red-600 font-medium text-[10px] ml-auto">
                            {saved} ₼
                        </span>
                    )}
                </div>

                <div className="mt-auto flex flex-col gap-1 pb-1">
                    <button
                        className="w-full border text-[10px] hover:bg-[#FFF283] hover:text-black border-[#FFCC00] rounded-lg px-2 py-1 flex items-center justify-center gap-1 font-semibold text-[#FFCC00]"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart();
                        }}
                    >
                        <FiShoppingCart size={12} />
                        Səbət
                    </button>
                    <button
                        className="w-full bg-[#FFF283] rounded-lg font-medium px-2 py-1 text-[10px]"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBuyNow();
                        }}
                    >
                        İndi al
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmallServiceCard;