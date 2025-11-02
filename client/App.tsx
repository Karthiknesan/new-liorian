import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AuthManager from "./utils/authManager";
import Index from "./pages/Index";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import SuccessStories from "./pages/SuccessStories";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CourseLearningPath from "./pages/CourseLearningPath";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseManagement from "./pages/AdminCourseManagement";
import UserManagement from "./pages/UserManagement";
import RealUserManagement from "./pages/RealUserManagement";
import BlogManagementPage from "./pages/BlogManagementPage";
import BlogAdminManagement from "./pages/BlogAdminManagement";
import CandidateDashboard from "./pages/CandidateDashboard";
import Login from "./pages/Login";
import NewsletterManagement from "./pages/NewsletterManagement";

import StaffDashboard from "./pages/StaffDashboard";
import TrainingModule from "./pages/TrainingModule";
import ModuleManagement from "./pages/ModuleManagement";
import StudentMaterials from "./pages/StudentMaterials";
import PasswordManagement from "./pages/PasswordManagement";

import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  // Initialize auth manager (no aggressive session checking)
  React.useEffect(() => {
    try {
      const authManager = AuthManager.getInstance();
      authManager.initialize();
    } catch (error) {
      console.error('Error initializing AuthManager:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogArticle />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/learning-path" element={<CourseLearningPath />} />
              <Route path="/learning-path/:courseId" element={<CourseLearningPath />} />
              <Route path="/candidate-training" element={<CandidateDashboard />} />
              <Route path="/materials/:courseId" element={<StudentMaterials />} />
              <Route path="/password-management" element={<PasswordManagement />} />
              <Route path="/login" element={<Login />} />

              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-course-management" element={<AdminCourseManagement />} />
              <Route path="/user-management" element={<RealUserManagement />} />
              <Route path="/blog-management" element={<BlogManagementPage />} />
              <Route path="/blog-admin" element={<BlogAdminManagement />} />
              <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/training-module/:courseId/:moduleId" element={<TrainingModule />} />
              <Route path="/module-management" element={<ModuleManagement />} />
              <Route path="/newsletter-management" element={<NewsletterManagement />} />


              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
