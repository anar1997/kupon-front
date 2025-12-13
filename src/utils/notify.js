import { notification } from 'antd';

const DEFAULT_DURATION = 3;

export const notifySuccess = (message, description) => {
  notification.success({
    title: message,
    description,
    placement: 'bottomRight',
    duration: DEFAULT_DURATION,
  });
};

export const notifyError = (message, description) => {
  notification.error({
    title: message,
    description,
    placement: 'bottomRight',
    duration: DEFAULT_DURATION,
  });
};

// Backend error obyektindən ən məntiqli mesajı çıxarmaq üçün helper
export const extractErrorMessage = (error, fallback = 'Xəta baş verdi') => {
  if (!error) return fallback;
  const data = error.response?.data ?? error.data ?? error;

  if (typeof data === 'string') return data;

  if (data?.detail) return data.detail;
  if (data?.message) return data.message;

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const first = data[keys[0]];
      if (Array.isArray(first) && first.length > 0) return String(first[0]);
      if (typeof first === 'string') return first;
    }
  }

  if (error.message) return error.message;
  return fallback;
};
