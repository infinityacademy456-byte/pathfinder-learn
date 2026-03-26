import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Shield, BarChart3, CheckCircle2, XCircle,
  UserPlus, Trash2, Settings, TrendingUp, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  status: "active" | "inactive";
  joinedDate: string;
}

interface PendingContent {
  id: string;
  title: string;
  type: "course" | "video" | "project";
  mentor: string;
  submitted: string;
  status: "pending" | "approved" | "rejected";
}

const initialUsers: AdminUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@email.com", role: "student", status: "active", joinedDate: "Nov 2025" },
  { id: "u2", name: "Dr. Sarah Lin", email: "sarah@email.com", role: "mentor", status: "active", joinedDate: "Oct 2025" },
  { id: "u3", name: "Marcus Lee", email: "marcus@email.com", role: "student", status: "active", joinedDate: "Dec 2025" },
  { id: "u4", name: "Priya Sharma", email: "priya@email.com", role: "mentor", status: "active", joinedDate: "Sep 2025" },
  { id: "u5", name: "Jordan Taylor", email: "jordan@email.com", role: "student", status: "inactive", joinedDate: "Jan 2026" },
];

const initialContent: PendingContent[] = [
  { id: "pc1", title: "Advanced Python Decorators", type: "course", mentor: "Dr. Sarah Lin", submitted: "2d ago", status: "pending" },
  { id: "pc2", title: "SQL Window Functions Video", type: "video", mentor: "Priya Sharma", submitted: "1d ago", status: "pending" },
  { id: "pc3", title: "REST API Project", type: "project", mentor: "Dr. Sarah Lin", submitted: "3d ago", status: "approved" },
];

const platformStats = {
  totalUsers: 1284,
  activeToday: 342,
  totalCourses: 24,
  completionRate: 68,
  revenue: "$4,820",
  premiumUsers: 186,
};

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [content, setContent] = useState(initialContent);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "mentor">("student");

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    setUsers((prev) => [
      ...prev,
      { id: `u${Date.now()}`, name: newUserName, email: newUserEmail, role: newUserRole, status: "active", joinedDate: "Mar 2026" },
    ]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUser(false);
  };

  const removeUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const updateRole = (id: string, role: "student" | "mentor" | "admin") => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const approveContent = (id: string) => {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)));
  };

  const rejectContent = (id: string) => {
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)));
  };

  const roleColor: Record<string, string> = {
    student: "bg-info/10 text-info",
    mentor: "bg-warning/10 text-warning",
    admin: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Console
        </h1>
        <p className="text-muted-foreground">Manage users, content, and platform settings.</p>
      </motion.div>

      {/* Platform Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Users", value: platformStats.totalUsers, icon: Users },
          { label: "Active Today", value: platformStats.activeToday, icon: TrendingUp },
          { label: "Courses", value: platformStats.totalCourses, icon: BookOpen },
          { label: "Completion Rate", value: `${platformStats.completionRate}%`, icon: BarChart3 },
          { label: "Revenue", value: platformStats.revenue, icon: Settings },
          { label: "Premium Users", value: platformStats.premiumUsers, icon: Shield },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content Approval</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddUser(!showAddUser)} className="bg-primary text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-1" /> Add User
            </Button>
          </div>
          {showAddUser && (
            <Card className="shadow-card border-border">
              <CardContent className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input placeholder="Full name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                  <Input placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                  <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as "student" | "mentor")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowAddUser(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddUser} className="bg-primary text-primary-foreground">Add User</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-2">
            {users.map((user) => (
              <Card key={user.id} className="shadow-card border-border">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email} · Joined {user.joinedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={user.role} onValueChange={(v) => updateRole(user.id, v as "student" | "mentor" | "admin")}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" className={`text-[10px] ${user.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Approval Tab */}
        <TabsContent value="content" className="space-y-4">
          {content.map((c) => (
            <Card key={c.id} className="shadow-card border-border">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                    {c.type === "video" ? <Eye className="h-4 w-4 text-info" /> : <BookOpen className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      By {c.mentor} · {c.submitted} · <span className="capitalize">{c.type}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === "pending" ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => approveContent(c.id)} className="text-success border-success/30 hover:bg-success/10">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectContent(c.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant={c.status === "approved" ? "default" : "destructive"} className="capitalize text-xs">
                      {c.status}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-card border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Platform Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Platform Name</label>
                  <Input defaultValue="Infinity Learning Hub" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Support Email</label>
                  <Input defaultValue="support@infinitylearning.com" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Free Courses</label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Premium Price ($/month)</label>
                  <Input type="number" defaultValue="19" />
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
