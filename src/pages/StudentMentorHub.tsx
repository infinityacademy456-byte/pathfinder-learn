import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarClock, FileText, ClipboardList, MessageCircle, UserCheck2, Award, Plus, Send, Play, ExternalLink } from "lucide-react";
import { useMentor, type ClassSession } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";
import { safeHref } from "@/lib/safe-url";

export default function StudentMentorHub() {
  const { currentStudentId } = useEnrollment();
  const {
    getStudentBatches, getStudentClasses, getStudentMaterials, getStudentTasks,
    getStudentSubmissions, getStudentAttendance, getStudentQueries, raiseQuery,
    tasks: allTasks,
  } = useMentor();

  const sid = currentStudentId;
  const myBatches = getStudentBatches(sid);
  const myClasses = getStudentClasses(sid).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const myMaterials = getStudentMaterials(sid);
  const myTasks = getStudentTasks(sid);
  const mySubs = getStudentSubmissions(sid);
  const myAttendance = getStudentAttendance(sid);
  const myQueries = getStudentQueries(sid);

  const [open, setOpen] = useState(false);
  const [qForm, setQForm] = useState({ batchId: myBatches[0]?.id || "", subject: "", text: "" });
  const [recording, setRecording] = useState<ClassSession | null>(null);

  const submitQuery = () => {
    if (!qForm.subject || !qForm.text || !qForm.batchId) { toast.error("Fill all fields"); return; }
    raiseQuery(sid, qForm.batchId, qForm.subject, qForm.text);
    toast.success("Query sent to mentor");
    setOpen(false);
    setQForm({ batchId: myBatches[0]?.id || "", subject: "", text: "" });
  };

  if (myBatches.length === 0) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Mentor Hub</h1>
        <p className="text-sm text-muted-foreground mt-3">You are not assigned to any mentor batch yet.</p>
      </div>
    );
  }

  return (
    <motion.div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mentor Hub</h1>
        <p className="text-sm text-muted-foreground">Live classes, materials, marks & doubts from your mentor</p>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="classes"><CalendarClock className="h-4 w-4 mr-1" />Classes</TabsTrigger>
          <TabsTrigger value="materials"><FileText className="h-4 w-4 mr-1" />Materials</TabsTrigger>
          <TabsTrigger value="tasks"><ClipboardList className="h-4 w-4 mr-1" />Tasks</TabsTrigger>
          <TabsTrigger value="marks"><Award className="h-4 w-4 mr-1" />Marks</TabsTrigger>
          <TabsTrigger value="attendance"><UserCheck2 className="h-4 w-4 mr-1" />Attendance</TabsTrigger>
          <TabsTrigger value="queries"><MessageCircle className="h-4 w-4 mr-1" />Queries</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-4 space-y-3">
          {myClasses.length === 0 && <p className="text-sm text-muted-foreground p-4">No scheduled classes</p>}
          {myClasses.map(c => {
            const batch = myBatches.find(b => b.id === c.batchId);
            return (
              <Card key={c.id} className="shadow-card">
                <CardContent className="p-4 flex items-start gap-3 flex-wrap">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarClock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <Badge variant={c.status === "scheduled" ? "default" : c.status === "completed" ? "secondary" : "destructive"}>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.scheduledAt).toLocaleString()} · {c.durationMin} min
                      {batch && ` · Mentor Smith`}
                    </p>
                    <p className="text-sm text-foreground mt-1">{c.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {c.status === "scheduled" && safeHref(c.meetingLink) && (
                      <Button asChild size="sm">
                        <a href={safeHref(c.meetingLink)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />Join Live
                        </a>
                      </Button>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span tabIndex={c.recordingUrl ? -1 : 0}>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!c.recordingUrl}
                              onClick={() => c.recordingUrl && setRecording(c)}
                            >
                              <Play className="h-3 w-3 mr-1" />Play Recording
                            </Button>
                          </span>
                        </TooltipTrigger>
                        {!c.recordingUrl && (
                          <TooltipContent>Recording not available yet</TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="materials" className="mt-4 grid gap-3 md:grid-cols-2">
          {myMaterials.length === 0 && <p className="text-sm text-muted-foreground p-4">No materials yet</p>}
          {myMaterials.map(m => (
            <Card key={m.id} className="shadow-card">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                    <Badge variant="outline" className="capitalize">{m.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.uploadedAt}</p>
                  <p className="text-sm text-foreground mt-1">{m.description}</p>
                  <Button size="sm" variant="link" className="px-0">Open</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4 space-y-3">
          {myTasks.map(t => {
            const sub = mySubs.find(s => s.taskId === t.id);
            return (
              <Card key={t.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{t.title}</h3>
                      <p className="text-xs text-muted-foreground">Due {t.deadline}</p>
                      <p className="text-sm text-foreground mt-1">{t.description}</p>
                    </div>
                    <Badge variant={!sub ? "destructive" : sub.status === "reviewed" ? "default" : "secondary"}>
                      {!sub ? "Not submitted" : sub.status === "reviewed" ? `${sub.marks}/100` : "Pending review"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="marks" className="mt-4 space-y-2">
          {mySubs.filter(s => s.status === "reviewed").length === 0 && <p className="text-sm text-muted-foreground p-4">No marks yet</p>}
          {mySubs.filter(s => s.status === "reviewed").map(s => {
            const t = allTasks.find(tt => tt.id === s.taskId);
            return (
              <Card key={s.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{t?.title || "Task"}</p>
                      <p className="text-sm text-muted-foreground">Feedback: {s.feedback}</p>
                    </div>
                    <Badge className="text-base px-3 py-1">{s.marks}/100</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Attendance Record</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {myAttendance.length === 0 ? <p className="text-sm text-muted-foreground">No attendance records yet</p> :
                myAttendance.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.class?.title || "Class"}</p>
                      <p className="text-xs text-muted-foreground">{a.class ? new Date(a.class.scheduledAt).toLocaleDateString() : ""}</p>
                    </div>
                    <Badge variant={a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary"} className="capitalize">{a.status}</Badge>
                  </div>
                ))
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Raise Query</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Ask your mentor</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Batch</Label>
                    <Select value={qForm.batchId} onValueChange={v => setQForm(f => ({ ...f, batchId: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{myBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Subject</Label><Input value={qForm.subject} onChange={e => setQForm(f => ({ ...f, subject: e.target.value }))} /></div>
                  <div><Label>Your question</Label><Textarea rows={4} value={qForm.text} onChange={e => setQForm(f => ({ ...f, text: e.target.value }))} /></div>
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submitQuery}><Send className="h-4 w-4 mr-1" />Send</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {myQueries.map(q => (
            <Card key={q.id} className="shadow-card">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-foreground">{q.subject}</h3>
                  <Badge variant={q.status === "open" ? "destructive" : q.status === "answered" ? "default" : "secondary"} className="capitalize">{q.status}</Badge>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {q.messages.map((m, i) => (
                    <div key={i} className={`p-2 rounded text-sm ${m.authorRole === "mentor" ? "bg-primary/10" : "bg-secondary"}`}>
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">{m.authorRole}</p>
                      {m.text}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Recording playback dialog */}
      <Dialog open={!!recording} onOpenChange={o => !o && setRecording(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{recording?.title} — Recording</DialogTitle>
          </DialogHeader>
          {recording?.recordingUrl && (
            <video controls autoPlay className="w-full rounded-lg bg-black aspect-video" src={recording.recordingUrl}>
              Your browser does not support video playback.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
