import React, { useState, useEffect } from "react";

// Örnek resimler
import banner1 from "../images/banner-1.webp";
import banner2 from "../images/banner-2.webp";
import banner3 from "../images/banner-3.webp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Ok ikonlarını import ettik
import { getBannerCouponsAsync } from "../../redux/slices/bannerSlice";
import { useDispatch, useSelector } from "react-redux";


const AutoSlider = () => {
  const banners = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { bannerCoupons } = useSelector((state) => state.bannerCoupon);
  const len = bannerCoupons?.length || 0;
  console.log(bannerCoupons);
  console.log(len);


  // 2) Veri çekme effect'i
  useEffect(() => {
    dispatch(getBannerCouponsAsync());
  }, [dispatch]);

  // 3) Autoplay: len>1 iken kur
  useEffect(() => {
    if (len < 2) { setCurrentIndex(0); return; }
    const t = setInterval(() => setCurrentIndex((p) => (p + 1) % len), 5000);
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
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${Math.max(len, 1) * 100}%`,
          transform: `translateX(-${len ? currentIndex * (100 / len) : 0}%)`,
        }}
      >
        {bannerCoupons.map((b, idx) => (
          <div
            key={b.id ?? idx}
            className="flex-shrink-0"
            style={{ width: `${100 / Math.max(len, 1)}%` }} // kritik: her slide genişliği
          >
            <img
              src={b.image}
              alt={b.title || `Banner ${idx + 1}`}
              className="w-full lg:h-[650px]"
            />
          </div>
        ))}
      </div>

      {/* Sol ok */}
      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 left-2 transform -translate-y-1/2  text-black p-2 rounded-full"
      >
        <FaChevronLeft size={12} />
      </button>

      {/* Sağ ok */}
      <button
        onClick={handleNextClick}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black p-2 rounded-full"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

export default AutoSlider;
