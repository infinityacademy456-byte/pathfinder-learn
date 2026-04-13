import { motion } from "framer-motion";
import { Users, BookOpen, Shield, BarChart3, Settings, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const platformStats = {
  totalUsers: 1284,
  activeToday: 342,
  totalCourses: 24,
  completionRate: 68,
  revenue: "$4,820",
  premiumUsers: 186,
};

export default function AdminOverview() {
  const stats = [
    { label: "Total Users", value: platformStats.totalUsers, icon: Users },
    { label: "Active Today", value: platformStats.activeToday, icon: TrendingUp },
    { label: "Courses", value: platformStats.totalCourses, icon: BookOpen },
    { label: "Completion Rate", value: `${platformStats.completionRate}%`, icon: BarChart3 },
    { label: "Revenue", value: platformStats.revenue, icon: Settings },
    { label: "Premium Users", value: platformStats.premiumUsers, icon: Shield },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" /> Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Platform overview and key metrics.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
