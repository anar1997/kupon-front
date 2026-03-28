import React, { useState } from "react";
import ServicesList from "../../components/servicesList/ServicesList";
import AutoSlider from "../../components/banner/AutoSLider";
import PremiumBannerSlider from "../../components/banner/PremiumBanner";
import AllServices from "../../components/servicesList/AllServices";
import StaticKatalog from "../../components/katalog/StaticKatalog";
import categoryData from "../../components/data/CategoryData";
import SEOMeta from "../../components/SEOMeta";


const CustomerCoupons = () => {

  return (
    <div className="bg-[#F9FAFB]">
      <SEOMeta
        title="Bakının ən yaxşı kuponları"
        description="Bakı şəhərinin ən yaxşı kupon və endirimlərini bir araya gətirən platform. Sağlamlıq, gözəllik, yemək, əyləncə və daha çox sahədə ən sərfəli təkliflər."
        url="https://kuponum.az/"
      />
      {/* İçerik Alanı */}
      <div className="flex flex-col xl:mx-24 sm:mx-10 mx-6 lg:flex-row xl:flex-row items-start justify-between pt-5 pb-3 gap-5">
        {/* Sol Kısım - Banner (AutoSlider) */}
        <div className='relative z-10 hidden xl:block xl:w-[20%] sticky top-5 self-start'>
          <StaticKatalog categoryData={categoryData} />
        </div>
        
        {/* Orta Kısım - Banner (AutoSlider) */}
        <div className="relative w-full md:w-full lg:w-[70%] xl:w-[55%]">
          <AutoSlider />
        </div>

        {/* Sağ Kısım - Premium Banner (PremiumBannerSlider) */}
        <div className="relative w-full md:w-full lg:w-[30%] xl:w-[25%]">
          <PremiumBannerSlider />
        </div>
      </div>

      <div id="customer-coupons" className="">
        {/* <ServicesList /> */}
        <AllServices/>
      </div>

    </div>
  );
};

export default CustomerCoupons;
