import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Send, CheckCircle2, Clock, AlertCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMentor, type MentorTask } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { EmptyState } from "@/components/EmptyState";

type Bucket = "active" | "pending" | "completed";

export default function StudentTasks() {
  const { currentStudentId } = useEnrollment();
  const { getStudentTasks, getStudentSubmissions, submitTask } = useMentor();

  const myTasks = getStudentTasks(currentStudentId);
  const mySubs = getStudentSubmissions(currentStudentId);

  const [openTask, setOpenTask] = useState<MentorTask | null>(null);
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const buckets = useMemo(() => {
    const active: MentorTask[] = [];
    const pending: MentorTask[] = [];
    const completed: MentorTask[] = [];
    for (const t of myTasks) {
      const sub = mySubs.find(s => s.taskId === t.id);
      if (sub?.status === "reviewed") completed.push(t);
      else if (sub) pending.push(t);
      else active.push(t);
    }
    return { active, pending, completed };
  }, [myTasks, mySubs]);

  const submit = () => {
    if (!openTask) return;
    if (!content.trim()) { toast.error("Add a description of your work"); return; }
    submitTask(openTask.id, currentStudentId, link ? `${content}\n\nLink: ${link}` : content);
    toast.success("Task submitted — awaiting review");
    setOpenTask(null);
    setContent(""); setLink("");
  };

  const renderTask = (t: MentorTask, bucket: Bucket) => {
    const sub = mySubs.find(s => s.taskId === t.id);
    const overdue = bucket === "active" && t.deadline < today;
    return (
      <Card key={t.id} className="shadow-card border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-[10px]">Due {t.deadline}</Badge>
                {overdue && <Badge variant="destructive" className="text-[10px]">Overdue</Badge>}
                {bucket === "completed" && sub?.marks != null && (
                  <Badge className="text-[10px] bg-accent text-accent-foreground">
                    <Award className="h-3 w-3 mr-1" />{sub.marks}/100
                  </Badge>
                )}
              </div>
              {bucket === "completed" && sub?.feedback && (
                <p className="text-xs text-muted-foreground mt-2 italic">"{sub.feedback}"</p>
              )}
            </div>
            <div className="shrink-0">
              {bucket === "active" && (
                <Button size="sm" onClick={() => { setOpenTask(t); setContent(""); setLink(""); }}>
                  <Send className="h-3 w-3 mr-1" /> Submit
                </Button>
              )}
              {bucket === "pending" && (
                <Button size="sm" variant="outline" onClick={() => { setOpenTask(t); setContent(sub?.content || ""); setLink(""); }}>
                  Resubmit
                </Button>
              )}
              {bucket === "completed" && (
                <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" />Reviewed</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-primary" /> Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Submit assignments and track mentor feedback</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active"><AlertCircle className="h-4 w-4 mr-1" />Active ({buckets.active.length})</TabsTrigger>
          <TabsTrigger value="pending"><Clock className="h-4 w-4 mr-1" />Pending ({buckets.pending.length})</TabsTrigger>
          <TabsTrigger value="completed"><CheckCircle2 className="h-4 w-4 mr-1" />Completed ({buckets.completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {buckets.active.length === 0
            ? <EmptyState icon={CheckCircle2} title="All caught up" description="No active tasks right now." />
            : buckets.active.map(t => renderTask(t, "active"))}
        </TabsContent>
        <TabsContent value="pending" className="mt-4 space-y-3">
          {buckets.pending.length === 0
            ? <EmptyState icon={Clock} title="Nothing pending review" description="Submitted tasks awaiting mentor review will appear here." />
            : buckets.pending.map(t => renderTask(t, "pending"))}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {buckets.completed.length === 0
            ? <EmptyState icon={Award} title="No reviewed tasks yet" description="Once a mentor grades your submission, it will land here." />
            : buckets.completed.map(t => renderTask(t, "completed"))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!openTask} onOpenChange={o => !o && setOpenTask(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit: {openTask?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Your work / answer</Label>
              <Textarea rows={5} value={content} onChange={e => setContent(e.target.value)} placeholder="Describe your approach, paste code, or summarize the deliverable..." />
            </div>
            <div>
              <Label>Optional link (GitHub, Drive, etc.)</Label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenTask(null)}>Cancel</Button>
            <Button onClick={submit}><Send className="h-4 w-4 mr-1" />Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
