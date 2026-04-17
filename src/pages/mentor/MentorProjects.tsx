import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";
import { CheckCircle2, XCircle, FolderCheck } from "lucide-react";

export default function MentorProjects() {
  const { projects, reviewProject } = useMentor();
  const { students } = useEnrollment();
  const [drafts, setDrafts] = useState<Record<string, { score: string; feedback: string }>>({});

  const submit = (id: string, status: "approved" | "rejected") => {
    const d = drafts[id];
    const score = Number(d?.score);
    if (!d?.score || isNaN(score) || score < 0 || score > 100) { toast.error("Score must be 0-100"); return; }
    reviewProject(id, status, score, d.feedback || "");
    toast.success(`Project ${status} — student notified`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Project Reviews</h1>
        <p className="text-sm text-muted-foreground">Approve, reject, and score student projects</p>
      </div>
      <div className="grid gap-3">
        {projects.map(p => {
          const student = students.find(s => s.id === p.studentId);
          return (
            <Card key={p.id} className="shadow-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-xs text-muted-foreground">By {student?.name} · {p.submittedAt}</p>
                      <a href="#" className="text-xs text-primary underline">{p.url}</a>
                    </div>
                  </div>
                  <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "outline"} className="capitalize">{p.status}</Badge>
                </div>
                {p.status !== "pending" ? (
                  <div className="bg-secondary/50 p-3 rounded-lg space-y-1">
                    <p className="text-sm"><span className="font-semibold">Score:</span> {p.score}/100</p>
                    <p className="text-sm"><span className="font-semibold">Feedback:</span> {p.feedback}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                      <div><Label className="text-xs">Score</Label><Input type="number" min={0} max={100} value={drafts[p.id]?.score || ""} onChange={e => setDrafts(d => ({ ...d, [p.id]: { ...d[p.id], score: e.target.value, feedback: d[p.id]?.feedback || "" } }))} /></div>
                      <div><Label className="text-xs">Feedback</Label><Textarea rows={2} value={drafts[p.id]?.feedback || ""} onChange={e => setDrafts(d => ({ ...d, [p.id]: { ...d[p.id], feedback: e.target.value, score: d[p.id]?.score || "" } }))} /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => submit(p.id, "approved")}><CheckCircle2 className="h-4 w-4 mr-1" />Approve</Button>
                      <Button variant="destructive" onClick={() => submit(p.id, "rejected")}><XCircle className="h-4 w-4 mr-1" />Reject</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
