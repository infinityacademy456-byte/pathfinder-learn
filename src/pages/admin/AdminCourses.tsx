import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Edit2, Search, Layers, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface CourseModule {
  id: string;
  title: string;
  lessons: number;
}

interface Course {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  mentor: string;
  students: number;
  status: "Published" | "Draft";
  description: string;
  modules: CourseModule[];
}

const initialCourses: Course[] = [
  { id: "ac1", title: "Python Fundamentals", category: "Python", difficulty: "Beginner", mentor: "Dr. Sarah Lin", students: 342, status: "Published", description: "Learn Python from scratch", modules: [{ id: "m1", title: "Intro to Python", lessons: 4 }, { id: "m2", title: "Data Types", lessons: 4 }, { id: "m3", title: "Control Flow", lessons: 4 }] },
  { id: "ac2", title: "SQL Mastery", category: "SQL", difficulty: "Intermediate", mentor: "Priya Sharma", students: 218, status: "Published", description: "Master SQL queries and databases", modules: [{ id: "m4", title: "SQL Basics", lessons: 5 }, { id: "m5", title: "Joins & Subqueries", lessons: 5 }] },
  { id: "ac3", title: "Machine Learning Basics", category: "Machine Learning", difficulty: "Advanced", mentor: "Dr. Sarah Lin", students: 156, status: "Published", description: "ML fundamentals with scikit-learn", modules: [{ id: "m6", title: "Supervised Learning", lessons: 8 }, { id: "m7", title: "Unsupervised Learning", lessons: 8 }] },
  { id: "ac4", title: "Web Dev with React", category: "Web Dev", difficulty: "Intermediate", mentor: "Marcus Lee", students: 289, status: "Draft", description: "Build modern web apps with React", modules: [{ id: "m8", title: "React Basics", lessons: 6 }] },
  { id: "ac5", title: "Power BI Analytics", category: "Power BI", difficulty: "Beginner", mentor: "Priya Sharma", students: 94, status: "Published", description: "Data visualization with Power BI", modules: [] },
];

const mentors = ["Dr. Sarah Lin", "Priya Sharma", "Marcus Lee"];
const categories = ["Python", "SQL", "Machine Learning", "Web Dev", "Power BI", "Data", "DevOps"];

export default function AdminCourses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Published" | "Draft">("all");
  const [courseDialog, setCourseDialog] = useState<{ mode: "create" | "edit"; course?: Course } | null>(null);
  const [moduleDialog, setModuleDialog] = useState<Course | null>(null);

  // Course form
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Python");
  const [formDifficulty, setFormDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [formMentor, setFormMentor] = useState(mentors[0]);
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Draft");

  // Module form
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleLessons, setNewModuleLessons] = useState("4");

  const openCreate = () => {
    setFormTitle(""); setFormCategory("Python"); setFormDifficulty("Beginner");
    setFormMentor(mentors[0]); setFormDescription(""); setFormStatus("Draft");
    setCourseDialog({ mode: "create" });
  };

  const openEdit = (course: Course) => {
    setFormTitle(course.title); setFormCategory(course.category); setFormDifficulty(course.difficulty);
    setFormMentor(course.mentor); setFormDescription(course.description); setFormStatus(course.status);
    setCourseDialog({ mode: "edit", course });
  };

  const handleSaveCourse = () => {
    if (!formTitle.trim()) { toast.error("Course title is required"); return; }
    if (courseDialog?.mode === "create") {
      if (courses.some(c => c.title.toLowerCase() === formTitle.trim().toLowerCase())) {
        toast.error("A course with this title already exists"); return;
      }
      setCourses(prev => [...prev, {
        id: `ac${Date.now()}`, title: formTitle.trim(), category: formCategory, difficulty: formDifficulty,
        mentor: formMentor, students: 0, status: formStatus, description: formDescription.trim(), modules: [],
      }]);
      toast.success(`"${formTitle}" created`);
    } else if (courseDialog?.course) {
      setCourses(prev => prev.map(c => c.id === courseDialog.course!.id ? {
        ...c, title: formTitle.trim(), category: formCategory, difficulty: formDifficulty,
        mentor: formMentor, description: formDescription.trim(), status: formStatus,
      } : c));
      toast.success(`"${formTitle}" updated`);
    }
    setCourseDialog(null);
  };

  const addModule = () => {
    if (!moduleDialog || !newModuleTitle.trim()) { toast.error("Module title is required"); return; }
    const lessons = parseInt(newModuleLessons) || 4;
    setCourses(prev => prev.map(c => c.id === moduleDialog.id ? {
      ...c, modules: [...c.modules, { id: `m${Date.now()}`, title: newModuleTitle.trim(), lessons }],
    } : c));
    setNewModuleTitle(""); setNewModuleLessons("4");
    toast.success("Module added");
    // refresh moduleDialog reference
    setModuleDialog(prev => prev ? { ...prev, modules: [...prev.modules, { id: `m${Date.now()}`, title: newModuleTitle.trim(), lessons }] } : null);
  };

  const removeModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c, modules: c.modules.filter(m => m.id !== moduleId),
    } : c));
    setModuleDialog(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== moduleId) } : null);
    toast.success("Module removed");
  };

  const filtered = courses
    .filter(c => filterStatus === "all" || c.status === filterStatus)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Manage Courses
        </h1>
        <p className="text-sm text-muted-foreground">Create courses, assign mentors, and manage modules.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{courses.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Courses</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{courses.filter(c => c.status === "Published").length}</p>
          <p className="text-[10px] text-muted-foreground">Published</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{courses.reduce((s, c) => s + c.students, 0)}</p>
          <p className="text-[10px] text-muted-foreground">Total Enrolled</p>
        </CardContent></Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
          <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> Create Course
        </Button>
      </div>

      {/* Course Table */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead>
              <TableHead>Mentor</TableHead><TableHead>Modules</TableHead><TableHead>Students</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{c.difficulty}</Badge></TableCell>
                  <TableCell>{c.mentor}</TableCell>
                  <TableCell>{c.modules.length}</TableCell>
                  <TableCell>{c.students}</TableCell>
                  <TableCell><Badge variant={c.status === "Published" ? "default" : "secondary"} className="text-xs">{c.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}><Edit2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setModuleDialog(c); setNewModuleTitle(""); setNewModuleLessons("4"); }}><Layers className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={!!courseDialog} onOpenChange={() => setCourseDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{courseDialog?.mode === "create" ? "Create New Course" : "Edit Course"}</DialogTitle>
            <DialogDescription>Fill in the course details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Course title *" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <Textarea placeholder="Description" value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={formDifficulty} onValueChange={v => setFormDifficulty(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formMentor} onValueChange={setFormMentor}>
                <SelectTrigger><SelectValue placeholder="Mentor" /></SelectTrigger>
                <SelectContent>{mentors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={formStatus} onValueChange={v => setFormStatus(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseDialog(null)}>Cancel</Button>
            <Button onClick={handleSaveCourse} className="bg-primary text-primary-foreground">
              {courseDialog?.mode === "create" ? "Create Course" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Manager Dialog */}
      <Dialog open={!!moduleDialog} onOpenChange={() => setModuleDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Modules — {moduleDialog?.title}</DialogTitle>
            <DialogDescription>Add or remove course modules.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {/* Refresh module list from courses state */}
            {(courses.find(c => c.id === moduleDialog?.id)?.modules || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No modules yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(courses.find(c => c.id === moduleDialog?.id)?.modules || []).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.lessons} lessons</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => moduleDialog && removeModule(moduleDialog.id, m.id)}>Remove</Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input placeholder="Module title" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="flex-1" />
              <Input placeholder="Lessons" type="number" value={newModuleLessons} onChange={e => setNewModuleLessons(e.target.value)} className="w-20" />
              <Button size="sm" onClick={addModule} className="bg-primary text-primary-foreground">Add</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModuleDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
