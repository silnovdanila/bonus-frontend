export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

export const isMinLength = (value, min) => {
  return value && value.length >= min;
};
