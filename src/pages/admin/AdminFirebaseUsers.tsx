import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { Database, Trash2, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FirestoreUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: { seconds: number } | null;
}

export default function AdminFirebaseUsers() {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreUser, "id">) })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore users listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "users"), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        createdAt: serverTimestamp(),
      });
      toast.success("User added to Firestore");
      setName("");
      setEmail("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add user";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User removed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" /> Firestore Users
          <Badge variant="outline" className="ml-2 text-[10px]">Live</Badge>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time data from the <code className="text-xs bg-muted px-1 rounded">users</code> collection in Firebase.
        </p>
      </motion.div>

      <Card className="shadow-card border-border">
        <CardContent className="p-4">
          <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Firestore error</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check your Firestore Security Rules allow read/write for this collection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" /> Loading from Firestore...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No users yet. Add one above to test the real-time sync.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {(u.name || u.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name || "(no name)"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize text-xs">{u.role || "user"}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(u.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
