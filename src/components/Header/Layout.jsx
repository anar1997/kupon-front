import React, { useState } from 'react'
import Header from './Header'
import Katalog from '../katalog/Katalog'
import { FaTooth, FaCar } from "react-icons/fa";

const categoryData = [
    {
      name: "Səhiyyə",
      icon: <FaTooth size={20} />,
      subcategories: [
        { name: "Diş müalicəsi", services: ["Stomatoloq", "Ortodont", "İmplantasiya"] },
        { name: "Kosmetoloji", services: ["Üz baxımı", "Lazer epilyasiya"] },
        { name: "Fizioterapiya", services: ["Fizioterapist", "Reabilitasiya", "Masaj"] },
        { name: "Göz xəstəlikləri", services: ["Optometrist", "Laser göz əməliyyatı"] },
        { name: "Həkim müayinəsi", services: ["Ümumi müayinə", "Dəri müayinəsi"] }
      ],
    },
    {
      name: "Avtomobil",
      icon: <FaCar size={20} />,
      subcategories: [
        { name: "Təmir", services: ["Yağ dəyişikliyi", "Motor təmiri"] }
      ]
    }
  ];

const Layout = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
    const handleKatalogClick = () => {
      setIsCatalogOpen(!isCatalogOpen);
    };
  
    const handleCategoryHover = (category) => {
      setHoveredCategory(category);
    };
  return (
    <div>
        <Header/>
        <Katalog
            onOpenCategory={handleKatalogClick}
            isOpen={isCatalogOpen}
            categoryData={categoryData}
            onCategoryHover={handleCategoryHover}
            hoveredCategory={hoveredCategory}
        />
    </div>
  )
}

export default Layout