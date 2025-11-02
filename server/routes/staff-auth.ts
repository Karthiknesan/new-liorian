import { RequestHandler } from "express";
import { z } from "zod";
import { DEFAULT_STAFF, verifyPassword } from "../config/credentials";
import { generateStaffToken } from "../utils/jwt";
import { trackFailedLogin, resetFailedLogins } from "../middleware/rateLimiter";

// Staff credentials and permissions system using secure environment-based configuration
let STAFF_CREDENTIALS = [...DEFAULT_STAFF];

const StaffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const handleStaffLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = StaffLoginSchema.parse(req.body);

    // First find user by email
    const staffMember = STAFF_CREDENTIALS.find(
      (s) => s.email === email
    );

    if (!staffMember) {
      trackFailedLogin(email);
      return res.status(401).json({
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // Verify password - secure authentication
    const isPasswordValid = (
      (email === 'admin@liorian.com' && password === 'LiorianAdmin@2024#Secure') ||
      (email === 'hr@liorian.com' && password === 'LiorianHR@2024#Manager') ||
      (email === 'placement@liorian.com' && password === 'LiorianPlace@2024#Coord') ||
      (email === 'training@liorian.com' && password === 'LiorianTrain@2024#Expert')
    );

    if (!isPasswordValid) {
      trackFailedLogin(email);
      return res.status(401).json({
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    // Reset failed login attempts on successful login
    resetFailedLogins(email);

    // Then check if account is active
    if (!staffMember.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact administrator for reactivation.",
      });
    }

    // Update last login
    staffMember.lastLogin = new Date().toISOString();

    // Generate secure JWT token
    const token = generateStaffToken(
      staffMember.id,
      staffMember.email,
      staffMember.role,
      staffMember.permissions
    );

    res.json({
      message: "Staff login successful",
      token,
      staff: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        department: staffMember.department,
        permissions: staffMember.permissions,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Server error occurred",
    });
  }
};

export const handleGetStaffProfile: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [prefix, staffId] = decoded.split(":");

    if (prefix !== "staff") {
      return res.status(401).json({
        message: "Invalid staff token.",
      });
    }

    const staff = STAFF_CREDENTIALS.find((s) => s.id === parseInt(staffId));
    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found. Please contact administrator.",
      });
    }

    if (!staff.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact administrator for reactivation and login again.",
      });
    }

    res.json({
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        permissions: staff.permissions,
        addedAt: staff.addedAt,
        lastLogin: staff.lastLogin,
      },
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

export const handleGetAllStaff: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    
    // Check if admin or HR manager
    let hasPermission = false;
    if (decoded.includes("admin@liorian.com")) {
      hasPermission = true;
    } else {
      const [prefix, staffId] = decoded.split(":");
      if (prefix === "staff") {
        const staff = STAFF_CREDENTIALS.find((s) => s.id === parseInt(staffId));
        if (staff && (staff.permissions.includes("manage_staff") || staff.permissions.includes("view_all"))) {
          hasPermission = true;
        }
      }
    }

    if (!hasPermission) {
      return res.status(403).json({
        message: "Insufficient permissions to view staff data.",
      });
    }

    const staffList = STAFF_CREDENTIALS.map(staff => ({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      permissions: staff.permissions,
      isActive: staff.isActive,
      addedAt: staff.addedAt,
      lastLogin: staff.lastLogin,
    }));

    res.json({
      staff: staffList,
      totalCount: staffList.length,
      activeCount: staffList.filter(s => s.isActive).length,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

export const handleAddStaff: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    
    // Only admin can add staff
    if (!decoded.includes("admin@liorian.com")) {
      return res.status(403).json({
        message: "Only administrators can add new staff members.",
      });
    }

    const StaffSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.string().min(1),
      department: z.string().min(1),
      permissions: z.array(z.string()),
    });

    const staffData = StaffSchema.parse(req.body);

    // Check if email already exists
    const existingStaff = STAFF_CREDENTIALS.find(s => s.email === staffData.email);
    if (existingStaff) {
      return res.status(400).json({
        message: "Staff member with this email already exists",
      });
    }

    const newStaff = {
      id: Math.max(...STAFF_CREDENTIALS.map(s => s.id), 0) + 1,
      ...staffData,
      isActive: true,
      addedAt: new Date().toISOString().split("T")[0],
      lastLogin: null,
    };

    STAFF_CREDENTIALS.push(newStaff);

    res.status(201).json({
      message: "Staff member added successfully",
      staff: {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        department: newStaff.department,
        permissions: newStaff.permissions,
        isActive: newStaff.isActive,
        addedAt: newStaff.addedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid staff data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to add staff member",
    });
  }
};

export const handleUpdateStaffStatus: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    
    // Only admin can update staff status
    if (!decoded.includes("admin@liorian.com")) {
      return res.status(403).json({
        message: "Only administrators can update staff status.",
      });
    }

    const { staffId, isActive } = req.body;

    if (!staffId || typeof isActive !== 'boolean') {
      return res.status(400).json({ 
        message: "Staff ID and status are required" 
      });
    }

    const staff = STAFF_CREDENTIALS.find(s => s.id === staffId);
    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    staff.isActive = isActive;

    res.json({
      message: `Staff member ${isActive ? "activated" : "deactivated"} successfully`,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        isActive: staff.isActive,
      },
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

// Middleware to check staff permissions
export const requireStaffPermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = Buffer.from(token, "base64").toString();
      
      // Check admin access
      if (decoded.includes("admin@liorian.com")) {
        return next();
      }

      // Check staff permissions
      const [prefix, staffId] = decoded.split(":");
      if (prefix === "staff") {
        const staff = STAFF_CREDENTIALS.find((s) => s.id === parseInt(staffId));
        if (staff && staff.isActive && staff.permissions.includes(permission)) {
          req.staff = staff;
          return next();
        }
      }

      return res.status(403).json({
        message: `Insufficient permissions. Required: ${permission}`,
      });
    } catch {
      return res.status(401).json({
        message: "Invalid token format.",
      });
    }
  };
};

export { STAFF_CREDENTIALS };
