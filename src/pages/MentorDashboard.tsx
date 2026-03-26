import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Video, FileText, Code2, FolderKanban, Users, Plus,
  BarChart3, CheckCircle2, Clock, Trash2, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface MentorCourse {
  id: string;
  title: string;
  level: string;
  lessons: number;
  students: number;
  status: "published" | "draft";
}

interface MentorQuestion {
  id: string;
  question: string;
  type: "mcq" | "coding";
  difficulty: string;
  topic: string;
}

const initialCourses: MentorCourse[] = [
  { id: "mc1", title: "Python Fundamentals", level: "beginner", lessons: 5, students: 128, status: "published" },
  { id: "mc2", title: "Advanced SQL Queries", level: "intermediate", lessons: 8, students: 64, status: "published" },
  { id: "mc3", title: "Intro to NLP", level: "advanced", lessons: 3, students: 0, status: "draft" },
];

const initialQuestions: MentorQuestion[] = [
  { id: "mq1", question: "What is the output of print(type(42))?", type: "mcq", difficulty: "easy", topic: "Python" },
  { id: "mq2", question: "Write a function to reverse a string", type: "coding", difficulty: "medium", topic: "Python" },
];

const students = [
  { name: "Alex Chen", progress: 72, coursesEnrolled: 3, lastActive: "2h ago" },
  { name: "Sarah Kim", progress: 45, coursesEnrolled: 2, lastActive: "1d ago" },
  { name: "Raj Patel", progress: 90, coursesEnrolled: 4, lastActive: "30m ago" },
  { name: "Emma Wilson", progress: 20, coursesEnrolled: 1, lastActive: "3d ago" },
];

export default function MentorDashboard() {
  const [courses, setCourses] = useState(initialCourses);
  const [questions, setQuestions] = useState(initialQuestions);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Course form
  const [courseTitle, setCourseTitle] = useState("");
  const [courseLevel, setCourseLevel] = useState("beginner");

  // Question form
  const [qQuestion, setQQuestion] = useState("");
  const [qType, setQType] = useState<"mcq" | "coding">("mcq");
  const [qDifficulty, setQDifficulty] = useState("easy");
  const [qTopic, setQTopic] = useState("");

  // Project form
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projSteps, setProjSteps] = useState("");

  const handleAddCourse = () => {
    if (!courseTitle.trim()) return;
    setCourses((prev) => [
      ...prev,
      { id: `mc${Date.now()}`, title: courseTitle, level: courseLevel, lessons: 0, students: 0, status: "draft" },
    ]);
    setCourseTitle("");
    setShowCourseForm(false);
  };

  const handleAddQuestion = () => {
    if (!qQuestion.trim()) return;
    setQuestions((prev) => [
      ...prev,
      { id: `mq${Date.now()}`, question: qQuestion, type: qType, difficulty: qDifficulty, topic: qTopic || "General" },
    ]);
    setQQuestion("");
    setQTopic("");
    setShowQuestionForm(false);
  };

  const handleAddProject = () => {
    if (!projTitle.trim()) return;
    // In a real app this would persist
    setProjTitle("");
    setProjDesc("");
    setProjSteps("");
    setShowProjectForm(false);
  };

  const deleteCourse = (id: string) => setCourses((prev) => prev.filter((c) => c.id !== id));
  const deleteQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Mentor Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses, content, and students.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Courses", value: courses.length, icon: BookOpen, color: "text-primary" },
          { label: "Total Students", value: courses.reduce((s, c) => s + c.students, 0), icon: Users, color: "text-accent" },
          { label: "Questions", value: questions.length, icon: Code2, color: "text-info" },
          { label: "Published", value: courses.filter((c) => c.status === "published").length, icon: CheckCircle2, color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="questions">Practice</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowCourseForm(!showCourseForm)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Course
            </Button>
          </div>
          {showCourseForm && (
            <Card className="shadow-card border-border">
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Course title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                <Select value={courseLevel} onValueChange={setCourseLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowCourseForm(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddCourse} className="bg-primary text-primary-foreground">Create</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course.id} className="shadow-card border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{course.level}</span>
                        <span>·</span>
                        <span>{course.lessons} lessons</span>
                        <span>·</span>
                        <span>{course.students} students</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.status === "published" ? "default" : "secondary"} className="text-xs capitalize">
                      {course.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCourse(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowQuestionForm(!showQuestionForm)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>
          {showQuestionForm && (
            <Card className="shadow-card border-border">
              <CardContent className="p-5 space-y-3">
                <Textarea placeholder="Question text" value={qQuestion} onChange={(e) => setQQuestion(e.target.value)} />
                <div className="grid grid-cols-3 gap-3">
                  <Select value={qType} onValueChange={(v) => setQType(v as "mcq" | "coding")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={qDifficulty} onValueChange={setQDifficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Topic" value={qTopic} onChange={(e) => setQTopic(e.target.value)} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowQuestionForm(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddQuestion} className="bg-primary text-primary-foreground">Add</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-3">
            {questions.map((q) => (
              <Card key={q.id} className="shadow-card border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                      {q.type === "mcq" ? <FileText className="h-4 w-4 text-info" /> : <Code2 className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.question}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] capitalize">{q.type}</Badge>
                        <span className="capitalize">{q.difficulty}</span>
                        <span>·</span>
                        <span>{q.topic}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteQuestion(q.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowProjectForm(!showProjectForm)} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </Button>
          </div>
          {showProjectForm && (
            <Card className="shadow-card border-border">
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Project title" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} />
                <Textarea placeholder="Description" value={projDesc} onChange={(e) => setProjDesc(e.target.value)} />
                <Textarea placeholder="Steps (one per line)" value={projSteps} onChange={(e) => setProjSteps(e.target.value)} rows={4} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowProjectForm(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddProject} className="bg-primary text-primary-foreground">Create Project</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="text-sm text-muted-foreground text-center py-8">
            <FolderKanban className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            Projects created here will appear in the student Projects section.
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="space-y-3">
            {students.map((s, i) => (
              <Card key={i} className="shadow-card border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.coursesEnrolled} courses · Last active {s.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{s.progress}%</p>
                      <p className="text-[10px] text-muted-foreground">avg progress</p>
                    </div>
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
