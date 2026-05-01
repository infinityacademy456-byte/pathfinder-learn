import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Download, Settings2, CheckCircle2, XCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CertRule {
  id: string;
  courseTitle: string;
  requireProgress100: boolean;
  requireAllTasks: boolean;
  requireProject: boolean;
  requireQuizScore: number; // minimum % score
  enabled: boolean;
}

interface CertDownload {
  id: string;
  studentName: string;
  courseTitle: string;
  downloadedAt: string;
  certificateId: string;
}

const initialRules: CertRule[] = [
  { id: "cr1", courseTitle: "Python Fundamentals", requireProgress100: true, requireAllTasks: true, requireProject: true, requireQuizScore: 70, enabled: true },
  { id: "cr2", courseTitle: "SQL Mastery", requireProgress100: true, requireAllTasks: true, requireProject: false, requireQuizScore: 60, enabled: true },
  { id: "cr3", courseTitle: "Machine Learning Basics", requireProgress100: true, requireAllTasks: true, requireProject: true, requireQuizScore: 80, enabled: true },
  { id: "cr4", courseTitle: "Web Dev with React", requireProgress100: true, requireAllTasks: false, requireProject: true, requireQuizScore: 50, enabled: false },
];

const initialDownloads: CertDownload[] = [
  { id: "cd1", studentName: "Student C", courseTitle: "Data Analysis with Pandas", downloadedAt: "2026-02-01 14:30", certificateId: "PFL-2026-C3" },
  { id: "cd2", studentName: "Alex Chen", courseTitle: "Python Fundamentals", downloadedAt: "2026-03-15 09:12", certificateId: "PFL-2026-A1" },
  { id: "cd3", studentName: "Marcus Lee", courseTitle: "SQL Mastery", downloadedAt: "2026-04-02 16:45", certificateId: "PFL-2026-M2" },
];

export default function AdminCertificates() {
  const [rules, setRules] = useState(initialRules);
  const [downloads] = useState(initialDownloads);
  const [search, setSearch] = useState("");
  const [editRule, setEditRule] = useState<CertRule | null>(null);
  const [editQuizScore, setEditQuizScore] = useState("70");

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const rule = rules.find(r => r.id === id)!;
    toast.success(`${rule.courseTitle} certificates ${rule.enabled ? "disabled" : "enabled"}`);
  };

  const toggleCriteria = (field: "requireProgress100" | "requireAllTasks" | "requireProject") => {
    if (!editRule) return;
    setEditRule({ ...editRule, [field]: !editRule[field] });
  };

  const saveRule = () => {
    if (!editRule) return;
    const score = parseInt(editQuizScore) || 0;
    setRules(prev => prev.map(r => r.id === editRule.id ? { ...editRule, requireQuizScore: Math.min(100, Math.max(0, score)) } : r));
    toast.success(`Rules for "${editRule.courseTitle}" updated`);
    setEditRule(null);
  };

  const filteredDownloads = downloads.filter(d =>
    d.studentName.toLowerCase().includes(search.toLowerCase()) ||
    d.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
    d.certificateId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" /> Certificate Control
        </h1>
        <p className="text-sm text-muted-foreground">Define completion criteria and monitor certificate downloads.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{rules.filter(r => r.enabled).length}</p>
          <p className="text-[10px] text-muted-foreground">Active Rules</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{downloads.length}</p>
          <p className="text-[10px] text-muted-foreground">Certificates Issued</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{rules.length}</p>
          <p className="text-[10px] text-muted-foreground">Courses Configured</p>
        </CardContent></Card>
      </div>

      {/* Certificate Rules */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Settings2 className="h-4 w-4" /> Completion Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Course</TableHead>
              <TableHead className="text-center">100% Progress</TableHead>
              <TableHead className="text-center">All Tasks</TableHead>
              <TableHead className="text-center">Project</TableHead>
              <TableHead className="text-center">Min Quiz %</TableHead>
              <TableHead className="text-center">Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rules.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.courseTitle}</TableCell>
                  <TableCell className="text-center">{r.requireProgress100 ? <CheckCircle2 className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}</TableCell>
                  <TableCell className="text-center">{r.requireAllTasks ? <CheckCircle2 className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}</TableCell>
                  <TableCell className="text-center">{r.requireProject ? <CheckCircle2 className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}</TableCell>
                  <TableCell className="text-center">{r.requireQuizScore}%</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={r.enabled} onCheckedChange={() => toggleRule(r.id)} className="mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setEditRule(r); setEditQuizScore(String(r.requireQuizScore)); }}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Download Monitor */}
      <Card className="shadow-card border-border">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Download className="h-4 w-4" /> Download History</CardTitle>
          <div className="relative w-48">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Certificate ID</TableHead>
              <TableHead>Downloaded At</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredDownloads.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium text-foreground">{d.studentName}</TableCell>
                  <TableCell>{d.courseTitle}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-mono">{d.certificateId}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{d.downloadedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editRule} onOpenChange={() => setEditRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rules — {editRule?.courseTitle}</DialogTitle>
            <DialogDescription>Configure what students need to earn a certificate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {(["requireProgress100", "requireAllTasks", "requireProject"] as const).map(field => (
              <label key={field} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {field === "requireProgress100" ? "100% Course Progress" : field === "requireAllTasks" ? "All Tasks Submitted" : "Final Project Submitted"}
                </span>
                <Switch checked={editRule?.[field] || false} onCheckedChange={() => toggleCriteria(field)} />
              </label>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Minimum Quiz Score (%)</span>
              <Input type="number" value={editQuizScore} onChange={e => setEditQuizScore(e.target.value)} className="w-20 h-8 text-center" min="0" max="100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRule(null)}>Cancel</Button>
            <Button onClick={saveRule} className="bg-primary text-primary-foreground">Save Rules</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
