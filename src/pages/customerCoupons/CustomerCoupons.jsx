import React, { useState } from "react";
import PartnerIconsBanner from "../../components/banner/PartnerIconsBanner";
import ServicesList from "../../components/servicesList/ServicesList";
import AutoSlider from "../../components/banner/AutoSLider";
import PremiumBannerSlider from "../../components/banner/PremiumBanner";


const CustomerCoupons = () => {

  return (
    <div className="bg-slate-100">
      <div className="sticky top-0 z-50 bg-white">

      </div>

      {/* İçerik Alanı */}
      <div className="flex flex-col md:flex-row px-4 md:px-16 py-10 gap-12">
        {/* Sol Kısım - Banner (AutoSlider) */}
        <div className="md:w-7/12 w-full relative z-10">
          <AutoSlider />
        </div>

        {/* Sağ Kısım - Premium Banner (PremiumBannerSlider) */}
        <div className="md:w-5/12 w-full relative z-10">
          <PremiumBannerSlider />
        </div>
      </div>

      {/* Partner Hizmet İkonları Banner */}
      <div className="px-4">
        <PartnerIconsBanner />
      </div>

      <div className="mt-12">
        <ServicesList />
      </div>
    </div>
  );
};

export default CustomerCoupons;
