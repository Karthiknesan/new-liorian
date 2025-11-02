// 🛡️ Unified Admin User Management System
// Centralized system for managing all admin logins and permissions

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_manager' | 'system_operator' | 'test_admin_a' | 'test_admin_b' | 'production_manager' | 'analytics_admin';
  permissions: string[];
  department: string;
  lastLogin: string | null;
  isActive: boolean;
  createdAt: string;
  abTestVariant?: 'A' | 'B';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// 🔐 SECURE ADMIN CREDENTIALS (Separate from project login)
const ADMIN_MANAGEMENT_USERS: AdminUser[] = [
  {
    id: 'super_001',
    name: 'Super Administrator',
    email: 'superadmin@liorian.tech',
    role: 'super_admin',
    permissions: ['all_access', 'user_management', 'system_config', 'ab_testing', 'analytics', 'production'],
    department: 'System Management',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'A'
  },
  {
    id: 'admin_mgr_001',
    name: 'Admin Manager',
    email: 'adminmanager@liorian.tech',
    role: 'admin_manager',
    permissions: ['user_management', 'staff_control', 'permissions_config', 'ab_testing_limited'],
    department: 'User Operations',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'B'
  },
  {
    id: 'sysops_001',
    name: 'System Operator',
    email: 'sysops@liorian.tech',
    role: 'system_operator',
    permissions: ['technical_ops', 'monitoring', 'troubleshooting', 'analytics_view'],
    department: 'Technical Operations',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'A'
  },
  {
    id: 'test_a_001',
    name: 'Test Administrator A',
    email: 'testadmin.a@liorian.tech',
    role: 'test_admin_a',
    permissions: ['test_user_management', 'ab_testing_a', 'test_analytics'],
    department: 'Testing - Version A',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'A'
  },
  {
    id: 'test_b_001',
    name: 'Test Administrator B',
    email: 'testadmin.b@liorian.tech',
    role: 'test_admin_b',
    permissions: ['test_user_management', 'ab_testing_b', 'test_analytics'],
    department: 'Testing - Version B',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'B'
  },
  {
    id: 'prod_mgr_001',
    name: 'Production Manager',
    email: 'prodadmin@liorian.tech',
    role: 'production_manager',
    permissions: ['production_user_management', 'deployment_control', 'live_analytics', 'production_config'],
    department: 'Production Management',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'A'
  },
  {
    id: 'analytics_001',
    name: 'Analytics Administrator',
    email: 'analytics@liorian.tech',
    role: 'analytics_admin',
    permissions: ['analytics_full', 'reporting', 'user_behavior', 'ab_testing_view'],
    department: 'Analytics & Insights',
    lastLogin: null,
    isActive: true,
    createdAt: '2024-01-01',
    abTestVariant: 'B'
  }
];

// 🔑 SECURE PASSWORD VALIDATION (Environment-based in production)
const ADMIN_CREDENTIALS: Record<string, string> = {
  'superadmin@liorian.tech': 'SuperLiorian@2024#Management!',
  'adminmanager@liorian.tech': 'AdminMgr@2024#Control!',
  'sysops@liorian.tech': 'SysOps@2024#Secure!',
  'testadmin.a@liorian.tech': 'TestA@2024#Version!',
  'testadmin.b@liorian.tech': 'TestB@2024#Version!',
  'prodadmin@liorian.tech': 'ProdMgr@2024#Live!',
  'analytics@liorian.tech': 'Analytics@2024#Data!'
};

class AdminUserManager {
  private static instance: AdminUserManager;
  private currentUser: AdminUser | null = null;

  private constructor() {
    this.loadCurrentUser();
  }

  public static getInstance(): AdminUserManager {
    if (!AdminUserManager.instance) {
      AdminUserManager.instance = new AdminUserManager();
    }
    return AdminUserManager.instance;
  }

  // 🔐 Authentication
  public async authenticate(credentials: LoginCredentials): Promise<{success: boolean, user?: AdminUser, error?: string}> {
    const { email, password } = credentials;

    // Validate credentials
    if (!ADMIN_CREDENTIALS[email] || ADMIN_CREDENTIALS[email] !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Find user
    const user = ADMIN_MANAGEMENT_USERS.find(u => u.email === email && u.isActive);
    if (!user) {
      return { success: false, error: 'User account not found or inactive' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.currentUser = user;
    
    // Store in localStorage for session persistence
    localStorage.setItem('adminUserData', JSON.stringify(user));
    localStorage.setItem('adminSession', 'active');

    return { success: true, user };
  }

  // 📊 User Management
  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  public getAllUsers(): AdminUser[] {
    return ADMIN_MANAGEMENT_USERS.filter(u => u.isActive);
  }

  public getUsersByRole(role: AdminUser['role']): AdminUser[] {
    return ADMIN_MANAGEMENT_USERS.filter(u => u.role === role && u.isActive);
  }

  public hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission) || 
           this.currentUser.permissions.includes('all_access');
  }

  // 🧪 A/B Testing Support
  public getABTestVariant(): 'A' | 'B' {
    if (!this.currentUser) return 'A';
    return this.currentUser.abTestVariant || 'A';
  }

  public isTestUser(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role.includes('test_admin');
  }

  // 🔄 Session Management
  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem('adminUserData');
    localStorage.removeItem('adminSession');
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null && localStorage.getItem('adminSession') === 'active';
  }

  // 📱 User Management Operations
  public updateUserStatus(userId: string, isActive: boolean): boolean {
    const user = ADMIN_MANAGEMENT_USERS.find(u => u.id === userId);
    if (!user) return false;
    
    // Only super_admin can deactivate other admins
    if (!this.hasPermission('all_access')) return false;
    
    user.isActive = isActive;
    return true;
  }

  public createUser(userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>): AdminUser | null {
    // Only super_admin can create users
    if (!this.hasPermission('all_access')) return null;

    const newUser: AdminUser = {
      ...userData,
      id: `admin_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    ADMIN_MANAGEMENT_USERS.push(newUser);
    return newUser;
  }

  // 🔒 Security Features
  public getSecurityInfo(): {totalUsers: number, activeUsers: number, testUsers: number, lastLogins: {email: string, lastLogin: string}[]} {
    const totalUsers = ADMIN_MANAGEMENT_USERS.length;
    const activeUsers = ADMIN_MANAGEMENT_USERS.filter(u => u.isActive).length;
    const testUsers = ADMIN_MANAGEMENT_USERS.filter(u => u.role.includes('test_admin')).length;
    const lastLogins = ADMIN_MANAGEMENT_USERS
      .filter(u => u.lastLogin)
      .map(u => ({ email: u.email, lastLogin: u.lastLogin! }))
      .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
      .slice(0, 5);

    return { totalUsers, activeUsers, testUsers, lastLogins };
  }

  // 📊 Analytics Integration
  public trackUserAction(action: string, metadata: Record<string, any> = {}): void {
    if (!this.currentUser) return;

    const event = {
      userId: this.currentUser.id,
      email: this.currentUser.email,
      role: this.currentUser.role,
      action,
      timestamp: new Date().toISOString(),
      abTestVariant: this.currentUser.abTestVariant,
      metadata
    };

    // In production, send to analytics service
    console.log('Admin Action Tracked:', event);
    
    // Store locally for demo
    const actions = JSON.parse(localStorage.getItem('adminActions') || '[]');
    actions.push(event);
    localStorage.setItem('adminActions', JSON.stringify(actions.slice(-100))); // Keep last 100 actions
  }

  // 🔄 Private Methods
  private loadCurrentUser(): void {
    try {
      const userData = localStorage.getItem('adminUserData');
      const session = localStorage.getItem('adminSession');
      
      if (userData && session === 'active') {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.log('Error loading admin user data:', error);
      this.logout();
    }
  }
}

// 🚀 Export singleton instance
export const adminUserManager = AdminUserManager.getInstance();

// 🛡️ Helper functions
export function requireAdminAuth(): AdminUser | null {
  const manager = AdminUserManager.getInstance();
  if (!manager.isAuthenticated()) {
    throw new Error('Admin authentication required');
  }
  return manager.getCurrentUser();
}

export function requirePermission(permission: string): boolean {
  const manager = AdminUserManager.getInstance();
  if (!manager.hasPermission(permission)) {
    throw new Error(`Permission required: ${permission}`);
  }
  return true;
}

// 🧪 A/B Testing helpers
export function getAdminDashboardVariant(): 'simple' | 'enhanced' {
  const manager = AdminUserManager.getInstance();
  const variant = manager.getABTestVariant();
  return variant === 'A' ? 'simple' : 'enhanced';
}

export function shouldShowFeature(feature: string): boolean {
  const manager = AdminUserManager.getInstance();
  const user = manager.getCurrentUser();
  
  if (!user) return false;
  
  // Feature flags based on A/B test variant
  const featureFlags = {
    'A': ['simple_dashboard', 'basic_analytics', 'standard_nav'],
    'B': ['enhanced_dashboard', 'advanced_analytics', 'mega_menu', 'real_time_updates']
  };
  
  const variant = user.abTestVariant || 'A';
  return featureFlags[variant].includes(feature);
}
