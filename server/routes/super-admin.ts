import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Super Admin Authentication
export const authenticateSuperAdmin = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Super admin access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-admin-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid super admin token' });
  }
};

// Super Admin Login
export const handleSuperAdminLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Basic super admin credentials (should be moved to environment variables)
  if (username === 'superadmin' && password === 'SuperAdmin@2024') {
    const token = jwt.sign(
      { id: 'super-admin', role: 'super-admin' },
      process.env.JWT_SECRET || 'super-admin-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: 'super-admin', role: 'super-admin', username: 'superadmin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid super admin credentials' });
  }
};

// Super Admin Get Candidates
export const handleSuperAdminGetCandidates = (req: Request, res: Response) => {
  // Return sample data or integrate with database
  res.json({
    success: true,
    candidates: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        course: 'Full Stack Development',
        status: 'Active',
        joinDate: '2024-01-15'
      }
    ]
  });
};

// Super Admin Get Jobs
export const handleSuperAdminGetJobs = (req: Request, res: Response) => {
  res.json({
    success: true,
    jobs: [
      {
        id: 1,
        title: 'Full Stack Developer',
        company: 'Tech Corp',
        location: 'Bangalore',
        salary: '8-12 LPA',
        status: 'Active'
      }
    ]
  });
};

// Super Admin Get Posters
export const handleSuperAdminGetPosters = (req: Request, res: Response) => {
  res.json({
    success: true,
    posters: [
      {
        id: 1,
        title: 'New Course Launch',
        description: 'Data Science Bootcamp',
        status: 'Active',
        createdAt: '2024-01-01'
      }
    ]
  });
};

// Super Admin Get Staff
export const handleSuperAdminGetStaff = (req: Request, res: Response) => {
  res.json({
    success: true,
    staff: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@liorian.com',
        role: 'Admin',
        status: 'Active'
      }
    ]
  });
};

// Super Admin Get Managed Candidates
export const handleSuperAdminGetManagedCandidates = (req: Request, res: Response) => {
  res.json({
    success: true,
    candidates: [
      {
        id: 1,
        name: 'Jane Smith',
        course: 'Data Science',
        progress: 75,
        mentor: 'Senior Instructor'
      }
    ]
  });
};

// Super Admin Get Fees
export const handleSuperAdminGetFees = (req: Request, res: Response) => {
  res.json({
    success: true,
    fees: [
      {
        courseId: 1,
        courseName: 'Full Stack Development',
        totalFee: 50000,
        installments: 3
      }
    ]
  });
};

// Super Admin Get Fee Payments
export const handleSuperAdminGetFeePayments = (req: Request, res: Response) => {
  res.json({
    success: true,
    payments: [
      {
        id: 1,
        studentName: 'John Doe',
        amount: 15000,
        course: 'Full Stack Development',
        paymentDate: '2024-01-15',
        status: 'Completed'
      }
    ]
  });
};
