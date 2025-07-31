import React from "react";
import ServiceCard from "../serviceCard/ServiceCard";
import mobile from '../images/mobile.webp';
import './servicesList.css'
// Örnek hizmet verisi
const services = [
    {
        id: 1,
        name: "Stomatoloq Xidməti",
        image: mobile,
        price: 100,
        discountPercent: 15,
        duration: "30 gün",
    },
    {
        id: 2,
        name: "Motor Təmir",
        image: mobile,
        price: 250,
        discountPercent: 20,
        duration: "30 gün",
    },
    {
        id: 3,
        name: "Üz Baxımı",
        image: mobile,
        price: 80,
        discountPercent: 10,
        duration: "30 gün",
    },
    {
        id: 3,
        name: "Üz Baxımı",
        image: mobile,
        price: 80,
        discountPercent: 10,
        duration: "30 gün",
    },
    {
        id: 3,
        name: "Üz Baxımı",
        image: mobile,
        price: 80,
        discountPercent: 10,
        duration: "30 gün",
    },
    {
        id: 3,
        name: "Üz Baxımı",
        image: mobile,
        price: 80,
        discountPercent: 10,
        duration: "30 gün",
    },
    {
        id: 3,
        name: "Üz Baxımı",
        image: mobile,
        price: 80,
        discountPercent: 10,
        duration: "30 gün",
    },
];

const ServicesList = () => {
    const handleAddToCart = (service) => {
        alert(`${service.name} sepete eklendi!`);
        // Burada sepet logic'i olacak (state, redux vb.)
    };

    const handleBuyNow = (service) => {
        alert(`${service.name} hemen satın alındı!`);
        // Direkt satın alma yönlendirmesi veya modal vb.
    };

    return (
        <div className="services-scroll-container">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    id={service.id}
                    image={service.image}
                    name={service.name}
                    price={service.price}
                    discountPercent={service.discountPercent}
                    duration={service.duration} // ✅ Buradan geliyor
                    onAddToCart={() => handleAddToCart(service)}
                    onBuyNow={() => handleBuyNow(service)}
                />
            ))}
        </div>
    );
};

export default ServicesList;
