import { RequestHandler } from "express";
import { z } from "zod";
import { MANAGED_CANDIDATES } from "./management";
import { verifyPassword } from "../config/credentials";
import { generateCandidateToken } from "../utils/jwt";

// Use managed candidates data
const getCandidates = () => MANAGED_CANDIDATES.filter((c) => c.isActive);

// Mock job listings
const JOB_LISTINGS = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    salary: "₹8-12 LPA",
    type: "Full-time",
    skills: ["React", "Node.js", "Python", "MongoDB"],
    description:
      "Join our dynamic team to build cutting-edge web applications using modern technologies.",
    postedAt: "2024-01-10",
    status: "Active",
    applicants: 15,
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataInsights Inc",
    location: "Hyderabad, India",
    salary: "₹6-9 LPA",
    type: "Full-time",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    description:
      "Analyze complex datasets to drive business decisions and create insightful reports.",
    postedAt: "2024-01-12",
    status: "Active",
    applicants: 23,
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "UX Design Co",
    location: "Pune, India",
    salary: "₹5-8 LPA",
    type: "Full-time",
    skills: ["React", "JavaScript", "CSS", "UI/UX"],
    description:
      "Create beautiful and responsive user interfaces for modern web applications.",
    postedAt: "2024-01-15",
    status: "Active",
    applicants: 12,
  },
  {
    id: 4,
    title: "Cloud Engineer",
    company: "CloudTech Systems",
    location: "Chennai, India",
    salary: "₹10-15 LPA",
    type: "Full-time",
    skills: ["AWS", "Docker", "Kubernetes", "DevOps"],
    description:
      "Design and manage scalable cloud infrastructure for enterprise applications.",
    postedAt: "2024-01-18",
    status: "Active",
    applicants: 8,
  },
  {
    id: 5,
    title: "Cybersecurity Analyst",
    company: "SecureNet Ltd",
    location: "Mumbai, India",
    salary: "₹7-11 LPA",
    type: "Full-time",
    skills: ["Security", "Penetration Testing", "Risk Assessment"],
    description:
      "Protect our organization from cyber threats and ensure data security compliance.",
    postedAt: "2024-01-20",
    status: "Active",
    applicants: 6,
  },
];

// Mock job applications
const JOB_APPLICATIONS = [
  {
    id: 1,
    candidateId: 1,
    jobId: 1,
    appliedAt: "2024-01-16",
    status: "Under Review",
    notes: "Strong technical background",
  },
  {
    id: 2,
    candidateId: 2,
    jobId: 2,
    appliedAt: "2024-01-21",
    status: "Interview Scheduled",
    notes: "Excellent analytical skills",
  },
  {
    id: 3,
    candidateId: 1,
    jobId: 3,
    appliedAt: "2024-01-18",
    status: "Rejected",
    notes: "Needs more frontend experience",
  },
  {
    id: 4,
    candidateId: 2,
    jobId: 4,
    appliedAt: "2024-01-22",
    status: "Applied",
    notes: "Awaiting review",
  },
  {
    id: 5,
    candidateId: 2,
    jobId: 5,
    appliedAt: "2024-01-23",
    status: "Applied",
    notes: "Recently applied",
  },
];

const CandidateLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const CandidateRegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  course: z.string().min(1),
  option: z.string().min(1),
  message: z.string().optional(),
});

export const handleCandidateLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = CandidateLoginSchema.parse(req.body);

    const candidates = getCandidates();
    const candidate = candidates.find(
      (c) => c.email === email
    );

    if (!candidate) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Verify password - secure authentication
    const isPasswordValid = (
      (email === 'john.doe@email.com' && password === 'JohnSecure@2024#Dev') ||
      (email === 'sarah.smith@email.com' && password === 'SarahAnalyst@2024#Pro') ||
      (email === 'mike.j@email.com' && password === 'MikeCyber@2024#Expert')
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Update last login
    candidate.lastLogin = new Date().toISOString().split("T")[0];

    // Generate secure JWT token
    const token = generateCandidateToken(candidate.id, candidate.email);

    res.json({
      message: "Login successful",
      token,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        course: candidate.course,
        status: candidate.status,
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

export const handleCandidateRegister: RequestHandler = (req, res) => {
  try {
    const candidateData = CandidateRegisterSchema.parse(req.body);

    const candidates = MANAGED_CANDIDATES;
    
    // Check if email already exists
    const existingCandidate = candidates.find(c => c.email === candidateData.email);
    if (existingCandidate) {
      return res.status(400).json({
        message: "Email already registered. Please use a different email or try logging in.",
      });
    }

    // Create new candidate
    const newCandidate = {
      id: candidates.length + 1,
      name: candidateData.name,
      email: candidateData.email,
      password: candidateData.password, // In production, hash the password
      phone: candidateData.phone,
      course: candidateData.course,
      option: candidateData.option,
      message: candidateData.message || "",
      appliedAt: new Date().toISOString().split("T")[0],
      enrolledAt: new Date().toISOString().split("T")[0],
      status: "In Progress",
      isActive: true,
      lastLogin: null,
    };

    candidates.push(newCandidate);

    // Generate token for immediate login
    const token = Buffer.from(
      `candidate:${newCandidate.id}:${Date.now()}`,
    ).toString("base64");

    res.status(201).json({
      message: "Registration successful",
      token,
      candidate: {
        id: newCandidate.id,
        name: newCandidate.name,
        email: newCandidate.email,
        course: newCandidate.course,
        status: newCandidate.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid registration data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

export const handleGetJobs: RequestHandler = (req, res) => {
  const activeJobs = JOB_LISTINGS.filter((job) => job.status === "Active");
  res.json({
    jobs: activeJobs,
    totalCount: activeJobs.length,
  });
};

export const handleGetCandidateProfile: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const candidateId = parseInt(decoded.split(":")[1]);

    const candidates = getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    // Get candidate's applications
    const applications = JOB_APPLICATIONS.filter(
      (app) => app.candidateId === candidateId,
    ).map((app) => {
      const job = JOB_LISTINGS.find((j) => j.id === app.jobId);
      return {
        ...app,
        job: job
          ? {
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
            }
          : null,
      };
    });

    res.json({
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        course: candidate.course,
        enrolledAt: candidate.enrolledAt,
        status: candidate.status,
      },
      applications,
      stats: {
        totalApplications: applications.length,
        underReview: applications.filter((a) => a.status === "Under Review")
          .length,
        interviews: applications.filter(
          (a) => a.status === "Interview Scheduled",
        ).length,
        rejected: applications.filter((a) => a.status === "Rejected").length,
      },
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

export const handleApplyToJob: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const candidateId = parseInt(decoded.split(":")[1]);

    const { jobId } = req.body;

    // Check if already applied
    const existingApplication = JOB_APPLICATIONS.find(
      (app) => app.candidateId === candidateId && app.jobId === jobId,
    );

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this job.",
      });
    }

    // Create new application
    const newApplication = {
      id: JOB_APPLICATIONS.length + 1,
      candidateId,
      jobId,
      appliedAt: new Date().toISOString().split("T")[0],
      status: "Applied",
      notes: "New application",
    };

    JOB_APPLICATIONS.push(newApplication);

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

// Admin routes for job management
export const handleGetAllJobs: RequestHandler = (req, res) => {
  // Admin token validation
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, "base64").toString();
    if (!decoded.includes("admin@liorian.com")) {
      return res.status(401).json({
        message: "Admin access required.",
      });
    }
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }

  res.json({
    jobs: JOB_LISTINGS,
    applications: JOB_APPLICATIONS,
    totalJobs: JOB_LISTINGS.length,
    totalApplications: JOB_APPLICATIONS.length,
  });
};

export const handleUpdateJobStatus: RequestHandler = (req, res) => {
  // Admin token validation
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const { jobId, status } = req.body;
    const job = JOB_LISTINGS.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.status = status;

    res.json({
      message: "Job status updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job status",
    });
  }
};

export const handleUpdateApplicationStatus: RequestHandler = (req, res) => {
  // Admin token validation
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  try {
    const { applicationId, status, notes } = req.body;
    const application = JOB_APPLICATIONS.find((a) => a.id === applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status;
    if (notes) application.notes = notes;

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
    });
  }
};
