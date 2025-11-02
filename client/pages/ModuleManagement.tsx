import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Eye, Copy, Download, Upload, ArrowLeft } from 'lucide-react';
import DashboardNavigation from '../components/DashboardNavigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface ModuleContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource';
  content: string;
  duration: number; // in minutes
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  attempts: number;
}

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  points: number;
}

interface TrainingModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  week: string;
  duration: string;
  objectives: string[];
  topics: string[];
  assignments: string[];
  resources: string[];
  content: ModuleContent[];
  quiz?: Quiz;
  prerequisites: string[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
  isActive: boolean;
}

export default function ModuleManagement() {
  const [courses] = useState<Course[]>([
    { id: 'cloud-computing', title: 'Cloud Computing', description: 'AWS, Azure, GCP', icon: '☁️', duration: '16 weeks', level: 'Beginner', isActive: true },
    { id: 'data-analyst', title: 'Data Analyst', description: 'Python, SQL, Tableau', icon: '📊', duration: '14 weeks', level: 'Beginner', isActive: true },
    { id: 'data-scientist', title: 'Data Scientists', description: 'ML, AI, Python', icon: '🔬', duration: '20 weeks', level: 'Advanced', isActive: true },
    { id: 'cybersecurity', title: 'Cybersecurity', description: 'Ethical Hacking, Security', icon: '🔐', duration: '18 weeks', level: 'Intermediate', isActive: true },
    { id: 'devops', title: 'DevOps', description: 'Docker, Kubernetes, CI/CD', icon: '⚙️', duration: '16 weeks', level: 'Intermediate', isActive: true },
    { id: 'python-fullstack', title: 'Python Full-Stack', description: 'Django, React, APIs', icon: '🐍', duration: '24 weeks', level: 'Beginner', isActive: true },
    { id: 'java-fullstack', title: 'Java Full-Stack', description: 'Spring Boot, React', icon: '��', duration: '26 weeks', level: 'Beginner', isActive: true },
    { id: 'banking-finance', title: 'Banking & Finance', description: 'Financial Analysis, Excel', icon: '🏦', duration: '12 weeks', level: 'Beginner', isActive: true },
    { id: 'digital-marketing', title: 'Digital Marketing', description: 'SEO, SEM, Social Media', icon: '📱', duration: '10 weeks', level: 'Beginner', isActive: true },
    { id: 'project-management', title: 'Project Management', description: 'Agile, Scrum, PMP', icon: '📋', duration: '8 weeks', level: 'Intermediate', isActive: true }
  ]);

  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load modules from API or localStorage
  useEffect(() => {
    const savedModules = localStorage.getItem('trainingModules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    } else {
      // Initialize with sample modules
      setModules(generateSampleModules());
    }
  }, []);

  const generateSampleModules = (): TrainingModule[] => {
    const sampleModules: TrainingModule[] = [];
    
    courses.forEach((course, courseIndex) => {
      const moduleCount = course.id === 'digital-marketing' ? 5 : course.id === 'project-management' ? 4 : 8;
      
      for (let i = 1; i <= moduleCount; i++) {
        sampleModules.push({
          id: `${course.id}-module-${i}`,
          courseId: course.id,
          title: `${course.title} Module ${i}`,
          description: `Comprehensive module ${i} for ${course.title} covering essential concepts and practical applications.`,
          week: `${i * 2 - 1}-${i * 2}`,
          duration: '2 weeks',
          objectives: [
            `Master fundamental concepts of module ${i}`,
            `Apply practical skills in real scenarios`,
            `Complete hands-on projects and assignments`
          ],
          topics: [
            `Introduction to Module ${i} concepts`,
            `Practical applications and use cases`,
            `Advanced techniques and best practices`,
            `Industry standards and frameworks`
          ],
          assignments: [
            `Practical exercise ${i}`,
            `Case study analysis`,
            `Project implementation`
          ],
          resources: [
            `Module ${i} documentation`,
            `Video tutorials and guides`,
            `Practice exercises`,
            `Additional reading materials`
          ],
          content: [
            {
              id: `${course.id}-content-${i}-1`,
              title: `Introduction to ${course.title} Module ${i}`,
              description: 'Overview and learning objectives',
              type: 'text',
              content: `Welcome to Module ${i} of ${course.title}. This module will cover...`,
              duration: 30,
              order: 1
            },
            {
              id: `${course.id}-content-${i}-2`,
              title: `Video Lecture ${i}`,
              description: 'Core concepts explained',
              type: 'video',
              content: 'video-url-placeholder',
              duration: 45,
              order: 2
            }
          ],
          quiz: {
            id: `${course.id}-quiz-${i}`,
            title: `Module ${i} Assessment`,
            timeLimit: 30,
            passingScore: 70,
            attempts: 3,
            questions: [
              {
                id: `${course.id}-q-${i}-1`,
                question: `What is the main concept covered in ${course.title} Module ${i}?`,
                type: 'multiple-choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 1,
                explanation: 'This is the correct answer because...',
                points: 10
              }
            ]
          },
          prerequisites: i > 1 ? [`${course.id}-module-${i - 1}`] : [],
          isActive: true,
          order: i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin'
        });
      }
    });
    
    return sampleModules;
  };

  const saveModules = (updatedModules: TrainingModule[]) => {
    setModules(updatedModules);
    localStorage.setItem('trainingModules', JSON.stringify(updatedModules));
  };

  const filteredModules = modules
    .filter(module => {
      const matchesCourse = selectedCourse && selectedCourse !== 'all' ? module.courseId === selectedCourse : true;
      const matchesSearch = searchTerm ?
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesStatus = filterStatus === 'all' ? true :
        filterStatus === 'active' ? module.isActive : !module.isActive;

      return matchesCourse && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // First sort by course, then by order within course
      if (a.courseId !== b.courseId) {
        return a.courseId.localeCompare(b.courseId);
      }
      return a.order - b.order;
    });

  const handleCreateModule = () => {
    setCurrentModule(null);
    setIsCreateModalOpen(true);
  };

  const handleEditModule = (module: TrainingModule) => {
    setCurrentModule(module);
    setIsEditModalOpen(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      const updatedModules = modules.filter(m => m.id !== moduleId);
      saveModules(updatedModules);
    }
  };

  const handleDuplicateModule = (module: TrainingModule) => {
    const newModule: TrainingModule = {
      ...module,
      id: `${module.id}-copy-${Date.now()}`,
      title: `${module.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedModules = [...modules, newModule];
    saveModules(updatedModules);
  };

  const handleToggleStatus = (moduleId: string) => {
    const updatedModules = modules.map(m => 
      m.id === moduleId ? { ...m, isActive: !m.isActive, updatedAt: new Date().toISOString() } : m
    );
    saveModules(updatedModules);
  };

  const exportModules = () => {
    const dataStr = JSON.stringify(modules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'training-modules.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importModules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedModules = JSON.parse(e.target?.result as string);
          if (confirm('This will replace all existing modules. Continue?')) {
            saveModules(importedModules);
          }
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <DashboardNavigation
        userType="admin"
        userName="Module Manager"
        showSearchModal={setShowSearchModal}
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Link
                    to="/admin-dashboard"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    ← Back to Dashboard
                  </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Module Management</h1>
                <p className="text-gray-600 mt-2">Create, edit, and manage training modules for all courses</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={importModules}
                  className="hidden"
                  id="import-modules"
                />
                <label
                  htmlFor="import-modules"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </label>
                <Button
                  onClick={exportModules}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  onClick={handleCreateModule}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Module
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.icon} {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Modules</p>
                    <p className="text-2xl font-bold">{modules.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Modules</p>
                    <p className="text-2xl font-bold">{modules.filter(m => m.isActive).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">���</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold">{courses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Modules/Course</p>
                    <p className="text-2xl font-bold">{Math.round(modules.length / courses.length)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Info Header (when specific course selected) */}
          {selectedCourse !== 'all' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                {courses.find(c => c.id === selectedCourse) && (
                  <>
                    <span className="text-4xl">{courses.find(c => c.id === selectedCourse)?.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {courses.find(c => c.id === selectedCourse)?.title} Modules
                      </h2>
                      <p className="text-gray-600">
                        {courses.find(c => c.id === selectedCourse)?.description} •
                        Duration: {courses.find(c => c.id === selectedCourse)?.duration} •
                        Level: {courses.find(c => c.id === selectedCourse)?.level}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        📊 {filteredModules.length} modules • {filteredModules.filter(m => m.isActive).length} active
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Course Sections (when All Courses selected) */}
          {selectedCourse === 'all' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📚 All Courses - Module Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                {courses.map(course => {
                  const courseModules = modules.filter(m => m.courseId === course.id);
                  const activeModules = courseModules.filter(m => m.isActive);
                  return (
                    <div
                      key={course.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{course.icon}</div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{course.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{course.level}</p>
                        <div className="bg-blue-50 rounded px-2 py-1">
                          <span className="text-xs font-medium text-blue-600">
                            {courseModules.length} modules
                          </span>
                        </div>
                        <div className="bg-green-50 rounded px-2 py-1 mt-1">
                          <span className="text-xs font-medium text-green-600">
                            {activeModules.length} active
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const course = courses.find(c => c.id === module.courseId);
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{course?.icon}</span>
                        <div>
                          <CardTitle className="text-lg">
                            Module {module.order}: {module.title.replace(/^Module \d+:?\s*/, '')}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{course?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={module.isActive ? "default" : "secondary"}>
                          {module.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Week:</span>
                        <span className="ml-2 font-medium">{module.week}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 font-medium">{module.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Content:</span>
                        <span className="ml-2 font-medium">{module.content.length} items</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quiz:</span>
                        <span className="ml-2 font-medium">{module.quiz ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditModule(module)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateModule(module)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={module.isActive ? "secondary" : "default"}
                        onClick={() => handleToggleStatus(module.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        {module.isActive ? 'Hide' : 'Show'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteModule(module.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-500 mb-6">Create your first module or adjust your filters</p>
              <Button onClick={handleCreateModule} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Module
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Module Modal would go here */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <ModuleEditor
          module={currentModule}
          courses={courses}
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
          onSave={(module) => {
            if (currentModule) {
              // Edit existing module
              const updatedModules = modules.map(m => 
                m.id === module.id ? { ...module, updatedAt: new Date().toISOString() } : m
              );
              saveModules(updatedModules);
            } else {
              // Create new module
              const newModule = {
                ...module,
                id: `module-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'admin'
              };
              saveModules([...modules, newModule]);
            }
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}

// Module Editor Component
interface ModuleEditorProps {
  module: TrainingModule | null;
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (module: TrainingModule) => void;
}

function ModuleEditor({ module, courses, isOpen, onClose, onSave }: ModuleEditorProps) {
  const [formData, setFormData] = useState<Partial<TrainingModule>>({
    courseId: undefined,
    title: '',
    description: '',
    week: '',
    duration: '',
    objectives: [''],
    topics: [''],
    assignments: [''],
    resources: [''],
    content: [],
    prerequisites: [],
    isActive: true,
    order: 1
  });

  useEffect(() => {
    if (module) {
      setFormData(module);
    }
  }, [module]);

  const handleSave = () => {
    if (!formData.courseId || !formData.title) {
      alert('Please fill in required fields');
      return;
    }
    
    onSave(formData as TrainingModule);
  };

  const addArrayItem = (field: keyof TrainingModule, value: string = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value]
    }));
  };

  const updateArrayItem = (field: keyof TrainingModule, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: keyof TrainingModule, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {module ? 'Edit Module' : 'Create New Module'}
            </h2>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Course *</label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.icon} {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Module Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter module title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Week</label>
              <Input
                value={formData.week}
                onChange={(e) => setFormData(prev => ({ ...prev, week: e.target.value }))}
                placeholder="e.g., 1-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2 weeks"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Module description"
              rows={3}
            />
          </div>

          {/* Dynamic Arrays */}
          {['objectives', 'topics', 'assignments', 'resources'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
              <div className="space-y-2">
                {(formData[field as keyof TrainingModule] as string[])?.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateArrayItem(field as keyof TrainingModule, index, e.target.value)}
                      placeholder={`Enter ${field.slice(0, -1)}`}
                    />
                    <Button
                      variant="outline"
                      onClick={() => removeArrayItem(field as keyof TrainingModule, index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(field as keyof TrainingModule)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {field.slice(0, -1)}
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active Module</label>
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Module
          </Button>
        </div>
      </div>
    </div>
  );
}
