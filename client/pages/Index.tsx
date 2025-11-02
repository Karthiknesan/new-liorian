import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EnhancedApplicationModal from "../components/EnhancedApplicationModal";
import FAQ from "../components/FAQ";
import SEOStructuredData from "../components/SEOStructuredData";
import SEOHead from "../components/SEOHead";
import ModernNavigation from "../components/ModernNavigation";
import ContentManager from "../utils/contentManager";
import SimpleAuth from "../utils/simpleAuth";
import { SessionRecovery } from "../hooks/useSessionManager";


export default function Index() {

  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);


  // Candidate login states
  const [candidateLoginError, setCandidateLoginError] = useState("");
  const [isCandidateLoggingIn, setIsCandidateLoggingIn] = useState(false);
  const [candidateLoginSuccess, setCandidateLoginSuccess] = useState(false);

  // Course application states
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showApplicationPopup, setShowApplicationPopup] = useState(false);

  // Staff login states (for navigation login modal)
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffLoginError, setStaffLoginError] = useState("");
  const [isStaffLoggingIn, setIsStaffLoggingIn] = useState(false);
  const [staffLoginSuccess, setStaffLoginSuccess] = useState(false);

  // Enhanced application modal state
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribingNewsletter, setIsSubscribingNewsletter] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Content management
  const [courses, setCourses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const contentManager = ContentManager.getInstance();

  // Authentication state
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const auth = SimpleAuth.getInstance();

  // Load content data and subscribe to changes
  useEffect(() => {
    contentManager.loadFromStorage();
    setCourses(contentManager.getCourses());
    setServices(contentManager.getServices());

    // Subscribe to content changes
    const unsubscribe = contentManager.subscribe(() => {
      setCourses(contentManager.getCourses());
      setServices(contentManager.getServices());
    });

    return unsubscribe;
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth = auth.isAuthenticated();
      setIsUserLoggedIn(isAuth);
    };

    // Check on mount
    checkAuthStatus();

    // Check more frequently for auth changes (every 2 seconds)
    const interval = setInterval(checkAuthStatus, 2000);

    // Also listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const loginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/candidates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail: loginData.email,
          candidatePassword: loginData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        setLoginError("");
        localStorage.setItem("candidateToken", result.token);
        localStorage.setItem("candidateData", JSON.stringify(result.candidate));
        setTimeout(() => {
          window.location.href = "/candidate-dashboard";
        }, 1500);
      } else {
        setLoginError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCandidateLoggingIn(true);
    setCandidateLoginError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const loginData = {
      email: formData.get("candidateEmail") as string,
      password: formData.get("candidatePassword") as string,
    };

    try {
      const response = await fetch("/api/candidates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail: loginData.email,
          candidatePassword: loginData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCandidateLoginSuccess(true);
        setCandidateLoginError("");
        localStorage.setItem("candidateToken", result.token);
        localStorage.setItem("candidateData", JSON.stringify(result.candidate));
        setTimeout(() => {
          window.location.href = "/candidate-dashboard";
        }, 1500);
      } else {
        setCandidateLoginError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setCandidateLoginError("Network error. Please try again.");
    } finally {
      setIsCandidateLoggingIn(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStaffLoggingIn(true);
    setStaffLoginError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const loginData = {
      email: formData.get("staffEmail") as string,
      password: formData.get("staffPassword") as string,
    };

    try {
      const response = await fetch("/api/staff-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffEmail: loginData.email,
          staffPassword: loginData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStaffLoginSuccess(true);
        setStaffLoginError("");
        localStorage.setItem("staffToken", result.token);
        localStorage.setItem("staffData", JSON.stringify(result.user));
        setTimeout(() => {
          window.location.href = "/admin-dashboard";
        }, 1500);
      } else {
        setStaffLoginError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setStaffLoginError("Network error. Please try again.");
    } finally {
      setIsStaffLoggingIn(false);
    }
  };

  const handleCourseApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingApplication(true);
    setApplicationMessage(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const applicationData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      course: formData.get("course") as string,
      option: formData.get("option") as string,
      message: formData.get("message") as string || "",
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...applicationData,
          uploadToS3: true,
          metadata: {
            source: "website_form",
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setApplicationMessage({
          type: 'success',
          text: 'Your application has been submitted and saved to our secure cloud storage! We will contact you within 24 hours.'
        });
        setShowApplicationPopup(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setApplicationMessage({
          type: 'error',
          text: result.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      setApplicationMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribingNewsletter(true);
    setNewsletterMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          offers: true,
          source: 'website'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewsletterMessage({
          type: 'success',
          text: 'Successfully subscribed! You\'ll receive updates about new courses and offers.'
        });
        setNewsletterEmail('');
      } else {
        setNewsletterMessage({
          type: 'error',
          text: result.message || 'Failed to subscribe. Please try again.'
        });
      }
    } catch (error) {
      setNewsletterMessage({
        type: 'error',
        text: 'Failed to subscribe. Please check your connection and try again.'
      });
    } finally {
      setIsSubscribingNewsletter(false);
      // Clear message after 5 seconds
      setTimeout(() => setNewsletterMessage(null), 5000);
    }
  };

  const handleEnhancedApplicationSubmit = async (formData: any) => {
    setIsSubmittingApplication(true);
    setApplicationMessage(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uploadToS3: true,
          metadata: {
            source: "enhanced_modal",
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setApplicationMessage({
          type: 'success',
          text: 'Your application has been submitted successfully! We will contact you within 24 hours to discuss your learning journey.'
        });
        setShowApplicationPopup(true);
      } else {
        setApplicationMessage({
          type: 'error',
          text: result.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      setApplicationMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Liorian Technology Private Limited",
        "url": "https://liorian-technology.com",
        "logo": "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
      },
      {
        "@type": "WebSite",
        "name": "Liorian Technology",
        "url": "https://liorian-technology.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://liorian-technology.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Liorian Technology - Get Trained, Get Placed | 100% Job Placement Guarantee"
        description="Transform your career with Liorian Technology's professional IT training programs in Bangalore. 100% placement guarantee with expert instructors and hands-on projects in Cloud Computing, Data Science, Cybersecurity, Full Stack Development, and more."
        keywords="IT training Bangalore, job placement guarantee, Python developer course, Java developer training, cloud computing AWS Azure, data science machine learning, cybersecurity ethical hacking, DevOps engineer course, full stack development, career transformation, professional certification, coding bootcamp India"
        url="https://liorian-technology.com"
        image="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=1200"
        structuredData={homepageStructuredData}
      />
      <SEOStructuredData type="organization" />
      <SEOStructuredData type="educational" />
      <SEOStructuredData type="website" />
      <SessionRecovery />
      <div className="min-h-screen bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold overflow-x-hidden">
      {/* Modern Navigation */}
      <ModernNavigation
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />



      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 text-white text-center flex items-center justify-center" style={{ minHeight: '730px' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-white bg-gradient-to-r from-white via-premium-gold to-premium-bronze bg-clip-text text-transparent mb-2">
                  Transform Your Career
                </span>
                <span className="block text-premium-gold text-shadow-lg">
                  Get Trained, Get Placed
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-shadow leading-relaxed px-4">
                Professional IT training with <strong className="text-premium-gold">100% placement guarantee</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 sm:px-0">
              <Link to="/services" className="premium-gradient text-premium-dark px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 premium-hover text-shadow-sm min-w-[200px] text-center">
                Explore Services
              </Link>
              <button
                onClick={() => {
                  const applicationSection = document.getElementById('application-form');
                  if (applicationSection) {
                    applicationSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="glass-effect border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-premium-dark px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 premium-hover min-w-[200px]"
              >
                Apply for Course
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Professional Services Overview - Hidden when user is logged in */}
      {!isUserLoggedIn && (
        <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Professional Training Programs
            </h2>
            <p className="text-premium-dark/80 text-base md:text-lg max-w-3xl mx-auto">
              Industry-leading courses designed to make you job-ready with expert mentorship and hands-on projects
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {courses.map((course) => (
              <div key={course.id} className="glass-effect border-l-4 border-premium-gold p-6 md:p-8 rounded-2xl premium-hover">
                <div className="text-4xl mb-4">{course.icon || '🎓'}</div>
                <h3 className="text-xl md:text-2xl font-bold text-premium-dark mb-4">{course.name}</h3>
                <p className="text-premium-dark/80 mb-4 leading-relaxed text-sm md:text-base line-clamp-3">{course.description}</p>
                <div className="text-xs text-premium-bronze mb-6 font-semibold">Duration: {course.duration}</div>
                <Link to={course.link || "/services"} className="premium-gradient text-premium-dark px-4 md:px-6 py-2 md:py-3 rounded-full font-bold transition-all duration-300 premium-hover inline-block text-sm md:text-base">
                  Learn More
                </Link>
              </div>
            ))}

            {/* Show message if no courses */}
            {courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">�����</div>
                <h3 className="text-xl text-premium-dark/60 mb-2">No courses available yet</h3>
                <p className="text-premium-dark/40">Check back soon for exciting new training programs!</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="premium-gradient text-premium-dark px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 premium-hover inline-block">
              View All {courses.length} Premium Courses
            </Link>
          </div>
        </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className={`bg-gradient-to-br from-premium-light to-white ${isUserLoggedIn ? 'py-24 md:py-32' : 'py-16 md:py-20'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6">
            Why Choose Liorian Technology
          </h2>
          <p className="text-center text-premium-dark/80 mb-12 text-base md:text-lg max-w-3xl mx-auto">
            Your success is our commitment. Here's what makes us different
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8 glass-effect rounded-2xl premium-hover border border-premium-gold/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl">
                💰
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">100% Money-Back Guarantee</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                If you don't get placed after our program, we'll refund your entire fee. Your success is guaranteed.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 glass-effect rounded-2xl premium-hover border border-premium-gold/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl">
                👩‍🏫
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Expert Mentorship</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Get personalized guidance from industry experts who understand your career goals and challenges.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 glass-effect rounded-2xl premium-hover border border-premium-gold/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl">
                🏆
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">100% Placement Record</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Over 1000+ successful placements with top companies. Join our growing family of professionals.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 glass-effect rounded-2xl premium-hover border border-premium-gold/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl">
                🚀
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Career Transformation</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                From training to placement, we guide you through every step of your career transformation journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6">
            Your Learning Journey
          </h2>
          <p className="text-center text-premium-dark/80 mb-12 text-base md:text-lg max-w-3xl mx-auto">
            Our structured approach ensures your success from enrollment to placement
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-6 glass-effect rounded-2xl border border-premium-gold/20 premium-hover">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl font-bold text-premium-dark">
                1
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Apply & Enroll</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Submit your application and join our comprehensive training program with personalized learning plans
              </p>
            </div>

            <div className="text-center p-6 glass-effect rounded-2xl border border-premium-gold/20 premium-hover">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl font-bold text-premium-dark">
                2
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Intensive Training</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Learn from industry experts with hands-on projects, real-world scenarios, and practical experience
              </p>
            </div>

            <div className="text-center p-6 glass-effect rounded-2xl border border-premium-gold/20 premium-hover">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl font-bold text-premium-dark">
                3
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Skill Certification</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Build your portfolio, get certified, and prepare for interviews with mock sessions and feedback
              </p>
            </div>

            <div className="text-center p-6 glass-effect rounded-2xl border border-premium-gold/20 premium-hover">
              <div className="w-16 h-16 mx-auto mb-6 bg-premium-gradient rounded-full flex items-center justify-center text-2xl font-bold text-premium-dark">
                4
              </div>
              <h3 className="text-lg md:text-xl font-bold text-premium-dark mb-4">Job Placement</h3>
              <p className="text-premium-dark/80 leading-relaxed text-sm md:text-base">
                Get placed in top companies with our extensive network and dedicated placement support team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-shadow-lg">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-shadow leading-relaxed">
            Join thousands of successful graduates who transformed their careers with us
          </p>
          
          <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-900/30 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-2">🚀 Start Your Learning Journey Today</h3>
            <p className="text-gray-300 mb-4">
              Explore detailed weekly curriculum and apply with confidence
            </p>
            <button 
              onClick={() => setShowEnhancedModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Explore Weekly Learning Journey
            </button>
            <p className="text-gray-500 text-sm mt-2">View detailed curriculum and apply with confidence</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
            <Link to="/services" className="premium-gradient text-premium-dark px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 premium-hover text-shadow-sm">
              View All Courses
            </Link>
            <Link to="/contact" className="glass-effect border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-premium-dark px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 premium-hover">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Course Application Section */}
      <section id="application-form" className="py-16 md:py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-4">Apply for Course</h2>
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">Start your journey towards a successful tech career. Submit your application today!</p>
          
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowEnhancedModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Explore Weekly Learning Journey
            </button>
            <p className="text-gray-500 text-sm mt-2">View detailed curriculum and apply with confidence</p>
          </div>

          <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border">
            <form onSubmit={handleCourseApplication} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Full Name *</label>
                  <input type="text" name="name" required className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm md:text-base" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Email Address *</label>
                  <input type="email" name="email" required className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm md:text-base" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Phone Number *</label>
                  <input type="tel" name="phone" required className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm md:text-base" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Select Course *</label>
                  <select name="course" required className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm md:text-base">
                    <option value="">Choose a course...</option>
                    <option value="cloud-computing">☁️ Cloud Computing</option>
                    <option value="data-analyst">���� Data Analyst</option>
                    <option value="data-scientist">🔬 Data Scientist</option>
                    <option value="cybersecurity">🔐 Cybersecurity</option>
                    <option value="devops">⚙️ DevOps</option>
                    <option value="python-fullstack">🐍 Python Fullstack Developer</option>
                    <option value="java-fullstack">☕ Java Fullstack Developer</option>
                    <option value="banking-finance">🏦 Banking & Finance Training</option>
                    <option value="digital-marketing">📱 Digital Marketing</option>
                    <option value="business-analytics">📈 Business Analytics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Choose Your Option *</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="option" value="training" required className="mr-2" />
                    <span className="text-sm md:text-base">Training + Placement (Complete Program)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="option" value="placement" required className="mr-2" />
                    <span className="text-sm md:text-base">Placement Only (For Skilled Professionals)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">Tell us about yourself</label>
                <textarea name="message" rows={4} placeholder="Tell us about your background and career goals..." className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-sm md:text-base"></textarea>
              </div>

              <button type="submit" disabled={isSubmittingApplication} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 md:py-4 px-6 rounded-lg font-bold text-base md:text-lg transition-colors duration-300 flex items-center justify-center gap-2">
                {isSubmittingApplication ? (
                  <>
                    <div className="w-5 md:w-6 h-5 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>

            {applicationMessage && (
              <div className={`mt-6 p-4 rounded-lg ${applicationMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl">{applicationMessage.type === 'success' ? '✅' : '⚠️'}</span>
                  <div>
                    <div className="font-bold text-base md:text-lg">{applicationMessage.type === 'success' ? 'Application Submitted!' : 'Submission Error'}</div>
                    <div className="mt-1 text-sm md:text-base">{applicationMessage.text}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Staff Login Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Staff Login Portal</h3>
              <button
                onClick={() => setShowStaffModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Staff Login Form */}
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Staff Email
                  </label>
                  <input
                    type="email"
                    name="staffEmail"
                    placeholder="Enter your staff email"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    name="staffPassword"
                    placeholder="Enter your password"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm"
                    required
                  />
                </div>
                {staffLoginError && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{staffLoginError}</span>
                    </div>
                  </div>
                )}

                {staffLoginSuccess && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Login successful! Redirecting to dashboard...</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isStaffLoggingIn}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-3 px-6 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isStaffLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </>
                  ) : (
                    "Login as Staff"
                  )}
                </button>
              </form>

              {/* Staff Access Levels */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-lg font-bold text-purple-800 mb-3">���� Staff Access Levels</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Administrator:</span>
                    <span className="text-purple-700">Full Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Instructor:</span>
                    <span className="text-purple-700">Course Management</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Placement Officer:</span>
                    <span className="text-purple-700">Student Placement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Success Popup */}
      {showApplicationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Received!</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                Thank you for applying! We have received your application and it has been saved to our secure system.
                <span className="text-green-600 font-semibold"> We will call you within 2 days</span> to discuss the next steps.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-800 mb-2">What happens next?</h4>
                <ul className="text-left text-green-700 text-sm space-y-1">
                  <li>✅ Application review (24 hours)</li>
                  <li>📞 Personal consultation call</li>
                  <li>📋 Course enrollment process</li>
                  <li>🚀 Start your learning journey</li>
                </ul>
              </div>
              <button
                onClick={() => setShowApplicationPopup(false)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-premium-dark text-premium-gold py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Footer Main Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-premium-gold/10 p-1 ring-1 ring-premium-gold/20">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
                    alt="Liorian Technology Lion Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <h3 className="text-lg font-bold">LIORIAN TECHNOLOGY</h3>
              </div>
              <p className="text-premium-gold/80 text-sm leading-relaxed">
                Empowering careers through professional technology training and guaranteed job placement.
                Transform your future with industry-expert guidance.
              </p>
              <div className="space-y-2 text-sm">
                <a href="tel:8148107347" className="text-premium-gold/90 hover:text-premium-gold transition-colors block">�� 8148107347</a>
                <a href="mailto:liorian_technology@zohomail.in" className="text-premium-gold/90 hover:text-premium-gold transition-colors block">📧 liorian_technology@zohomail.in</a>
                <p className="text-premium-gold/90">🕒 Mon-Sat: 9AM-7PM</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-premium-gold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-premium-gold/80 hover:text-premium-gold transition-colors">About Us</Link></li>
                <li><Link to="/services" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Our Services</Link></li>

                <li><Link to="/success-stories" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Success Stories</Link></li>
                <li><Link to="/contact" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Contact Us</Link></li>
                <li><Link to="/login" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Student Login</Link></li>
              </ul>
            </div>

            {/* Training Programs */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-premium-gold">Training Programs</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-premium-gold/80">��️ Cloud Computing</span></li>
                <li><span className="text-premium-gold/80">📊 Data Analytics</span></li>
                <li><span className="text-premium-gold/80">🔬 Data Science</span></li>
                <li><span className="text-premium-gold/80">🔐 Cybersecurity</span></li>
                <li><span className="text-premium-gold/80">⚙️ DevOps</span></li>
                <li><span className="text-premium-gold/80">🐍 Python Development</span></li>
                <li><span className="text-premium-gold/80">��� Java Development</span></li>
                <li><Link to="/services" className="text-premium-gold hover:text-white transition-colors font-semibold">View All Courses →</Link></li>
              </ul>
            </div>

            {/* Services & Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-premium-gold">Services & Support</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-premium-gold/80">🎓 Training Programs</span></li>
                <li><span className="text-premium-gold/80">💼 Job Placement</span></li>
                <li><span className="text-premium-gold/80">👨‍🏫 1-on-1 Mentorship</span></li>
                <li><span className="text-premium-gold/80">📝 Interview Preparation</span></li>
                <li><span className="text-premium-gold/80">💰 Money-Back Guarantee</span></li>
                <li><span className="text-premium-gold/80">💳 EMI Options Available</span></li>
                <li><span className="text-premium-gold/80">📱 24/7 Student Support</span></li>
              </ul>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="border-t border-premium-gold/20 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

              {/* Social Media */}
              <div className="text-center md:text-left">
                <h4 className="text-lg font-bold text-premium-gold mb-4">Follow Us</h4>
                <div className="flex justify-center md:justify-start gap-4">
                  <a href="https://www.instagram.com/liorian_technology?igsh=MWptb2h6ZDhwcXI5Zw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-premium-gold/10 rounded-full flex items-center justify-center hover:bg-premium-gold hover:text-premium-dark transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="tel:8148107347" className="w-10 h-10 bg-premium-gold/10 rounded-full flex items-center justify-center hover:bg-premium-gold hover:text-premium-dark transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </a>
                  <a href="mailto:liorian_technology@zohomail.in" className="w-10 h-10 bg-premium-gold/10 rounded-full flex items-center justify-center hover:bg-premium-gold hover:text-premium-dark transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="text-center md:text-right w-full">
                <h4 className="text-lg font-bold text-premium-gold mb-4">Stay Updated</h4>
                <p className="text-premium-gold/80 text-sm mb-4">Get updates on new courses and success stories</p>
                <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:justify-end">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-premium-gold/10 border border-premium-gold/30 rounded-lg text-premium-gold placeholder-premium-gold/60 focus:outline-none focus:border-premium-gold text-sm min-w-0"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribingNewsletter}
                    className="px-4 py-2 bg-premium-gold text-premium-dark rounded-lg font-semibold hover:bg-premium-gold/90 transition-colors text-sm disabled:opacity-50 min-h-[44px] w-full sm:w-auto"
                  >
                    {isSubscribingNewsletter ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {newsletterMessage && (
                  <p className={`text-xs mt-2 ${newsletterMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {newsletterMessage.text}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="border-t border-premium-gold/20 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-premium-gold/90">
                &copy; 2024 Liorian Technology Private Limited. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Terms & Conditions</Link>
                <Link to="/contact" className="text-premium-gold/80 hover:text-premium-gold transition-colors">Refund Policy</Link>
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-premium-gold/70">
              <span>🏆 100% Placement Guarantee</span>
              <span>💰 Money-Back Guarantee</span>
              <span>🎓 Industry Expert Trainers</span>
              <span>🤝 1000+ Success Stories</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-premium-dark">Search Liorian Technology</h3>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses, services, blog posts..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-6">
              {!globalSearchQuery ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-premium-dark">Popular Searches:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Cloud Computing", "Data Science", "Cybersecurity", "DevOps", "Python", "Java"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setGlobalSearchQuery(term)}
                        className="px-3 py-1 bg-premium-gold/10 text-premium-gold rounded-full text-sm font-medium hover:bg-premium-gold/20 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-premium-dark">Search Results:</h4>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <div className="text-gray-600">Search results for "{globalSearchQuery}"</div>
                    <Link
                      to="/services"
                      onClick={() => setShowSearchModal(false)}
                      className="premium-gradient text-premium-dark px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 premium-hover inline-block mt-4"
                    >
                      View All Courses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Application Modal */}
      <EnhancedApplicationModal
        isOpen={showEnhancedModal}
        onClose={() => setShowEnhancedModal(false)}
        onSubmit={handleEnhancedApplicationSubmit}
      />
      <SEOStructuredData type="organization" />
      <SEOStructuredData type="educational" />
    </div>
    </>
  );
}
