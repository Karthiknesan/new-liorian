// Progress Manager - Handles module progression and locking for candidates
interface ModuleProgress {
  moduleId: string;
  courseId: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  progress: number; // 0-100
  startedAt?: string;
  completedAt?: string;
  timeSpent: number; // in minutes
  quizScore?: number;
  attempts: number;
}

interface CandidateProgress {
  candidateId: string;
  email: string;
  modules: { [moduleId: string]: ModuleProgress };
  lastAccessedModule?: string;
  totalTimeSpent: number;
  coursesEnrolled: string[];
}

class ProgressManager {
  private static instance: ProgressManager;
  private progressData: { [candidateId: string]: CandidateProgress } = {};

  private constructor() {
    this.loadProgressData();
  }

  static getInstance(): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager();
    }
    return ProgressManager.instance;
  }

  private loadProgressData() {
    const saved = localStorage.getItem('candidateProgress');
    if (saved) {
      this.progressData = JSON.parse(saved);
    }
  }

  private saveProgressData() {
    localStorage.setItem('candidateProgress', JSON.stringify(this.progressData));
  }

  // Generate course modules (simplified for demo)
  private generateCourseModules(courseId: string) {
    const moduleCount = courseId === 'digital-marketing' ? 5 : courseId === 'project-management' ? 4 : 8;
    const modules = [];

    for (let i = 1; i <= moduleCount; i++) {
      modules.push({
        id: `${courseId}-module-${i}`,
        courseId: courseId,
        title: `Module ${i}`,
        order: i
      });
    }

    return modules;
  }

  // Initialize progress for a new candidate
  initializeCandidateProgress(candidateId: string, email: string, enrolledCourses: string[]) {
    if (!candidateId || !email) return;

    if (!this.progressData[candidateId]) {
      this.progressData[candidateId] = {
        candidateId,
        email,
        modules: {},
        totalTimeSpent: 0,
        coursesEnrolled: enrolledCourses || []
      };

      // Initialize first module as unlocked for each course
      enrolledCourses.forEach(courseId => {
        const firstModuleId = `${courseId}-module-1`;
        this.progressData[candidateId].modules[firstModuleId] = {
          moduleId: firstModuleId,
          courseId: courseId,
          isCompleted: false,
          isUnlocked: true,
          progress: 0,
          timeSpent: 0,
          attempts: 0
        };
      });

      this.saveProgressData();
    }
  }

  // Get candidate's progress for a specific course
  getCourseProgress(candidateId: string, courseId: string): ModuleProgress[] {
    const candidate = this.progressData[candidateId];
    if (!candidate) return [];

    // Generate modules for the course (simplified for demo)
    const courseModules = this.generateCourseModules(courseId);

    return courseModules.map((module: any, index: number) => {
      const existing = candidate.modules[module.id];
      if (existing) return existing;

      // Initialize module progress
      const isFirstModule = index === 0;
      const previousModule = index > 0 ? courseModules[index - 1] : null;
      const isPreviousCompleted = previousModule ? 
        candidate.modules[previousModule.id]?.isCompleted || false : true;

      const moduleProgress: ModuleProgress = {
        moduleId: module.id,
        courseId: courseId,
        isCompleted: false,
        isUnlocked: isFirstModule || isPreviousCompleted,
        progress: 0,
        timeSpent: 0,
        attempts: 0
      };

      candidate.modules[module.id] = moduleProgress;
      return moduleProgress;
    });
  }

  // Check if a module is unlocked for candidate
  isModuleUnlocked(candidateId: string, moduleId: string): boolean {
    const candidate = this.progressData[candidateId];
    if (!candidate) return false;

    const moduleProgress = candidate.modules[moduleId];
    return moduleProgress?.isUnlocked || false;
  }

  // Mark module as completed and unlock next module
  completeModule(candidateId: string, moduleId: string, quizScore?: number) {
    const candidate = this.progressData[candidateId];
    if (!candidate) return;

    // Mark current module as completed
    const moduleProgress = candidate.modules[moduleId];
    if (moduleProgress) {
      moduleProgress.isCompleted = true;
      moduleProgress.progress = 100;
      moduleProgress.completedAt = new Date().toISOString();
      if (quizScore !== undefined) {
        moduleProgress.quizScore = quizScore;
      }

      // Find and unlock next module in the same course
      const courseModules = this.generateCourseModules(moduleProgress.courseId);

      const currentIndex = courseModules.findIndex((m: any) => m.id === moduleId);
      if (currentIndex !== -1 && currentIndex < courseModules.length - 1) {
        const nextModule = courseModules[currentIndex + 1];
        if (!candidate.modules[nextModule.id]) {
          candidate.modules[nextModule.id] = {
            moduleId: nextModule.id,
            courseId: moduleProgress.courseId,
            isCompleted: false,
            isUnlocked: false,
            progress: 0,
            timeSpent: 0,
            attempts: 0
          };
        }
        candidate.modules[nextModule.id].isUnlocked = true;
      }

      this.saveProgressData();
    }
  }

  // Update module progress
  updateModuleProgress(candidateId: string, moduleId: string, progress: number, timeSpent: number = 0) {
    const candidate = this.progressData[candidateId];
    if (!candidate) return;

    if (!candidate.modules[moduleId]) {
      candidate.modules[moduleId] = {
        moduleId,
        courseId: '',
        isCompleted: false,
        isUnlocked: true,
        progress: 0,
        timeSpent: 0,
        attempts: 0
      };
    }

    const moduleProgress = candidate.modules[moduleId];
    moduleProgress.progress = Math.max(moduleProgress.progress, progress);
    moduleProgress.timeSpent += timeSpent;
    
    if (!moduleProgress.startedAt && progress > 0) {
      moduleProgress.startedAt = new Date().toISOString();
    }

    candidate.totalTimeSpent += timeSpent;
    candidate.lastAccessedModule = moduleId;

    this.saveProgressData();
  }

  // Get overall course completion percentage
  getCourseCompletionPercentage(candidateId: string, courseId: string): number {
    const progress = this.getCourseProgress(candidateId, courseId);
    if (progress.length === 0) return 0;

    const completedModules = progress.filter(m => m.isCompleted).length;
    return Math.round((completedModules / progress.length) * 100);
  }

  // Get candidate's overall progress
  getCandidateOverallProgress(candidateId: string) {
    const candidate = this.progressData[candidateId];
    if (!candidate) return null;

    const courses = candidate.coursesEnrolled.map(courseId => {
      const completion = this.getCourseCompletionPercentage(candidateId, courseId);
      const progress = this.getCourseProgress(candidateId, courseId);
      const totalModules = progress.length;
      const completedModules = progress.filter(m => m.isCompleted).length;
      const unlockedModules = progress.filter(m => m.isUnlocked).length;

      return {
        courseId,
        completion,
        totalModules,
        completedModules,
        unlockedModules,
        progress
      };
    });

    return {
      candidateId,
      email: candidate.email,
      totalTimeSpent: candidate.totalTimeSpent,
      lastAccessedModule: candidate.lastAccessedModule,
      courses
    };
  }

  // Reset candidate progress (for testing)
  resetCandidateProgress(candidateId: string) {
    delete this.progressData[candidateId];
    this.saveProgressData();
  }

  // Demo data initialization
  initializeDemoProgress() {
    // Initialize progress for demo candidates
    const demoCandidates = [
      { id: '1', email: 'john.doe@email.com', courses: ['cloud-computing'] },
      { id: '2', email: 'sarah.smith@email.com', courses: ['data-analyst'] },
      { id: '3', email: 'mike.j@email.com', courses: ['cybersecurity'] }
    ];

    demoCandidates.forEach(candidate => {
      this.initializeCandidateProgress(candidate.id, candidate.email, candidate.courses);
      
      // For demo, mark first module as unlocked
      const courseProgress = this.getCourseProgress(candidate.id, candidate.courses[0]);
      if (courseProgress.length > 0) {
        courseProgress[0].isUnlocked = true;
        this.saveProgressData();
      }
    });
  }
}

export default ProgressManager;
export type { ModuleProgress, CandidateProgress };
