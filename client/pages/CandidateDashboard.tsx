import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Play,
  FileText,
  Users,
  Star,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";
import DashboardNavigation from '../components/DashboardNavigation';
import SimpleAuth from '../utils/simpleAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  modules: number;
  completedModules: number;
  instructor: string;
  nextClass: string;
  assignments: number;
  completedAssignments: number;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

export default function CandidateDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = SimpleAuth.getInstance();

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user
    const user = auth.getCurrentUser();
    if (!user || auth.getUserType() !== 'candidate') {
      navigate('/login');
      return;
    }

    setCurrentUser(user);
    loadUserData(user);
  }, [navigate]);

  const loadUserData = (user: any) => {
    setLoading(true);
    
    // Load or create user courses
    const userCoursesKey = `courses_${user.email}`;
    const storedCourses = localStorage.getItem(userCoursesKey);
    
    let userCourses: Course[] = [];
    
    if (storedCourses) {
      userCourses = JSON.parse(storedCourses);
    } else {
      // Default course based on user or assign new one
      userCourses = [{
        id: 'cloud-computing',
        title: 'Cloud Computing Mastery',
        description: 'Master AWS, Azure, and Google Cloud platforms',
        duration: '16 weeks',
        progress: 15,
        status: 'in_progress',
        modules: 12,
        completedModules: 2,
        instructor: 'Dr. Rajesh Kumar',
        nextClass: '2024-12-16T10:00:00Z',
        assignments: 8,
        completedAssignments: 1
      }];
      
      localStorage.setItem(userCoursesKey, JSON.stringify(userCourses));
    }

    // Load assignments
    const userAssignmentsKey = `assignments_${user.email}`;
    const storedAssignments = localStorage.getItem(userAssignmentsKey);
    
    let userAssignments: Assignment[] = [];
    
    if (storedAssignments) {
      userAssignments = JSON.parse(storedAssignments);
    } else {
      userAssignments = [
        {
          id: 'assign_1',
          title: 'AWS EC2 Instance Setup',
          course: 'Cloud Computing',
          dueDate: '2024-12-18T23:59:59Z',
          status: 'pending'
        },
        {
          id: 'assign_2', 
          title: 'S3 Bucket Configuration',
          course: 'Cloud Computing',
          dueDate: '2024-12-20T23:59:59Z',
          status: 'pending'
        }
      ];
      
      localStorage.setItem(userAssignmentsKey, JSON.stringify(userAssignments));
    }

    setCourses(userCourses);
    setAssignments(userAssignments);
    setLoading(false);
  };

  const assignNewCourse = (courseId: string, courseTitle: string) => {
    const newCourse: Course = {
      id: courseId,
      title: courseTitle,
      description: `Master ${courseTitle} with hands-on projects and expert guidance`,
      duration: '16 weeks',
      progress: 0,
      status: 'not_started',
      modules: 12,
      completedModules: 0,
      instructor: 'Expert Instructor',
      nextClass: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignments: 8,
      completedAssignments: 0
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    
    if (currentUser) {
      localStorage.setItem(`courses_${currentUser.email}`, JSON.stringify(updatedCourses));
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const inProgressCourses = courses.filter(c => c.status === 'in_progress').length;
  const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length || 0;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation 
        userType="candidate" 
        userName={currentUser?.name || 'Student'}
      />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600">Continue your learning journey and track your progress</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(totalProgress)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{completedCourses}</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingAssignments}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Current Courses */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                    <Link 
                      to="/services"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Browse More Courses →
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {courses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Enrolled</h3>
                      <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                      <Link
                        to="/services"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Browse Courses
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {courses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <div className="font-medium">{course.duration}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Modules:</span>
                                  <div className="font-medium">{course.completedModules}/{course.modules}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Instructor:</span>
                                  <div className="font-medium">{course.instructor}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Next Class:</span>
                                  <div className="font-medium">{new Date(course.nextClass).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-6 text-right">
                              <div className="text-2xl font-bold text-blue-600 mb-1">{course.progress}%</div>
                              <div className="text-sm text-gray-500">Complete</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Link
                              to={`/learning-path/${course.id}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Continue Learning
                            </Link>
                            
                            <Link
                              to={`/materials/${course.id}`}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              View Materials
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Course Assignment */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Want to learn something new?</h3>
                <p className="text-gray-600 mb-4">Choose from our popular courses and start learning today!</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => assignNewCourse('data-science', 'Data Science & AI')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold text-gray-900">Data Science</div>
                    <div className="text-sm text-gray-600">Python, ML, AI</div>
                  </button>
                  
                  <button
                    onClick={() => assignNewCourse('cybersecurity', 'Cybersecurity Expert')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="text-2xl mb-2">🔐</div>
                    <div className="font-semibold text-gray-900">Cybersecurity</div>
                    <div className="text-sm text-gray-600">Ethical Hacking</div>
                  </button>
                  
                  <button
                    onClick={() => assignNewCourse('devops', 'DevOps Engineering')}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-semibold text-gray-900">DevOps</div>
                    <div className="text-sm text-gray-600">CI/CD, Docker</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Upcoming Assignments */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Assignments</h3>
                </div>
                <div className="p-6">
                  {assignments.filter(a => a.status === 'pending').slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-start gap-3 mb-4 last:mb-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                        <p className="text-gray-600 text-xs">{assignment.course}</p>
                        <p className="text-orange-600 text-xs font-medium">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {assignments.filter(a => a.status === 'pending').length === 0 && (
                    <p className="text-gray-500 text-sm">No pending assignments</p>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Completed Module 2</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Attended live session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Received 95% in quiz</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help? 🤝</h3>
                <p className="text-gray-600 text-sm mb-4">Our support team is here to help you succeed</p>
                <Link
                  to="/contact"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
