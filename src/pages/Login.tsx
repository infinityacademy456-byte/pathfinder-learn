import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Shield, Infinity, Mail, Lock, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useEnrollment } from "@/contexts/EnrollmentContext";

type Role = "student" | "admin" | "mentor";

const homeFor: Record<Role, string> = { student: "/dashboard", admin: "/admin", mentor: "/mentor" };

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentStudentId, students } = useEnrollment();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { toast.error("Please select a role"); return; }
    if (!email.trim() || !password.trim()) { toast.error("Please enter your email and password"); return; }
    if (password.length < 4) { toast.error("Password is too short"); return; }
    localStorage.setItem("userRole", role);
    if (role === "student") {
      // In demo mode, map known emails to seeded students; default to first student.
      const matched = students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      setCurrentStudentId(matched?.id ?? students[0].id);
    }
    toast.success(`Logged in as ${role}`);
    navigate(homeFor[role]);
  };

  const roles: { value: Role; label: string; desc: string; icon: typeof GraduationCap }[] = [
    { value: "student", label: "Student", desc: "Access your courses", icon: GraduationCap },
    { value: "mentor", label: "Mentor", desc: "Teach & evaluate", icon: UserCog },
    { value: "admin", label: "Admin", desc: "Manage platform", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Infinity className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Infinity Learning Hub</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <motion.div key={r.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`cursor-pointer transition-all shadow-card ${
                  role === r.value
                    ? "border-2 border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                onClick={() => setRole(r.value)}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <r.icon className={`h-8 w-8 mx-auto ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-semibold text-foreground">{r.label}</p>
                  <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground">
            Login
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
