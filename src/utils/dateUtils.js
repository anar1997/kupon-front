//dateUtils.js
export const getRemainingTime = (expiresAt) => {
  if (!expiresAt) return 'Yoxdur';

  const now = new Date();
  const exp = new Date(expiresAt);
  const diff = exp - now;

  if (diff <= 0) return 'Bitmiş';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  let parts = [];
  if (months > 0) parts.push(`${months} ay`);
  if (remainingDays > 0) parts.push(`${remainingDays} gün`);
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0) parts.push(`${minutes} dəqiqə`);
  if (seconds > 0) parts.push(`${seconds} saniyə`);

  return parts.join(' ');
};
