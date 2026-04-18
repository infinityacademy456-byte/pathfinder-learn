import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, BookOpenCheck, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollment, type Enrollment, type EnrollmentCourse } from "@/contexts/EnrollmentContext";
import { EmptyState } from "@/components/EmptyState";

type EnrolledRow = Enrollment & { course: EnrollmentCourse };

function CourseCard({ enrollment, i }: { enrollment: EnrolledRow; i: number }) {
  const isCompleted = enrollment.status === "completed";
  const notStarted = enrollment.progress === 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Card className="shadow-card hover:shadow-card-hover transition-shadow border-border h-full flex flex-col">
        <CardContent className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{enrollment.course.title}</h3>
            <Badge variant="outline" className="text-[10px] shrink-0">{enrollment.course.category}</Badge>
          </div>

          <Progress value={enrollment.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {enrollment.lessonsCompleted} of {enrollment.course.totalLessons} lessons completed
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-accent text-accent-foreground" : ""}>
              {isCompleted ? "Completed" : notStarted ? "Not Started" : "In Progress"}
            </Badge>
            {isCompleted && (
              <Badge className="bg-warning/20 text-warning border-warning/30">Certificate Earned</Badge>
            )}
          </div>

          <div className="mt-auto pt-2">
            {isCompleted ? (
              <Link to="/certificates">
                <Button size="sm" className="w-full" variant="outline">View Certificate</Button>
              </Link>
            ) : (
              <Link to={`/courses/${enrollment.courseId}`}>
                <Button size="sm" className="w-full">
                  {notStarted ? "Start Course" : "Continue Learning"}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CoursesPage() {
  const { currentStudentId, getStudentEnrollments } = useEnrollment();
  const myEnrollments = getStudentEnrollments(currentStudentId);

  const notStarted = myEnrollments.filter(e => e.progress === 0);
  const inProgress = myEnrollments.filter(e => e.progress > 0 && e.status !== "completed");
  const completed = myEnrollments.filter(e => e.status === "completed");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Courses</h1>
        <p className="text-sm text-muted-foreground">{myEnrollments.length} total · {completed.length} completed</p>
      </motion.div>

      {myEnrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses assigned yet"
          description="Your admin will assign courses to you soon."
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({myEnrollments.length})</TabsTrigger>
            <TabsTrigger value="not-started">Not Started ({notStarted.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myEnrollments.map((e, i) => <CourseCard key={e.id} enrollment={e} i={i} />)}
            </div>
          </TabsContent>
          <TabsContent value="not-started" className="mt-4">
            {notStarted.length === 0
              ? <EmptyState icon={PlayCircle} title="Nothing waiting to start" description="All your assigned courses are underway." />
              : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{notStarted.map((e, i) => <CourseCard key={e.id} enrollment={e} i={i} />)}</div>}
          </TabsContent>
          <TabsContent value="in-progress" className="mt-4">
            {inProgress.length === 0
              ? <EmptyState icon={PlayCircle} title="No active courses" description="Start a course to see it here." />
              : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{inProgress.map((e, i) => <CourseCard key={e.id} enrollment={e} i={i} />)}</div>}
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            {completed.length === 0
              ? <EmptyState icon={BookOpenCheck} title="No completed courses yet" description="Finish a course to see it here — completed courses stay forever." />
              : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{completed.map((e, i) => <CourseCard key={e.id} enrollment={e} i={i} />)}</div>}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
