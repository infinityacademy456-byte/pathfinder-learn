import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingChat } from "@/components/FloatingChat";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Infinity } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card gap-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2 md:hidden">
              <Infinity className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm text-foreground">Infinity Learning</span>
            </div>
            <div className="ml-auto">
              <GlobalSearch />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <FloatingChat />
    </SidebarProvider>
  );
}
