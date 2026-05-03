import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, BookOpen, Shield, BarChart3, Settings, TrendingUp, Database, RefreshCw, AlertCircle } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { db } from "@/lib/firebase";

interface FirestoreUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: { seconds: number } | null;
}

export default function AdminOverview() {
  const { students, courses, enrollments } = useEnrollment();

  const [fbUsers, setFbUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let q;
    try {
      q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    } catch {
      q = collection(db, "users");
    }
    const unsub = onSnapshot(
      q,
      (snap) => {
        setFbUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreUser, "id">) })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore users listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Real-time derived metrics
  const totalUsers = fbUsers.length;
  const studentsCount = fbUsers.filter((u) => (u.role || "student") === "student").length;
  const mentorsCount = fbUsers.filter((u) => u.role === "mentor").length;
  const adminsCount = fbUsers.filter((u) => u.role === "admin").length;

  // Active in last 24h based on createdAt as a best-effort signal
  const dayAgo = Date.now() / 1000 - 24 * 60 * 60;
  const activeToday = fbUsers.filter((u) => u.createdAt && u.createdAt.seconds >= dayAgo).length;

  const totalCourses = courses.length;
  const completionRate = enrollments.length
    ? Math.round(
        (enrollments.filter((e) => e.status === "completed").length / enrollments.length) * 100
      )
    : 0;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users },
    { label: "Active (24h)", value: activeToday, icon: TrendingUp },
    { label: "Students", value: studentsCount, icon: Users },
    { label: "Mentors", value: mentorsCount, icon: Shield },
    { label: "Courses", value: totalCourses, icon: BookOpen },
    { label: "Completion Rate", value: `${completionRate}%`, icon: BarChart3 },
  ];

  // Per-student enrollment analytics (mock enrollment context — kept for course analytics)
  const studentStats = students.map((s) => {
    const sEnrollments = enrollments.filter((e) => e.studentId === s.id);
    const avgProgress = sEnrollments.length
      ? Math.round(sEnrollments.reduce((sum, e) => sum + e.progress, 0) / sEnrollments.length)
      : 0;
    const completedCount = sEnrollments.filter((e) => e.status === "completed").length;
    return { ...s, enrolled: sEnrollments.length, avgProgress, completed: completedCount };
  });

  const courseStats = courses.map((c) => {
    const cEnrollments = enrollments.filter((e) => e.courseId === c.id);
    const avgProgress = cEnrollments.length
      ? Math.round(cEnrollments.reduce((sum, e) => sum + e.progress, 0) / cEnrollments.length)
      : 0;
    return { ...c, studentCount: cEnrollments.length, avgProgress };
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Dashboard
          <Badge variant="outline" className="ml-2 text-[10px]">Live · Firestore</Badge>
        </h1>
        <p className="text-muted-foreground">Real-time platform metrics from Firebase.</p>
      </motion.div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Firestore error</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check Firestore Security Rules allow read on the <code>users</code> collection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-foreground">
                {loading ? <RefreshCw className="h-4 w-4 inline animate-spin text-muted-foreground" /> : s.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Firestore users */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="shadow-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Users (live from Firestore)
              <Badge variant="outline" className="text-[10px]">{totalUsers}</Badge>
            </CardTitle>
            <Link to="/admin/firebase-users">
              <Button size="sm" variant="outline">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Loading from Firestore...
              </div>
            ) : fbUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No users in Firestore yet.{" "}
                <Link to="/admin/firebase-users" className="text-primary underline">Add one</Link>.
              </div>
            ) : (
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {fbUsers.slice(0, 20).map((u) => (
                  <div key={u.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {(u.name || u.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{u.name || "(no name)"}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">{u.role || "user"}</Badge>
                  </div>
                ))}
                {fbUsers.length > 20 && (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    Showing 20 of {fbUsers.length} —{" "}
                    <Link to="/admin/firebase-users" className="text-primary underline">view all</Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enrollment Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Enrollment Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-2 font-medium text-muted-foreground">Student</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Enrolled Courses</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Avg Progress</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentStats.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-3 text-foreground">{s.enrolled}</td>
                      <td className="px-4 py-3 text-foreground">{s.avgProgress}%</td>
                      <td className="px-4 py-3 text-foreground">{s.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Popularity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Course Popularity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseStats.map((c) => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.studentCount} students · Avg {c.avgProgress}%</p>
                </div>
                <Progress value={c.avgProgress} className="h-1.5 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
