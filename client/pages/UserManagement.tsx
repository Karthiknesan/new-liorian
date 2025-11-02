import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Users, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Lock, 
  Unlock,
  Save,
  X,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  Settings,
  Shield,
  UserPlus,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import DashboardNavigation from "../components/DashboardNavigation";

export default function UserManagement() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student", status: "Active", lastLogin: "2024-01-14" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Instructor", status: "Inactive", lastLogin: "2024-01-10" },
  ]);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUser = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      status: "Active",
      lastLogin: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setShowAddUserModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-light to-white">
      <DashboardNavigation 
        userType="admin" 
        userName="Administrator"
        showSearchModal={setShowSearchModal}
      />

      {/* Page Header */}
      <section className="pt-32 sm:pt-36 lg:pt-48 pb-16 sm:pb-20 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg text-white bg-gradient-to-r from-white to-premium-gold bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-shadow leading-relaxed">
              Manage users, roles, and permissions efficiently
            </p>
          </div>
        </div>
      </section>

      {/* Management Interface */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                activeTab === "users"
                  ? "premium-gradient text-premium-dark premium-shadow"
                  : "glass-effect border-2 border-premium-gold text-premium-gold hover:premium-gradient hover:text-premium-dark"
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                activeTab === "roles"
                  ? "premium-gradient text-premium-dark premium-shadow"
                  : "glass-effect border-2 border-premium-gold text-premium-gold hover:premium-gradient hover:text-premium-dark"
              }`}
            >
              <Shield className="w-5 h-5 inline-block mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                activeTab === "settings"
                  ? "premium-gradient text-premium-dark premium-shadow"
                  : "glass-effect border-2 border-premium-gold text-premium-gold hover:premium-gradient hover:text-premium-dark"
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Settings
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="premium-gradient text-premium-dark px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 premium-hover flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add User
                </button>
              </div>

              {/* Users Table */}
              <div className="glass-effect rounded-2xl overflow-hidden border border-premium-gold/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-premium-dark to-premium-bronze text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold">User</th>
                        <th className="px-6 py-4 text-left font-bold">Role</th>
                        <th className="px-6 py-4 text-left font-bold">Status</th>
                        <th className="px-6 py-4 text-left font-bold">Last Login</th>
                        <th className="px-6 py-4 text-center font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-premium-light/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-premium-gradient rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-premium-dark" />
                              </div>
                              <div>
                                <div className="font-bold text-premium-dark">{user.name}</div>
                                <div className="text-sm text-premium-dark/60">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              user.role === "Admin" ? "bg-red-100 text-red-800" :
                              user.role === "Instructor" ? "bg-blue-100 text-blue-800" :
                              "bg-green-100 text-green-800"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-premium-dark/80">{user.lastLogin}</td>
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
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold text-premium-dark mb-4">Role Management</h3>
              <p className="text-premium-dark/70 mb-8">
                Configure user roles and permissions for your organization.
              </p>
              <button className="premium-gradient text-premium-dark px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 premium-hover">
                Configure Roles
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">⚙️</div>
              <h3 className="text-2xl font-bold text-premium-dark mb-4">System Settings</h3>
              <p className="text-premium-dark/70 mb-8">
                Manage system-wide configurations and preferences.
              </p>
              <button className="premium-gradient text-premium-dark px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 premium-hover">
                Open Settings
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-premium-dark mb-6">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 premium-gradient text-premium-dark px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 premium-hover"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-premium-dark mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">Role</label>
                <select
                  name="role"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 premium-gradient text-premium-dark px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 premium-hover"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
