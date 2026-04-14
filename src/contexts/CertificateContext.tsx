import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface EarnedCertificate {
  id: string;
  courseTitle: string;
  mentorName: string;
  completedDate: string;
  certificateId: string;
}

interface CertificateContextValue {
  certificates: EarnedCertificate[];
  addCertificate: (courseTitle: string, mentorName: string) => EarnedCertificate;
  showCelebration: boolean;
  celebrationData: { courseName: string } | null;
  triggerCelebration: (courseName: string) => void;
  dismissCelebration: () => void;
}

const CertificateContext = createContext<CertificateContextValue | null>(null);

function generateCertId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PFL-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function CertificateProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<EarnedCertificate[]>([
    { id: "pre-1", courseTitle: "Python Fundamentals", mentorName: "Dr. Anil Kumar", completedDate: "Mar 12, 2026", certificateId: "PFL-XK29MN4T" },
    { id: "pre-2", courseTitle: "SQL Basics", mentorName: "Sarah Kim", completedDate: "Feb 20, 2026", certificateId: "PFL-QW83PL7R" },
    { id: "pre-3", courseTitle: "Data Visualization 101", mentorName: "Mark Chen", completedDate: "Jan 8, 2026", certificateId: "PFL-HJ56VB2D" },
  ]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ courseName: string } | null>(null);

  const addCertificate = useCallback((courseTitle: string, mentorName: string) => {
    const cert: EarnedCertificate = {
      id: crypto.randomUUID(),
      courseTitle,
      mentorName,
      completedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      certificateId: generateCertId(),
    };
    setCertificates((prev) => [...prev, cert]);
    return cert;
  }, []);

  const triggerCelebration = useCallback((courseName: string) => {
    setCelebrationData({ courseName });
    setShowCelebration(true);
  }, []);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationData(null);
  }, []);

  return (
    <CertificateContext.Provider value={{ certificates, addCertificate, showCelebration, celebrationData, triggerCelebration, dismissCelebration }}>
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const ctx = useContext(CertificateContext);
  if (!ctx) throw new Error("useCertificates must be used within CertificateProvider");
  return ctx;
}
