import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Instagram, LogIn, LogOut, User, Phone, Mail,
  MapPin, Clock, Star, Award, Users, GraduationCap
} from 'lucide-react';
import AuthManager from '../utils/authManager';

interface NavigationProps {
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
}

const ModernNavigation: React.FC<NavigationProps> = ({
  showSearchModal,
  setShowSearchModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, userType: null });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const authManager = AuthManager.getInstance();
    const checkAuthStatus = () => {
      const status = authManager.getSessionStatus();
      setAuthStatus({
        isAuthenticated: status.isAuthenticated,
        userType: status.userType
      });
    };

    // Check auth status on component mount
    checkAuthStatus();

    // Check auth status periodically to catch changes
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/blog', label: 'Blog' },
    { path: '/success-stories', label: 'Success Stories' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Top Info Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-premium-dark via-premium-bronze to-premium-gold text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 8148107347</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>liorian_technology@zohomail.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Sat: 9AM-7PM</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 text-white">
              <Star className="w-4 h-4" />
              <span className="font-semibold">100% Placement Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4" />
              <span>1000+ Students Placed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        {/* Mobile Header Content */}
        <div className="lg:hidden bg-gradient-to-r from-amber-50 to-orange-50 border-b border-premium-gold/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-premium-dark p-1 ring-2 ring-premium-gold/30 shadow-lg flex-shrink-0">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
                    alt="Liorian Technology Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xs sm:text-sm font-bold text-premium-dark leading-tight tracking-wide truncate">
                    LIORIAN TECH
                  </h1>
                  <p className="text-xs text-premium-dark/70 font-semibold truncate">
                    PRIVATE LIMITED
                  </p>
                </div>
              </Link>
              <div className="text-center bg-premium-gold/20 px-2 sm:px-3 py-1 rounded-full border border-premium-gold/50 flex-shrink-0">
                <h2 className="text-xs font-bold text-premium-dark whitespace-nowrap">
                  GET TRAINED, GET PLACED
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-gradient-to-r from-slate-50/95 via-amber-50/95 to-orange-50/95 border-b border-premium-gold/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-premium-dark p-1 ring-2 ring-premium-gold/30 shadow-lg">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
                    alt="Liorian Technology Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-premium-dark leading-tight tracking-wider">
                    LIORIAN TECHNOLOGY
                  </h1>
                  <p className="text-sm text-premium-dark/80 font-semibold tracking-wide">
                    PRIVATE LIMITED
                  </p>
                </div>
              </Link>
              
              <div className="text-center bg-premium-gold/10 px-8 py-3 rounded-full border border-premium-gold/50 shadow-lg">
                <h2 className="text-lg font-bold text-premium-dark flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  GET TRAINED, GET PLACED
                  <Award className="w-5 h-5" />
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-premium-dark hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-premium-gold text-premium-dark shadow-md'
                      : 'text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 rounded-lg text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/liorian_technology?igsh=MWptb2h6ZDhwcXI5Zw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              {/* Auth Button */}
              {authStatus.isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={authStatus.userType === 'admin' ? '/admin-dashboard' :
                        authStatus.userType === 'staff' ? '/staff-dashboard' :
                        '/enhanced-candidate-dashboard'}
                    className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[44px] text-sm sm:text-base"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{authStatus.userType?.toUpperCase()} Dashboard</span>
                    <span className="sm:hidden">Dash</span>
                  </Link>
                  <button
                    onClick={() => {
                      const authManager = AuthManager.getInstance();
                      authManager.logout();
                    }}
                    className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[44px] text-sm"
                    title="Logout"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-premium-gold to-premium-bronze text-premium-dark px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[44px] text-sm sm:text-base"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Log</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] flex items-center ${
                      isActive(link.path)
                        ? 'bg-premium-gold text-premium-dark'
                        : 'text-gray-700 hover:text-premium-gold hover:bg-premium-gold/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Auth Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {authStatus.isAuthenticated ? (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-green-600 font-medium">
                      <User className="w-4 h-4" />
                      <span>Logged in as {authStatus.userType?.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={authStatus.userType === 'admin' ? '/admin-dashboard' :
                            authStatus.userType === 'staff' ? '/staff-dashboard' :
                            '/enhanced-candidate-dashboard'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          const authManager = AuthManager.getInstance();
                          authManager.logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-premium-gold to-premium-bronze text-premium-dark px-4 py-3 rounded-lg font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 text-premium-gold" />
                    <span>+91 8148107347</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4 text-premium-gold" />
                    <span>liorian_technology@zohomail.in</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4 text-premium-gold" />
                    <span>Mon-Sat: 9AM-7PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default ModernNavigation;
