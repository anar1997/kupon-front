import Avtomobil from '../images/newFolder/Avtomobil.jpg';
import Tibb from '../images/newFolder/Tibb.jpg';
import RestoranKafe from '../images/newFolder/Restoran-Kafe.jpg';
import Saglamliq from '../images/newFolder/Sağlamlıq.jpg';
import Tehsil from '../images/newFolder/Təhsil.jpg';
import elaveSaheler from '../images/newFolder/Əlavə-sahələr.jpg';

const categoryData = [
  {
    name: "Səhiyyə",
    icon: <img src={Tibb} alt="Səhiyyə" className="w-12 h-12" />,
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
    icon: <img src={Avtomobil} alt="Avtomobil" className="w-12 h-12" />,
    subcategories: [
      { name: "Təmir", services: ["Yağ dəyişikliyi", "Motor təmiri"] }
    ]
  },
  {
    name: "Restoran və Kafe",
    icon: <img src={RestoranKafe} alt="Restoran və Kafe" className="w-12 h-12" />,
    subcategories: [
      { name: "Təmir", services: ["Yağ dəyişikliyi", "Motor təmiri"] }
    ]
  },
  {
    name: "Sağlamlıq",
    icon: <img src={Saglamliq} alt="Sağlamlıq" className="w-12 h-12" />,
    subcategories: [
      { name: "Fizioterapiya", services: ["Fizioterapist", "Reabilitasiya", "Masaj"] },
      { name: "Dəri müayinəsi", services: ["Dermatoloq", "Lazer müalicəsi"] }
    ]
  },
  {
    name: "Təhsil",
    icon: <img src={Tehsil} alt="Təhsil" className="w-12 h-12" />,
    subcategories: [
      { name: "Tədris", services: ["Müəllim", "Kurslar"] },
      { name: "Kurs İmtahanları", services: ["Hazırlıq", "Testlər"] }
    ]
  },
  {
    name: "Əlavə Sahələr",
    icon: <img src={elaveSaheler} alt="Əlavə Sahələr" className="w-12 h-12" />,
    subcategories: [
      { name: "Ev və Bağ", services: ["Təmizlik", "Bağ baxımı"] },
      { name: "Texniki Xidmətlər", services: ["Elektrikçi", "Santexnik"] },
      { name: "Digər Xidmətlər", services: ["Tərcümə"] }
    ]
  }
];

export default categoryData;