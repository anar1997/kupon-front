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
                navigate("/about");
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
            <div className="absolute top-[77px] sm:top-12 left-0 z-50 bg-white shadow-md xl:mx-24 sm:mx-10 mx-6 pl-3 py-4 w-80 max-h-[75vh] xl:h-[500px]">
              <h1 className='px-4 mb-3 mt-2 font-black'>Kateqoriyalar</h1>
              <ul className="pr-2 space-y-1 max-h-[440px] overflow-y-auto">
                {categories.map((category, index) => {
                  const isOpenCat = openCategoryIndex === index;
                  return (
                    <li
                      key={index}
                      className={`px-0 cursor-pointer ${isOpenCat ? "text-red-600" : "hover:text-red-600"}`}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between mb-1 pr-2"
                        onClick={() => {
                          setOpenCategoryIndex(prev => (prev === index ? null : index));
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <img className='w-8 h-8 object-contain' src={category.icon} alt={category.name} />
                          <span>{category.name}</span>
                        </span>
                        <span className={`text-gray-400 transition-transform ${isOpenCat ? "rotate-90" : ""}`}>›</span>
                      </button>

                      {isOpenCat && (
                        <>
                          {/* Mobile / tablet: inline accordion (no absolute flyout) */}
                          <div className="xl:hidden pl-10 pr-3 pb-3 text-black">
                            <button
                              type="button"
                              className="text-sm font-semibold underline underline-offset-2"
                              onClick={() => {
                                const el = document.getElementById('customer-coupons');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                handleCategory(category.id);
                                onOpenCategory();
                                setOpenCategoryIndex(null);
                              }}
                            >
                              {category.name} (hamısı)
                            </button>

                            <div className="mt-3 space-y-3 max-h-[45vh] overflow-y-auto">
                              {(category?.subcategories || []).length === 0 && (
                                <div className="text-xs text-gray-400">Alt kateqoriya yoxdur</div>
                              )}
                              {(category?.subcategories || []).map((subcategory, subIndex) => (
                                <div key={subIndex} className="border-l-2 border-gray-100 pl-3">
                                  <button
                                    type="button"
                                    className="block text-sm font-bold text-gray-800"
                                    onClick={() => {
                                      const el = document.getElementById('customer-coupons');
                                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                                      handleCategory(subcategory.id);
                                      onOpenCategory();
                                      setOpenCategoryIndex(null);
                                    }}
                                  >
                                    {subcategory.name}
                                  </button>
                                  <ul className="mt-1 space-y-1">
                                    {(subcategory?.services || []).length === 0 && (
                                      <li className="text-xs text-gray-400">Xidmət yoxdur</li>
                                    )}
                                    {(subcategory?.services || []).map((service) => (
                                      <li key={service.id ?? service.name}>
                                        <button
                                          type="button"
                                          className="text-sm text-gray-600 hover:text-green-600"
                                          onClick={() => {
                                            const el = document.getElementById('customer-coupons');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            handleService(service.id);
                                            onOpenCategory();
                                            setOpenCategoryIndex(null);
                                          }}
                                        >
                                          {service.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Desktop (xl+): flyout panel on the right */}
                          <div className="hidden xl:block absolute left-full pt-4 w-[70vw] top-0 bg-white py-4 px-12 border-l-4 max-w-[66vw] h-[500px] overflow-y-auto z-40 shadow-md">
                            <button
                              type="button"
                              className="text-2xl font-bold justify-center px-4 flex items-center gap-2 w-full"
                              onClick={() => {
                                const el = document.getElementById('customer-coupons');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                handleCategory(category.id);
                                onOpenCategory();
                                setOpenCategoryIndex(null);
                              }}
                            >
                              {category.name}
                            </button>
                            <ul className="grid grid-cols-4 gap-6 p-4 w-full">
                              {(category?.subcategories || []).map((subcategory, subIndex) => (
                                <li key={subIndex} className="py-1">
                                  <button
                                    type="button"
                                    className="block mb-2 font-bold text-left hover:text-red-600"
                                    onClick={() => {
                                      const el = document.getElementById('customer-coupons');
                                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                                      handleCategory(subcategory.id);
                                      onOpenCategory();
                                      setOpenCategoryIndex(null);
                                    }}
                                  >
                                    {subcategory.name}
                                  </button>
                                  <ul className="space-y-1">
                                    {(subcategory?.services || []).length === 0 && (
                                      <li className="text-xs text-gray-400">Xidmət yoxdur</li>
                                    )}
                                    {(subcategory?.services || []).map((service) => (
                                      <li key={service.id ?? service.name}>
                                        <button
                                          type="button"
                                          className="text-sm text-gray-600 hover:text-green-600 text-left"
                                          onClick={() => {
                                            const el = document.getElementById('customer-coupons');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            handleService(service.id);
                                            onOpenCategory();
                                            setOpenCategoryIndex(null);
                                          }}
                                        >
                                          {service.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
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