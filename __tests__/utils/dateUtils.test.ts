import {
  getCurrentDateISO,
  getCurrentDateTimeISO,
  getDateOnlyFromISO,
  isSameDay,
  getAgeInMonths,
  getAgeInWeeks,
  formatDuration,
  getStartOfDay,
  getEndOfDay,
  getDaysAgo,
  clearDateFormatCache,
} from '../../src/utils/dateUtils';

describe('Date Utilities', () => {
  beforeEach(() => {
    clearDateFormatCache();
  });

  describe('getCurrentDateISO', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const result = getCurrentDateISO();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getCurrentDateTimeISO', () => {
    it('should return full ISO datetime string', () => {
      const result = getCurrentDateTimeISO();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('getDateOnlyFromISO', () => {
    it('should extract date part from ISO string', () => {
      const isoString = '2024-11-24T10:30:00.000Z';
      const result = getDateOnlyFromISO(isoString);
      expect(result).toBe('2024-11-24');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day dates', () => {
      const date1 = new Date('2024-11-24T10:00:00');
      const date2 = new Date('2024-11-24T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different day dates', () => {
      const date1 = new Date('2024-11-24T10:00:00');
      const date2 = new Date('2024-11-25T10:00:00');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('formatDuration', () => {
    it('should format minutes only', () => {
      expect(formatDuration(45)).toBe('45dk');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1s 30dk');
    });

    it('should format hours only', () => {
      expect(formatDuration(120)).toBe('2s');
    });
  });

  describe('getStartOfDay', () => {
    it('should set time to 00:00:00.000', () => {
      const date = new Date('2024-11-24T15:30:45.123');
      const result = getStartOfDay(date);
      
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should set time to 23:59:59.999', () => {
      const date = new Date('2024-11-24T10:00:00');
      const result = getEndOfDay(date);
      
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('getDaysAgo', () => {
    it('should return date N days in the past', () => {
      const result = getDaysAgo(7);
      const today = new Date();
      const expected = new Date(today);
      expected.setDate(today.getDate() - 7);
      
      expect(result.getDate()).toBe(expected.getDate());
    });
  });
});
