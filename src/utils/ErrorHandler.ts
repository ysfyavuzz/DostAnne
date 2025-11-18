export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  screen?: string;
  action?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  log(error: AppError): void {
    this.errors.push(error);
    console.error('App Error:', error);
    
    // In production, send to analytics/logging service
    if (__DEV__ === false) {
      // TODO: Implement crashlytics or similar service
    }
  }

  logError(
    code: string, 
    message: string, 
    details?: any, 
    screen?: string, 
    action?: string
  ): void {
    this.log({
      code,
      message,
      details,
      timestamp: new Date(),
      screen,
      action,
    });
  }

  logAsyncError(
    error: any, 
    screen?: string, 
    action?: string
  ): void {
    this.logError(
      error.code || 'UNKNOWN_ERROR',
      error.message || 'Unknown error occurred',
      error.details || error,
      screen,
      action
    );
  }

  getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Error boundary component for React
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Common error types
export const ErrorCodes = {
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOTIFICATION_ERROR: 'NOTIFICATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_ERROR: 'FILE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// User-friendly error messages
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.DATABASE_ERROR]: 'Veritabanı işleminde bir hata oluştu. Lütfen tekrar deneyin.',
  [ErrorCodes.NOTIFICATION_ERROR]: 'Bildirim gönderilemedi. Lütfen ayarları kontrol edin.',
  [ErrorCodes.NETWORK_ERROR]: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
  [ErrorCodes.PERMISSION_ERROR]: 'Gerekli izinleri vermeniz gerekiyor.',
  [ErrorCodes.VALIDATION_ERROR]: 'Girdiğiniz bilgileri kontrol edin.',
  [ErrorCodes.FILE_ERROR]: 'Dosya işleminde bir hata oluştu.',
  [ErrorCodes.UNKNOWN_ERROR]: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.',
};

// Utility function to show user-friendly error messages
export const showErrorAlert = (error: AppError): void => {
  const userMessage = ErrorMessages[error.code] || ErrorMessages[ErrorCodes.UNKNOWN_ERROR];
  
  // In real app, use proper Alert from React Native
  console.error('User Error:', userMessage, error.details);
};

// Wrap async functions with error handling
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  screen?: string,
  action?: string
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.logAsyncError(error, screen, action);
    return null;
  }
};

// Validation utility
export const validateInput = (value: string, type: 'email' | 'phone' | 'text' | 'number'): boolean => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10;
    case 'number':
      return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    case 'text':
      return value.trim().length >= 2;
    default:
      return true;
  }
};

export default errorHandler;