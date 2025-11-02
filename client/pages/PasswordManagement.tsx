import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Copy,
  RefreshCw,
  User,
  Shield
} from "lucide-react";
import DashboardNavigation from "../components/DashboardNavigation";
import SimpleAuth from "../utils/simpleAuth";

interface UserPassword {
  id: string;
  name: string;
  email: string;
  role: string;
  currentPassword: string;
  lastUpdated: string;
  strength: 'weak' | 'medium' | 'strong';
}

export default function PasswordManagement() {
  const [users, setUsers] = useState<UserPassword[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPassword | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const auth = SimpleAuth.getInstance();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    // Get system users
    const storedUsers = localStorage.getItem('systemUsers');
    let systemUsers = [];

    if (storedUsers) {
      systemUsers = JSON.parse(storedUsers);
    }

    // Create password management data
    const passwordData: UserPassword[] = systemUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      currentPassword: getPasswordForUser(user.email),
      lastUpdated: user.passwordUpdated || '2024-01-01',
      strength: getPasswordStrength(getPasswordForUser(user.email))
    }));

    setUsers(passwordData);
  };

  const getPasswordForUser = (email: string): string => {
    // Current system passwords
    const passwords: { [key: string]: string } = {
      'admin@liorian.com': 'LiorianAdmin@2024#Secure',
      'hr@liorian.com': 'LiorianHR@2024#Manager',
      'placement@liorian.com': 'LiorianPlace@2024#Coord',
      'training@liorian.com': 'LiorianTrain@2024#Expert',
      'john.doe@email.com': 'JohnSecure@2024#Dev',
      'sarah.smith@email.com': 'SarahAnalyst@2024#Pro',
      'mike.j@email.com': 'MikeCyber@2024#Expert'
    };

    return passwords[email] || 'DefaultPass@2024!';
  };

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 8) return 'weak';
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score >= 4 && password.length >= 12) return 'strong';
    if (score >= 3 && password.length >= 8) return 'medium';
    return 'weak';
  };

  const generateSecurePassword = (): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const all = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword();
    setNewPassword(generated);
  };

  const handleUpdatePassword = () => {
    if (!selectedUser || !newPassword) return;

    setLoading(true);

    try {
      // Update the password in the system
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              currentPassword: newPassword,
              lastUpdated: new Date().toISOString().split('T')[0],
              strength: getPasswordStrength(newPassword)
            }
          : user
      );

      setUsers(updatedUsers);

      // Update system users data
      const systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
      const updatedSystemUsers = systemUsers.map((user: any) => 
        user.id === selectedUser.id 
          ? { ...user, passwordUpdated: new Date().toISOString().split('T')[0] }
          : user
      );
      localStorage.setItem('systemUsers', JSON.stringify(updatedSystemUsers));

      setMessage({ type: 'success', text: `Password updated successfully for ${selectedUser.name}` });
      setSelectedUser(null);
      setNewPassword("");
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage({ type: 'success', text: 'Password copied to clipboard' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    });
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'weak': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-5 h-5 text-red-600" />;
      case 'staff': return <User className="w-5 h-5 text-blue-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation 
        userType="admin" 
        userName="Administrator"
      />

      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/user-management" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to User Management
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Management</h1>
            <p className="text-gray-600">Manage user passwords and security settings</p>
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
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">User Passwords</h2>
              <p className="text-gray-600">Click on a user to update their password</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strength</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getRoleIcon(user.role)}
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {showPassword ? user.currentPassword : '••••••••••••'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(user.currentPassword)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Copy password"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStrengthColor(user.strength)}`}>
                          {user.strength}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                          Update Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPassword ? 'Hide' : 'Show'} Passwords
              </button>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔒 Password Security Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Strong Password Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• At least 12 characters long</li>
                  <li>• Mix of uppercase and lowercase letters</li>
                  <li>• Include numbers and special characters</li>
                  <li>• Avoid common words or patterns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Practices:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Update passwords every 90 days</li>
                  <li>• Never share passwords</li>
                  <li>• Use unique passwords for each account</li>
                  <li>• Enable two-factor authentication when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Password Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Update Password</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User: {selectedUser.name}
              </label>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
                  placeholder="Enter new password"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Generate secure password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {newPassword && (
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStrengthColor(getPasswordStrength(newPassword))}`}>
                    Strength: {getPasswordStrength(newPassword)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setNewPassword("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                disabled={!newPassword || loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
