import { useNavigate, useLocation, Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarClock, FileText, ClipboardList,
  CheckSquare, FolderCheck, MessageCircle, LogOut, GraduationCap, Menu, UserCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMentor } from "@/contexts/MentorContext";

const navItems = [
  { title: "Dashboard", url: "/mentor", icon: LayoutDashboard, end: true },
  { title: "Batches", url: "/mentor/batches", icon: Users, end: false },
  { title: "Classes", url: "/mentor/classes", icon: CalendarClock, end: false },
  { title: "Materials", url: "/mentor/materials", icon: FileText, end: false },
  { title: "Tasks", url: "/mentor/tasks", icon: ClipboardList, end: false },
  { title: "Evaluations", url: "/mentor/evaluations", icon: CheckSquare, end: false },
  { title: "Projects", url: "/mentor/projects", icon: FolderCheck, end: false },
  { title: "Attendance", url: "/mentor/attendance", icon: UserCheck2, end: false },
  { title: "Queries", url: "/mentor/queries", icon: MessageCircle, end: false },
];

function MentorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { mentors, currentMentorId } = useMentor();
  const me = mentors.find(m => m.id === currentMentorId);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 flex items-center gap-2 border-b border-border">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Mentor Hub</p>
          <p className="text-[10px] text-muted-foreground">Pathfinder Learn</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-[3px] border-primary"
                  : "text-foreground hover:bg-secondary"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0">
            {me?.avatar || "M"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{me?.name || "Mentor"}</p>
            <p className="text-[10px] text-muted-foreground">Mentor</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground shrink-0 h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MentorLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {!isMobile && (
        <aside className="w-60 flex-shrink-0 border-r border-border overflow-y-auto">
          <MentorSidebar />
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card shrink-0">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <MentorSidebar onNavigate={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
            <span className="text-sm font-semibold text-foreground">Mentor Console</span>
          </div>
        </header>

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
