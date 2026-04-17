import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export default function MentorEvaluations() {
  const { submissions, tasks, evaluateSubmission } = useMentor();
  const { students } = useEnrollment();
  const [drafts, setDrafts] = useState<Record<string, { marks: string; feedback: string }>>({});

  const setDraft = (id: string, patch: Partial<{ marks: string; feedback: string }>) => {
    setDrafts(d => ({ ...d, [id]: { marks: d[id]?.marks || "", feedback: d[id]?.feedback || "", ...patch } }));
  };

  const submit = (id: string) => {
    const d = drafts[id];
    const marks = Number(d?.marks);
    if (!d?.marks || isNaN(marks) || marks < 0 || marks > 100) { toast.error("Marks must be 0-100"); return; }
    evaluateSubmission(id, marks, d.feedback || "");
    toast.success("Evaluation saved — student notified");
  };

  const renderList = (list: typeof submissions) => (
    <div className="grid gap-3">
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground p-6 text-center">No submissions in this category</p>
      ) : list.map(s => {
        const task = tasks.find(t => t.id === s.taskId);
        const student = students.find(st => st.id === s.studentId);
        return (
          <Card key={s.id} className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{task?.title || "Submission"}</h3>
                  <p className="text-xs text-muted-foreground">By {student?.name} · Submitted {s.submittedAt}</p>
                  <p className="text-sm text-foreground mt-2">Submission: <a href="#" className="text-primary underline">{s.content}</a></p>
                </div>
                <Badge variant={s.status === "reviewed" ? "default" : "outline"}>
                  {s.status === "reviewed" ? <><CheckCircle2 className="h-3 w-3 mr-1" />Reviewed</> : "Pending"}
                </Badge>
              </div>
              {s.status === "reviewed" ? (
                <div className="bg-secondary/50 p-3 rounded-lg space-y-1">
                  <p className="text-sm"><span className="font-semibold">Marks:</span> {s.marks}/100</p>
                  <p className="text-sm"><span className="font-semibold">Feedback:</span> {s.feedback}</p>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-[120px_1fr_auto] items-end">
                  <div><Label className="text-xs">Marks (0-100)</Label><Input type="number" min={0} max={100} value={drafts[s.id]?.marks || ""} onChange={e => setDraft(s.id, { marks: e.target.value })} /></div>
                  <div><Label className="text-xs">Feedback</Label><Textarea rows={2} value={drafts[s.id]?.feedback || ""} onChange={e => setDraft(s.id, { feedback: e.target.value })} /></div>
                  <Button onClick={() => submit(s.id)}>Save</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Evaluations</h1>
        <p className="text-sm text-muted-foreground">Review submissions, give marks and feedback</p>
      </div>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({submissions.filter(s => s.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({submissions.filter(s => s.status === "reviewed").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{renderList(submissions.filter(s => s.status === "pending"))}</TabsContent>
        <TabsContent value="reviewed" className="mt-4">{renderList(submissions.filter(s => s.status === "reviewed"))}</TabsContent>
      </Tabs>
    </div>
  );
}
