import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertCircle, Globe } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-400">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Last updated: December 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-blue-900/30 p-8 space-y-8">
          
          {/* Privacy Commitment */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">Our Privacy Commitment</h3>
              <p className="text-gray-300 text-sm">
                We are committed to protecting your personal information and respecting your privacy. 
                This policy explains how we collect, use, and safeguard your data when you use our services.
              </p>
            </div>
          </div>

          {/* Section 1: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">1.</span> Information We Collect
            </h2>
            <div className="text-gray-300 space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  Personal Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                  <li>Full name and contact details (email, phone number, address)</li>
                  <li>Educational background and qualifications</li>
                  <li>Work experience and career history</li>
                  <li>Resume/CV and portfolio information</li>
                  <li>Government-issued ID for verification purposes</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Training and Performance Data
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                  <li>Course enrollment and attendance records</li>
                  <li>Assignment submissions and project work</li>
                  <li>Assessment scores and performance metrics</li>
                  <li>Training progress and completion status</li>
                  <li>Feedback and evaluation reports</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Technical Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                  <li>IP address, browser type, and device information</li>
                  <li>Website usage patterns and navigation data</li>
                  <li>Session recordings for training purposes (with consent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">2.</span> How We Use Your Information
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>We use your information for the following purposes:</p>
              
              <div className="grid gap-4">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-amber-400 mb-2">Training Services</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Provide personalized training programs</li>
                    <li>Track learning progress and performance</li>
                    <li>Issue certificates and credentials</li>
                    <li>Conduct assessments and evaluations</li>
                  </ul>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-amber-400 mb-2">Placement Assistance</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Match candidates with suitable job opportunities</li>
                    <li>Share profiles with partner companies (with consent)</li>
                    <li>Facilitate interview processes</li>
                    <li>Provide placement support and follow-up</li>
                  </ul>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-amber-400 mb-2">Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Send course updates and notifications</li>
                    <li>Provide customer support</li>
                    <li>Share placement opportunities</li>
                    <li>Send promotional materials (with opt-out option)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">3.</span> Information Sharing and Disclosure
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>We may share your information in the following circumstances:</p>
              
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">With Your Consent</h4>
                  <p className="text-sm">We share your profile with potential employers only with your explicit consent.</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Service Providers</h4>
                  <p className="text-sm">We work with trusted third-party services for payment processing, email communications, and analytics.</p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-400 mb-2">Legal Requirements</h4>
                  <p className="text-sm">We may disclose information when required by law or to protect our rights and safety.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">4.</span> Data Security
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>We implement robust security measures to protect your information:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Technical Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure database storage</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Administrative Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Staff training on data protection</li>
                    <li>Limited access on need-to-know basis</li>
                    <li>Regular backup procedures</li>
                    <li>Incident response protocols</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">5.</span> Your Privacy Rights
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>You have the following rights regarding your personal information:</p>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 bg-slate-800/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Access</h4>
                    <p className="text-sm">Request a copy of your personal data we hold</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <UserCheck className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Correction</h4>
                    <p className="text-sm">Update or correct inaccurate information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Deletion</h4>
                    <p className="text-sm">Request deletion of your data (subject to legal requirements)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Portability</h4>
                    <p className="text-sm">Receive your data in a structured, machine-readable format</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">6.</span> Cookies and Tracking
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>We use cookies and similar technologies to enhance your experience:</p>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <ul className="space-y-2 text-sm">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage patterns</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                </ul>
              </div>
              <p className="text-sm">
                You can control cookie settings through your browser preferences. Note that disabling 
                certain cookies may affect website functionality.
              </p>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">7.</span> Data Retention
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>We retain your information for the following periods:</p>
              <div className="space-y-3">
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <p><strong>Active Students:</strong> During enrollment and up to 2 years after course completion</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <p><strong>Placed Candidates:</strong> Up to 5 years for placement support and alumni services</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
                  <p><strong>Marketing Data:</strong> Until you opt-out or request deletion</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">8.</span> Policy Updates
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes via email or through our website. Your continued use of our 
                services after any updates constitutes acceptance of the revised policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-900/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              Privacy Contact
            </h3>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your privacy rights:
            </p>
            <div className="text-gray-300 space-y-2">
              <p><strong>Data Protection Officer:</strong> privacy@company.com</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Address:</strong> Tech Hub, Innovation District, Bangalore, India</p>
            </div>
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-sm text-blue-300">
                <strong>Response Time:</strong> We will respond to privacy requests within 30 days of receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
