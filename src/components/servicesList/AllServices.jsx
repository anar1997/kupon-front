import React, { use, useEffect, useState } from 'react'
import CardElement from '../serviceCard/CardElement'
import banner3 from "../images/banner-3.webp";
import { IoFilterOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { getCouponsAsync } from '../../redux/slices/couponSlice';

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

const regionOptions = [
    "Bütün regionlar",
    "Sumqayıt",
    "Nəsimi",
    "Binəqədi",
    "Nərimanov",
    "Səbail",
    "Xətai",
    "Xəzər",
    "Suraxanı",
];

const sortOptions = [
    "Ən Populyar",
    "Qiymət: Aşağıdan Yuxarı",
    "Qiymət: Yuxarıdan Aşağı",
    "Ən Yüksək Reytinq",
    "Ən Çox Endirim",
    "Əlifba Sırası"
];

const services = [
    {
        id: 1,
        title: "İngilis Dili Kursu - 1 Modul",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 40,
        oldPrice: 200,
        price: 120,
        saved: 80,
        location: "English Academy",
        duration: "90 gün",
        rating: 4.7,
        ratingCount: 94,
        category: "Təhsil",
        region: "Nəsimi"
    },
    {
        id: 2,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: false,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Səbail"
    },
    {
        id: 3,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Sumqayıt"
    },
    {
        id: 4,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: false,
        isPremium: false,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Binəqədi"
    },
    {
        id: 5,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Nərimanov"
    },
    {
        id: 6,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Xətai"
    },
    {
        id: 7,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Xəzər"
    },
    {
        id: 8,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Xətai"
    },
    {
        id: 9,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Sumqayıt"
    },
    {
        id: 10,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 50,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Suraxanı"
    },
     {
        id: 11,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 60,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Suraxanı"
    },
     {
        id: 12,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 70,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Suraxanı"
    },
     {
        id: 13,
        title: "Professional Diş Təmizliyi",
        image: banner3,
        isVip: true,
        isPremium: true,
        discountPercent: 58,
        oldPrice: 120,
        price: 80,
        saved: 70,
        location: "Dr. Əli Həkimov klinikası",
        duration: "30 gün",
        rating: 4.5,
        ratingCount: 89,
        category: "Təhsil",
        region: "Suraxanı"
    },
    // ...daha fazla servis ekleyin
]

const AllServices = () => {
    const dispatch = useDispatch();
    const {coupons, isLoading, error} = useSelector(state => state.coupon);

    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [selectedRegion, setSelectedRegion] = useState(regionOptions[0]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        dispatch(getCouponsAsync());
    }, [dispatch]);
    
    // Filter
    let filtered = services.filter(s =>
        (selectedCategory === "Bütün kateqoriyalar" || s.category === selectedCategory) &&
        (selectedRegion === "Bütün regionlar" || s.region === selectedRegion)
    );

    // Sort
    if (selectedSort === "Qiymət: Aşağıdan Yuxarı") {
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (selectedSort === "Qiymət: Yuxarıdan Aşağı") {
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
    } else if (selectedSort === "Ən Yüksək Reytinq") {
        filtered = filtered.slice().sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "Ən Çox Endirim") {
        filtered = filtered.slice().sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (selectedSort === "Əlifba Sırası") {
        filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
    }

     // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Filter/sort dəyişəndə səhifəni sıfırla
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedRegion, selectedSort]);

    return (
       <div className="w-full min-h-screen bg-[#FAFBFC] py-2 sm:py-4">
    {/* Filter Bar */}
    <div className="xl:mx-24 sm:mx-10 mx-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-2 sm:px-6 py-2 sm:py-4 shadow border border-gray-100 gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <CiFilter size={22} className='text-[#FAD800]'/>
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
                    {regionOptions.map(opt => (
                        <option key={opt}>{opt}</option>
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
            <button className="border border-[#FFF283] text-[#FAD800] hover:text-black text-xs font-medium rounded-lg px-3 sm:px-5 py-2 bg-white hover:bg-[#FFF283] transition flex items-center gap-2 mt-2 sm:mt-0">
                <IoFilterOutline size={20} />
                Ətraflı Filterlər
            </button>
        </div>
    </div>

    {/* All Services Title */}
    <div className="xl:mx-24 sm:mx-10 mx-6 bg-white rounded-2xl px-2 sm:px-4 md:px-8 py-4 sm:py-6 shadow border">
        <div className="mb-4 sm:mb-6">
            <div className="text-lg sm:text-xl font-black mb-1">Bütün Kuponlar</div>
            <div className="text-gray-400 text-xs sm:text-sm mb-2">{filtered.length} nəticə tapıldı</div>
        </div>

        {/* Card List */}
        <div className="border-t-2 pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {paginated.map((service) => (
                <CardElement key={service.id} {...service} />
            ))}
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

export default AllServices