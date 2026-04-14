import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Upload, BookOpen, Users, ClipboardList, Settings, LogOut, Shield, BarChart3, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Publish Content", url: "/admin/publish", icon: Upload },
  { title: "Manage Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "Assessments", url: "/admin/assessments", icon: ClipboardList },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-background))]">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-white" />
        <span className="text-sm font-bold text-white">Admin Console</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.url === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/admin"}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[hsl(var(--sidebar-accent))] text-white font-medium border-l-[3px] border-[hsl(var(--accent))]"
                  : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/50"
              }`}
              activeClassName=""
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin user at bottom */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">SA</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">Super Admin</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:text-destructive shrink-0 h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="w-[260px] flex-shrink-0 overflow-y-auto">
          <AdminSidebarContent />
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card shrink-0">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-[hsl(var(--sidebar-background))]">
                  <AdminSidebarContent onNavigate={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
            <span className="text-sm font-semibold text-foreground">Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold">SA</div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">Super Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
