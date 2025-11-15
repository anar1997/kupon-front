import React, { useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAsync } from "../../redux/slices/categorySlice";
import { getCouponsAsync } from "../../redux/slices/couponSlice";

const Katalog = ({ onOpenCategory, isOpen, onCategoryHover, hoveredCategory }) => {
  const navigate = useNavigate();
  // const [activeCategory, setActiveCategory] = useState(null);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // yeni: tıklanan kategori
  const katalogRef = useRef(null);
  const overlayRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { categories, isLoading, error } = useSelector(state => state.category);
  const dispatch = useDispatch();

  console.log(categories);

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

  // Katalog açıkken dışarı tıklayınca kapat (içine tıklayınca kapanmasın)
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (!isOpen) return;
      if (katalogRef.current && !katalogRef.current.contains(event.target)) {
        onOpenCategory();
        setOpenCategoryIndex(null);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickAnywhere);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [isOpen, onOpenCategory]);

  return (
    <div className="relative">
      {/* Arka Plan Karartma */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      <div className="bg-white shadow-sm relative z-50" ref={katalogRef}>
        <div className="flex xl:mx-24 sm:mx-10 mx-6 flex-col sm:flex-row md:items-center justify-between py-2 border-t border-gray-200">
          {/* Sol: Logo + 'kataloq' (Büyük ekranlarda görünsün) */}
          <div className="flex flex-row gap-5 md:gap-14"
            onClick={(e) => {
              // Sadece boş alana tıklandıysa kapat
              if (isOpen && e.target === e.currentTarget) {
                onOpenCategory();
                setOpenCategoryIndex(null);
              }
            }}>
            <div
              className="flex items-center gap-2 cursor-pointer z-20 hidden lg:flex"
              onClick={onOpenCategory}
            >
              <BiCategory size={20} className={isOpen ? "text-black" : "text-gray-500"} />
              <span className={`text-xs font-semibold ${isOpen ? "text-black" : "text-gray-800"}`}>
                Kataloq
              </span>
            </div>
            <button
              className="lg:flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-black transition"
              onClick={() => {
                navigate("/");
                if (isOpen) onOpenCategory();
              }}
              style={{ minHeight: "40px" }}
            >
              <span>Ana Səhifə</span>
            </button>
            <button
              className="lg:flex hidden md:block items-center gap-2 text-xs font-semibold text-gray-800 hover:text-black transition"
              onClick={() => {
                if (isOpen) onOpenCategory();
              }}
              style={{ minHeight: "40px" }}
            >
              <span>Haqqımızda</span>
            </button>
            <button
              className="lg:flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-black transition"
              style={{ minHeight: "40px" }}
              onClick={() => {
                navigate("/connection");
                if (isOpen) onOpenCategory();
              }}
            >
              <span>Əlaqə</span>
            </button>
          </div>

          {/* Sepet ikonu */}
          <div className="hidden lg:block">
            {/* <button className="relative mr-12" onClick={() => navigate("/my-cart")}>
            <FiShoppingCart size={28} />
          </button> */}
            <p className="text-xs text-gray-400">Müştəri xidməti:
              <span className="ml-2 text-xs text-[#FAD800]">*1234</span></p>
          </div>

          {/* Küçük Ekranda (Kategori ve Sepet ikonu) */}
          <div className="lg:hidden flex items-center gap-4">
            <BiCategory size={20} className={isOpen ? "text-black" : "text-gray-500"} onClick={onOpenCategory} />
            <FiShoppingCart size={20} onClick={() => navigate("/my-cart")} />
            {/* Mobile: yalnız search icon */}
            <div className="md:hidden flex items-center justify-center">
              {!isSearchOpen ? (
                <button onClick={() => setIsSearchOpen(true)}>
                  <FiSearch className="text-black" size={20} />
                </button>
              ) : (
                <div className="flex items-center border border-[#FFF281] rounded-lg bg-[#FFFDED] px-1.5 w-full">
                  <FiSearch className="text-gray-400 ml-2" size={20} />
                  <input
                    type="text"
                    placeholder="Kupon və ya xidmət axtarın..."
                    className="flex-1 text-xs max-w-[140px] sm:max-w-[200px] bg-transparent outline-none px-3 py-1 text-gray-700"
                    autoFocus
                  />
                  <button
                    className="bg-[#FFF281] text-xs font-medium text-black rounded-md px-2 py-1 sm:px-3 sm:py-1"
                    style={{ height: "22px" }}
                  >
                    Axtar
                  </button>
                  <button className="ml-2" onClick={() => setIsSearchOpen(false)}>
                    &#10005;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Kategoriler Menü (Dikey) */}
          {isOpen && (
            <div className="absolute top-[77px] sm:top-12 left-0 z-50 bg-white shadow-md xl:mx-24 sm:mx-10 mx-6 pl-3 py-4 w-80 h-[500px]">
              <h1 className='px-4 mb-5 mt-2 font-black'>Kateqoriyalar</h1>
              <ul>
                {categories.map((category, index) => {
                  const isOpenCat = openCategoryIndex === index;
                  return (
                    <li
                      key={index}
                      className={`px-0 cursor-pointer ${isOpenCat ? "text-red-600" : "hover:text-red-600"}`}
                      onClick={() => {
                        setOpenCategoryIndex(prev => prev === index ? null : index);
                      }}
                    >
                      <div className="flex items-center mb-1">
                        <img className='w-8 h-8  object-contain' src={category.icon} alt="" />
                        <span>{category.name}</span>
                      </div>

                      {isOpenCat && (
                        <div className="absolute left-0 xl:left-full pt-4 w-80 top-0 bg-white xl:py-4 xl:px-12 border-l-4 xl:max-w-[66vw] xl:w-[70vw] h-[500px] z-40 shadow-md">
                          <h1 className="text-2xl font-bold justify-center px-4 flex items-center gap-2" onClick={() => {
                            const el = document.getElementById('customer-coupons');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            handleCategory(category.id);
                            onOpenCategory();
                          }}>
                            {category.name}
                          </h1>
                          <ul className="grid grid-cols-1 gap-2 p-4 w-full xl:grid-cols-4 sm:grid-cols-2">
                            {category?.subcategories.map((subcategory, subIndex) => (
                              <li key={subIndex} className="py-1 cursor-pointer">
                                <strong className="block mb-2" onClick={() => {
                                  const el = document.getElementById('customer-coupons');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                  handleCategory(subcategory.id);
                                  onOpenCategory();
                                }}>{subcategory.name}</strong>
                                <ul>
                                  {(subcategory?.services || []).length === 0 && (
                                    <li className="text-xs text-gray-400">Xidmət yoxdur</li>
                                  )}
                                  {(subcategory?.services || []).map((service) => (
                                    <li
                                      key={service.id ?? service.name}
                                      className="text-sm text-gray-600 hover:text-green-500"
                                      onClick={() => {
                                        const el = document.getElementById('customer-coupons');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        handleService(service.id);
                                        onOpenCategory();
                                      }}
                                    >
                                      {service.name}
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Katalog;