import React, { useState, useEffect } from "react";
import banner1 from "../images/banner-1.webp";
import banner2 from "../images/banner-2.webp";
import banner3 from "../images/banner-3.webp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

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

    // Otomatik geçiş
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    };

    const handleNextClick = () => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
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
                        width: `${offers.length * 100}%`,
                        transform: `translateX(-${currentIndex * (100 / offers.length)}%)`,
                    }}
                >
                    {offers.map((offer, idx) => (
                        <div
                            key={idx}
                            className="w-full flex-shrink-0 flex flex-col 532:flex-row lg:flex-col 532:gap-8 sm:gap-20 md:gap-30 lg:gap-0 px-6"
                            style={{ width: `${100 / offers.length}%` }}
                        >
                            <div className="relative rounded-xl overflow-hidden mb-4">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full max-h-64 md:max-h-64 lg:h-44"
                                />
                                {/* Premium badge (her zaman üstte) */}
                                {/* {offer.premium && ( */}
                                <span className="absolute top-2 left-2 bg-[#FF9800] text-white text-[10px] px-2 py-1 rounded font-medium shadow z-20">
                                    Premium
                                </span>
                                {/* )} */}
                                {/* VIP badge (altında) */}
                                {offer.vip && (
                                    <span className="absolute top-9 left-2 bg-pink-500 text-white text-[10px] px-2 py-1 rounded font-medium shadow z-10">
                                        VIP
                                    </span>
                                )}
                                {/* Discount badge */}
                                {offer.discount && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded font-bold shadow">
                                        -{offer.discount}%
                                    </span>
                                )}
                            </div>
                            {/* Kart detayları */}
                            <div className="pb-4 flex-1 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-base font-semibold text-center flex-1 sm:text-sm xs:text-xs">
                                        {offer.title}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 sm:text-[11px] xs:text-[10px]">
                                    <span>📍</span>
                                    <span>{offer.category}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-2 sm:gap-1">
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs sm:text-[11px] xs:text-[10px]">
                                        {"★".repeat(5)}
                                    </div>
                                    <span className="text-black font-semibold text-xs sm:text-[11px] xs:text-[10px]">{offer.rating}</span>
                                    <span className="text-gray-500 text-xs sm:text-[11px] xs:text-[10px]">({offer.ratingCount})</span>
                                    <span className="ml-2 text-xs text-gray-500 sm:ml-1 xs:ml-0">⏱ {offer.duration}</span>
                                </div>
                                <div className="flex flex-wrap items-end gap-1 mb-2 sm:gap-0">
                                    <span className="text-xl font-bold text-[#FAD800] sm:text-lg xs:text-base">{offer.price} ₼</span>
                                    <span className="line-through text-xs text-gray-400 sm:text-[11px] xs:text-[10px]">{offer.oldPrice} ₼</span>
                                    <span className="text-red-600 text-xs font-normal ml-auto sm:text-[11px] xs:text-[10px]">
                                        {offer.saved} ₼ qənaət
                                    </span>
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
                    ))}
                </div>
                {/* Slider göstəriciləri */}
                <div className="flex items-center justify-center gap-2 mb-2 mt-2">
                    {offers.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-[#FFCC00]" : "bg-gray-300"}`}
                        ></span>
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