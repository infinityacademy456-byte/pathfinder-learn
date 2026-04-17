import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";

export default function MentorBatches() {
  const { batches, currentMentorId, classes, materials, tasks } = useMentor();
  const { students, courses } = useEnrollment();
  const myBatches = batches.filter(b => b.mentorId === currentMentorId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Batches</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {myBatches.map(b => {
          const course = courses.find(c => c.id === b.courseId);
          return (
            <Card key={b.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">{b.name}</CardTitle>
                <p className="text-xs text-muted-foreground">Course: {course?.title}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {b.studentIds.map(sid => {
                    const s = students.find(st => st.id === sid);
                    return s ? (
                      <Badge key={sid} variant="secondary" className="gap-1">
                        <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">{s.avatar}</span>
                        {s.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>{classes.filter(c => c.batchId === b.id).length} classes</span>
                  <span>·</span>
                  <span>{materials.filter(m => m.batchId === b.id).length} materials</span>
                  <span>·</span>
                  <span>{tasks.filter(t => t.batchId === b.id).length} tasks</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
