/**
 * Input validation and sanitization service for DostAnne
 * Provides security against SQL injection, XSS, and other attacks
 * Ensures data integrity and proper input format
 */

export class InputValidator {
  /**
   * Allowed field names for baby profile updates (whitelist)
   * Prevents SQL injection via field name manipulation
   */
  static readonly ALLOWED_BABY_FIELDS = [
    'name',
    'birthDate',
    'gender',
    'weight',
    'height',
    'bloodType',
    'photo',
  ] as const;

  /**
   * Allowed field names for activity updates (whitelist)
   */
  static readonly ALLOWED_ACTIVITY_FIELDS = [
    'type',
    'startTime',
    'endTime',
    'duration',
    'notes',
    'babyId',
  ] as const;

  /**
   * Validate and sanitize field name against whitelist
   * Prevents SQL injection through field name manipulation
   */
  static sanitizeFieldName(field: string, allowedFields: readonly string[]): string {
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }
    return field;
  }

  /**
   * Sanitize string input to prevent XSS and other attacks
   * Removes potentially dangerous characters and limits length
   */
  static sanitizeString(input: string, maxLength: number = 255): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    return (
      input
        .trim()
        // Remove HTML/script tags
        .replace(/<[^>]*>/g, '')
        // Remove potentially dangerous characters
        .replace(/[<>"']/g, '')
        // Limit length
        .substring(0, maxLength)
    );
  }

  /**
   * Validate baby name
   * Must be 2-50 characters, letters only (including Turkish characters)
   */
  static validateBabyName(name: string): boolean {
    // First check original length before sanitization
    const trimmed = name.trim();
    
    if (trimmed.length < 2 || trimmed.length > 50) {
      throw new Error('İsim 2-50 karakter arasında olmalıdır');
    }

    const sanitized = this.sanitizeString(name, 50);

    // Allow letters (including Turkish) and spaces
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(sanitized)) {
      throw new Error('İsim sadece harf içerebilir');
    }

    return true;
  }

  /**
   * Validate date format and ensure it's not in the future
   */
  static validateDate(dateStr: string, allowFuture: boolean = false): boolean {
    if (typeof dateStr !== 'string') {
      throw new Error('Tarih string formatında olmalıdır');
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new Error('Geçersiz tarih formatı');
    }

    if (!allowFuture && date > new Date()) {
      throw new Error('Gelecek tarih kullanılamaz');
    }

    return true;
  }

  /**
   * Validate positive number within a range
   * Used for weight, height, etc.
   */
  static validatePositiveNumber(
    value: number,
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER
  ): boolean {
    if (typeof value !== 'number' || isNaN(value) || value <= min) {
      throw new Error('Geçersiz sayı');
    }

    if (value > max) {
      throw new Error(`Değer ${min} ile ${max} arasında olmalıdır`);
    }

    return true;
  }

  /**
   * Validate weight (0.1 - 200 kg)
   */
  static validateWeight(weight: number): boolean {
    return this.validatePositiveNumber(weight, 0.09, 200);
  }

  /**
   * Validate height (10 - 300 cm)
   */
  static validateHeight(height: number): boolean {
    return this.validatePositiveNumber(height, 10, 300);
  }

  /**
   * Validate gender
   */
  static validateGender(gender: string): boolean {
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender)) {
      throw new Error('Geçersiz cinsiyet değeri');
    }
    return true;
  }

  /**
   * Validate blood type
   */
  static validateBloodType(bloodType: string): boolean {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      throw new Error('Geçersiz kan grubu');
    }
    return true;
  }

  /**
   * Validate activity type
   */
  static validateActivityType(type: string): boolean {
    const validTypes = ['feeding', 'sleep', 'diaper', 'health', 'growth', 'milestone'];
    if (!validTypes.includes(type)) {
      throw new Error('Geçersiz aktivite tipi');
    }
    return true;
  }

  /**
   * Validate notes/text field
   * Prevents excessively long text that could cause performance issues
   */
  static validateNotes(notes: string, maxLength: number = 1000): boolean {
    if (typeof notes !== 'string') {
      throw new Error('Notlar string formatında olmalıdır');
    }

    if (notes.length > maxLength) {
      throw new Error(`Notlar maksimum ${maxLength} karakter olabilir`);
    }

    return true;
  }

  /**
   * Validate ID (must be positive integer)
   */
  static validateId(id: number): boolean {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Geçersiz ID');
    }
    return true;
  }

  /**
   * Sanitize object for database operations
   * Validates all fields and returns sanitized object
   */
  static sanitizeBabyProfile(profile: any): any {
    const sanitized: any = {};

    if (profile.name !== undefined) {
      this.validateBabyName(profile.name);
      sanitized.name = this.sanitizeString(profile.name, 50);
    }

    if (profile.birthDate !== undefined) {
      this.validateDate(profile.birthDate, false);
      sanitized.birthDate = profile.birthDate;
    }

    if (profile.gender !== undefined) {
      this.validateGender(profile.gender);
      sanitized.gender = profile.gender;
    }

    if (profile.weight !== undefined) {
      this.validateWeight(profile.weight);
      sanitized.weight = profile.weight;
    }

    if (profile.height !== undefined) {
      this.validateHeight(profile.height);
      sanitized.height = profile.height;
    }

    if (profile.bloodType !== undefined && profile.bloodType !== null) {
      this.validateBloodType(profile.bloodType);
      sanitized.bloodType = profile.bloodType;
    }

    if (profile.photo !== undefined) {
      sanitized.photo = profile.photo;
    }

    return sanitized;
  }

  /**
   * Sanitize activity object
   */
  static sanitizeActivity(activity: any): any {
    const sanitized: any = {};

    if (activity.type !== undefined) {
      this.validateActivityType(activity.type);
      sanitized.type = activity.type;
    }

    if (activity.startTime !== undefined) {
      this.validateDate(activity.startTime, true);
      sanitized.startTime = activity.startTime;
    }

    if (activity.endTime !== undefined && activity.endTime !== null) {
      this.validateDate(activity.endTime, true);
      sanitized.endTime = activity.endTime;
    }

    if (activity.duration !== undefined && activity.duration !== null) {
      this.validatePositiveNumber(activity.duration, 0, 86400); // Max 24 hours
      sanitized.duration = activity.duration;
    }

    if (activity.notes !== undefined && activity.notes !== null) {
      this.validateNotes(activity.notes);
      sanitized.notes = this.sanitizeString(activity.notes, 1000);
    }

    if (activity.babyId !== undefined) {
      this.validateId(activity.babyId);
      sanitized.babyId = activity.babyId;
    }

    return sanitized;
  }
}
