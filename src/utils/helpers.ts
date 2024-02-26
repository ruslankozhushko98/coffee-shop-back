export const generateOTC = (otcLength: number): string => {
  const digits = '0123456789';
  let otc = '';

  for (let i = 0; i < otcLength; i++) {
    otc += digits[Math.floor(Math.random() * digits.length)];
  }

  return otc;
};

export const checkIsOTCExpired = (expiry: Date): boolean => {
  const expirationDate = new Date(expiry);
  const currentDate = new Date();

  return expirationDate.getTime() <= currentDate.getTime();
};
