// Shared course data system - connects admin management with public display
export interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  price: string;
  originalPrice: string;
  features: string[];
  technologies: string[];
  highlights: string[];
  curriculum: {
    week: string;
    title: string;
    topics: string[];
  }[];
  careerOutcomes: string[];
  isActive: boolean;
  
  // Public display fields
  icon?: string;
  desc?: string;
  detailedDescription?: string;
  averageSalary?: string;
  placementRate?: string;
  prerequisites?: string[];
  industryPartners?: string[];
  certification?: string;
  learningPath?: any[];
}

// Centralized course data - managed by admin, displayed on Services
export const COURSES_DATABASE: Course[] = [
  {
    id: 'cloudcomputing',
    title: 'Cloud Computing',
    icon: '☁️',
    duration: '16 weeks',
    level: 'Beginner to Advanced',
    description: 'Master comprehensive cloud computing with AWS, Azure, and Google Cloud platforms. Learn to design, deploy, and manage enterprise-grade scalable cloud solutions.',
    desc: 'Master AWS, Azure, and Google Cloud platforms. Learn to design, deploy, and manage scalable cloud solutions.',
    detailedDescription: 'This comprehensive Cloud Computing program is designed to transform you into a cloud solutions architect. You\'ll gain hands-on experience with the three major cloud platforms - AWS, Microsoft Azure, and Google Cloud Platform.',
    price: '₹45,000',
    originalPrice: '₹65,000',
    averageSalary: '₹12-25 LPA',
    placementRate: '95%',
    features: [
      'Live AWS/Azure/GCP Lab Access',
      'Industry Certifications (AWS SAA, Azure Fundamentals)',
      '100% Placement Support with Top Tech Companies',
      'Expert Mentorship from Cloud Architects'
    ],
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
    highlights: [
      'AWS Solutions Architect Associate Certification Training',
      'Hands-on Multi-Cloud Projects with Real Deployments',
      'Enterprise Case Studies from Fortune 500 Companies'
    ],
    curriculum: [
      {
        week: 'Weeks 1-3',
        title: 'Cloud Fundamentals & AWS Basics',
        topics: ['Cloud Computing Concepts', 'AWS Core Services', 'EC2 & VPC Setup']
      },
      {
        week: 'Weeks 4-6',
        title: 'Advanced AWS Services',
        topics: ['Lambda Functions', 'RDS Databases', 'Load Balancers', 'Auto Scaling']
      },
      {
        week: 'Weeks 7-9',
        title: 'Azure & Multi-Cloud',
        topics: ['Azure Portal', 'Virtual Machines', 'Azure Storage', 'Multi-cloud Strategy']
      },
      {
        week: 'Weeks 10-12',
        title: 'Google Cloud & DevOps',
        topics: ['GCP Console', 'Compute Engine', 'Kubernetes', 'CI/CD Pipelines']
      },
      {
        week: 'Weeks 13-16',
        title: 'Enterprise Projects & Certification',
        topics: ['Capstone Project', 'AWS Certification Prep', 'Interview Preparation']
      }
    ],
    careerOutcomes: [
      'Cloud Solutions Architect - ₹12-25L per annum',
      'DevOps Engineer - ₹10-20L per annum',
      'Cloud Security Specialist - ₹15-30L per annum'
    ],
    prerequisites: ['Basic understanding of computers', 'No prior cloud experience required'],
    industryPartners: ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud'],
    certification: 'AWS Certified Solutions Architect, Azure Fundamentals',
    isActive: true
  },
  {
    id: 'datascience',
    title: 'Data Science & Machine Learning',
    icon: '📊',
    duration: '20 weeks',
    level: 'Intermediate to Advanced',
    description: 'Master comprehensive data science and machine learning with Python, R, and advanced statistical methods for real-world applications.',
    desc: 'Master data science and machine learning with Python, R, and advanced statistical methods.',
    detailedDescription: 'Comprehensive data science program covering statistics, machine learning, deep learning, and big data analytics. Learn to extract insights from complex datasets.',
    price: '₹55,000',
    originalPrice: '₹75,000',
    averageSalary: '₹8-22 LPA',
    placementRate: '92%',
    features: [
      'Advanced Python & R Programming for Data Science',
      'Machine Learning & Deep Learning Projects with Real Datasets',
      'Kaggle Competition Training & Portfolio Development',
      'Industry Mentorship from Data Scientists'
    ],
    technologies: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'],
    highlights: [
      'Machine Learning Professional Certification from Google/AWS',
      'Kaggle Competition Participation with Expert Guidance',
      'Real Industry Projects from Banking & E-commerce'
    ],
    curriculum: [
      {
        week: 'Weeks 1-4',
        title: 'Data Science Fundamentals & Python',
        topics: ['Statistics & Probability', 'Python for Data Science', 'Pandas & NumPy']
      },
      {
        week: 'Weeks 5-8',
        title: 'Machine Learning Algorithms',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation']
      },
      {
        week: 'Weeks 9-12',
        title: 'Deep Learning & Neural Networks',
        topics: ['TensorFlow', 'PyTorch', 'Computer Vision', 'NLP']
      },
      {
        week: 'Weeks 13-16',
        title: 'Big Data & Advanced Analytics',
        topics: ['Spark', 'Hadoop', 'Time Series', 'A/B Testing']
      },
      {
        week: 'Weeks 17-20',
        title: 'Capstone Projects & Portfolio',
        topics: ['Industry Projects', 'Portfolio Development', 'Interview Prep']
      }
    ],
    careerOutcomes: [
      'Data Scientist - ₹8-22L per annum',
      'Machine Learning Engineer - ₹10-25L per annum',
      'Data Analyst - ₹6-15L per annum'
    ],
    prerequisites: ['Basic programming knowledge', 'Statistics fundamentals'],
    industryPartners: ['Google', 'Microsoft', 'IBM', 'Flipkart'],
    certification: 'Google ML Professional, AWS ML Specialty',
    isActive: true
  },
  {
    id: 'python-fullstack',
    title: 'Python Fullstack Developer',
    icon: '🐍',
    duration: '18 weeks',
    level: 'Beginner to Advanced',
    description: 'Complete Python web development course covering Django, React, databases, and deployment for full-stack applications.',
    desc: 'Complete Python web development with Django, React, and modern deployment practices.',
    detailedDescription: 'Comprehensive full-stack development program using Python, Django, React, and modern deployment practices.',
    price: '₹50,000',
    originalPrice: '₹70,000',
    averageSalary: '₹6-18 LPA',
    placementRate: '90%',
    features: [
      'Complete Python Programming from Basics to Advanced',
      'Django & React Full-Stack Development',
      'Database Design & Management',
      'Cloud Deployment & DevOps Practices'
    ],
    technologies: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    highlights: [
      'Build 5+ Real-World Full-Stack Projects',
      'Industry Mentorship from Senior Developers',
      'Git/GitHub Workflow & Best Practices'
    ],
    curriculum: [
      {
        week: 'Weeks 1-4',
        title: 'Python Programming Fundamentals',
        topics: ['Python Basics', 'OOP', 'Data Structures', 'File Handling']
      },
      {
        week: 'Weeks 5-8',
        title: 'Django Backend Development',
        topics: ['Django Framework', 'Models & Database', 'Views & Templates', 'REST APIs']
      },
      {
        week: 'Weeks 9-12',
        title: 'Frontend with React',
        topics: ['React Basics', 'Components & Hooks', 'State Management', 'API Integration']
      },
      {
        week: 'Weeks 13-16',
        title: 'Database & Advanced Topics',
        topics: ['PostgreSQL', 'Authentication', 'Testing', 'Performance Optimization']
      },
      {
        week: 'Weeks 17-18',
        title: 'Deployment & Portfolio',
        topics: ['Docker', 'AWS Deployment', 'Portfolio Projects', 'Interview Prep']
      }
    ],
    careerOutcomes: [
      'Python Developer - ₹6-18L per annum',
      'Full-Stack Developer - ₹8-20L per annum',
      'Backend Developer - ₹7-16L per annum'
    ],
    prerequisites: ['Basic computer knowledge', 'No programming experience required'],
    industryPartners: ['Flipkart', 'Zomato', 'PayTM', 'Ola'],
    certification: 'Python Institute Certification',
    isActive: true
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: '📊',
    duration: '14 weeks',
    level: 'Beginner to Advanced',
    description: 'Transform raw data into actionable insights using Python, SQL, Tableau, and advanced analytics techniques.',
    desc: 'Transform raw data into actionable insights using Python, SQL, Tableau, and advanced analytics techniques.',
    detailedDescription: 'Our Data Analyst program transforms you into a data-driven professional capable of extracting meaningful insights from complex datasets.',
    price: '₹35,000',
    originalPrice: '₹50,000',
    averageSalary: '₹5-10 LPA',
    placementRate: '92%',
    features: ['Live Data Projects', 'Industry Tools', 'Portfolio Development', 'Interview Prep'],
    technologies: ['Python', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Pandas'],
    highlights: [
      'Microsoft Power BI Certification Training',
      'Tableau Desktop Specialist Certification',
      'Real Business Case Studies'
    ],
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: 'Data Analysis Fundamentals',
        topics: ['Statistics Basics', 'Excel Advanced Functions', 'Data Cleaning']
      },
      {
        week: 'Weeks 3-4',
        title: 'SQL Mastery',
        topics: ['Database Queries', 'Joins & Subqueries', 'Data Aggregation']
      },
      {
        week: 'Weeks 5-6',
        title: 'Python for Data Analysis',
        topics: ['Pandas Library', 'Data Manipulation', 'File Handling']
      },
      {
        week: 'Weeks 7-8',
        title: 'Data Visualization',
        topics: ['Tableau Desktop', 'Dashboard Design', 'Storytelling with Data']
      },
      {
        week: 'Weeks 9-10',
        title: 'Advanced Analytics',
        topics: ['Statistical Analysis', 'Regression Models', 'Time Series']
      },
      {
        week: 'Weeks 11-12',
        title: 'Business Intelligence',
        topics: ['Power BI Desktop', 'KPI Development', 'Report Automation']
      },
      {
        week: 'Weeks 13-14',
        title: 'Real-world Projects',
        topics: ['Industry Case Studies', 'Portfolio Building', 'Client Presentation']
      }
    ],
    careerOutcomes: [
      'Business Data Analyst - ₹5-10L per annum',
      'Marketing Data Analyst - ₹6-12L per annum',
      'Operations Analyst - ₹5-9L per annum'
    ],
    prerequisites: ['Basic computer literacy', 'High school mathematics'],
    industryPartners: ['Flipkart', 'Swiggy', 'HDFC Bank', 'Wipro'],
    certification: 'Microsoft Power BI Certification, Tableau Desktop Specialist',
    isActive: true
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: '🔐',
    duration: '18 weeks',
    level: 'Beginner to Advanced',
    description: 'Protect organizations from cyber threats with ethical hacking, penetration testing, and security frameworks.',
    desc: 'Protect organizations from cyber threats with ethical hacking, penetration testing, and security frameworks.',
    detailedDescription: 'Our Cybersecurity program prepares you to become a cyber defense specialist capable of protecting organizations from evolving digital threats.',
    price: '₹48,000',
    originalPrice: '₹68,000',
    averageSalary: '₹7-15 LPA',
    placementRate: '90%',
    features: ['Ethical Hacking Labs', 'Security Certifications', 'Penetration Testing', 'Incident Response'],
    technologies: ['Kali Linux', 'Metasploit', 'Wireshark', 'Nmap', 'Burp Suite', 'Python'],
    highlights: [
      'CEH (Certified Ethical Hacker) Training',
      'Hands-on Penetration Testing Labs',
      'Security Operations Center (SOC) Training'
    ],
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: 'Cybersecurity Fundamentals',
        topics: ['Security Principles', 'Threat Landscape', 'Risk Management']
      },
      {
        week: 'Weeks 3-4',
        title: 'Network Security',
        topics: ['Network Protocols', 'Firewalls', 'IDS/IPS']
      },
      {
        week: 'Weeks 5-6',
        title: 'Ethical Hacking Basics',
        topics: ['Reconnaissance', 'Scanning', 'Social Engineering']
      },
      {
        week: 'Weeks 7-8',
        title: 'Penetration Testing',
        topics: ['Metasploit Framework', 'Exploit Development', 'Post-Exploitation']
      },
      {
        week: 'Weeks 9-10',
        title: 'Web Application Security',
        topics: ['OWASP Top 10', 'Burp Suite', 'SQL Injection']
      },
      {
        week: 'Weeks 11-12',
        title: 'Digital Forensics',
        topics: ['Digital Evidence', 'Memory Analysis', 'Network Forensics']
      },
      {
        week: 'Weeks 13-14',
        title: 'Incident Response',
        topics: ['SOC Operations', 'SIEM Tools', 'Threat Hunting']
      },
      {
        week: 'Weeks 15-16',
        title: 'Security Compliance',
        topics: ['ISO 27001', 'GDPR', 'Audit Procedures']
      },
      {
        week: 'Weeks 17-18',
        title: 'Capstone Project & Certification',
        topics: ['Final Project', 'Certification Prep', 'Interview Skills']
      }
    ],
    careerOutcomes: [
      'Cybersecurity Analyst - ₹7-15L per annum',
      'Penetration Tester - ₹10-20L per annum',
      'SOC Analyst - ₹6-12L per annum'
    ],
    prerequisites: ['Basic networking knowledge', 'Computer fundamentals'],
    industryPartners: ['IBM Security', 'FireEye', 'CyberArk', 'Wipro Cybersecurity'],
    certification: 'CEH (Certified Ethical Hacker), CompTIA Security+',
    isActive: true
  },
  {
    id: 'devops',
    title: 'DevOps',
    icon: '⚙️',
    duration: '16 weeks',
    level: 'Intermediate to Advanced',
    description: 'Streamline development and deployment with Docker, Kubernetes, Jenkins, and modern CI/CD practices.',
    desc: 'Streamline development and deployment with Docker, Kubernetes, Jenkins, and modern CI/CD practices.',
    detailedDescription: 'Our DevOps program transforms you into a DevOps engineer capable of bridging development and operations teams.',
    price: '₹52,000',
    originalPrice: '₹72,000',
    averageSalary: '₹8-16 LPA',
    placementRate: '93%',
    features: ['CI/CD Pipelines', 'Container Orchestration', 'Infrastructure as Code', 'Monitoring Setup'],
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Terraform', 'Git'],
    highlights: [
      'Kubernetes Administrator (CKA) Training',
      'AWS DevOps Professional Certification',
      'Enterprise DevOps Projects'
    ],
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: 'DevOps Fundamentals',
        topics: ['DevOps Culture', 'Git Version Control', 'Agile Practices']
      },
      {
        week: 'Weeks 3-4',
        title: 'Linux & Scripting',
        topics: ['Linux Administration', 'Shell Scripting', 'Process Management']
      },
      {
        week: 'Weeks 5-6',
        title: 'Containerization with Docker',
        topics: ['Docker Fundamentals', 'Container Networking', 'Docker Compose']
      },
      {
        week: 'Weeks 7-8',
        title: 'Kubernetes',
        topics: ['Kubernetes Architecture', 'Pod Management', 'Services & Ingress']
      },
      {
        week: 'Weeks 9-10',
        title: 'CI/CD Pipelines',
        topics: ['Jenkins Pipeline', 'Automated Testing', 'Deployment Strategies']
      },
      {
        week: 'Weeks 11-12',
        title: 'Infrastructure as Code',
        topics: ['Terraform Basics', 'Ansible Playbooks', 'Configuration Management']
      },
      {
        week: 'Weeks 13-14',
        title: 'Monitoring & Logging',
        topics: ['Prometheus Monitoring', 'Grafana Dashboards', 'ELK Stack']
      },
      {
        week: 'Weeks 15-16',
        title: 'Cloud DevOps & Projects',
        topics: ['Cloud DevOps', 'AWS/Azure Services', 'Capstone Project']
      }
    ],
    careerOutcomes: [
      'DevOps Engineer - ₹8-16L per annum',
      'Site Reliability Engineer - ₹10-20L per annum',
      'Cloud Engineer - ₹9-18L per annum'
    ],
    prerequisites: ['Basic Linux knowledge', 'Programming experience'],
    industryPartners: ['Google Cloud', 'Microsoft Azure', 'Docker Inc', 'Red Hat'],
    certification: 'AWS Certified DevOps Engineer, Kubernetes Administrator (CKA)',
    isActive: true
  },
  {
    id: 'java-fullstack',
    title: 'Java Fullstack Developer',
    icon: '☕',
    duration: '22 weeks',
    level: 'Beginner to Advanced',
    description: 'Create enterprise applications with Spring Boot, React, and comprehensive full-stack development skills.',
    desc: 'Create enterprise applications with Spring Boot, React, and comprehensive full-stack development skills.',
    detailedDescription: 'Our Java Fullstack Developer program provides enterprise-grade training in Java ecosystem technologies.',
    price: '₹58,000',
    originalPrice: '₹78,000',
    averageSalary: '₹7-16 LPA',
    placementRate: '95%',
    features: ['Enterprise Projects', 'Spring Ecosystem', 'Microservices', 'Cloud Deployment'],
    technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Hibernate', 'REST APIs'],
    highlights: [
      'Oracle Java Certification Training',
      'Spring Professional Certification',
      'Microservices Architecture Projects'
    ],
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: 'Java Programming Fundamentals',
        topics: ['Java Syntax', 'OOP Concepts', 'Collections Framework']
      },
      {
        week: 'Weeks 3-4',
        title: 'Advanced Java & Design Patterns',
        topics: ['Design Patterns', 'Java 8+ Features', 'Lambda Expressions']
      },
      {
        week: 'Weeks 5-6',
        title: 'Database Design & JDBC',
        topics: ['MySQL', 'JDBC', 'Transaction Management']
      },
      {
        week: 'Weeks 7-8',
        title: 'Spring Framework',
        topics: ['Spring Core', 'Dependency Injection', 'AOP']
      },
      {
        week: 'Weeks 9-10',
        title: 'Spring Boot Development',
        topics: ['Spring Boot Basics', 'Auto-configuration', 'Application Properties']
      },
      {
        week: 'Weeks 11-12',
        title: 'Spring Data & Hibernate',
        topics: ['JPA & Hibernate', 'Spring Data JPA', 'Entity Relationships']
      },
      {
        week: 'Weeks 13-14',
        title: 'REST API Development',
        topics: ['REST Principles', 'Spring Web MVC', 'API Documentation']
      },
      {
        week: 'Weeks 15-16',
        title: 'Security & Authentication',
        topics: ['Spring Security', 'JWT Tokens', 'OAuth2']
      },
      {
        week: 'Weeks 17-18',
        title: 'Frontend with React',
        topics: ['React Fundamentals', 'State Management', 'API Integration']
      },
      {
        week: 'Weeks 19-20',
        title: 'Microservices Architecture',
        topics: ['Spring Cloud', 'Service Discovery', 'API Gateway']
      },
      {
        week: 'Weeks 21-22',
        title: 'Deployment & Production',
        topics: ['Docker Containerization', 'Cloud Deployment', 'CI/CD Pipelines']
      }
    ],
    careerOutcomes: [
      'Java Developer - ₹7-16L per annum',
      'Full Stack Developer - ₹8-18L per annum',
      'Spring Developer - ₹9-20L per annum'
    ],
    prerequisites: ['Basic programming knowledge', 'Object-oriented concepts'],
    industryPartners: ['Infosys', 'TCS', 'Wipro', 'Cognizant'],
    certification: 'Oracle Java Certification, Spring Professional Certification',
    isActive: true
  },
  {
    id: 'banking-finance',
    title: 'Banking & Finance',
    icon: '🏦',
    duration: '12 weeks',
    level: 'Beginner to Intermediate',
    description: 'Specialized training for banking sector professionals looking to upgrade their technical skills.',
    desc: 'Specialized training for banking sector professionals looking to upgrade their technical skills.',
    detailedDescription: 'Our Banking & Finance program is specifically designed for professionals in the financial sector.',
    price: '₹30,000',
    originalPrice: '₹45,000',
    averageSalary: '₹4-8 LPA',
    placementRate: '89%',
    features: ['Domain Expertise', 'Industry Connections', 'Certification', 'Job Assistance'],
    technologies: ['Excel Advanced', 'SQL', 'Python', 'Financial Modeling', 'Risk Analysis'],
    highlights: [
      'Financial Risk Manager (FRM) Prep',
      'CFA Level 1 Preparation',
      'Banking Industry Case Studies'
    ],
    curriculum: [
      {
        week: 'Weeks 1-2',
        title: 'Advanced Excel for Finance',
        topics: ['Advanced Formulas', 'Pivot Tables', 'Financial Functions']
      },
      {
        week: 'Weeks 3-4',
        title: 'SQL for Financial Data',
        topics: ['Financial Queries', 'Data Aggregation', 'Report Generation']
      },
      {
        week: 'Weeks 5-6',
        title: 'Python for Financial Analysis',
        topics: ['Pandas for Finance', 'Data Visualization', 'Automation Scripts']
      },
      {
        week: 'Weeks 7-8',
        title: 'Financial Modeling & Valuation',
        topics: ['DCF Modeling', 'Valuation Techniques', 'Risk Assessment']
      },
      {
        week: 'Weeks 9-10',
        title: 'Risk Management & Compliance',
        topics: ['Basel III Framework', 'Credit Risk', 'Operational Risk']
      },
      {
        week: 'Weeks 11-12',
        title: 'Banking Technology & Project',
        topics: ['Banking Systems', 'Fintech Trends', 'Capstone Project']
      }
    ],
    careerOutcomes: [
      'Business Analyst - ₹4-8L per annum',
      'Financial Analyst - ₹5-10L per annum',
      'Risk Analyst - ₹6-12L per annum'
    ],
    prerequisites: ['Basic computer skills', 'Financial sector experience'],
    industryPartners: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Bajaj Finserv'],
    certification: 'Financial Risk Manager (FRM), CFA Level 1 Prep',
    isActive: true
  }
];

// Course management functions
export const getCourses = (): Course[] => {
  const savedCourses = localStorage.getItem('coursesData');
  if (savedCourses) {
    try {
      return JSON.parse(savedCourses);
    } catch (error) {
      console.error('Error parsing saved courses:', error);
    }
  }
  return COURSES_DATABASE;
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem('coursesData', JSON.stringify(courses));
};

export const getActiveCourses = (): Course[] => {
  return getCourses().filter(course => course.isActive);
};

export const getCourseById = (id: string): Course | undefined => {
  return getCourses().find(course => course.id === id);
};

export const updateCourse = (updatedCourse: Course): void => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === updatedCourse.id);
  if (index !== -1) {
    courses[index] = updatedCourse;
    saveCourses(courses);
  }
};

export const addCourse = (newCourse: Course): void => {
  const courses = getCourses();
  courses.push(newCourse);
  saveCourses(courses);
};

export const deleteCourse = (courseId: string): void => {
  const courses = getCourses().filter(course => course.id !== courseId);
  saveCourses(courses);
};
