import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Inbox } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-10 text-center flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
