import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, BookOpen, FolderKanban, HelpCircle, Trophy, User, LogOut, GraduationCap, Award, Menu, X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";
import { CelebrationModal } from "@/components/CelebrationModal";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "My Courses", url: "/courses", icon: BookOpen },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Quizzes", url: "/quizzes", icon: HelpCircle },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Certificates", url: "/certificates", icon: Award },
  { title: "Profile", url: "/profile", icon: User },
];

const bottomNavItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground">Pathfinder Learn</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url ||
            (item.url !== "/dashboard" && location.pathname.startsWith(item.url));
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/dashboard"}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-[3px] border-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
              activeClassName=""
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section at bottom */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
            {userProfile.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{userProfile.name}</p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Student</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground shrink-0 h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StudentLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <CelebrationModal />
      <div className="h-screen flex overflow-hidden">
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside className="w-60 flex-shrink-0 border-r border-border bg-card overflow-y-auto">
            <SidebarContent />
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
                  <SheetContent side="left" className="p-0 w-72">
                    <SidebarContent onNavigate={() => setSheetOpen(false)} />
                  </SheetContent>
                </Sheet>
              )}
              {isMobile && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-foreground">Pathfinder Learn</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {userProfile.avatar}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">{userProfile.name}</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className={`flex-1 overflow-y-auto ${isMobile ? "pb-20" : ""}`}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </main>

          {/* Mobile bottom nav */}
          {isMobile && (
            <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border flex items-center justify-around" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url ||
                  (item.url !== "/dashboard" && location.pathname.startsWith(item.url));
                return (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    end={item.url === "/dashboard"}
                    className="flex flex-col items-center gap-0.5 px-2 py-1"
                    activeClassName=""
                  >
                    <item.icon className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-[10px] ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>{item.title}</span>
                  </NavLink>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
