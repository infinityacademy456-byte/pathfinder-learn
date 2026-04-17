import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarClock, ClipboardList, CheckSquare, ArrowRight, FolderCheck } from "lucide-react";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";

export default function MentorDashboard() {
  const { batches, classes, submissions, projects, currentMentorId } = useMentor();
  const { students } = useEnrollment();

  const myBatches = batches.filter(b => b.mentorId === currentMentorId);
  const studentCount = new Set(myBatches.flatMap(b => b.studentIds)).size;
  const upcomingClasses = classes
    .filter(c => c.status === "scheduled" && new Date(c.scheduledAt) >= new Date())
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, 5);
  const pendingSubs = submissions.filter(s => s.status === "pending");
  const pendingProjects = projects.filter(p => p.status === "pending");

  const stats = [
    { label: "Assigned Batches", value: myBatches.length, icon: Users },
    { label: "Total Students", value: studentCount, icon: Users },
    { label: "Upcoming Classes", value: upcomingClasses.length, icon: CalendarClock },
    { label: "Pending Evaluations", value: pendingSubs.length + pendingProjects.length, icon: CheckSquare },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mentor Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's your teaching snapshot</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Batches</CardTitle>
            <Link to="/mentor/batches"><Button size="sm" variant="ghost">View all <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {myBatches.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.studentIds.length} students</p>
                </div>
                <Badge variant="secondary">{b.studentIds.map(sid => students.find(s => s.id === sid)?.avatar).filter(Boolean).join(" ")}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Classes</CardTitle>
            <Link to="/mentor/classes"><Button size="sm" variant="ghost">Manage <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming classes</p>
            ) : upcomingClasses.map(c => {
              const batch = batches.find(b => b.id === c.batchId);
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{batch?.name} · {new Date(c.scheduledAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Evaluations</CardTitle>
            <Link to="/mentor/evaluations"><Button size="sm" variant="ghost">Review <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            {pendingSubs.length === 0 ? (
              <p className="text-sm text-muted-foreground">All caught up!</p>
            ) : (
              <div className="space-y-2">
                {pendingSubs.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <p className="text-sm text-foreground">{students.find(st => st.id === s.studentId)?.name}</p>
                    <Badge variant="outline">Submitted {s.submittedAt}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Project Reviews</CardTitle>
            <Link to="/mentor/projects"><Button size="sm" variant="ghost">View <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            {pendingProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects awaiting review</p>
            ) : pendingProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{students.find(s => s.id === p.studentId)?.name}</p>
                </div>
                <FolderCheck className="h-4 w-4 text-warning" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
