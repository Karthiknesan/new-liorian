import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardNavigation from '../components/DashboardNavigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 156,
    inProgress: 48,
    completed: 67,
    placed: 41
  });

  const [adminUser, setAdminUser] = useState({
    name: "Admin User",
    email: "admin@liorian.com",
    role: "Administrator",
    lastLogin: new Date().toLocaleDateString(),
    permissions: ["all_access", "user_management", "system_config"]
  });

  useEffect(() => {
    // Get admin user data from localStorage or API
    const storedUser = localStorage.getItem('adminUserData');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAdminUser({
          name: userData.name || "Administrator",
          email: userData.email || "admin@liorian.com",
          role: userData.role || "Administrator",
          lastLogin: userData.lastLogin || new Date().toLocaleDateString(),
          permissions: userData.permissions || ["all_access"]
        });
      } catch (error) {
        console.log('Error parsing admin user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-light to-white">
      <DashboardNavigation userType="admin" userName={adminUser.name} />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
              </div>

              {/* Admin User Info Card */}
              <div className="mt-4 lg:mt-0 bg-white rounded-xl shadow-sm border p-4 min-w-[300px]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center">
                    <span className="text-premium-dark font-bold text-lg">
                      {adminUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{adminUser.name}</h3>
                    <p className="text-sm text-gray-600">{adminUser.email}</p>
                    <p className="text-xs text-gray-500">{adminUser.role} • Last login: {adminUser.lastLogin}</p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {adminUser.permissions.map((permission, index) => (
                      <span key={index} className="text-xs bg-premium-gold/20 text-premium-dark px-2 py-1 rounded-full">
                        {permission.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6.968 6.968 0 00-3.5-.985M15 4.5a6.968 6.968 0 00-3.5.985"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Placed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.placed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/user-management" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6.968 6.968 0 00-3.5-.985M15 4.5a6.968 6.968 0 00-3.5.985"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">User Management</p>
                  <p className="text-sm text-gray-600">Manage candidates and staff</p>
                </div>
              </div>
            </Link>

            <Link to="/admin-course-management" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Course Management</p>
                  <p className="text-sm text-gray-600">Manage courses and content</p>
                </div>
              </div>
            </Link>

            <Link to="/blog-admin" className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Blog Management</p>
                  <p className="text-sm text-gray-600">Create, edit, and manage articles</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">New candidate John Doe registered for Python course</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Course content updated for Data Science</span>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">New blog post published</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
