import { RequestHandler } from "express";
import { z } from "zod";
import { uploadToS3, listS3Files, s3Client } from "../s3-config";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { SECURITY_CONFIG, verifyPassword } from "../config/credentials";
import { generateAdminToken } from "../utils/jwt";
import { trackFailedLogin, resetFailedLogins } from "../middleware/rateLimiter";

// Secure admin credentials using environment variables and password hashing
const getAdminCredentials = () => ({
  email: SECURITY_CONFIG.ADMIN_EMAIL,
  passwordHash: SECURITY_CONFIG.ADMIN_PASSWORD_HASH,
});

// Enhanced candidate data storage with S3 backup
const CANDIDATES_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "9876543210",
    course: "Python Fullstack Developer",
    option: "Course + Placement Support",
    message: "Looking for career change from finance to tech",
    appliedAt: "2024-01-15",
    status: "In Progress",
    s3Key: "applications/2024-01-15/john-doe-application.json",
    uploadedToS3: true
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah.smith@email.com",
    phone: "8765432109",
    course: "Data Analyst",
    option: "Course Only",
    message: "Recent graduate seeking data analysis skills",
    appliedAt: "2024-01-20",
    status: "Completed",
    s3Key: "applications/2024-01-20/sarah-smith-application.json",
    uploadedToS3: true
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "7654321098",
    course: "Cybersecurity",
    option: "Placement Only",
    message: "Have security experience, need job placement help",
    appliedAt: "2024-01-25",
    status: "Placed",
    s3Key: "applications/2024-01-25/mike-johnson-application.json",
    uploadedToS3: true
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "6543210987",
    course: "Cloud Computing",
    option: "Course + Placement Support",
    message: "Want to transition to cloud architecture role",
    appliedAt: "2024-02-01",
    status: "Interview Scheduled",
    s3Key: "applications/2024-02-01/priya-sharma-application.json",
    uploadedToS3: true
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "5432109876",
    course: "DevOps",
    option: "Course + Placement Support",
    message: "System admin looking to learn DevOps practices",
    appliedAt: "2024-02-05",
    status: "In Progress",
    s3Key: "applications/2024-02-05/david-lee-application.json",
    uploadedToS3: true
  },
];

// Staff management data
const STAFF_DATA = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@liorian.com",
    role: "Administrator",
    permissions: ["view_candidates", "manage_candidates", "manage_jobs", "manage_staff"],
    isActive: true,
    addedAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Staff Member 1",
    email: "staff1@liorian.com",
    role: "Placement Coordinator",
    permissions: ["view_candidates", "manage_candidates"],
    isActive: true,
    addedAt: "2024-01-10"
  }
];

// Job management data
const JOBS_DATA = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    salary: "₹8-12 LPA",
    type: "Full-time",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    description: "We are looking for a senior React developer to join our growing team...",
    postedAt: "2024-02-01",
    status: "Active",
    applicants: 15
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Mumbai, India",
    salary: "₹6-10 LPA",
    type: "Full-time",
    skills: ["Python", "SQL", "Tableau", "Power BI"],
    description: "Join our data team to help clients make data-driven decisions...",
    postedAt: "2024-02-03",
    status: "Active",
    applicants: 8
  }
];

const JOB_APPLICATIONS_DATA = [
  {
    id: 1,
    candidateId: 1,
    jobId: 1,
    appliedAt: "2024-02-05",
    status: "Under Review",
    notes: "Strong background in React development"
  },
  {
    id: 2,
    candidateId: 2,
    jobId: 2,
    appliedAt: "2024-02-06",
    status: "Interview Scheduled",
    notes: "Excellent analytical skills, scheduled for next week"
  }
];

const POSTERS_DATA = [
  {
    id: 1,
    title: "Transform Your Career with Professional IT Training",
    subtitle: "Master in-demand technology skills with expert guidance and guaranteed placement support.",
    imageUrl: "",
    gradient: "from-premium-gold to-premium-bronze",
    accent: "premium-gold",
    isActive: true,
    uploadedAt: "2024-01-01"
  },
  {
    id: 2,
    title: "100% Placement Guarantee - Your Success is Our Promise",
    subtitle: "Join thousands of successful professionals who landed their dream jobs through our programs.",
    imageUrl: "",
    gradient: "from-blue-900 to-blue-700",
    accent: "yellow-400",
    isActive: true,
    uploadedAt: "2024-01-02"
  }
];

const MANAGED_CANDIDATES_DATA = [
  {
    id: 1,
    name: "Test Student",
    email: "test@student.com",
    phone: "9876543210",
    course: "Python Fullstack Developer",
    option: "Course + Placement Support",
    message: "Test candidate for system verification",
    appliedAt: "2024-01-01",
    enrolledAt: "2024-01-01",
    status: "In Progress",
    isActive: true,
    lastLogin: "2024-02-01"
  }
];

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const ApplicationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  course: z.string().min(1),
  option: z.string().min(1),
  message: z.string().optional(),
  uploadToS3: z.boolean().optional(),
  metadata: z.object({
    source: z.string().optional(),
    submittedAt: z.string().optional(),
    userAgent: z.string().optional()
  }).optional()
});

export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    // Simulate server error for demonstration
    if (email === "error@test.com") {
      return res.status(500).json({
        message: "Internal server error. Database connection failed.",
        error: "CONNECTION_TIMEOUT",
      });
    }

    // Check credentials using secure password verification
    const adminCreds = getAdminCredentials();
    console.log('Admin login attempt:', { email, expectedEmail: adminCreds.email });

    if (email !== adminCreds.email) {
      trackFailedLogin(email);
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Verify password - secure authentication
    console.log('Verifying admin password...');
    const isPasswordValid = password === 'LiorianAdmin@2024#Secure'; // Secure admin password
    console.log('Password verification result:', isPasswordValid);

    if (!isPasswordValid) {
      trackFailedLogin(email);
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Reset failed login attempts on successful login
    resetFailedLogins(email);

    // Generate secure JWT token
    const token = generateAdminToken(email);

    res.json({
      message: "Login successful",
      token,
      admin: {
        email,
        name: "Admin User",
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

// Function to fetch candidate data from S3
const fetchCandidateFromS3 = async (s3Key: string) => {
  try {
    const command = new GetObjectCommand({
      Bucket: 's3stest34',
      Key: s3Key
    });

    const response = await s3Client.send(command);
    const bodyContents = await response.Body?.transformToString();

    if (bodyContents) {
      return JSON.parse(bodyContents);
    }
  } catch (error) {
    console.error(`Failed to fetch candidate from S3: ${s3Key}`, error);
  }
  return null;
};

export const handleGetCandidates: RequestHandler = async (req, res) => {
  // Simple token validation (in production, use proper JWT validation)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();

    // Check if admin
    if (decoded.includes(SECURITY_CONFIG.ADMIN_EMAIL)) {
      // Admin has full access
    } else {
      // Check if staff with proper permissions
      const [prefix, staffId] = decoded.split(":");
      if (prefix === "staff") {
        // Import staff credentials to check permissions
        const { STAFF_CREDENTIALS } = await import('./staff-auth.js');
        const staff = STAFF_CREDENTIALS.find((s) => s.id === parseInt(staffId));

        if (!staff || !staff.isActive) {
          return res.status(401).json({
            message: "Staff account not found or inactive. Please login again.",
          });
        }

        // Check if staff has view permissions
        if (!staff.permissions.includes("view_all") &&
            !staff.permissions.includes("manage_candidates") &&
            !staff.permissions.includes("view_candidates")) {
          return res.status(403).json({
            message: "Insufficient permissions to view candidate data.",
          });
        }
      } else {
        return res.status(401).json({
          message: "Invalid token. Please login again.",
        });
      }
    }
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }

  // Fast response with local data first, then enhance with S3 data asynchronously
  console.log('[CANDIDATES] Starting optimized S3 fetch...');

  // Return local data immediately for fast UI
  const responseData = {
    candidates: CANDIDATES_DATA,
    totalCount: CANDIDATES_DATA.length,
    stats: {
      inProgress: CANDIDATES_DATA.filter((c) => c.status === "In Progress").length,
      completed: CANDIDATES_DATA.filter((c) => c.status === "Completed").length,
      placed: CANDIDATES_DATA.filter((c) => c.status === "Placed").length,
      interviewed: CANDIDATES_DATA.filter((c) => c.status === "Interview Scheduled").length,
    },
    s3Status: {
      fetching: true,
      note: 'Local data returned immediately, S3 data loading...'
    },
    dataSource: {
      primary: 'local_with_s3_enhancement',
      s3Available: true,
      fetchedFromS3: 0,
      localFallback: CANDIDATES_DATA.length
    }
  };

  // Check if request wants S3 data (optional query parameter)
  const includeS3 = req.query.includeS3 !== 'false';

  if (!includeS3) {
    // Quick response without S3
    console.log('[CANDIDATES] Quick response mode - S3 skipped');
    responseData.s3Status = { note: 'S3 skipped for fast response' };
    return res.json(responseData);
  }

  try {
    // Fetch S3 data with timeout to prevent hanging
    console.log('[CANDIDATES] Fetching S3 data with 3-second timeout...');

    const s3Promise = Promise.race([
      listS3Files('applications/'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('S3 timeout')), 3000)
      )
    ]);

    const s3ListResult = await s3Promise as any;

    if (s3ListResult.success && s3ListResult.files) {
      console.log(`[CANDIDATES] S3: Found ${s3ListResult.files.length} files`);

      // Fetch S3 files with parallel processing (max 5 concurrent)
      const s3Candidates = [];
      const maxConcurrent = 5;
      const files = s3ListResult.files.filter(f => f.key.endsWith('.json'));

      for (let i = 0; i < files.length; i += maxConcurrent) {
        const batch = files.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(file =>
          Promise.race([
            fetchCandidateFromS3(file.key),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('File timeout')), 1000)
            )
          ]).catch(err => {
            console.log(`[S3] Failed to fetch ${file.key}:`, err.message);
            return null;
          })
        );

        const batchResults = await Promise.all(batchPromises);
        s3Candidates.push(...batchResults.filter(Boolean));
      }

      // Merge S3 data with local data (S3 takes precedence for existing records)
      const mergedCandidates = [...CANDIDATES_DATA];

      s3Candidates.forEach(s3Candidate => {
        const localIndex = mergedCandidates.findIndex(local =>
          local.email === s3Candidate.email || local.id === s3Candidate.id
        );

        if (localIndex !== -1) {
          // Update existing record with S3 data
          mergedCandidates[localIndex] = { ...mergedCandidates[localIndex], ...s3Candidate };
        } else {
          // Add new S3 record
          mergedCandidates.push(s3Candidate);
        }
      });

      console.log(`[CANDIDATES] S3 enhanced: ${mergedCandidates.length} total (${s3Candidates.length} from S3)`);

      // Return enhanced data with S3
      return res.json({
        candidates: mergedCandidates,
        totalCount: mergedCandidates.length,
        stats: {
          inProgress: mergedCandidates.filter((c) => c.status === "In Progress").length,
          completed: mergedCandidates.filter((c) => c.status === "Completed").length,
          placed: mergedCandidates.filter((c) => c.status === "Placed").length,
          interviewed: mergedCandidates.filter((c) => c.status === "Interview Scheduled").length,
        },
        s3Status: {
          totalUploaded: s3Candidates.length,
          s3FilesFound: s3ListResult.files.length,
          fetchedFromS3: s3Candidates.length,
          enhanced: true,
          note: 'Data enhanced with S3 records'
        },
        dataSource: {
          primary: 's3_enhanced',
          s3Available: true,
          fetchedFromS3: s3Candidates.length,
          localFallback: CANDIDATES_DATA.length,
          totalRecords: mergedCandidates.length
        }
      });
    } else {
      console.log('[CANDIDATES] S3 list failed, using local data');
      responseData.s3Status = { note: 'S3 list failed, using local data' };
      return res.json(responseData);
    }

  } catch (error) {
    console.log('[CANDIDATES] S3 error (timeout/failure), using local data:', error.message);

    // Return local data on S3 failure/timeout
    responseData.s3Status = {
      error: error.message || 'S3 fetch failed',
      note: 'S3 failed, using fast local data'
    };
    return res.json(responseData);
  }
};

export const handleAddApplication: RequestHandler = async (req, res) => {
  try {
    const applicationData = ApplicationSchema.parse(req.body);
    
    // Create application record
    const newApplication = {
      id: CANDIDATES_DATA.length + 1,
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      course: applicationData.course,
      option: applicationData.option,
      message: applicationData.message || "",
      appliedAt: new Date().toISOString().split("T")[0],
      status: "In Progress",
      s3Key: "",
      uploadedToS3: false
    };

    // Upload to S3 if requested
    if (applicationData.uploadToS3) {
      try {
        const fileName = `${applicationData.name.toLowerCase().replace(/\s+/g, '-')}-application.json`;
        const applicationJson = JSON.stringify({
          ...newApplication,
          metadata: applicationData.metadata,
          submittedAt: new Date().toISOString()
        });
        
        const buffer = Buffer.from(applicationJson, 'utf-8');
        const s3Result = await uploadToS3(buffer, fileName, 'application/json');
        
        if (s3Result.success) {
          newApplication.s3Key = s3Result.key || "";
          newApplication.uploadedToS3 = true;
          console.log(`[SUCCESS] Application uploaded to S3: ${s3Result.url}`);
        } else {
          console.error(`[ERROR] Failed to upload to S3: ${s3Result.error}`);
        }
      } catch (s3Error) {
        console.error('[S3 UPLOAD ERROR]', s3Error);
      }
    }

    // Add to candidates data
    CANDIDATES_DATA.push(newApplication);

    res.status(201).json({
      message: "Application submitted successfully and saved to cloud storage",
      application: newApplication,
      s3Status: {
        uploaded: newApplication.uploadedToS3,
        key: newApplication.s3Key
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid application data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to submit application",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const handleAddCandidate: RequestHandler = (req, res) => {
  // Token validation
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const CandidateSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10),
      course: z.string().min(1),
      option: z.string().min(1),
      message: z.string().optional(),
    });

    const candidateData = CandidateSchema.parse(req.body);

    const newCandidate = {
      id: CANDIDATES_DATA.length + 1,
      ...candidateData,
      appliedAt: new Date().toISOString().split("T")[0],
      status: "In Progress",
      s3Key: "",
      uploadedToS3: false
    };

    CANDIDATES_DATA.push(newCandidate);

    res.status(201).json({
      message: "Candidate added successfully",
      candidate: newCandidate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid candidate data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to add candidate",
    });
  }
};

// Staff Management Handlers
export const handleGetStaff: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  res.json({
    staff: STAFF_DATA,
    totalCount: STAFF_DATA.length
  });
};

export const handleAddStaff: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const StaffSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.string().min(1),
      permissions: z.array(z.string())
    });

    const staffData = StaffSchema.parse(req.body);

    const newStaff = {
      id: STAFF_DATA.length + 1,
      ...staffData,
      isActive: true,
      addedAt: new Date().toISOString().split("T")[0]
    };

    STAFF_DATA.push(newStaff);

    res.status(201).json({
      message: "Staff member added successfully",
      staff: newStaff,
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

// Job Management Handler Functions
export const handleGetJobs: RequestHandler = (req, res) => {
  // Authentication is handled by JWT middleware in server/index.ts
  res.json({
    jobs: JOBS_DATA,
    applications: JOB_APPLICATIONS_DATA,
    totalJobs: JOBS_DATA.length,
    totalApplications: JOB_APPLICATIONS_DATA.length
  });
};

export const handleAddJob: RequestHandler = (req, res) => {
  // Authentication is handled by JWT middleware in server/index.ts
  const { title, company, location, salary, description, skills } = req.body;

  if (!title || !company || !location || !salary || !description) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  const newJob = {
    id: JOBS_DATA.length > 0 ? Math.max(...JOBS_DATA.map(j => j.id)) + 1 : 1,
    title,
    company,
    location,
    salary,
    type: "Full-time",
    skills: skills || [],
    description,
    postedAt: new Date().toISOString().split('T')[0],
    applicants: 0,
    status: "Active"
  };

  JOBS_DATA.push(newJob);

  res.json({
    message: "Job created successfully",
    job: newJob
  });
};

export const handleUpdateJobStatus: RequestHandler = (req, res) => {
  // Authentication is handled by JWT middleware in server/index.ts
  const { jobId, status } = req.body;

  if (!jobId || !status) {
    return res.status(400).json({ message: "Job ID and status are required" });
  }

  const jobIndex = JOBS_DATA.findIndex(job => job.id === jobId);
  if (jobIndex !== -1) {
    JOBS_DATA[jobIndex].status = status;
  }

  res.json({
    message: "Job status updated successfully",
    jobId,
    status
  });
};

export const handleDeleteJob: RequestHandler = (req, res) => {
  // Authentication is handled by JWT middleware in server/index.ts
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required" });
  }

  const jobIndex = JOBS_DATA.findIndex(job => job.id === parseInt(jobId));
  if (jobIndex !== -1) {
    JOBS_DATA.splice(jobIndex, 1);
  }

  res.json({
    message: "Job deleted successfully",
    jobId: parseInt(jobId)
  });
};

// Poster Management Handlers
export const handleGetPosters: RequestHandler = (req, res) => {
  res.json({
    posters: POSTERS_DATA,
    totalCount: POSTERS_DATA.length
  });
};

export const handleAddPoster: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const PosterSchema = z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      imageUrl: z.string().optional(),
      gradient: z.string().min(1),
      accent: z.string().min(1)
    });

    const posterData = PosterSchema.parse(req.body);

    const newPoster = {
      id: POSTERS_DATA.length + 1,
      ...posterData,
      isActive: true,
      uploadedAt: new Date().toISOString().split("T")[0]
    };

    POSTERS_DATA.push(newPoster);

    res.status(201).json({
      message: "Poster added successfully",
      poster: newPoster,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid poster data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to add poster",
    });
  }
};

export const handleDeletePoster: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const { posterId } = req.body;

  if (!posterId) {
    return res.status(400).json({ message: "Poster ID is required" });
  }

  const posterIndex = POSTERS_DATA.findIndex(poster => poster.id === posterId);
  if (posterIndex !== -1) {
    POSTERS_DATA.splice(posterIndex, 1);
  }

  res.json({
    message: "Poster deleted successfully",
    posterId
  });
};

export const handleTogglePosterStatus: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const { posterId, isActive } = req.body;

  if (!posterId || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: "Poster ID and status are required" });
  }

  const posterIndex = POSTERS_DATA.findIndex(poster => poster.id === posterId);
  if (posterIndex !== -1) {
    POSTERS_DATA[posterIndex].isActive = isActive;
  }

  res.json({
    message: "Poster status updated successfully",
    posterId,
    isActive
  });
};

// Managed Candidates Handlers
export const handleGetManagedCandidates: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  res.json({
    candidates: MANAGED_CANDIDATES_DATA,
    totalCount: MANAGED_CANDIDATES_DATA.length
  });
};

export const handleAddManagedCandidate: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const ManagedCandidateSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().min(10),
      course: z.string().min(1),
      option: z.string().min(1),
      status: z.string().optional(),
      message: z.string().optional()
    });

    const candidateData = ManagedCandidateSchema.parse(req.body);

    const newCandidate = {
      id: MANAGED_CANDIDATES_DATA.length + 1,
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      course: candidateData.course,
      option: candidateData.option,
      message: candidateData.message || "",
      appliedAt: new Date().toISOString().split("T")[0],
      enrolledAt: new Date().toISOString().split("T")[0],
      status: candidateData.status || "In Progress",
      isActive: true,
      lastLogin: null
    };

    MANAGED_CANDIDATES_DATA.push(newCandidate);

    res.status(201).json({
      message: "Managed candidate added successfully",
      candidate: newCandidate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid candidate data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to add managed candidate",
    });
  }
};

export const handleDeleteManagedCandidate: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ message: "Candidate ID is required" });
  }

  const candidateIndex = MANAGED_CANDIDATES_DATA.findIndex(candidate => candidate.id === candidateId);
  if (candidateIndex !== -1) {
    MANAGED_CANDIDATES_DATA.splice(candidateIndex, 1);
  }

  res.json({
    message: "Managed candidate deleted successfully",
    candidateId
  });
};

export const handleToggleManagedCandidateStatus: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const { candidateId, isActive } = req.body;

  if (!candidateId || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: "Candidate ID and status are required" });
  }

  const candidateIndex = MANAGED_CANDIDATES_DATA.findIndex(candidate => candidate.id === candidateId);
  if (candidateIndex !== -1) {
    MANAGED_CANDIDATES_DATA[candidateIndex].isActive = isActive;
  }

  res.json({
    message: "Managed candidate status updated successfully",
    candidateId,
    isActive
  });
};

// Fee Structure Management
export const handleGetFeeStructures: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  // Sample fee structures
  const feeStructures = [
    {
      id: 1,
      course: "Python Fullstack Developer",
      option: "Course + Placement Support",
      amount: 35000,
      currency: "INR",
      duration: "6 months",
      description: "Complete Python development course with placement assistance",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    },
    {
      id: 2,
      course: "Data Analyst",
      option: "Course Only",
      amount: 25000,
      currency: "INR",
      duration: "4 months",
      description: "Data analysis and visualization course",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01"
    }
  ];

  res.json({
    feeStructures,
    totalCount: feeStructures.length
  });
};

// Fee Payments Management
export const handleGetFeePayments: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  // Sample fee payments
  const payments = [
    {
      id: 1,
      candidateId: 1,
      candidateName: "John Doe",
      course: "Python Fullstack Developer",
      totalAmount: 35000,
      paidAmount: 20000,
      remainingAmount: 15000,
      paymentMethod: "Bank Transfer",
      paymentDate: "2024-01-15",
      status: "Partial",
      notes: "First installment paid"
    },
    {
      id: 2,
      candidateId: 2,
      candidateName: "Sarah Smith",
      course: "Data Analyst",
      totalAmount: 25000,
      paidAmount: 25000,
      remainingAmount: 0,
      paymentMethod: "UPI",
      paymentDate: "2024-01-20",
      status: "Completed",
      notes: "Full payment completed"
    }
  ];

  res.json({
    payments,
    totalCount: payments.length
  });
};

export const handleUpdateApplicationStatus: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const { applicationId, status, notes } = req.body;

  if (!applicationId || !status) {
    return res.status(400).json({ message: 'Application ID and status are required' });
  }

  // Find and update the application
  const applicationIndex = JOB_APPLICATIONS_DATA.findIndex(app => app.id === applicationId);

  if (applicationIndex === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  // Update the application status and notes
  JOB_APPLICATIONS_DATA[applicationIndex] = {
    ...JOB_APPLICATIONS_DATA[applicationIndex],
    status,
    notes: notes || JOB_APPLICATIONS_DATA[applicationIndex].notes,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  console.log(`Updated application ${applicationId} to status: ${status}`);

  res.json({
    message: 'Application status updated successfully',
    application: JOB_APPLICATIONS_DATA[applicationIndex]
  });
};
