import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import CardElement from '../serviceCard/CardElement'
import Pagination from "../pagination/Pagination";
import banner3 from "../images/banner-3.webp";
import { CiFilter } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { getCouponsAsync } from '../../redux/slices/couponSlice';
import { getRegionsAsync } from '../../redux/slices/regionSlice';
import { getCategoriesAsync } from '../../redux/slices/categorySlice';

const sortOptions = [
    { label: "Ən Populyar",             value: "" },
    { label: "Qiymət: Aşağıdan Yuxarı", value: "discount" },
    { label: "Qiymət: Yuxarıdan Aşağı", value: "-discount" },
    { label: "Əlifba Sırası",           value: "name" },
    { label: "Ən Yeni",                 value: "-created_at" },
];

const ITEMS_PER_PAGE = 10;

const AllServices = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { coupons, isLoading, error, count } = useSelector(state => state.coupon);
    const { regions } = useSelector(state => state.region);
    const { categories } = useSelector(state => state.category);

    // URL is the single source of truth for all filter state
    const q        = searchParams.get('q')        || '';
    const category = searchParams.get('category') || 'all';
    const region   = searchParams.get('region')   || 'all';
    const sort     = searchParams.get('sort')     || '';
    const page     = Number(searchParams.get('page') || 1);

    const setParam = (key, value, defaultValue) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value === defaultValue || value === '') {
                next.delete(key);
            } else {
                next.set(key, String(value));
            }
            // Reset page on any filter change
            if (key !== 'page') next.delete('page');
            return next;
        }, { replace: true });
    };

    useEffect(() => {
        dispatch(getRegionsAsync());
        dispatch(getCategoriesAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCouponsAsync({
            offset:      (page - 1) * ITEMS_PER_PAGE,
            category:    category === 'all' ? '' : category,
            shop_region: region   === 'all' ? '' : region,
            search:      q,
            ordering:    sort,
        }));
    }, [dispatch, page, category, region, q, sort]);

    const handlePageChange = (newPage) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (newPage > 1) next.set('page', String(newPage));
            else next.delete('page');
            return next;
        }, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const mappedCoupons = coupons.map(coupon => {
        const original = Number(coupon?.price || 0);
        const final    = Number(coupon?.discount || 0);
        const hasDiscount = original > 0 && final > 0 && final < original;
        return {
            id:             coupon.id,
            slug:           coupon.slug,
            title:          coupon.name,
            image:          coupon.images?.[0]?.image || coupon.shop?.images?.[0]?.image || banner3,
            isVip:          Boolean(coupon.is_vip),
            isPremium:      Boolean(coupon.is_premium),
            discountPercent: hasDiscount ? Math.round(((original - final) / original) * 100) : 0,
            oldPrice:       original,
            price:          hasDiscount ? final : original,
            saved:          hasDiscount ? (original - final) : 0,
            duration:       coupon.start_date && coupon.end_date
                ? `${Math.ceil((new Date(coupon.end_date) - new Date(coupon.start_date)) / 86400000)} gün`
                : "",
            rating:         4.5,
            ratingCount:    10,
            category:       coupon.category_name || '',
            location:       coupon.shop?.region?.name || 'Bakı',
            region:         coupon.shop?.region?.name || 'Bakı',
            shopName:       coupon.shop?.name || '',
            shopPhone:      coupon.shop?.phone || '',
        };
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    const isSearching = q.trim().length > 0;

    return (
        <div className="w-full bg-[#FAFBFC] py-2 sm:py-4 pb-8">

            {/* Filter bar */}
            <div className="xl:mx-24 sm:mx-10 mx-6 mb-4 sm:mb-6">
                <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl px-3 sm:px-6 py-3 shadow border border-gray-100">
                    <CiFilter size={20} className="text-[#FAD800]" />
                    <span className="font-semibold text-sm text-gray-700 mr-1">Filterlər:</span>

                    <select
                        className="px-2 py-1.5 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                        value={category}
                        onChange={e => setParam('category', e.target.value, 'all')}
                    >
                        <option value="all">Bütün kateqoriyalar</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        className="px-2 py-1.5 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                        value={region}
                        onChange={e => setParam('region', e.target.value, 'all')}
                    >
                        <option value="all">Bütün regionlar</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <select
                        className="px-2 py-1.5 text-xs rounded-lg border border-yellow-100 bg-[#F8F8F8] text-gray-700 font-medium focus:outline-none"
                        value={sort}
                        onChange={e => setParam('sort', e.target.value, '')}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results */}
            <div className="xl:mx-24 sm:mx-10 mx-6 bg-white rounded-2xl px-2 sm:px-4 md:px-8 py-4 sm:py-6 shadow border">
                <div className="mb-4 sm:mb-6">
                    <div className="text-lg sm:text-xl font-black mb-1">
                        {isSearching ? 'Axtarış nəticələri' : 'Bütün Məhsullar'}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                        {isSearching
                            ? <><span className="text-gray-700 font-medium">"{q}"</span> üçün {count} nəticə tapıldı</>
                            : <>{count} məhsul</>
                        }
                    </div>
                </div>

                <div className="border-t-2 pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {isLoading ? (
                        <div className="col-span-4 flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-[#FAD800] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="col-span-4 text-center text-red-500 py-8">{error}</div>
                    ) : mappedCoupons.length === 0 ? (
                        <div className="col-span-4 flex flex-col items-center py-12 text-gray-400">
                            <FiSearch size={40} className="mb-3 opacity-30" />
                            <div className="text-base font-medium">
                                {isSearching ? `"${q}" üçün nəticə tapılmadı` : 'Məhsul tapılmadı'}
                            </div>
                        </div>
                    ) : (
                        mappedCoupons.map(service => (
                            <CardElement key={service.id} {...service} />
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onChange={handlePageChange}
                        siblingCount={1}
                        boundaryCount={1}
                        className="mt-6"
                    />
                )}
            </div>
        </div>
    );
};

export default AllServices;
