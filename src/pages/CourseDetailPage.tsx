import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, CheckCircle, Menu, X, Send, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { courses } from "@/data/mockData";
import { useCertificates } from "@/contexts/CertificateContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";

const mentorMap: Record<string, string> = {
  "py-101": "Dr. Anil Kumar",
  "py-201": "Dr. Anil Kumar",
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const { addCertificate, triggerCelebration } = useCertificates();
  const { isEnrolled, currentStudentId, updateProgress, getStudentProgress } = useEnrollment();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(
    new Set(course.lessons.map((l, i) => (l.completed ? i : -1)).filter((i) => i >= 0))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState("");

  const enrolled = isEnrolled(currentStudentId, courseId || "");

  if (!enrolled) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full shadow-card border-border">
          <CardContent className="p-8 text-center space-y-4">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
            <p className="text-muted-foreground">You are not enrolled in this course. Please contact your admin to get access.</p>
            <Link to="/courses">
              <Button className="w-full">Back to My Courses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lesson = course.lessons[currentIdx];
  const progress = Math.round((completed.size / course.lessons.length) * 100);

  const markComplete = () => {
    const newCompleted = new Set(completed).add(currentIdx);
    setCompleted(newCompleted);
    toast.success("Lesson marked as complete!");

    // Update enrollment progress
    updateProgress(currentStudentId, courseId || "", newCompleted.size);

    // Check if all lessons are now completed
    if (newCompleted.size === course.lessons.length) {
      const mentor = mentorMap[course.id] || "Instructor";
      addCertificate(course.title, mentor);
      triggerCelebration(course.title);
    }
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes((prev) => [...prev, noteInput.trim()]);
    setNoteInput("");
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Mobile sidebar toggle */}
      <Button variant="ghost" size="icon" className="absolute top-16 left-2 z-30 lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Left sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-20 w-72 h-full bg-card border-r border-border overflow-y-auto transition-transform`}>
        <div className="p-4">
          <h2 className="font-bold text-foreground mb-1">{course.title}</h2>
          <p className="text-xs text-muted-foreground mb-3">{course.lessons.length} lessons</p>
        </div>
        <nav className="space-y-0.5 px-2 pb-4">
          {course.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => { setCurrentIdx(i); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                i === currentIdx ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              {completed.has(i) ? <CheckCircle className="h-4 w-4 shrink-0 text-accent" /> : <Play className="h-3 w-3 shrink-0" />}
              <span className="truncate">{l.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {/* Video placeholder */}
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-6">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">{lesson.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">{lesson.type === "video" ? "Video" : "Text"} · {lesson.duration}</p>

            <div className="prose prose-sm max-w-none text-foreground mb-6">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={markComplete} disabled={completed.has(currentIdx)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <CheckCircle className="h-4 w-4 mr-1" /> {completed.has(currentIdx) ? "Completed" : "Mark as Complete"}
              </Button>
              <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" disabled={currentIdx === course.lessons.length - 1} onClick={() => setCurrentIdx((p) => p + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Right panel — desktop only */}
      <aside className="hidden xl:block w-72 border-l border-border bg-card overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Progress</h3>
          <Progress value={progress} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Ask a Question</h3>
          <Textarea placeholder="Type your question..." rows={3} className="mb-2" />
          <Button size="sm" className="w-full"><Send className="h-3 w-3 mr-1" /> Submit</Button>
        </div>

        <div>
          <h3 className="font-semibold text-foreground text-sm mb-2">My Notes ({notes.length})</h3>
          <div className="flex gap-2 mb-2">
            <Textarea placeholder="Add a note..." rows={2} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
          </div>
          <Button size="sm" variant="secondary" className="w-full mb-2" onClick={addNote}>Add Note</Button>
          <div className="space-y-2">
            {notes.map((n, i) => (
              <Card key={i} className="border-border"><CardContent className="p-2 text-xs text-foreground">{n}</CardContent></Card>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
