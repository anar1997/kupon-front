import React, { useState } from 'react'
import ProfileAbout from '../../components/profile/profileAbout/ProfileAbout'
import Balans from '../../components/profile/balans/Balans'
import Referal from '../../components/profile/referal/Referal'
import Tenzim from '../../components/profile/tenzim/Tenzim'
import { Link, useNavigate } from 'react-router-dom'

const ManuelTest = () => {
    const [activeTab, setActiveTab] = useState('profil')
    const navigate = useNavigate();

    return (
        <div className="flex flex-col xl:px-24 sm:px-10 px-6 gap-8 items-center w-full my-8">
            {/* Breadcrumb */}
            <div className="w-full">
                <div className="text-sm text-gray-600">
                    <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                    <span className="font-semibold text-black">Profilim</span>
                </div>
            </div>

            {/* Profile Card */}
            <div className="w-full bg-gradient-to-r from-[#F9F9F4] to-[#FAF9EE] rounded-xl flex flex-col sm:flex-row items-center px-4 sm:px-8 py-4 sm:py-6 shadow gap-4 sm:gap-0">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFF176] flex items-center justify-center text-black text-2xl sm:text-3xl font-bold mb-4 sm:mb-0 sm:mr-6">
                    A
                </div>
                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                    <div className="text-lg sm:text-xl font-semibold">Anar Quliyev</div>
                    <div className="text-gray-500 text-xs sm:text-xs">abbasquliyev111@gmail.com</div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mt-2 justify-center sm:justify-start">
                        <span className="bg-[#FAD800] text-black text-xs px-2 py-1 rounded">Premium Üzv</span>
                        <span className="flex items-center gap-1 font-semibold text-[#FAD800] text-sm">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">₼</text></svg>
                            150 ₼
                        </span>
                    </div>
                </div>
                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 justify-center sm:justify-end">
                    <button
                        className="bg-white border border-gray-300 rounded px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium"
                        onClick={() => navigate('/coupons')}
                    >
                        Kuponlarım
                    </button>
                    <button
                        className="bg-[#FAD800] text-black rounded px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium flex items-center gap-1"
                        onClick={() => navigate('/increase-balans')}
                    >
                        <span className="text-lg font-bold">+</span> Balans
                    </button>
                </div>
            </div>
            {/* Stats */}
            <div className="w-full flex flex-col 367:flex-row justify-between gap-6">
                <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-xl text-[#FAD800] font-bold">12</div>
                    <div className="text-gray-500 text-xs mt-2">Alınmış Kupon</div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-xl text-[#4CAF50] font-bold">185 ₼</div>
                    <div className="text-gray-500 text-xs mt-2">Qənaət</div>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="text-xl text-[#FF9800] font-bold">3</div>
                    <div className="text-gray-500 text-xs mt-2">Dəvət Edilən</div>
                </div>
            </div>
            {/* Tabs */}
            <div className="w-full mx-24 py-3 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex w-full gap-2 bg-[#ECECF0] rounded-full p-1">
                        <button
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'profil' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('profil')}
                        >
                            Profil
                        </button>
                        <button
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'balans' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('balans')}
                        >
                            Balans
                        </button>
                        <button
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'referal' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('referal')}
                        >
                            Referal
                        </button>
                        <button
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'tenzim' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('tenzim')}
                        >
                            Tənzimlər
                        </button>
                    </div>
                </div>
                {/* Tab Content */}
                {activeTab === 'profil' && <ProfileAbout />}
                {activeTab === 'balans' && <Balans />}
                {activeTab === 'referal' && <Referal />}
                {activeTab === 'tenzim' && <Tenzim />}
            </div>
        </div>
    )
}

export default ManuelTest