import React from 'react';
import { useSessionManager } from '../hooks/useSessionManager';

interface SessionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const SessionStatus: React.FC<SessionStatusProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  const { sessionStatus, refreshSession, getTimeRemaining } = useSessionManager();

  if (!sessionStatus.isAuthenticated) {
    return null;
  }

  const timeInfo = getTimeRemaining();
  const isExpiringSoon = timeInfo && timeInfo.total < 30 * 60 * 1000; // 30 minutes

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isExpiringSoon ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
        }`}></div>
        
        {showDetails ? (
          <div className="text-sm">
            <div className="font-medium">
              {sessionStatus.userType?.toUpperCase()} Session
            </div>
            {timeInfo && (
              <div className={`text-xs ${isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}`}>
                {timeInfo.hours}h {timeInfo.minutes}m remaining
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium">
            {sessionStatus.userType?.toUpperCase()}
          </span>
        )}
      </div>

      {isExpiringSoon && (
        <button
          onClick={refreshSession}
          className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
          title="Extend session"
        >
          Extend
        </button>
      )}
    </div>
  );
};

export default SessionStatus;
