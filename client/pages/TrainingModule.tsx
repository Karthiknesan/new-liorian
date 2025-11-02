import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, BookOpen, Award, BarChart3, Download, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import DashboardNavigation from '../components/DashboardNavigation';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ModuleDataManager, { TrainingModule, Course } from '../utils/moduleDataManager';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string[];
  quiz: Quiz;
  completed: boolean;
  score?: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number; // minutes
  passingScore: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  completedModules: string[];
  quizScores: { [moduleId: string]: number };
  totalProgress: number;
  timeSpent: number;
  lastAccessed: string;
}

export default function TrainingModule() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nextModule, setNextModule] = useState<TrainingModule | null>(null);
  const [prevModule, setPrevModule] = useState<TrainingModule | null>(null);

  const moduleDataManager = ModuleDataManager.getInstance();

  useEffect(() => {
    if (!courseId || !moduleId) {
      setIsLoading(false);
      return;
    }

    // Load module from ModuleDataManager
    const module = moduleDataManager.getModule(courseId, moduleId);
    const course = moduleDataManager.getCourse(courseId);

    if (module && course) {
      setCurrentModule(module);
      setCurrentCourse(course);

      // Get next and previous modules
      setNextModule(moduleDataManager.getNextModule(courseId, module.id));
      setPrevModule(moduleDataManager.getPreviousModule(courseId, module.id));

      // Load or initialize user progress
      const progress = moduleDataManager.getUserProgress('current-user', courseId) || {
        userId: 'current-user',
        courseId: courseId,
        moduleId: moduleId,
        completedModules: [],
        quizScores: {},
        totalProgress: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString()
      };
      setUserProgress(progress);
    }

    setIsLoading(false);
  }, [courseId, moduleId]);

  const handleNextSlide = () => {
    if (currentModule && currentSlide < currentModule.content.length - 1) {
      setCurrentSlide(currentSlide + 1);
      trackProgress();
    } else {
      setShowQuiz(true);
    }
  };

  const handleNextModule = () => {
    if (nextModule && courseId) {
      navigate(`/training-module/${courseId}/${nextModule.order}`);
    }
  };

  const handlePrevModule = () => {
    if (prevModule && courseId) {
      navigate(`/training-module/${courseId}/${prevModule.order}`);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const trackProgress = async () => {
    try {
      const progressData = {
        userId: userProgress?.userId || 'current-user',
        courseId,
        moduleId,
        slideNumber: currentSlide + 1,
        timestamp: new Date().toISOString(),
        timeSpent: Date.now()
      };

      // Update local storage via ModuleDataManager
      if (courseId && moduleId) {
        moduleDataManager.updateUserProgress(
          progressData.userId,
          courseId,
          moduleId,
          {
            slideNumber: progressData.slideNumber,
            lastAccessed: progressData.timestamp,
            timeSpent: progressData.timeSpent
          }
        );
      }

      // Also send to backend API if available
      try {
        await fetch('/api/training/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progressData)
        });
      } catch (apiError) {
        console.log('API not available, progress saved locally');
      }
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  };

  const generateProgressReport = async () => {
    try {
      const response = await fetch(`/api/training/report/${userProgress?.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-report-${userProgress?.userId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training module...</p>
        </div>
      </div>
    );
  }

  if (!currentModule) {
    const handleApplyForCourse = () => {
      navigate('/', { state: { scrollToApplication: true } });
      // Small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const applicationSection = document.getElementById('application-form');
        if (applicationSection) {
          applicationSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Module Not Found</h2>
          <p className="text-gray-600 mb-6">
            This training module is not available or you may not have access to it.
            To access training modules, you need to apply for a course first.
          </p>
          <div className="space-y-3">
            <Button onClick={handleApplyForCourse} className="w-full bg-blue-600 hover:bg-blue-700">
              Apply for This Course
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Home
            </Button>
            <p className="text-sm text-gray-500">
              Need help? Contact: <span className="font-semibold">training@liorian.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentSlide + 1) / currentModule.content.length) * 100;

  return (
    <>
      <DashboardNavigation
        userType="candidate"
        userName="Student"
        showSearchModal={setShowSearchModal}
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{currentCourse?.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentModule.title}</h1>
            <p className="text-sm text-gray-500">{currentCourse?.title} • Week {currentModule.week}</p>
          </div>
        </div>
        <p className="text-gray-600 mt-2">{currentModule.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {currentModule.duration}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {currentModule.content.length} items
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Module {currentModule.order}
          </Badge>
        </div>
      </div>
              <div className="text-right">
                <Button 
                  onClick={generateProgressReport}
                  variant="outline" 
                  className="flex items-center gap-2 mb-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
                <p className="text-sm text-gray-500">Progress: {Math.round(progressPercentage)}%</p>
                <Progress value={progressPercentage} className="w-32 mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Module Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentModule.content.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                          index === currentSlide
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : index < currentSlide
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <div className="flex items-center gap-2">
                          {index < currentSlide ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : index === currentSlide ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs opacity-75">{item.type} • {item.duration}min</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completion</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Slide {currentSlide + 1} of {currentModule.content.length}</p>
                      <p>Time spent: {userProgress?.timeSpent || 0} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {!showQuiz ? (
                <Card className="min-h-[500px]">
                  <CardHeader>
                    <CardTitle className="text-2xl">{currentModule.content[currentSlide]?.title}</CardTitle>
                    <p className="text-gray-600">{currentModule.content[currentSlide]?.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {(() => {
                        const content = currentModule.content[currentSlide];
                        if (!content) return null;

                        switch (content.type) {
                          case 'video':
                            return (
                              <div className="bg-gray-900 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                                <div className="text-white">
                                  <Play className="w-16 h-16 mx-auto mb-4" />
                                  <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                                  <p className="text-gray-300 mb-4">{content.description}</p>
                                  <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Play className="w-4 h-4 mr-2" />
                                    Play Video ({content.duration} min)
                                  </Button>
                                </div>
                              </div>
                            );

                          case 'text':
                            return (
                              <div className="bg-white p-8 rounded-lg border min-h-[400px]">
                                <div className="prose max-w-none">
                                  <div className="mb-6">
                                    <FileText className="w-12 h-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{content.title}</h3>
                                  </div>
                                  <div className="text-gray-700 leading-relaxed space-y-4">
                                    <p>{content.content}</p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-900 mb-2">Key Learning Points:</h4>
                                      <ul className="list-disc list-inside text-blue-800 space-y-1">
                                        {currentModule.objectives.map((obj, i) => (
                                          <li key={i}>{obj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );

                          case 'assignment':
                            return (
                              <div className="bg-orange-50 p-8 rounded-lg border border-orange-200 min-h-[400px]">
                                <div className="text-center mb-6">
                                  <Award className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.title}</h3>
                                  <p className="text-gray-600">{content.description}</p>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Assignment Details:</h4>
                                    <p className="text-gray-700">{content.content}</p>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Assignments for this module:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                      {currentModule.assignments.map((assignment, i) => (
                                        <li key={i} className="text-gray-700">{assignment}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="text-center">
                                    <Button className="bg-orange-600 hover:bg-orange-700">
                                      Start Assignment
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );

                          case 'resource':
                            return (
                              <div className="bg-green-50 p-8 rounded-lg border border-green-200 min-h-[400px]">
                                <div className="text-center mb-6">
                                  <BookOpen className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{content.title}</h3>
                                  <p className="text-gray-600">{content.description}</p>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">Available Resources:</h4>
                                    <ul className="space-y-2">
                                      {currentModule.resources.map((resource, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                          <Download className="w-4 h-4 text-green-600" />
                                          {resource}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="text-center">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                      <Download className="w-4 h-4 mr-2" />
                                      Download Resources
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );

                          default:
                            return (
                              <div className="bg-gray-50 p-8 rounded-lg text-center min-h-[300px] flex items-center justify-center">
                                <div>
                                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{content.title}</h3>
                                  <p className="text-gray-600">{content.content}</p>
                                </div>
                              </div>
                            );
                        }
                      })()}
                    </div>

                    {/* Navigation Controls */}
                    <div className="space-y-4 mt-8">
                      <div className="flex justify-between">
                        <Button
                          onClick={handlePrevSlide}
                          disabled={currentSlide === 0}
                          variant="outline"
                        >
                          Previous
                        </Button>
                        <div className="text-sm text-gray-500 flex items-center">
                          {currentSlide + 1} / {currentModule.content.length}
                        </div>
                        <Button
                          onClick={handleNextSlide}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {currentSlide === currentModule.content.length - 1 ? 'Take Quiz' : 'Next'}
                        </Button>
                      </div>

                      {/* Module Navigation */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          {prevModule ? (
                            <Button
                              onClick={handlePrevModule}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Previous Module: {prevModule.title}
                            </Button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                        <div>
                          {nextModule ? (
                            <Button
                              onClick={handleNextModule}
                              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            >
                              Next Module: {nextModule.title}
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigate('/services')}
                              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                            >
                              Course Complete!
                              <Award className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <QuizComponent 
                  quiz={currentModule.quiz} 
                  onComplete={(score) => {
                    console.log('Quiz completed with score:', score);
                    // Handle quiz completion
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Quiz Component
function QuizComponent({ quiz, onComplete }: { quiz: Quiz; onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert to seconds
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    setShowResults(true);
    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= quiz.passingScore;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className={`w-6 h-6 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score}%
            </div>
            <p className={`text-xl ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed ? 'Congratulations! You passed!' : 'You need to score at least ' + quiz.passingScore + '% to pass.'}
            </p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <p className="font-semibold mb-2">{question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : optionIndex === answers[index] && answers[index] !== question.correctAnswer
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && ' ✓'}
                      {optionIndex === answers[index] && answers[index] !== question.correctAnswer && ' ✗'}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">{question.explanation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-500">Time Remaining</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={(currentQuestion / quiz.questions.length) * 100} />
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {quiz.questions[currentQuestion].question}
          </h3>
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  answers[currentQuestion] === index
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={answers.length !== quiz.questions.length}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={answers[currentQuestion] === undefined}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
