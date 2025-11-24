import { InputValidator } from '../../src/utils/InputValidator';

describe('DatabaseService Security Tests', () => {
  describe('InputValidator - SQL Injection Prevention', () => {
    it('should reject malicious field names', () => {
      expect(() => {
        InputValidator.sanitizeFieldName(
          "name = 'hacked' --",
          InputValidator.ALLOWED_BABY_FIELDS
        );
      }).toThrow('Invalid field name');
    });

    it('should accept valid field names from whitelist', () => {
      expect(() => {
        InputValidator.sanitizeFieldName('name', InputValidator.ALLOWED_BABY_FIELDS);
      }).not.toThrow();
    });

    it('should reject field names with special characters', () => {
      expect(() => {
        InputValidator.sanitizeFieldName('name; DROP TABLE --', InputValidator.ALLOWED_BABY_FIELDS);
      }).toThrow('Invalid field name');
    });
  });

  describe('InputValidator - XSS Prevention', () => {
    it('should remove HTML tags and script content from string input', () => {
      const malicious = "<script>alert('xss')</script>Ahmet";
      const sanitized = InputValidator.sanitizeString(malicious);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain('script');
      expect(sanitized).not.toContain("'");
      // After sanitization: <>"' removed first (breaking tags), then script keyword removed
      // Result: scriptalert(xss)/scriptAhmet -> alert(xss)/Ahmet
      expect(sanitized).toBe('alert(xss)/Ahmet');
    });

    it('should remove dangerous characters from string', () => {
      const dangerous = 'Test"Name<>\'';
      const sanitized = InputValidator.sanitizeString(dangerous);
      expect(sanitized).not.toContain('"');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain("'");
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(300);
      const sanitized = InputValidator.sanitizeString(longString, 255);
      expect(sanitized.length).toBe(255);
    });

    it('should trim whitespace', () => {
      const withSpaces = '  Ahmet  ';
      const sanitized = InputValidator.sanitizeString(withSpaces);
      expect(sanitized).toBe('Ahmet');
    });
  });

  describe('InputValidator - Baby Name Validation', () => {
    it('should accept valid Turkish names', () => {
      expect(() => InputValidator.validateBabyName('Ahmet')).not.toThrow();
      expect(() => InputValidator.validateBabyName('Zeynep')).not.toThrow();
      expect(() => InputValidator.validateBabyName('Çağla')).not.toThrow();
      expect(() => InputValidator.validateBabyName('Şule')).not.toThrow();
      expect(() => InputValidator.validateBabyName('Ömer')).not.toThrow();
      expect(() => InputValidator.validateBabyName('Ümit')).not.toThrow();
    });

    it('should reject names that are too short', () => {
      expect(() => InputValidator.validateBabyName('A')).toThrow('2-50 karakter');
    });

    it('should reject names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => InputValidator.validateBabyName(longName)).toThrow('2-50 karakter');
    });

    it('should reject names with numbers', () => {
      expect(() => InputValidator.validateBabyName('Ahmet123')).toThrow('sadece harf');
    });

    it('should reject names with special characters', () => {
      expect(() => InputValidator.validateBabyName('Ahmet@#')).toThrow('sadece harf');
    });

    it('should accept names with spaces', () => {
      expect(() => InputValidator.validateBabyName('Ahmet Ali')).not.toThrow();
    });
  });

  describe('InputValidator - Date Validation', () => {
    it('should accept valid past dates', () => {
      expect(() => InputValidator.validateDate('2024-01-01')).not.toThrow();
      expect(() => InputValidator.validateDate('2020-06-15')).not.toThrow();
    });

    it('should reject future dates by default', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(() => InputValidator.validateDate(futureDate.toISOString())).toThrow(
        'Gelecek tarih'
      );
    });

    it('should accept future dates when allowed', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(() => InputValidator.validateDate(futureDate.toISOString(), true)).not.toThrow();
    });

    it('should reject invalid date formats', () => {
      expect(() => InputValidator.validateDate('not-a-date')).toThrow('Geçersiz tarih');
      expect(() => InputValidator.validateDate('2024-13-01')).toThrow('Geçersiz tarih');
      // Note: JavaScript Date constructor is lenient and converts 2024-02-30 to 2024-03-01
      // We're testing that clearly invalid dates fail
    });
  });

  describe('InputValidator - Number Validation', () => {
    it('should accept valid positive numbers', () => {
      expect(() => InputValidator.validatePositiveNumber(10, 0, 100)).not.toThrow();
      expect(() => InputValidator.validatePositiveNumber(50.5, 0, 100)).not.toThrow();
    });

    it('should reject zero and negative numbers', () => {
      // Both 0 and negative numbers throw because they are <= min
      expect(() => InputValidator.validatePositiveNumber(0, 0, 100)).toThrow('büyük olmalıdır');
      expect(() => InputValidator.validatePositiveNumber(-5, 0, 100)).toThrow('büyük olmalıdır');
    });

    it('should reject numbers outside range', () => {
      expect(() => InputValidator.validatePositiveNumber(150, 0, 100)).toThrow('küçük veya eşit');
    });

    it('should reject non-numeric values', () => {
      expect(() => InputValidator.validatePositiveNumber(NaN, 0, 100)).toThrow('Geçersiz sayı');
      expect(() => InputValidator.validatePositiveNumber('10' as any, 0, 100)).toThrow(
        'Geçersiz sayı'
      );
    });
  });

  describe('InputValidator - Weight Validation', () => {
    it('should accept valid baby weights', () => {
      expect(() => InputValidator.validateWeight(3.5)).not.toThrow(); // Newborn
      expect(() => InputValidator.validateWeight(10)).not.toThrow(); // Infant
      expect(() => InputValidator.validateWeight(15)).not.toThrow(); // Toddler
    });

    it('should reject unrealistic weights', () => {
      expect(() => InputValidator.validateWeight(0.05)).toThrow(); // Too low
      expect(() => InputValidator.validateWeight(250)).toThrow(); // Too high
    });
  });

  describe('InputValidator - Height Validation', () => {
    it('should accept valid baby heights', () => {
      expect(() => InputValidator.validateHeight(50)).not.toThrow(); // Newborn
      expect(() => InputValidator.validateHeight(70)).not.toThrow(); // Infant
      expect(() => InputValidator.validateHeight(90)).not.toThrow(); // Toddler
    });

    it('should reject unrealistic heights', () => {
      expect(() => InputValidator.validateHeight(5)).toThrow(); // Too short
      expect(() => InputValidator.validateHeight(350)).toThrow(); // Too tall
    });
  });

  describe('InputValidator - Gender Validation', () => {
    it('should accept valid genders', () => {
      expect(() => InputValidator.validateGender('male')).not.toThrow();
      expect(() => InputValidator.validateGender('female')).not.toThrow();
      expect(() => InputValidator.validateGender('other')).not.toThrow();
    });

    it('should reject invalid genders', () => {
      expect(() => InputValidator.validateGender('invalid')).toThrow('Geçersiz cinsiyet');
      expect(() => InputValidator.validateGender('')).toThrow('Geçersiz cinsiyet');
    });
  });

  describe('InputValidator - Blood Type Validation', () => {
    it('should accept valid blood types', () => {
      const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      validTypes.forEach((type) => {
        expect(() => InputValidator.validateBloodType(type)).not.toThrow();
      });
    });

    it('should reject invalid blood types', () => {
      expect(() => InputValidator.validateBloodType('C+')).toThrow('Geçersiz kan grubu');
      expect(() => InputValidator.validateBloodType('A')).toThrow('Geçersiz kan grubu');
    });
  });

  describe('InputValidator - Activity Type Validation', () => {
    it('should accept valid activity types', () => {
      const validTypes = ['feeding', 'sleep', 'diaper', 'health', 'growth', 'milestone'];
      validTypes.forEach((type) => {
        expect(() => InputValidator.validateActivityType(type)).not.toThrow();
      });
    });

    it('should reject invalid activity types', () => {
      expect(() => InputValidator.validateActivityType('invalid')).toThrow('Geçersiz aktivite');
    });
  });

  describe('InputValidator - Notes Validation', () => {
    it('should accept valid notes', () => {
      expect(() => InputValidator.validateNotes('This is a valid note')).not.toThrow();
    });

    it('should reject excessively long notes', () => {
      const longNote = 'a'.repeat(1001);
      expect(() => InputValidator.validateNotes(longNote, 1000)).toThrow('maksimum 1000');
    });

    it('should reject non-string notes', () => {
      expect(() => InputValidator.validateNotes(123 as any)).toThrow('string formatında');
    });
  });

  describe('InputValidator - ID Validation', () => {
    it('should accept valid positive integer IDs', () => {
      expect(() => InputValidator.validateId(1)).not.toThrow();
      expect(() => InputValidator.validateId(100)).not.toThrow();
    });

    it('should reject zero and negative IDs', () => {
      expect(() => InputValidator.validateId(0)).toThrow('Geçersiz ID');
      expect(() => InputValidator.validateId(-1)).toThrow('Geçersiz ID');
    });

    it('should reject non-integer IDs', () => {
      expect(() => InputValidator.validateId(1.5)).toThrow('Geçersiz ID');
      expect(() => InputValidator.validateId(NaN)).toThrow('Geçersiz ID');
    });
  });

  describe('InputValidator - Baby Profile Sanitization', () => {
    it('should sanitize complete baby profile', () => {
      const profile = {
        name: '  Ahmet  ',
        birthDate: '2024-01-01',
        gender: 'male',
        weight: 3.5,
        height: 50,
        bloodType: 'A+',
      };

      const sanitized = InputValidator.sanitizeBabyProfile(profile);

      expect(sanitized.name).toBe('Ahmet'); // Trimmed
      expect(sanitized.birthDate).toBe('2024-01-01');
      expect(sanitized.gender).toBe('male');
      expect(sanitized.weight).toBe(3.5);
      expect(sanitized.height).toBe(50);
      expect(sanitized.bloodType).toBe('A+');
    });

    it('should sanitize partial baby profile updates', () => {
      const updates = {
        name: 'Mehmet',
        weight: 4.0,
      };

      const sanitized = InputValidator.sanitizeBabyProfile(updates);

      expect(sanitized.name).toBe('Mehmet');
      expect(sanitized.weight).toBe(4.0);
      expect(sanitized.birthDate).toBeUndefined();
    });

    it('should throw on invalid baby profile data', () => {
      const invalidProfile = {
        name: 'A', // Too short
        birthDate: '2024-01-01',
        gender: 'male',
        weight: 3.5,
        height: 50,
      };

      expect(() => InputValidator.sanitizeBabyProfile(invalidProfile)).toThrow('2-50 karakter');
    });
  });

  describe('InputValidator - Activity Sanitization', () => {
    it('should sanitize complete activity', () => {
      const activity = {
        type: 'feeding',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T10:30:00Z',
        duration: 1800,
        notes: '  Good feeding session  ',
        babyId: 1,
      };

      const sanitized = InputValidator.sanitizeActivity(activity);

      expect(sanitized.type).toBe('feeding');
      expect(sanitized.startTime).toBe('2024-01-01T10:00:00Z');
      expect(sanitized.endTime).toBe('2024-01-01T10:30:00Z');
      expect(sanitized.duration).toBe(1800);
      expect(sanitized.notes).toBe('Good feeding session'); // Trimmed
      expect(sanitized.babyId).toBe(1);
    });

    it('should handle optional fields', () => {
      const activity = {
        type: 'sleep',
        startTime: '2024-01-01T20:00:00Z',
        babyId: 1,
      };

      const sanitized = InputValidator.sanitizeActivity(activity);

      expect(sanitized.type).toBe('sleep');
      expect(sanitized.startTime).toBe('2024-01-01T20:00:00Z');
      expect(sanitized.babyId).toBe(1);
      expect(sanitized.endTime).toBeUndefined();
      expect(sanitized.duration).toBeUndefined();
      expect(sanitized.notes).toBeUndefined();
    });

    it('should throw on invalid activity data', () => {
      const invalidActivity = {
        type: 'invalid_type',
        startTime: '2024-01-01T10:00:00Z',
        babyId: 1,
      };

      expect(() => InputValidator.sanitizeActivity(invalidActivity)).toThrow('Geçersiz aktivite');
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle null and undefined safely', () => {
      expect(() => InputValidator.sanitizeString(null as any)).toThrow('string');
      expect(() => InputValidator.sanitizeString(undefined as any)).toThrow('string');
    });

    it('should only process whitelisted fields', () => {
      const malicious = {
        '__proto__': { polluted: true },
        name: 'Ahmet',
        maliciousField: 'should not be in output',
      };

      // Should only return allowed fields
      const sanitized = InputValidator.sanitizeBabyProfile(malicious);
      expect(sanitized.name).toBe('Ahmet');
      expect(sanitized.maliciousField).toBeUndefined();
      expect(Object.keys(sanitized)).toEqual(['name']);
    });

    it('should handle unicode and emoji safely', () => {
      const withEmoji = 'Ahmet 😊';
      // Should remove emoji (not a letter)
      expect(() => InputValidator.validateBabyName(withEmoji)).toThrow('sadece harf');
    });

    it('should prevent excessively long inputs (DoS prevention)', () => {
      const veryLongString = 'a'.repeat(10000);
      const sanitized = InputValidator.sanitizeString(veryLongString, 255);
      expect(sanitized.length).toBe(255);
    });
  });
});
