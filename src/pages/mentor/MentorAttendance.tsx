import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMentor, type AttendanceRecord } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";

const statusColors: Record<AttendanceRecord["status"], "default" | "destructive" | "secondary"> = {
  present: "default",
  absent: "destructive",
  late: "secondary",
};

export default function MentorAttendance() {
  const { classes, batches, attendance, currentMentorId, markAttendance } = useMentor();
  const { students } = useEnrollment();
  const myBatches = batches.filter(b => b.mentorId === currentMentorId);
  const myClasses = classes.filter(c => myBatches.some(b => b.id === c.batchId));
  const [selectedClassId, setSelectedClassId] = useState(myClasses[0]?.id || "");

  const cls = classes.find(c => c.id === selectedClassId);
  const batch = batches.find(b => b.id === cls?.batchId);
  const studentList = batch?.studentIds.map(sid => students.find(s => s.id === sid)).filter(Boolean) || [];

  const getStatus = (sid: string) => attendance.find(a => a.classId === selectedClassId && a.studentId === sid)?.status;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Mark student attendance per class</p>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              {myClasses.map(c => {
                const b = batches.find(bb => bb.id === c.batchId);
                return <SelectItem key={c.id} value={c.id}>{c.title} — {b?.name} ({new Date(c.scheduledAt).toLocaleDateString()})</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {cls && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">{cls.title} — {batch?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studentList.map(s => s && (
                <div key={s.id} className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{s.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatus(s.id) && <Badge variant={statusColors[getStatus(s.id)!]} className="capitalize">{getStatus(s.id)}</Badge>}
                    <div className="flex gap-1">
                      {(["present", "absent", "late"] as const).map(st => (
                        <Button key={st} size="sm" variant={getStatus(s.id) === st ? "default" : "outline"}
                          onClick={() => { markAttendance(selectedClassId, s.id, st); toast.success(`${s.name} marked ${st}`); }}>
                          {st[0].toUpperCase() + st.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
