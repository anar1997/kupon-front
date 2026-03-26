import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import banner3 from "../../components/images/banner-3.webp";
import CardElement from "../../components/serviceCard/CardElement"; // ✅ Eklendi
import { useDispatch, useSelector } from "react-redux";
import { getCouponBySlugAsync, getCouponsAsync } from "../../redux/slices/couponSlice";
import { addToCartAsync } from "../../redux/slices/cartSlice";
import { normalizePhoneForWhatsApp, buildWhatsAppUrl } from "../../utils/whatsapp";
import Pagination from "../../components/pagination/Pagination";

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
            image: coupon.images?.[0]?.image || coupon.shop?.images?.[0]?.image || banner3,
            isVip: Boolean(coupon.is_vip),
            isPremium: Boolean(coupon.is_premium),
            discountPercent: (() => {
                const original = Number(coupon?.price || 0);
                const final = Number(coupon?.discount || 0);
                if (original > 0 && final > 0 && final < original) {
                    return Math.round(((original - final) / original) * 100);
                }
                return 0;
            })(),
            oldPrice: Number(coupon?.price || 0),
            price: (() => {
                const original = Number(coupon?.price || 0);
                const final = Number(coupon?.discount || 0);
                return original > 0 && final > 0 && final < original ? final : original;
            })(),
            saved: (() => {
                const original = Number(coupon?.price || 0);
                const final = Number(coupon?.discount || 0);
                return original > 0 && final > 0 && final < original ? (original - final) : 0;
            })(),
            duration: coupon.start_date && coupon.end_date
                ? `${Math.ceil((new Date(coupon.end_date) - new Date(coupon.start_date)) / (1000 * 60 * 60 * 24))} gün`
                : "",
            rating: 4.5,
            ratingCount: 10,
            category: coupon.category_name || (coupon.category ? `#${coupon.category}` : "Təhsil"),
            location: coupon.shop?.region?.name || "Bakı",
            region: coupon.shop?.region?.name || "Bakı",
            shopName: coupon.shop?.name || "",
            shopPhone: coupon.shop?.phone || "",
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

    const categoryLabel = selectedCoupon?.category_name || (category ? `#${category}` : '');

    const priceNum = parseFloat(price) || 0;
    const discountNum = parseFloat(discount) || 0;
    // Backend semantics: `discount` is the final price.
    const hasDiscount = discountNum > 0 && priceNum > 0 && discountNum < priceNum;
    const discountedPrice = hasDiscount ? discountNum : priceNum;
    const savedAmount = hasDiscount ? (priceNum - discountNum) : 0;

    const handleAddToCart = () => {
        dispatch(addToCartAsync({ couponId: selectedCoupon.id, quantity: 1 }));
    };

    const handleBuyNow = () => {
        const shopName = selectedCoupon?.shop?.name || 'Mağaza';
        const phoneDigits = normalizePhoneForWhatsApp(selectedCoupon?.shop?.phone);
        const text = `Salam! ${shopName} üçün elanla maraqlanıram.\nMəhsul: ${selectedCoupon?.name || ''}\nLink: ${window.location.href}`;
        const url = buildWhatsAppUrl(phoneDigits, text);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="bg-slate-100 xl:px-24 sm:px-10 px-6 p-4 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <Link to="#" className="hover:underline">{categoryLabel}</Link> &gt;{" "}
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

                    {Array.isArray(selectedCoupon?.images) && selectedCoupon.images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-auto">
                            {selectedCoupon.images
                                .map((img) => img?.image || img)
                                .filter(Boolean)
                                .map((src, idx) => (
                                    <button
                                        key={`${src}-${idx}`}
                                        type="button"
                                        onClick={() => setMainImage(src)}
                                        className={`border rounded-lg p-1 bg-white ${src === mainImage ? 'border-yellow-400' : 'border-gray-200'}`}
                                    >
                                        <img src={src} alt={`thumb-${idx}`} className="h-16 w-16 object-cover rounded" />
                                    </button>
                                ))}
                        </div>
                    )}
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
                                    -{savedAmount.toFixed(2)} ₼ endirim
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

                        {/* Product Attributes */}
                        {selectedCoupon.attributes?.length > 0 && (
                            <div className="mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Xüsusiyyətlər</h4>
                                <table className="w-full text-sm border-collapse">
                                    <tbody>
                                        {selectedCoupon.attributes.map((attr) => (
                                            <tr key={attr.id} className="border-b last:border-0">
                                                <td className="py-1.5 pr-4 text-gray-500 font-medium w-1/3">{attr.name}</td>
                                                <td className="py-1.5 text-gray-800">{attr.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

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
                                WhatsApp
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
                        <div className="col-span-4 text-center text-gray-400">Məhsul tapılmadı</div>
                    ) : (
                        sorted.map(service => (
                            <CardElement key={service.id} {...service} />
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={similarPage}
                        totalPages={totalPages}
                        onChange={setSimilarPage}
                        siblingCount={1}
                        boundaryCount={1}
                        className="mt-6"
                    />
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;