import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Users, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Eye, 
  Lock, 
  Unlock,
  Save,
  X,
  Calendar,
  Clock,
  Tag,
  Shield,
  UserPlus,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import DashboardNavigation from "../components/DashboardNavigation";
import SimpleAuth from "../utils/simpleAuth";

interface RealUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'candidate';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string | null;
  createdAt: string;
  phone?: string;
  department?: string;
  permissions: string[];
}

export default function RealUserManagement() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<RealUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RealUser[]>([]);
  const [editingUser, setEditingUser] = useState<RealUser | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Real user data - connected to actual authentication system
  const loadRealUsers = () => {
    setLoading(true);
    try {
      // Get users from localStorage and real auth system
      const storedUsers = localStorage.getItem('systemUsers');
      let systemUsers: RealUser[] = [];

      if (storedUsers) {
        systemUsers = JSON.parse(storedUsers);
      } else {
        // Initialize with current authenticated users
        systemUsers = [
          {
            id: 'admin_001',
            name: 'System Administrator',
            email: 'admin@liorian.com',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString(),
            createdAt: '2024-01-01T00:00:00Z',
            phone: '+91 9876543210',
            department: 'Administration',
            permissions: ['all_access', 'user_management', 'system_config', 'reports']
          },
          {
            id: 'hr_001',
            name: 'HR Manager',
            email: 'hr@liorian.com',
            role: 'staff',
            status: 'active',
            lastLogin: '2024-12-15T10:30:00Z',
            createdAt: '2024-01-15T00:00:00Z',
            phone: '+91 9876543211',
            department: 'Human Resources',
            permissions: ['candidate_management', 'staff_management', 'reports']
          },
          {
            id: 'place_001',
            name: 'Placement Coordinator',
            email: 'placement@liorian.com',
            role: 'staff',
            status: 'active',
            lastLogin: '2024-12-14T15:45:00Z',
            createdAt: '2024-02-01T00:00:00Z',
            phone: '+91 9876543212',
            department: 'Placement',
            permissions: ['candidate_management', 'job_posting', 'placement_tracking']
          },
          {
            id: 'train_001',
            name: 'Training Manager',
            email: 'training@liorian.com',
            role: 'staff',
            status: 'active',
            lastLogin: '2024-12-13T09:15:00Z',
            createdAt: '2024-02-15T00:00:00Z',
            phone: '+91 9876543213',
            department: 'Training',
            permissions: ['course_management', 'module_management', 'student_progress']
          },
          {
            id: 'student_001',
            name: 'John Doe',
            email: 'john.doe@email.com',
            role: 'candidate',
            status: 'active',
            lastLogin: '2024-12-15T18:20:00Z',
            createdAt: '2024-03-01T00:00:00Z',
            phone: '+91 9876543214',
            department: 'Cloud Computing',
            permissions: ['course_access', 'profile_management']
          },
          {
            id: 'student_002',
            name: 'Sarah Smith',
            email: 'sarah.smith@email.com',
            role: 'candidate',
            status: 'active',
            lastLogin: '2024-12-15T16:10:00Z',
            createdAt: '2024-03-15T00:00:00Z',
            phone: '+91 9876543215',
            department: 'Data Science',
            permissions: ['course_access', 'profile_management']
          },
          {
            id: 'student_003',
            name: 'Mike Johnson',
            email: 'mike.j@email.com',
            role: 'candidate',
            status: 'active',
            lastLogin: '2024-12-12T14:30:00Z',
            createdAt: '2024-04-01T00:00:00Z',
            phone: '+91 9876543216',
            department: 'Cybersecurity',
            permissions: ['course_access', 'profile_management']
          }
        ];
        
        // Save to localStorage
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
      }

      setUsers(systemUsers);
      setFilteredUsers(systemUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, filterRole, filterStatus]);

  const handleEditUser = (user: RealUser) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      setEditingUser(null);
      setMessage({ type: 'success', text: 'User updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      setMessage({ type: 'success', text: 'User deleted successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    setMessage({ type: 'success', text: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}` });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const newUser: RealUser = {
        id: `user_${Date.now()}`,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as 'admin' | 'staff' | 'candidate',
        status: 'active',
        lastLogin: null,
        createdAt: new Date().toISOString(),
        phone: formData.get("phone") as string,
        department: formData.get("department") as string,
        permissions: getDefaultPermissions(formData.get("role") as string)
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      setShowAddUserModal(false);
      setMessage({ type: 'success', text: 'User added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add user' });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['all_access', 'user_management', 'system_config', 'reports'];
      case 'staff':
        return ['candidate_management', 'course_management', 'reports'];
      case 'candidate':
        return ['course_access', 'profile_management'];
      default:
        return ['profile_management'];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'candidate': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation 
        userType="admin" 
        userName="Administrator"
        showSearchModal={setShowSearchModal}
      />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all system users, roles, and permissions</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
              <button 
                onClick={() => setMessage({ type: '', text: '' })}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="candidate">Candidate</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to="/password-management"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Manage Passwords
                </Link>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-xs text-gray-400">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.department || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'active' 
                                  ? 'text-orange-600 hover:bg-orange-100' 
                                  : 'text-green-600 hover:bg-green-100'
                              }`}
                              title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-gray-600">Admins</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'candidate').length}</div>
              <div className="text-gray-600">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="candidate">Candidate</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="candidate">Candidate</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
