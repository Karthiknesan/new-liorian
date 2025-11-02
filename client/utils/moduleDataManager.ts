// Module Data Manager - Dynamic module loading service
interface ModuleContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource';
  content: string;
  duration: number; // in minutes
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  attempts: number;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  points: number;
}

interface TrainingModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  week: string;
  duration: string;
  objectives: string[];
  topics: string[];
  assignments: string[];
  resources: string[];
  content: ModuleContent[];
  quiz?: Quiz;
  prerequisites: string[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  isActive: boolean;
}

class ModuleDataManager {
  private static instance: ModuleDataManager;
  private modules: TrainingModule[] = [];
  private courses: Course[] = [];
  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadData();
  }

  static getInstance(): ModuleDataManager {
    if (!ModuleDataManager.instance) {
      ModuleDataManager.instance = new ModuleDataManager();
    }
    return ModuleDataManager.instance;
  }

  private loadData() {
    // Load modules from localStorage or use defaults
    const savedModules = localStorage.getItem('trainingModules');
    if (savedModules) {
      this.modules = JSON.parse(savedModules);
    } else {
      this.modules = this.generateDefaultModules();
      this.saveModules();
    }

    // Load courses
    this.courses = [
      { id: 'cloud-computing', title: 'Cloud Computing', description: 'AWS, Azure, GCP', icon: '☁️', duration: '16 weeks', level: 'Beginner', isActive: true },
      { id: 'data-analyst', title: 'Data Analyst', description: 'Python, SQL, Tableau', icon: '📊', duration: '14 weeks', level: 'Beginner', isActive: true },
      { id: 'data-scientist', title: 'Data Scientists', description: 'ML, AI, Python', icon: '🔬', duration: '20 weeks', level: 'Advanced', isActive: true },
      { id: 'cybersecurity', title: 'Cybersecurity', description: 'Ethical Hacking, Security', icon: '🔐', duration: '18 weeks', level: 'Intermediate', isActive: true },
      { id: 'devops', title: 'DevOps', description: 'Docker, Kubernetes, CI/CD', icon: '⚙️', duration: '16 weeks', level: 'Intermediate', isActive: true },
      { id: 'python-fullstack', title: 'Python Full-Stack', description: 'Django, React, APIs', icon: '🐍', duration: '24 weeks', level: 'Beginner', isActive: true },
      { id: 'java-fullstack', title: 'Java Full-Stack', description: 'Spring Boot, React', icon: '☕', duration: '26 weeks', level: 'Beginner', isActive: true },
      { id: 'banking-finance', title: 'Banking & Finance', description: 'Financial Analysis, Excel', icon: '🏦', duration: '12 weeks', level: 'Beginner', isActive: true },
      { id: 'digital-marketing', title: 'Digital Marketing', description: 'SEO, SEM, Social Media', icon: '📱', duration: '10 weeks', level: 'Beginner', isActive: true },
      { id: 'project-management', title: 'Project Management', description: 'Agile, Scrum, PMP', icon: '📋', duration: '8 weeks', level: 'Intermediate', isActive: true }
    ];
  }

  private generateDefaultModules(): TrainingModule[] {
    const modules: TrainingModule[] = [];
    
    this.courses.forEach((course) => {
      const moduleCount = this.getModuleCount(course.id);
      
      for (let i = 1; i <= moduleCount; i++) {
        modules.push({
          id: `${course.id}-module-${i}`,
          courseId: course.id,
          title: this.getModuleTitle(course.id, i),
          description: this.getModuleDescription(course.id, i),
          week: `${i * 2 - 1}-${i * 2}`,
          duration: '2 weeks',
          objectives: this.getModuleObjectives(course.id, i),
          topics: this.getModuleTopics(course.id, i),
          assignments: this.getModuleAssignments(course.id, i),
          resources: this.getModuleResources(course.id, i),
          content: this.generateModuleContent(course.id, i),
          quiz: this.generateModuleQuiz(course.id, i),
          prerequisites: i > 1 ? [`${course.id}-module-${i - 1}`] : [],
          isActive: true,
          order: i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        });
      }
    });
    
    return modules;
  }

  private getModuleCount(courseId: string): number {
    const counts: { [key: string]: number } = {
      'digital-marketing': 5,
      'project-management': 4,
      'banking-finance': 6,
      'data-analyst': 7,
      'cybersecurity': 9,
      'data-scientist': 10,
      'python-fullstack': 12,
      'java-fullstack': 13,
      'cloud-computing': 8,
      'devops': 8
    };
    return counts[courseId] || 8;
  }

  private getModuleTitle(courseId: string, moduleNumber: number): string {
    const courseTitles: { [key: string]: string[] } = {
      'cloud-computing': [
        'Cloud Fundamentals',
        'AWS Core Services', 
        'Advanced AWS',
        'Azure Fundamentals',
        'Google Cloud Platform',
        'DevOps Integration',
        'Infrastructure as Code',
        'Project & Certification'
      ],
      'data-analyst': [
        'Advanced Excel & Statistics',
        'Advanced SQL & Database Analytics',
        'Advanced Python Analytics',
        'Executive Data Visualization',
        'Advanced Statistical Analytics',
        'Enterprise Business Intelligence',
        'Executive Capstone Projects'
      ],
      'digital-marketing': [
        'Digital Marketing Fundamentals',
        'Search Engine Optimization',
        'Pay-Per-Click Advertising',
        'Social Media Marketing',
        'Analytics & Optimization'
      ],
      'project-management': [
        'Project Management Fundamentals',
        'Agile & Scrum Methodologies',
        'Project Planning & Execution',
        'Leadership & Project Closure'
      ]
    };

    const titles = courseTitles[courseId];
    if (titles && titles[moduleNumber - 1]) {
      return titles[moduleNumber - 1];
    }
    
    return `Module ${moduleNumber}: Advanced Concepts`;
  }

  private getModuleDescription(courseId: string, moduleNumber: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return `Comprehensive training module covering essential ${course?.title || 'course'} concepts and practical applications. Module ${moduleNumber} builds upon previous knowledge and introduces advanced techniques.`;
  }

  private getModuleObjectives(courseId: string, moduleNumber: number): string[] {
    return [
      `Master core concepts of module ${moduleNumber}`,
      `Apply practical skills in real-world scenarios`,
      `Complete hands-on projects and assessments`,
      `Prepare for certification and job interviews`
    ];
  }

  private getModuleTopics(courseId: string, moduleNumber: number): string[] {
    const course = this.courses.find(c => c.id === courseId);
    return [
      `Introduction to ${course?.title} Module ${moduleNumber}`,
      'Core concepts and principles',
      'Practical applications and use cases',
      'Industry best practices and standards',
      'Advanced techniques and optimization'
    ];
  }

  private getModuleAssignments(courseId: string, moduleNumber: number): string[] {
    return [
      `Practical exercise ${moduleNumber}`,
      'Real-world case study analysis',
      'Hands-on project implementation',
      'Peer review and collaboration exercise'
    ];
  }

  private getModuleResources(courseId: string, moduleNumber: number): string[] {
    return [
      `Module ${moduleNumber} comprehensive documentation`,
      'Video tutorials and interactive demos',
      'Practice exercises and coding challenges',
      'Industry articles and best practices guide',
      'Community forums and discussion boards'
    ];
  }

  private generateModuleContent(courseId: string, moduleNumber: number): ModuleContent[] {
    const course = this.courses.find(c => c.id === courseId);
    return [
      {
        id: `${courseId}-content-${moduleNumber}-1`,
        title: `Welcome to ${course?.title} Module ${moduleNumber}`,
        description: 'Module overview and learning objectives',
        type: 'text',
        content: `Welcome to Module ${moduleNumber} of ${course?.title}. In this comprehensive module, you will learn essential concepts and gain practical experience that will prepare you for real-world applications.`,
        duration: 15,
        order: 1
      },
      {
        id: `${courseId}-content-${moduleNumber}-2`,
        title: `Core Concepts Video Lecture`,
        description: 'In-depth explanation of key concepts',
        type: 'video',
        content: 'Interactive video content covering fundamental concepts',
        duration: 45,
        order: 2
      },
      {
        id: `${courseId}-content-${moduleNumber}-3`,
        title: `Hands-on Practice Session`,
        description: 'Interactive exercises and coding practice',
        type: 'assignment',
        content: 'Step-by-step guided exercises to reinforce learning',
        duration: 60,
        order: 3
      },
      {
        id: `${courseId}-content-${moduleNumber}-4`,
        title: `Additional Resources`,
        description: 'Supplementary materials and references',
        type: 'resource',
        content: 'Collection of useful links, documentation, and tools',
        duration: 20,
        order: 4
      }
    ];
  }

  private generateModuleQuiz(courseId: string, moduleNumber: number): Quiz {
    const course = this.courses.find(c => c.id === courseId);
    return {
      id: `${courseId}-quiz-${moduleNumber}`,
      title: `${course?.title} Module ${moduleNumber} Assessment`,
      timeLimit: 30,
      passingScore: 70,
      attempts: 3,
      questions: [
        {
          id: `${courseId}-q-${moduleNumber}-1`,
          question: `What is the primary focus of ${course?.title} Module ${moduleNumber}?`,
          type: 'multiple-choice',
          options: [
            'Basic introduction to concepts',
            'Advanced practical applications',
            'Theoretical background only',
            'Certification preparation'
          ],
          correctAnswer: 1,
          explanation: 'Module focuses on advanced practical applications that prepare students for real-world scenarios.',
          points: 10
        },
        {
          id: `${courseId}-q-${moduleNumber}-2`,
          question: `Which skill is most important for this module?`,
          type: 'multiple-choice',
          options: [
            'Memorization of facts',
            'Hands-on practice and application',
            'Reading theoretical materials',
            'Watching video content'
          ],
          correctAnswer: 1,
          explanation: 'Hands-on practice and real application of concepts is crucial for mastering the skills taught in this module.',
          points: 10
        },
        {
          id: `${courseId}-q-${moduleNumber}-3`,
          question: `True or False: This module builds upon previous learning?`,
          type: 'true-false',
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'Each module is designed to build upon concepts learned in previous modules, creating a comprehensive learning path.',
          points: 5
        }
      ]
    };
  }

  private saveModules() {
    localStorage.setItem('trainingModules', JSON.stringify(this.modules));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Public methods
  getAllModules(): TrainingModule[] {
    return this.modules.filter(m => m.isActive);
  }

  getModulesByCourse(courseId: string): TrainingModule[] {
    return this.modules
      .filter(m => m.courseId === courseId && m.isActive)
      .sort((a, b) => a.order - b.order);
  }

  getModule(courseId: string, moduleId: string): TrainingModule | null {
    // Support both module number and module ID
    const module = this.modules.find(m => {
      if (m.id === moduleId || m.id === `${courseId}-module-${moduleId}`) {
        return true;
      }
      // Try to match by order/number
      const moduleNumber = parseInt(moduleId);
      if (!isNaN(moduleNumber)) {
        return m.courseId === courseId && m.order === moduleNumber && m.isActive;
      }
      return false;
    });

    return module || null;
  }

  getCourse(courseId: string): Course | null {
    return this.courses.find(c => c.id === courseId) || null;
  }

  getAllCourses(): Course[] {
    return this.courses.filter(c => c.isActive);
  }

  updateModule(moduleId: string, updates: Partial<TrainingModule>) {
    const index = this.modules.findIndex(m => m.id === moduleId);
    if (index !== -1) {
      this.modules[index] = {
        ...this.modules[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveModules();
    }
  }

  addModule(module: TrainingModule) {
    this.modules.push(module);
    this.saveModules();
  }

  removeModule(moduleId: string) {
    this.modules = this.modules.filter(m => m.id !== moduleId);
    this.saveModules();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Progress tracking
  getUserProgress(userId: string, courseId: string) {
    const progressKey = `userProgress-${userId}-${courseId}`;
    const saved = localStorage.getItem(progressKey);
    return saved ? JSON.parse(saved) : null;
  }

  updateUserProgress(userId: string, courseId: string, moduleId: string, progress: any) {
    const progressKey = `userProgress-${userId}-${courseId}`;
    const currentProgress = this.getUserProgress(userId, courseId) || {};
    
    currentProgress[moduleId] = {
      ...currentProgress[moduleId],
      ...progress,
      lastAccessed: new Date().toISOString()
    };

    localStorage.setItem(progressKey, JSON.stringify(currentProgress));
  }

  getNextModule(courseId: string, currentModuleId: string): TrainingModule | null {
    const modules = this.getModulesByCourse(courseId);
    const currentIndex = modules.findIndex(m => m.id === currentModuleId);
    
    if (currentIndex !== -1 && currentIndex < modules.length - 1) {
      return modules[currentIndex + 1];
    }
    
    return null;
  }

  getPreviousModule(courseId: string, currentModuleId: string): TrainingModule | null {
    const modules = this.getModulesByCourse(courseId);
    const currentIndex = modules.findIndex(m => m.id === currentModuleId);
    
    if (currentIndex > 0) {
      return modules[currentIndex - 1];
    }
    
    return null;
  }
}

export default ModuleDataManager;
export type { TrainingModule, Course, ModuleContent, Quiz, Question };
