import { motion } from "framer-motion";
import { Users, BookOpen, Shield, BarChart3, Settings, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEnrollment } from "@/contexts/EnrollmentContext";

const platformStats = {
  totalUsers: 1284,
  activeToday: 342,
  totalCourses: 24,
  completionRate: 68,
  revenue: "$4,820",
  premiumUsers: 186,
};

export default function AdminOverview() {
  const { students, courses, enrollments } = useEnrollment();

  const stats = [
    { label: "Total Users", value: platformStats.totalUsers, icon: Users },
    { label: "Active Today", value: platformStats.activeToday, icon: TrendingUp },
    { label: "Courses", value: platformStats.totalCourses, icon: BookOpen },
    { label: "Completion Rate", value: `${platformStats.completionRate}%`, icon: BarChart3 },
    { label: "Revenue", value: platformStats.revenue, icon: Settings },
    { label: "Premium Users", value: platformStats.premiumUsers, icon: Shield },
  ];

  // Per-student enrollment analytics
  const studentStats = students.map(s => {
    const sEnrollments = enrollments.filter(e => e.studentId === s.id);
    const avgProgress = sEnrollments.length > 0 ? Math.round(sEnrollments.reduce((sum, e) => sum + e.progress, 0) / sEnrollments.length) : 0;
    const completedCount = sEnrollments.filter(e => e.status === "completed").length;
    return { ...s, enrolled: sEnrollments.length, avgProgress, completed: completedCount };
  });

  // Per-course popularity
  const courseStats = courses.map(c => {
    const cEnrollments = enrollments.filter(e => e.courseId === c.id);
    const avgProgress = cEnrollments.length > 0 ? Math.round(cEnrollments.reduce((sum, e) => sum + e.progress, 0) / cEnrollments.length) : 0;
    return { ...c, studentCount: cEnrollments.length, avgProgress };
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Platform overview and key metrics.</p>
      </motion.div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                  {studentStats.map(s => (
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
            {courseStats.map(c => (
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
