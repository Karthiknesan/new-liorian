import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import UserSyncManager from '../utils/userSyncManager';
import {
  Users,
  UserPlus,
  Shield,
  Edit3,
  Trash2,
  Search,
  Filter,
  Settings,
  UserCheck,
  UserX,
  Layers,
  RefreshCw
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'hr_manager' | 'hr_staff' | 'instructor' | 'staff';
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  batchAssignments?: string[];
}

interface Batch {
  id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
  instructor: string;
  candidateCount: number;
  status: 'Active' | 'Completed' | 'Upcoming';
}

interface UserManagementProps {
  currentUserRole: 'admin' | 'hr_manager';
}

const ROLE_HIERARCHY = {
  admin: { level: 5, label: 'Administrator', color: 'bg-red-100 text-red-800' },
  hr_manager: { level: 4, label: 'HR Manager', color: 'bg-blue-100 text-blue-800' },
  hr_staff: { level: 3, label: 'HR Staff', color: 'bg-green-100 text-green-800' },
  instructor: { level: 2, label: 'Instructor', color: 'bg-orange-100 text-orange-800' },
  staff: { level: 1, label: 'Staff', color: 'bg-gray-100 text-gray-800' }
};

const ADMIN_PERMISSIONS = [
  'manage_candidates',
  'manage_courses',
  'manage_batches',
  'assign_instructors',
  'view_reports',
  'manage_modules',
  'manage_assessments',
  'view_analytics',
  'manage_placements'
];

const HR_PERMISSIONS = [
  'manage_candidates',
  'manage_batches',
  'assign_instructors',
  'view_reports',
  'view_analytics'
];

const AVAILABLE_PERMISSIONS = [
  'manage_candidates',
  'manage_courses',
  'manage_batches',
  'assign_instructors',
  'view_reports',
  'manage_modules',
  'manage_assessments',
  'view_analytics',
  'manage_placements'
];

export default function UserManagement({ currentUserRole }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const syncManager = UserSyncManager.getInstance();

  useEffect(() => {
    // Load initial users from sync manager
    const loadUsers = () => {
      const syncedUsers = syncManager.getAllUsers();
      const convertedUsers: User[] = syncedUsers.map(user => ({
        ...user,
        createdAt: "2024-01-01",
        batchAssignments: []
      }));
      setUsers(convertedUsers);
      setIsLoading(false);
    };

    loadUsers();

    // Set up real-time sync listener
    const handleSyncEvent = (event: any) => {
      console.log('🔄 User sync event:', event.type, event.data.email);
      loadUsers(); // Reload users when changes occur
    };

    syncManager.addSyncListener(handleSyncEvent);

    return () => {
      syncManager.removeSyncListener(handleSyncEvent);
    };
  }, []);

  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "batch-001",
      name: "Python Fullstack - Batch 1",
      course: "Python Fullstack Developer",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      instructor: "john.doe@liorian.com",
      candidateCount: 25,
      status: "Active"
    },
    {
      id: "batch-002", 
      name: "Data Science - Batch 3",
      course: "Data Science",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      instructor: "jane.smith@liorian.com",
      candidateCount: 20,
      status: "Active"
    }
  ]);

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddBatchForm, setShowAddBatchForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('users');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as User['role'],
    department: '',
    permissions: [] as string[]
  });

  const [newBatch, setNewBatch] = useState({
    name: '',
    course: '',
    startDate: '',
    endDate: '',
    instructor: ''
  });

  const currentUserLevel = ROLE_HIERARCHY[currentUserRole].level;

  const canManageRole = (targetRole: User['role']) => {
    return currentUserLevel > ROLE_HIERARCHY[targetRole].level;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole && canManageRole(user.role);
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const user: User = {
      id: Date.now(),
      ...newUser,
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      batchAssignments: []
    };

    setUsers(prev => [...prev, user]);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'staff',
      department: '',
      permissions: []
    });
    setShowAddUserForm(false);

    // In real app, this would make API call
    console.log('Adding user:', user);
  };

  const handleUpdateUserStatus = async (userId: number, isActive: boolean) => {
    syncManager.updateUserStatus(userId, isActive);
    console.log('✅ User status updated via sync manager:', userId, isActive);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
      return;
    }

    // In real app, this would make API call to delete user
    setUsers(prev => prev.filter(user => user.id !== userId));
    console.log('🗑️ User deleted:', userId);
  };

  const handleUpdatePermissions = (userId: number, permissions: string[]) => {
    syncManager.updateUserPermissions(userId, permissions);
    console.log('✅ User permissions updated via sync manager:', userId, permissions);
  };

  const handleAddBatch = () => {
    if (!newBatch.name || !newBatch.course || !newBatch.startDate) return;

    const batch: Batch = {
      id: `batch-${Date.now()}`,
      ...newBatch,
      candidateCount: 0,
      status: 'Upcoming'
    };

    setBatches(prev => [...prev, batch]);
    setNewBatch({
      name: '',
      course: '',
      startDate: '',
      endDate: '',
      instructor: ''
    });
    setShowAddBatchForm(false);
  };

  const getAvailableRoles = () => {
    return Object.entries(ROLE_HIERARCHY)
      .filter(([role]) => canManageRole(role as User['role']))
      .map(([role, config]) => ({ value: role, label: config.label }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            User & Access Management
            <Badge className="bg-green-100 text-green-800 ml-2">
              <RefreshCw className="w-3 h-3 mr-1" />
              Real-time Sync
            </Badge>
          </h2>
          <p className="text-gray-600">
            Manage system users, roles, permissions, and batches with live synchronization
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>👨‍💼 Admins: {users.filter(u => u.role === 'admin').length}</span>
            <span>👥 HR: {users.filter(u => u.role.startsWith('hr')).length}</span>
            <span>🎓 Candidates: {users.filter(u => u.role === 'candidate').length}</span>
            <span>📊 Total: {users.length}</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management ({users.length})
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Batch Management ({batches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {getAvailableRoles().map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setShowAddUserForm(true)} className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.department}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={ROLE_HIERARCHY[user.role].color}>
                            {ROLE_HIERARCHY[user.role].label}
                          </Badge>
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">PERMISSIONS</label>
                          <p className="text-sm">{user.permissions.length} assigned</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">LAST LOGIN</label>
                          <p className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">BATCH ASSIGNMENTS</label>
                          <p className="text-sm">{user.batchAssignments?.length || 0} batches</p>
                        </div>
                      </div>
                    </div>

                    {canManageRole(user.role) && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                          className="flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Permissions
                        </Button>
                        
                        <Button
                          variant={user.isActive ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                          className="flex items-center gap-2"
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-4 h-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </Button>

                        {user.role !== 'super_admin' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          {/* Batch Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Batch Management</CardTitle>
              <Button onClick={() => setShowAddBatchForm(true)} className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Batch
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {batches.map((batch) => (
                  <div key={batch.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{batch.name}</h3>
                        <p className="text-sm text-gray-600">{batch.course}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 {batch.startDate} - {batch.endDate}</span>
                          <span>👨‍🏫 {batch.instructor}</span>
                          <span>👥 {batch.candidateCount} candidates</span>
                        </div>
                      </div>
                      <Badge className={
                        batch.status === 'Active' ? 'bg-green-100 text-green-800' :
                        batch.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              />
              <Input
                placeholder="Department"
                value={newUser.department}
                onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
              />
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as User['role'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">Add User</Button>
                <Button variant="outline" onClick={() => setShowAddUserForm(false)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Batch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Batch Name"
                value={newBatch.name}
                onChange={(e) => setNewBatch(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Course"
                value={newBatch.course}
                onChange={(e) => setNewBatch(prev => ({ ...prev, course: e.target.value }))}
              />
              <Input
                type="date"
                placeholder="Start Date"
                value={newBatch.startDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={newBatch.endDate}
                onChange={(e) => setNewBatch(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <Input
                placeholder="Instructor Email"
                value={newBatch.instructor}
                onChange={(e) => setNewBatch(prev => ({ ...prev, instructor: e.target.value }))}
              />
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddBatch} className="flex-1">Create Batch</Button>
                <Button variant="outline" onClick={() => setShowAddBatchForm(false)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Edit Permissions - {editingUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.permissions.includes(permission)}
                      onChange={(e) => {
                        const permissions = e.target.checked
                          ? [...editingUser.permissions, permission]
                          : editingUser.permissions.filter(p => p !== permission);
                        setEditingUser({ ...editingUser, permissions });
                      }}
                    />
                    <span className="text-sm">{permission.replace(/_/g, ' ').toUpperCase()}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    handleUpdatePermissions(editingUser.id, editingUser.permissions);
                    setEditingUser(null);
                  }} 
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
