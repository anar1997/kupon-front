import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import jsPDF from 'jspdf';

const SuccessPage = () => {
  const { couponId } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/coupons/${couponId}`)
      .then(res => setCoupon(res.data))
      .catch(() => alert('Kupon bilgisi alınamadı'));
  }, [couponId]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Kupon Başlığı: ${coupon.title}`, 10, 10);
    doc.text(`Açıklama: ${coupon.description}`, 10, 20);
    doc.text(`Kupon Kodu: ${coupon.code}`, 10, 30);
    doc.text(`İndirim: %${coupon.discount}`, 10, 40);
    doc.text(`Fiyat: ${coupon.price} ₼`, 10, 50);
    doc.save(`${coupon.title}_kupon.pdf`);
  };

  if (!coupon) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Satın Alma Başarılı!</h2>
      <p>Kuponunuz başarıyla satın alındı.</p>
      <p><strong>Kupon Kodu:</strong> {coupon.code}</p>
      <button onClick={generatePDF}>Kuponu PDF Olarak İndir</button>
      <button onClick={()=>navigate('/')}>Ana Sayfaya git</button>
    </div>
  );
};

export default SuccessPage;
