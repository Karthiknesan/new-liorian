import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import {
  handleAdminLogin,
  handleGetCandidates,
  handleAddCandidate,
  handleAddApplication,
  handleGetStaff,
  handleAddStaff,
  handleGetJobs,
  handleAddJob,
  handleUpdateJobStatus,
  handleDeleteJob,
  handleGetPosters,
  handleAddPoster,
  handleDeletePoster,
  handleTogglePosterStatus,
  handleGetManagedCandidates,
  handleAddManagedCandidate,
  handleDeleteManagedCandidate,
  handleToggleManagedCandidateStatus,
  handleUpdateApplicationStatus,
  handleGetFeeStructures,
  handleGetFeePayments
} from './routes/admin.js';
import {
  handleCandidateLogin,
  handleCandidateRegister,
  handleGetJobs as handleGetCandidateJobs,
  handleGetCandidateProfile,
  handleApplyToJob
} from './routes/candidates.js';
import {
  handleSuperAdminLogin,
  authenticateSuperAdmin,
  handleSuperAdminGetCandidates,
  handleSuperAdminGetJobs,
  handleSuperAdminGetPosters,
  handleSuperAdminGetStaff,
  handleSuperAdminGetManagedCandidates,
  handleSuperAdminGetFees,
  handleSuperAdminGetFeePayments
} from './routes/super-admin.js';
import {
  handleStaffLogin,
  handleGetStaffProfile,
  handleGetAllStaff,
  handleAddStaff,
  handleUpdateStaffStatus,
  requireStaffPermission
} from './routes/staff-auth.js';
import {
  validateToken,
  handleTokenValidation,
  handleKeepAlive,
  handleLogout
} from './routes/auth.js';
import {
  trackProgress,
  submitQuizResult,
  getUserProgress,
  generateTrainingReport,
  getAllUsersProgress
} from './routes/training.js';
import {
  handleNewsletterSubscribe,
  handleGetSubscribers,
  handleNewsletterUnsubscribe,
  handleSendOffer,
  handleDeleteSubscriber,
  handleExportSubscribers
} from './routes/newsletter.js';
import {
  generalRateLimit,
  authRateLimit,
  authSlowDown,
  apiRateLimit,
  checkAccountLockout
} from './middleware/rateLimiter.js';
import {
  authenticateToken,
  requireAdmin,
  requireStaff,
  requirePermission
} from './utils/jwt.js';
import { uploadToS3, listS3Files, verifyS3Connection, S3_CONFIG } from './s3-config.js';

// Create and configure Express app
export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Configure trust proxy for rate limiting (needed for deployment)
  app.set('trust proxy', 1);

  // Apply general rate limiting to all routes
  app.use(generalRateLimit);

  // Apply API-specific rate limiting to API routes
  app.use('/api', apiRateLimit);

  // Test JWT endpoint for debugging
  app.get('/api/test/jwt', authenticateToken, (req, res) => {
    res.json({
      message: 'JWT test successful',
      user: req.user,
      userType: req.user?.type,
      isAdmin: req.user?.type === 'admin',
      timestamp: new Date().toISOString()
    });
  });

  // Test JWT with permission
  app.get('/api/test/jwt-permission', authenticateToken, requirePermission('view_jobs'), (req, res) => {
    res.json({
      message: 'JWT and permission test successful',
      user: req.user,
      permission: 'view_jobs',
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    const s3Status = await verifyS3Connection();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      s3Config: {
        region: S3_CONFIG.region,
        bucketName: S3_CONFIG.bucketName,
        connected: s3Status.connected,
        error: s3Status.error
      }
    });
  });

  // Authentication routes
  app.post('/api/auth/validate', handleTokenValidation);
  app.post('/api/auth/keep-alive', handleKeepAlive);
  app.post('/api/auth/logout', handleLogout);

  // Super Admin routes (separate authentication system - no conflicts)
  app.post('/api/super-admin/login', authRateLimit, authSlowDown, checkAccountLockout, handleSuperAdminLogin);
  app.get('/api/super-admin/candidates', authenticateSuperAdmin, handleSuperAdminGetCandidates);
  app.get('/api/super-admin/jobs', authenticateSuperAdmin, handleSuperAdminGetJobs);
  app.get('/api/super-admin/posters', authenticateSuperAdmin, handleSuperAdminGetPosters);
  app.get('/api/super-admin/staff', authenticateSuperAdmin, handleSuperAdminGetStaff);
  app.get('/api/super-admin/managed-candidates', authenticateSuperAdmin, handleSuperAdminGetManagedCandidates);
  app.get('/api/super-admin/fees', authenticateSuperAdmin, handleSuperAdminGetFees);
  app.get('/api/super-admin/fee-payments', authenticateSuperAdmin, handleSuperAdminGetFeePayments);

  // Admin routes with rate limiting and RBAC
  app.post('/api/admin/login', authRateLimit, authSlowDown, checkAccountLockout, handleAdminLogin);
  app.get('/api/admin/candidates', authenticateToken, requireAdmin, handleGetCandidates);
  app.post('/api/admin/candidates', authenticateToken, requireAdmin, handleAddCandidate);

  // Staff authentication routes with rate limiting and RBAC
  app.post('/api/staff/login', authRateLimit, authSlowDown, checkAccountLockout, handleStaffLogin);
  app.get('/api/staff/profile', authenticateToken, requireStaff, handleGetStaffProfile);
  app.get('/api/staff/all', authenticateToken, requirePermission('manage_staff'), handleGetAllStaff);
  app.post('/api/staff/add', authenticateToken, requirePermission('manage_staff'), handleAddStaff);
  app.put('/api/staff/status', authenticateToken, requirePermission('manage_staff'), handleUpdateStaffStatus);
  app.delete('/api/staff/:staffId', (req, res) => {
    const { staffId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = Buffer.from(token, "base64").toString();

      // Only admin can delete staff
      if (!decoded.includes("admin@liorian.com")) {
        return res.status(403).json({
          message: "Only administrators can remove staff members.",
        });
      }

      // In a real app, you'd delete from database
      res.json({
        message: "Staff member removed successfully",
        staffId: parseInt(staffId)
      });
    } catch {
      return res.status(401).json({
        message: "Invalid token format.",
      });
    }
  });

  // Legacy staff management routes (for compatibility)
  app.get('/api/staff', handleGetStaff);
  app.post('/api/staff', handleAddStaff);

  // Job management routes with RBAC
  app.get('/api/admin/jobs', authenticateToken, requirePermission('view_jobs'), handleGetJobs);
  app.post('/api/admin/jobs', authenticateToken, requirePermission('manage_jobs'), handleAddJob);
  app.put('/api/admin/jobs/status', authenticateToken, requirePermission('manage_jobs'), handleUpdateJobStatus);
  app.delete('/api/admin/jobs/:jobId', authenticateToken, requirePermission('manage_jobs'), handleDeleteJob);

  // Poster management routes with RBAC
  app.get('/api/posters', handleGetPosters); // Public endpoint
  app.get('/api/admin/posters', authenticateToken, requirePermission('view_all'), handleGetPosters);
  app.post('/api/admin/posters', authenticateToken, requirePermission('manage_posters'), handleAddPoster);
  app.delete('/api/admin/posters', authenticateToken, requirePermission('manage_posters'), handleDeletePoster);
  app.put('/api/admin/posters/status', authenticateToken, requirePermission('manage_posters'), handleTogglePosterStatus);

  // Management routes (used by homepage)
  app.get('/api/management/staff', handleGetAllStaff);

  // Managed candidates routes with RBAC
  app.get('/api/admin/managed-candidates', authenticateToken, requirePermission('view_candidates'), handleGetManagedCandidates);
  app.post('/api/admin/managed-candidates', authenticateToken, requirePermission('manage_candidates'), handleAddManagedCandidate);
  app.delete('/api/admin/managed-candidates', authenticateToken, requirePermission('manage_candidates'), handleDeleteManagedCandidate);
  app.put('/api/admin/managed-candidates/status', authenticateToken, requirePermission('manage_candidates'), handleToggleManagedCandidateStatus);

  // Fee management routes with RBAC
  app.get('/api/admin/fees', authenticateToken, requirePermission('view_all'), handleGetFeeStructures);
  app.get('/api/admin/fee-payments', authenticateToken, requirePermission('view_all'), handleGetFeePayments);

  // Candidate routes with rate limiting and RBAC
  app.post('/api/candidates/login', authRateLimit, authSlowDown, checkAccountLockout, handleCandidateLogin);
  app.post('/api/candidates/register', authRateLimit, handleCandidateRegister);
  app.get('/api/candidates/jobs', handleGetCandidateJobs); // Public job listings
  app.get('/api/candidates/profile', authenticateToken, handleGetCandidateProfile);
  app.post('/api/candidates/apply', authenticateToken, handleApplyToJob);

  // Application submission route with S3 integration
  app.post('/api/applications', handleAddApplication);

  // S3 management endpoints
  app.get('/api/s3/verify', async (req, res) => {
    try {
      const result = await verifyS3Connection();
      res.json({
        message: 'S3 connection test completed',
        ...result,
        config: {
          region: S3_CONFIG.region,
          bucketName: S3_CONFIG.bucketName
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'S3 verification failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/s3/list', async (req, res) => {
    try {
      const prefix = req.query.prefix as string || 'applications/';
      const result = await listS3Files(prefix);
      
      if (result.success) {
        res.json({
          message: 'Files listed successfully',
          files: result.files,
          totalFiles: result.files?.length || 0,
          bucket: S3_CONFIG.bucketName,
          prefix
        });
      } else {
        res.status(500).json({
          message: 'Failed to list S3 files',
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'S3 list operation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/s3/test-upload', async (req, res) => {
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        data: req.body || { message: 'Test upload from API' },
        bucket: S3_CONFIG.bucketName,
        region: S3_CONFIG.region
      };
      
      const buffer = Buffer.from(JSON.stringify(testData, null, 2), 'utf-8');
      const fileName = `test-upload-${Date.now()}.json`;
      const result = await uploadToS3(buffer, fileName, 'application/json');
      
      res.json({
        message: 'S3 test upload completed',
        result,
        testData: {
          fileName,
          size: buffer.length,
          contentType: 'application/json'
        },
        s3Config: {
          region: S3_CONFIG.region,
          bucketName: S3_CONFIG.bucketName
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'S3 test upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Job application endpoints with RBAC
  app.put('/api/admin/applications/status', authenticateToken, requirePermission('manage_applications'), handleUpdateApplicationStatus);

  // Training Module API endpoints
  app.post('/api/training/progress', authenticateToken, trackProgress);
  app.post('/api/training/quiz-result', authenticateToken, submitQuizResult);
  app.get('/api/training/progress/:userId', authenticateToken, getUserProgress);
  app.get('/api/training/report/:userId', authenticateToken, generateTrainingReport);
  app.get('/api/training/admin/all-progress', authenticateToken, requirePermission('view_all'), getAllUsersProgress);

  // Newsletter API endpoints
  app.post('/api/newsletter/subscribe', handleNewsletterSubscribe);
  app.get('/api/newsletter/unsubscribe/:email', handleNewsletterUnsubscribe);

  // Newsletter management (admin only)
  app.get('/api/admin/newsletter/subscribers', authenticateToken, requireAdmin, handleGetSubscribers);
  app.post('/api/admin/newsletter/send-offer', authenticateToken, requireAdmin, handleSendOffer);
  app.delete('/api/admin/newsletter/subscribers/:email', authenticateToken, requireAdmin, handleDeleteSubscriber);
  app.get('/api/admin/newsletter/export', authenticateToken, requireAdmin, handleExportSubscribers);

  // Demo data endpoints for testing
  app.get('/api/demo/candidates', (req, res) => {
    res.json({
      message: 'Demo candidate data',
      candidates: [
        {
          id: 1,
          name: 'Demo Candidate',
          email: 'demo@example.com',
          course: 'Python Fullstack',
          status: 'In Progress',
          appliedAt: new Date().toISOString().split('T')[0]
        }
      ]
    });
  });

  // Debug endpoint to check current candidates
  app.get('/api/debug/candidates-count', (req, res) => {
    const { CANDIDATES_DATA } = require('./routes/admin.js');
    res.json({
      message: 'Current candidates in memory',
      totalCount: CANDIDATES_DATA.length,
      recentApplications: CANDIDATES_DATA.slice(-3).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        appliedAt: c.appliedAt,
        uploadedToS3: c.uploadedToS3,
        s3Key: c.s3Key || 'none'
      }))
    });
  });

  // S3 status dashboard endpoint with RBAC
  app.get('/api/admin/s3-status', authenticateToken, requirePermission('view_all'), async (req, res) => {
    try {

      const s3Verification = await verifyS3Connection();
      const filesList = await listS3Files('applications/');
      
      res.json({
        message: 'S3 status retrieved',
        s3Status: {
          connected: s3Verification.connected,
          error: s3Verification.error,
          bucket: S3_CONFIG.bucketName,
          region: S3_CONFIG.region,
          filesCount: filesList.files?.length || 0,
          lastChecked: new Date().toISOString()
        },
        recentFiles: filesList.files?.slice(0, 10) || []
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve S3 status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // 404 handler for API routes only
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      message: 'API route not found',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

// Default export for compatibility
export default createServer;

// Only start server when this file is run directly (not imported)
// Using ES modules compatible check
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;
  const app = createServer();
  
  app.listen(PORT, () => {
    console.log(`
🚀 Server running on port ${PORT}
📊 Admin Dashboard: http://localhost:${PORT}/admin-dashboard
🗄️  S3 Configuration: ${S3_CONFIG.bucketName} (${S3_CONFIG.region})
🔧 Health Check: http://localhost:${PORT}/api/health
📝 S3 Verification: http://localhost:${PORT}/api/s3/verify
📋 S3 File List: http://localhost:${PORT}/api/s3/list
🧪 S3 Test Upload: http://localhost:${PORT}/api/s3/test-upload
    `);
  });
}
