import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModernNavigation from "../components/ModernNavigation";

export default function SuccessStories() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const successStories = [
    { 
      name: "Rahul Sharma", 
      role: "Python Full Stack Developer", 
      story: "From a non-tech background to landing a 8 LPA job at a top IT company. Liorian Technology's training and placement support made it possible!", 
      prev: "Retail Manager", 
      growth: "+400% Salary",
      company: "TechCorp Solutions",
      duration: "3 months"
    },
    { 
      name: "Priya Mehta", 
      role: "Data Scientist", 
      story: "Career transition at 32 from banking to tech. Now earning 12 LPA and loving my work in machine learning!", 
      prev: "Bank Executive", 
      growth: "+350% Salary",
      company: "DataFlow Analytics",
      duration: "4 months"
    },
    { 
      name: "Karthik Reddy", 
      role: "Cloud DevOps Engineer", 
      story: "From mechanical engineering to cloud computing. The practical training and mentorship helped me land my dream job!", 
      prev: "Mechanical Engineer", 
      growth: "+250% Salary",
      company: "CloudTech Innovations",
      duration: "3.5 months"
    },
    { 
      name: "Sneha Patel", 
      role: "Cybersecurity Analyst", 
      story: "Complete career change from teaching to cybersecurity. Now protecting organizations from cyber threats!", 
      prev: "School Teacher", 
      growth: "+300% Salary",
      company: "SecureNet Systems",
      duration: "4 months"
    },
    { 
      name: "Amit Kumar", 
      role: "Java Full Stack Developer", 
      story: "From struggling with unemployment to securing a 9 LPA package. The placement guarantee gave me confidence!", 
      prev: "Unemployed", 
      growth: "New Career",
      company: "Innovation Labs",
      duration: "5 months"
    },
    { 
      name: "Divya Sharma", 
      role: "Business Analyst", 
      story: "Leveraged my finance background with new tech skills. Now working at the intersection of business and technology!", 
      prev: "Finance Executive", 
      growth: "+200% Salary",
      company: "FinTech Solutions",
      duration: "3 months"
    }
  ];

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
            Success Stories
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-shadow leading-relaxed">
            Real stories of career transformation and success from our graduates
          </p>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-premium-dark mb-6">
              Career Transformations That Inspire
            </h2>
            <p className="text-lg text-premium-dark/80 max-w-3xl mx-auto">
              See how our students transformed their careers and achieved their dream jobs with our comprehensive training and placement support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={`success-story-${story.name}-${index}`} className="glass-effect rounded-2xl overflow-hidden border border-premium-gold/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-premium-dark to-premium-bronze p-6 text-white">
                  <div className="w-20 h-20 mx-auto bg-premium-gradient rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-premium-dark">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{story.name}</h3>
                  <p className="text-center text-premium-gold font-semibold">{story.role}</p>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-premium-dark/60 font-medium">Previous Role</div>
                      <div className="text-sm font-bold text-premium-dark">{story.prev}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-premium-dark/60 font-medium">Growth</div>
                      <div className="text-sm font-bold text-premium-gold">{story.growth}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-premium-dark/60 font-medium">Company</div>
                      <div className="text-sm font-bold text-premium-dark">{story.company}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-premium-dark/60 font-medium">Duration</div>
                      <div className="text-sm font-bold text-premium-dark">{story.duration}</div>
                    </div>
                  </div>

                  <blockquote className="text-premium-dark/80 italic leading-relaxed border-l-4 border-premium-gold pl-4">
                    "{story.story}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-premium-dark to-premium-bronze text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Success in Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">1200+</div>
              <div className="text-lg">Success Stories</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">95%</div>
              <div className="text-lg">Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">₹8.5L</div>
              <div className="text-lg">Average Package</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-premium-gold mb-2">300%</div>
              <div className="text-lg">Avg. Salary Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlights */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-premium-light to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-premium-dark mb-16">
            What Our Graduates Say
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect rounded-2xl p-8 border border-premium-gold/20">
              <div className="text-4xl text-premium-gold mb-4">"</div>
              <blockquote className="text-lg text-premium-dark/80 mb-6 leading-relaxed">
                The training was intensive but incredibly rewarding. The instructors were patient and knowledgeable, and the placement team worked tirelessly to find me the perfect role.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-premium-gradient rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-premium-dark">RS</span>
                </div>
                <div>
                  <div className="font-bold text-premium-dark">Rajesh Singh</div>
                  <div className="text-sm text-premium-dark/60">Full Stack Developer at Microsoft</div>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 border border-premium-gold/20">
              <div className="text-4xl text-premium-gold mb-4">"</div>
              <blockquote className="text-lg text-premium-dark/80 mb-6 leading-relaxed">
                At 35, I thought it was too late to change careers. Liorian Technology proved me wrong. Their support system is exceptional and the placement guarantee is real.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-premium-gradient rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-premium-dark">MP</span>
                </div>
                <div>
                  <div className="font-bold text-premium-dark">Maya Patel</div>
                  <div className="text-sm text-premium-dark/60">Data Scientist at Amazon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Transformation Process */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-premium-dark mb-16">
            Your Success Journey
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Learn</h3>
              <p className="text-premium-dark/70">
                Master industry-relevant skills with our expert-designed curriculum
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Practice</h3>
              <p className="text-premium-dark/70">
                Work on real-world projects to build your portfolio and confidence
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Prepare</h3>
              <p className="text-premium-dark/70">
                Get interview-ready with mock sessions and placement preparation
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto premium-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-premium-dark">Succeed</h3>
              <p className="text-premium-dark/70">
                Land your dream job with our 100% placement guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-premium-dark to-premium-bronze text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Join hundreds of professionals who transformed their careers with Liorian Technology. Your success story could be next!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/services" 
              className="premium-gradient text-premium-dark px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all duration-300 premium-hover"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/contact" 
              className="glass-effect border-2 border-premium-gold text-premium-gold hover:bg-premium-gold hover:text-premium-dark px-8 py-3 rounded-full font-bold text-lg transition-all duration-300"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
