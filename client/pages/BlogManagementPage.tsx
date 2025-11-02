import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogManagement from "../components/BlogManagement";


interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  tags: string[];
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Complete Guide to Cloud Computing Careers in 2024",
      excerpt: "Discover the most in-demand cloud computing roles and skills that will shape your career in 2024 and beyond.",
      content: "Cloud computing has revolutionized how businesses operate, creating numerous career opportunities. In this comprehensive guide, we'll explore the various cloud computing career paths, required skills, and how to get started in this rapidly growing field.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Cloud Computing",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      featured: true,
      tags: ["Cloud Computing", "Career", "AWS", "Azure"]
    },
    {
      id: 2,
      title: "Data Science Roadmap: From Beginner to Expert",
      excerpt: "A step-by-step guide to building your data science skills and landing your first data science role.",
      content: "Data science is one of the fastest-growing fields in technology. This roadmap will guide you through the essential skills, tools, and projects needed to become a successful data scientist.",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "Data Science",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Data Science", "Python", "Machine Learning", "Career"]
    },
    {
      id: 3,
      title: "Top 10 Cybersecurity Skills Employers Want in 2024",
      excerpt: "Learn about the most sought-after cybersecurity skills and how to develop them for career success.",
      content: "As cyber threats continue to evolve, organizations are looking for skilled cybersecurity professionals. Here are the top 10 skills that will make you stand out in the cybersecurity job market.",
      author: "Sarah Johnson",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Cybersecurity",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Cybersecurity", "Security", "Career", "Skills"]
    },
    {
      id: 4,
      title: "DevOps Best Practices for Modern Development Teams",
      excerpt: "Explore essential DevOps practices that can streamline your development workflow and improve team collaboration.",
      content: "DevOps has become essential for modern software development. This article covers the key practices, tools, and methodologies that successful DevOps teams use to deliver high-quality software efficiently.",
      author: "Alex Rodriguez",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "DevOps",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=400&fit=crop",
      featured: false,
      tags: ["DevOps", "CI/CD", "Automation", "Development"]
    },
    {
      id: 5,
      title: "Python vs Java: Which Should You Learn First?",
      excerpt: "A comprehensive comparison of Python and Java to help you choose the right programming language for your career goals.",
      content: "Both Python and Java are excellent programming languages with strong job markets. This detailed comparison will help you understand the strengths of each language and which one aligns better with your career objectives.",
      author: "Priya Sharma",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Programming",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop",
      featured: true,
      tags: ["Python", "Java", "Programming", "Career"]
    },
    {
      id: 6,
      title: "Building Your First Full-Stack Application: A Complete Guide",
      excerpt: "Learn how to build a complete full-stack web application from scratch using modern technologies and best practices.",
      content: "Full-stack development is in high demand. This comprehensive tutorial will walk you through building a complete web application, covering frontend, backend, database design, and deployment strategies.",
      author: "Michael Chen",
      date: "2024-01-03",
      readTime: "15 min read",
      category: "Full-Stack Development",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Full-Stack", "React", "Node.js", "MongoDB"]
    }
  ]);

  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer'>('admin');

  useEffect(() => {
    // Check authentication and determine user role
    const token = localStorage.getItem('adminToken') || localStorage.getItem('staffToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // For demo purposes, set role based on token type
    if (localStorage.getItem('adminToken')) {
      setUserRole('admin');
    } else {
      setUserRole('editor');
    }
  }, []);

  const handlePostsUpdate = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('staffToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header with Back Button */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg">←</span>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">📝 Blog Management</h1>
            </div>
            <div className="text-sm text-gray-500">
              Admin Panel
            </div>
          </div>
        </div>
      </header>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📝 Blog Management</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage blog posts</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/blog"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Blog
              </Link>
              <Link
                to="/admin-dashboard"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <BlogManagement 
            posts={posts}
            onPostsUpdate={handlePostsUpdate}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
}
