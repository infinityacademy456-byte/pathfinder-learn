import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";

export default function MentorTasks() {
  const { tasks, batches, currentMentorId, createTask, deleteTask, submissions } = useMentor();
  const { students } = useEnrollment();
  const myBatches = batches.filter(b => b.mentorId === currentMentorId);
  const myTasks = tasks.filter(t => myBatches.some(b => b.id === t.batchId));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ batchId: myBatches[0]?.id || "", title: "", description: "", deadline: "" });

  const submit = () => {
    if (!form.title || !form.deadline || !form.batchId) { toast.error("Fill all fields"); return; }
    createTask(form);
    toast.success("Task assigned — students notified");
    setOpen(false);
    setForm({ batchId: myBatches[0]?.id || "", title: "", description: "", deadline: "" });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">Create assignments and track submissions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> New Task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Batch</Label>
                <Select value={form.batchId} onValueChange={(v) => setForm(f => ({ ...f, batchId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{myBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {myTasks.map(t => {
          const batch = batches.find(b => b.id === t.batchId);
          const taskSubs = submissions.filter(s => s.taskId === t.id);
          const totalStudents = batch?.studentIds.length || 0;
          return (
            <Card key={t.id} className="shadow-card">
              <CardContent className="p-4 flex items-start gap-3 flex-wrap">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{batch?.name} · Due {t.deadline}</p>
                  <p className="text-sm text-foreground mt-1">{t.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary">{taskSubs.length}/{totalStudents} submitted</Badge>
                    <Badge variant="outline">{taskSubs.filter(s => s.status === "reviewed").length} graded</Badge>
                  </div>
                  {taskSubs.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-border pt-2">
                      {taskSubs.map(s => (
                        <div key={s.id} className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{students.find(st => st.id === s.studentId)?.name}</span>
                          <span>{s.status === "reviewed" ? `${s.marks}/100` : "Pending review"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => { deleteTask(t.id); toast.success("Task deleted"); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
