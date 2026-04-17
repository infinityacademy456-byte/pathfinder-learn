import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useMentor } from "@/contexts/MentorContext";
import { useEnrollment } from "@/contexts/EnrollmentContext";

export function NotificationBell() {
  const { currentStudentId } = useEnrollment();
  const { getStudentNotifications, markNotificationRead } = useMentor();
  const notifs = getStudentNotifications(currentStudentId);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">{unread}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <Badge variant="secondary" className="text-[10px]">{unread} new</Badge>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifs.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4 text-center">No notifications</p>
          ) : notifs.map(n => (
            <button key={n.id} onClick={() => markNotificationRead(n.id)}
              className={`w-full text-left p-3 border-b border-border hover:bg-secondary transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] capitalize">{n.type}</Badge>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm font-medium text-foreground mt-1">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.body}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
