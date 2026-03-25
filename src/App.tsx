import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import LearningPaths from "./pages/LearningPaths";
import CourseViewer from "./pages/CourseViewer";
import PracticeZone from "./pages/PracticeZone";
import Projects from "./pages/Projects";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import Certificates from "./pages/Certificates";
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
            <Route path="/paths" element={<LearningPaths />} />
            <Route path="/courses/:courseId" element={<CourseViewer />} />
            <Route path="/practice" element={<PracticeZone />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
