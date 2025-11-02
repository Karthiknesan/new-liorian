// Real-Time Data Synchronization System
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr_manager' | 'hr_staff' | 'instructor' | 'candidate';
  isActive: boolean;
  lastLogin: string | null;
  profileData: any;
}

export interface SyncEvent {
  type: 'user_login' | 'user_logout' | 'data_update' | 'user_activity';
  userId: string;
  timestamp: string;
  data: any;
}

class RealTimeDataSync {
  private static instance: RealTimeDataSync;
  private users: Map<string, User> = new Map();
  private activeUsers: Set<string> = new Set();
  private syncListeners: Map<string, Function[]> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: string = new Date().toISOString();

  private constructor() {
    this.initializeDefaultUsers();
    this.startHeartbeat();
    this.setupStorageListener();
  }

  public static getInstance(): RealTimeDataSync {
    if (!RealTimeDataSync.instance) {
      RealTimeDataSync.instance = new RealTimeDataSync();
    }
    return RealTimeDataSync.instance;
  }

  // Initialize system with default users
  private initializeDefaultUsers(): void {
    const defaultUsers: User[] = [
      {
        id: 'admin-001',
        email: 'admin@liorian.com',
        name: 'System Administrator',
        role: 'admin',
        isActive: true,
        lastLogin: null,
        profileData: {
          department: 'Management',
          permissions: ['all'],
          joinDate: '2024-01-01'
        }
      },
      {
        id: 'hr-001',
        email: 'hr@liorian.com',
        name: 'HR Manager',
        role: 'hr_manager',
        isActive: true,
        lastLogin: null,
        profileData: {
          department: 'Human Resources',
          permissions: ['manage_candidates', 'view_reports'],
          joinDate: '2024-01-15'
        }
      },
      {
        id: 'placement-001',
        email: 'placement@liorian.com',
        name: 'Placement Coordinator',
        role: 'hr_staff',
        isActive: true,
        lastLogin: null,
        profileData: {
          department: 'Placement',
          permissions: ['manage_placements', 'view_candidates'],
          joinDate: '2024-01-20'
        }
      },
      {
        id: 'training-001',
        email: 'training@liorian.com',
        name: 'Training Manager',
        role: 'instructor',
        isActive: true,
        lastLogin: null,
        profileData: {
          department: 'Training',
          permissions: ['manage_training', 'view_progress'],
          joinDate: '2024-01-25'
        }
      },
      {
        id: 'candidate-001',
        email: 'john.doe@email.com',
        name: 'John Doe',
        role: 'candidate',
        isActive: true,
        lastLogin: null,
        profileData: {
          course: 'Python Fullstack Developer',
          status: 'In Progress',
          enrollmentDate: '2024-01-15',
          phone: '9876543210'
        }
      },
      {
        id: 'candidate-002',
        email: 'sarah.smith@email.com',
        name: 'Sarah Smith',
        role: 'candidate',
        isActive: true,
        lastLogin: null,
        profileData: {
          course: 'Data Analyst',
          status: 'Completed',
          enrollmentDate: '2024-01-20',
          phone: '8765432109'
        }
      },
      {
        id: 'candidate-003',
        email: 'mike.j@email.com',
        name: 'Mike Johnson',
        role: 'candidate',
        isActive: true,
        lastLogin: null,
        profileData: {
          course: 'Cybersecurity',
          status: 'Placed',
          enrollmentDate: '2024-01-25',
          phone: '7654321098'
        }
      }
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    this.saveToStorage();
    console.log('🗂️ Initialized user database with', defaultUsers.length, 'users');
  }

  // Authenticate user with credentials
  public authenticate(email: string, password: string): { success: boolean; user?: User; token?: string; error?: string } {
    console.log('🔐 Attempting authentication for:', email);
    
    // Find user by email
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user) {
      console.log('❌ User not found:', email);
      return { success: false, error: 'Invalid credentials' };
    }

    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return { success: false, error: 'Account deactivated' };
    }

    // Verify password (simplified for demo - use bcrypt in production)
    const validPasswords: { [key: string]: string } = {
      'admin@liorian.com': 'LiorianAdmin@2024#Secure',
      'hr@liorian.com': 'LiorianHR@2024#Manager',
      'placement@liorian.com': 'LiorianPlace@2024#Coord',
      'training@liorian.com': 'LiorianTrain@2024#Expert',
      'john.doe@email.com': 'JohnSecure@2024#Dev',
      'sarah.smith@email.com': 'SarahAnalyst@2024#Pro',
      'mike.j@email.com': 'MikeCyber@2024#Expert'
    };

    if (validPasswords[email] !== password) {
      console.log('❌ Invalid password for:', email);
      return { success: false, error: 'Invalid credentials' };
    }

    // Update last login and mark as active
    user.lastLogin = new Date().toISOString();
    this.activeUsers.add(user.id);
    this.users.set(user.id, user);

    // Generate token
    const token = this.generateToken(user);

    // Trigger sync event
    this.broadcastEvent({
      type: 'user_login',
      userId: user.id,
      timestamp: new Date().toISOString(),
      data: { email: user.email, role: user.role }
    });

    console.log('✅ Authentication successful for:', email, '- Role:', user.role);
    return { success: true, user, token };
  }

  // Generate secure token
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    return btoa(JSON.stringify(payload));
  }

  // Verify token
  public verifyToken(token: string): { valid: boolean; user?: User; error?: string } {
    try {
      const payload = JSON.parse(atob(token));
      
      if (payload.exp < Date.now()) {
        return { valid: false, error: 'Token expired' };
      }

      const user = this.users.get(payload.userId);
      if (!user || !user.isActive) {
        return { valid: false, error: 'User not found or deactivated' };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  // Get user by ID
  public getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  // Get all users by role
  public getUsersByRole(role: string): User[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Get active users
  public getActiveUsers(): User[] {
    return Array.from(this.users.values()).filter(user => this.activeUsers.has(user.id));
  }

  // Update user data
  public updateUser(userId: string, updates: Partial<User>): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    
    this.broadcastEvent({
      type: 'data_update',
      userId,
      timestamp: new Date().toISOString(),
      data: updates
    });

    this.saveToStorage();
    return true;
  }

  // Subscribe to sync events
  public subscribe(eventType: string, callback: Function): () => void {
    if (!this.syncListeners.has(eventType)) {
      this.syncListeners.set(eventType, []);
    }
    
    this.syncListeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.syncListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Broadcast event to all listeners
  private broadcastEvent(event: SyncEvent): void {
    console.log('📡 Broadcasting event:', event.type, 'for user:', event.userId);
    
    const listeners = this.syncListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in sync listener:', error);
        }
      });
    }

    // Also trigger 'all' listeners
    const allListeners = this.syncListeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in all-event listener:', error);
        }
      });
    }
  }

  // Start heartbeat for active sessions
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.lastSyncTime = new Date().toISOString();
      
      // Clean up inactive users (no activity for 30 minutes)
      const cutoffTime = Date.now() - (30 * 60 * 1000);
      this.activeUsers.forEach(userId => {
        const user = this.users.get(userId);
        if (user && user.lastLogin && new Date(user.lastLogin).getTime() < cutoffTime) {
          this.activeUsers.delete(userId);
          console.log('🕒 User session expired:', user.email);
        }
      });

      this.broadcastEvent({
        type: 'user_activity',
        userId: 'system',
        timestamp: this.lastSyncTime,
        data: { activeUsers: this.activeUsers.size }
      });
    }, 60000); // Every minute
  }

  // Save to localStorage for persistence
  private saveToStorage(): void {
    try {
      const data = {
        users: Array.from(this.users.entries()),
        activeUsers: Array.from(this.activeUsers),
        lastSync: this.lastSyncTime
      };
      localStorage.setItem('liorian_sync_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save sync data:', error);
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('liorian_sync_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.users = new Map(parsed.users);
        this.activeUsers = new Set(parsed.activeUsers);
        this.lastSyncTime = parsed.lastSync;
        console.log('📥 Loaded sync data from storage');
      }
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  }

  // Setup storage listener for cross-tab sync
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'liorian_sync_data') {
        this.loadFromStorage();
        console.log('🔄 Sync data updated from another tab');
      }
    });
  }

  // Logout user
  public logout(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    this.activeUsers.delete(userId);
    
    this.broadcastEvent({
      type: 'user_logout',
      userId,
      timestamp: new Date().toISOString(),
      data: { email: user.email }
    });

    this.saveToStorage();
    console.log('👋 User logged out:', user.email);
    return true;
  }

  // Get system stats
  public getSystemStats(): any {
    return {
      totalUsers: this.users.size,
      activeUsers: this.activeUsers.size,
      usersByRole: {
        admin: this.getUsersByRole('admin').length,
        hr_manager: this.getUsersByRole('hr_manager').length,
        hr_staff: this.getUsersByRole('hr_staff').length,
        instructor: this.getUsersByRole('instructor').length,
        candidate: this.getUsersByRole('candidate').length
      },
      lastSyncTime: this.lastSyncTime
    };
  }
}

export default RealTimeDataSync;
export type { User, SyncEvent };
