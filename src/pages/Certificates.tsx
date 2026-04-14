import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download, Eye, Lock, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCertificates, EarnedCertificate } from "@/contexts/CertificateContext";
import { learningPaths, userProfile } from "@/data/mockData";

export default function Certificates() {
  const { certificates } = useCertificates();
  const [viewing, setViewing] = useState<EarnedCertificate | null>(null);
  const inProgress = learningPaths.filter((p) => p.progress > 0 && p.progress < 100);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-7 w-7 text-warning" /> My Certificates
        </h1>
      </motion.div>

      <Tabs defaultValue="earned">
        <TabsList>
          <TabsTrigger value="earned">Earned ({certificates.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgress.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((cert, i) => (
              <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-shadow border-border">
                  <CardContent className="p-6 text-center space-y-3">
                    <Medal className="h-10 w-10 text-warning mx-auto" />
                    <h3 className="text-lg font-bold text-foreground">{cert.courseTitle}</h3>
                    <p className="text-sm text-muted-foreground">Issued by Pathfinder Learn</p>
                    <p className="text-xs text-muted-foreground">Completed {cert.completedDate}</p>
                    <p className="font-mono text-xs text-muted-foreground">{cert.certificateId}</p>
                    <div className="flex gap-2 justify-center pt-2">
                      <Button size="sm" variant="outline" onClick={() => setViewing(cert)}>
                        <Eye className="h-3 w-3 mr-1" /> View Certificate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Certificate downloaded!")}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {certificates.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-12">No certificates earned yet. Complete a course to earn one!</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {inProgress.map((p) => {
              const lessonsRemaining = Math.round(p.lessonsCount * (1 - p.progress / 100));
              return (
                <Card key={p.id} className="border-border">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                    </div>
                    <Progress value={p.progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{lessonsRemaining} lessons remaining</p>
                      <Link to="/courses/py-101">
                        <Button size="sm" variant="ghost" className="text-primary text-xs">Continue Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Certificate</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="m-4 border-[3px] border-warning rounded-xl overflow-hidden">
              <div className="border border-warning m-2 rounded-lg p-6 md:p-8 text-center space-y-4" style={{ background: "hsl(45, 100%, 98%)" }}>
                <p className="text-xl font-bold text-primary">Pathfinder Learn</p>
                <div className="h-px bg-warning/40 mx-auto w-3/4" />
                <p className="text-2xl md:text-3xl font-bold text-foreground">Certificate of Completion</p>
                <p className="text-sm text-muted-foreground">This certifies that</p>
                <p className="text-2xl md:text-3xl font-semibold text-primary">{userProfile.name}</p>
                <p className="text-sm text-muted-foreground">has successfully completed</p>
                <p className="text-xl font-bold text-foreground">{viewing.courseTitle}</p>
                <p className="text-sm text-muted-foreground">Instructed by {viewing.mentorName}</p>
                {/* Seal */}
                <div className="mx-auto h-16 w-16 rounded-full border-2 border-warning flex items-center justify-center">
                  <span className="text-warning font-bold text-sm">PFL</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-2">
                  <span>{viewing.completedDate}</span>
                  <span className="font-mono">{viewing.certificateId}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-4 pt-0 gap-2">
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            <Button onClick={() => toast.success("Certificate downloaded!")}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
