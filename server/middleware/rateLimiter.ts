import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { SECURITY_CONFIG } from '../config/credentials';

// General API rate limiting (very permissive for testing)
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Very high limit for testing
  message: {
    error: 'Too many requests from this IP',
    message: 'Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting (very permissive for testing)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very high limit for testing
  message: {
    error: 'Too many login attempts',
    message: 'Account temporarily locked. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Progressive delay for authentication endpoints
export const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 requests per windowMs without delay
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  skipSuccessfulRequests: true,
});

// Very strict rate limiting for password reset
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts',
    message: 'Please wait before requesting another password reset.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API endpoint rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Higher limit for general API usage
  message: {
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please slow down.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting
export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 uploads per 15 minutes
  message: {
    error: 'Upload rate limit exceeded',
    message: 'Too many file uploads. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Account lockout tracking (in-memory for demo, use Redis/database in production)
const accountLockouts = new Map<string, { attempts: number; lockUntil?: number }>();

export function trackFailedLogin(email: string): boolean {
  // Temporarily disable account lockout for testing
  console.log('Failed login attempt for:', email, '(lockout disabled for testing)');
  return true; // Always allow login attempts during testing
}

export function resetFailedLogins(email: string): void {
  accountLockouts.delete(email);
}

export function isAccountLocked(email: string): boolean {
  const account = accountLockouts.get(email);
  if (!account || !account.lockUntil) return false;
  
  const now = Date.now();
  if (now >= account.lockUntil) {
    // Lock period expired, reset
    accountLockouts.delete(email);
    return false;
  }
  
  return true;
}

export function getAccountLockoutInfo(email: string): { locked: boolean; unlockTime?: Date; attemptsRemaining?: number } {
  const account = accountLockouts.get(email);
  if (!account) {
    return { locked: false, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
  }
  
  const now = Date.now();
  if (account.lockUntil && now < account.lockUntil) {
    return {
      locked: true,
      unlockTime: new Date(account.lockUntil)
    };
  }
  
  return {
    locked: false,
    attemptsRemaining: Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - account.attempts)
  };
}

// Middleware to check account lockout
export function checkAccountLockout(req: any, res: any, next: any) {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }
  
  const lockoutInfo = getAccountLockoutInfo(email);
  
  if (lockoutInfo.locked) {
    return res.status(423).json({
      error: 'Account temporarily locked',
      message: `Too many failed login attempts. Account locked until ${lockoutInfo.unlockTime?.toISOString()}`,
      unlockTime: lockoutInfo.unlockTime,
      code: 'ACCOUNT_LOCKED'
    });
  }
  
  next();
}
