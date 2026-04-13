import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Video, HelpCircle, PlusCircle, Trash2, Edit, ToggleLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CATEGORIES = ["Python", "SQL", "Machine Learning", "Web Dev", "Power BI", "Data Analytics"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const MENTORS = ["Dr. Sarah Lin", "Priya Sharma", "Marcus Lee"];

interface PublishedCourse {
  id: string; title: string; description: string; category: string;
  difficulty: string; mentor: string; thumbnail: string; duration: string;
  status: "Published" | "Draft";
}

interface VideoLesson {
  id: string; courseId: string; courseName: string; module: string;
  title: string; url: string; description: string; duration: string; order: number;
}

interface QuizQuestion {
  id: string; text: string; options: [string, string, string, string]; correct: number;
}

interface PublishedQuiz {
  id: string; title: string; courseId: string; courseName: string;
  passScore: number; timeLimit: number; questions: QuizQuestion[];
  status: "Published" | "Draft";
}

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

export default function PublishContent() {
  // Courses state
  const [courses, setCourses] = useState<PublishedCourse[]>([]);
  const [cTitle, setCTitle] = useState(""); const [cDesc, setCDesc] = useState("");
  const [cCat, setCCat] = useState(""); const [cDiff, setCDiff] = useState("");
  const [cMentor, setCMentor] = useState(""); const [cThumb, setCThumb] = useState("");
  const [cDur, setCDur] = useState("");

  // Videos state
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [vCourse, setVCourse] = useState(""); const [vModule, setVModule] = useState("");
  const [vTitle, setVTitle] = useState(""); const [vUrl, setVUrl] = useState("");
  const [vDesc, setVDesc] = useState(""); const [vDur, setVDur] = useState("");
  const [vOrder, setVOrder] = useState("");

  // Quizzes state
  const [quizzes, setQuizzes] = useState<PublishedQuiz[]>([]);
  const [qTitle, setQTitle] = useState(""); const [qCourse, setQCourse] = useState("");
  const [qPass, setQPass] = useState("70"); const [qTime, setQTime] = useState("30");
  const [qQuestions, setQQuestions] = useState<QuizQuestion[]>([]);
  const [qqText, setQqText] = useState("");
  const [qqOpts, setQqOpts] = useState(["", "", "", ""]);
  const [qqCorrect, setQqCorrect] = useState("0");

  const publishCourse = () => {
    if (!cTitle.trim() || !cCat || !cDiff || !cMentor) return;
    setCourses(p => [...p, {
      id: `c${Date.now()}`, title: cTitle, description: cDesc, category: cCat,
      difficulty: cDiff, mentor: cMentor, thumbnail: cThumb, duration: cDur, status: "Published"
    }]);
    setCTitle(""); setCDesc(""); setCCat(""); setCDiff(""); setCMentor(""); setCThumb(""); setCDur("");
    toast.success("Course published successfully");
  };

  const deleteCourse = (id: string) => setCourses(p => p.filter(c => c.id !== id));
  const toggleCourseStatus = (id: string) =>
    setCourses(p => p.map(c => c.id === id ? { ...c, status: c.status === "Published" ? "Draft" : "Published" } : c));

  const addVideo = () => {
    if (!vCourse || !vTitle.trim() || !vUrl.trim()) return;
    const course = courses.find(c => c.id === vCourse);
    setVideos(p => [...p, {
      id: `v${Date.now()}`, courseId: vCourse, courseName: course?.title || "",
      module: vModule, title: vTitle, url: vUrl, description: vDesc,
      duration: vDur, order: parseInt(vOrder) || p.length + 1
    }]);
    setVModule(""); setVTitle(""); setVUrl(""); setVDesc(""); setVDur(""); setVOrder("");
    toast.success("Video lesson added");
  };

  const addQuestion = () => {
    if (!qqText.trim() || qqOpts.some(o => !o.trim())) return;
    setQQuestions(p => [...p, {
      id: `qq${Date.now()}`, text: qqText,
      options: qqOpts as [string, string, string, string], correct: parseInt(qqCorrect)
    }]);
    setQqText(""); setQqOpts(["", "", "", ""]); setQqCorrect("0");
  };

  const publishQuiz = () => {
    if (!qTitle.trim() || !qCourse || qQuestions.length === 0) return;
    const course = courses.find(c => c.id === qCourse);
    setQuizzes(p => [...p, {
      id: `qz${Date.now()}`, title: qTitle, courseId: qCourse,
      courseName: course?.title || "", passScore: parseInt(qPass),
      timeLimit: parseInt(qTime), questions: [...qQuestions], status: "Published"
    }]);
    setQTitle(""); setQCourse(""); setQPass("70"); setQTime("30"); setQQuestions([]);
    toast.success("Quiz published");
  };

  const labels = ["A", "B", "C", "D"];

  return (
    <Tabs defaultValue="pub-courses" className="w-full">
      <TabsList className="bg-secondary">
        <TabsTrigger value="pub-courses" className="gap-1"><BookOpen className="h-3.5 w-3.5" />Courses</TabsTrigger>
        <TabsTrigger value="pub-videos" className="gap-1"><Video className="h-3.5 w-3.5" />Videos</TabsTrigger>
        <TabsTrigger value="pub-quizzes" className="gap-1"><HelpCircle className="h-3.5 w-3.5" />Quizzes</TabsTrigger>
      </TabsList>

      {/* ===== COURSES ===== */}
      <TabsContent value="pub-courses">
        <motion.div {...fade} className="space-y-4">
          <Card className="shadow-card border-border">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><PlusCircle className="h-4 w-4 text-primary" /> New Course</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Course Title" value={cTitle} onChange={e => setCTitle(e.target.value)} />
                <Input placeholder="Duration (e.g. 6 hours)" value={cDur} onChange={e => setCDur(e.target.value)} />
                <Select value={cCat} onValueChange={setCCat}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                <Select value={cDiff} onValueChange={setCDiff}><SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                  <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                <Select value={cMentor} onValueChange={setCMentor}><SelectTrigger><SelectValue placeholder="Assign Mentor" /></SelectTrigger>
                  <SelectContent>{MENTORS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                <Input placeholder="Thumbnail URL" value={cThumb} onChange={e => setCThumb(e.target.value)} />
              </div>
              {cThumb && <div className="h-28 w-48 rounded-md border border-border bg-secondary overflow-hidden"><img src={cThumb} alt="thumb" className="h-full w-full object-cover" /></div>}
              <Textarea placeholder="Course description" value={cDesc} onChange={e => setCDesc(e.target.value)} />
              <Button onClick={publishCourse} className="bg-primary text-primary-foreground"><PlusCircle className="h-4 w-4 mr-1" /> Publish Course</Button>
            </CardContent>
          </Card>

          {courses.length > 0 && (
            <Card className="shadow-card border-border">
              <CardContent className="p-4 overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead>
                    <TableHead>Mentor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {courses.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{c.difficulty}</Badge></TableCell>
                        <TableCell>{c.mentor}</TableCell>
                        <TableCell><Badge variant={c.status === "Published" ? "default" : "secondary"} className="text-xs">{c.status}</Badge></TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleCourseStatus(c.id)}><ToggleLeft className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCourse(c.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </TabsContent>

      {/* ===== VIDEOS ===== */}
      <TabsContent value="pub-videos">
        <motion.div {...fade} className="space-y-4">
          <Card className="shadow-card border-border">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><PlusCircle className="h-4 w-4 text-primary" /> Add Video Lesson</h3>
              {courses.length === 0 && <p className="text-sm text-muted-foreground">Publish a course first to add videos.</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={vCourse} onValueChange={setVCourse}><SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                  <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select>
                <Input placeholder="Module Name (e.g. Module 1: Intro)" value={vModule} onChange={e => setVModule(e.target.value)} />
                <Input placeholder="Lesson Title" value={vTitle} onChange={e => setVTitle(e.target.value)} />
                <Input placeholder="Video URL" value={vUrl} onChange={e => setVUrl(e.target.value)} />
                <Input placeholder="Duration (e.g. 12 mins)" value={vDur} onChange={e => setVDur(e.target.value)} />
                <Input placeholder="Order/Position" type="number" value={vOrder} onChange={e => setVOrder(e.target.value)} />
              </div>
              <Textarea placeholder="Lesson description" value={vDesc} onChange={e => setVDesc(e.target.value)} />
              <Button onClick={addVideo} className="bg-primary text-primary-foreground"><PlusCircle className="h-4 w-4 mr-1" /> Add Video Lesson</Button>
            </CardContent>
          </Card>

          {videos.length > 0 && (() => {
            const grouped = videos.reduce<Record<string, VideoLesson[]>>((acc, v) => {
              (acc[v.courseName] = acc[v.courseName] || []).push(v);
              return acc;
            }, {});
            return Object.entries(grouped).map(([name, lessons]) => (
              <Card key={name} className="shadow-card border-border">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />{name}</h4>
                  <div className="space-y-2">
                    {lessons.sort((a, b) => a.order - b.order).map(l => (
                      <div key={l.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{l.title}</span>
                          <Badge variant="secondary" className="text-[10px]">{l.module}</Badge>
                          <span className="text-xs text-muted-foreground">{l.duration}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setVideos(p => p.filter(v => v.id !== l.id))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ));
          })()}
        </motion.div>
      </TabsContent>

      {/* ===== QUIZZES ===== */}
      <TabsContent value="pub-quizzes">
        <motion.div {...fade} className="space-y-4">
          <Card className="shadow-card border-border">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><PlusCircle className="h-4 w-4 text-primary" /> Create Quiz</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Quiz Title" value={qTitle} onChange={e => setQTitle(e.target.value)} />
                <Select value={qCourse} onValueChange={setQCourse}><SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                  <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select>
                <Input placeholder="Pass Score %" type="number" value={qPass} onChange={e => setQPass(e.target.value)} />
                <Input placeholder="Time Limit (mins)" type="number" value={qTime} onChange={e => setQTime(e.target.value)} />
              </div>

              {/* Question builder */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground">Add Question</h4>
                <Textarea placeholder="Question text" value={qqText} onChange={e => setQqText(e.target.value)} className="min-h-[60px]" />
                <div className="grid gap-2 sm:grid-cols-2">
                  {qqOpts.map((o, i) => (
                    <Input key={i} placeholder={`Option ${labels[i]}`} value={o}
                      onChange={e => { const n = [...qqOpts]; n[i] = e.target.value; setQqOpts(n); }} />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Correct:</span>
                  <RadioGroup value={qqCorrect} onValueChange={setQqCorrect} className="flex gap-3">
                    {labels.map((l, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                        <Label htmlFor={`opt-${i}`} className="text-xs">{l}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button variant="outline" size="sm" onClick={addQuestion}><PlusCircle className="h-4 w-4 mr-1" /> Add Question</Button>
              </div>

              {qQuestions.length > 0 && (
                <Accordion type="multiple" className="w-full">
                  {qQuestions.map((q, i) => (
                    <AccordionItem key={q.id} value={q.id}>
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">Q{i + 1}: {q.text.slice(0, 60)}{q.text.length > 60 ? "…" : ""}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 text-sm">
                          {q.options.map((o, oi) => (
                            <p key={oi} className={oi === q.correct ? "font-semibold text-primary" : "text-muted-foreground"}>
                              {labels[oi]}. {o} {oi === q.correct && "✓"}
                            </p>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => setQQuestions(p => p.filter(x => x.id !== q.id))}>
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              <Button onClick={publishQuiz} className="bg-primary text-primary-foreground"><PlusCircle className="h-4 w-4 mr-1" /> Publish Quiz</Button>
            </CardContent>
          </Card>

          {quizzes.length > 0 && (
            <Card className="shadow-card border-border">
              <CardContent className="p-4 overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Quiz Title</TableHead><TableHead>Course</TableHead><TableHead>Questions</TableHead>
                    <TableHead>Pass %</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {quizzes.map(q => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium text-foreground">{q.title}</TableCell>
                        <TableCell>{q.courseName}</TableCell>
                        <TableCell>{q.questions.length}</TableCell>
                        <TableCell>{q.passScore}%</TableCell>
                        <TableCell>{q.timeLimit} min</TableCell>
                        <TableCell><Badge variant="default" className="text-xs">{q.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setQuizzes(p => p.filter(x => x.id !== q.id))}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
