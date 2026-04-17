import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: "student" | "admin" | "mentor";
  children: React.ReactNode;
}

const homeFor: Record<string, string> = {
  student: "/dashboard",
  admin: "/admin",
  mentor: "/mentor",
};

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to={homeFor[userRole] || "/login"} replace />;

  return <>{children}</>;
}
