import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Target, TrendingUp, Users, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import ModernNavigation from "../components/ModernNavigation";
import SEOHead from "../components/SEOHead";
import SEOStructuredData from "../components/SEOStructuredData";
import { getSEOConfig } from "../utils/seoConfig";

export default function Services() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const seoConfig = getSEOConfig('services');

  // Simplified course data - clean and focused
  const courses = [
    {
      id: "cloud-computing",
      icon: "☁️",
      title: "Cloud Computing",
      desc: "Master AWS, Azure, and Google Cloud. Build scalable cloud solutions and become a cloud architect.",
      duration: "16 weeks",
      salary: "₹8-18 LPA",
      placement: "97%",
      students: "2,500+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    },
    {
      id: "data-science",
      icon: "📊",
      title: "Data Science",
      desc: "Learn Python, Machine Learning, AI, and Big Data. Become a data scientist and solve real-world problems.",
      duration: "20 weeks",
      salary: "₹6-15 LPA",
      placement: "94%",
      students: "1,800+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    },
    {
      id: "cybersecurity",
      icon: "🔐",
      title: "Cybersecurity",
      desc: "Protect organizations from cyber threats. Learn ethical hacking, security analysis, and incident response.",
      duration: "18 weeks",
      salary: "₹7-16 LPA",
      placement: "95%",
      students: "1,200+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    },
    {
      id: "devops",
      icon: "⚙️",
      title: "DevOps Engineering",
      desc: "Automate deployments and manage infrastructure. Master CI/CD, Docker, Kubernetes, and cloud automation.",
      duration: "14 weeks",
      salary: "₹8-20 LPA",
      placement: "96%",
      students: "900+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    },
    {
      id: "full-stack",
      icon: "💻",
      title: "Full Stack Development",
      desc: "Build complete web applications. Learn React, Node.js, databases, and modern development practices.",
      duration: "22 weeks",
      salary: "₹5-12 LPA",
      placement: "92%",
      students: "3,200+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    },
    {
      id: "ai-ml",
      icon: "🤖",
      title: "AI & Machine Learning",
      desc: "Build intelligent systems and AI applications. Master deep learning, neural networks, and AI frameworks.",
      duration: "24 weeks",
      salary: "₹10-25 LPA",
      placement: "93%",
      students: "1,100+",
      level: "All Levels",
      image: "https://cdn.builder.io/api/v1/image/assets%2F6c52e1efd0ac4e7c9c12a5a6977dd5d7%2Fe3185f04fd614e3a9763847c5c7ef671?format=webp&width=800"
    }
  ];

  const features = [
    {
      icon: "🎯",
      title: "Job-Ready Training",
      desc: "Industry-focused curriculum designed by experts"
    },
    {
      icon: "👨‍💼",
      title: "Expert Mentors",
      desc: "Learn from professionals working at top companies"
    },
    {
      icon: "💼",
      title: "Placement Support",
      desc: "Dedicated placement assistance and interview prep"
    },
    {
      icon: "🏆",
      title: "Industry Projects",
      desc: "Real-world projects and hands-on experience"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead {...seoConfig} />
      <SEOStructuredData type="courses" data={courses} />
      <ModernNavigation 
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-premium-dark via-premium-bronze to-premium-gold">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Launch Your Tech Career
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Choose from our industry-leading courses designed to get you hired fast
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Live Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Expert Mentors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Job Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Industry Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All courses include live projects, expert mentorship, and placement support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">{course.icon}</span>
                </div>

                <div className="p-6">
                  {/* Course Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {course.desc}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-gray-900">{course.duration}</div>
                      <div className="text-gray-600">Duration</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-green-600">{course.salary}</div>
                      <div className="text-gray-600">Salary</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-blue-600">{course.placement}</div>
                      <div className="text-gray-600">Placement</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-bold text-purple-600">{course.students}</div>
                      <div className="text-gray-600">Students</div>
                    </div>
                  </div>

                  {/* Enroll Button - MAIN FOCUS */}
                  <Link
                    to="/contact"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    <BookOpen className="w-5 h-5" />
                    Enroll Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Course Details Link */}
                  <Link
                    to={`/learning-path/${course.id}`}
                    className="w-full mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors block text-center"
                  >
                    View Detailed Learning Path →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Liorian Technology?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-premium-gold to-premium-bronze">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful graduates who landed high-paying tech jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Start Your Journey
            </Link>
            <Link
              to="/blog"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Read Success Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h3>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {selectedCourse.desc}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-bold text-gray-900 text-lg">{selectedCourse.duration}</div>
                    <div className="text-gray-600">Course Duration</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-bold text-green-600 text-lg">{selectedCourse.salary}</div>
                    <div className="text-gray-600">Average Salary</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-bold text-blue-600 text-lg">{selectedCourse.placement}</div>
                    <div className="text-gray-600">Placement Rate</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-bold text-purple-600 text-lg">{selectedCourse.students}</div>
                    <div className="text-gray-600">Students Trained</div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Link
                    to="/contact"
                    onClick={() => setSelectedCourse(null)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Enroll in {selectedCourse.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
