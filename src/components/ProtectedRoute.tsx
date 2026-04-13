import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  role: "student" | "admin";
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  if (!userRole) return <Navigate to="/login" replace />;

  if (role === "student" && userRole !== "student") return <Navigate to="/admin" replace />;
  if (role === "admin" && userRole !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
