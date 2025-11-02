import React, { useEffect, useState, useCallback } from 'react';
import AuthManager from '../utils/authManager';

interface SessionStatus {
  isAuthenticated: boolean;
  userType: string | null;
  timeRemaining: number | null;
  lastActivity: number;
}

export const useSessionManager = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isAuthenticated: false,
    userType: null,
    timeRemaining: null,
    lastActivity: Date.now()
  });

  const authManager = AuthManager.getInstance();

  // Update session status
  const updateSessionStatus = useCallback(() => {
    const status = authManager.getSessionStatus();
    setSessionStatus(status);
  }, [authManager]);

  // Handle user activity to refresh session
  const handleActivity = useCallback(() => {
    authManager.refreshSession();
    updateSessionStatus();
  }, [authManager, updateSessionStatus]);

  // Handle navigation events
  const handleNavigation = useCallback(() => {
    authManager.handleNavigation();
    updateSessionStatus();
  }, [authManager, updateSessionStatus]);

  useEffect(() => {
    // Initialize session manager
    authManager.initialize();
    updateSessionStatus();

    // Setup activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Setup navigation listeners
    window.addEventListener('beforeunload', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    
    // Setup periodic status updates
    const interval = setInterval(updateSessionStatus, 30000);

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      window.removeEventListener('beforeunload', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
      
      clearInterval(interval);
    };
  }, [authManager, handleActivity, handleNavigation, updateSessionStatus]);

  const refreshSession = useCallback(() => {
    authManager.refreshSession();
    updateSessionStatus();
  }, [authManager, updateSessionStatus]);

  const logout = useCallback(() => {
    authManager.logout();
  }, [authManager]);

  const getTimeRemaining = useCallback(() => {
    if (!sessionStatus.timeRemaining) return null;
    
    const hours = Math.floor(sessionStatus.timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((sessionStatus.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, total: sessionStatus.timeRemaining };
  }, [sessionStatus.timeRemaining]);

  return {
    sessionStatus,
    refreshSession,
    logout,
    getTimeRemaining,
    isAuthenticated: sessionStatus.isAuthenticated,
    userType: sessionStatus.userType
  };
};

export const SessionRecovery: React.FC = () => {
  const { sessionStatus, refreshSession } = useSessionManager();
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStatus.timeRemaining && sessionStatus.timeRemaining < 15 * 60 * 1000) {
      setShowWarning(true);
      setDismissed(false); // Reset dismissed when warning should show
    } else {
      setShowWarning(false);
    }
  }, [sessionStatus.timeRemaining]);

  if (!showWarning || !sessionStatus.isAuthenticated || dismissed) return null;

  const timeLeft = sessionStatus.timeRemaining ? Math.ceil(sessionStatus.timeRemaining / (1000 * 60)) : 0;

  return (
    <div className="fixed top-20 right-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg shadow-lg z-40 max-w-xs sm:max-w-sm">
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">⏰</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-yellow-800 text-sm">Session Expiring Soon</div>
          <div className="text-xs text-yellow-700 mt-1 line-clamp-1">
            Expires in {timeLeft} minutes
          </div>
          <button
            onClick={refreshSession}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors touch-manipulation"
          >
            Extend
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-800 text-lg leading-none p-1 -mt-1 -mr-1 touch-manipulation"
        >
          ×
        </button>
      </div>
    </div>
  );
};
