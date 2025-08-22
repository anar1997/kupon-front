import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Connection = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/accept-request");
        }, 2000); // 2 saniyə loading göstər
    };

    return (
        <div className="bg-[#FAFBFC] px-24 min-h-screen py-8">
             {/* Breadcrumb */}
            <div className="w-full">
                <div className="text-sm text-gray-600 mb-4">
                    <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                    <span className="font-semibold text-black">Bizimlə Əlaqə</span>
                </div>
            </div>
            <div className="mx-auto flex flex-col lg:flex-row gap-8">
                {/* Sol: Müraciət Formu */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow border p-8 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400 text-lg">💡</span>
                            <span className="text-lg font-semibold">Müraciət Formu</span>
                        </div>
                        <div className="text-gray-600 mb-6 text-sm">
                            Suallarınız, təklifləriniz və ya şikayətləriniz üçün aşağıdakı formu doldurun.
                        </div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="Adınız və soyadınız"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Email *</label>
                                    <input
                                        type="email"
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Telefon</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="+994 50 123 45 67"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Kateqoriya *</label>
                                    <select className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none">
                                        <option>Müraciət növünü seçin</option>
                                        <option>Ümumi sual</option>
                                        <option>Şikayət</option>
                                        <option>Təklif</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mövzu *</label>
                                <input
                                    type="text"
                                    className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                    placeholder="Müraciətinizin mövzusu"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mesaj *</label>
                                <textarea
                                    className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                    rows={4}
                                    placeholder="Müraciətinizi ətraflı yazın…"
                                />
                            </div>
                            <div className="bg-yellow-50 rounded-lg px-4 py-3 flex items-center gap-2 mt-2 mb-4">
                                <span className="text-yellow-400 text-xl">ℹ️</span>
                                <div>
                                    <span className="font-semibold text-sm">Cavab Müddəti</span>
                                    <div className="text-gray-700 text-sm">
                                        Müraciətlərə 24 saat ərzində cavab veririk. Təcili hallarda telefon vasitəsilə əlaqə saxlaya bilərsiniz.
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-200 text-sm hover:bg-yellow-300 transition rounded-lg py-3 font-semibold flex items-center justify-center gap-2 text-black"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full border-2 border-yellow-400 border-t-transparent h-5 w-5 inline-block"></span>
                                        Göndərilir...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm">✈️</span>
                                        Müraciəti Göndər
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Sağ: Əlaqə Məlumatları və Tez Əlaqə */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow border p-6">
                        <div className="text-lg font-semibold mb-4">Əlaqə Məlumatları</div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-yellow-200 rounded-full p-2 text-yellow-600 text-sm">📞</span>
                            <div>
                                <div className="font-medium text-sm">Telefon</div>
                                <div className="text-gray-700 text-sm">+994 12 555 55 55</div>
                                <span className="text-xs text-gray-500">24/7 Dəstək</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-yellow-200 rounded-full p-2 text-yellow-600 text-sm">📧</span>
                            <div>
                                <div className="font-medium text-sm">Email</div>
                                <div className="text-gray-700 text-sm">info@kuponum.az</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-yellow-200 rounded-full p-2 text-yellow-600 text-sm">📍</span>
                            <div>
                                <div className="font-medium text-sm">Ünvan</div>
                                <div className="text-gray-700 text-sm">Nizami küç. 203, Bakı şəhəri</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-yellow-200 rounded-full p-2 text-yellow-600 text-sm">⏰</span>
                            <div>
                                <div className="font-medium text-sm">İş Saatları</div>
                                <div className="text-gray-700 text-sm">B.e - Cümə: 09:00 - 18:00</div>
                                <div className="text-gray-500 text-sm">Şənbə: 10:00 - 16:00</div>
                            </div>
                        </div>
                    </div>
                    {/* FAQ */}
                    <div className="bg-white rounded-2xl shadow border p-6">
                        <div className="font-semibold mb-4">Tez-tez Soruşulan Suallar</div>
                        <div className="mb-4">
                            <div className="font-bold mb-1">Kupon necə istifadə edilir?</div>
                            <div className="text-gray-700 text-sm">
                                Kupon aldıqdan sonra email ünvanınıza QR kod göndərilir. Bu QR kodu işçi yerində göstərərək xidmətdən istifadə edə bilərsiniz.
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="font-bold mb-1">Kuponun müddəti bitərsə nə olur?</div>
                            <div className="text-gray-700 text-sm">
                                Kuponun müddəti bitdikdən sonra istifadə edilə bilməz. Müddət bitmədən istifadə etməyinizi tövsiyə edirik.
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="font-bold mb-1">Kupon geri qaytarıla bilərmi?</div>
                            <div className="text-gray-700 text-sm">
                                İstifadə edilməmiş kuponlar 7 gün ərzində geri qaytarıla bilər. Geri qaytarma üçün bizə müraciət edin.
                            </div>
                        </div>
                        <button className="w-full border rounded-lg py-2 font-semibold text-gray-700 flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 transition">
                            Bütün FAQ-ları Gör
                        </button>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-6">
                        <div className="font-semibold mb-4">Tez Əlaqə</div>
                        <button className="w-full flex items-center gap-2 border border-yellow-200 rounded-lg px-4 py-3 mb-3 bg-white hover:bg-yellow-100 transition font-medium text-gray-700">
                            <span className="text-xl">📞</span>
                            İndi Zəng Et
                        </button>
                        <button className="w-full flex items-center gap-2 border border-yellow-200 rounded-lg px-4 py-3 bg-white hover:bg-yellow-100 transition font-medium text-gray-700">
                            <span className="text-xl">📧</span>
                            Email Göndər
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Connection;