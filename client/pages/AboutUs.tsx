import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModernNavigation from "../components/ModernNavigation";
import SEOHead from "../components/SEOHead";
import SEOStructuredData from "../components/SEOStructuredData";
import { getSEOConfig } from "../utils/seoConfig";

export default function AboutUs() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const seoConfig = getSEOConfig('about');

  return (
    <>
      <SEOHead {...seoConfig} />
      <SEOStructuredData type="organization" />
      <SEOStructuredData type="educational" />
      <div className="min-h-screen bg-gradient-to-br from-premium-light to-white">
      <ModernNavigation
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      {/* Page Header */}
      <section className="pt-32 sm:pt-36 lg:pt-48 pb-16 sm:pb-20 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg text-white">
            About Liorian Technology
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-shadow leading-relaxed">
            Empowering careers through cutting-edge technology training and guaranteed job placement
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-premium-light to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-premium-dark">
                Our Mission
              </h2>
              <p className="text-lg text-premium-dark/80 leading-relaxed">
                At Liorian Technology, we bridge the gap between aspiring professionals and the ever-evolving tech industry. Our mission is to transform careers by providing world-class training programs with guaranteed job placement.
              </p>
              <p className="text-lg text-premium-dark/80 leading-relaxed">
                We believe that with the right guidance, dedication, and industry-relevant skills, anyone can build a successful career in technology, regardless of their background.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-premium-gradient rounded-full"></div>
                <div>
                  <p className="text-xl font-bold text-premium-dark">100% Placement Guarantee</p>
                  <p className="text-premium-dark/70">Your success is our commitment</p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="glass-effect rounded-2xl p-8 border border-premium-gold/20">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
                  alt="Liorian Technology Team"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-premium-dark mb-2">Expert-Led Training</h3>
                  <p className="text-premium-dark/70">Industry professionals with 10+ years experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-premium-dark mb-16">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Excellence</h3>
              <p className="text-premium-dark/70">
                We strive for excellence in everything we do, from curriculum design to student support.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Integrity</h3>
              <p className="text-premium-dark/70">
                Honest, transparent communication and ethical practices in all our interactions.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Innovation</h3>
              <p className="text-premium-dark/70">
                Constantly updating our methods and technologies to stay ahead of industry trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-premium-dark to-premium-bronze text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Impact in Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">1200+</div>
              <div className="text-lg">Students Trained</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">95%</div>
              <div className="text-lg">Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">500+</div>
              <div className="text-lg">Hiring Partners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">₹8.5L</div>
              <div className="text-lg">Average Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-premium-light to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-premium-dark mb-16">
            Meet Our Expert Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-6 text-center border border-premium-gold/20">
              <div className="w-24 h-24 mx-auto bg-premium-gradient rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-premium-dark">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark mb-2">Technical Experts</h3>
              <p className="text-premium-dark/70">
                Industry veterans with 10+ years of hands-on experience in leading tech companies.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center border border-premium-gold/20">
              <div className="w-24 h-24 mx-auto bg-premium-gradient rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-premium-dark">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark mb-2">Career Mentors</h3>
              <p className="text-premium-dark/70">
                Dedicated career counselors who guide you through your professional journey.
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-6 text-center border border-premium-gold/20">
              <div className="w-24 h-24 mx-auto bg-premium-gradient rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-premium-dark">💼</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark mb-2">Placement Team</h3>
              <p className="text-premium-dark/70">
                Specialists who connect you with top companies and ensure successful placements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-premium-dark mb-16">
            Why Choose Liorian Technology?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Industry-Relevant Curriculum</h3>
              <p className="text-premium-dark/70">
                Our courses are designed based on current industry requirements and emerging technologies.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Hands-On Projects</h3>
              <p className="text-premium-dark/70">
                Work on real-world projects that build your portfolio and practical experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Small Batch Sizes</h3>
              <p className="text-premium-dark/70">
                Personalized attention with small class sizes for effective learning.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Job-Ready Skills</h3>
              <p className="text-premium-dark/70">
                Focus on practical skills that make you immediately employable.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Lifetime Support</h3>
              <p className="text-premium-dark/70">
                Ongoing support even after course completion and job placement.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 premium-gradient rounded-lg flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Career Growth</h3>
              <p className="text-premium-dark/70">
                Continuous learning opportunities to advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-premium-dark to-premium-bronze text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Join thousands of successful professionals who trusted Liorian Technology with their career transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/services" 
              className="premium-gradient text-premium-dark px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 premium-hover"
            >
              Explore Our Programs
            </Link>
            <Link 
              to="/contact" 
              className="glass-effect border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-premium-dark px-8 py-3 rounded-full font-bold text-lg transition-all duration-300"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
