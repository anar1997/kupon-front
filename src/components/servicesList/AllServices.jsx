import React, { useEffect, useState } from 'react'
import CardElement from '../serviceCard/CardElement'
import banner3 from "../images/banner-3.webp";
import { CiFilter } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { getCouponsAsync } from '../../redux/slices/couponSlice';
import { getRegionsAsync } from '../../redux/slices/regionSlice';

const categoryOptions = [
    "Bütün kateqoriyalar",
    "Sağlamlıq",
    "Gözəllik",
    "Yemək",
    "Əyləncə",
    "Alış-veriş",
    "Səyahət",
    "Fitness",
    "Təhsil"
];

const sortOptions = [
    "Ən Populyar",
    "Qiymət: Aşağıdan Yuxarı",
    "Qiymət: Yuxarıdan Aşağı",
    "Ən Yüksək Reytinq",
    "Ən Çox Endirim",
    "Əlifba Sırası"
];

const ITEMS_PER_PAGE = 10;

const AllServices = () => {
    const dispatch = useDispatch();
    const { coupons, isLoading, error, count } = useSelector(state => state.coupon);
    const { regions } = useSelector(state => state.region);

    console.log(coupons);

    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [selectedRegion, setSelectedRegion] = useState("Bütün regionlar");
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getRegionsAsync());
    }, [dispatch]);

    const handleRegion = () => {
        dispatch(getCouponsAsync({
            offset: (currentPage - 1) * ITEMS_PER_PAGE,

        }))
    }

    const getBackendCategory = () => selectedCategory === "Bütün kateqoriyalar" ? "" : selectedCategory;
    const getBackendRegion = () => selectedRegion === "Bütün regionlar" ? "" : selectedRegion;

    useEffect(() => {
        dispatch(getCouponsAsync({
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            // shop_region: getBackendRegion(),
        }));
    }, [dispatch, currentPage, selectedCategory, selectedRegion]);

    const mappedCoupons = coupons.map(coupon => ({
        id: coupon.id,
        slug: coupon.slug, // ✅ SLUG əlavə edildi
        title: coupon.name,
        image: coupon.shop?.images?.[0]?.image || banner3, // əgər coupon.images varsa, onu istifadə edə bilərsən
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
    }));

    let sorted = [...mappedCoupons];
    console.log(sorted);
    if (selectedSort === "Qiymət: Aşağıdan Yuxarı") {
        sorted = sorted.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "Qiymət: Yuxarıdan Aşağı") {
        sorted = sorted.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "Ən Yüksək Reytinq") {
        sorted = sorted.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "Ən Çox Endirim") {
        sorted = sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (selectedSort === "Əlifba Sırası") {
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedRegion, selectedSort]);

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return (
        <div className="w-full min-h-screen bg-[#FAFBFC] py-2 sm:py-4">
            {/* Filter Bar */}
            <div className="xl:mx-24 sm:mx-10 mx-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-2 sm:px-6 py-2 sm:py-4 shadow border border-gray-100 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <CiFilter size={22} className='text-[#FAD800]' />
                        <span className="font-semibold text-base sm:text-lg text-gray-700">Filterlər:</span>
                        <select
                            className="ml-2 px-2 py-2 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            {categoryOptions.map(opt => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                        <select
                            className="ml-2 px-2 py-2 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                            value={selectedRegion}
                            onChange={e => setSelectedRegion(e.target.value)}
                        >
                            <option key="all">Bütün regionlar</option>
                            {regions.map(region => (
                                <option key={region.id}>{region.name}</option>
                            ))}
                        </select>
                        <select
                            className="ml-2 px-2 py-2 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                            value={selectedSort}
                            onChange={e => setSelectedSort(e.target.value)}
                        >
                            {sortOptions.map(opt => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* All Services Title */}
            <div className="xl:mx-24 sm:mx-10 mx-6 bg-white rounded-2xl px-2 sm:px-4 md:px-8 py-4 sm:py-6 shadow border">
                <div className="mb-4 sm:mb-6">
                    <div className="text-lg sm:text-xl font-black mb-1">Bütün Kuponlar</div>
                    <div className="text-gray-400 text-xs sm:text-sm mb-2">{count} nəticə tapıldı</div>
                </div>

                {/* Card List */}
                <div className="border-t-2 pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {(isLoading || regions.length === 0) ? (
                        <div className="col-span-4 text-center text-gray-400">Yüklənir...</div>
                    ) : error ? (
                        <div className="col-span-4 text-center text-red-500">{error}</div>
                    ) : sorted.length === 0 ? (
                        <div className="col-span-4 text-center text-gray-400">Kupon tapılmadı</div>
                    ) : (
                        sorted.map((service) => (
                            <CardElement key={service.id} {...service} />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
                        <button
                            className="px-2 sm:px-3 py-1 rounded border bg-white disabled:opacity-50 text-xs sm:text-sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm ${currentPage === idx + 1 ? 'bg-yellow-200 font-bold' : 'bg-white'}`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            className="px-2 sm:px-3 py-1 rounded border bg-white disabled:opacity-50 text-xs sm:text-sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllServices;
