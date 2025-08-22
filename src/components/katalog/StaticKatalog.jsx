import React, { useState } from 'react';

const StaticKatalog = ({ categoryData }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <div className="h-[650px] py-4 rounded-xl border-2 border-gray-200 flex flex-col gap-1 relative">
            <h1 className='px-4 mb-5 mt-2 font-black'>Kateqoriyalar</h1>
            <button className={'flex items-center text-sm w-full gap-3 px-5 py-2 rounded-lg transition hover:bg-[#FFF281]'}
                onClick={() => {
                    const el = document.getElementById('customer-coupons');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                Bütün Kateqoriyalar
            </button>
            <ul className="flex flex-col gap-1">
                {categoryData.map((cat, idx) => (
                    <div
                        key={idx}
                        className="relative text-sm"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        <button
                            className={`flex items-center w-full gap-3 px-4 py-2 rounded-lg transition
                ${hoveredIdx === idx ? 'bg-[#FFF281] shadow font-semibold' : 'hover:bg-[#FFFBEA]'}
              `}
                        >
                            <span className='text-xs'>{cat.icon}</span>
                            <span className={`flex-1 text-left ${hoveredIdx === idx ? 'text-gray-900' : 'text-gray-700'}`}>
                                {cat.name}
                            </span>
                        </button>
                        {/* Alt menyu popup */}
                        {hoveredIdx === idx && (
                            <div className="absolute left-full  text-xs top-0 pt-4 bg-white rounded-xl shadow-lg min-w-[220px] py-3 px-4 z-20 flex flex-col">
                                <div className="overflow-y-auto max-h-[300px] pb-2 scrollbar-thin scrollbar-thumb-[#A9A9A9] scrollbar-track-[#FFFDEB]">
                                    {cat.subcategories.map((sub, subIdx) => (
                                        <div key={subIdx} className="mb-3">
                                            <div className="font-semibold text-gray-800 mb-1">{sub.name}</div>
                                            <ul className="flex flex-col">
                                                {sub.services.map((service, sIdx) => (
                                                    <li key={sIdx} className="text-gray-700 text-xs cursor-pointer hover:text-[#FFD600]">
                                                        {service}
                                                    </li>
                                                ))}
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