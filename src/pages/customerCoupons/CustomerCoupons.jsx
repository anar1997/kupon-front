import React, { useState } from "react";
import PartnerIconsBanner from "../../components/banner/PartnerIconsBanner";
import ServicesList from "../../components/servicesList/ServicesList";
import AutoSlider from "../../components/banner/AutoSLider";
import PremiumBannerSlider from "../../components/banner/PremiumBanner";
import AllServices from "../../components/servicesList/AllServices";
import StaticKatalog from "../../components/katalog/StaticKatalog";
import categoryData from "../../components/data/CategoryData";


const CustomerCoupons = () => {

  return (
    <div className="bg-[#F9FAFB]">
      {/* İçerik Alanı */}
      <div className="flex flex-col xl:mx-24 sm:mx-10 mx-6 lg:flex-row xl:flex-row items-start justify-between pt-5 pb-3 gap-5">
        {/* Sol Kısım - Banner (AutoSlider) */}
        <div className='relative z-10 hidden xl:block xl:w-[20%]'>
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

      {/* Partner Hizmet İkonları Banner */}
      <div className="pt-2 pb-14">
        <PartnerIconsBanner />
      </div>
    </div>
  );
};

export default CustomerCoupons;
