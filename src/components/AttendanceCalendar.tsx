import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";

type DayStatus = "present" | "absent" | "late" | "none";

const STATUS_STYLES: Record<DayStatus, string> = {
  present: "bg-accent text-accent-foreground",
  absent: "bg-destructive text-destructive-foreground",
  late: "bg-warning text-warning-foreground",
  none: "bg-secondary text-muted-foreground",
};

export function AttendanceCalendar() {
  const { currentStudentId } = useEnrollment();
  const { getStudentAttendance } = useMentor();
  const records = getStudentAttendance(currentStudentId);

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const statusByDate = useMemo(() => {
    const map = new Map<string, DayStatus>();
    for (const r of records) {
      if (!r.class) continue;
      const key = new Date(r.class.scheduledAt).toISOString().split("T")[0];
      map.set(key, r.status);
    }
    return map;
  }, [records]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const present = records.filter(r => r.status === "present").length;
  const absent = records.filter(r => r.status === "absent").length;
  const late = records.filter(r => r.status === "late").length;
  const total = present + absent + late;
  const rate = total ? Math.round((present / total) * 100) : 0;

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Attendance — {monthLabel}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground text-center">
          {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const key = new Date(year, month, day).toISOString().split("T")[0];
            const status = statusByDate.get(key) ?? "none";
            return (
              <div
                key={i}
                title={status === "none" ? "" : status}
                className={`aspect-square rounded text-[11px] flex items-center justify-center font-medium ${STATUS_STYLES[status]}`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" />{present}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />{late}</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />{absent}</span>
          </div>
          <span className="font-semibold text-foreground">{rate}% attendance</span>
        </div>
      </CardContent>
    </Card>
  );
}
