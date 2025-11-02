import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, Video, BookOpen, ExternalLink, Clock, CheckCircle } from "lucide-react";
import DashboardNavigation from "../components/DashboardNavigation";
import SimpleAuth from "../utils/simpleAuth";

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  description: string;
  size?: string;
  duration?: string;
  module: string;
  isCompleted: boolean;
}

export default function StudentMaterials() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedModule, setSelectedModule] = useState("all");
  const auth = SimpleAuth.getInstance();

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = auth.getCurrentUser();
    if (!user || auth.getUserType() !== 'candidate') {
      navigate('/login');
      return;
    }

    setCurrentUser(user);
    loadMaterials();
  }, [navigate]);

  const loadMaterials = () => {
    // Sample materials for the course
    const courseMaterials: Material[] = [
      {
        id: 'mat_1',
        title: 'Cloud Computing Fundamentals - Introduction',
        type: 'pdf',
        url: '#',
        description: 'Complete guide to cloud computing basics, service models, and deployment strategies',
        size: '2.5 MB',
        module: 'Module 1',
        isCompleted: true
      },
      {
        id: 'mat_2', 
        title: 'AWS Account Setup Tutorial',
        type: 'video',
        url: '#',
        description: 'Step-by-step video guide for setting up your AWS account and basic navigation',
        duration: '15 mins',
        module: 'Module 1',
        isCompleted: true
      },
      {
        id: 'mat_3',
        title: 'EC2 Instance Configuration Guide',
        type: 'pdf',
        url: '#',
        description: 'Detailed documentation on launching and configuring EC2 instances',
        size: '3.1 MB',
        module: 'Module 2',
        isCompleted: false
      },
      {
        id: 'mat_4',
        title: 'S3 Storage Best Practices',
        type: 'video',
        url: '#',
        description: 'Learn S3 bucket creation, permissions, and security best practices',
        duration: '22 mins',
        module: 'Module 2',
        isCompleted: false
      },
      {
        id: 'mat_5',
        title: 'VPC Networking Deep Dive',
        type: 'document',
        url: '#',
        description: 'Comprehensive guide to Virtual Private Cloud setup and configuration',
        size: '4.2 MB',
        module: 'Module 2',
        isCompleted: false
      },
      {
        id: 'mat_6',
        title: 'AWS Official Documentation',
        type: 'link',
        url: 'https://docs.aws.amazon.com/',
        description: 'Official AWS documentation and reference materials',
        module: 'Reference',
        isCompleted: false
      },
      {
        id: 'mat_7',
        title: 'Lambda Functions Workshop',
        type: 'pdf',
        url: '#',
        description: 'Hands-on workshop for serverless computing with AWS Lambda',
        size: '1.8 MB',
        module: 'Module 3',
        isCompleted: false
      },
      {
        id: 'mat_8',
        title: 'Database Services Overview',
        type: 'video',
        url: '#',
        description: 'Complete overview of RDS, DynamoDB, and other database services',
        duration: '28 mins',
        module: 'Module 3',
        isCompleted: false
      }
    ];

    setMaterials(courseMaterials);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'link':
        return <ExternalLink className="w-5 h-5 text-green-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleMaterialClick = (material: Material) => {
    if (material.type === 'link') {
      window.open(material.url, '_blank');
    } else {
      // Mark as completed
      const updatedMaterials = materials.map(m => 
        m.id === material.id ? { ...m, isCompleted: true } : m
      );
      setMaterials(updatedMaterials);
      
      // Simulate download or view
      alert(`Opening: ${material.title}`);
    }
  };

  const filteredMaterials = selectedModule === 'all' 
    ? materials 
    : materials.filter(m => m.module === selectedModule);

  const modules = ['all', ...Array.from(new Set(materials.map(m => m.module)))];
  const completedCount = materials.filter(m => m.isCompleted).length;

  if (!currentUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation 
        userType="candidate" 
        userName={currentUser?.name || 'Student'}
      />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/candidate-training" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Materials</h1>
            <p className="text-gray-600">Access all your course materials, videos, and resources</p>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Progress Overview</h3>
                <p className="text-gray-600">Materials completed: {completedCount} of {materials.length}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round((completedCount / materials.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / materials.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Module Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {modules.map((module) => (
                <button
                  key={module}
                  onClick={() => setSelectedModule(module)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedModule === module
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {module === 'all' ? 'All Materials' : module}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div 
                key={material.id} 
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getIcon(material.type)}
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {material.module}
                        </span>
                        {material.isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2 inline" />
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      material.type === 'video' ? 'bg-blue-100 text-blue-800' :
                      material.type === 'pdf' || material.type === 'document' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {material.type.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {material.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {material.size && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {material.size}
                      </span>
                    )}
                    {material.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {material.duration}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMaterialClick(material)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      material.isCompleted
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {material.type === 'link' ? (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Open Link
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {material.isCompleted ? 'View Again' : 'Download/View'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600">Try selecting a different module filter</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/candidate-training"
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-center group"
              >
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Back to Dashboard</div>
                <div className="text-sm text-gray-600">View course progress</div>
              </Link>
              
              <Link
                to={`/learning-path/${courseId || 'cloud-computing'}`}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-center group"
              >
                <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Continue Learning</div>
                <div className="text-sm text-gray-600">Resume your course</div>
              </Link>
              
              <Link
                to="/contact"
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-center group"
              >
                <ExternalLink className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Get Help</div>
                <div className="text-sm text-gray-600">Contact support</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
