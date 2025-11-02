// Simple, reliable authentication system - no session expiry kicks
export class SimpleAuth {
  private static instance: SimpleAuth;

  private constructor() {}

  public static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth();
    }
    return SimpleAuth.instance;
  }

  // Simple login - no aggressive session management
  login(userType: string, userData: any): void {
    try {
      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('userType', userType);
      localStorage.setItem('authToken', `${userType}_${Date.now()}`);
      localStorage.setItem('loginTime', new Date().toISOString());
      
      console.log('✅ Login successful:', userType);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  // Check if user is logged in - no expiry checks
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('authToken');
      const userType = localStorage.getItem('userType');
      return !!(token && userType);
    } catch (error) {
      return false;
    }
  }

  // Get current user data
  getCurrentUser(): any {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Get user type
  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  // Simple logout
  logout(): void {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userType');
      localStorage.removeItem('authToken');
      localStorage.removeItem('loginTime');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Initialize - no aggressive checks
  initialize(): void {
    // Just log current status, no auto-logout
    const isAuth = this.isAuthenticated();
    console.log('Auth initialized:', isAuth ? 'Authenticated' : 'Not authenticated');
  }
}

export default SimpleAuth;
