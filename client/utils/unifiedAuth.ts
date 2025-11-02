import RealTimeDataSync, { User } from './realTimeSync';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  lastActivity: number;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  redirectTo?: string;
}

class UnifiedAuthManager {
  private static instance: UnifiedAuthManager;
  private syncManager: RealTimeDataSync;
  private authState: AuthState;
  private listeners: Set<Function> = new Set();
  private activityInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.syncManager = RealTimeDataSync.getInstance();
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      lastActivity: Date.now()
    };
    
    this.initializeAuth();
    this.setupActivityTracking();
    this.setupSyncListeners();
  }

  public static getInstance(): UnifiedAuthManager {
    if (!UnifiedAuthManager.instance) {
      UnifiedAuthManager.instance = new UnifiedAuthManager();
    }
    return UnifiedAuthManager.instance;
  }

  // Initialize authentication from stored tokens
  private initializeAuth(): void {
    try {
      // Check for existing tokens
      const tokens = [
        { key: 'adminToken', type: 'admin' },
        { key: 'staffToken', type: 'staff' },
        { key: 'candidateToken', type: 'candidate' }
      ];

      for (const { key, type } of tokens) {
        const token = localStorage.getItem(key);
        if (token) {
          const verification = this.syncManager.verifyToken(token);
          if (verification.valid && verification.user) {
            this.setAuthState(verification.user, token);
            console.log('🔄 Restored session for:', verification.user.email);
            return;
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  // Login with email and password
  public async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔐 Attempting login for:', email);

    try {
      const authResult = this.syncManager.authenticate(email, password);
      
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error || 'Authentication failed'
        };
      }

      const { user, token } = authResult;
      if (!user || !token) {
        return {
          success: false,
          error: 'Invalid authentication response'
        };
      }

      // Set auth state
      this.setAuthState(user, token);

      // Store token based on user role
      this.storeToken(token, user.role);

      // Determine redirect URL
      const redirectTo = this.getRedirectUrl(user.role);

      console.log('✅ Login successful for:', email, '-> Redirecting to:', redirectTo);

      return {
        success: true,
        user,
        token,
        redirectTo
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  // Store token based on user type
  private storeToken(token: string, role: string): void {
    // Clear all existing tokens first
    this.clearAllTokens();

    // Store new token
    switch (role) {
      case 'admin':
        localStorage.setItem('adminToken', token);
        break;
      case 'hr_manager':
      case 'hr_staff':
      case 'instructor':
        localStorage.setItem('staffToken', token);
        break;
      case 'candidate':
        localStorage.setItem('candidateToken', token);
        break;
    }

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(this.authState.user));
    localStorage.setItem('authTimestamp', Date.now().toString());
  }

  // Get redirect URL based on role
  private getRedirectUrl(role: string): string {
    switch (role) {
      case 'admin':
      case 'hr_manager':
      case 'hr_staff':
      case 'instructor':
        return '/admin-dashboard';
      case 'candidate':
        return '/candidate-dashboard';
      default:
        return '/';
    }
  }

  // Set authentication state
  private setAuthState(user: User, token: string): void {
    this.authState = {
      isAuthenticated: true,
      user,
      token,
      lastActivity: Date.now()
    };

    this.notifyListeners();
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.authState.isAuthenticated && this.authState.user !== null;
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Get user role
  public getUserRole(): string | null {
    return this.authState.user?.role || null;
  }

  // Logout current user
  public logout(): void {
    if (this.authState.user) {
      this.syncManager.logout(this.authState.user.id);
    }

    this.clearAuthState();
    this.clearAllTokens();
    console.log('👋 User logged out');
  }

  // Clear authentication state
  private clearAuthState(): void {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      lastActivity: Date.now()
    };

    this.notifyListeners();
  }

  // Clear all stored tokens
  private clearAllTokens(): void {
    ['adminToken', 'staffToken', 'candidateToken', 'currentUser', 'authTimestamp'].forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Subscribe to auth state changes
  public subscribe(callback: Function): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of auth state changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.authState);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  // Setup activity tracking
  private setupActivityTracking(): void {
    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        this.authState.lastActivity = Date.now();
      }, { passive: true });
    });

    // Check for session timeout every minute
    this.activityInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        const timeSinceActivity = Date.now() - this.authState.lastActivity;
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes

        if (timeSinceActivity > sessionTimeout) {
          console.log('⏰ Session timeout - logging out');
          this.logout();
        }
      }
    }, 60000);
  }

  // Setup sync event listeners
  private setupSyncListeners(): void {
    this.syncManager.subscribe('user_logout', (event: any) => {
      if (this.authState.user && event.userId === this.authState.user.id) {
        console.log('🔄 User logged out from another session');
        this.clearAuthState();
      }
    });

    this.syncManager.subscribe('data_update', (event: any) => {
      if (this.authState.user && event.userId === this.authState.user.id) {
        // Refresh user data
        const updatedUser = this.syncManager.getUser(event.userId);
        if (updatedUser) {
          this.authState.user = updatedUser;
          this.notifyListeners();
        }
      }
    });
  }

  // Verify current session
  public verifySession(): boolean {
    if (!this.isAuthenticated() || !this.authState.token) {
      return false;
    }

    const verification = this.syncManager.verifyToken(this.authState.token);
    if (!verification.valid) {
      console.log('❌ Session verification failed');
      this.logout();
      return false;
    }

    return true;
  }

  // Get authentication stats
  public getAuthStats(): any {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.authState.user ? {
        id: this.authState.user.id,
        email: this.authState.user.email,
        role: this.authState.user.role,
        name: this.authState.user.name
      } : null,
      lastActivity: new Date(this.authState.lastActivity).toISOString(),
      systemStats: this.syncManager.getSystemStats()
    };
  }

  // Force redirect to appropriate dashboard
  public redirectToDashboard(): void {
    if (!this.isAuthenticated() || !this.authState.user) {
      window.location.href = '/login';
      return;
    }

    const redirectUrl = this.getRedirectUrl(this.authState.user.role);
    console.log('🚀 Redirecting to dashboard:', redirectUrl);
    window.location.href = redirectUrl;
  }

  // Update user profile
  public updateProfile(updates: Partial<User>): boolean {
    if (!this.authState.user) return false;

    const success = this.syncManager.updateUser(this.authState.user.id, updates);
    if (success) {
      // Update local auth state
      this.authState.user = { ...this.authState.user, ...updates };
      this.notifyListeners();
    }

    return success;
  }
}

export default UnifiedAuthManager;
export type { AuthState, LoginResponse };
