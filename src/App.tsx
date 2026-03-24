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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
