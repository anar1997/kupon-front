import React from 'react'
import { FiShoppingCart } from "react-icons/fi";
import banner3 from "../images/banner-3.webp";
import { useNavigate } from 'react-router-dom';

const CardElement = ({
    id,
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
}) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white rounded-2xl shadow border transform transition duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/service/${id}`)}
        >
            {/* Üst: Resim ve etiketler */}
            <div className="relative rounded-t-2xl overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48"
                />
                {isVip && (
                    <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] px-2 py-1 rounded font-medium shadow">VIP</span>
                )}
                {isPremium && (
                    <span className="absolute top-10 left-2 bg-[#FF9800] text-white text-[10px] px-2 py-1 rounded font-medium shadow">Premium</span>
                )}
                {discountPercent && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded font-bold shadow">
                        -{discountPercent}%
                    </span>
                )}
            </div>
            {/* Alt: Başlıq, info, qiymət, butonlar */}
            <div className="flex flex-col flex-1 px-5 py-4">
                <div className="font-bold text-base mb-1">{title}</div>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                    <span className="mr-2">📍 {location}</span>
                    <span className="mx-2">|</span>
                    <span>{duration}</span>
                </div>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-1">★★★★★</span>
                    <span className="font-semibold text-xs text-black mr-1">{rating}</span>
                    <span className="text-gray-500 text-xs">({ratingCount})</span>
                </div>
                <div className="flex items-end gap-1 mb-10">
                    <span className="text-xl font-bold text-[#FFD600]">{price} ₼</span>
                    <span className="line-through text-gray-400 text-xs">{oldPrice} ₼</span>
                    <span className="text-red-600 font-semibold text-sm ml-auto">{saved} ₼ qənaət</span>
                </div>
                <div className="flex gap-2 mt-auto mb-3">
                    <button
                        className="flex-4 border text-xs hover:bg-[#FFF283] hover:text-black border-[#FFCC00] rounded-lg px-2 py-2 flex items-center justify-center gap-2 font-semibold text-[#FFCC00]"
                        onClick={e => { e.stopPropagation(); /* Sepete ekle işlemi */ }}
                    >
                        <FiShoppingCart size={16} />
                        Səbətə əlavə et
                    </button>
                    <button className="flex-1 bg-[#FFF283] rounded-lg font-medium"
                        onClick={e => { e.stopPropagation(); /* Hemen al işlemi */ }}>
                        <span className="text-[12px] text-black">İndi al</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardElement;