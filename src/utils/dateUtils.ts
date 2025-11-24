/**
 * Date utility functions for optimized date operations
 * These functions help reduce redundant Date object creations and formatting
 */

// Cache for formatted dates to avoid repeated formatting operations
const dateFormatCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * Optimized to avoid repeated Date object creation
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current date and time in ISO format
 */
export const getCurrentDateTimeISO = (): string => {
  return new Date().toISOString();
};

/**
 * Format date to Turkish locale with caching
 * @param date Date object or ISO string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDateTR = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
): string => {
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  const cacheKey = `${dateStr}-${JSON.stringify(options)}`;
  
  // Check cache first
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!;
  }
  
  // Format and cache
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatted = dateObj.toLocaleDateString('tr-TR', options);
  
  // Prevent cache from growing too large
  if (dateFormatCache.size >= MAX_CACHE_SIZE) {
    const firstKey = dateFormatCache.keys().next().value;
    dateFormatCache.delete(firstKey);
  }
  
  dateFormatCache.set(cacheKey, formatted);
  return formatted;
};

/**
 * Get date string (without time) from Date object
 * Returns format like 'Mon Nov 24 2024'
 * Use for day comparison via toDateString()
 */
export const getDateString = (date: Date): string => {
  return date.toDateString();
};

/**
 * Convert ISO date string to date-only format (YYYY-MM-DD)
 */
export const getDateOnlyFromISO = (isoString: string): string => {
  return isoString.split('T')[0];
};

/**
 * Check if two dates are on the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Get age in months from birth date
 */
export const getAgeInMonths = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  const monthsDiff =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());
  
  return Math.max(0, monthsDiff);
};

/**
 * Get age in weeks from birth date
 */
export const getAgeInWeeks = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  const diffMs = today.getTime() - birth.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  
  return Math.max(0, weeks);
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}dk`;
  }
  
  return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`;
};

/**
 * Get start of day for a given date
 */
export const getStartOfDay = (date: Date | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day for a given date
 */
export const getEndOfDay = (date: Date | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get date N days ago
 */
export const getDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Clear the date format cache (useful for testing or memory management)
 */
export const clearDateFormatCache = (): void => {
  dateFormatCache.clear();
};
