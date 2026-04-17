import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";

export default function MentorQueries() {
  const { queries, batches, currentMentorId, replyToQuery, resolveQuery } = useMentor();
  const { students } = useEnrollment();
  const myBatchIds = batches.filter(b => b.mentorId === currentMentorId).map(b => b.id);
  const myQueries = queries.filter(q => myBatchIds.includes(q.batchId));
  const [replies, setReplies] = useState<Record<string, string>>({});

  const reply = (id: string) => {
    const text = replies[id]?.trim();
    if (!text) return;
    replyToQuery(id, text);
    toast.success("Reply sent — student notified");
    setReplies(r => ({ ...r, [id]: "" }));
  };

  const renderQ = (list: typeof myQueries) => (
    <div className="grid gap-3">
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground p-6 text-center">No queries here</p>
      ) : list.map(q => {
        const student = students.find(s => s.id === q.studentId);
        return (
          <Card key={q.id} className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{q.subject}</h3>
                  <p className="text-xs text-muted-foreground">From {student?.name} · {new Date(q.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant={q.status === "open" ? "destructive" : q.status === "answered" ? "default" : "secondary"} className="capitalize">{q.status}</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {q.messages.map((m, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm ${m.authorRole === "mentor" ? "bg-primary/10 ml-6" : "bg-secondary mr-6"}`}>
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">{m.authorRole === "mentor" ? "You" : student?.name}</p>
                    {m.text}
                  </div>
                ))}
              </div>
              {q.status !== "resolved" && (
                <div className="flex gap-2">
                  <Input placeholder="Type your reply..." value={replies[q.id] || ""} onChange={e => setReplies(r => ({ ...r, [q.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") reply(q.id); }} />
                  <Button onClick={() => reply(q.id)}><Send className="h-4 w-4" /></Button>
                  <Button variant="outline" onClick={() => { resolveQuery(q.id); toast.success("Marked resolved"); }}><CheckCircle2 className="h-4 w-4" /></Button>
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Student Queries</h1>
        <p className="text-sm text-muted-foreground">Reply to doubts and maintain conversation history</p>
      </div>
      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({myQueries.filter(q => q.status === "open").length})</TabsTrigger>
          <TabsTrigger value="answered">Answered ({myQueries.filter(q => q.status === "answered").length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({myQueries.filter(q => q.status === "resolved").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-4">{renderQ(myQueries.filter(q => q.status === "open"))}</TabsContent>
        <TabsContent value="answered" className="mt-4">{renderQ(myQueries.filter(q => q.status === "answered"))}</TabsContent>
        <TabsContent value="resolved" className="mt-4">{renderQ(myQueries.filter(q => q.status === "resolved"))}</TabsContent>
      </Tabs>
    </div>
  );
}
