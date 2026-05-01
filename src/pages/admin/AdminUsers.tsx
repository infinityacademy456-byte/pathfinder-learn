import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Edit2, Shield, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  status: "active" | "inactive";
  joinedDate: string;
  phone?: string;
}

const initialUsers: AdminUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@email.com", role: "student", status: "active", joinedDate: "Nov 2025", phone: "+91-9876543210" },
  { id: "u2", name: "Dr. Sarah Lin", email: "sarah@email.com", role: "mentor", status: "active", joinedDate: "Oct 2025", phone: "+91-9876543211" },
  { id: "u3", name: "Marcus Lee", email: "marcus@email.com", role: "student", status: "active", joinedDate: "Dec 2025" },
  { id: "u4", name: "Priya Sharma", email: "priya@email.com", role: "mentor", status: "active", joinedDate: "Sep 2025" },
  { id: "u5", name: "Jordan Taylor", email: "jordan@email.com", role: "student", status: "inactive", joinedDate: "Jan 2026" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deactivateDialog, setDeactivateDialog] = useState<AdminUser | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "student" | "mentor" | "admin">("all");

  // Add user form
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "mentor">("student");
  const [newUserPhone, setNewUserPhone] = useState("");

  // Edit form
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<"student" | "mentor" | "admin">("student");

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (users.some(u => u.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
      toast.error("A user with this email already exists");
      return;
    }
    setUsers(prev => [...prev, {
      id: `u${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "active",
      joinedDate: "May 2026",
      phone: newUserPhone.trim() || undefined,
    }]);
    toast.success(`${newUserName} added successfully`);
    setNewUserName(""); setNewUserEmail(""); setNewUserPhone(""); setShowAddUser(false);
  };

  const openEdit = (user: AdminUser) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");
    setEditRole(user.role);
  };

  const handleSaveEdit = () => {
    if (!editUser || !editName.trim() || !editEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const duplicateEmail = users.some(u => u.id !== editUser.id && u.email.toLowerCase() === editEmail.trim().toLowerCase());
    if (duplicateEmail) {
      toast.error("Another user with this email already exists");
      return;
    }
    setUsers(prev => prev.map(u => u.id === editUser.id ? {
      ...u,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim() || undefined,
      role: editRole,
    } : u));
    toast.success(`${editName} updated successfully`);
    setEditUser(null);
  };

  const toggleStatus = (user: AdminUser) => {
    if (user.status === "active") {
      setDeactivateDialog(user);
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "active" } : u));
      toast.success(`${user.name} reactivated`);
    }
  };

  const confirmDeactivate = () => {
    if (!deactivateDialog) return;
    setUsers(prev => prev.map(u => u.id === deactivateDialog.id ? { ...u, status: "inactive" } : u));
    toast.success(`${deactivateDialog.name} deactivated — no data was deleted`);
    setDeactivateDialog(null);
  };

  const filtered = users
    .filter(u => filterRole === "all" || u.role === filterRole)
    .filter(u => {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

  const counts = { total: users.length, active: users.filter(u => u.status === "active").length, students: users.filter(u => u.role === "student").length, mentors: users.filter(u => u.role === "mentor").length };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> Manage Users
        </h1>
        <p className="text-sm text-muted-foreground">Create, edit, and manage platform users. Deactivation is safe — no data is lost.</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: counts.total },
          { label: "Active", value: counts.active },
          { label: "Students", value: counts.students },
          { label: "Mentors", value: counts.mentors },
        ].map(s => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterRole} onValueChange={v => setFilterRole(v as any)}>
          <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="mentor">Mentors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowAddUser(!showAddUser)} className="bg-primary text-primary-foreground">
          <UserPlus className="h-4 w-4 mr-1" /> Add User
        </Button>
      </div>

      {/* Add form */}
      {showAddUser && (
        <Card className="shadow-card border-border">
          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="Full name *" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
              <Input placeholder="Email *" type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
              <Input placeholder="Phone (optional)" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} />
              <Select value={newUserRole} onValueChange={v => setNewUserRole(v as "student" | "mentor")}>
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

      {/* User list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
        )}
        {filtered.map(user => (
          <Card key={user.id} className="shadow-card border-border">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  user.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email} · Joined {user.joinedDate}
                    {user.phone && ` · ${user.phone}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] capitalize">{user.role}</Badge>
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={user.status === "active"}
                    onCheckedChange={() => toggleStatus(user)}
                    className="scale-75"
                  />
                  <span className={`text-[10px] ${user.status === "active" ? "text-success" : "text-muted-foreground"}`}>
                    {user.status}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details. No data will be lost.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Full name" value={editName} onChange={e => setEditName(e.target.value)} />
            <Input placeholder="Email" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            <Input placeholder="Phone" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            <Select value={editRole} onValueChange={v => setEditRole(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-primary text-primary-foreground">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirm */}
      <Dialog open={!!deactivateDialog} onOpenChange={() => setDeactivateDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Deactivate User
            </DialogTitle>
            <DialogDescription>
              Deactivate <strong>{deactivateDialog?.name}</strong>? Their data will be preserved but they won't be able to log in. You can reactivate them anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeactivate}>Deactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
