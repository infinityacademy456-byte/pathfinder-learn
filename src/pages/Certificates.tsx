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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useCertificates, EarnedCertificate } from "@/contexts/CertificateContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";
import { useMentor } from "@/contexts/MentorContext";
import { checkCertificateEligibility } from "@/lib/certificate-eligibility";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";

export default function Certificates() {
  const { certificates } = useCertificates();
  const { currentStudentId, getStudentEnrollments, students } = useEnrollment();
  const { batches, tasks, submissions, projects } = useMentor();
  const [viewing, setViewing] = useState<EarnedCertificate | null>(null);

  const me = students.find(s => s.id === currentStudentId);
  const myEnrollments = getStudentEnrollments(currentStudentId);
  const inProgress = myEnrollments.filter(e => e.status !== "completed");

  const handleDownload = (cert: EarnedCertificate) => {
    try {
      downloadCertificatePdf({
        studentName: me?.name || "Student",
        courseTitle: cert.courseTitle,
        mentorName: cert.mentorName,
        completedDate: cert.completedDate,
        certificateId: cert.certificateId,
      });
      toast.success("Certificate downloaded");
    } catch (err) {
      toast.error("Could not generate PDF");
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-7 w-7 text-warning" /> My Certificates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unlocked when course is 100% complete, all tasks submitted, and final project submitted.
        </p>
      </motion.div>

      <Tabs defaultValue="earned">
        <TabsList>
          <TabsTrigger value="earned">Earned ({certificates.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgress.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((cert, i) => {
              // Find matching enrollment to gate the download
              const matchingEnrollment = myEnrollments.find(e => e.course.title === cert.courseTitle);
              const eligibility = checkCertificateEligibility({
                studentId: currentStudentId,
                enrollment: matchingEnrollment,
                batches, tasks, submissions, projects,
              });
              // Pre-seeded certificates (no matching enrollment) remain downloadable
              const canDownload = !matchingEnrollment || eligibility.eligible;

              return (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="shadow-card hover:shadow-card-hover transition-shadow border-border">
                    <CardContent className="p-6 text-center space-y-3">
                      <Medal className="h-10 w-10 text-warning mx-auto" />
                      <h3 className="text-lg font-bold text-foreground">{cert.courseTitle}</h3>
                      <p className="text-sm text-muted-foreground">Issued by Vidya Learning Hub</p>
                      <p className="text-xs text-muted-foreground">Completed {cert.completedDate}</p>
                      <p className="font-mono text-xs text-muted-foreground">{cert.certificateId}</p>
                      <div className="flex gap-2 justify-center pt-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => setViewing(cert)}>
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  size="sm"
                                  disabled={!canDownload}
                                  onClick={() => canDownload && handleDownload(cert)}
                                >
                                  <Download className="h-3 w-3 mr-1" /> Download PDF
                                </Button>
                              </span>
                            </TooltipTrigger>
                            {!canDownload && (
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">Locked — complete:</p>
                                <ul className="text-xs space-y-0.5">
                                  {eligibility.reasons.map(r => <li key={r}>• {r}</li>)}
                                </ul>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            {certificates.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-12">No certificates earned yet. Complete a course to earn one!</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {inProgress.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-12">All your courses are completed 🎉</p>
            )}
            {inProgress.map((e) => {
              const eligibility = checkCertificateEligibility({
                studentId: currentStudentId, enrollment: e,
                batches, tasks, submissions, projects,
              });
              const lessonsRemaining = e.course.totalLessons - e.lessonsCompleted;
              return (
                <Card key={e.id} className="border-border">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{e.course.title}</h3>
                    </div>
                    <Progress value={e.progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{lessonsRemaining} lessons remaining</p>
                      <Link to={`/courses/${e.courseId}`}>
                        <Button size="sm" variant="ghost" className="text-primary text-xs">Continue</Button>
                      </Link>
                    </div>
                    <div className="text-xs space-y-1 pt-2 border-t border-border">
                      <p className={eligibility.progressOk ? "text-accent" : "text-muted-foreground"}>
                        {eligibility.progressOk ? "✓" : "○"} Course 100% complete
                      </p>
                      <p className={eligibility.tasksOk ? "text-accent" : "text-muted-foreground"}>
                        {eligibility.tasksOk ? "✓" : "○"} All tasks submitted
                      </p>
                      <p className={eligibility.projectOk ? "text-accent" : "text-muted-foreground"}>
                        {eligibility.projectOk ? "✓" : "○"} Final project submitted
                      </p>
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
                <p className="text-xl font-bold text-primary">Vidya Learning Hub</p>
                <div className="h-px bg-warning/40 mx-auto w-3/4" />
                <p className="text-2xl md:text-3xl font-bold text-foreground">Certificate of Completion</p>
                <p className="text-sm text-muted-foreground">This certifies that</p>
                <p className="text-2xl md:text-3xl font-semibold text-primary">{me?.name || "Student"}</p>
                <p className="text-sm text-muted-foreground">has successfully completed</p>
                <p className="text-xl font-bold text-foreground">{viewing.courseTitle}</p>
                <p className="text-sm text-muted-foreground">Instructed by {viewing.mentorName}</p>
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
            <Button onClick={() => viewing && handleDownload(viewing)}>
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
