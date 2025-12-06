import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearSupportMessages, postSupportAsync } from "../../redux/slices/supportSlice";
import validations from "./validation";

const Connection = () => {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let successMessage = useSelector((state) => state.support.successMessage);
    let error = useSelector((state) => state.support.error);
    let isLoading = useSelector((state) => state.support.isLoading);

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            phone: "",
            category: "",
            title: "",
            description: "",
            image: "",
        },
        validationSchema: validations,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
            dispatch(postSupportAsync(values))
                .unwrap()
                .then(() => {
                    formik.resetForm();
                    handleRemoveImage();
                })
                .catch(err => {
                    console.error("Support error:", err);
                });
        }
    });

    useEffect(() => {
        if (successMessage) {
            navigate("/accept-request");
        }
    }, [successMessage, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearSupportMessages());
        };
    }, [dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        console.log(e);
        if (file) {
            setSelectedImage(file);
            formik.setFieldValue("image", file);
            // Önizleme için URL oluştur
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        formik.setFieldValue("image", null);
        setImagePreview(null);
        // Input'u temizle
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="bg-[#FAFBFC] xl:px-24 sm:px-10 px-6 min-h-screen py-8">
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

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm">
                                {successMessage}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formik.values.fullname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="Adınız və soyadınız"
                                    />
                                    <div className="h-4">
                                        {formik.touched.fullname && formik.errors.fullname && (
                                            <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.fullname}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="email@example.com"
                                    />
                                    <div className="h-4">
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Telefon</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                        placeholder="+994 50 123 45 67"
                                    />
                                    <div className="h-4">
                                        {formik.touched.phone && formik.errors.phone && (
                                            <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium mb-1 text-sm">Kateqoriya *</label>
                                    <select
                                        name="category"
                                        value={formik.values.category}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none">
                                        <option>Müraciət növünü seçin</option>
                                        <option value="ümumi sual">Ümumi sual</option>
                                        <option value="şikayət">Şikayət</option>
                                        <option value="təklif">Təklif</option>
                                    </select>
                                    <div className="h-4">
                                        {formik.touched.category && formik.errors.category && (
                                            <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="image">Şəkil əlavə edin</label>
                                {!imagePreview ? (
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        // value={formik.values.image}
                                        // onBlur={formik.handleBlur}
                                        className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                    />
                                ) : (
                                    <div className="relative w-full border border-gray-200 rounded-lg p-2 bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Önizleme"
                                            className="w-full max-h-48 object-contain rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mövzu *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                    placeholder="Müraciətinizin mövzusu"
                                />
                                <div className="h-4">
                                    {formik.touched.title && formik.errors.title && (
                                        <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.title}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mesaj *</label>
                                <textarea
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full text-sm rounded-lg border border-gray-200 px-4 py-2 bg-gray-50 focus:outline-none"
                                    rows={4}
                                    placeholder="Müraciətinizi ətraflı yazın…"
                                />
                                <div className="h-4">
                                    {formik.touched.description && formik.errors.description && (
                                        <p className="text-red-500 text-[10px] mt-0.5">{formik.errors.description}</p>
                                    )}
                                </div>
                            </div>
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
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
                                type="submit"
                                disabled={isLoading}
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