import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Search, Shield, AlertTriangle, LogIn, FileText, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type LogLevel = "info" | "warning" | "error";
type LogCategory = "auth" | "enrollment" | "system" | "content" | "certificate";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: "student" | "mentor" | "admin";
  action: string;
  category: LogCategory;
  level: LogLevel;
  details?: string;
}

const logs: ActivityLog[] = [
  { id: "l1", timestamp: "2026-05-01 09:15:23", user: "admin@ilh.com", role: "admin", action: "Enrolled Student A in Python Fundamentals", category: "enrollment", level: "info" },
  { id: "l2", timestamp: "2026-05-01 09:12:01", user: "a@learn.com", role: "student", action: "Login successful", category: "auth", level: "info" },
  { id: "l3", timestamp: "2026-05-01 09:10:45", user: "unknown@test.com", role: "student", action: "Login failed — invalid credentials", category: "auth", level: "warning" },
  { id: "l4", timestamp: "2026-05-01 08:55:30", user: "sarah@email.com", role: "mentor", action: "Created class session: Python OOP", category: "content", level: "info" },
  { id: "l5", timestamp: "2026-05-01 08:42:12", user: "System", role: "admin", action: "Scheduled backup completed", category: "system", level: "info" },
  { id: "l6", timestamp: "2026-04-30 22:30:00", user: "System", role: "admin", action: "High memory usage detected (>85%)", category: "system", level: "error" },
  { id: "l7", timestamp: "2026-04-30 21:15:33", user: "b@learn.com", role: "student", action: "Certificate downloaded — PFL-2026-B3", category: "certificate", level: "info" },
  { id: "l8", timestamp: "2026-04-30 20:00:10", user: "priya@email.com", role: "mentor", action: "Graded 5 task submissions for SQL Batch", category: "content", level: "info" },
  { id: "l9", timestamp: "2026-04-30 18:45:20", user: "admin@ilh.com", role: "admin", action: "Deactivated user Jordan Taylor", category: "enrollment", level: "warning" },
  { id: "l10", timestamp: "2026-04-30 17:30:00", user: "System", role: "admin", action: "Failed to send email notification — SMTP timeout", category: "system", level: "error" },
  { id: "l11", timestamp: "2026-04-30 16:20:15", user: "c@learn.com", role: "student", action: "Submitted project: Data Pipeline", category: "content", level: "info" },
  { id: "l12", timestamp: "2026-04-30 14:10:00", user: "unknown@bad.com", role: "student", action: "Login failed — account deactivated", category: "auth", level: "warning" },
  { id: "l13", timestamp: "2026-04-29 11:00:00", user: "System", role: "admin", action: "Database auto-backup successful", category: "system", level: "info" },
  { id: "l14", timestamp: "2026-04-29 10:30:00", user: "admin@ilh.com", role: "admin", action: "Updated certificate rules for ML course", category: "certificate", level: "info" },
  { id: "l15", timestamp: "2026-04-29 09:00:00", user: "System", role: "admin", action: "Duplicate enrollment prevented: Student D → Python", category: "enrollment", level: "warning" },
];

const levelIcon = (l: LogLevel) => {
  if (l === "error") return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />;
  if (l === "warning") return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
  return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
};

const levelBadge = (l: LogLevel) => {
  if (l === "error") return <Badge variant="destructive" className="text-[10px]">Error</Badge>;
  if (l === "warning") return <Badge className="text-[10px] bg-warning/20 text-warning border-warning/30">Warning</Badge>;
  return <Badge variant="secondary" className="text-[10px]">Info</Badge>;
};

export default function AdminActivityLog() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | LogLevel>("all");
  const [filterCategory, setFilterCategory] = useState<"all" | LogCategory>("all");

  const filtered = logs
    .filter(l => filterLevel === "all" || l.level === filterLevel)
    .filter(l => filterCategory === "all" || l.category === filterCategory)
    .filter(l => {
      const q = search.toLowerCase();
      return l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q);
    });

  const errorCount = logs.filter(l => l.level === "error").length;
  const warningCount = logs.filter(l => l.level === "warning").length;
  const loginFailures = logs.filter(l => l.category === "auth" && l.level !== "info").length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" /> System Monitor
        </h1>
        <p className="text-sm text-muted-foreground">Activity logs, errors, and login tracking.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{logs.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Events</p>
        </CardContent></Card>
        <Card className="shadow-card border-border border-destructive/20"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-destructive">{errorCount}</p>
          <p className="text-[10px] text-muted-foreground">Errors</p>
        </CardContent></Card>
        <Card className="shadow-card border-border border-warning/20"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-warning">{warningCount}</p>
          <p className="text-[10px] text-muted-foreground">Warnings</p>
        </CardContent></Card>
        <Card className="shadow-card border-border"><CardContent className="p-3 text-center">
          <p className="text-lg font-bold text-foreground">{loginFailures}</p>
          <p className="text-[10px] text-muted-foreground">Login Failures</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search user or action…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterLevel} onValueChange={v => setFilterLevel(v as any)}>
          <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={v => setFilterCategory(v as any)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="enrollment">Enrollment</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Log table */}
      <Card className="shadow-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(log => (
                <TableRow key={log.id} className={log.level === "error" ? "bg-destructive/5" : log.level === "warning" ? "bg-warning/5" : ""}>
                  <TableCell>{levelIcon(log.level)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                  <TableCell className="text-sm text-foreground">
                    <div className="flex items-center gap-1.5">
                      {log.category === "auth" && <LogIn className="h-3 w-3 text-muted-foreground" />}
                      {log.user}
                      <Badge variant="outline" className="text-[9px] capitalize">{log.role}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground max-w-[300px] truncate">{log.action}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{log.category}</Badge></TableCell>
                  <TableCell>{levelBadge(log.level)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
