import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Lock, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { learningPaths, userProfile } from "@/data/mockData";

interface CertData {
  course: string;
  date: string;
}

const earnedCerts: CertData[] = [
  { course: "Python Fundamentals", date: "Mar 12, 2026" },
  { course: "SQL Basics", date: "Feb 20, 2026" },
  { course: "Data Visualization 101", date: "Jan 8, 2026" },
];

const lockedPaths = learningPaths.filter((p) => p.progress > 0 && p.progress < 100);

export default function StudentCertificates() {
  const [viewing, setViewing] = useState<CertData | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-foreground">
        My Certificates
      </motion.h1>

      {/* Earned */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" /> Earned ({earnedCerts.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {earnedCerts.map((cert, i) => (
            <motion.div key={cert.course} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow border-border">
                <CardContent className="p-5 space-y-3">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{cert.course}</h3>
                  <p className="text-xs text-muted-foreground">Completed {cert.date}</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setViewing(cert)}>
                    <Eye className="h-3 w-3 mr-1" /> View Certificate
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Locked */}
      {lockedPaths.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" /> In Progress
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lockedPaths.map((p) => (
              <Card key={p.id} className="border-border opacity-60">
                <CardContent className="p-5 space-y-3">
                  <div className="h-24 rounded-lg bg-muted flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground">{p.title}</h3>
                  <Progress value={p.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{p.progress}% — complete to earn certificate</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Certificate Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Certificate of Completion</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="border-4 border-double border-primary/30 rounded-xl p-8 text-center space-y-4 bg-card">
              <Award className="h-12 w-12 text-primary mx-auto" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Vidya Learning Hub</p>
              <h2 className="text-xl font-bold text-foreground">Certificate of Completion</h2>
              <p className="text-muted-foreground">This certifies that</p>
              <p className="text-lg font-semibold text-foreground">{userProfile.name}</p>
              <p className="text-muted-foreground">has successfully completed</p>
              <p className="text-lg font-semibold text-primary">{viewing.course}</p>
              <p className="text-sm text-muted-foreground">{viewing.date}</p>
              <Badge variant="secondary">Verified ✓</Badge>
              <div className="pt-4">
                <Button onClick={() => toast.success("Downloading certificate...")} className="w-full">
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
