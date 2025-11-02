import { Request, Response, NextFunction } from "express";
import { verifyToken, refreshToken, TokenPayload } from "../utils/jwt";

// ✅ JWT-only authentication middleware
export function authenticateToken(req: Request & { user?: TokenPayload }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
      code: "MISSING_TOKEN"
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
      code: "INVALID_TOKEN"
    });
  }

  req.user = payload;
  next();
}

// ✅ Validate token endpoint
export function handleTokenValidation(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided.", valid: false });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token.", valid: false });
  }

  return res.json({
    message: "Token is valid.",
    valid: true,
    user: payload
  });
}

// ✅ Keep-alive / refresh token endpoint
export function handleKeepAlive(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided.", success: false });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token.", success: false });
  }

  const newToken = refreshToken(token);
  return res.json({
    message: "Session refreshed.",
    success: true,
    refreshedToken: newToken,
    user: payload
  });
}

// ✅ Logout endpoint
export function handleLogout(req: Request, res: Response) {
  return res.json({
    message: "Logout successful.",
    success: true,
    timestamp: new Date().toISOString()
  });
}
