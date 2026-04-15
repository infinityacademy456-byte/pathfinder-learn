import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEnrollment } from "@/contexts/EnrollmentContext";

export default function CoursesPage() {
  const { currentStudentId, getStudentEnrollments } = useEnrollment();
  const myEnrollments = getStudentEnrollments(currentStudentId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-foreground">
        My Courses
      </motion.h1>

      {myEnrollments.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No courses assigned yet</h2>
          <p className="text-muted-foreground max-w-md">Your admin will assign courses to you soon.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myEnrollments.map((enrollment, i) => {
            const isCompleted = enrollment.status === "completed";
            return (
              <motion.div key={enrollment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
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

                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-accent text-accent-foreground" : ""}>
                        {isCompleted ? "Completed" : "In Progress"}
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
                          <Button size="sm" className="w-full">Continue Learning</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
