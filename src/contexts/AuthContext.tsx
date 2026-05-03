import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut as fbSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type Role = "student" | "admin" | "mentor";

interface AuthState {
  user: User | null;
  role: Role | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const homeFor: Record<Role, string> = {
  student: "/dashboard",
  admin: "/admin",
  mentor: "/mentor",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        // Fallback: legacy/local mock role if no Firebase user
        const local = localStorage.getItem("userRole") as Role | null;
        setRole(local ?? null);
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        let r: Role | null = (snap.exists() ? (snap.data().role as Role) : null) ?? null;
        if (!r) {
          r = "student";
          await setDoc(
            ref,
            { email: u.email, role: "student", createdAt: Date.now() },
            { merge: true }
          );
        }
        setRole(r);
        localStorage.setItem("userRole", r);
      } catch {
        const local = localStorage.getItem("userRole") as Role | null;
        setRole(local ?? null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Live-sync role updates from Firestore
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      const r = snap.exists() ? (snap.data().role as Role | undefined) : undefined;
      if (r) {
        setRole(r);
        localStorage.setItem("userRole", r);
      }
    });
    return () => unsub();
  }, [user]);

  const signOut = async () => {
    try { await fbSignOut(auth); } catch { /* noop */ }
    localStorage.removeItem("userRole");
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
