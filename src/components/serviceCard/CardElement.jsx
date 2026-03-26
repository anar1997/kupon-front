// CardElement.jsx
import React from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync, fetchCartAsync } from '../../redux/slices/cartSlice';
import { normalizePhoneForWhatsApp, buildWhatsAppUrl } from '../../utils/whatsapp';

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
    category,
    shopName,
    shopPhone,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading: isCartLoading } = useSelector((state) => state.cart);

    const handleBuyNow = async (e) => {
        e.stopPropagation();

        const phoneDigits = normalizePhoneForWhatsApp(shopPhone);
        const safeSlug = encodeURIComponent(String(slug || ''));
        const text = `Salam! ${shopName || 'Mağaza'} üçün elanla maraqlanıram.\nMəhsul: ${title}\nLink: ${window.location.origin}/service/${safeSlug}`;
        const url = buildWhatsAppUrl(phoneDigits, text);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            className="min-w-0 bg-white rounded-2xl shadow border transform transition duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer flex flex-col h-full"
            onClick={() => navigate(`/service/${encodeURIComponent(String(slug || ''))}`)} // 👈 slug ilə yönləndirmə
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
                {discountPercent > 0 && (
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
                    {category && (
                        <span className='ml-2'>Kateqoriya: {category}</span>
                    )}
                    {region && (
                        <>
                            <span className="mx-2 hidden sm:inline">|</span>
                            <span className="text-blue-500 truncate">{region}</span>
                        </>
                    )}
                </div>
                {/* <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-1 text-xs sm:text-[11px] xs:text-[10px]">★★★★★</span>
                    <span className="font-semibold text-xs sm:text-[11px] xs:text-[10px] text-black mr-1">{rating}</span>
                    <span className="text-gray-500 text-xs sm:text-[11px] xs:text-[10px]">({ratingCount})</span>
                </div> */}
                <div className="flex items-end gap-1 mb-6 sm:mb-10">
                    <div className='flex flex-col'>
                        <span className="text-xl font-bold text-[#FFD600] sm:text-lg xs:text-base">{Number(price).toFixed(2)} ₼</span>
                        {Number(oldPrice) > Number(price) && (
                            <span className="line-through text-gray-400 text-xs sm:text-[11px] xs:text-[10px]">{Number(oldPrice).toFixed(2)} ₼</span>
                        )}
                    </div>
                    {Number(saved) > 0 && (
                        <span className="text-red-600 font-semibold text-sm sm:text-xs xs:text-[10px] ml-auto">{Number(saved).toFixed(2)} ₼ qənaət</span>
                    )}
                </div>
                <div className="flex gap-2 mt-auto mb-2 sm:mb-3 flex-col sm:flex-row">
                    <button
                        className="w-full border text-xs sm:text-[11px] xs:text-[10px] hover:bg-[#FFF283] hover:text-black border-[#FFCC00] rounded-lg px-2 py-2 flex items-center justify-center gap-2 font-semibold text-[#FFCC00] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={e => {
                            e.stopPropagation();
                            // ✅ Login kontrolu olmadan direkt əlavə et
                            dispatch(addToCartAsync({ couponId: id, quantity: 1 }));
                        }}
                        disabled={isCartLoading}
                    >
                        <FiShoppingCart size={16} />
                        {isCartLoading ? "Əlavə olunur..." : "Səbət"}
                    </button>
                    <button
                        className="w-full bg-[#FFF283] rounded-lg font-medium px-2 py-2 sm:text-[11px] xs:text-[10px]"
                        onClick={handleBuyNow}
                    >
                        <span className="text-[12px] text-black sm:text-[11px] xs:text-[10px]">WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardElement;
