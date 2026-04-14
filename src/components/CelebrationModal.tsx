import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/contexts/CertificateContext";

function ConfettiPiece({ index }: { index: number }) {
  const colors = [
    "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))",
    "hsl(var(--info))", "hsl(var(--destructive))", "#FFD700", "#FF69B4",
  ];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 6;

  return (
    <div
      className="absolute rounded-sm"
      style={{
        left: `${left}%`,
        top: "-20px",
        width: size,
        height: size,
        backgroundColor: color,
        animation: `confetti-fall ${duration}s ${delay}s ease-in forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

export function CelebrationModal() {
  const { showCelebration, celebrationData, dismissCelebration } = useCertificates();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showCelebration) setVisible(true);
  }, [showCelebration]);

  if (!visible || !celebrationData) return null;

  const handleView = () => {
    dismissCelebration();
    setVisible(false);
    navigate("/certificates");
  };

  const handleContinue = () => {
    dismissCelebration();
    setVisible(false);
    navigate("/courses");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12 max-w-md w-full mx-4 text-center shadow-elevated animate-scale-in">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-warning/10 flex items-center justify-center">
          <Trophy className="h-16 w-16 text-warning" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Congratulations! 🎉
        </h2>
        <p className="text-lg text-foreground mb-1">
          You've completed <span className="font-semibold text-primary">{celebrationData.courseName}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Your certificate is ready in the Certificates section
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleView} className="flex-1">
            View Certificate
          </Button>
          <Button onClick={handleContinue} variant="outline" className="flex-1">
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
