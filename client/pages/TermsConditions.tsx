import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Scale, Shield, Clock } from 'lucide-react';

const TermsConditions: React.FC = () => {
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
              <Scale className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl font-bold text-white">Legal Terms</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-b border-amber-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Scale className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-amber-400">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Last updated: December 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-900/30 p-8 space-y-8">
          
          {/* Important Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Important Notice</h3>
              <p className="text-gray-300 text-sm">
                By accessing and using our services, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">1.</span> Acceptance of Terms
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                These Terms and Conditions ("Terms") govern your use of our training and placement services 
                provided by our company. By enrolling in our programs, accessing our website, or using our 
                services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                upon posting on our website. Your continued use of our services after any modifications 
                constitutes acceptance of the revised Terms.
              </p>
            </div>
          </section>

          {/* Section 2: Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">2.</span> Services Description
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Our company provides professional training programs and job placement assistance in various 
                technology domains including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Full Stack Development (MERN, MEAN, Django)</li>
                <li>Data Science and Analytics</li>
                <li>DevOps and Cloud Computing</li>
                <li>Digital Marketing</li>
                <li>UI/UX Design</li>
                <li>Cybersecurity</li>
                <li>Quality Assurance Testing</li>
                <li>Business Analytics</li>
                <li>Product Management</li>
              </ul>
              <p>
                We provide training, certification, portfolio development, interview preparation, and 
                job placement assistance. However, job placement is subject to market conditions, 
                candidate performance, and employer requirements.
              </p>
            </div>
          </section>

          {/* Section 3: Enrollment and Payment */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">3.</span> Enrollment and Payment
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                <strong>3.1 Enrollment Process:</strong> Enrollment is subject to completion of our 
                application process, including assessment tests and interviews where applicable.
              </p>
              <p>
                <strong>3.2 Payment Terms:</strong> Payment must be made according to the agreed schedule. 
                Late payments may result in suspension of services. All fees are non-refundable unless 
                otherwise specified in writing.
              </p>
              <p>
                <strong>3.3 Refund Policy:</strong> Refunds may be considered within the first 7 days of 
                enrollment if no training sessions have been attended. Refund requests must be submitted 
                in writing with valid reasons.
              </p>
            </div>
          </section>

          {/* Section 4: Student Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">4.</span> Student Responsibilities
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>Students are expected to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Attend all scheduled training sessions punctually</li>
                <li>Complete assignments and projects within specified deadlines</li>
                <li>Maintain professional conduct during training and placement activities</li>
                <li>Provide accurate information during enrollment and placement processes</li>
                <li>Respect intellectual property rights of course materials</li>
                <li>Follow the code of conduct and disciplinary guidelines</li>
                <li>Actively participate in placement activities when eligible</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Placement Assistance */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">5.</span> Placement Assistance
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                <strong>5.1 Placement Support:</strong> We provide job placement assistance including 
                resume building, interview preparation, and connecting candidates with our partner companies.
              </p>
              <p>
                <strong>5.2 No Guarantee:</strong> While we strive for 100% placement success, job placement 
                cannot be guaranteed and depends on various factors including market conditions, candidate 
                performance, and employer requirements.
              </p>
              <p>
                <strong>5.3 Placement Criteria:</strong> Students must successfully complete the training 
                program and meet performance benchmarks to be eligible for placement assistance.
              </p>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">6.</span> Intellectual Property
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                All course materials, content, and resources provided during training are the intellectual 
                property of our company. Students may not reproduce, distribute, or share these materials 
                without written permission.
              </p>
              <p>
                Students retain ownership of their project work and portfolios created during the training, 
                but grant us the right to showcase these works for promotional purposes.
              </p>
            </div>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">7.</span> Limitation of Liability
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Our liability is limited to the fees paid for our services. We shall not be liable for 
                any indirect, incidental, special, or consequential damages including but not limited to 
                loss of income, business opportunities, or career advancement.
              </p>
            </div>
          </section>

          {/* Section 8: Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">8.</span> Termination
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We reserve the right to terminate services for violations of these Terms, non-payment, 
                misconduct, or failure to meet program requirements. Students may withdraw from programs 
                with written notice, subject to our refund policy.
              </p>
            </div>
          </section>

          {/* Section 9: Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">9.</span> Governing Law
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes shall be resolved through arbitration or in the courts of appropriate jurisdiction.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-amber-900/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              Contact Us
            </h3>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="text-gray-300 space-y-2">
              <p><strong>Email:</strong> legal@company.com</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Address:</strong> Tech Hub, Innovation District, Bangalore, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
