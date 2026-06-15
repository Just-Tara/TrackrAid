
export const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

export const formatCurrency = (amount, currency) => {
  return `${currencySymbols[currency]}${Number(amount).toFixed(2)}`;
};