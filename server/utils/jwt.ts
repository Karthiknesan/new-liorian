import jwt from 'jsonwebtoken';
import { SECURITY_CONFIG } from '../config/credentials';

// JWT payload interfaces
export interface AdminTokenPayload {
  type: 'admin';
  email: string;
  iat?: number;
  exp?: number;
}

export interface StaffTokenPayload {
  type: 'staff';
  id: number;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface CandidateTokenPayload {
  type: 'candidate';
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export type TokenPayload = AdminTokenPayload | StaffTokenPayload | CandidateTokenPayload;

// Generate JWT tokens
export function generateAdminToken(email: string): string {
  const payload: AdminTokenPayload = {
    type: 'admin',
    email
  };
  
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.TOKEN_EXPIRY,
    issuer: 'liorian-tech'
  });
}

export function generateStaffToken(id: number, email: string, role: string, permissions: string[]): string {
  const payload: StaffTokenPayload = {
    type: 'staff',
    id,
    email,
    role,
    permissions
  };
  
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.TOKEN_EXPIRY,
    issuer: 'liorian-tech'
  });
}

export function generateCandidateToken(id: number, email: string): string {
  const payload: CandidateTokenPayload = {
    type: 'candidate',
    id,
    email
  };
  
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.TOKEN_EXPIRY,
    issuer: 'liorian-tech'
  });
}

// Verify and decode JWT tokens
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECURITY_CONFIG.JWT_SECRET, {
      issuer: 'liorian-tech'
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.warn('JWT verification failed:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.warn('JWT token expired:', error.message);
    } else {
      console.error('JWT verification error:', error);
    }
    return null;
  }
}

// Middleware for JWT authentication
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized. Please login first.',
      code: 'MISSING_TOKEN'
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      message: 'Invalid or expired token. Please login again.',
      code: 'INVALID_TOKEN'
    });
  }

  // Add user info to request
  req.user = payload;
  next();
}

// Role-specific middleware
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
}

export function requireStaff(req: any, res: any, next: any) {
  if (!req.user || (req.user.type !== 'staff' && req.user.type !== 'admin')) {
    return res.status(403).json({
      message: 'Staff access required.',
      code: 'STAFF_REQUIRED'
    });
  }
  next();
}

export function requirePermission(permission: string) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (req.user.type === 'admin') {
      // Admin has all permissions
      return next();
    }

    if (req.user.type === 'staff' && req.user.permissions?.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      message: `Permission '${permission}' required.`,
      code: 'PERMISSION_DENIED'
    });
  };
}

// Refresh token functionality
export function refreshToken(oldToken: string): string | null {
  const payload = verifyToken(oldToken);
  if (!payload) {
    return null;
  }
  
  // Generate new token with same payload but extended expiry
  switch (payload.type) {
    case 'admin':
      return generateAdminToken(payload.email);
    case 'staff':
      return generateStaffToken(payload.id, payload.email, payload.role, payload.permissions);
    case 'candidate':
      return generateCandidateToken(payload.id, payload.email);
    default:
      return null;
  }
}
