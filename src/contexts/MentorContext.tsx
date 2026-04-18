import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { usePersistedState } from "@/lib/use-persisted-state";

// ============== TYPES ==============
export interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Batch {
  id: string;
  name: string;
  mentorId: string;
  courseId: string;
  studentIds: string[];
}

export interface ClassSession {
  id: string;
  batchId: string;
  title: string;
  description: string;
  scheduledAt: string; // ISO datetime
  durationMin: number;
  meetingLink: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Material {
  id: string;
  batchId: string;
  title: string;
  type: "note" | "pdf" | "assignment";
  url: string; // mock URL/text
  description: string;
  uploadedAt: string;
}

export interface MentorTask {
  id: string;
  batchId: string;
  title: string;
  description: string;
  deadline: string; // ISO date
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  content: string; // mock submitted text/link
  submittedAt: string;
  marks: number | null;
  feedback: string;
  status: "pending" | "reviewed";
}

export interface ProjectReview {
  id: string;
  studentId: string;
  batchId: string;
  title: string;
  url: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  score: number | null;
  feedback: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  status: "present" | "absent" | "late";
  markedAt: string;
}

export interface QueryMessage {
  authorId: string;
  authorRole: "student" | "mentor";
  text: string;
  at: string;
}

export interface Query {
  id: string;
  studentId: string;
  batchId: string;
  subject: string;
  status: "open" | "answered" | "resolved";
  createdAt: string;
  messages: QueryMessage[];
}

export interface Notification {
  id: string;
  studentId: string;
  type: "class" | "task" | "feedback" | "material" | "attendance";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface AuditEntry {
  id: string;
  actor: string; // mentor id or system
  action: string;
  target: string;
  at: string;
}

// ============== SEED DATA ==============
const mentors: Mentor[] = [
  { id: "m1", name: "Mentor Smith", email: "mentor@learn.com", avatar: "M" },
];

const initialBatches: Batch[] = [
  { id: "b1", name: "Python Batch — Spring 2026", mentorId: "m1", courseId: "c1", studentIds: ["s1"] },
  { id: "b2", name: "SQL Batch — Spring 2026", mentorId: "m1", courseId: "c2", studentIds: ["s1", "s3"] },
  { id: "b3", name: "Data Analysis Cohort", mentorId: "m1", courseId: "c3", studentIds: ["s2", "s3", "s4"] },
  { id: "b4", name: "ML Bootcamp", mentorId: "m1", courseId: "c4", studentIds: ["s2", "s4"] },
];

const today = new Date();
const iso = (offsetDays: number, hour = 10) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const isoDate = (offsetDays: number) => iso(offsetDays).split("T")[0];

const initialClasses: ClassSession[] = [
  { id: "cls1", batchId: "b1", title: "Functions Deep Dive", description: "Lambda, closures, decorators", scheduledAt: iso(1, 14), durationMin: 60, meetingLink: "https://meet.example.com/python-1", status: "scheduled" },
  { id: "cls2", batchId: "b2", title: "Advanced Joins", description: "Inner, outer, self joins", scheduledAt: iso(2, 11), durationMin: 90, meetingLink: "https://meet.example.com/sql-1", status: "scheduled" },
  { id: "cls3", batchId: "b3", title: "Pandas GroupBy", description: "Aggregation patterns", scheduledAt: iso(-3, 10), durationMin: 60, meetingLink: "https://meet.example.com/data-1", status: "completed" },
  { id: "cls4", batchId: "b4", title: "Linear Regression", description: "Theory + sklearn", scheduledAt: iso(3, 16), durationMin: 75, meetingLink: "https://meet.example.com/ml-1", status: "scheduled" },
];

const initialMaterials: Material[] = [
  { id: "mat1", batchId: "b1", title: "Functions Cheat Sheet", type: "note", url: "#functions-notes", description: "Quick reference for Python functions", uploadedAt: isoDate(-5) },
  { id: "mat2", batchId: "b2", title: "SQL Joins PDF", type: "pdf", url: "#sql-joins.pdf", description: "Visual guide to all join types", uploadedAt: isoDate(-2) },
  { id: "mat3", batchId: "b3", title: "Pandas Practice Assignment", type: "assignment", url: "#pandas-hw", description: "5 problems on DataFrame manipulation", uploadedAt: isoDate(-1) },
];

const initialTasks: MentorTask[] = [
  { id: "t1", batchId: "b1", title: "Build a CLI calculator", description: "Use functions and argparse", deadline: isoDate(5), createdAt: isoDate(-2) },
  { id: "t2", batchId: "b3", title: "Analyze sales dataset", description: "Use pandas to find top 10 products", deadline: isoDate(7), createdAt: isoDate(-1) },
];

const initialSubmissions: Submission[] = [
  { id: "sub1", taskId: "t1", studentId: "s1", content: "github.com/s1/calculator", submittedAt: isoDate(-1), marks: null, feedback: "", status: "pending" },
  { id: "sub2", taskId: "t2", studentId: "s2", content: "github.com/s2/sales-analysis", submittedAt: isoDate(0), marks: 85, feedback: "Great work, clean code!", status: "reviewed" },
];

const initialProjects: ProjectReview[] = [
  { id: "pr1", studentId: "s1", batchId: "b1", title: "Weather Dashboard", url: "github.com/s1/weather", submittedAt: isoDate(-3), status: "pending", score: null, feedback: "" },
  { id: "pr2", studentId: "s3", batchId: "b3", title: "EDA on Titanic Dataset", url: "github.com/s3/titanic-eda", submittedAt: isoDate(-5), status: "approved", score: 92, feedback: "Excellent visualizations" },
];

const initialAttendance: AttendanceRecord[] = [
  { id: "a1", classId: "cls3", studentId: "s2", status: "present", markedAt: isoDate(-3) },
  { id: "a2", classId: "cls3", studentId: "s3", status: "present", markedAt: isoDate(-3) },
  { id: "a3", classId: "cls3", studentId: "s4", status: "absent", markedAt: isoDate(-3) },
];

const initialQueries: Query[] = [
  {
    id: "q1", studentId: "s1", batchId: "b1", subject: "Doubt on closures",
    status: "answered", createdAt: isoDate(-2),
    messages: [
      { authorId: "s1", authorRole: "student", text: "Can you re-explain how closures capture variables?", at: isoDate(-2) },
      { authorId: "m1", authorRole: "mentor", text: "Sure — they capture by reference, not by value. Watch the recorded class around 35:00.", at: isoDate(-1) },
    ],
  },
];

const initialNotifications: Notification[] = [
  { id: "n1", studentId: "s2", type: "feedback", title: "Submission reviewed", body: "Your task 'Analyze sales dataset' was graded 85/100", createdAt: isoDate(0), read: false },
];

// ============== CONTEXT ==============
interface MentorContextType {
  mentors: Mentor[];
  currentMentorId: string;
  batches: Batch[];
  classes: ClassSession[];
  materials: Material[];
  tasks: MentorTask[];
  submissions: Submission[];
  projects: ProjectReview[];
  attendance: AttendanceRecord[];
  queries: Query[];
  notifications: Notification[];
  auditLog: AuditEntry[];

  // Class management
  scheduleClass: (data: Omit<ClassSession, "id" | "status">) => void;
  updateClass: (id: string, data: Partial<ClassSession>) => void;
  cancelClass: (id: string) => void;

  // Materials
  uploadMaterial: (data: Omit<Material, "id" | "uploadedAt">) => void;
  deleteMaterial: (id: string) => void;

  // Tasks
  createTask: (data: Omit<MentorTask, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;

  // Submissions / evaluation
  evaluateSubmission: (id: string, marks: number, feedback: string) => void;

  // Projects
  reviewProject: (id: string, status: "approved" | "rejected", score: number, feedback: string) => void;

  // Attendance
  markAttendance: (classId: string, studentId: string, status: AttendanceRecord["status"]) => void;

  // Queries
  replyToQuery: (queryId: string, text: string) => void;
  resolveQuery: (queryId: string) => void;
  raiseQuery: (studentId: string, batchId: string, subject: string, text: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;

  // Selectors for student side
  getStudentBatches: (studentId: string) => Batch[];
  getStudentClasses: (studentId: string) => ClassSession[];
  getStudentMaterials: (studentId: string) => Material[];
  getStudentTasks: (studentId: string) => MentorTask[];
  getStudentSubmissions: (studentId: string) => Submission[];
  getStudentAttendance: (studentId: string) => (AttendanceRecord & { class: ClassSession | undefined })[];
  getStudentNotifications: (studentId: string) => Notification[];
  getStudentQueries: (studentId: string) => Query[];
}

const MentorContext = createContext<MentorContextType | null>(null);

export function MentorProvider({ children }: { children: ReactNode }) {
  const [batches] = useState<Batch[]>(initialBatches);
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [tasks, setTasks] = useState<MentorTask[]>(initialTasks);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [projects, setProjects] = useState<ProjectReview[]>(initialProjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [queries, setQueries] = useState<Query[]>(initialQueries);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const currentMentorId = "m1";

  const log = useCallback((action: string, target: string) => {
    setAuditLog(prev => [
      { id: `al${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, actor: currentMentorId, action, target, at: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const notifyBatch = useCallback((batchId: string, n: Omit<Notification, "id" | "studentId" | "createdAt" | "read">) => {
    const batch = initialBatches.find(b => b.id === batchId);
    if (!batch) return;
    setNotifications(prev => [
      ...batch.studentIds.map(sid => ({
        id: `n${Date.now()}-${sid}-${Math.random().toString(36).slice(2, 6)}`,
        studentId: sid,
        createdAt: new Date().toISOString(),
        read: false,
        ...n,
      })),
      ...prev,
    ]);
  }, []);

  // ===== Class management =====
  const scheduleClass = useCallback<MentorContextType["scheduleClass"]>((data) => {
    const id = `cls${Date.now()}`;
    setClasses(prev => [...prev, { ...data, id, status: "scheduled" }]);
    notifyBatch(data.batchId, { type: "class", title: "New class scheduled", body: `${data.title} on ${new Date(data.scheduledAt).toLocaleString()}` });
    log("scheduleClass", id);
  }, [log, notifyBatch]);

  const updateClass = useCallback<MentorContextType["updateClass"]>((id, data) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    const cls = classes.find(c => c.id === id);
    if (cls) notifyBatch(cls.batchId, { type: "class", title: "Class updated", body: `${cls.title} details changed` });
    log("updateClass", id);
  }, [classes, log, notifyBatch]);

  const cancelClass = useCallback<MentorContextType["cancelClass"]>((id) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: "cancelled" } : c));
    log("cancelClass", id);
  }, [log]);

  // ===== Materials =====
  const uploadMaterial = useCallback<MentorContextType["uploadMaterial"]>((data) => {
    const id = `mat${Date.now()}`;
    setMaterials(prev => [...prev, { ...data, id, uploadedAt: new Date().toISOString().split("T")[0] }]);
    notifyBatch(data.batchId, { type: "material", title: "New material uploaded", body: data.title });
    log("uploadMaterial", id);
  }, [log, notifyBatch]);

  const deleteMaterial = useCallback<MentorContextType["deleteMaterial"]>((id) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    log("deleteMaterial", id);
  }, [log]);

  // ===== Tasks =====
  const createTask = useCallback<MentorContextType["createTask"]>((data) => {
    const id = `t${Date.now()}`;
    setTasks(prev => [...prev, { ...data, id, createdAt: new Date().toISOString().split("T")[0] }]);
    notifyBatch(data.batchId, { type: "task", title: "New task assigned", body: `${data.title} — due ${data.deadline}` });
    log("createTask", id);
  }, [log, notifyBatch]);

  const deleteTask = useCallback<MentorContextType["deleteTask"]>((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    log("deleteTask", id);
  }, [log]);

  // ===== Evaluation =====
  const evaluateSubmission = useCallback<MentorContextType["evaluateSubmission"]>((id, marks, feedback) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id !== id) return s;
      // Notify student
      const task = initialTasks.find(t => t.id === s.taskId) || tasks.find(t => t.id === s.taskId);
      setNotifications(p => [{
        id: `n${Date.now()}-${s.studentId}`,
        studentId: s.studentId,
        type: "feedback",
        title: "Submission reviewed",
        body: `${task?.title || "Your submission"} graded ${marks}/100`,
        createdAt: new Date().toISOString(),
        read: false,
      }, ...p]);
      return { ...s, marks, feedback, status: "reviewed" as const };
    }));
    log("evaluateSubmission", id);
  }, [tasks, log]);

  // ===== Projects =====
  const reviewProject = useCallback<MentorContextType["reviewProject"]>((id, status, score, feedback) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      setNotifications(prevN => [{
        id: `n${Date.now()}-${p.studentId}`,
        studentId: p.studentId,
        type: "feedback",
        title: `Project ${status}`,
        body: `${p.title}: ${score}/100 — ${feedback.slice(0, 60)}`,
        createdAt: new Date().toISOString(),
        read: false,
      }, ...prevN]);
      return { ...p, status, score, feedback };
    }));
    log("reviewProject", id);
  }, [log]);

  // ===== Attendance =====
  const markAttendance = useCallback<MentorContextType["markAttendance"]>((classId, studentId, status) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.classId === classId && a.studentId === studentId);
      if (existing) return prev.map(a => a === existing ? { ...a, status, markedAt: new Date().toISOString() } : a);
      return [...prev, { id: `a${Date.now()}-${studentId}`, classId, studentId, status, markedAt: new Date().toISOString() }];
    });
    log("markAttendance", `${classId}:${studentId}`);
  }, [log]);

  // ===== Queries =====
  const replyToQuery = useCallback<MentorContextType["replyToQuery"]>((queryId, text) => {
    setQueries(prev => prev.map(q => {
      if (q.id !== queryId) return q;
      setNotifications(p => [{
        id: `n${Date.now()}-${q.studentId}`,
        studentId: q.studentId,
        type: "feedback",
        title: "Mentor replied",
        body: `Re: ${q.subject}`,
        createdAt: new Date().toISOString(),
        read: false,
      }, ...p]);
      return {
        ...q,
        status: "answered" as const,
        messages: [...q.messages, { authorId: currentMentorId, authorRole: "mentor" as const, text, at: new Date().toISOString() }],
      };
    }));
    log("replyToQuery", queryId);
  }, [log]);

  const resolveQuery = useCallback<MentorContextType["resolveQuery"]>((queryId) => {
    setQueries(prev => prev.map(q => q.id === queryId ? { ...q, status: "resolved" as const } : q));
    log("resolveQuery", queryId);
  }, [log]);

  const raiseQuery = useCallback<MentorContextType["raiseQuery"]>((studentId, batchId, subject, text) => {
    const id = `q${Date.now()}`;
    setQueries(prev => [...prev, {
      id, studentId, batchId, subject,
      status: "open",
      createdAt: new Date().toISOString(),
      messages: [{ authorId: studentId, authorRole: "student", text, at: new Date().toISOString() }],
    }]);
  }, []);

  const markNotificationRead = useCallback<MentorContextType["markNotificationRead"]>((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // ===== Selectors =====
  const getStudentBatches = useCallback((studentId: string) =>
    batches.filter(b => b.studentIds.includes(studentId)), [batches]);

  const getStudentClasses = useCallback((studentId: string) => {
    const batchIds = batches.filter(b => b.studentIds.includes(studentId)).map(b => b.id);
    return classes.filter(c => batchIds.includes(c.batchId));
  }, [batches, classes]);

  const getStudentMaterials = useCallback((studentId: string) => {
    const batchIds = batches.filter(b => b.studentIds.includes(studentId)).map(b => b.id);
    return materials.filter(m => batchIds.includes(m.batchId));
  }, [batches, materials]);

  const getStudentTasks = useCallback((studentId: string) => {
    const batchIds = batches.filter(b => b.studentIds.includes(studentId)).map(b => b.id);
    return tasks.filter(t => batchIds.includes(t.batchId));
  }, [batches, tasks]);

  const getStudentSubmissions = useCallback((studentId: string) =>
    submissions.filter(s => s.studentId === studentId), [submissions]);

  const getStudentAttendance = useCallback((studentId: string) =>
    attendance.filter(a => a.studentId === studentId).map(a => ({ ...a, class: classes.find(c => c.id === a.classId) })), [attendance, classes]);

  const getStudentNotifications = useCallback((studentId: string) =>
    notifications.filter(n => n.studentId === studentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [notifications]);

  const getStudentQueries = useCallback((studentId: string) =>
    queries.filter(q => q.studentId === studentId), [queries]);

  const value = useMemo<MentorContextType>(() => ({
    mentors, currentMentorId, batches, classes, materials, tasks, submissions,
    projects, attendance, queries, notifications, auditLog,
    scheduleClass, updateClass, cancelClass,
    uploadMaterial, deleteMaterial,
    createTask, deleteTask,
    evaluateSubmission, reviewProject,
    markAttendance,
    replyToQuery, resolveQuery, raiseQuery,
    markNotificationRead,
    getStudentBatches, getStudentClasses, getStudentMaterials, getStudentTasks,
    getStudentSubmissions, getStudentAttendance, getStudentNotifications, getStudentQueries,
  }), [batches, classes, materials, tasks, submissions, projects, attendance, queries, notifications, auditLog,
    scheduleClass, updateClass, cancelClass, uploadMaterial, deleteMaterial, createTask, deleteTask,
    evaluateSubmission, reviewProject, markAttendance, replyToQuery, resolveQuery, raiseQuery,
    markNotificationRead, getStudentBatches, getStudentClasses, getStudentMaterials, getStudentTasks,
    getStudentSubmissions, getStudentAttendance, getStudentNotifications, getStudentQueries]);

  return <MentorContext.Provider value={value}>{children}</MentorContext.Provider>;
}

export function useMentor() {
  const ctx = useContext(MentorContext);
  if (!ctx) throw new Error("useMentor must be used within MentorProvider");
  return ctx;
}
