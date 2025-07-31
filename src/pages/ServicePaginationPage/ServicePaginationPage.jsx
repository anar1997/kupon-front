import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ServiceCard from "../../components/serviceCard/ServiceCard";
import mobile from "../../components/images/mobile.webp";

const allServices = [
  { id: 1, name: "Stomatoloq", image: mobile, price: 100, discountPercent: 15, duration: "30", isVip: true },
  { id: 2, name: "Stomatoloq", image: mobile, price: 120, discountPercent: 10, duration: "30", isVip: false },
  { id: 3, name: "Stomatoloq", image: mobile, price: 110, discountPercent: 12, duration: "30", isVip: false },
  { id: 4, name: "Stomatoloq", image: mobile, price: 90, discountPercent: 5, duration: "30", isVip: false },
  { id: 5, name: "Stomatoloq", image: mobile, price: 130, discountPercent: 25, duration: "30", isVip: false },
  { id: 6, name: "Stomatoloq", image: mobile, price: 80, discountPercent: 23, duration: "30", isVip: false },
  { id: 7, name: "Stomatoloq", image: mobile, price: 150, discountPercent: 30, duration: "30", isVip: true },
  { id: 8, name: "Üz baxımı", image: mobile, price: 150, discountPercent: 30, duration: "30", isVip: true },
];

const ITEMS_PER_PAGE = 6;

const ServicePaginationPage = () => {
  const { serviceName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("name");

  const filtered = allServices
    .filter((service) =>
      service.name.toLowerCase() === decodeURIComponent(serviceName).toLowerCase()
    )
    .sort((a, b) => {
      switch (sortType) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.id - a.id;
        case "expensive":
          return b.price - a.price;
        case "cheap":
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const vipServices = filtered.filter(service => service.isVip);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = (service) => {
    alert(`${service.name} sepete eklendi!`);
  };

  const handleBuyNow = (service) => {
    alert(`${service.name} satın alındı!`);
  };

  return (
    <div className="px-4 py-6 mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">Ana Səhifə</Link> &gt;{" "}
        <span className="font-semibold text-black">{decodeURIComponent(serviceName)}</span>
      </div>

      <h1 className="text-2xl font-bold mb-12 sm:ml-10 md:ml-16 lg:ml-28">
        {decodeURIComponent(serviceName)} xidmətləri
      </h1>

      <div className="flex flex-col gap-16 justify-center sm:mx-10 md:mx-16 lg:mx-28 xl:flex-col sm:flex-col lg:flex-col sm:gap-16 items-start">
        {/* Sıralama Alanı */}
        <div className="flex flex-row justify-between">
          <h2>VİP Elanlar</h2>
          <div className="w-64 flex flex-row gap-2">
            <label className="block mb-2 font-medium text-gray-700">Sıralamaq:</label>
            <select
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Ada görə (A-Z)</option>
              <option value="newest">Ən yeni əlavə olunan</option>
              <option value="expensive">Ən bahalı</option>
              <option value="cheap">Ən ucuz</option>
            </select>
          </div>
        </div>


        {/* Hizmet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 gap-10">
          {vipServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  image={service.image}
                  name={service.name}
                  price={service.price}
                  discountPercent={service.discountPercent}
                  duration={service.duration}
                  onAddToCart={() => handleAddToCart(service)}
                  onBuyNow={() => handleBuyNow(service)}
                />
              ))}
        </div>
      </div>       

      <div className="flex flex-col gap-16 justify-center sm:mx-10 md:mx-16 lg:mx-28 xl:flex-col sm:flex-col lg:flex-col sm:gap-16 items-start">
        {/* Sıralama Alanı */}
        <div className="flex flex-row justify-between">
          <h2>Bütün Elanlar</h2>
          <div className="w-64 flex flex-row gap-2">
            <label className="block mb-2 font-medium text-gray-700">Sıralamaq:</label>
            <select
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Ada görə (A-Z)</option>
              <option value="newest">Ən yeni əlavə olunan</option>
              <option value="expensive">Ən bahalı</option>
              <option value="cheap">Ən ucuz</option>
            </select>
          </div>
        </div>


        {/* Hizmet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 gap-10">
          {currentItems.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              image={service.image}
              name={service.name}
              price={service.price}
              discountPercent={service.discountPercent}
              duration={service.duration}
              onAddToCart={() => handleAddToCart(service)}
              onBuyNow={() => handleBuyNow(service)}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 border rounded ${currentPage === i + 1
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServicePaginationPage;
