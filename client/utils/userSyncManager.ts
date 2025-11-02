interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'hr_manager' | 'hr_staff' | 'instructor' | 'staff' | 'candidate';
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string | null;
  lastActivity: string;
}

interface SyncEvent {
  type: 'USER_ADDED' | 'USER_UPDATED' | 'USER_DELETED' | 'PERMISSION_CHANGED' | 'STATUS_CHANGED';
  data: UserData;
  timestamp: string;
  initiatedBy: string;
}

class UserSyncManager {
  private static instance: UserSyncManager;
  private users: Map<number, UserData> = new Map();
  private syncListeners: Array<(event: SyncEvent) => void> = [];
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeUsers();
    this.startRealTimeSync();
  }

  public static getInstance(): UserSyncManager {
    if (!UserSyncManager.instance) {
      UserSyncManager.instance = new UserSyncManager();
    }
    return UserSyncManager.instance;
  }

  private initializeUsers() {
    // Initialize with default users matching the hierarchy Admin > HR > Candidate
    const defaultUsers: UserData[] = [
      {
        id: 1,
        name: "System Administrator",
        email: "admin@liorian.com",
        role: "admin",
        department: "Management",
        permissions: ["manage_candidates", "manage_courses", "manage_batches", "assign_instructors", "view_reports", "manage_modules", "manage_assessments", "view_analytics", "manage_placements"],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 2,
        name: "HR Manager",
        email: "hr@liorian.com",
        role: "hr_manager",
        department: "Human Resources",
        permissions: ["manage_candidates", "manage_batches", "assign_instructors", "view_reports", "view_analytics"],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 3,
        name: "HR Staff",
        email: "hrstaff@liorian.com",
        role: "hr_staff",
        department: "Human Resources",
        permissions: ["manage_candidates", "view_reports"],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 4,
        name: "Staff Member",
        email: "staff@liorian.com",
        role: "staff",
        department: "Operations",
        permissions: ["view_reports"],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 5,
        name: "Test Candidate",
        email: "candidate@liorian.com",
        role: "candidate",
        department: "Learning",
        permissions: [],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 6,
        name: "Rohan Gupta",
        email: "rohan.gupta@email.com",
        role: "candidate",
        department: "Learning",
        permissions: [],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 7,
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        role: "candidate",
        department: "Learning",
        permissions: [],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      },
      {
        id: 8,
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        role: "candidate",
        department: "Learning",
        permissions: [],
        isActive: true,
        lastLogin: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Store in localStorage for persistence
    localStorage.setItem('syncedUsers', JSON.stringify(Array.from(this.users.values())));
  }

  private startRealTimeSync() {
    // Sync every 5 seconds for real-time updates
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, 5000);

    // Also sync on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.performSync();
      }
    });
  }

  private performSync() {
    // In a real application, this would sync with the server
    // For now, we'll sync with localStorage and notify listeners
    const stored = localStorage.getItem('syncedUsers');
    if (stored) {
      try {
        const storedUsers = JSON.parse(stored);
        storedUsers.forEach((user: UserData) => {
          const existing = this.users.get(user.id);
          if (!existing || this.hasUserChanged(existing, user)) {
            this.users.set(user.id, user);
            this.notifyListeners({
              type: 'USER_UPDATED',
              data: user,
              timestamp: new Date().toISOString(),
              initiatedBy: 'sync'
            });
          }
        });
      } catch (error) {
        console.error('Error syncing users:', error);
      }
    }
  }

  private hasUserChanged(existing: UserData, updated: UserData): boolean {
    return existing.lastActivity !== updated.lastActivity ||
           existing.isActive !== updated.isActive ||
           JSON.stringify(existing.permissions) !== JSON.stringify(updated.permissions);
  }

  public addSyncListener(listener: (event: SyncEvent) => void) {
    this.syncListeners.push(listener);
  }

  public removeSyncListener(listener: (event: SyncEvent) => void) {
    const index = this.syncListeners.indexOf(listener);
    if (index > -1) {
      this.syncListeners.splice(index, 1);
    }
  }

  private notifyListeners(event: SyncEvent) {
    this.syncListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  public updateUser(user: UserData) {
    this.users.set(user.id, { ...user, lastActivity: new Date().toISOString() });
    localStorage.setItem('syncedUsers', JSON.stringify(Array.from(this.users.values())));
    
    this.notifyListeners({
      type: 'USER_UPDATED',
      data: user,
      timestamp: new Date().toISOString(),
      initiatedBy: 'user_action'
    });
  }

  public getUsersByRole(role: UserData['role']): UserData[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  public getAllUsers(): UserData[] {
    return Array.from(this.users.values());
  }

  public getUserByEmail(email: string): UserData | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  public updateUserPermissions(userId: number, permissions: string[]) {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, permissions, lastActivity: new Date().toISOString() };
      this.users.set(userId, updatedUser);
      localStorage.setItem('syncedUsers', JSON.stringify(Array.from(this.users.values())));
      
      this.notifyListeners({
        type: 'PERMISSION_CHANGED',
        data: updatedUser,
        timestamp: new Date().toISOString(),
        initiatedBy: 'admin_action'
      });
    }
  }

  public updateUserStatus(userId: number, isActive: boolean) {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, isActive, lastActivity: new Date().toISOString() };
      this.users.set(userId, updatedUser);
      localStorage.setItem('syncedUsers', JSON.stringify(Array.from(this.users.values())));
      
      this.notifyListeners({
        type: 'STATUS_CHANGED',
        data: updatedUser,
        timestamp: new Date().toISOString(),
        initiatedBy: 'admin_action'
      });
    }
  }

  public getHierarchyStats() {
    const users = this.getAllUsers();
    return {
      admins: users.filter(u => u.role === 'admin').length,
      hr_managers: users.filter(u => u.role === 'hr_manager').length,
      hr_staff: users.filter(u => u.role === 'hr_staff').length,
      staff: users.filter(u => u.role === 'staff').length,
      candidates: users.filter(u => u.role === 'candidate').length,
      total: users.length,
      active: users.filter(u => u.isActive).length
    };
  }

  public destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncListeners = [];
  }
}

export default UserSyncManager;
