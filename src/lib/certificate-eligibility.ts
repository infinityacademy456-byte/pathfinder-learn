import type { Enrollment, EnrollmentCourse } from "@/contexts/EnrollmentContext";
import type { Batch, MentorTask, Submission, ProjectReview } from "@/contexts/MentorContext";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  progressOk: boolean;
  tasksOk: boolean;
  projectOk: boolean;
}

export function checkCertificateEligibility(params: {
  studentId: string;
  enrollment: (Enrollment & { course: EnrollmentCourse }) | undefined;
  batches: Batch[];
  tasks: MentorTask[];
  submissions: Submission[];
  projects: ProjectReview[];
}): EligibilityResult {
  const { studentId, enrollment, batches, tasks, submissions, projects } = params;
  const reasons: string[] = [];

  if (!enrollment) {
    return { eligible: false, reasons: ["Not enrolled in this course"], progressOk: false, tasksOk: false, projectOk: false };
  }

  const progressOk = enrollment.progress >= 100;
  if (!progressOk) reasons.push(`Course progress is ${enrollment.progress}% — must reach 100%`);

  const courseBatches = batches.filter(b => b.courseId === enrollment.courseId && b.studentIds.includes(studentId));
  const batchIds = courseBatches.map(b => b.id);
  const courseTasks = tasks.filter(t => batchIds.includes(t.batchId));
  const studentSubs = submissions.filter(s => s.studentId === studentId);
  const missingTasks = courseTasks.filter(t => !studentSubs.some(s => s.taskId === t.id));
  const tasksOk = missingTasks.length === 0;
  if (!tasksOk) reasons.push(`${missingTasks.length} task${missingTasks.length > 1 ? "s" : ""} not submitted`);

  const courseProjects = projects.filter(p => p.studentId === studentId && batchIds.includes(p.batchId));
  // Treat the most recent project as the "final"; require at least one submitted
  const projectOk = courseProjects.length > 0;
  if (!projectOk) reasons.push("Final project not submitted");

  const eligible = progressOk && tasksOk && projectOk;
  return { eligible, reasons, progressOk, tasksOk, projectOk };
}
