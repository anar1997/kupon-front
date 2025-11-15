import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesAsync } from '../../redux/slices/categorySlice';
import { getCouponsAsync } from '../../redux/slices/couponSlice';

const StaticKatalog = ({ categoryData }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const { categories, isLoading, error } = useSelector(state => state.category);
    const dispatch = useDispatch();

    const handleAllCategories = () => {
        dispatch(getCouponsAsync({
            offset: 0,
            category: '',
            shop_region: '',
            service: ''
        }))
    }

    const handleCategory = (categoryId) => {
        dispatch(getCouponsAsync({
            category: categoryId,
            service: '',       // service filtresini sıfırla
            // shop_region: '', // opsiyonel: diğer filtreleri de temizlemek istersen aç
            offset: 0
        }))
    }

    const handleService = (serviceId) => {
        dispatch(getCouponsAsync({
            service: serviceId,
            offset: 0
        }))
    }

    useEffect(() => {
        dispatch(getCategoriesAsync());
    }, [dispatch]);

    return (
        <div className="h-[650px] py-4 rounded-xl border-2 border-gray-200 flex flex-col gap-1 relative">
            <h1 className='px-4 mb-5 mt-2 font-black'>Kateqoriyalar</h1>
            <button className={'flex items-center text-sm w-full gap-3 px-5 py-2 rounded-lg transition hover:bg-[#FFF281]'}
                onClick={() => {
                    const el = document.getElementById('customer-coupons');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    handleAllCategories();
                }}>
                Bütün Kateqoriyalar
            </button>
            <ul className="flex flex-col gap-1">
                {categories.map((cat, idx) => (
                    <div
                        key={cat.id ?? idx}
                        className="relative text-sm"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        <button
                            className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition
                ${hoveredIdx === idx ? 'bg-[#FFF281] shadow font-semibold' : 'hover:bg-[#FFFBEA]'}
              `}
                        >
                            <img className='w-8 h-8  object-contain' src={cat.icon} alt="" />
                            <span onClick={() => {
                                const el = document.getElementById('customer-coupons');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                handleCategory(cat.id);
                            }} className={`flex-1 text-left ${hoveredIdx === idx ? 'text-gray-900' : 'text-gray-700'}`}>
                                {cat.name}
                            </span>
                        </button>
                        {/* Alt menyu popup */}
                        {hoveredIdx === idx && (
                            <div className="absolute left-full  text-xs top-0 pt-4 bg-white rounded-xl shadow-lg min-w-[220px] py-3 px-4 z-20 flex flex-col">
                                <h1 onClick={() => {
                                    const el = document.getElementById('customer-coupons');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    handleCategory(cat.id);
                                }} className="text-base font-bold justify-center px-4 flex items-center gap-2 cursor-pointer">
                                    {cat.name}
                                </h1>
                                <div className="overflow-y-auto max-h-[300px] pb-2 scrollbar-thin scrollbar-thumb-[#A9A9A9] scrollbar-track-[#FFFDEB]">
                                    {(cat.subcategories || []).map((sub) => (
                                        <div key={sub.id} className="mb-3">
                                            <div onClick={() => {
                                                const el = document.getElementById('customer-coupons');
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                handleCategory(sub.id);
                                            }} className="font-semibold text-gray-800 mb-1 cursor-pointer">{sub.name}</div>
                                            <ul className="flex flex-col">
                                                {(sub.services || []).map((service) => (
                                                    <li
                                                        onClick={() => {
                                                            const el = document.getElementById('customer-coupons');
                                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                            handleService(service.id);
                                                        }}
                                                        key={service.id ?? service.name}
                                                        className="text-gray-700 text-xs cursor-pointer hover:text-[#FFD600]"
                                                    >
                                                        {service.name ?? String(service)}
                                                    </li>
                                                ))}
                                                {(!sub.services || sub.services.length === 0) && (
                                                    <li className="text-gray-400 text-xs">Xidmət yoxdur</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <hr className="my-2" />
                                <button className="text-[#FFD600] text-sm font-semibold hover:underline w-full text-left px-1 py-1 sticky bottom-0 bg-white">
                                    Hamısını gör
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default StaticKatalog;