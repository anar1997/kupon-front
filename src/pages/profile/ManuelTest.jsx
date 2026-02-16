import React, { useEffect, useState } from 'react'
import ProfileAbout from '../../components/profile/profileAbout/ProfileAbout'
import Referal from '../../components/profile/referal/Referal'
import Settings from '../../components/profile/settings/Settings'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMeAsync } from '../../redux/slices/authSlice'

const ManuelTest = () => {
    const [activeTab, setActiveTab] = useState('profil')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const me = useSelector(state => state.auth.me);

    const fullName = me
        ? `${me.first_name || ''} ${me.last_name || ''}`.trim() || me.email
        : 'İstifadəçi';
    const email = me?.email || '';
    const avatarInitial = (me?.first_name || me?.email || 'A').charAt(0).toUpperCase();
    const membershipLabel = me?.is_guest ? 'Qonaq istifadəçi' : 'İstifadəçi';

    useEffect(() => {
        dispatch(getMeAsync());
    }, [dispatch]);



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
                    {avatarInitial}
                </div>
                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                    <div className="text-lg sm:text-xl font-semibold">{fullName}</div>
                    <div className="text-gray-500 text-xs sm:text-xs">{email}</div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mt-2 justify-center sm:justify-start">
                        <span className="bg-[#FAD800] text-black text-xs px-2 py-1 rounded">{membershipLabel}</span>
                    </div>
                </div>
                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 justify-center sm:justify-end">
                    <button
                        className="bg-white border border-gray-300 rounded px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium"
                        onClick={() => navigate('/seller')}
                    >
                        Satıcı paneli
                    </button>
                    <button
                        className="bg-[#FAD800] text-black rounded px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium flex items-center gap-1"
                        onClick={() => navigate('/my-cart')}
                    >
                        Səbətim
                    </button>
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
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'referal' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('referal')}
                        >
                            Referal
                        </button>
                        <button
                            className={`flex-1 py-1 text-xs rounded-full font-medium ${activeTab === 'settings' ? 'bg-white text-black shadow' : 'text-black'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </button>
                    </div>
                </div>
                {/* Tab Content */}
                {activeTab === 'profil' && <ProfileAbout />}
                {activeTab === 'referal' && <Referal />}
                {activeTab === 'settings' && <Settings />}
            </div>
        </div>
    )
}

export default ManuelTest