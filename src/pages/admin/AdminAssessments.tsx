import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, BookOpen, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PendingContent {
  id: string; title: string; type: "course" | "video" | "project";
  mentor: string; submitted: string; status: "pending" | "approved" | "rejected";
}

const initialContent: PendingContent[] = [
  { id: "pc1", title: "Advanced Python Decorators", type: "course", mentor: "Dr. Sarah Lin", submitted: "2d ago", status: "pending" },
  { id: "pc2", title: "SQL Window Functions Video", type: "video", mentor: "Priya Sharma", submitted: "1d ago", status: "pending" },
  { id: "pc3", title: "REST API Project", type: "project", mentor: "Dr. Sarah Lin", submitted: "3d ago", status: "approved" },
];

export default function AdminAssessments() {
  const [content, setContent] = useState(initialContent);
  const approveContent = (id: string) => setContent((p) => p.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)));
  const rejectContent = (id: string) => setContent((p) => p.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /> Content Approval</h1>
      </motion.div>
      <div className="space-y-3">
        {content.map((c) => (
          <Card key={c.id} className="shadow-card border-border">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                  {c.type === "video" ? <Eye className="h-4 w-4 text-info" /> : <BookOpen className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">By {c.mentor} · {c.submitted} · <span className="capitalize">{c.type}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "pending" ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => approveContent(c.id)} className="text-success border-success/30 hover:bg-success/10"><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => rejectContent(c.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                  </>
                ) : (
                  <Badge variant={c.status === "approved" ? "default" : "destructive"} className="capitalize text-xs">{c.status}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
