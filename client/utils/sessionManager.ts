// Session Management Utility for handling automatic logout and session validation

interface SessionConfig {
  sessionTimeout: number; // in milliseconds
  warningTime: number; // in milliseconds before logout
  checkInterval: number; // in milliseconds
}

class SessionManager {
  private static instance: SessionManager;
  private config: SessionConfig = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    checkInterval: 60 * 1000, // Check every minute
  };

  private sessionTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private isWarningShown: boolean = false;
  private endpointsAvailable: boolean = true; // Track if auth endpoints are working

  private activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  private constructor() {
    this.bindActivityListeners();
    this.startSessionCheck();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private bindActivityListeners(): void {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  private handleActivity(): void {
    this.lastActivity = Date.now();
    this.isWarningShown = false;
    this.resetTimers();
  }

  private resetTimers(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
    this.startSessionTimers();
  }

  private startSessionTimers(): void {
    // Warning timer
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.config.sessionTimeout - this.config.warningTime);

    // Logout timer
    this.sessionTimer = setTimeout(() => {
      this.forceLogout();
    }, this.config.sessionTimeout);
  }

  private showWarning(): void {
    if (this.isWarningShown) return;
    
    this.isWarningShown = true;
    const remainingTime = Math.ceil(this.config.warningTime / 1000 / 60);
    
    const shouldExtend = confirm(
      `Your session will expire in ${remainingTime} minutes due to inactivity. Do you want to extend your session?`
    );
    
    if (shouldExtend) {
      this.extendSession();
    }
  }

  private extendSession(): void {
    this.lastActivity = Date.now();
    this.isWarningShown = false;
    this.resetTimers();
    
    // Optional: Make a keep-alive request to the server
    this.sendKeepAlive();
  }

  private async sendKeepAlive(): Promise<void> {
    const token = this.getAuthToken();
    if (!token || !this.endpointsAvailable) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for keep-alive

      const response = await fetch('/api/auth/keep-alive', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok && response.status === 404) {
        console.log('Keep-alive endpoint not found - disabling keep-alive');
        this.endpointsAvailable = false;
      }
    } catch (error) {
      // Improved error handling for keep-alive requests
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Keep-alive timeout - server response slow');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          console.log('Keep-alive network error - continuing without keep-alive');
          this.endpointsAvailable = false; // Disable if fetch fails
        } else {
          console.log('Keep-alive error:', error.message);
        }
      } else {
        console.log('Unknown keep-alive error:', error);
      }
      // Don't break the application on keep-alive failures
    }
  }

  private forceLogout(): void {
    this.cleanup();
    this.clearAllTokens();
    
    // Show logout message
    alert('Your session has expired due to inactivity. You will be redirected to the login page.');
    
    // Redirect to login
    window.location.href = '/login';
  }

  private startSessionCheck(): void {
    // Temporarily disable aggressive session checking to fix immediate logout
    console.log('Session validation temporarily disabled for login testing');

    // Basic timeout check only (no server validation)
    setInterval(() => {
      const timeSinceActivity = Date.now() - this.lastActivity;
      if (timeSinceActivity > this.config.sessionTimeout && this.getAuthToken()) {
        console.log('Session timeout reached after', this.config.sessionTimeout / 60000, 'minutes of inactivity');
        this.forceLogout();
      }
    }, 60000); // Check only once per minute
  }

  private async validateSession(): Promise<void> {
    const token = this.getAuthToken();

    if (!token || !this.endpointsAvailable) {
      return; // Don't validate if no token or endpoints unavailable
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Session expired - logging out');
          this.forceLogout();
        } else if (response.status === 404) {
          console.log('Auth endpoint not found - disabling session validation');
          this.endpointsAvailable = false;
        }
      }
    } catch (error) {
      // Improved error handling to prevent TypeError from breaking the app
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Session validation timeout - server may be unavailable');
          this.endpointsAvailable = false; // Disable if repeatedly timing out
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          console.log('Session validation network error - disabling validation temporarily');
          this.endpointsAvailable = false; // Disable validation if fetch fails
        } else {
          console.log('Session validation error:', error.message);
        }
      } else {
        console.log('Unknown session validation error:', error);
      }
      // Don't force logout on network errors - user can continue working offline
    }
  }

  private getAuthToken(): string | null {
    const adminToken = localStorage.getItem('adminToken');
    const staffToken = localStorage.getItem('staffToken');
    const candidateToken = localStorage.getItem('candidateToken');
    
    return adminToken || staffToken || candidateToken;
  }

  private clearAllTokens(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('staffToken');
    localStorage.removeItem('candidateToken');
    localStorage.removeItem('staffProfile');
  }

  private cleanup(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
    
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  // Public methods
  public initialize(): void {
    const token = this.getAuthToken();
    if (token) {
      this.handleActivity(); // Start tracking
    }
  }

  public logout(): void {
    this.cleanup();
    this.clearAllTokens();
    window.location.href = '/login';
  }

  public updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.resetTimers();
  }
}

export default SessionManager;
