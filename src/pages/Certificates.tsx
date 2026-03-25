import { motion } from "framer-motion";
import { Award, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const certificates = [
  { id: "c1", course: "Python Fundamentals", date: "March 15, 2026", status: "earned" as const },
  { id: "c2", course: "SQL Basics", date: "February 28, 2026", status: "earned" as const },
  { id: "c3", course: "Data Visualization", date: "January 10, 2026", status: "earned" as const },
  { id: "c4", course: "Machine Learning Intro", date: null, status: "in-progress" as const },
];

export default function Certificates() {
  const handleDownload = (courseName: string) => {
    // Generate a simple certificate
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, 1200, 800);
    ctx.fillStyle = "#f8f8fc";
    ctx.fillRect(30, 30, 1140, 740);

    // Border
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1100, 700);

    // Title
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "bold 42px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 600, 180);

    // Decorative line
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 200);
    ctx.lineTo(850, 200);
    ctx.stroke();

    // Body
    ctx.font = "20px Arial, sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText("This certifies that", 600, 290);

    ctx.font = "bold 36px Georgia, serif";
    ctx.fillStyle = "#1e1b4b";
    ctx.fillText("Alex Chen", 600, 350);

    ctx.font = "20px Arial, sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText("has successfully completed the course", 600, 420);

    ctx.font = "bold 30px Georgia, serif";
    ctx.fillStyle = "#10b981";
    ctx.fillText(courseName, 600, 475);

    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText("Infinity Learning Hub", 600, 560);

    // Date
    const cert = certificates.find((c) => c.course === courseName);
    if (cert?.date) {
      ctx.fillText(cert.date, 600, 600);
    }

    // Logo text
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.fillStyle = "#1e1b4b";
    ctx.fillText("∞ Infinity Learning", 600, 700);

    const link = document.createElement("a");
    link.download = `certificate-${courseName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Award className="h-7 w-7 text-accent" /> Certificates
        </h1>
        <p className="text-muted-foreground">Download certificates for completed courses.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert, i) => (
          <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`shadow-card border-border h-full ${cert.status === "in-progress" ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${cert.status === "earned" ? "gradient-accent" : "bg-secondary"}`}>
                    <Award className={`h-6 w-6 ${cert.status === "earned" ? "text-accent-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{cert.course}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cert.status === "earned" ? `Completed ${cert.date}` : "In progress..."}
                    </p>
                    {cert.status === "earned" && (
                      <Button size="sm" variant="outline" className="mt-3 border-border" onClick={() => handleDownload(cert.course)}>
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
