import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StudentLayout } from "@/components/StudentLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { MentorLayout } from "@/components/MentorLayout";
import { CertificateProvider } from "@/contexts/CertificateContext";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import Projects from "./pages/Projects";
import ProjectViewer from "./pages/ProjectViewer";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import Leaderboard from "./pages/Leaderboard";
import StudentProfile from "./pages/StudentProfile";
import Certificates from "./pages/Certificates";
import StudentMentorHub from "./pages/StudentMentorHub";

import AdminOverview from "./pages/admin/AdminOverview";
import AdminPublish from "./pages/admin/AdminPublish";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAssessments from "./pages/admin/AdminAssessments";
import AdminSettings from "./pages/admin/AdminSettings";
import ManageEnrollments from "./pages/admin/ManageEnrollments";
import Analytics from "./pages/Analytics";

import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorBatches from "./pages/mentor/MentorBatches";
import MentorClasses from "./pages/mentor/MentorClasses";
import MentorMaterials from "./pages/mentor/MentorMaterials";
import MentorTasks from "./pages/mentor/MentorTasks";
import MentorEvaluations from "./pages/mentor/MentorEvaluations";
import MentorProjects from "./pages/mentor/MentorProjects";
import MentorAttendance from "./pages/mentor/MentorAttendance";
import MentorQueries from "./pages/mentor/MentorQueries";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CertificateProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Student routes */}
            <Route element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectViewer />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/mentor-hub" element={<StudentMentorHub />} />
            </Route>

            {/* Mentor routes */}
            <Route element={<ProtectedRoute role="mentor"><MentorLayout /></ProtectedRoute>}>
              <Route path="/mentor" element={<MentorDashboard />} />
              <Route path="/mentor/batches" element={<MentorBatches />} />
              <Route path="/mentor/classes" element={<MentorClasses />} />
              <Route path="/mentor/materials" element={<MentorMaterials />} />
              <Route path="/mentor/tasks" element={<MentorTasks />} />
              <Route path="/mentor/evaluations" element={<MentorEvaluations />} />
              <Route path="/mentor/projects" element={<MentorProjects />} />
              <Route path="/mentor/attendance" element={<MentorAttendance />} />
              <Route path="/mentor/queries" element={<MentorQueries />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/publish" element={<AdminPublish />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/enrollments" element={<ManageEnrollments />} />
              <Route path="/admin/assessments" element={<AdminAssessments />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CertificateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
