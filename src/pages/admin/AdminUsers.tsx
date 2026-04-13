import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminUser {
  id: string; name: string; email: string;
  role: "student" | "mentor" | "admin"; status: "active" | "inactive"; joinedDate: string;
}

const initialUsers: AdminUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@email.com", role: "student", status: "active", joinedDate: "Nov 2025" },
  { id: "u2", name: "Dr. Sarah Lin", email: "sarah@email.com", role: "mentor", status: "active", joinedDate: "Oct 2025" },
  { id: "u3", name: "Marcus Lee", email: "marcus@email.com", role: "student", status: "active", joinedDate: "Dec 2025" },
  { id: "u4", name: "Priya Sharma", email: "priya@email.com", role: "mentor", status: "active", joinedDate: "Sep 2025" },
  { id: "u5", name: "Jordan Taylor", email: "jordan@email.com", role: "student", status: "inactive", joinedDate: "Jan 2026" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "mentor">("student");

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    setUsers((prev) => [...prev, { id: `u${Date.now()}`, name: newUserName, email: newUserEmail, role: newUserRole, status: "active", joinedDate: "Apr 2026" }]);
    setNewUserName(""); setNewUserEmail(""); setShowAddUser(false);
  };

  const removeUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const updateRole = (id: string, role: "student" | "mentor" | "admin") => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Manage Users</h1>
      </motion.div>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAddUser(!showAddUser)} className="bg-primary text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>
      {showAddUser && (
        <Card className="shadow-card border-border"><CardContent className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="Full name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
            <Input placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
            <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as "student" | "mentor")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="mentor">Mentor</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowAddUser(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddUser} className="bg-primary text-primary-foreground">Add User</Button>
          </div>
        </CardContent></Card>
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
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="mentor">Mentor</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
                </Select>
                <Badge variant="secondary" className={`text-[10px] ${user.status === "active" ? "text-success" : "text-muted-foreground"}`}>{user.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeUser(user.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
