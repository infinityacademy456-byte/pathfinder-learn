import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Edit2, Search, BookOpen, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Batch {
  id: string;
  name: string;
  courseTitle: string;
  mentorName: string;
  studentIds: string[];
  startDate: string;
  status: "active" | "completed" | "upcoming";
  avgProgress: number;
}

const studentPool = [
  { id: "bs1", name: "Alex Chen" },
  { id: "bs2", name: "Marcus Lee" },
  { id: "bs3", name: "Jordan Taylor" },
  { id: "bs4", name: "Emily Park" },
  { id: "bs5", name: "Ravi Kumar" },
  { id: "bs6", name: "Lisa Wong" },
];

const mentorPool = ["Dr. Sarah Lin", "Priya Sharma", "Marcus Lee"];
const coursePool = ["Python Fundamentals", "SQL Mastery", "Machine Learning Basics", "Web Dev with React"];

const initialBatches: Batch[] = [
  { id: "b1", name: "Python Batch A", courseTitle: "Python Fundamentals", mentorName: "Dr. Sarah Lin", studentIds: ["bs1", "bs2", "bs3"], startDate: "2026-01-15", status: "active", avgProgress: 62 },
  { id: "b2", name: "SQL Evening Batch", courseTitle: "SQL Mastery", mentorName: "Priya Sharma", studentIds: ["bs4", "bs5"], startDate: "2026-02-01", status: "active", avgProgress: 45 },
  { id: "b3", name: "ML Advanced Q2", courseTitle: "Machine Learning Basics", mentorName: "Dr. Sarah Lin", studentIds: ["bs1", "bs6"], startDate: "2026-04-01", status: "upcoming", avgProgress: 0 },
];

export default function AdminBatches() {
  const [batches, setBatches] = useState(initialBatches);
  const [search, setSearch] = useState("");
  const [batchDialog, setBatchDialog] = useState<{ mode: "create" | "edit"; batch?: Batch } | null>(null);
  const [detailBatch, setDetailBatch] = useState<Batch | null>(null);

  // Form
  const [formName, setFormName] = useState("");
  const [formCourse, setFormCourse] = useState(coursePool[0]);
  const [formMentor, setFormMentor] = useState(mentorPool[0]);
  const [formDate, setFormDate] = useState("");
  const [formStudents, setFormStudents] = useState<string[]>([]);

  const openCreate = () => {
    setFormName(""); setFormCourse(coursePool[0]); setFormMentor(mentorPool[0]);
    setFormDate(""); setFormStudents([]);
    setBatchDialog({ mode: "create" });
  };

  const openEdit = (batch: Batch) => {
    setFormName(batch.name); setFormCourse(batch.courseTitle); setFormMentor(batch.mentorName);
    setFormDate(batch.startDate); setFormStudents([...batch.studentIds]);
    setBatchDialog({ mode: "edit", batch });
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error("Batch name is required"); return; }
    if (formStudents.length === 0) { toast.error("Select at least one student"); return; }

    if (batchDialog?.mode === "create") {
      if (batches.some(b => b.name.toLowerCase() === formName.trim().toLowerCase())) {
        toast.error("A batch with this name already exists"); return;
      }
      setBatches(prev => [...prev, {
        id: `b${Date.now()}`, name: formName.trim(), courseTitle: formCourse, mentorName: formMentor,
        studentIds: formStudents, startDate: formDate || new Date().toISOString().split("T")[0],
        status: "upcoming", avgProgress: 0,
      }]);
      toast.success(`Batch "${formName}" created`);
    } else if (batchDialog?.batch) {
      setBatches(prev => prev.map(b => b.id === batchDialog.batch!.id ? {
        ...b, name: formName.trim(), courseTitle: formCourse, mentorName: formMentor,
        studentIds: formStudents, startDate: formDate || b.startDate,
      } : b));
      toast.success(`Batch "${formName}" updated`);
    }
    setBatchDialog(null);
  };

  const toggleStudent = (studentId: string) => {
    setFormStudents(prev => prev.includes(studentId) ? prev.filter(s => s !== studentId) : [...prev, studentId]);
  };

  const filtered = batches.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.courseTitle.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => s === "active" ? "text-success" : s === "completed" ? "text-primary" : "text-warning";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> Batch Management
        </h1>
        <p className="text-sm text-muted-foreground">Create batches, assign students & mentors, track progress.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{batches.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Batches</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{batches.filter(b => b.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{batches.reduce((s, b) => s + b.studentIds.length, 0)}</p>
          <p className="text-[10px] text-muted-foreground">Students Assigned</p>
        </CardContent></Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search batches…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm" onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> Create Batch
        </Button>
      </div>

      {/* Batch list */}
      <div className="space-y-3">
        {filtered.map(batch => (
          <Card key={batch.id} className="shadow-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{batch.name}</h3>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${statusColor(batch.status)}`}>{batch.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {batch.courseTitle}</span>
                    <span className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> {batch.mentorName}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {batch.studentIds.length} students</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={batch.avgProgress} className="h-1.5 w-32" />
                    <span className="text-xs text-muted-foreground">{batch.avgProgress}% avg</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setDetailBatch(batch)}>View</Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(batch)}><Edit2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={!!batchDialog} onOpenChange={() => setBatchDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{batchDialog?.mode === "create" ? "Create New Batch" : "Edit Batch"}</DialogTitle>
            <DialogDescription>Configure batch details and assign members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Batch name *" value={formName} onChange={e => setFormName(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Select value={formCourse} onValueChange={setFormCourse}>
                <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>{coursePool.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={formMentor} onValueChange={setFormMentor}>
                <SelectTrigger><SelectValue placeholder="Mentor" /></SelectTrigger>
                <SelectContent>{mentorPool.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Assign Students</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {studentPool.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={formStudents.includes(s.id)} onCheckedChange={() => toggleStudent(s.id)} />
                    <span className="text-sm text-foreground">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchDialog(null)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              {batchDialog?.mode === "create" ? "Create Batch" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailBatch} onOpenChange={() => setDetailBatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailBatch?.name}</DialogTitle>
            <DialogDescription>{detailBatch?.courseTitle} · Mentor: {detailBatch?.mentorName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`capitalize ${statusColor(detailBatch?.status || "")}`}>{detailBatch?.status}</Badge>
              <span className="text-xs text-muted-foreground">Started: {detailBatch?.startDate}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Students ({detailBatch?.studentIds.length})</p>
              <div className="space-y-1">
                {detailBatch?.studentIds.map(sid => {
                  const s = studentPool.find(x => x.id === sid);
                  return s ? (
                    <div key={sid} className="flex items-center gap-2 p-2 rounded bg-secondary">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm text-foreground">{s.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={detailBatch?.avgProgress || 0} className="h-2 flex-1" />
              <span className="text-sm font-medium text-foreground">{detailBatch?.avgProgress}%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailBatch(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
