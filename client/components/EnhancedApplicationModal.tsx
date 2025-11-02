import React, { useState } from 'react';
import { X, Calendar, Clock, Star, Trophy, ChevronRight, CheckCircle, PlayCircle, Users, Target, BookOpen, Award, Zap, Brain } from 'lucide-react';

interface WeeklyModule {
  week: number;
  title: string;
  description: string;
  topics: string[];
  deliverables: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  icon: React.ReactNode;
  color: string;
  weeklyModules: WeeklyModule[];
  outcomes: string[];
  placement: {
    averageSalary: string;
    companies: string[];
  };
}

interface EnhancedApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const courses: Course[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Development (MERN)',
    duration: '24 weeks',
    level: 'Beginner to Advanced',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-600 to-purple-600',
    weeklyModules: [
      {
        week: 1,
        title: 'Web Fundamentals & HTML5',
        description: 'Master the building blocks of web development',
        topics: ['Semantic HTML5', 'Web Accessibility', 'Forms & Validation', 'HTML Best Practices'],
        deliverables: ['Personal Portfolio Structure', 'Contact Form'],
        duration: '40 hours',
        difficulty: 'Beginner'
      },
      {
        week: 2,
        title: 'Advanced CSS & Responsive Design',
        description: 'Create stunning, responsive layouts',
        topics: ['CSS Grid & Flexbox', 'Animations & Transitions', 'SCSS/SASS', 'Mobile-First Design'],
        deliverables: ['Responsive Website', 'CSS Animation Project'],
        duration: '45 hours',
        difficulty: 'Beginner'
      },
      {
        week: 3,
        title: 'JavaScript Fundamentals',
        description: 'Learn modern JavaScript programming',
        topics: ['ES6+ Features', 'Async/Await', 'DOM Manipulation', 'Error Handling'],
        deliverables: ['Interactive Web App', 'API Integration'],
        duration: '50 hours',
        difficulty: 'Beginner'
      },
      {
        week: 4,
        title: 'Advanced JavaScript & OOP',
        description: 'Master object-oriented programming',
        topics: ['Classes & Prototypes', 'Design Patterns', 'Modules', 'Testing Basics'],
        deliverables: ['Calculator App', 'Todo Application'],
        duration: '45 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 5,
        title: 'React Fundamentals',
        description: 'Build dynamic user interfaces',
        topics: ['Components & JSX', 'State & Props', 'Event Handling', 'Lifecycle Methods'],
        deliverables: ['React Portfolio', 'Weather App'],
        duration: '50 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 6,
        title: 'Advanced React & Hooks',
        description: 'Modern React development patterns',
        topics: ['Custom Hooks', 'Context API', 'useEffect Patterns', 'Performance Optimization'],
        deliverables: ['E-commerce Frontend', 'Custom Hook Library'],
        duration: '55 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 7,
        title: 'State Management & React Router',
        description: 'Handle complex application state',
        topics: ['Redux Toolkit', 'React Router v6', 'Protected Routes', 'Global State'],
        deliverables: ['Multi-page React App', 'Shopping Cart'],
        duration: '50 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 8,
        title: 'Node.js & Express Setup',
        description: 'Build server-side applications',
        topics: ['Node.js Basics', 'Express Framework', 'Middleware', 'RESTful APIs'],
        deliverables: ['REST API Server', 'Authentication System'],
        duration: '45 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 9,
        title: 'Database Design & MongoDB',
        description: 'Design and implement databases',
        topics: ['MongoDB Atlas', 'Mongoose ODM', 'Schema Design', 'Data Relationships'],
        deliverables: ['Database Models', 'CRUD Operations'],
        duration: '50 hours',
        difficulty: 'Intermediate'
      },
      {
        week: 10,
        title: 'Authentication & Security',
        description: 'Implement secure user systems',
        topics: ['JWT Tokens', 'Password Hashing', 'CORS', 'Security Best Practices'],
        deliverables: ['User Auth System', 'Protected API Routes'],
        duration: '45 hours',
        difficulty: 'Advanced'
      },
      {
        week: 11,
        title: 'Full Stack Integration',
        description: 'Connect frontend and backend',
        topics: ['API Integration', 'Error Handling', 'Loading States', 'Form Validation'],
        deliverables: ['Full Stack Blog App', 'User Dashboard'],
        duration: '55 hours',
        difficulty: 'Advanced'
      },
      {
        week: 12,
        title: 'Testing & Quality Assurance',
        description: 'Ensure code quality and reliability',
        topics: ['Jest Testing', 'React Testing Library', 'API Testing', 'E2E Testing'],
        deliverables: ['Test Suite', 'Testing Documentation'],
        duration: '40 hours',
        difficulty: 'Advanced'
      },
      {
        week: 13,
        title: 'Deployment & DevOps',
        description: 'Deploy applications to production',
        topics: ['Docker Basics', 'AWS Deployment', 'CI/CD Pipelines', 'Monitoring'],
        deliverables: ['Deployed Application', 'DevOps Pipeline'],
        duration: '45 hours',
        difficulty: 'Advanced'
      },
      {
        week: 14,
        title: 'Advanced Topics & TypeScript',
        description: 'Modern development practices',
        topics: ['TypeScript', 'GraphQL', 'Microservices', 'Performance Optimization'],
        deliverables: ['TypeScript Project', 'GraphQL API'],
        duration: '50 hours',
        difficulty: 'Advanced'
      },
      {
        week: 15,
        title: 'Capstone Project - Planning',
        description: 'Plan your final project',
        topics: ['Project Planning', 'Architecture Design', 'Feature Requirements', 'Timeline'],
        deliverables: ['Project Proposal', 'Technical Specification'],
        duration: '35 hours',
        difficulty: 'Advanced'
      },
      {
        week: 16,
        title: 'Capstone Project - Development Phase 1',
        description: 'Start building your capstone project',
        topics: ['Frontend Development', 'Component Architecture', 'State Management', 'UI/UX'],
        deliverables: ['Frontend Implementation', 'Component Library'],
        duration: '60 hours',
        difficulty: 'Advanced'
      }
    ],
    outcomes: [
      'Build full-stack web applications from scratch',
      'Master React, Node.js, Express, and MongoDB',
      'Implement user authentication and security',
      'Deploy applications to cloud platforms',
      'Work with modern development tools and practices'
    ],
    placement: {
      averageSalary: '₹8-15 LPA',
      companies: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Amazon', 'Microsoft']
    }
  }
];

const EnhancedApplicationModal: React.FC<EnhancedApplicationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState<'course-selection' | 'learning-path' | 'application'>('course-selection');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    experience: '',
    background: '',
    goals: ''
  });

  if (!isOpen) return null;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentStep('learning-path');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, course: selectedCourse?.title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-amber-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">
              {currentStep === 'course-selection' && 'Choose Your Career Path'}
              {currentStep === 'learning-path' && `${selectedCourse?.title} - Learning Journey`}
              {currentStep === 'application' && 'Complete Your Application'}
            </h2>
          </div>
          <p className="text-white/90">
            {currentStep === 'course-selection' && 'Select a course to view the detailed weekly learning progression'}
            {currentStep === 'learning-path' && 'Explore your week-by-week learning journey to success'}
            {currentStep === 'application' && 'Join thousands of successful graduates'}
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          
          {/* Course Selection */}
          {currentStep === 'course-selection' && (
            <div className="space-y-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className="cursor-pointer bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${course.color}`}>
                        <div className="text-white">
                          {course.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{course.level}</span>
                          </div>
                        </div>
                        <div className="text-gray-300 text-sm mb-3">
                          <strong className="text-amber-400">Average Salary:</strong> {course.placement.averageSalary}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {course.placement.companies.slice(0, 4).map((company) => (
                            <span key={company} className="px-2 py-1 bg-slate-700 text-xs text-amber-400 rounded-full">
                              {company}
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-slate-700 text-xs text-gray-400 rounded-full">
                            +{course.placement.companies.length - 4} more
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Learning Path View */}
          {currentStep === 'learning-path' && selectedCourse && (
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Weekly Timeline */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">16-Week Learning Timeline</h3>
                </div>
                
                <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                  {selectedCourse.weeklyModules.map((module) => (
                    <div
                      key={module.week}
                      onClick={() => setSelectedWeek(module.week)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
                        selectedWeek === module.week
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-700 bg-slate-800/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedWeek === module.week ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-white'
                          }`}>
                            {module.week}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm">{module.title}</h4>
                            <p className="text-xs text-gray-400">{module.duration}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {module.difficulty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Week Details */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                {selectedWeek && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                          {selectedWeek}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Week {selectedWeek}</h4>
                          <p className="text-amber-400 text-sm">
                            {selectedCourse.weeklyModules[selectedWeek - 1]?.duration}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {selectedCourse.weeklyModules[selectedWeek - 1]?.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {selectedCourse.weeklyModules[selectedWeek - 1]?.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          Topics Covered
                        </h5>
                        <ul className="space-y-1">
                          {selectedCourse.weeklyModules[selectedWeek - 1]?.topics.map((topic, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Deliverables
                        </h5>
                        <ul className="space-y-1">
                          {selectedCourse.weeklyModules[selectedWeek - 1]?.deliverables.map((deliverable, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                              <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Application Form */}
          {currentStep === 'application' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Experience Level</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select experience level</option>
                    <option value="fresher">Fresher (0-1 years)</option>
                    <option value="junior">Junior (1-3 years)</option>
                    <option value="mid">Mid-level (3-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Educational Background</label>
                <textarea
                  required
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  rows={3}
                  placeholder="Tell us about your educational background"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Career Goals</label>
                <textarea
                  required
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  rows={3}
                  placeholder="What are your career goals after completing this course?"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-400 mb-2">Selected Course</h4>
                <p className="text-white">{selectedCourse?.title}</p>
                <p className="text-gray-400 text-sm">{selectedCourse?.duration} • {selectedCourse?.level}</p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        {currentStep !== 'course-selection' && (
          <div className="bg-slate-800/50 border-t border-slate-700 p-4 flex justify-between">
            <button
              onClick={() => {
                if (currentStep === 'learning-path') setCurrentStep('course-selection');
                if (currentStep === 'application') setCurrentStep('learning-path');
              }}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
            
            {currentStep === 'learning-path' && (
              <button
                onClick={() => setCurrentStep('application')}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
              >
                Apply for this Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedApplicationModal;
