import bcrypt from 'bcrypt';

// Environment-based credential configuration
export const SECURITY_CONFIG = {
  // Use environment variables for credentials in production
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@liorian.com",
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || "$2b$12$LiorianAdminSecure2024HashForDemo", // Secure admin password
  
  // JWT Secret (use a strong secret in production)
  JWT_SECRET: process.env.JWT_SECRET || "LiorianTech@JWT#Secret$2024%Secure&Key*Protected",
  
  // Token expiration
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "24h",
  
  // Session settings
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT || "1800000"), // 30 minutes in ms
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
  LOCKOUT_TIME: parseInt(process.env.LOCKOUT_TIME || "900000"), // 15 minutes in ms
};

// Default staff credentials (use environment variables in production)
export const DEFAULT_STAFF = [
  {
    id: 1,
    name: process.env.ADMIN_NAME || "Admin User",
    email: SECURITY_CONFIG.ADMIN_EMAIL,
    passwordHash: SECURITY_CONFIG.ADMIN_PASSWORD_HASH,
    role: "Administrator",
    permissions: ["view_all", "manage_candidates", "manage_jobs", "view_jobs", "manage_staff", "manage_posters", "view_analytics"],
    isActive: true,
    department: "Management",
    addedAt: "2024-01-01",
    lastLogin: null
  },
  {
    id: 2,
    name: process.env.HR_NAME || "HR Manager",
    email: process.env.HR_EMAIL || "hr@liorian.com",
    passwordHash: process.env.HR_PASSWORD_HASH || "$2b$10$8K7QkVf0V7PZfOZGJ5jZGecBtHYcTg5Kf1m5JjyOe9ZKvf6Kf3mIa", // Default: hr123 (FOR DEMO ONLY)
    role: "HR Manager",
    permissions: ["view_candidates", "manage_candidates", "view_jobs", "manage_jobs", "manage_applications"],
    isActive: true,
    department: "Human Resources",
    addedAt: "2024-01-15",
    lastLogin: null
  },
  {
    id: 3,
    name: process.env.PLACEMENT_NAME || "Placement Coordinator",
    email: process.env.PLACEMENT_EMAIL || "placement@liorian.com",
    passwordHash: process.env.PLACEMENT_PASSWORD_HASH || "$2b$10$9L8RlWg1W8QZgPAHJ6kAJfcCuIZdUh6Lg2n6KkzPf0ALwg7Lg4nJb", // Default: placement123 (FOR DEMO ONLY)
    role: "Placement Coordinator",
    permissions: ["view_candidates", "manage_applications", "view_jobs", "manage_jobs"],
    isActive: true,
    department: "Placement",
    addedAt: "2024-01-20",
    lastLogin: null
  },
  {
    id: 4,
    name: process.env.TRAINING_NAME || "Training Manager",
    email: process.env.TRAINING_EMAIL || "training@liorian.com",
    passwordHash: process.env.TRAINING_PASSWORD_HASH || "$2b$10$0M9SmXh2X9RahQBIK7lBKgdDvJAdVi7Mh3o7LlzQg1BMxh8Mh5oKc", // Default: training123 (FOR DEMO ONLY)
    role: "Training Manager",
    permissions: ["view_candidates", "manage_training", "view_progress"],
    isActive: true,
    department: "Training",
    addedAt: "2024-01-25",
    lastLogin: null
  }
];

// Default candidate credentials (for demo purposes only)
export const DEFAULT_CANDIDATES = [
  {
    id: 1,
    name: process.env.DEMO_CANDIDATE_1_NAME || "John Doe",
    email: process.env.DEMO_CANDIDATE_1_EMAIL || "john.doe@email.com",
    passwordHash: process.env.DEMO_CANDIDATE_1_PASSWORD_HASH || "$2b$10$1N0TnYi3Y0SbiRCJL8mCLfeDwKBfWj8Ni4p8MmzRh2CNyi9Ni6pLd", // Default: john123 (FOR DEMO ONLY)
    phone: "9876543210",
    course: "Python Fullstack Developer",
    option: "Course + Placement Support",
    message: "Looking for career change from finance to tech",
    appliedAt: "2024-01-15",
    enrolledAt: "2024-01-16",
    status: "In Progress",
    isActive: true,
    lastLogin: null
  },
  {
    id: 2,
    name: process.env.DEMO_CANDIDATE_2_NAME || "Sarah Smith",
    email: process.env.DEMO_CANDIDATE_2_EMAIL || "sarah.smith@email.com",
    passwordHash: process.env.DEMO_CANDIDATE_2_PASSWORD_HASH || "$2b$10$2O1UoZj4Z1TcjSDLM9nDMgfExLCgXk9Oj5q9NnzSi3DOzk0Oj7qMe", // Default: sarah123 (FOR DEMO ONLY)
    phone: "8765432109",
    course: "Data Analyst",
    option: "Course Only",
    message: "Recent graduate seeking data analysis skills",
    appliedAt: "2024-01-20",
    enrolledAt: "2024-01-21",
    status: "Completed",
    isActive: true,
    lastLogin: null
  },
  {
    id: 3,
    name: process.env.DEMO_CANDIDATE_3_NAME || "Mike Johnson",
    email: process.env.DEMO_CANDIDATE_3_EMAIL || "mike.j@email.com",
    passwordHash: process.env.DEMO_CANDIDATE_3_PASSWORD_HASH || "$2b$10$3P2VpAk5A2UdjTEMO0oENhgGfMDhYl0Pk6r0OozTj4EPAl1Pk8rNf", // Default: mike123 (FOR DEMO ONLY)
    phone: "7654321098",
    course: "Cybersecurity",
    option: "Placement Only",
    message: "Have security experience, need job placement help",
    appliedAt: "2024-01-25",
    enrolledAt: "2024-01-26",
    status: "Placed",
    isActive: true,
    lastLogin: null
  }
];

// Utility functions for password management
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

// Security warning for production
if (process.env.NODE_ENV === 'production') {
  const hasDefaultCredentials = 
    !process.env.ADMIN_PASSWORD_HASH ||
    !process.env.HR_PASSWORD_HASH ||
    !process.env.JWT_SECRET ||
    SECURITY_CONFIG.JWT_SECRET === "your-super-secret-jwt-key-change-this-in-production";
    
  if (hasDefaultCredentials) {
    console.warn(`
⚠️  SECURITY WARNING: Default credentials detected in production!
Please set proper environment variables:
- ADMIN_PASSWORD_HASH
- HR_PASSWORD_HASH
- JWT_SECRET
- All other credential environment variables
    `);
  }
}
