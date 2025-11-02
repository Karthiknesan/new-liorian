// Shared content management system
// This will be used by both the Admin Dashboard and the landing page

export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  status: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  publishedAt: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  status: string;
  icon?: string;
  link?: string;
}

class ContentManager {
  private static instance: ContentManager;
  private services: Service[] = [];
  private posts: Post[] = [];
  private courses: Course[] = [];

  private constructor() {
    this.initializeDefaultData();
  }

  public static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  private initializeDefaultData() {
    // Initialize Services (8 total options including learning paths)
    this.services = [
      {
        id: 1,
        name: "Web Development Training",
        category: "Training",
        description: "Complete web development bootcamp with React, Node.js, and modern frameworks",
        status: "Active"
      },
      {
        id: 2,
        name: "Career Consulting",
        category: "Consulting",
        description: "One-on-one career guidance and interview preparation",
        status: "Active"
      },
      {
        id: 3,
        name: "Job Placement Support",
        category: "Support",
        description: "Help finding the right job with our industry connections",
        status: "Active"
      },
      {
        id: 4,
        name: "Cloud Computing Learning Path",
        category: "Learning Path",
        description: "Structured learning journey from AWS basics to advanced cloud architecture",
        status: "Active"
      },
      {
        id: 5,
        name: "Data Science Learning Path",
        category: "Learning Path",
        description: "Complete roadmap from Python basics to machine learning and AI",
        status: "Active"
      },
      {
        id: 6,
        name: "Full Stack Developer Path",
        category: "Learning Path",
        description: "Frontend to backend development with modern tech stack",
        status: "Active"
      },
      {
        id: 7,
        name: "Cybersecurity Specialist Path",
        category: "Learning Path",
        description: "Ethical hacking, penetration testing, and security compliance",
        status: "Active"
      },
      {
        id: 8,
        name: "Technical Mentorship",
        category: "Mentorship",
        description: "Personal guidance from industry experts throughout your learning journey",
        status: "Active"
      }
    ];

    // Initialize Posts
    this.posts = [
      { 
        id: 1, 
        title: "Getting Started with Cloud Computing", 
        content: "Learn the basics of cloud computing and how to get started with AWS...", 
        status: "Published", 
        publishedAt: "2024-01-15" 
      },
      { 
        id: 2, 
        title: "Python for Beginners: Your First Steps", 
        content: "Start your Python journey with this comprehensive beginner's guide...", 
        status: "Published", 
        publishedAt: "2024-01-10" 
      }
    ];

    // Initialize Courses
    this.courses = [
      { 
        id: 1, 
        name: "Cloud Computing", 
        description: "Master AWS, Azure, and Google Cloud platforms. Learn to design, deploy, and manage scalable cloud solutions.", 
        duration: "4 months", 
        status: "Active",
        icon: "☁️",
        link: "/services"
      },
      { 
        id: 2, 
        name: "Data Science & Analytics", 
        description: "Build predictive models and machine learning solutions using Python, R, and advanced statistical methods.", 
        duration: "6 months", 
        status: "Active",
        icon: "📊",
        link: "/services"
      },
      { 
        id: 3, 
        name: "Cyber Security", 
        description: "Protect organizations from cyber threats with ethical hacking, penetration testing, and security frameworks.", 
        duration: "5 months", 
        status: "Active",
        icon: "🔒",
        link: "/services"
      },
      { 
        id: 4, 
        name: "Banking Operations", 
        description: "Master banking operations, financial analysis, and regulatory compliance with hands-on banking software training.", 
        duration: "3 months", 
        status: "Active",
        icon: "🏦",
        link: "/services"
      },
      { 
        id: 5, 
        name: "Digital Marketing", 
        description: "Master digital marketing strategies, social media marketing, SEO, and online advertising to build successful campaigns.", 
        duration: "4 months", 
        status: "Active",
        icon: "📱",
        link: "/services"
      },
      {
        id: 6,
        name: "Business Intelligence",
        description: "Transform business data into strategic insights using advanced analytics tools and business intelligence platforms.",
        duration: "5 months",
        status: "Active",
        icon: "📈",
        link: "/services"
      },
      {
        id: 7,
        name: "Python Fullstack Developer",
        description: "Master Python programming, Django/Flask frameworks, React frontend, and build complete web applications from scratch.",
        duration: "6 months",
        status: "Active",
        icon: "🐍",
        link: "/services"
      },
      {
        id: 8,
        name: "DevOps Engineering",
        description: "Learn Docker, Kubernetes, CI/CD pipelines, and automate deployment processes for scalable applications.",
        duration: "4 months",
        status: "Active",
        icon: "⚙️",
        link: "/services"
      },
      {
        id: 9,
        name: "Mobile App Development",
        description: "Build native and cross-platform mobile applications using React Native, Flutter, and modern development tools.",
        duration: "5 months",
        status: "Active",
        icon: "📱",
        link: "/services"
      },
      {
        id: 10,
        name: "Machine Learning & AI",
        description: "Deep dive into AI algorithms, neural networks, TensorFlow, and build intelligent applications with machine learning.",
        duration: "7 months",
        status: "Active",
        icon: "🤖",
        link: "/services"
      }
    ];
  }

  // Services Management
  getServices(): Service[] {
    return this.services.filter(service => service.status === 'Active');
  }

  getAllServices(): Service[] {
    return this.services;
  }

  addService(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      id: Math.max(...this.services.map(s => s.id), 0) + 1,
      ...service
    };
    this.services.push(newService);
    this.saveToStorage();
    this.notifyListeners();
    return newService;
  }

  updateService(id: number, updates: Partial<Service>): Service | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services[index] = { ...this.services[index], ...updates };
      this.saveToStorage();
      this.notifyListeners();
      return this.services[index];
    }
    return null;
  }

  deleteService(id: number): boolean {
    const index = this.services.findIndex(s => s.id === id);
    if (index !== -1) {
      this.services.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Posts Management
  getPosts(): Post[] {
    return this.posts.filter(post => post.status === 'Published');
  }

  getAllPosts(): Post[] {
    return this.posts;
  }

  addPost(post: Omit<Post, 'id'>): Post {
    const newPost: Post = {
      id: Math.max(...this.posts.map(p => p.id), 0) + 1,
      ...post
    };
    this.posts.push(newPost);
    this.saveToStorage();
    this.notifyListeners();
    return newPost;
  }

  updatePost(id: number, updates: Partial<Post>): Post | null {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...updates };
      this.saveToStorage();
      this.notifyListeners();
      return this.posts[index];
    }
    return null;
  }

  deletePost(id: number): boolean {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.posts.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Courses Management
  getCourses(): Course[] {
    return this.courses.filter(course => course.status === 'Active');
  }

  getAllCourses(): Course[] {
    return this.courses;
  }

  addCourse(course: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      id: Math.max(...this.courses.map(c => c.id), 0) + 1,
      icon: "��",
      link: "/services",
      ...course
    };
    this.courses.push(newCourse);
    this.saveToStorage();
    this.notifyListeners();
    return newCourse;
  }

  updateCourse(id: number, updates: Partial<Course>): Course | null {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...updates };
      this.saveToStorage();
      this.notifyListeners();
      return this.courses[index];
    }
    return null;
  }

  deleteCourse(id: number): boolean {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Persistence
  private saveToStorage() {
    try {
      localStorage.setItem('liorian_services', JSON.stringify(this.services));
      localStorage.setItem('liorian_posts', JSON.stringify(this.posts));
      localStorage.setItem('liorian_courses', JSON.stringify(this.courses));
    } catch (error) {
      console.error('Failed to save content to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const services = localStorage.getItem('liorian_services');
      const posts = localStorage.getItem('liorian_posts');
      const courses = localStorage.getItem('liorian_courses');

      if (services) this.services = JSON.parse(services);
      if (posts) this.posts = JSON.parse(posts);
      if (courses) this.courses = JSON.parse(courses);
    } catch (error) {
      console.error('Failed to load content from localStorage:', error);
      this.initializeDefaultData();
    }
  }

  // Clear all stored data and reset to defaults
  clearStorageAndReset() {
    localStorage.removeItem('liorian_services');
    localStorage.removeItem('liorian_posts');
    localStorage.removeItem('liorian_courses');
    this.initializeDefaultData();
    this.saveToStorage();
    this.notifyListeners();
  }

  // Subscribe to changes
  private listeners: Array<() => void> = [];

  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

export default ContentManager;
