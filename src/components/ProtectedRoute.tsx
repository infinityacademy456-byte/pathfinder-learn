import { Navigate } from "react-router-dom";
import { useAuth, homeFor, Role } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  role: Role;
  children: React.ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { role: userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userRole) return <Navigate to="/login" replace />;

  if (userRole !== role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          You do not have permission to view this page. Your role is{" "}
          <span className="font-semibold">{userRole}</span>.
        </p>
        <a href={homeFor[userRole]} className="text-primary text-sm font-medium hover:underline">
          Go to your dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
