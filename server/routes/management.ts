import { RequestHandler } from "express";
import { z } from "zod";
import { uploadToS3, deleteFromS3, type S3UploadResult } from "../s3-config";
import { DEFAULT_CANDIDATES } from "../config/credentials";

// Mock poster storage - in production this would be in a database
let POSTERS = [
  {
    id: 1,
    title: "Transform Your Career with Professional IT Training",
    subtitle:
      "Master in-demand technology skills with expert guidance and guaranteed placement support.",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    gradient: "from-premium-gold to-premium-bronze",
    accent: "premium-gold",
    isActive: true,
    uploadedAt: "2024-01-01",
  },
  {
    id: 2,
    title: "100% Placement Guarantee - Your Success is Our Promise",
    subtitle:
      "Join thousands of successful professionals who landed their dream jobs through our programs.",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    gradient: "from-blue-900 to-blue-700",
    accent: "yellow-400",
    isActive: true,
    uploadedAt: "2024-01-02",
  },
  {
    id: 3,
    title: "Industry-Expert Instructors & Hands-On Projects",
    subtitle:
      "Learn from professionals with real-world experience in leading tech companies.",
    imageUrl:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop",
    gradient: "from-purple-900 to-purple-700",
    accent: "green-400",
    isActive: true,
    uploadedAt: "2024-01-03",
  },
  {
    id: 4,
    title: "Flexible Learning Options & Dedicated Support",
    subtitle:
      "Choose your path: Course-only or Course + Placement with 1-on-1 mentorship.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    gradient: "from-red-900 to-red-700",
    accent: "blue-400",
    isActive: true,
    uploadedAt: "2024-01-04",
  },
];

// Enhanced candidate data with secure credentials from environment configuration
let MANAGED_CANDIDATES = DEFAULT_CANDIDATES.map(candidate => ({
  ...candidate,
  profileImage: null, // Add additional management fields
}));

const AdminTokenValidation = (req: any, res: any, next: any) => {
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
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token format.",
    });
  }
};

// Poster Management Routes
export const handleGetPosters: RequestHandler = (req, res) => {
  res.json({
    posters: POSTERS,
    totalCount: POSTERS.length,
    activeCount: POSTERS.filter((p) => p.isActive).length,
  });
};

export const handleGetActivePosters: RequestHandler = (req, res) => {
  const activePosters = POSTERS.filter((p) => p.isActive);
  res.json({
    posters: activePosters,
    totalCount: activePosters.length,
  });
};

export const handleAddPoster: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const PosterSchema = z.object({
        title: z.string().min(1),
        subtitle: z.string().min(1),
        imageUrl: z.string().url(),
        gradient: z
          .string()
          .optional()
          .default("from-premium-gold to-premium-bronze"),
        accent: z.string().optional().default("premium-gold"),
      });

      const posterData = PosterSchema.parse(req.body);

      const newPoster = {
        id: Math.max(...POSTERS.map((p) => p.id), 0) + 1,
        ...posterData,
        isActive: true,
        uploadedAt: new Date().toISOString().split("T")[0],
      };

      POSTERS.push(newPoster);

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
  },
];

export const handleUpdatePoster: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { posterId, ...updateData } = req.body;
      const posterIndex = POSTERS.findIndex((p) => p.id === posterId);

      if (posterIndex === -1) {
        return res.status(404).json({
          message: "Poster not found",
        });
      }

      POSTERS[posterIndex] = { ...POSTERS[posterIndex], ...updateData };

      res.json({
        message: "Poster updated successfully",
        poster: POSTERS[posterIndex],
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update poster",
      });
    }
  },
];

export const handleDeletePoster: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { posterId } = req.body;
      const posterIndex = POSTERS.findIndex((p) => p.id === posterId);

      if (posterIndex === -1) {
        return res.status(404).json({
          message: "Poster not found",
        });
      }

      const deletedPoster = POSTERS.splice(posterIndex, 1)[0];

      res.json({
        message: "Poster deleted successfully",
        poster: deletedPoster,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete poster",
      });
    }
  },
];

export const handleTogglePosterStatus: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { posterId, isActive } = req.body;
      const poster = POSTERS.find((p) => p.id === posterId);

      if (!poster) {
        return res.status(404).json({
          message: "Poster not found",
        });
      }

      poster.isActive = isActive;

      res.json({
        message: "Poster status updated successfully",
        poster,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update poster status",
      });
    }
  },
];

// User Management Routes
export const handleGetManagedCandidates: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    res.json({
      candidates: MANAGED_CANDIDATES,
      totalCount: MANAGED_CANDIDATES.length,
      activeCount: MANAGED_CANDIDATES.filter((c) => c.isActive).length,
      stats: {
        inProgress: MANAGED_CANDIDATES.filter((c) => c.status === "In Progress")
          .length,
        completed: MANAGED_CANDIDATES.filter((c) => c.status === "Completed")
          .length,
        placed: MANAGED_CANDIDATES.filter((c) => c.status === "Placed").length,
      },
    });
  },
];

export const handleAddCandidate: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const CandidateSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        phone: z.string().min(10),
        course: z.string().min(1),
        option: z.string().min(1),
        message: z.string().optional().default(""),
        status: z.string().optional().default("In Progress"),
      });

      const candidateData = CandidateSchema.parse(req.body);

      // Check if email already exists
      const existingCandidate = MANAGED_CANDIDATES.find(
        (c) => c.email === candidateData.email,
      );
      if (existingCandidate) {
        return res.status(400).json({
          message: "Candidate with this email already exists",
        });
      }

      const newCandidate = {
        id: Math.max(...MANAGED_CANDIDATES.map((c) => c.id), 0) + 1,
        ...candidateData,
        appliedAt: new Date().toISOString().split("T")[0],
        enrolledAt: new Date().toISOString().split("T")[0],
        isActive: true,
        lastLogin: null,
        profileImage: null,
      };

      MANAGED_CANDIDATES.push(newCandidate);

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
  },
];

export const handleUpdateCandidate: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { candidateId, ...updateData } = req.body;
      const candidateIndex = MANAGED_CANDIDATES.findIndex(
        (c) => c.id === candidateId,
      );

      if (candidateIndex === -1) {
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      // Don't allow updating sensitive fields through this endpoint
      const { password, ...safeUpdateData } = updateData;

      MANAGED_CANDIDATES[candidateIndex] = {
        ...MANAGED_CANDIDATES[candidateIndex],
        ...safeUpdateData,
      };

      res.json({
        message: "Candidate updated successfully",
        candidate: MANAGED_CANDIDATES[candidateIndex],
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update candidate",
      });
    }
  },
];

export const handleDeleteCandidate: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { candidateId } = req.body;
      const candidateIndex = MANAGED_CANDIDATES.findIndex(
        (c) => c.id === candidateId,
      );

      if (candidateIndex === -1) {
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      const deletedCandidate = MANAGED_CANDIDATES.splice(candidateIndex, 1)[0];

      res.json({
        message: "Candidate deleted successfully",
        candidate: deletedCandidate,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete candidate",
      });
    }
  },
];

export const handleToggleCandidateStatus: RequestHandler = [
  AdminTokenValidation,
  (req, res) => {
    try {
      const { candidateId, isActive } = req.body;
      const candidate = MANAGED_CANDIDATES.find((c) => c.id === candidateId);

      if (!candidate) {
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      candidate.isActive = isActive;

      res.json({
        message: "Candidate status updated successfully",
        candidate,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update candidate status",
      });
    }
  },
];

export const handleResetCandidatePassword: RequestHandler = (req, res) => {
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

  try {
    const { candidateId, newPassword } = req.body;
    const candidate = MANAGED_CANDIDATES.find((c) => c.id === candidateId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    candidate.password = newPassword;

    res.json({
      message: "Candidate password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reset candidate password",
    });
  }
};

// S3 File Upload Handlers

export const handleFileUpload: RequestHandler = [
  AdminTokenValidation,
  async (req, res) => {
    try {
      // In a real implementation, you'd use middleware like multer to handle file uploads
      // For now, we'll simulate file upload with mock data

      const { fileName, fileType, fileSize } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({
          message: "File name and type are required"
        });
      }

      // Create mock file buffer for demo
      const mockFileBuffer = Buffer.from(`Mock file content for ${fileName}`);

      const uploadResult: S3UploadResult = await uploadToS3(
        mockFileBuffer,
        fileName,
        fileType
      );

      if (uploadResult.success) {
        res.json({
          message: "File uploaded successfully",
          url: uploadResult.url,
          key: uploadResult.key
        });
      } else {
        res.status(500).json({
          message: "Failed to upload file",
          error: uploadResult.error
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error during file upload"
      });
    }
  }
];

export const handleFileDelete: RequestHandler = [
  AdminTokenValidation,
  async (req, res) => {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          message: "File key is required"
        });
      }

      const deleteResult = await deleteFromS3(key);

      if (deleteResult) {
        res.json({
          message: "File deleted successfully"
        });
      } else {
        res.status(500).json({
          message: "Failed to delete file"
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error during file deletion"
      });
    }
  }
];

// Export the managed candidates for use in other routes
export { MANAGED_CANDIDATES };
