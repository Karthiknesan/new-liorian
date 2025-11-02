// API Error Handler Utility
export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export class ApiErrorHandler {
  static formatError(error: any): string {
    if (typeof error === 'string') return error;
    
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    
    // Handle common HTTP errors
    if (error?.status) {
      switch (error.status) {
        case 400: return 'Invalid request. Please check your input.';
        case 401: return 'Unauthorized. Please log in again.';
        case 403: return 'Access denied. You don\'t have permission for this action.';
        case 404: return 'Resource not found.';
        case 409: return 'Conflict. This item already exists.';
        case 429: return 'Too many requests. Please try again later.';
        case 500: return 'Server error. Please try again later.';
        default: return 'An unexpected error occurred.';
      }
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  static async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const error: ApiError = {
        code: data.error?.code || `HTTP_${response.status}`,
        message: data.error?.message || this.formatError({ status: response.status }),
        timestamp: new Date().toISOString()
      };
      throw error;
    }
    
    return data;
  }

  static createErrorResponse(message: string, code = 'CLIENT_ERROR'): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    };
  }

  static createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data
    };
  }
}

// Form validation utilities
export class FormValidator {
  static validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  }

  static validatePhone(phone: string): string | null {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!phone?.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
    return null;
  }

  static validateRequired(value: string, fieldName: string): string | null {
    if (!value?.trim()) return `${fieldName} is required`;
    return null;
  }

  static validateFile(file: File): string | null {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!file) return 'Please select a file';
    if (file.size > maxSize) return 'File size must be less than 5MB';
    if (!allowedTypes.includes(file.type)) return 'Please select a PDF, JPEG, or PNG file';
    
    return null;
  }

  static validateForm(data: Record<string, any>, rules: Record<string, string[]>): string[] {
    const errors: string[] = [];
    
    for (const [field, validationRules] of Object.entries(rules)) {
      const value = data[field];
      
      for (const rule of validationRules) {
        let error: string | null = null;
        
        switch (rule) {
          case 'required':
            error = this.validateRequired(value, field);
            break;
          case 'email':
            error = this.validateEmail(value);
            break;
          case 'phone':
            error = this.validatePhone(value);
            break;
        }
        
        if (error) {
          errors.push(error);
          break; // Stop at first error for this field
        }
      }
    }
    
    return errors;
  }
}
