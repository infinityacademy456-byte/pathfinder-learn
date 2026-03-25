import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, Target, BookOpen, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", minutes: 45, lessons: 2 },
  { day: "Tue", minutes: 60, lessons: 3 },
  { day: "Wed", minutes: 30, lessons: 1 },
  { day: "Thu", minutes: 90, lessons: 4 },
  { day: "Fri", minutes: 50, lessons: 2 },
  { day: "Sat", minutes: 120, lessons: 5 },
  { day: "Sun", minutes: 75, lessons: 3 },
];

const monthlyProgress = [
  { week: "W1", xp: 200 },
  { week: "W2", xp: 450 },
  { week: "W3", xp: 380 },
  { week: "W4", xp: 620 },
];

const topicDistribution = [
  { name: "Python", value: 40, color: "hsl(210, 100%, 52%)" },
  { name: "SQL", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "ML", value: 20, color: "hsl(160, 84%, 39%)" },
  { name: "Data", value: 15, color: "hsl(280, 50%, 40%)" },
];

const practiceStats = [
  { topic: "Python", correct: 28, total: 35 },
  { topic: "SQL", correct: 18, total: 22 },
  { topic: "ML", correct: 8, total: 15 },
  { topic: "Algorithms", correct: 12, total: 18 },
];

export default function Analytics() {
  const totalMinutes = weeklyData.reduce((a, b) => a + b.minutes, 0);
  const totalLessons = weeklyData.reduce((a, b) => a + b.lessons, 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> Learning Insights
        </h1>
        <p className="text-muted-foreground">Track your progress and optimize your learning.</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "This Week", value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`, icon: Clock, color: "text-info" },
          { label: "Lessons Done", value: totalLessons, icon: BookOpen, color: "text-primary" },
          { label: "Avg. Accuracy", value: "73%", icon: Target, color: "text-accent" },
          { label: "XP Earned", value: "620", icon: Zap, color: "text-warning" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card border-border">
              <CardContent className="p-4">
                <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily study time */}
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-info" /> Daily Study Time (minutes)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 91%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(240, 10%, 46%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(240, 10%, 46%)" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(240, 12%, 91%)", fontSize: 12 }} />
                <Bar dataKey="minutes" fill="hsl(245, 58%, 21%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* XP trend */}
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" /> Monthly XP Progress
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 91%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(240, 10%, 46%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(240, 10%, 46%)" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(240, 12%, 91%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="xp" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ fill: "hsl(160, 84%, 39%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Topic distribution */}
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Topic Distribution</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={topicDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                    {topicDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {topicDistribution.map((t) => (
                  <div key={t.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-foreground">{t.name}</span>
                    <span className="text-muted-foreground ml-auto">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice accuracy */}
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Practice Accuracy</h3>
            <div className="space-y-4">
              {practiceStats.map((s) => (
                <div key={s.topic}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{s.topic}</span>
                    <span className="text-muted-foreground">{s.correct}/{s.total} ({Math.round((s.correct / s.total) * 100)}%)</span>
                  </div>
                  <Progress value={(s.correct / s.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
