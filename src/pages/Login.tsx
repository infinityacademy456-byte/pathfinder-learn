import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Infinity, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { BRAND } from "@/lib/branding";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { homeFor, Role } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentStudentId, students } = useEnrollment();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const finishLogin = (effectiveRole: Role) => {
    localStorage.setItem("userRole", effectiveRole);
    if (effectiveRole === "student" && students.length > 0) {
      const matched = students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
      setCurrentStudentId(matched?.id ?? students[0].id);
    }
    toast.success(`Logged in as ${effectiveRole}`);
    navigate(homeFor[effectiveRole]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error("Please enter your email and password"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      let uid: string;
      let effectiveRole: Role = "student";

      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        uid = cred.user.uid;
        // Default role on signup is ALWAYS "student". Admin must promote.
        await setDoc(doc(db, "users", uid), {
          email: cred.user.email,
          role: "student",
          createdAt: Date.now(),
        });
        effectiveRole = "student";
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        uid = cred.user.uid;
        // Always trust Firestore role on sign-in
        const snap = await getDoc(doc(db, "users", uid));
        const storedRole = snap.exists() ? (snap.data().role as Role | undefined) : undefined;
        if (storedRole) {
          effectiveRole = storedRole;
        } else {
          effectiveRole = "student";
          await setDoc(doc(db, "users", uid), {
            email: cred.user.email,
            role: "student",
            createdAt: Date.now(),
          });
        }
      }

      finishLogin(effectiveRole);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      if (code === "auth/network-request-failed" || code === "auth/configuration-not-found") {
        toast.warning("Firebase unavailable — signed in locally as student (demo mode)");
        finishLogin("student");
      } else {
        const msg =
          code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
            ? "Invalid email or password"
            : code === "auth/email-already-in-use"
            ? "Email already registered — switch to Sign in"
            : err instanceof Error ? err.message : "Login failed";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Infinity className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{BRAND.name}</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signup" ? "Create your student account" : "Sign in to continue"}
          </p>
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
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">
            {loading ? "Please wait..." : mode === "signup" ? "Create student account" : "Login"}
          </Button>
          {mode === "signup" && (
            <p className="text-center text-[11px] text-muted-foreground">
              All new accounts are created as students. Mentor and admin roles are assigned by an administrator.
            </p>
          )}
          <p className="text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New here?" : "Have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
