import React, { useState } from "react";
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Settings, 
  Users, 
  BookOpen,
  Award,
  Clock,
  Target,
  DollarSign,
  CheckCircle
} from "lucide-react";

interface CourseModule {
  id: string;
  week: string;
  title: string;
  description: string;
  topics: string[];
  objectives: string[];
  assignments: string[];
  resources: string[];
  duration: string;
}

interface Course {
  id: string;
  icon: string;
  title: string;
  desc: string;
  detailedDescription: string;
  duration: string;
  level: string;
  averageSalary: string;
  placementRate: string;
  technologies: string[];
  features: string[];
  prerequisites: string[];
  careerOutcomes: string[];
  industryPartners: string[];
  certification: string;
  learningPath: CourseModule[];
  syllabus: {
    introduction: string;
    modules: CourseModule[];
    projects: string[];
    assessments: string[];
  };
}

interface CourseManagementProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export default function CourseManagement({ courses, onCoursesUpdate, userRole }: CourseManagementProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'syllabus' | 'settings'>('overview');

  const canEdit = userRole === 'admin' || userRole === 'editor';
  const canDelete = userRole === 'admin';

  const handleSaveCourse = () => {
    if (editingCourse) {
      const updatedCourses = courses.map(course => 
        course.id === editingCourse.id ? editingCourse : course
      );
      onCoursesUpdate(updatedCourses);
      setEditingCourse(null);
      setSelectedCourse(editingCourse);
    }
  };

  const handleAddModule = () => {
    if (editingCourse) {
      const newModule: CourseModule = {
        id: Date.now().toString(),
        week: `${editingCourse.learningPath.length + 1}`,
        title: "New Module",
        description: "Module description",
        topics: ["Topic 1"],
        objectives: ["Objective 1"],
        assignments: ["Assignment 1"],
        resources: ["Resource 1"],
        duration: "1 week"
      };
      setEditingCourse({
        ...editingCourse,
        learningPath: [...editingCourse.learningPath, newModule]
      });
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    if (editingCourse) {
      setEditingCourse({
        ...editingCourse,
        learningPath: editingCourse.learningPath.filter(module => module.id !== moduleId)
      });
    }
  };

  const updateModule = (moduleId: string, field: keyof CourseModule, value: any) => {
    if (editingCourse) {
      setEditingCourse({
        ...editingCourse,
        learningPath: editingCourse.learningPath.map(module =>
          module.id === moduleId ? { ...module, [field]: value } : module
        )
      });
    }
  };

  const addArrayItem = (moduleId: string, field: 'topics' | 'objectives' | 'assignments' | 'resources') => {
    if (editingCourse) {
      const module = editingCourse.learningPath.find(m => m.id === moduleId);
      if (module) {
        updateModule(moduleId, field, [...module[field], `New ${field.slice(0, -1)}`]);
      }
    }
  };

  const updateArrayItem = (moduleId: string, field: 'topics' | 'objectives' | 'assignments' | 'resources', index: number, value: string) => {
    if (editingCourse) {
      const module = editingCourse.learningPath.find(m => m.id === moduleId);
      if (module) {
        const newArray = [...module[field]];
        newArray[index] = value;
        updateModule(moduleId, field, newArray);
      }
    }
  };

  const removeArrayItem = (moduleId: string, field: 'topics' | 'objectives' | 'assignments' | 'resources', index: number) => {
    if (editingCourse) {
      const module = editingCourse.learningPath.find(m => m.id === moduleId);
      if (module) {
        const newArray = module[field].filter((_, i) => i !== index);
        updateModule(moduleId, field, newArray);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-premium-dark">Course Management</h1>
          <p className="text-premium-dark/70">Manage course content, modules, and learning paths</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddCourse(true)}
            className="premium-gradient text-premium-dark px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 premium-hover flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </button>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <div key={course.id} className="glass-effect rounded-2xl p-6 border border-premium-gold/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{course.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-premium-dark">{course.title}</h3>
                <p className="text-sm text-premium-dark/60">{course.duration} • {course.level}</p>
              </div>
            </div>
            
            <p className="text-sm text-premium-dark/80 mb-4 line-clamp-3">{course.desc}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 px-4 py-2 bg-premium-gold/10 text-premium-dark rounded-lg font-medium hover:bg-premium-gold/20 transition-colors"
              >
                View Details
              </button>
              {canEdit && (
                <button
                  onClick={() => setEditingCourse({ ...course })}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit Course"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-premium-dark to-premium-bronze p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{selectedCourse.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedCourse.title}</h2>
                    <p className="text-premium-gold">{selectedCourse.duration} • {selectedCourse.level}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-premium-gold">{selectedCourse.placementRate}</div>
                  <div className="text-sm text-premium-dark/70">Placement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-premium-gold">{selectedCourse.averageSalary}</div>
                  <div className="text-sm text-premium-dark/70">Average Salary</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-premium-gold">{selectedCourse.technologies.length}+</div>
                  <div className="text-sm text-premium-dark/70">Technologies</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-premium-dark mb-4">Course Overview</h3>
                <p className="text-premium-dark/80 mb-6">{selectedCourse.detailedDescription}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-premium-dark mb-3">Prerequisites</h4>
                    <ul className="space-y-1">
                      {selectedCourse.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-premium-dark mb-3">Career Outcomes</h4>
                    <ul className="space-y-1">
                      {selectedCourse.careerOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-premium-gold" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h4 className="font-bold text-premium-dark mb-3">Learning Modules</h4>
                <div className="space-y-4">
                  {selectedCourse.learningPath.map((module, index) => (
                    <div key={index} className="glass-effect rounded-lg p-4 border border-premium-gold/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-premium-gradient rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-premium-dark font-bold text-sm">{module.week}</span>
                        </div>
                        <div>
                          <h5 className="font-bold text-premium-dark">{module.title}</h5>
                          <p className="text-sm text-premium-dark/70 mb-2">{module.description}</p>
                          <div className="grid md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <strong>Topics:</strong>
                              <ul className="mt-1 space-y-1">
                                {module.topics.map((topic, i) => (
                                  <li key={i} className="text-premium-dark/70">• {topic}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong>Objectives:</strong>
                              <ul className="mt-1 space-y-1">
                                {module.objectives.map((obj, i) => (
                                  <li key={i} className="text-premium-dark/70">• {obj}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-premium-dark to-premium-bronze p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Course: {editingCourse.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCourse}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCourse(null)}
                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Tab Navigation */}
              <div className="flex gap-4 mb-6 border-b">
                {['overview', 'modules', 'syllabus', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-premium-gold border-b-2 border-premium-gold'
                        : 'text-gray-600 hover:text-premium-gold'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-12rem)]">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Course Title</label>
                        <input
                          type="text"
                          value={editingCourse.title}
                          onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Course Icon</label>
                        <input
                          type="text"
                          value={editingCourse.icon}
                          onChange={(e) => setEditingCourse({ ...editingCourse, icon: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-premium-dark mb-2">Short Description</label>
                      <textarea
                        value={editingCourse.desc}
                        onChange={(e) => setEditingCourse({ ...editingCourse, desc: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-premium-dark mb-2">Detailed Description</label>
                      <textarea
                        value={editingCourse.detailedDescription}
                        onChange={(e) => setEditingCourse({ ...editingCourse, detailedDescription: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Duration</label>
                        <input
                          type="text"
                          value={editingCourse.duration}
                          onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Level</label>
                        <select
                          value={editingCourse.level}
                          onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Beginner to Advanced">Beginner to Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Average Salary</label>
                        <input
                          type="text"
                          value={editingCourse.averageSalary}
                          onChange={(e) => setEditingCourse({ ...editingCourse, averageSalary: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-premium-dark mb-2">Placement Rate</label>
                        <input
                          type="text"
                          value={editingCourse.placementRate}
                          onChange={(e) => setEditingCourse({ ...editingCourse, placementRate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-premium-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Modules Tab */}
                {activeTab === 'modules' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-premium-dark">Learning Modules</h3>
                      <button
                        onClick={handleAddModule}
                        className="px-4 py-2 bg-premium-gold text-premium-dark rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Module
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editingCourse.learningPath.map((module, index) => (
                        <div key={module.id} className="glass-effect rounded-lg p-6 border border-premium-gold/20">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-bold text-premium-dark">Module {index + 1}</h4>
                            <button
                              onClick={() => handleDeleteModule(module.id)}
                              className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Week(s)</label>
                              <input
                                type="text"
                                value={module.week}
                                onChange={(e) => updateModule(module.id, 'week', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-premium-gold focus:outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Duration</label>
                              <input
                                type="text"
                                value={module.duration}
                                onChange={(e) => updateModule(module.id, 'duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-premium-gold focus:outline-none text-sm"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Module Title</label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-premium-gold focus:outline-none text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={module.description}
                              onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-premium-gold focus:outline-none text-sm"
                            />
                          </div>

                          {/* Dynamic Arrays */}
                          {(['topics', 'objectives', 'assignments', 'resources'] as const).map((field) => (
                            <div key={field} className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium capitalize">{field}</label>
                                <button
                                  onClick={() => addArrayItem(module.id, field)}
                                  className="text-premium-gold hover:text-premium-dark text-sm flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add
                                </button>
                              </div>
                              <div className="space-y-2">
                                {module[field].map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => updateArrayItem(module.id, field, itemIndex, e.target.value)}
                                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:border-premium-gold focus:outline-none text-sm"
                                    />
                                    <button
                                      onClick={() => removeArrayItem(module.id, field, itemIndex)}
                                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
