import {
  LayoutDashboard,
  Route,
  BookOpen,
  Code2,
  FolderKanban,
  Bot,
  User,
  Infinity,
  BarChart3,
  Trophy,
  MessageSquare,
  Award,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { BRAND } from "@/lib/branding";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Learning Paths", url: "/paths", icon: Route },
  { title: "Courses", url: "/courses/py-101", icon: BookOpen },
  { title: "Practice", url: "/practice", icon: Code2 },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "AI Assistant", url: "/assistant", icon: Bot },
];

const insightItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Certificates", url: "/certificates", icon: Award },
];

const socialItems = [
  { title: "Community", url: "/community", icon: MessageSquare },
  { title: "Subscription", url: "/subscription", icon: Sparkles },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="hover:bg-sidebar-accent/50 transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
            <Infinity className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-sidebar-primary">
              {BRAND.name}
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Learn", mainItems)}
        {renderGroup("Insights", insightItems)}
        {renderGroup("More", socialItems)}
      </SidebarContent>
    </Sidebar>
  );
}
