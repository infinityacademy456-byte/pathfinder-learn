import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Trash2, Plus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEnrollment } from "@/contexts/EnrollmentContext";

export default function ManageEnrollments() {
  const { students, courses, enrollments, enrollStudent, removeEnrollment, getStudentEnrollments, getCourseStudents } = useEnrollment();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const [removeDialog, setRemoveDialog] = useState<{ studentId: string; courseId: string; studentName: string; courseTitle: string } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  const selectedStudent = students.find(s => s.id === selectedStudentId)!;
  const studentEnrollments = getStudentEnrollments(selectedStudentId);
  const enrolledCourseIds = new Set(studentEnrollments.map(e => e.courseId));
  const availableCourses = courses.filter(c => !enrolledCourseIds.has(c.id));

  const handleRemove = () => {
    if (!removeDialog) return;
    removeEnrollment(removeDialog.studentId, removeDialog.courseId);
    toast.success(`${removeDialog.studentName} removed from ${removeDialog.courseTitle}`);
    setRemoveDialog(null);
  };

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)!;
    enrollStudent(selectedStudentId, courseId);
    toast.success(`${selectedStudent.name} enrolled in ${course.title} successfully`);
  };

  const handleBulkEnroll = () => {
    bulkSelected.forEach(cId => enrollStudent(selectedStudentId, cId));
    toast.success(`${selectedStudent.name} enrolled in ${bulkSelected.length} courses`);
    setBulkSelected([]);
    setBulkOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="h-7 w-7 text-primary" /> Manage Enrollments
        </h1>
        <p className="text-muted-foreground">Assign and remove course access for students.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: Students list */}
        <Card className="shadow-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Students</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {students.map(s => {
              const count = enrollments.filter(e => e.studentId === s.id).length;
              const isActive = s.id === selectedStudentId;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    isActive ? "bg-primary/10 border border-primary" : "hover:bg-secondary border border-transparent"
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{count}</Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Right: Course management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-foreground">Courses for {selectedStudent.name}</h2>
            {availableCourses.length > 0 && (
              <Button size="sm" onClick={() => { setBulkSelected([]); setBulkOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Bulk Enroll
              </Button>
            )}
          </div>

          {/* Enrolled */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Enrolled Courses ({studentEnrollments.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {studentEnrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">No enrollments yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {studentEnrollments.map(e => (
                    <div key={e.id} className="flex items-center gap-4 p-4 flex-wrap">
                      <div className="flex-1 min-w-[200px] space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{e.course.title}</span>
                          <Badge variant="outline" className="text-[10px]">{e.course.category}</Badge>
                          <Badge variant={e.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                            {e.status === "completed" ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={e.progress} className="h-1.5 flex-1 max-w-[200px]" />
                          <span className="text-xs text-muted-foreground">{e.progress}%</span>
                          <span className="text-xs text-muted-foreground">Enrolled: {e.enrolledAt}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRemoveDialog({
                          studentId: selectedStudentId,
                          courseId: e.courseId,
                          studentName: selectedStudent.name,
                          courseTitle: e.course.title,
                        })}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove Access
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Available Courses ({availableCourses.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {availableCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">Student is enrolled in all courses.</p>
              ) : (
                <div className="divide-y divide-border">
                  {availableCourses.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.title}</span>
                        <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                        <span className="text-xs text-muted-foreground">{c.totalLessons} lessons</span>
                      </div>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleEnroll(c.id)}>
                        <Plus className="h-3 w-3 mr-1" /> Enroll
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove confirm dialog */}
      <Dialog open={!!removeDialog} onOpenChange={() => setRemoveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Enrollment?</DialogTitle>
            <DialogDescription>
              Remove {removeDialog?.studentName} from {removeDialog?.courseTitle}? They will lose all progress and access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemove}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk enroll dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Enroll — {selectedStudent.name}</DialogTitle>
            <DialogDescription>Select courses to enroll this student in.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {availableCourses.map(c => (
              <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={bulkSelected.includes(c.id)}
                  onCheckedChange={(checked) => {
                    setBulkSelected(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                  }}
                />
                <span className="text-sm text-foreground">{c.title}</span>
                <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button disabled={bulkSelected.length === 0} onClick={handleBulkEnroll}>
              Enroll in {bulkSelected.length} Course{bulkSelected.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
