import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, User, Settings, LogOut, Bell, Search, 
  BarChart3, Users, GraduationCap, BookOpen, Shield, Menu, X
} from 'lucide-react';
import AuthManager from '../utils/authManager';

interface DashboardNavigationProps {
  userType?: 'admin' | 'staff' | 'candidate';
  userName?: string;
  showSearchModal?: (show: boolean) => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  userType = 'admin',
  userName = 'User',
  showSearchModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const authManager = AuthManager.getInstance();
      await authManager.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login');
    }
  };

  const handleBackToDashboard = () => {
    switch (userType) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'staff':
        navigate('/staff-dashboard');
        break;
      case 'candidate':
        navigate('/enhanced-candidate-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Get navigation links based on user type
  const getNavigationLinks = () => {
    switch (userType) {
      case 'admin':
        return [
          { path: '/admin-dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/user-management', label: 'Users', icon: Users },
          { path: '/admin-course-management', label: 'Courses', icon: GraduationCap },
          { path: '/module-management', label: 'Modules', icon: BookOpen },
          { path: '/blog-management', label: 'Blog', icon: BookOpen },
        ];
      case 'staff':
        return [
          { path: '/staff-dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/module-management', label: 'Modules', icon: BookOpen },
          { path: '/training-dashboard', label: 'Training', icon: GraduationCap },
        ];
      case 'candidate':
        return [
          { path: '/enhanced-candidate-dashboard', label: 'Dashboard', icon: BarChart3 },
          { path: '/candidate-training', label: 'My Training', icon: GraduationCap },
        ];
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <>
      {/* Dashboard Navigation Bar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Back button and Logo */}
            <div className="flex items-center space-x-4">
              {/* Back button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 rounded-lg text-gray-600 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleBackToHome}
                  className="p-2 rounded-lg text-gray-600 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Back to Home"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>

              {/* Logo and Brand */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-premium-dark p-1 ring-2 ring-premium-gold/30 shadow-lg group-hover:ring-premium-gold/50 transition-all">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
                    alt="Liorian Technology Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-premium-dark leading-tight tracking-wide">
                    LIORIAN TECH
                  </h1>
                  <p className="text-xs text-premium-dark/70 font-semibold">
                    {userType?.toUpperCase() || 'USER'} DASHBOARD
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-premium-gold text-premium-dark shadow-md'
                        : 'text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right section - User info and actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              {typeof showSearchModal === 'function' && (
                <button
                  onClick={() => showSearchModal(true)}
                  className="p-2 rounded-lg text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Notifications */}
              <button
                onClick={() => {
                  alert('🔔 Notifications feature coming soon!');
                }}
                className="p-2 rounded-lg text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-2 bg-premium-gold/10 px-3 py-2 rounded-full border border-premium-gold/30">
                <User className="w-4 h-4 text-premium-gold" />
                <span className="text-sm font-medium text-premium-dark">{userName}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[44px] text-sm"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Mobile User Info */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-premium-gold/10 rounded-lg border border-premium-gold/30">
                <User className="w-6 h-6 text-premium-gold" />
                <div>
                  <div className="font-medium text-premium-dark">{userName}</div>
                  <div className="text-sm text-premium-dark/70 capitalize">{userType || 'user'} Dashboard</div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-4">
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] ${
                        isActive(link.path)
                          ? 'bg-premium-gold text-premium-dark'
                          : 'text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Back Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    handleBackToDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-premium-gold/20 text-premium-dark rounded-lg font-medium touch-manipulation min-h-[44px] flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleBackToHome();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium touch-manipulation min-h-[44px] flex-1"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default DashboardNavigation;
