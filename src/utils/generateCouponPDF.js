import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



/**
 * Verilen kupon bilgileriyle bir PDF oluşturur ve indirir.
 * @param {Object} coupon - Kupon bilgileri (title, description, price, code, discount, expiresAt, category)
 */
export const generateCouponPDF = async (coupon) => {
  const pdf = new jsPDF();
  const qrDiv = document.getElementById(`qr-${coupon._id}`);

  if (!qrDiv) return alert("QR kod bulunamadı");

  // QR kodun canvas'a dönüştürülmesi
  const canvas = await html2canvas(qrDiv);
  const qrImage = canvas.toDataURL('image/png');

  const potentialSavings = (coupon.price * coupon.discount / 100).toFixed(2);
  const expiresAt = coupon.expiresAt
    ? new Date(coupon.expiresAt).toLocaleDateString('tr-TR')
    : 'Yoxdur';

  // Yazılar
  pdf.setFontSize(16);
  pdf.text(coupon.title || 'Kupon', 10, 20);

  pdf.setFontSize(12);
  pdf.text(`Açiqlama: ${coupon.description || '—'}`, 10, 30);
  pdf.text(`Kod: ${coupon.code}`, 10, 40);
  pdf.text(`Kateqoriya: ${coupon.category?.name || '—'}`, 10, 50);
  pdf.text(`Endirim: %${coupon.discount}`, 10, 60);
  pdf.text(`Qiymet: ${coupon.price} Azn`, 10, 70);
  pdf.text(`Potensial qazanc: ${potentialSavings} Azn`, 10, 80);
  pdf.text(`Bitme tarixi: ${expiresAt}`, 10, 90);

  // QR kod görselini ekle
  pdf.addImage(qrImage, 'PNG', 10, 100, 60, 60);

  pdf.save(`${coupon.title || 'kupon'}.pdf`);
};
