import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import mobile from "../../components/images/mobile.webp";
import tree from "../../components/images/tree.jpg";
import ServiceCard from "../../components/serviceCard/ServiceCard";
import SmallServiceCard from "../../components/serviceCard/SmallServiceCard";

const fakeService = {
    id: 1,
    name: "Stomatoloq Xidməti",
    category: "Səhiyyə",
    subcategory: "Diş müalicəsi",
    images: [mobile, mobile, tree],
    price: 100,
    discountPercent: 20,
    couponPrice: 8,
    duration: "30 gün",
};

const similarServices = [
    { id: 2, name: "Ortodont", image: mobile, price: 120, discountPercent: 10, duration: "30 gün", },
    { id: 3, name: "İmplantasiya", image: mobile, price: 200, discountPercent: 15, duration: "30 gün", },
];

const ServiceDetail = () => {
    const { id } = useParams();
    const [mainImage, setMainImage] = useState(fakeService.images[0]);

    const discountedPrice =
        (fakeService.price * (100 - fakeService.discountPercent)) / 100;

    const handleAddToCart = () => {
        alert("Səbətə əlavə edildi");
    };

    const handleBuyNow = () => {
        alert("Alış-verişə yönləndirildi");
    };

    return (
        <div className="bg-slate-100 xl:px-24 sm:px-10 px-6 p-4 min-h-screen">
            {/* Breadcrumb */}
            <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
                <Link to="#" className="hover:underline">{fakeService.category}</Link> &gt;{" "}
                <Link to="#" className="hover:underline">{fakeService.subcategory}</Link> &gt;{" "}
                <span className="font-semibold text-black">{fakeService.name}</span>
            </div>

            {/* Ana İçerik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {/* Sol kutu - Resimler */}
                <div className="bg-white p-2 sm:p-4 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        {/* Thumbnail */}
                        <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 justify-center sm:justify-start">
                            {fakeService.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`thumb-${i}`}
                                    className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded cursor-pointer border ${mainImage === img ? "border-red-500" : "border-gray-300"}`}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>

                        {/* Büyük Resim */}
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={mainImage}
                                alt="main"
                                className="w-full max-h-52 sm:max-h-[350px] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Sağ kutu - Bilgiler + Butonlar + Benzerler */}
                <div className="bg-white rounded-xl shadow flex flex-col justify-between">
                    {/* Hizmet bilgileri */}
                    <div className="flex flex-col gap-3 sm:gap-4 m-4 sm:m-8">
                        <h2 className="text-lg sm:text-2xl font-bold">{fakeService.name}</h2>

                        {fakeService.discountPercent > 0 && (
                            <>
                                <p className="text-lg sm:text-xl text-[#FAD800] font-bold">
                                    {discountedPrice.toFixed(2)} ₼
                                </p>
                                <p className="line-through text-gray-500">
                                    {fakeService.price.toFixed(2)} ₼
                                </p>
                                <p className="text-green-600 font-semibold">
                                    -{fakeService.discountPercent}%
                                </p>
                            </>
                        )}

                        {/* Kullanım süresi */}
                        <p className="text-sm sm:text-md text-gray-700">
                            İstifadə müddəti: <strong> {fakeService.duration}</strong>
                        </p>

                        <p className="text-sm sm:text-md text-slate-700">
                            Bu kuponu <strong>{fakeService.couponPrice.toFixed(2)} ₼</strong> ilə al və endirimdən yararlan!
                        </p>

                        {/* Butonlar */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-[#FAD800] text-black px-4 py-2 rounded hover:bg-[#a38f0f] flex items-center gap-2 justify-center"
                            >
                                <FiShoppingCart /> Səbətə əlavə et
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="bg-slate-200 text-black px-4 py-2 rounded hover:bg-slate-300"
                            >
                                İndi Al
                            </button>
                        </div>
                    </div>
                    <hr className="mt-6 sm:mt-12 h-1 bg-slate-300" />
                    {/* Benzer Hizmetler */}
                    <div className="m-2 sm:m-4">
                        <h3 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3">Alternativ Xidmətlər</h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 thin-scrollbar">
                            {similarServices.map((srv) => (
                                <div
                                    key={srv.id}
                                    className="min-w-[200px] max-w-xs flex-shrink-0"
                                >
                                    <SmallServiceCard
                                        key={srv.id}
                                        id={srv.id}
                                        image={srv.image}
                                        name={srv.name}
                                        price={srv.price}
                                        discountPercent={srv.discountPercent}
                                        duration={srv.duration}
                                        onAddToCart={() => alert("sepete eklendi")}
                                        onBuyNow={() => alert("hemen al")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
