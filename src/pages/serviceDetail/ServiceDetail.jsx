import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import banner3 from "../../components/images/banner-3.webp";
import CardElement from "../../components/serviceCard/CardElement"; // ✅ Eklendi
import { useDispatch, useSelector } from "react-redux";
import { getCouponBySlugAsync, getCouponsAsync } from "../../redux/slices/couponSlice";

const ServiceDetail = () => {
    const dispatch = useDispatch();
    const { selectedCoupon, isLoading, coupons, error, count } = useSelector(state => state.coupon);

    const { slug } = useParams();
    const [mainImage, setMainImage] = useState(banner3);

    // Alternatif hizmetler pagination
    const [similarPage, setSimilarPage] = useState(1);
    const SIMILAR_PER_PAGE = 8;



    // Detay kupon
    useEffect(() => {
        dispatch(getCouponBySlugAsync(slug));
        setSimilarPage(1); // slug değişince alternatiflerin ilk sayfasına dön
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug, dispatch]);

    // Kupon liste (alternatifler) – filtre/sort barı yok, sadece sayfalama
    useEffect(() => {
        if (!selectedCoupon?.category) return;
        dispatch(getCouponsAsync({
            offset: (similarPage - 1) * SIMILAR_PER_PAGE,
            category: "",
            shop_region: "",
            category: selectedCoupon.category,
        }));
    }, [dispatch, similarPage, selectedCoupon?.category]);

    useEffect(() => {
        if (selectedCoupon) {
            const firstImg =
                selectedCoupon.images?.[0]?.image ||
                selectedCoupon.images?.[0] ||
                selectedCoupon.shop?.images?.[0]?.image ||
                null;
            setMainImage(firstImg);
        } else {
            setMainImage(banner3);
        }
    }, [selectedCoupon]);

     // Loading / null guard önce gelsin
    if (!selectedCoupon) {
        return <div className="p-10 text-center">Yüklənir...</div>;
    }

    // Map + mevcut kuponu çıkar
    const mappedCoupons = coupons
        .filter(c =>
            c.slug !== slug &&
            String(c.category) === String(selectedCoupon.category)
        )
        .map(coupon => ({
            id: coupon.id,
            slug: coupon.slug,
            title: coupon.name,
            image: coupon.shop?.images?.[0]?.image || banner3,
            isVip: coupon.is_active,
            isPremium: false,
            discountPercent: coupon.discount,
            oldPrice: Number(coupon.price) + Number(coupon.discount),
            price: Number(coupon.price),
            saved: coupon.discount,
            duration: coupon.start_date && coupon.end_date
                ? `${Math.ceil((new Date(coupon.end_date) - new Date(coupon.start_date)) / (1000 * 60 * 60 * 24))} gün`
                : "",
            rating: 4.5,
            ratingCount: 10,
            category: coupon.category || "Təhsil",
            location: coupon.shop?.region?.name || "Bakı",
            region: coupon.shop?.region?.name || "Bakı",
        }))

    // Basit sıralama: en yüksek indirim    
    const sorted = [...mappedCoupons].sort((a, b) => b.discountPercent - a.discountPercent);

    const totalPages = Math.ceil(count / SIMILAR_PER_PAGE);

    if (isLoading || !selectedCoupon) {
        return <div className="p-10 text-center">Yüklənir...</div>;
    }

    const {
        name,
        description,
        price,
        discount,
        category,
        stock,
        is_used,
        used_count,
        start_date,
        end_date,
    } = selectedCoupon;

    const priceNum = parseFloat(price) || 0;
    const discountNum = parseFloat(discount) || 0;
    const hasDiscount = discountNum > 0 && priceNum > 0;
    const discountedPrice = hasDiscount ? priceNum - discountNum : priceNum;

    const handleAddToCart = () => {
        alert("Səbətə əlavə edildi");
    };

    const handleBuyNow = () => {
        alert("Alış-verişə yönləndirildi");
    };

    return (
        <div className="bg-slate-100 xl:px-24 sm:px-10 px-6 p-4 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <Link to="#" className="hover:underline">{category}</Link> &gt;{" "}
                <span className="font-semibold text-black">{name}</span>
            </div>

            {/* Üst Bölüm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-6">
                <div className="bg-white p-2 sm:p-4 rounded-xl shadow h-full">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={mainImage}
                                alt="main"
                                className="w-full max-h-52 sm:max-h-[350px] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow flex flex-col p-4 sm:p-8">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h2 className="text-lg sm:text-2xl font-bold">{name}</h2>
                        {hasDiscount ? (
                            <>
                                <p className="text-lg sm:text-xl text-[#FAD800] font-bold">
                                    {discountedPrice.toFixed(2)} ₼
                                </p>
                                <p className="line-through text-gray-500">
                                    {priceNum.toFixed(2)} ₼
                                </p>
                                <p className="text-green-600 font-semibold">
                                    -{discountNum.toFixed(2)} ₼ endirim
                                </p>
                            </>
                        ) : (
                            <p className="text-lg sm:text-xl font-bold">
                                {priceNum.toFixed(2)} ₼
                            </p>
                        )}

                        <p className="text-sm sm:text-md text-gray-700">
                            {is_used ? `İstifadə sayı: ${used_count}` : `Stok: ${stock}`}
                        </p>
                        <p className="text-sm sm:text-md text-gray-700">
                            Başlanğıc: {new Date(start_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm sm:text-md text-gray-700">
                            Bitmə tarixi: {new Date(end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm sm:text-md text-slate-700">{description}</p>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-[#FAD800] text-black px-4 py-2 rounded hover:bg-[#a38f0f] flex items-center gap-2 justify-center"
                            >
                                <FiShoppingCart /> Səbətə əlavə et
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="bg-slate-200 text-black px-4 py-2 rounded hover:bg-slate-300"
                            >
                                İndi Al
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alternatif Hizmetler */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <h3 className="text-md sm:text-lg font-semibold mb-3">Alternativ Xidmətlər</h3>
                <div className="border-t-2 pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {isLoading ? (
                        <div className="col-span-4 text-center text-gray-400">Yüklənir...</div>
                    ) : error ? (
                        <div className="col-span-4 text-center text-red-500">{error}</div>
                    ) : sorted.length === 0 ? (
                        <div className="col-span-4 text-center text-gray-400">Kupon tapılmadı</div>
                    ) : (
                        sorted.map(service => (
                            <CardElement key={service.id} {...service} />
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
                        <button
                            className="px-2 sm:px-3 py-1 rounded border bg-white disabled:opacity-50 text-xs sm:text-sm"
                            onClick={() => setSimilarPage(p => Math.max(1, p - 1))}
                            disabled={similarPage === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm ${similarPage === idx + 1 ? 'bg-yellow-200 font-bold' : 'bg-white'}`}
                                onClick={() => setSimilarPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            className="px-2 sm:px-3 py-1 rounded border bg-white disabled:opacity-50 text-xs sm:text-sm"
                            onClick={() => setSimilarPage(p => Math.min(totalPages, p + 1))}
                            disabled={similarPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;