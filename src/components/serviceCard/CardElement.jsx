// CardElement.jsx
import React from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const CardElement = ({
    id,
    slug,
    title,
    image,
    isVip,
    isPremium,
    discountPercent,
    oldPrice,
    price,
    saved,
    location,
    duration,
    rating,
    ratingCount,
    region,
    category
}) => {
    console.log("CardElement props:", {id,
        slug,
        title,
        image,
        isVip,
        isPremium,
        discountPercent,
        oldPrice,
        price,
        saved,
        location,
        duration,
        rating,
        ratingCount,
        region,});
    const navigate = useNavigate();

    return (
        <div
            className="min-w-0 bg-white rounded-2xl shadow border transform transition duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/service/${slug}`)} // 👈 slug ilə yönləndirmə
        >
            <div className="relative rounded-t-2xl overflow-hidden h-40 sm:h-48 bg-gray-100 flex items-center justify-center min-w-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-40 sm:h-48 object-cover min-w-0"
                />
                {isVip && (
                    <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded font-medium shadow">VIP</span>
                )}
                {isPremium && (
                    <span className="absolute top-8 sm:top-10 left-2 bg-[#FF9800] text-white text-[10px] sm:text-xs px-2 py-1 rounded font-medium shadow">Premium</span>
                )}
                {discountPercent && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded font-bold shadow">
                        -{discountPercent}%
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-1 px-2 sm:px-5 py-3 sm:py-4 min-w-0">
                <div className="font-bold text-base sm:text-base xs:text-sm mb-1 truncate break-words">{title}</div>
                <div className="flex flex-wrap items-center text-gray-500 text-xs sm:text-[11px] xs:text-[10px] mb-2 min-w-0">
                    <span className="mr-2 truncate">📍 {location}</span>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <span>{duration}</span>
                    <span className='ml-2'>kategoriya: {category}</span>
                    {region && (
                        <>
                            <span className="mx-2 hidden sm:inline">|</span>
                            <span className="text-blue-500 truncate">{region}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-1 text-xs sm:text-[11px] xs:text-[10px]">★★★★★</span>
                    <span className="font-semibold text-xs sm:text-[11px] xs:text-[10px] text-black mr-1">{rating}</span>
                    <span className="text-gray-500 text-xs sm:text-[11px] xs:text-[10px]">({ratingCount})</span>
                </div>
                <div className="flex items-end gap-1 mb-6 sm:mb-10">
                    <div className='flex flex-col'>
                        <span className="text-xl font-bold text-[#FFD600] sm:text-lg xs:text-base">{price} ₼</span>
                        <span className="line-through text-gray-400 text-xs sm:text-[11px] xs:text-[10px]">{Number(oldPrice).toFixed(2)} ₼</span>
                    </div>
                    <span className="text-red-600 font-semibold text-sm sm:text-xs xs:text-[10px] ml-auto">{saved} ₼ qənaət</span>
                </div>
                <div className="flex gap-2 mt-auto mb-2 sm:mb-3 flex-col sm:flex-row">
                    <button
                        className="w-full border text-xs sm:text-[11px] xs:text-[10px] hover:bg-[#FFF283] hover:text-black border-[#FFCC00] rounded-lg px-2 py-2 flex items-center justify-center gap-2 font-semibold text-[#FFCC00]"
                        onClick={e => { e.stopPropagation(); }}
                    >
                        <FiShoppingCart size={16} />
                        Səbət
                    </button>
                    <button
                        className="w-full bg-[#FFF283] rounded-lg font-medium px-2 py-2 sm:text-[11px] xs:text-[10px]"
                        onClick={e => { e.stopPropagation(); }}
                    >
                        <span className="text-[12px] text-black sm:text-[11px] xs:text-[10px]">İndi al</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardElement;
