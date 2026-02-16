export const normalizePhoneForWhatsApp = (rawPhone) => {
  if (!rawPhone) return null;
  const trimmed = String(rawPhone).trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  // Convert leading 00 -> international prefix
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Heuristic for AZ local numbers starting with 0
  if (digits.startsWith("0")) digits = `994${digits.slice(1)}`;

  return digits;
};

export const buildWhatsAppUrl = (phoneDigits, text) => {
  if (!phoneDigits) return null;
  const encoded = encodeURIComponent(text || "");
  return `https://wa.me/${phoneDigits}?text=${encoded}`;
};

export const buildShopOrderMessage = ({ shopName, lines, total, customerName, customerPhone }) => {
  const header = `Salam! Kuponum vasitəsilə sifariş vermək istəyirəm.\nMağaza: ${shopName || "Mağaza"}`;
  const itemsText = lines?.length ? `\n\nMəhsullar:\n${lines.join("\n")}` : "";
  const totalText = `\n\nCəmi: ${Number(total || 0).toFixed(2)} ₼`;

  const hasCustomer = Boolean(customerName || customerPhone);
  const customerText = hasCustomer
    ? `\n\nMüştəri:\nAd: ${customerName || "-"}\nTelefon: ${customerPhone || "-"}`
    : "";

  const footer = "\n\nZəhmət olmasa mövcudluğu və çatdırılma/alqı-satqı detallarını yazın.";
  return `${header}${itemsText}${totalText}${customerText}${footer}`;
};
