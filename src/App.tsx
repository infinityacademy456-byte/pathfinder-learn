import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LearningPaths from "./pages/LearningPaths";
import CourseViewer from "./pages/CourseViewer";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursesPage from "./pages/CoursesPage";
import PracticeZone from "./pages/PracticeZone";
import QuizPage from "./pages/QuizPage";
import Projects from "./pages/Projects";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import StudentProfile from "./pages/StudentProfile";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import Certificates from "./pages/Certificates";
import StudentCertificates from "./pages/StudentCertificates";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/paths" element={<LearningPaths />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/course-viewer/:courseId" element={<CourseViewer />} />
            <Route path="/practice" element={<PracticeZone />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/profile-old" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/certificates" element={<StudentCertificates />} />
            <Route path="/certificates-old" element={<Certificates />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
