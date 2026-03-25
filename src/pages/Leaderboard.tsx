import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Medal, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const allTimeLeaders = [
  { rank: 1, name: "Sarah Kim", avatar: "SK", xp: 12400, streak: 45 },
  { rank: 2, name: "Alex Chen", avatar: "AC", xp: 2450, streak: 12 },
  { rank: 3, name: "Marcus Lee", avatar: "ML", xp: 9800, streak: 30 },
  { rank: 4, name: "Priya Sharma", avatar: "PS", xp: 8200, streak: 22 },
  { rank: 5, name: "Jordan Taylor", avatar: "JT", xp: 7500, streak: 18 },
  { rank: 6, name: "Emma Wilson", avatar: "EW", xp: 6800, streak: 15 },
  { rank: 7, name: "Liam Nguyen", avatar: "LN", xp: 5900, streak: 10 },
  { rank: 8, name: "Olivia Brown", avatar: "OB", xp: 5100, streak: 8 },
].sort((a, b) => b.xp - a.xp);

const weeklyLeaders = [
  { rank: 1, name: "Alex Chen", avatar: "AC", xp: 620, streak: 7 },
  { rank: 2, name: "Priya Sharma", avatar: "PS", xp: 580, streak: 7 },
  { rank: 3, name: "Jordan Taylor", avatar: "JT", xp: 520, streak: 5 },
  { rank: 4, name: "Sarah Kim", avatar: "SK", xp: 490, streak: 7 },
  { rank: 5, name: "Marcus Lee", avatar: "ML", xp: 440, streak: 4 },
];

const rankIcons: Record<number, React.ReactNode> = {
  1: <Crown className="h-5 w-5 text-warning" />,
  2: <Medal className="h-5 w-5 text-muted-foreground" />,
  3: <Medal className="h-5 w-5 text-warning/60" />,
};

const rankBg: Record<number, string> = {
  1: "bg-warning/10 border-warning/30",
  2: "bg-secondary border-border",
  3: "bg-warning/5 border-warning/20",
};

export default function Leaderboard() {
  const [tab, setTab] = useState<"weekly" | "alltime">("weekly");
  const leaders = tab === "weekly" ? weeklyLeaders : allTimeLeaders;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Trophy className="h-7 w-7 text-warning" /> Leaderboard
        </h1>
        <p className="text-muted-foreground">See how you stack up against other learners.</p>
      </motion.div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "weekly" ? "default" : "outline"} onClick={() => setTab("weekly")} className={tab === "weekly" ? "bg-primary text-primary-foreground" : "border-border"}>
          This Week
        </Button>
        <Button size="sm" variant={tab === "alltime" ? "default" : "outline"} onClick={() => setTab("alltime")} className={tab === "alltime" ? "bg-primary text-primary-foreground" : "border-border"}>
          All Time
        </Button>
      </div>

      <div className="space-y-3">
        {leaders.map((user, i) => (
          <motion.div key={user.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`shadow-card border ${user.name === "Alex Chen" ? "ring-2 ring-primary" : ""} ${rankBg[user.rank] || "border-border"}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-8 text-center shrink-0">
                  {rankIcons[user.rank] || <span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>}
                </div>
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    {user.name}
                    {user.name === "Alex Chen" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">You</span>}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Flame className="h-3 w-3 text-warning" /> {user.streak} day streak
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{user.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
