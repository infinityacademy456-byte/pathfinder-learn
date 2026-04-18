import { createContext, useContext, useCallback, type ReactNode } from "react";
import { usePersistedState } from "@/lib/use-persisted-state";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface EnrollmentCourse {
  id: string;
  title: string;
  category: string;
  totalLessons: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  lessonsCompleted: number;
  status: "active" | "completed";
  enrolledAt: string;
  completedAt: string | null;
}

const initialStudents: Student[] = [
  { id: "s1", name: "Student A", email: "a@learn.com", avatar: "A" },
  { id: "s2", name: "Student B", email: "b@learn.com", avatar: "B" },
  { id: "s3", name: "Student C", email: "c@learn.com", avatar: "C" },
  { id: "s4", name: "Student D", email: "d@learn.com", avatar: "D" },
];

const initialCourses: EnrollmentCourse[] = [
  { id: "c1", title: "Python Fundamentals", category: "Python", totalLessons: 12 },
  { id: "c2", title: "SQL Mastery", category: "SQL", totalLessons: 10 },
  { id: "c3", title: "Data Analysis with Pandas", category: "Data", totalLessons: 14 },
  { id: "c4", title: "Machine Learning Basics", category: "ML", totalLessons: 16 },
];

const initialEnrollments: Enrollment[] = [
  { id: "e1", studentId: "s1", courseId: "c1", progress: 40, lessonsCompleted: 5, status: "active", enrolledAt: "2026-01-10", completedAt: null },
  { id: "e2", studentId: "s1", courseId: "c2", progress: 20, lessonsCompleted: 2, status: "active", enrolledAt: "2026-01-10", completedAt: null },
  { id: "e3", studentId: "s2", courseId: "c3", progress: 60, lessonsCompleted: 8, status: "active", enrolledAt: "2026-01-12", completedAt: null },
  { id: "e4", studentId: "s2", courseId: "c4", progress: 10, lessonsCompleted: 2, status: "active", enrolledAt: "2026-01-12", completedAt: null },
  { id: "e5", studentId: "s3", courseId: "c2", progress: 80, lessonsCompleted: 8, status: "active", enrolledAt: "2026-01-15", completedAt: null },
  { id: "e6", studentId: "s3", courseId: "c3", progress: 100, lessonsCompleted: 14, status: "completed", enrolledAt: "2026-01-15", completedAt: "2026-02-01" },
  { id: "e7", studentId: "s4", courseId: "c4", progress: 30, lessonsCompleted: 5, status: "active", enrolledAt: "2026-01-18", completedAt: null },
  { id: "e8", studentId: "s4", courseId: "c3", progress: 50, lessonsCompleted: 7, status: "active", enrolledAt: "2026-01-18", completedAt: null },
];

interface EnrollmentContextType {
  students: Student[];
  courses: EnrollmentCourse[];
  enrollments: Enrollment[];
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  enrollStudent: (studentId: string, courseId: string) => void;
  removeEnrollment: (studentId: string, courseId: string) => void;
  getStudentEnrollments: (studentId: string) => (Enrollment & { course: EnrollmentCourse })[];
  getStudentProgress: (studentId: string, courseId: string) => Enrollment | undefined;
  updateProgress: (studentId: string, courseId: string, lessonsCompleted: number) => void;
  isEnrolled: (studentId: string, courseId: string) => boolean;
  getCourseStudents: (courseId: string) => (Enrollment & { student: Student })[];
}

const EnrollmentContext = createContext<EnrollmentContextType | null>(null);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrollments, setEnrollments] = usePersistedState<Enrollment[]>("ilh.enrollments", initialEnrollments);
  const [currentStudentId, setCurrentStudentId] = usePersistedState<string>("ilh.currentStudentId", "s1");

  const enrollStudent = useCallback((studentId: string, courseId: string) => {
    setEnrollments(prev => {
      if (prev.some(e => e.studentId === studentId && e.courseId === courseId)) return prev;
      return [...prev, {
        id: `e${Date.now()}`,
        studentId,
        courseId,
        progress: 0,
        lessonsCompleted: 0,
        status: "active" as const,
        enrolledAt: new Date().toISOString().split("T")[0],
        completedAt: null,
      }];
    });
  }, []);

  const removeEnrollment = useCallback((studentId: string, courseId: string) => {
    setEnrollments(prev => prev.filter(e => !(e.studentId === studentId && e.courseId === courseId)));
  }, []);

  const getStudentEnrollments = useCallback((studentId: string) => {
    return enrollments
      .filter(e => e.studentId === studentId)
      .map(e => ({ ...e, course: initialCourses.find(c => c.id === e.courseId)! }))
      .filter(e => e.course);
  }, [enrollments]);

  const getStudentProgress = useCallback((studentId: string, courseId: string) => {
    return enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
  }, [enrollments]);

  const updateProgress = useCallback((studentId: string, courseId: string, lessonsCompleted: number) => {
    setEnrollments(prev => prev.map(e => {
      if (e.studentId !== studentId || e.courseId !== courseId) return e;
      const course = initialCourses.find(c => c.id === courseId);
      if (!course) return e;
      const progress = Math.round((lessonsCompleted / course.totalLessons) * 100);
      const isComplete = lessonsCompleted >= course.totalLessons;
      return {
        ...e,
        lessonsCompleted,
        progress: Math.min(progress, 100),
        status: isComplete ? "completed" as const : "active" as const,
        completedAt: isComplete ? new Date().toISOString().split("T")[0] : e.completedAt,
      };
    }));
  }, []);

  const isEnrolled = useCallback((studentId: string, courseId: string) => {
    return enrollments.some(e => e.studentId === studentId && e.courseId === courseId);
  }, [enrollments]);

  const getCourseStudents = useCallback((courseId: string) => {
    return enrollments
      .filter(e => e.courseId === courseId)
      .map(e => ({ ...e, student: initialStudents.find(s => s.id === e.studentId)! }))
      .filter(e => e.student);
  }, [enrollments]);

  return (
    <EnrollmentContext.Provider value={{
      students: initialStudents,
      courses: initialCourses,
      enrollments,
      currentStudentId,
      setCurrentStudentId,
      enrollStudent,
      removeEnrollment,
      getStudentEnrollments,
      getStudentProgress,
      updateProgress,
      isEnrolled,
      getCourseStudents,
    }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be used within EnrollmentProvider");
  return ctx;
}
