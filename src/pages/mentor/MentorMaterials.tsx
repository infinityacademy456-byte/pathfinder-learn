import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2, FileType2, ClipboardList } from "lucide-react";
import { useMentor, type Material } from "@/contexts/MentorContext";
import { toast } from "sonner";

const typeIcon = (t: Material["type"]) => t === "pdf" ? FileType2 : t === "assignment" ? ClipboardList : FileText;

export default function MentorMaterials() {
  const { materials, batches, currentMentorId, uploadMaterial, deleteMaterial } = useMentor();
  const myBatches = batches.filter(b => b.mentorId === currentMentorId);
  const myMaterials = materials.filter(m => myBatches.some(b => b.id === m.batchId));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ batchId: string; title: string; type: Material["type"]; description: string; url: string }>({
    batchId: myBatches[0]?.id || "", title: "", type: "note", description: "", url: ""
  });

  const submit = () => {
    if (!form.title || !form.batchId) { toast.error("Title & batch required"); return; }
    uploadMaterial(form);
    toast.success("Material uploaded — students notified");
    setOpen(false);
    setForm({ batchId: myBatches[0]?.id || "", title: "", type: "note", description: "", url: "" });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Content Materials</h1>
          <p className="text-sm text-muted-foreground">Upload notes, PDFs, and assignments for your batches</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Upload</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Material</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Batch</Label>
                <Select value={form.batchId} onValueChange={(v) => setForm(f => ({ ...f, batchId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{myBatches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v: Material["type"]) => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div><Label>URL / Reference</Label><Input placeholder="https://... or filename.pdf" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Upload</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {myMaterials.map(m => {
          const Icon = typeIcon(m.type);
          const batch = batches.find(b => b.id === m.batchId);
          return (
            <Card key={m.id} className="shadow-card">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{m.title}</h3>
                    <Badge variant="outline" className="capitalize">{m.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{batch?.name} · {m.uploadedAt}</p>
                  <p className="text-sm text-foreground mt-1">{m.description}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => { deleteMaterial(m.id); toast.success("Deleted"); }}>
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
