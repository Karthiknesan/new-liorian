import { RequestHandler } from "express";
import fs from 'fs/promises';
import path from 'path';

// Types for training data
interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  slideNumber: number;
  timestamp: string;
  timeSpent: number;
  completed: boolean;
  quizScore?: number;
}

interface QuizResult {
  userId: string;
  courseId: string;
  moduleId: string;
  quizId: string;
  score: number;
  answers: number[];
  timeSpent: number;
  timestamp: string;
  passed: boolean;
}

interface TrainingReport {
  userId: string;
  userName: string;
  courseProgress: {
    courseId: string;
    courseName: string;
    totalModules: number;
    completedModules: number;
    averageScore: number;
    timeSpent: number;
    lastAccessed: string;
  }[];
  overallProgress: number;
  totalTimeSpent: number;
  certificationsEarned: string[];
  generatedAt: string;
}

// In-memory storage (in production, use a proper database)
let userProgressData: UserProgress[] = [];
let quizResults: QuizResult[] = [];

// Track user progress through training modules
export const trackProgress: RequestHandler = async (req, res) => {
  try {
    const progressData: UserProgress = req.body;
    
    // Validate required fields
    if (!progressData.userId || !progressData.courseId || !progressData.moduleId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add timestamp if not provided
    if (!progressData.timestamp) {
      progressData.timestamp = new Date().toISOString();
    }

    // Store progress data
    userProgressData.push(progressData);

    // Optional: Save to S3 for persistent storage
    if (process.env.AWS_S3_BUCKET) {
      await saveProgressToS3(progressData);
    }

    // Optional: Save to local file for development
    await saveProgressToFile(progressData);

    res.json({ 
      success: true, 
      message: 'Progress tracked successfully',
      progressId: userProgressData.length - 1 
    });
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ error: 'Failed to track progress' });
  }
};

// Submit quiz results
export const submitQuizResult: RequestHandler = async (req, res) => {
  try {
    const quizData: QuizResult = req.body;
    
    // Validate required fields
    if (!quizData.userId || !quizData.courseId || !quizData.moduleId || !quizData.quizId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add timestamp if not provided
    if (!quizData.timestamp) {
      quizData.timestamp = new Date().toISOString();
    }

    // Store quiz result
    quizResults.push(quizData);

    // Optional: Save to S3 for persistent storage
    if (process.env.AWS_S3_BUCKET) {
      await saveQuizResultToS3(quizData);
    }

    // Optional: Save to local file for development
    await saveQuizResultToFile(quizData);

    res.json({ 
      success: true, 
      message: 'Quiz result submitted successfully',
      resultId: quizResults.length - 1,
      passed: quizData.passed
    });
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    res.status(500).json({ error: 'Failed to submit quiz result' });
  }
};

// Get user progress
export const getUserProgress: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.query;

    let userProgress = userProgressData.filter(p => p.userId === userId);
    
    if (courseId) {
      userProgress = userProgress.filter(p => p.courseId === courseId);
    }

    // Get quiz results for the user
    let userQuizResults = quizResults.filter(q => q.userId === userId);
    
    if (courseId) {
      userQuizResults = userQuizResults.filter(q => q.courseId === courseId);
    }

    // Calculate statistics
    const stats = calculateUserStats(userProgress, userQuizResults);

    res.json({
      success: true,
      progress: userProgress,
      quizResults: userQuizResults,
      stats
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
};

// Generate comprehensive training report
export const generateTrainingReport: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { format = 'json' } = req.query;

    // Get all progress data for the user
    const userProgress = userProgressData.filter(p => p.userId === userId);
    const userQuizResults = quizResults.filter(q => q.userId === userId);

    if (userProgress.length === 0 && userQuizResults.length === 0) {
      return res.status(404).json({ error: 'No training data found for user' });
    }

    // Generate comprehensive report
    const report = await generateComprehensiveReport(userId, userProgress, userQuizResults);

    if (format === 'pdf') {
      // Generate PDF report
      const pdfBuffer = await generatePDFReport(report);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="training-report-${userId}.pdf"`);
      res.send(pdfBuffer);
    } else {
      res.json({
        success: true,
        report
      });
    }
  } catch (error) {
    console.error('Error generating training report:', error);
    res.status(500).json({ error: 'Failed to generate training report' });
  }
};

// Get all users progress (admin only)
export const getAllUsersProgress: RequestHandler = async (req, res) => {
  try {
    // Group progress by user
    const userGroups = userProgressData.reduce((groups: { [key: string]: UserProgress[] }, progress) => {
      if (!groups[progress.userId]) {
        groups[progress.userId] = [];
      }
      groups[progress.userId].push(progress);
      return groups;
    }, {});

    // Group quiz results by user
    const userQuizGroups = quizResults.reduce((groups: { [key: string]: QuizResult[] }, result) => {
      if (!groups[result.userId]) {
        groups[result.userId] = [];
      }
      groups[result.userId].push(result);
      return groups;
    }, {});

    // Generate summary for each user
    const userSummaries = Object.keys(userGroups).map(userId => {
      const progress = userGroups[userId] || [];
      const quizzes = userQuizGroups[userId] || [];
      const stats = calculateUserStats(progress, quizzes);
      
      return {
        userId,
        totalModulesStarted: progress.length,
        totalQuizzesTaken: quizzes.length,
        averageScore: stats.averageQuizScore,
        totalTimeSpent: stats.totalTimeSpent,
        lastActivity: stats.lastActivity,
        ...stats
      };
    });

    res.json({
      success: true,
      totalUsers: userSummaries.length,
      userSummaries,
      overallStats: {
        totalProgressEntries: userProgressData.length,
        totalQuizResults: quizResults.length,
        averageScore: userSummaries.reduce((sum, user) => sum + user.averageScore, 0) / userSummaries.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching all users progress:', error);
    res.status(500).json({ error: 'Failed to fetch users progress' });
  }
};

// Utility functions
function calculateUserStats(progress: UserProgress[], quizResults: QuizResult[]) {
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const completedModules = progress.filter(p => p.completed).length;
  const averageQuizScore = quizResults.length > 0 
    ? quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length 
    : 0;
  const passedQuizzes = quizResults.filter(q => q.passed).length;
  const lastActivity = progress.length > 0 
    ? Math.max(...progress.map(p => new Date(p.timestamp).getTime()))
    : null;

  return {
    totalTimeSpent,
    completedModules,
    averageQuizScore: Math.round(averageQuizScore),
    passedQuizzes,
    totalQuizzes: quizResults.length,
    passRate: quizResults.length > 0 ? Math.round((passedQuizzes / quizResults.length) * 100) : 0,
    lastActivity: lastActivity ? new Date(lastActivity).toISOString() : null
  };
}

async function generateComprehensiveReport(userId: string, progress: UserProgress[], quizResults: QuizResult[]): Promise<TrainingReport> {
  const stats = calculateUserStats(progress, quizResults);
  
  // Group by course
  const courseGroups = progress.reduce((groups: { [key: string]: UserProgress[] }, p) => {
    if (!groups[p.courseId]) {
      groups[p.courseId] = [];
    }
    groups[p.courseId].push(p);
    return groups;
  }, {});

  const courseProgress = Object.keys(courseGroups).map(courseId => {
    const courseData = courseGroups[courseId];
    const courseQuizzes = quizResults.filter(q => q.courseId === courseId);
    const courseStats = calculateUserStats(courseData, courseQuizzes);
    
    return {
      courseId,
      courseName: getCourseNameById(courseId),
      totalModules: getTotalModulesByCourse(courseId),
      completedModules: courseStats.completedModules,
      averageScore: courseStats.averageQuizScore,
      timeSpent: courseStats.totalTimeSpent,
      lastAccessed: courseStats.lastActivity || ''
    };
  });

  return {
    userId,
    userName: `User ${userId}`, // In production, fetch from user database
    courseProgress,
    overallProgress: Math.round((stats.completedModules / getTotalModulesForUser()) * 100),
    totalTimeSpent: stats.totalTimeSpent,
    certificationsEarned: getCertificationsEarned(userId, quizResults),
    generatedAt: new Date().toISOString()
  };
}

// Helper functions (implement based on your data structure)
function getCourseNameById(courseId: string): string {
  const courseNames: { [key: string]: string } = {
    'cloud-computing': 'Cloud Computing',
    'data-analyst': 'Data Analyst',
    'data-scientist': 'Data Scientists',
    'cybersecurity': 'Cybersecurity',
    'devops': 'DevOps',
    'python-fullstack': 'Python Full-Stack',
    'java-fullstack': 'Java Full-Stack',
    'banking-finance': 'Banking & Finance'
  };
  return courseNames[courseId] || courseId;
}

function getTotalModulesByCourse(courseId: string): number {
  // This should be based on your actual course structure
  const moduleCounts: { [key: string]: number } = {
    'cloud-computing': 8,
    'data-analyst': 7,
    'data-scientist': 10,
    'cybersecurity': 9,
    'devops': 8,
    'python-fullstack': 12,
    'java-fullstack': 13,
    'banking-finance': 6
  };
  return moduleCounts[courseId] || 10;
}

function getTotalModulesForUser(): number {
  return 20; // Default total modules across all courses
}

function getCertificationsEarned(userId: string, quizResults: QuizResult[]): string[] {
  const certifications = [];
  const coursesCompleted = new Set();
  
  // Check if user passed all quizzes in a course
  quizResults.forEach(result => {
    if (result.passed && result.score >= 80) {
      coursesCompleted.add(result.courseId);
    }
  });
  
  coursesCompleted.forEach(courseId => {
    certifications.push(`${getCourseNameById(courseId as string)} Certification`);
  });
  
  return certifications;
}

// File storage functions
async function saveProgressToFile(progress: UserProgress) {
  try {
    const dir = path.join(process.cwd(), 'data', 'training');
    await fs.mkdir(dir, { recursive: true });
    
    const filename = path.join(dir, `progress-${progress.userId}-${Date.now()}.json`);
    await fs.writeFile(filename, JSON.stringify(progress, null, 2));
  } catch (error) {
    console.error('Error saving progress to file:', error);
  }
}

async function saveQuizResultToFile(quizResult: QuizResult) {
  try {
    const dir = path.join(process.cwd(), 'data', 'training');
    await fs.mkdir(dir, { recursive: true });
    
    const filename = path.join(dir, `quiz-${quizResult.userId}-${Date.now()}.json`);
    await fs.writeFile(filename, JSON.stringify(quizResult, null, 2));
  } catch (error) {
    console.error('Error saving quiz result to file:', error);
  }
}

// Import S3 utility functions
import {
  saveProgressToS3 as saveToS3,
  saveQuizResultToS3 as saveQuizToS3,
  getUserProgressFromS3,
  getQuizResultsFromS3,
  saveReportToS3,
  savePDFReportToS3
} from '../utils/trainingS3.js';

// S3 storage functions
async function saveProgressToS3(progress: UserProgress) {
  try {
    const s3Progress = {
      userId: progress.userId,
      courseId: progress.courseId,
      moduleId: progress.moduleId,
      slideNumber: progress.slideNumber,
      timestamp: progress.timestamp,
      timeSpent: progress.timeSpent,
      completed: progress.completed,
      quizScore: progress.quizScore
    };

    const result = await saveToS3(s3Progress);
    if (!result.success) {
      console.error('Failed to save progress to S3:', result.error);
    }
    return result;
  } catch (error) {
    console.error('Error saving progress to S3:', error);
    return { success: false, error: 'S3 save failed' };
  }
}

async function saveQuizResultToS3(quizResult: QuizResult) {
  try {
    const result = await saveQuizToS3(quizResult);
    if (!result.success) {
      console.error('Failed to save quiz result to S3:', result.error);
    }
    return result;
  } catch (error) {
    console.error('Error saving quiz result to S3:', error);
    return { success: false, error: 'S3 save failed' };
  }
}

// PDF generation (placeholder - implement with a PDF library like puppeteer or jsPDF)
async function generatePDFReport(report: TrainingReport): Promise<Buffer> {
  // Implement PDF generation
  const pdfContent = JSON.stringify(report, null, 2);
  return Buffer.from(pdfContent, 'utf-8');
}
