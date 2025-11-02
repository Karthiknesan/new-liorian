import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModernNavigation from "../components/ModernNavigation";

export default function Contact() {
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showApplicationPopup, setShowApplicationPopup] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-light to-white">
      <ModernNavigation
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      {/* Page Header */}
      <section className="pt-32 sm:pt-36 lg:pt-48 pb-16 sm:pb-20 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg text-white">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-shadow leading-relaxed">
            Ready to transform your career? Let's discuss how we can help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-premium-dark mb-6">
                  Let's Start Your Journey
                </h2>
                <p className="text-lg text-premium-dark/80 leading-relaxed mb-8">
                  Take the first step towards your dream career. Fill out the form and our career counselors will contact you within 24 hours to discuss your goals and recommend the best program for you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-premium-dark">Email Us</h3>
                    <p className="text-premium-dark/70">liorian_technology@zohomail.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-premium-dark">Call Us</h3>
                    <p className="text-premium-dark/70">+91 8148107347</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-premium-dark">Visit Us</h3>
                    <p className="text-premium-dark/70">Planning to open office soon in Bangalore</p>
                    <p className="text-premium-dark/50 text-sm">Currently working remotely</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                    <span className="text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-premium-dark">Office Hours</h3>
                    <p className="text-premium-dark/70">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Points */}
              <div className="glass-effect rounded-2xl p-6 border border-premium-gold/20">
                <h3 className="text-xl font-bold text-premium-dark mb-4">Why Choose Liorian Technology?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                    <span className="text-premium-dark/80">100% Placement Guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                    <span className="text-premium-dark/80">Industry Expert Instructors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                    <span className="text-premium-dark/80">Hands-on Project Experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                    <span className="text-premium-dark/80">24/7 Learning Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="glass-effect rounded-2xl p-8 border border-premium-gold/20">
              <h3 className="text-2xl font-bold text-premium-dark mb-6">Apply for a Course</h3>
              
              <form onSubmit={handleCourseApplication} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Course Interest *</label>
                  <select
                    name="course"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors"
                  >
                    <option value="">Select a course</option>
                    <option value="cloud-computing">Cloud Computing</option>
                    <option value="data-analyst">Data Analyst</option>
                    <option value="data-scientist">Data Scientists</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="devops">DevOps</option>
                    <option value="python-fullstack">Python Fullstack Developer</option>
                    <option value="java-fullstack">Java Fullstack Developer</option>
                    <option value="banking-finance">Banking & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Choose Your Option *</label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-premium-gold transition-colors">
                      <input type="radio" name="option" value="training" required className="mr-3 text-premium-gold" />
                      <span className="text-premium-dark">Training + Placement (Complete Program)</span>
                    </label>
                    <label className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-premium-gold transition-colors">
                      <input type="radio" name="option" value="placement" required className="mr-3 text-premium-gold" />
                      <span className="text-premium-dark">Placement Only (For Skilled Professionals)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-dark mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your career goals and any specific questions you have..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingApplication}
                  className="w-full premium-gradient text-premium-dark py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 premium-hover disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]"
                >
                  {isSubmittingApplication ? "Submitting..." : "Submit Application"}
                </button>

                {applicationMessage && (
                  <div className={`p-4 rounded-lg ${
                    applicationMessage.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {applicationMessage.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* Success Popup */}
      {showApplicationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-premium-dark mb-4">Application Submitted!</h3>
            <p className="text-premium-dark/70 mb-6">
              Thank you for your interest! Our team will contact you within 24 hours to discuss your career goals and recommend the best program for you.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowApplicationPopup(false)}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                to="/services"
                onClick={() => setShowApplicationPopup(false)}
                className="flex-1 premium-gradient text-premium-dark px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 premium-hover"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
