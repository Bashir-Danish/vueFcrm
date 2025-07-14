/**
 * Format a date string or Date object to a localized string
 * @param date - Date string or Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Format a number to a currency string
 * @param amount - Number to format as currency
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string, currency: string = 'USD'): string => {
  if (amount === null || amount === undefined || amount === '') return '';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN case
  if (isNaN(numAmount)) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Format a number with thousand separators
 * @param number - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (number: number | string): string => {
  if (number === null || number === undefined || number === '') return '';
  
  const numValue = typeof number === 'string' ? parseFloat(number) : number;
  
  // Handle NaN case
  if (isNaN(numValue)) return '';
  
  return new Intl.NumberFormat('en-US').format(numValue);
}; 