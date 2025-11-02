import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleAuth from '../utils/simpleAuth';
import { getCourses, saveCourses, updateCourse, Course } from '../utils/courseData';
import { 
  ArrowLeft, Save, Edit3, Plus, Trash2, DollarSign, 
  BookOpen, Clock, Target, Users, Award, Settings,
  Eye, EyeOff, CheckCircle, XCircle
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  price: string;
  originalPrice: string;
  features: string[];
  technologies: string[];
  highlights: string[];
  curriculum: {
    week: string;
    title: string;
    topics: string[];
  }[];
  careerOutcomes: string[];
  isActive: boolean;
}

const AdminCourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Course | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const auth = SimpleAuth.getInstance();

  // Authentication check
  useEffect(() => {
    console.log('🔐 AdminCourseManagement: Checking authentication...');

    if (!auth.isAuthenticated()) {
      console.log('❌ Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const userInfo = auth.getCurrentUser();
    console.log('👤 Authenticated user accessing course management:', userInfo?.role);
  }, [navigate]);

  // Load shared course data
  useEffect(() => {
    const sharedCourses = getCourses();
    setCourses(sharedCourses);
  }, []);

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setEditForm({ ...course });
    setIsEditing(true);
  };

  const handleSaveCourse = () => {
    if (!editForm) return;

    // Update local state
    setCourses(prev => prev.map(course =>
      course.id === editForm.id ? editForm : course
    ));

    // Save to shared storage - this updates Services page too!
    updateCourse(editForm);
    saveCourses(courses.map(course =>
      course.id === editForm.id ? editForm : course
    ));

    setIsEditing(false);
    setSelectedCourse(editForm);
    setEditForm(null);

    alert('✅ Course updated! Changes will appear on Services page.');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const toggleCourseStatus = (courseId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, isActive: !course.isActive } : course
    );

    setCourses(updatedCourses);
    saveCourses(updatedCourses);

    const course = updatedCourses.find(c => c.id === courseId);
    alert(`✅ Course ${course?.isActive ? 'activated' : 'deactivated'}! Changes reflected on Services page.`);
  };

  const handleArrayFieldChange = (field: keyof Course, index: number, value: string) => {
    if (!editForm) return;
    
    const updatedArray = [...(editForm[field] as string[])];
    updatedArray[index] = value;
    setEditForm({ ...editForm, [field]: updatedArray });
  };

  const addArrayItem = (field: keyof Course) => {
    if (!editForm) return;
    
    const updatedArray = [...(editForm[field] as string[]), ''];
    setEditForm({ ...editForm, [field]: updatedArray });
  };

  const removeArrayItem = (field: keyof Course, index: number) => {
    if (!editForm) return;
    
    const updatedArray = (editForm[field] as string[]).filter((_, i) => i !== index);
    setEditForm({ ...editForm, [field]: updatedArray });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-premium-dark/95 via-premium-bronze/95 to-premium-gold/95 backdrop-blur-md border-b border-premium-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin-dashboard" 
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-bold text-white">Course Management</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-sm">
                {courses.filter(c => c.isActive).length} Active Courses
              </span>
              <button
                onClick={() => {
                  auth.logout();
                  navigate('/login');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-900/30 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  All Courses
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedCourse?.id === course.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-amber-600/50'
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{course.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                          <span className="text-xs text-amber-400 font-medium">{course.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseStatus(course.id);
                          }}
                          className={`p-1 rounded ${
                            course.isActive
                              ? 'text-green-400 hover:bg-green-500/20'
                              : 'text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {course.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCourse(course);
                          }}
                          className="p-1 text-amber-400 hover:bg-amber-500/20 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Details/Edit Form */}
          <div className="lg:col-span-2">
            {!selectedCourse ? (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-900/30 p-12 text-center">
                <BookOpen className="w-16 h-16 text-amber-400/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Course</h3>
                <p className="text-gray-400">Choose a course from the list to view or edit its details</p>
              </div>
            ) : isEditing && editForm ? (
              /* Edit Form */
              <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-900/30 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    Editing: {editForm.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCourse}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Course Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Duration</label>
                      <input
                        type="text"
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Level</label>
                      <input
                        type="text"
                        value={editForm.level}
                        onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Price</label>
                      <input
                        type="text"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Course Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">Course Features</label>
                      <button
                        onClick={() => addArrayItem('features')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editForm.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                          />
                          <button
                            onClick={() => removeArrayItem('features', index)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">Technologies</label>
                      <button
                        onClick={() => addArrayItem('technologies')}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Technology
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editForm.technologies.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => handleArrayFieldChange('technologies', index, e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                          />
                          <button
                            onClick={() => removeArrayItem('technologies', index)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-900/30 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-400" />
                    {selectedCourse.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCourse.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedCourse.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <button
                      onClick={() => handleEditCourse(selectedCourse)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Course
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                  {/* Course Info */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <p className="text-white font-semibold">{selectedCourse.duration}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">Level</span>
                      </div>
                      <p className="text-white font-semibold">{selectedCourse.level}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">Price</span>
                      </div>
                      <p className="text-white font-semibold">{selectedCourse.price}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedCourse.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedCourse.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-white bg-slate-800/50 p-3 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm border border-amber-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseManagement;
