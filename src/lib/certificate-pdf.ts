import { jsPDF } from "jspdf";

export interface CertificatePdfData {
  studentName: string;
  courseTitle: string;
  mentorName: string;
  completedDate: string;
  certificateId: string;
}

/**
 * Generates a clean, minimal landscape A4 certificate PDF
 * and triggers a browser download.
 */
export function downloadCertificatePdf(data: CertificatePdfData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();   // 297
  const pageH = doc.internal.pageSize.getHeight();  // 210

  // Outer thin border
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.6);
  doc.rect(10, 10, pageW - 20, pageH - 20);

  // Inner accent line
  doc.setDrawColor(60, 90, 200);
  doc.setLineWidth(0.3);
  doc.rect(13, 13, pageW - 26, pageH - 26);

  // Brand
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 90, 200);
  doc.setFontSize(14);
  doc.text("INFINITY LEARNING HUB", pageW / 2, 30, { align: "center" });

  // Title
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(34);
  doc.text("Certificate of Completion", pageW / 2, 60, { align: "center" });

  // Divider
  doc.setDrawColor(60, 90, 200);
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - 40, 68, pageW / 2 + 40, 68);

  // Body
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  doc.text("This is to certify that", pageW / 2, 86, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(28);
  doc.text(data.studentName, pageW / 2, 104, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  doc.text("has successfully completed the course", pageW / 2, 118, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 90, 200);
  doc.setFontSize(20);
  doc.text(data.courseTitle, pageW / 2, 134, { align: "center" });

  // Footer block
  const footerY = pageH - 40;

  // Date (left)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Date of Completion", 35, footerY);
  doc.setDrawColor(150, 150, 150);
  doc.line(35, footerY + 10, 95, footerY + 10);
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.text(data.completedDate, 35, footerY + 16);

  // Mentor (right)
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Instructor", pageW - 95, footerY);
  doc.line(pageW - 95, footerY + 10, pageW - 35, footerY + 10);
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  doc.text(data.mentorName, pageW - 95, footerY + 16);

  // Certificate ID (centered, bottom)
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(`Certificate ID: ${data.certificateId}`, pageW / 2, pageH - 18, { align: "center" });

  const safeName = `${data.studentName}-${data.courseTitle}`.replace(/[^a-z0-9]+/gi, "-");
  doc.save(`Certificate-${safeName}.pdf`);
}
