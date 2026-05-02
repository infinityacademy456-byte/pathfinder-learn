import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, Plus, Edit3, X } from "lucide-react";
import { useMentor, type ClassSession } from "@/contexts/MentorContext";
import { toast } from "sonner";
import { isSafeUrl, safeHref } from "@/lib/safe-url";

export default function MentorClasses() {
  const { classes, batches, currentMentorId, scheduleClass, updateClass, cancelClass } = useMentor();
  const myBatches = batches.filter(b => b.mentorId === currentMentorId);
  const myClasses = classes.filter(c => myBatches.some(b => b.id === c.batchId)).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClassSession | null>(null);
  const [form, setForm] = useState({ batchId: myBatches[0]?.id || "", title: "", description: "", scheduledAt: "", durationMin: 60, meetingLink: "" });

  const reset = () => setForm({ batchId: myBatches[0]?.id || "", title: "", description: "", scheduledAt: "", durationMin: 60, meetingLink: "" });

  const submit = () => {
    if (!form.title || !form.scheduledAt || !form.batchId) { toast.error("Fill required fields"); return; }
    if (form.meetingLink && !isSafeUrl(form.meetingLink)) {
      toast.error("Meeting link must be a valid http(s):// URL");
      return;
    }
    const payload = { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() };
    if (editing) {
      updateClass(editing.id, payload);
      toast.success("Class updated — students notified");
    } else {
      scheduleClass(payload);
      toast.success("Class scheduled — students notified");
    }
    setOpen(false); setEditing(null); reset();
  };

  const openEdit = (c: ClassSession) => {
    setEditing(c);
    setForm({
      batchId: c.batchId, title: c.title, description: c.description,
      scheduledAt: c.scheduledAt.slice(0, 16), durationMin: c.durationMin, meetingLink: c.meetingLink,
    });
    setOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-sm text-muted-foreground">Schedule, update, and manage your live sessions</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); reset(); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Schedule Class</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Update Class" : "Schedule New Class"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Batch</Label>
                <Select value={form.batchId} onValueChange={(v) => setForm(f => ({ ...f, batchId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{myBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date & Time</Label><Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} /></div>
                <div><Label>Duration (min)</Label><Input type="number" value={form.durationMin} onChange={e => setForm(f => ({ ...f, durationMin: Number(e.target.value) }))} /></div>
              </div>
              <div><Label>Meeting Link</Label><Input placeholder="https://meet.example.com/..." value={form.meetingLink} onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>{editing ? "Update" : "Schedule"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {myClasses.map(c => {
          const batch = batches.find(b => b.id === c.batchId);
          return (
            <Card key={c.id} className="shadow-card">
              <CardContent className="p-4 flex items-start gap-4 flex-wrap">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarClock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <Badge variant={c.status === "scheduled" ? "default" : c.status === "completed" ? "secondary" : "destructive"}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{batch?.name} · {new Date(c.scheduledAt).toLocaleString()} · {c.durationMin} min</p>
                  <p className="text-sm text-foreground mt-1">{c.description}</p>
                  {c.meetingLink && <a href={c.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-primary underline">{c.meetingLink}</a>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}><Edit3 className="h-3 w-3 mr-1" />Edit</Button>
                  {c.status === "scheduled" && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { cancelClass(c.id); toast.success("Class cancelled"); }}><X className="h-3 w-3 mr-1" />Cancel</Button>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
