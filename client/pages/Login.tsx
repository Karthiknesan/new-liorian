import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Mail, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import ModernNavigation from "../components/ModernNavigation";
import SimpleAuth from "../utils/simpleAuth";

export default function Login() {
  const [activeTab, setActiveTab] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const navigate = useNavigate();

  // Clear form when tab changes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  }, [activeTab]);

  // Pre-filled demo credentials
  const demoCredentials = {
    admin: { email: "admin@liorian.com", password: "LiorianAdmin@2024#Secure" },
    staff: { email: "hr@liorian.com", password: "LiorianHR@2024#Manager" },
    candidate: { email: "john.doe@email.com", password: "JohnSecure@2024#Dev" }
  };

  const handleDemoFill = () => {
    const creds = demoCredentials[activeTab as keyof typeof demoCredentials];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simple credential validation
      const validCreds = {
        admin: [
          { email: "admin@liorian.com", password: "LiorianAdmin@2024#Secure" },
          { email: "superadmin@liorian.tech", password: "SuperLiorian@2024#Management!" }
        ],
        staff: [
          { email: "hr@liorian.com", password: "LiorianHR@2024#Manager" },
          { email: "placement@liorian.com", password: "LiorianPlace@2024#Coord" },
          { email: "training@liorian.com", password: "LiorianTrain@2024#Expert" }
        ],
        candidate: [
          { email: "john.doe@email.com", password: "JohnSecure@2024#Dev" },
          { email: "sarah.smith@email.com", password: "SarahAnalyst@2024#Pro" },
          { email: "mike.j@email.com", password: "MikeCyber@2024#Expert" }
        ]
      };

      const userType = activeTab as keyof typeof validCreds;
      const isValid = validCreds[userType].some(
        cred => cred.email === email && cred.password === password
      );

      if (!isValid) {
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      // Create user session data
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: userType,
        loginTime: new Date().toISOString()
      };

      // Use simple auth - no session expiry
      const auth = SimpleAuth.getInstance();
      auth.login(userType, userData);

      setSuccess("Login successful! Redirecting...");

      // Redirect after short delay
      setTimeout(() => {
        switch (userType) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'staff':
            navigate('/staff-dashboard');
            break;
          case 'candidate':
            navigate('/candidate-dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1500);

    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "candidate", label: "Student", icon: "🎓", description: "Access your courses and progress" },
    { id: "staff", label: "Staff", icon: "👨‍💼", description: "Manage students and courses" },
    { id: "admin", label: "Admin", icon: "🔧", description: "Full system administration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-light via-white to-premium-light">
      <ModernNavigation
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      <div className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 premium-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-premium-dark mb-2">Welcome Back</h1>
            <p className="text-premium-dark/70">Sign in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-premium-gold/20">

            {/* Tabs */}
            <div className="border-b border-premium-gold/20">
              <div className="grid grid-cols-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-4 text-center transition-all duration-300 ${
                      activeTab === tab.id
                        ? "premium-gradient text-white"
                        : "text-premium-dark/60 hover:bg-premium-light"
                    }`}
                  >
                    <div className="text-2xl mb-1">{tab.icon}</div>
                    <div className="font-medium text-sm">{tab.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Tab Description */}
            <div className="p-4 bg-gradient-to-r from-premium-gold/10 to-premium-bronze/10 border-b border-premium-gold/20">
              <p className="text-sm text-premium-dark text-center">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-6 space-y-6">

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-premium-gold/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-premium-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-premium-gold/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Demo Button */}
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full py-2 px-4 border border-premium-gold/50 rounded-lg text-premium-dark hover:bg-premium-light transition-colors text-sm font-medium"
              >
                Use Demo Credentials
              </button>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full premium-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <Link
                  to="/contact"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </Link>
                <div className="text-sm text-premium-dark/60">
                  New student? <Link to="/contact" className="text-primary hover:text-primary/80 font-medium">Contact us to enroll</Link>
                </div>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-premium-dark/60">
              Having trouble signing in? Contact our support team.
            </p>
            <Link
              to="/"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              ← Back to Home
            </Link>
            <p className="text-xs text-premium-dark/50 pt-2">
              Powered by <span className="font-semibold text-primary">FORGE INDIA CONNECT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
