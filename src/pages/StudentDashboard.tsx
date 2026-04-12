import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, FolderKanban, Zap, Flame, Play, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { userProfile, courses, learningPaths } from "@/data/mockData";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stats = [
  { label: "Courses Enrolled", value: learningPaths.filter(p => p.progress > 0).length, icon: BookOpen, color: "text-primary" },
  { label: "Lessons Completed", value: userProfile.lessonsCompleted, icon: CheckCircle2, color: "text-accent" },
  { label: "Projects Done", value: 2, icon: FolderKanban, color: "hsl(var(--warning))" },
  { label: "XP Points", value: userProfile.totalXP, icon: Zap, color: "hsl(var(--info))" },
];

const deadlines = [
  { task: "Submit Python Functions Quiz", due: "Apr 14, 2026", status: "Due Soon" as const },
  { task: "Complete Weather Dashboard Project", due: "Apr 10, 2026", status: "Overdue" as const },
  { task: "Finish SQL Joins Lesson", due: "Apr 20, 2026", status: "On Track" as const },
];

const recommended = [
  { title: "Power BI Essentials", mentor: "Sarah Kim", level: "beginner" as const },
  { title: "Deep Learning with PyTorch", mentor: "Dr. James Lee", level: "advanced" as const },
  { title: "React & TypeScript", mentor: "Priya Sharma", level: "intermediate" as const },
];

const statusVariant: Record<string, "destructive" | "default" | "secondary"> = {
  "Due Soon": "default",
  Overdue: "destructive",
  "On Track": "secondary",
};

export default function StudentDashboard() {
  const activeCourses = courses.filter(c => c.progress > 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div {...fadeUp} className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {userProfile.name}! 👋</h1>
        <p className="text-primary-foreground/80 flex items-center gap-2">
          <Flame className="h-5 w-5 text-warning" /> {userProfile.streak}-day streak — keep going!
        </p>
      </motion.div>

      {/* My Stats */}
      <motion.section {...fadeUp} transition={{ delay: 0.1 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">My Stats</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-card border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5" style={{ color: s.color.startsWith("hsl") ? s.color : undefined }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Continue Learning */}
      <motion.section {...fadeUp} transition={{ delay: 0.15 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Continue Learning</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCourses.map((course) => (
            <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-shadow border-border">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground">{course.title}</h3>
                <Badge variant="secondary" className="capitalize">{course.level}</Badge>
                <Progress value={course.progress} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                  <Link to={`/courses/${course.id}`}>
                    <Button size="sm" variant="ghost" className="text-primary">
                      <Play className="h-3 w-3 mr-1" /> Resume
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Deadlines */}
      <motion.section {...fadeUp} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Deadlines</h2>
        <Card className="shadow-card border-border">
          <CardContent className="p-0 divide-y divide-border">
            {deadlines.map((d) => (
              <div key={d.task} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {d.status === "Overdue" ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : d.status === "On Track" ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.task}</p>
                    <p className="text-xs text-muted-foreground">{d.due}</p>
                  </div>
                </div>
                <Badge variant={statusVariant[d.status]}>{d.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Recommended */}
      <motion.section {...fadeUp} transition={{ delay: 0.25 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Recommended for You</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((r) => (
            <Card key={r.title} className="shadow-card hover:shadow-card-hover transition-shadow border-border">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground">by {r.mentor}</p>
                <Badge variant="outline" className="capitalize">{r.level}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
