import React, { useState, useEffect } from "react";
import banner1 from "../images/banner-1.webp";
import banner2 from "../images/banner-2.webp";
import banner3 from "../images/banner-3.webp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Ok ikonlarını import ettik


const PremiumBannerSlider = () => {
    const banners = [banner1, banner2, banner3];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Resimler arasında geçiş yapmak için setInterval kullanıyoruz
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 3000); // 3 saniyede bir geçiş yapacak

        return () => clearInterval(interval); // Komponent unmount olduğunda interval'ı temizle
    }, []);

    // Sol ok butonuna tıklayınca resimleri geriye doğru kaydırma
    const handlePrevClick = () => {
        setCurrentIndex((currentIndex - 1 + banners.length) % banners.length);
    };

    // Sağ ok butonuna tıklayınca resimleri ileri doğru kaydırma
    const handleNextClick = () => {
        setCurrentIndex((currentIndex + 1) % banners.length);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg  border border-yellow-500">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img
                            src={banner}
                            alt={`Slider Banner ${index + 1}`}
                            className="w-full h-[450px]"
                        />
                    </div>
                ))}
            </div>

            {/* Sol ok */}
            <button
                onClick={handlePrevClick}
                className="absolute top-1/2 left-2 transform -translate-y-1/2  text-white p-2 rounded-full"
            >
                <FaChevronLeft size={24} />
            </button>

            {/* Sağ ok */}
            <button
                onClick={handleNextClick}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2 rounded-full"
            >
                <FaChevronRight size={24} />
            </button>
        </div>
    );
};

export default PremiumBannerSlider;
