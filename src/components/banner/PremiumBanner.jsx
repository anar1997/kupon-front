import React, { useState, useEffect } from "react";
import banner1 from "../images/banner-1.webp";
import banner2 from "../images/banner-2.webp";
import banner3 from "../images/banner-3.webp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getPremiumCouponsAsync } from "../../redux/slices/premiumCouponSlice";

const offers = [
    {
        image: banner1,
        vip: true,
        discount: 20,
        oldPrice: 50,
        price: 30,
        title: "Şəhər Turu - Avtobusla",
        category: "City Tours",
        rating: 4.5,
        ratingCount: 132,
        duration: "120 gün",
        saved: 20,
    },
    {
        image: banner2,
        vip: false,
        discount: 15,
        oldPrice: 60,
        price: 45,
        title: "Premium Spa Paketi",
        category: "Spa & Wellness",
        rating: 4.8,
        ratingCount: 98,
        duration: "90 gün",
        saved: 15,
    },
    {
        image: banner3,
        vip: true,
        discount: 10,
        oldPrice: 100,
        price: 90,
        title: "Lüks Restoran Menyu",
        category: "Restoran",
        rating: 4.7,
        ratingCount: 54,
        duration: "60 gün",
        saved: 10,
    },
];

const PremiumBannerSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch();
    const { premiumCoupons } = useSelector((state) => state.premiumCoupon);
    const len = premiumCoupons?.length || 0;
    console.log(premiumCoupons);
    console.log(len);

    const formatDuration = (ms) => {
        if (!Number.isFinite(ms) || ms <= 0) return "";
        const minutes = Math.floor(ms / 60000);
        if (minutes < 60) return `${minutes} dəq`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} saat`;
        const days = Math.floor(hours / 24);
        return `${days} gün`;
    };

    useEffect(() => {
        dispatch(getPremiumCouponsAsync());
    }, [dispatch]);

    // Otomatik geçiş
    useEffect(() => {
        if (!len) { setCurrentIndex(0); return; }
        const t = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % len);
        }, 4000);
        return () => clearInterval(t);
    }, [len]);

    const handlePrevClick = () => {
        if (!len) return;
        setCurrentIndex((prev) => (prev - 1 + len) % len);
    };

    const handleNextClick = () => {
        if (!len) return;
        setCurrentIndex((prev) => (prev + 1) % len);
    };

    return (
        <div className="lg:h-[650px] bg-white rounded-2xl shadow border p-0 flex flex-col gap-0 overflow-hidden">
            {/* Üst başlıq */}
            <div className="text-center pt-4 bg-[#FFD436]">
                <div className="text-xs bg-[#FF9800] w-14 mx-auto px-2.5 py-1 rounded-md font-medium text-white mb-1">Xüsusi</div>
                <div className="text-base font-black mb-1">Həftənin Təklifləri</div>
                <div className="text-xs text-gray-500 font-normal mb-4">Məhdud müddətli</div>
            </div>

            {/* Yatay kaydırmalı kartlar */}
            <div className="relative w-full overflow-hidden mt-5">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        width: `${Math.max(len, 1) * 100}%`,
                        transform: `translateX(-${len ? currentIndex * (100 / len) : 0}%)`,
                    }}
                >
                    {premiumCoupons.map((premium, idx) => {
                        const priceNum = Number(premium?.coupon?.price) || 0;
                        const discountNum = Number(premium?.coupon?.discount) || 0;
                        const oldPrice = priceNum + discountNum;
                        const discountPct = oldPrice ? Math.round((discountNum / oldPrice) * 100) : 0;
                        const saved = discountNum;
                        const startMs = +new Date(premium?.start_time);
                        const endMs = +new Date(premium?.end_time);
                        const durationText = formatDuration(endMs - startMs);

                        return (
                            <div
                                key={idx}
                                className="w-full flex-shrink-0 flex flex-col 532:flex-row lg:flex-col 532:gap-8 sm:gap-20 md:gap-30 lg:gap-0 px-6"
                                style={{ width: `${100 / Math.max(len, 1)}%` }}
                            >
                                <div className="relative rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={premium?.coupon?.shop?.images?.[0]?.image || banner3}
                                        alt={premium?.coupon?.shop?.name || ""}
                                        className="w-full max-h-64 md:max-h-64 lg:h-44"
                                    />
                                    <span className="absolute top-2 left-2 bg-[#FF9800] text-white text-[10px] px-2 py-1 rounded font-medium shadow z-20">
                                        Premium
                                    </span>
                                    {discountPct > 0 && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded font-bold shadow">
                                            -{discountPct}%
                                        </span>
                                    )}
                                </div>

                                <div className="pb-4 flex-1 w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-base font-semibold text-center flex-1 sm:text-sm xs:text-xs">
                                            {premium?.coupon?.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 sm:text-[11px] xs:text-[10px]">
                                        <span>📍</span>
                                        <span>{premium?.coupon?.shop?.region?.name || ""}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:gap-1">
                                        <div className="flex items-center gap-1 text-yellow-500 text-xs">{"★".repeat(5)}</div>
                                        <span className="ml-2 text-xs text-gray-500 sm:ml-1 xs:ml-0">⏱ {durationText}</span>
                                    </div>
                                    <div className="flex flex-wrap items-end gap-1 mb-2 sm:gap-0">
                                        <span className="text-xl font-bold text-[#FAD800]">{priceNum.toFixed(2)} ₼</span>
                                        {oldPrice > 0 && <span className="line-through text-xs text-gray-400">{oldPrice.toFixed(2)} ₼</span>}
                                        {saved > 0 && <span className="text-red-600 text-xs ml-auto">{saved.toFixed(2)} ₼ qənaət</span>}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2 mt-6 md:mt-10 mb-2 sm:mt-2 xs:mt-1">
                                        <button className="flex-4 border text-xs hover:bg-[#FFF283] hover:text-black border-[#FFF283] rounded-lg px-2 py-2 flex items-center justify-center gap-2 font-semibold text-[#FAD800] sm:text-[11px] xs:text-[10px]">
                                            <FiShoppingCart size={16} /> <span className="text-[12px] sm:text-[11px] xs:text-[10px]">Səbətə əlavə et</span>
                                        </button>
                                        <button className="flex-1 bg-[#FFF283] rounded-lg font-medium px-2 py-2 sm:text-[11px] xs:text-[10px]">
                                            <span className="text-[12px] text-black sm:text-[11px] xs:text-[10px]">İndi al</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Slider göstəriciləri */}
                <div className="flex items-center justify-center gap-2 mb-2 mt-2">
                    {Array.from({ length: len }).map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-[#FFCC00]" : "bg-gray-300"}`}
                        />
                    ))}
                </div>
                {/* Hamısını Gör butonu */}
                <button className="w-full border rounded-lg py-2 font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                    Hamısını Gör <FaChevronRight size={16} />
                </button>
            </div>
            {/* Sol ok */}
            <button
                onClick={handlePrevClick}
                className="bg-white shadow absolute top-1/2 left-2 transform -translate-y-1/2  text-black p-2 rounded-full"
            >
                <FaChevronLeft size={18} />
            </button>

            {/* Sağ ok */}
            <button
                onClick={handleNextClick}
                className="bg-white shadow absolute top-1/2 right-2 transform -translate-y-1/2 text-black p-2 rounded-full"
            >
                <FaChevronRight size={18} />
            </button>
        </div>
    );
};

export default PremiumBannerSlider;