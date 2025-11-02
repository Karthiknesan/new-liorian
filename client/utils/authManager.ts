// Enhanced Authentication Manager with Session Persistence
class AuthManager {
  private static instance: AuthManager;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();

  private constructor() {
    this.setupSessionPersistence();
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // Setup session persistence mechanisms
  private setupSessionPersistence(): void {
    // Listen for browser navigation events
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    window.addEventListener('unload', this.handleUnload.bind(this));
    window.addEventListener('pagehide', this.handlePageHide.bind(this));

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', this.handlePopState.bind(this));

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Track user activity to prevent session timeout
    this.setupActivityTracking();

    // Auto-save session state periodically
    this.startSessionAutoSave();
  }

  private handleBeforeUnload(): void {
    console.log('🔄 Page unloading - clearing session');
    // Clear session on browser close (but preserve on page refresh)
    if (this.isBrowserClosing()) {
      this.clearSessionData();
      this.clearAllTokens();
    }
  }

  private handleUnload(): void {
    console.log('🔄 Page unloaded - session cleared');
  }

  // Detect if browser is closing vs page refresh
  private isBrowserClosing(): boolean {
    // Use sessionStorage to detect browser close vs page refresh
    // If sessionStorage exists, it's a refresh; if not, it's a new session
    const isRefresh = sessionStorage.getItem('page_refresh_marker') !== null;
    if (!isRefresh) {
      sessionStorage.setItem('page_refresh_marker', 'true');
    }
    return !isRefresh;
  }

  private handlePageHide(): void {
    console.log('🔄 Page hidden - preserving session');
    this.preserveSession();
  }

  private handlePopState(): void {
    console.log('🔄 Browser navigation detected - checking session');
    this.recoverSession();
  }

  private handleVisibilityChange(): void {
    if (!document.hidden) {
      console.log('🔄 Tab became visible - recovering session');
      this.recoverSession();
    }
  }

  private setupActivityTracking(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.preserveSession(); // Auto-save on activity
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  private startSessionAutoSave(): void {
    // Auto-save session every 30 seconds
    this.sessionCheckInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        this.preserveSession();
        console.log('🔄 Auto-saving session');
      }
    }, 30000);
  }

  private preserveSession(): void {
    if (this.isAuthenticated()) {
      const sessionData = {
        timestamp: Date.now(),
        lastActivity: this.lastActivity,
        userType: this.getTokenType(),
        currentPath: window.location.pathname,
        sessionId: this.generateSessionId()
      };

      // Store in both localStorage and sessionStorage for redundancy
      localStorage.setItem('liorian_session_data', JSON.stringify(sessionData));
      sessionStorage.setItem('liorian_session_backup', JSON.stringify(sessionData));

      console.log('✅ Session preserved successfully');
    }
  }

  private recoverSession(): void {
    try {
      // Try to recover from localStorage first, then sessionStorage
      let sessionData = localStorage.getItem('liorian_session_data');
      if (!sessionData) {
        sessionData = sessionStorage.getItem('liorian_session_backup');
      }

      if (sessionData) {
        const data = JSON.parse(sessionData);
        const now = Date.now();
        const sessionAge = now - data.timestamp;

        // Session is valid if less than 24 hours old and has recent activity
        if (sessionAge < 24 * 60 * 60 * 1000 && this.getToken()) {
          console.log('🔄 Session recovered successfully');
          this.lastActivity = data.lastActivity || now;
          return;
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to recover session:', error);
    }
  }

  private generateSessionId(): string {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Get current authentication token
  getToken(): string | null {
    return localStorage.getItem('adminToken') || 
           localStorage.getItem('staffToken') || 
           localStorage.getItem('candidateToken');
  }

  // Get token type
  getTokenType(): 'admin' | 'staff' | 'candidate' | null {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('staffToken')) return 'staff';
    if (localStorage.getItem('candidateToken')) return 'candidate';
    return null;
  }

  // Store token with single device enforcement
  setToken(token: string, type: 'admin' | 'staff' | 'candidate'): void {
    // Clear all existing tokens first
    this.clearAllTokens();

    // Create unique device session ID
    const deviceSessionId = this.generateDeviceSessionId();

    // Set the new token with device session
    localStorage.setItem(`${type}Token`, token);
    localStorage.setItem('deviceSessionId', deviceSessionId);
    localStorage.setItem('singleDeviceMode', 'true');

    console.log(`✅ ${type} token stored successfully with device session`);
  }

  // Generate unique device session ID
  private generateDeviceSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const userAgent = navigator.userAgent.slice(0, 20);
    return btoa(`${timestamp}-${random}-${userAgent}`);
  }

  // Check for concurrent sessions
  private checkDeviceSession(): boolean {
    const deviceSessionId = localStorage.getItem('deviceSessionId');
    const singleDeviceMode = localStorage.getItem('singleDeviceMode');

    if (!singleDeviceMode || !deviceSessionId) return true;

    // In a real implementation, you would check against server-side session store
    // For now, we simulate single device by clearing session if window was reopened
    const windowSessionMarker = sessionStorage.getItem('window_session_marker');
    if (!windowSessionMarker) {
      sessionStorage.setItem('window_session_marker', deviceSessionId);
      return true;
    }

    return windowSessionMarker === deviceSessionId;
  }

  // Check if user is authenticated with session recovery
  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      // Try to recover session before giving up
      this.recoverSession();
      const recoveredToken = this.getToken();

      if (recoveredToken) {
        console.log('🔄 Session recovered during authentication check');
        return true;
      }

      console.log('🔐 Authentication check: NOT AUTHENTICATED');
      return false;
    }

    // Check device session enforcement
    if (!this.checkDeviceSession()) {
      console.log('🚫 Multiple device session detected - logging out');
      this.logout();
      return false;
    }

    // Validate session freshness
    if (this.isSessionExpired()) {
      console.log('⏰ Session expired - logging out');
      this.logout();
      return false;
    }

    console.log('🔐 Authentication check: AUTHENTICATED');
    return true;
  }

  // Check if session has expired based on activity
  private isSessionExpired(): boolean {
    const now = Date.now();
    const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
    const activityTimeout = 2 * 60 * 60 * 1000; // 2 hours of inactivity

    try {
      const sessionData = localStorage.getItem('liorian_session_data');
      if (!sessionData) return false; // No session data, let other checks handle it

      const data = JSON.parse(sessionData);
      const sessionAge = now - data.timestamp;
      const inactivityPeriod = now - (data.lastActivity || data.timestamp);

      return sessionAge > sessionTimeout || inactivityPeriod > activityTimeout;
    } catch (error) {
      console.warn('⚠️ Error checking session expiry:', error);
      return false;
    }
  }

  // Refresh session to extend validity
  refreshSession(): void {
    if (this.getToken()) {
      this.lastActivity = Date.now();
      this.preserveSession();
      console.log('🔄 Session refreshed');
    }
  }

  // Clear all tokens
  clearAllTokens(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('staffToken');
    localStorage.removeItem('candidateToken');
    localStorage.removeItem('staffProfile');
    console.log('🧹 All tokens cleared');
  }

  // Logout with session cleanup
  logout(): void {
    console.log('👋 Logging out user');

    // Clear all tokens and session data
    this.clearAllTokens();
    this.clearSessionData();

    // Stop session auto-save
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }

    // Redirect to login after a brief delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }

  // Clear session data
  private clearSessionData(): void {
    localStorage.removeItem('liorian_session_data');
    sessionStorage.removeItem('liorian_session_backup');
    console.log('🧹 Session data cleared');
  }

  // Get user info from token (simplified)
  getUserInfo(): { type: string; token: string } | null {
    const token = this.getToken();
    const type = this.getTokenType();
    
    if (!token || !type) return null;
    
    return { type, token };
  }

  // Initialize - called once on app start
  initialize(): void {
    console.log('🚀 AuthManager initialized with session persistence');

    // Attempt session recovery on app start
    this.recoverSession();

    const userInfo = this.getUserInfo();
    if (userInfo) {
      console.log(`👤 Found existing ${userInfo.type} session`);
      this.refreshSession(); // Refresh session on app start
    }

    // Setup periodic session validation
    this.setupPeriodicValidation();
  }

  // Setup periodic session validation
  private setupPeriodicValidation(): void {
    setInterval(() => {
      if (this.isAuthenticated() && this.isSessionExpired()) {
        console.log('⏰ Session expired during periodic check');
        this.logout();
      }
    }, 60000); // Check every minute
  }

  // Public method to handle page navigation
  handleNavigation(): void {
    console.log('🔄 Navigation detected - preserving session');
    this.refreshSession();
  }

  // Public method to get session status
  getSessionStatus(): {
    isAuthenticated: boolean;
    userType: string | null;
    timeRemaining: number | null;
    lastActivity: number;
  } {
    const isAuth = this.isAuthenticated();
    const userType = this.getTokenType();
    let timeRemaining = null;

    if (isAuth) {
      try {
        const sessionData = localStorage.getItem('liorian_session_data');
        if (sessionData) {
          const data = JSON.parse(sessionData);
          const now = Date.now();
          const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
          const sessionAge = now - data.timestamp;
          timeRemaining = Math.max(0, sessionTimeout - sessionAge);
        }
      } catch (error) {
        console.warn('Error getting session status:', error);
      }
    }

    return {
      isAuthenticated: isAuth,
      userType,
      timeRemaining,
      lastActivity: this.lastActivity
    };
  }
}

export default AuthManager;
