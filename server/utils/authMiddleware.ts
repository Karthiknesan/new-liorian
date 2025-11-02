import type { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';

export interface AuthenticatedRequest extends Request {
  token?: string;
  user?: any;
}

/**
 * Extract and validate Bearer token from Authorization header
 * @returns { token: string | null, error?: any }
 */
export function extractToken(req: AuthenticatedRequest): { token: string | null; error?: any } {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      token: null,
      error: {
        status: 401,
        message: "Unauthorized. Please login first."
      }
    };
  }

  const token = authHeader.substring(7);
  return { token };
}

/**
 * Middleware to validate Bearer token in Authorization header
 * Sets req.token if valid
 */
export function validateAuthHeader(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { token, error } = extractToken(req);
  
  if (error) {
    return res.status(error.status).json({
      message: error.message
    });
  }

  req.token = token;
  next();
}

/**
 * Validate Bearer token and return error response if invalid
 * Used in route handlers
 * @returns { valid: boolean }
 */
export function validateTokenInHandler(req: AuthenticatedRequest, res: Response): boolean {
  const { token, error } = extractToken(req);
  
  if (error) {
    res.status(error.status).json({
      message: error.message
    });
    return false;
  }

  req.token = token;
  return true;
}
