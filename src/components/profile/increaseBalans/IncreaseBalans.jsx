import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getBalansAsync } from '../../../redux/slices/balansSlice'
import { useFormik } from 'formik'
import { clearError, postGiftCardAsync } from '../../../redux/slices/giftSlice'
import { getMyTransactionsAsync } from '../../../redux/slices/myTransactionSlice'

const IncreaseBalans = () => {
    const [showModal, setShowModal] = useState(false)
    const [priceModal, setPriceModal] = useState(false)
    const [amount, setAmount] = useState('')
    const [method, setMethod] = useState('card')

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { current_balance, total_income, total_expenses } = useSelector(state => state.balans);
    console.log(current_balance);
    const [successMessage, setSuccessMessage] = useState('')
    const { isLoading, error } = useSelector(state => state.gift);
    const { myTransactions, loading: transactionsLoading, error: transactionsError } = useSelector(state => state.myTransaction);
    console.log(myTransactions);
    useEffect(() => {
        dispatch(getBalansAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getMyTransactionsAsync());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            code: '',
        },
        onSubmit: (values) => {
            dispatch(postGiftCardAsync(values))
                .unwrap()
                .then((response) => {
                    // Başarı mesajı
                    setSuccessMessage('Hədiyyə kartı uğurla əlavə edildi!');

                    // Balansı yeniden çek
                    dispatch(getBalansAsync());

                    // Modal'ı kapat ve formu sıfırla
                    setTimeout(() => {
                        setPriceModal(false);
                        formik.resetForm();
                        setSuccessMessage('');
                    }, 2000); // 2 saniye sonra modal'ı kapat    
                })
                .catch((err) => {
                    console.error('Gift card error:', err);
                    // Hata zaten state'de, burada ekstra bir şey yapmaya gerek yok
                });
        }
    })

    // Modal kapanınca hataları temizle
    const handleCloseModal = () => {
        setPriceModal(false);
        formik.resetForm();
        setSuccessMessage('');
        dispatch(clearError());
    };

    return (
        <div className="w-full px-24 my-8">
            {/* Breadcrumb */}
            <div className="w-full">
                <div className="text-sm text-gray-600 mb-4">
                    <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                    <Link to="/profile" className="hover:underline">Profil</Link> &gt;{" "}
                    <span className="font-semibold text-black">Balans</span>
                </div>
                <button className="ml-auto mb-4 bg-black text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
                    onClick={() => setShowModal(true)}>
                    <span className="text-xl font-bold">+</span> Balans Artır
                </button>
            </div>
            {/* Stats */}
            <div className="flex gap-6 mb-6">
                <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 flex flex-col justify-between shadow">
                    <div className="text-gray-500 mb-2">Mövcud Balans</div>
                    <div className="text-4xl font-bold mb-2">{current_balance} ₼</div>
                    <div className="flex justify-end">
                        <span className="bg-black text-white rounded-full p-3">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><rect x="8" y="10" width="8" height="6" rx="2" fill="currentColor" /></svg>
                        </span>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 flex flex-col justify-between shadow">
                    <div className="text-gray-500 mb-2">Ümumi Daxilolma</div>
                    <div className="text-4xl font-bold mb-2">{total_income} ₼</div>
                    <div className="flex justify-end">
                        <span className="text-2xl">&#8599;</span>
                    </div>
                </div>
                <div className="flex-1 bg-red-100 rounded-xl p-8 flex flex-col justify-between shadow">
                    <div className="text-gray-500 mb-2">Ümumi Xərc</div>
                    <div className="text-4xl font-bold mb-2 text-red-600">{total_expenses} ₼</div>
                    <div className="flex justify-end">
                        <span className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center"></span>
                    </div>
                </div>
            </div>
            {/* Actions */}
            <div className="flex gap-6">
                <div className="flex-1 cursor-pointer bg-white rounded-xl p-6 flex flex-col items-center shadow"
                    onClick={() => setShowModal(true)}>
                    <span className="text-2xl font-bold mb-2">+</span>
                    <div className="font-semibold">Balans Artır</div>
                    <div className="text-gray-500 text-sm mt-1">Kart və ya e-wallet ilə</div>
                </div>
                <div onClick={() => setPriceModal(true)} className="flex-1 cursor-pointer bg-white rounded-xl p-6 flex flex-col items-center shadow">
                    <span className="text-2xl mb-2">&#127873;</span>
                    <div className="font-semibold">Hədiyyə Kartı</div>
                    <div className="text-gray-500 text-sm mt-1">Dostlarınıza göndərin</div>
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 flex flex-col items-center shadow">
                    <span className="text-2xl mb-2">&#8599;</span>
                    <div className="font-semibold">Cashback</div>
                    <div className="text-gray-500 text-sm mt-1">Kupon alışlarından qazanın</div>
                </div>
            </div>
            {/* Əməliyyat Tarixçəsi */}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
                <div className="text-lg font-semibold mb-6">Əməliyyat Tarixçəsi</div>
                <div className="flex flex-col gap-6">
                    {/* İşlem Listesi */}
                    {/* {[
                        {
                            icon: <span className="bg-gray-100 rounded-full p-3 text-xl">&#8594;</span>,
                            title: "Diş təmizliyi kuponu",
                            date: "2024-01-28 18:30",
                            amount: "-50 ₼",
                            amountClass: "text-red-600",
                        },
                        {
                            icon: <span className="bg-gray-100 rounded-full p-3 text-xl">&#8599;</span>,
                            title: "Balans artırılması",
                            date: "2024-01-25 16:00",
                            amount: "+100 ₼",
                            amountClass: "text-black",
                        },
                        {
                            icon: <span className="bg-gray-100 rounded-full p-3 text-xl">&#127873;</span>,
                            title: "Referal bonusu - Ayşa Həsənova",
                            date: "2024-01-20 14:15",
                            amount: "+25 ₼",
                            amountClass: "text-black",
                        },
                        {
                            icon: <span className="bg-gray-100 rounded-full p-3 text-xl">&#8594;</span>,
                            title: "Massaj xidməti kuponu",
                            date: "2024-01-18 20:45",
                            amount: "-80 ₼",
                            amountClass: "text-red-600",
                        },
                        {
                            icon: <span className="bg-gray-100 rounded-full p-3 text-xl">&#8599;</span>,
                            title: "İstifadə edilməyən kupon - geri qaytarılma",
                            date: "2024-01-15 13:20",
                            amount: "+30 ₼",
                            amountClass: "text-black",
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <div>
                                    <div className="font-semibold">{item.title}</div>
                                    <div className="text-gray-500 text-sm">{item.date}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`font-bold text-lg ${item.amountClass}`}>{item.amount}</div>
                                <span className="bg-[#FFF176] text-black rounded px-3 py-1 text-xs">Tamamlandı</span>
                            </div>
                        </div>
                    ))} */}
                    {transactionsLoading ? (
                        <div>Yüklənir...</div>
                    ) : transactionsError ? (
                        <div>Xəta baş verdi: {transactionsError}</div>
                    ) : myTransactions.length > 0 ? (
                        myTransactions.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="font-semibold">{item.transaction_type_display}</div>
                                        <div className="text-gray-500 text-sm">
                                            {new Date(item.created_at).toLocaleDateString('az-AZ', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}
                                            {', '}
                                            {new Date(item.created_at).toLocaleTimeString('az-AZ', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`font-bold text-lg ${item.amountClass}`}>{item.amount}</div>
                                    <span className="bg-[#FFF176] text-black rounded px-3 py-1 text-xs">
                                        {item.status_display}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Hələ ki, əməliyyat tarixçəniz yoxdur
                        </div>
                    )}
                </div>
                {/* Daha çox göstər butonu */}
                <div className="flex justify-center mt-6">
                    <button className="bg-white border rounded px-6 py-2 font-medium hover:bg-gray-100 transition">Daha Çox Göstər</button>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <div className="text-lg font-semibold mb-6">Balans Artır</div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Məbləğ (₼)</label>
                            <input
                                type="number"
                                className="w-full border rounded px-4 py-2"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-medium">Ödəniş Usulu</label>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2 border rounded px-4 py-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="method"
                                        checked={method === 'card'}
                                        onChange={() => setMethod('card')}
                                    />
                                    <span className="text-xl">&#128179;</span>
                                    Kredit/Debit Kart
                                </label>
                                <label className="flex items-center gap-2 border rounded px-4 py-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="method"
                                        checked={method === 'ewallet'}
                                        onChange={() => setMethod('ewallet')}
                                    />
                                    <span className="text-xl">&#128176;</span>
                                    E-wallet
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                className="flex-1 bg-gray-100 rounded px-4 py-2 font-semibold"
                                onClick={() => setShowModal(false)}
                            >
                                Ləğv et
                            </button>
                            <button
                                className="flex-1 bg-gray-500 text-white rounded px-4 py-2 font-semibold"
                                onClick={() => setShowModal(false)}
                            >
                                Artır
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* priceModal */}
            {priceModal && (
                <form onSubmit={formik.handleSubmit} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <div className="text-lg font-semibold mb-6">Hədiyyə kartı</div>

                        {/* Başarı mesajı */}
                        {successMessage && (
                            <div className="mb-4 bg-green-50 border border-green-200 rounded px-4 py-3 text-green-700 text-sm">
                                {successMessage}
                            </div>
                        )}

                        {/* Hata mesajı */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded px-4 py-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Kod</label>
                            <input
                                id='code'
                                name='code'
                                onChange={formik.handleChange}
                                value={formik.values.code}
                                onBlur={formik.handleBlur}
                                type="text"
                                className="w-full border rounded px-4 py-2"
                                placeholder="Hədiyyə kodu daxil edin"
                            />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                type="button"
                                className="flex-1 bg-gray-100 rounded px-4 py-2 font-semibold"
                                onClick={handleCloseModal}
                            >
                                Ləğv et
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gray-500 text-white rounded px-4 py-2 font-semibold"

                            >
                                {isLoading ? 'Yüklənir...' : 'Əlavə et'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default IncreaseBalans;