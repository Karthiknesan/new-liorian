import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardNavigation from '../components/DashboardNavigation';

interface Candidate {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
  appliedAt: string;
  phone: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  status: string;
  applicants: number;
}

export default function StaffDashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [staffProfile, setStaffProfile] = useState({
    name: "Staff Member",
    email: "staff@liorian.com",
    role: "HR Manager",
    department: "Human Resources",
    permissions: ["view_candidates", "manage_candidates", "view_jobs"]
  });

  // Mock data for staff dashboard
  const [candidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "9876543210",
      course: "Cloud Computing",
      status: "In Progress",
      appliedAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya.singh@email.com", 
      phone: "8765432109",
      course: "Data Science",
      status: "Interview Scheduled",
      appliedAt: "2024-01-20"
    },
    {
      id: 3,
      name: "Amit Sharma",
      email: "amit.sharma@email.com",
      phone: "7654321098", 
      course: "Cybersecurity",
      status: "Completed",
      appliedAt: "2024-01-25"
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha.patel@email.com",
      phone: "6543210987",
      course: "DevOps",
      status: "Placed",
      appliedAt: "2024-02-01"
    }
  ]);

  const [jobs] = useState<Job[]>([
    {
      id: 1,
      title: "Cloud Solutions Architect",
      company: "TechMahindra",
      location: "Bangalore",
      salary: "₹15-22 LPA",
      status: "Active",
      applicants: 12
    },
    {
      id: 2,
      title: "Senior Data Scientist",
      company: "Wipro",
      location: "Hyderabad", 
      salary: "₹18-25 LPA",
      status: "Active",
      applicants: 8
    },
    {
      id: 3,
      title: "Cybersecurity Analyst",
      company: "Infosys",
      location: "Chennai",
      salary: "₹12-18 LPA", 
      status: "Active",
      applicants: 15
    }
  ]);

  useEffect(() => {
    // Load staff profile from localStorage if available
    const savedProfile = localStorage.getItem('staffProfile');
    if (savedProfile) {
      setStaffProfile(JSON.parse(savedProfile));
    }
  }, []);

  const stats = {
    totalCandidates: candidates.length,
    inProgress: candidates.filter(c => c.status === "In Progress").length,
    completed: candidates.filter(c => c.status === "Completed").length,
    placed: candidates.filter(c => c.status === "Placed").length,
    interviewed: candidates.filter(c => c.status === "Interview Scheduled").length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === "Active").length
  };

  const assignCourse = (candidateId: number, candidateName: string) => {
    // Create candidate data for dashboard access
    const candidateData = {
      id: candidateId,
      name: candidateName,
      email: `${candidateName.toLowerCase().replace(' ', '.')}@email.com`,
      phone: "9876543210",
      course: "Cloud Computing",
      status: "In Progress",
      enrolledAt: new Date().toISOString().split('T')[0],
      completionPercentage: 0
    };

    // Store candidate data
    localStorage.setItem('candidateData', JSON.stringify(candidateData));
    localStorage.setItem('candidateToken', 'demo-token');

    alert(`Course assigned to ${candidateName}! They can now access the candidate dashboard.`);
  };


  const canManageCandidates = staffProfile.permissions.includes('manage_candidates');
  const canViewJobs = staffProfile.permissions.includes('view_jobs');
  const canManageJobs = staffProfile.permissions.includes('manage_jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation
        userType="staff"
        userName={staffProfile.name}
      />

      {/* Sub Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {['overview', 'candidates', canViewJobs && 'jobs', 'progress', 'modules', 'profile'].filter(Boolean).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap touch-manipulation min-h-[44px] ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Staff Overview</h2>
              <p className="text-gray-600">Your dashboard for managing candidates and job placements</p>
            </div>

            {/* Permission Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-blue-900 font-semibold mb-2">Your Permissions:</h3>
              <div className="flex flex-wrap gap-2">
                {staffProfile.permissions.map((perm, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {perm.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white p-3 sm:p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-white text-sm sm:text-lg">👥</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Candidates</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-white text-sm sm:text-lg">⏳</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">In Progress</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-white text-sm sm:text-lg">🎯</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Placed</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.placed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="text-white text-sm sm:text-lg">💼</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Jobs</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Candidate Activity</h3>
              <div className="space-y-3">
                {candidates.slice(0, 3).map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.course}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      candidate.status === 'Placed' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      candidate.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Candidate Management</h2>
              {canManageCandidates && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Add New Candidate
                </button>
              )}
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full min-w-[600px] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                      {canManageCandidates && (
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{candidate.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">{candidate.email}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{candidate.phone}</div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 truncate">{candidate.course}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            candidate.status === 'Placed' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            candidate.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {candidate.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{candidate.appliedAt}</td>
                        {canManageCandidates && (
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                              <button
                                onClick={() => assignCourse(candidate.id, candidate.name)}
                                className="text-green-600 hover:text-green-900 text-xs sm:text-sm touch-manipulation"
                              >
                                Assign Course
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm touch-manipulation">Edit</button>
                              <button className="text-green-600 hover:text-green-900 text-xs sm:text-sm touch-manipulation">Update Status</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && canViewJobs && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Job Opportunities</h2>
              {canManageJobs && (
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                  Post New Job
                </button>
              )}
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                    {canManageJobs && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.salary}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {job.applicants} applicants
                        </span>
                      </td>
                      {canManageJobs && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-green-600 hover:text-green-900">View Applications</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {activeTab === 'modules' && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Module Management</h2>
            <p className="text-gray-600">Manage training modules and course content</p>
          </div>

          {/* Module Management Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Training Modules</h3>
                  <p className="text-sm text-gray-600">Manage course modules</p>
                </div>
              </div>
              <Link
                to="/module-management"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block"
              >
                Manage Modules
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">View student progress</p>
                </div>
              </div>
              <Link
                to="/training-dashboard"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block"
              >
                View Progress
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
                  <p className="text-sm text-gray-600">View all courses</p>
                </div>
              </div>
              <Link
                to="/services"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block"
              >
                View Courses
              </Link>
            </div>
          </div>

          {/* Module Statistics */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">75</div>
                <div className="text-sm text-gray-600">Active Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">450</div>
                <div className="text-sm text-gray-600">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">89%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📊 Training Progress</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-gray-600">Active Candidates</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <div className="text-gray-600">Avg Progress</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-gray-600">Avg Score</div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Candidate Progress Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center">
                          <span className="mr-2">
                            {candidate.course === 'Cloud Computing' ? '☁️' :
                             candidate.course === 'Data Science' ? '📊' :
                             candidate.course === 'Cybersecurity' ? '🔐' : '⚙️'}
                          </span>
                          <span className="text-sm text-gray-900">{candidate.course}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{width: `${Math.random() * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{Math.floor(Math.random() * 100)}% Complete</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {Math.floor(Math.random() * 30) + 70}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          candidate.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          candidate.status === 'Placed' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Staff Profile</h2>
            
            <div className="max-w-2xl">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{staffProfile.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{staffProfile.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900">{staffProfile.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{staffProfile.department}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Permissions</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {staffProfile.permissions.map((perm, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {perm.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
