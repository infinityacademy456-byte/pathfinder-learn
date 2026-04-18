import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, CheckCircle2, Eye, Send, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { projects } from "@/data/mockData";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { useMentor } from "@/contexts/MentorContext";

const levelColor = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-warning/10 text-warning",
  advanced: "bg-destructive/10 text-destructive",
};

export default function Projects() {
  const navigate = useNavigate();
  const { currentStudentId } = useEnrollment();
  const { getStudentBatches, getStudentProjects, submitProject } = useMentor();

  const myBatches = getStudentBatches(currentStudentId);
  const myProjectSubs = getStudentProjects(currentStudentId);

  const [submitOpen, setSubmitOpen] = useState<{ title: string } | null>(null);
  const [batchId, setBatchId] = useState(myBatches[0]?.id ?? "");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!submitOpen) return;
    if (!batchId) { toast.error("No assigned batch — contact admin"); return; }
    if (!url.trim()) { toast.error("Add a project link"); return; }
    submitProject(currentStudentId, batchId, submitOpen.title, notes ? `${url} — ${notes}` : url);
    toast.success("Project submitted — awaiting mentor review");
    setSubmitOpen(null); setUrl(""); setNotes("");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Projects</h1>
        <p className="text-muted-foreground">Build real-world projects to solidify your skills.</p>
      </motion.div>

      {/* My submissions */}
      {myProjectSubs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">My Submissions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {myProjectSubs.map(p => (
              <Card key={p.id} className="shadow-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-xs text-muted-foreground break-all">{p.url}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Submitted {new Date(p.submittedAt).toLocaleDateString()}</p>
                      {p.feedback && <p className="text-xs italic text-muted-foreground mt-2">"{p.feedback}"</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"} className="capitalize">
                        {p.status}
                      </Badge>
                      {p.score != null ? (
                        <Badge className="block bg-accent text-accent-foreground">
                          <Award className="h-3 w-3 mr-1 inline" />{p.score}/100
                        </Badge>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">Awaiting review</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all border-border h-full flex flex-col hover:-translate-y-0.5">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColor[project.level]}`}>
                    {project.level}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{project.estimatedTime}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Steps:</p>
                  <div className="space-y-1">
                    {project.steps.slice(0, 3).map((step, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                    {project.steps.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-5">+{project.steps.length - 3} more steps</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Start Project <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border"
                    title="Submit for review"
                    onClick={() => { setSubmitOpen({ title: project.title }); setBatchId(myBatches[0]?.id ?? ""); }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!submitOpen} onOpenChange={o => !o && setSubmitOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit: {submitOpen?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {myBatches.length > 1 && (
              <div>
                <Label>Batch</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{myBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Project link (GitHub, Drive, demo URL)</Label>
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/you/project" />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Brief description, what to look at..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(null)}>Cancel</Button>
            <Button onClick={submit}><Send className="h-4 w-4 mr-1" />Submit for review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
