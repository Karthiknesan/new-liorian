import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Star, Users, Award, BookOpen, Target, TrendingUp } from "lucide-react";
import ModernNavigation from "../components/ModernNavigation";

export default function CourseLearningPath() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Detailed course data with learning paths
  const courseData = {
    "cloud-computing": {
      id: "cloud-computing",
      icon: "☁️",
      title: "Cloud Computing Master Program",
      subtitle: "Become a Cloud Solutions Architect",
      description: "Master AWS, Azure, and Google Cloud platforms. Learn to design, deploy, and manage scalable cloud solutions for enterprise applications.",
      duration: "16 weeks",
      level: "Beginner to Advanced",
      averageSalary: "₹8-18 LPA",
      placementRate: "97%",
      students: "2,500+",
      rating: "4.9",
      technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins", "Ansible"],
      features: [
        "24/7 Cloud Lab Access",
        "Multi-Cloud Certifications", 
        "Enterprise Projects",
        "Industry Mentorship",
        "Job Placement Assistance",
        "Lifetime Course Updates"
      ],
      prerequisites: [
        "Basic computer knowledge",
        "Networking fundamentals", 
        "Problem-solving mindset",
        "Dedication to hands-on learning"
      ],
      careerOutcomes: [
        "Senior Cloud Solutions Architect",
        "Principal DevOps Engineer", 
        "Cloud Security Architect",
        "Site Reliability Engineering Manager",
        "Cloud Infrastructure Lead",
        "Multi-Cloud Consultant"
      ],
      learningPath: [
        {
          phase: "Phase 1: Foundation (Weeks 1-3)",
          modules: [
            {
              title: "Cloud Computing Fundamentals",
              duration: "1 week",
              topics: ["Cloud Computing Basics", "Service Models (IaaS, PaaS, SaaS)", "Deployment Models", "Benefits & Challenges"],
              labs: ["AWS Account Setup", "Console Navigation", "Basic Service Overview"]
            },
            {
              title: "AWS Core Services", 
              duration: "2 weeks",
              topics: ["EC2 Instances", "S3 Storage", "VPC Networking", "IAM Security"],
              labs: ["Launch EC2 Instance", "Configure S3 Bucket", "Design VPC Architecture", "Setup IAM Policies"]
            }
          ]
        },
        {
          phase: "Phase 2: Intermediate (Weeks 4-8)",
          modules: [
            {
              title: "Advanced AWS Services",
              duration: "2 weeks", 
              topics: ["Lambda Functions", "RDS Databases", "Load Balancers", "Auto Scaling"],
              labs: ["Serverless Application", "Database Migration", "High Availability Setup"]
            },
            {
              title: "Azure Fundamentals",
              duration: "2 weeks",
              topics: ["Azure Virtual Machines", "Azure Storage", "Azure Networking", "Azure Active Directory"],
              labs: ["Deploy VM in Azure", "Configure Azure Storage", "Setup Virtual Networks"]
            },
            {
              title: "Google Cloud Platform",
              duration: "1 week",
              topics: ["Compute Engine", "Cloud Storage", "VPC Networks", "Cloud IAM"],
              labs: ["GCP Project Setup", "Deploy Applications", "Configure Networking"]
            }
          ]
        },
        {
          phase: "Phase 3: Advanced (Weeks 9-13)",
          modules: [
            {
              title: "DevOps & Automation",
              duration: "2 weeks",
              topics: ["CI/CD Pipelines", "Infrastructure as Code", "Docker Containers", "Kubernetes Orchestration"],
              labs: ["Setup Jenkins Pipeline", "Terraform Deployment", "Kubernetes Cluster"]
            },
            {
              title: "Cloud Security & Monitoring",
              duration: "2 weeks", 
              topics: ["Security Best Practices", "Compliance Frameworks", "Monitoring & Logging", "Disaster Recovery"],
              labs: ["Security Assessment", "Setup Monitoring", "Backup Strategies"]
            },
            {
              title: "Multi-Cloud Architecture",
              duration: "1 week",
              topics: ["Hybrid Cloud", "Multi-Cloud Strategies", "Cloud Migration", "Cost Optimization"],
              labs: ["Design Multi-Cloud Solution", "Migration Project", "Cost Analysis"]
            }
          ]
        },
        {
          phase: "Phase 4: Capstone (Weeks 14-16)",
          modules: [
            {
              title: "Real-World Project",
              duration: "3 weeks",
              topics: ["Project Planning", "Architecture Design", "Implementation", "Deployment"],
              labs: ["Complete Enterprise Project", "Presentation", "Documentation"]
            }
          ]
        }
      ]
    },
    "data-science": {
      id: "data-science", 
      icon: "📊",
      title: "Data Science & AI Master Program",
      subtitle: "Become a Data Scientist",
      description: "Learn Python, Machine Learning, AI, and Big Data. Become a data scientist and solve real-world business problems with data-driven insights.",
      duration: "20 weeks",
      level: "Beginner to Advanced", 
      averageSalary: "₹6-15 LPA",
      placementRate: "94%",
      students: "1,800+",
      rating: "4.8",
      technologies: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy"],
      features: [
        "Industry Projects",
        "AI/ML Certifications",
        "Data Science Portfolio", 
        "Kaggle Competitions",
        "Job Placement Support",
        "Mentorship Program"
      ],
      learningPath: [
        {
          phase: "Phase 1: Foundation (Weeks 1-5)",
          modules: [
            {
              title: "Python Programming",
              duration: "2 weeks",
              topics: ["Python Basics", "Data Structures", "Object-Oriented Programming", "Libraries"],
              labs: ["Python Exercises", "Data Manipulation", "Web Scraping"]
            },
            {
              title: "Statistics & Mathematics",
              duration: "2 weeks", 
              topics: ["Descriptive Statistics", "Inferential Statistics", "Probability", "Linear Algebra"],
              labs: ["Statistical Analysis", "Hypothesis Testing", "Probability Problems"]
            },
            {
              title: "Data Analysis with Pandas",
              duration: "1 week",
              topics: ["Data Cleaning", "Data Transformation", "Exploratory Data Analysis", "Visualization"],
              labs: ["Real Dataset Analysis", "Data Cleaning Project", "Visualization Dashboard"]
            }
          ]
        }
      ]
    },
    "cybersecurity": {
      id: "cybersecurity",
      icon: "🔐", 
      title: "Cybersecurity Expert Program",
      subtitle: "Become a Security Professional",
      description: "Protect organizations from cyber threats. Learn ethical hacking, security analysis, incident response, and advanced security frameworks.",
      duration: "18 weeks",
      level: "Beginner to Advanced",
      averageSalary: "₹7-16 LPA", 
      placementRate: "95%",
      students: "1,200+",
      rating: "4.9",
      technologies: ["Kali Linux", "Metasploit", "Wireshark", "Nmap", "Burp Suite", "SIEM Tools", "Python"],
      features: [
        "Ethical Hacking Labs",
        "Security Certifications",
        "Real Attack Simulations",
        "SOC Training",
        "Industry Mentorship", 
        "Job Guarantee"
      ],
      learningPath: [
        {
          phase: "Phase 1: Foundation (Weeks 1-4)",
          modules: [
            {
              title: "Security Fundamentals",
              duration: "2 weeks",
              topics: ["Security Principles", "Threat Landscape", "Risk Management", "Compliance"],
              labs: ["Security Assessment", "Risk Analysis", "Policy Creation"]
            },
            {
              title: "Network Security",
              duration: "2 weeks",
              topics: ["Network Protocols", "Firewalls", "IDS/IPS", "VPNs"],
              labs: ["Network Scanning", "Firewall Configuration", "Network Monitoring"]
            }
          ]
        }
      ]
    }
  };

  const defaultCourse = courseData["cloud-computing"];
  const course = courseId ? courseData[courseId as keyof typeof courseData] || defaultCourse : defaultCourse;

  // If course not found, show all available courses
  if (!course && courseId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernNavigation
          showSearchModal={showSearchModal}
          setShowSearchModal={setShowSearchModal}
        />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been moved.</p>
            <Link
              to="/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavigation 
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Courses
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
                  {course.icon}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">{course.title}</h1>
                  <p className="text-xl text-blue-200 mt-2">{course.subtitle}</p>
                </div>
              </div>

              <p className="text-lg mb-8 text-blue-100 leading-relaxed">{course.description}</p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.duration}</div>
                  <div className="text-blue-200 text-sm">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{course.placementRate}</div>
                  <div className="text-blue-200 text-sm">Placement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{course.averageSalary}</div>
                  <div className="text-blue-200 text-sm">Average Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{course.students}</div>
                  <div className="text-blue-200 text-sm">Students</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BookOpen className="w-6 h-6" />
                Enroll Now - Limited Seats
              </Link>
            </div>

            {/* Course Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">What You'll Get</h3>
              <div className="space-y-4">
                {course.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Learning Path</h2>
            <p className="text-xl text-gray-600">Structured curriculum designed by industry experts</p>
          </div>

          <div className="space-y-8">
            {course.learningPath.map((phase, phaseIdx) => (
              <div key={phaseIdx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <h3 className="text-2xl font-bold">{phase.phase}</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {phase.modules.map((module, moduleIdx) => (
                      <div key={moduleIdx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">{moduleIdx + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{module.title}</h4>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2">Topics Covered:</h5>
                            <ul className="space-y-1">
                              {module.topics.map((topic, topicIdx) => (
                                <li key={topicIdx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {module.labs && (
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-2">Hands-on Labs:</h5>
                              <ul className="space-y-1">
                                {module.labs.map((lab, labIdx) => (
                                  <li key={labIdx} className="text-green-600 text-sm flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {lab}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technologies You'll Master</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {course.technologies.map((tech, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Career Outcomes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Career Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.careerOutcomes.map((career, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-green-600" />
                  <span className="font-semibold text-gray-900">{career}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful graduates in high-paying tech careers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Enroll Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
