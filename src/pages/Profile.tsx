import { motion } from "framer-motion";
import { Flame, Trophy, BookOpen, Star, Award, Zap, Clock, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { userProfile, learningPaths } from "@/data/mockData";

const xpForNextLevel = (level: number) => level * 500;

export default function Profile() {
  const activePaths = learningPaths.filter((p) => p.progress > 0);
  const currentLevelXP = userProfile.totalXP % xpForNextLevel(userProfile.level);
  const nextLevelXP = xpForNextLevel(userProfile.level);
  const levelProgress = (currentLevelXP / nextLevelXP) * 100;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card border-border overflow-hidden">
          <div className="gradient-hero p-6 pb-16" />
          <CardContent className="p-6 -mt-12">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-elevated">
                {userProfile.avatar}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              </div>
              <Badge variant="secondary" className="capitalize">{userProfile.plan} Plan</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="shadow-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary-foreground">L{userProfile.level}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Level {userProfile.level}</span>
                  <span className="text-xs text-muted-foreground">{currentLevelXP} / {nextLevelXP} XP</span>
                </div>
                <Progress value={levelProgress} className="h-2.5" />
                <p className="text-xs text-muted-foreground mt-1">{nextLevelXP - currentLevelXP} XP to Level {userProfile.level + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Current Streak", value: `${userProfile.streak} days`, icon: Flame, color: "text-warning" },
            { label: "Longest Streak", value: `${userProfile.longestStreak} days`, icon: TrendingUp, color: "text-accent" },
            { label: "Total XP", value: userProfile.totalXP.toLocaleString(), icon: Trophy, color: "text-warning" },
            { label: "Courses Done", value: userProfile.coursesCompleted, icon: BookOpen, color: "text-primary" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card border-border">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Additional stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Time Learned", value: `${Math.round(userProfile.totalMinutesLearned / 60)}h`, icon: Clock, color: "text-info" },
          { label: "Lessons Done", value: userProfile.lessonsCompleted, icon: BookOpen, color: "text-primary" },
          { label: "Problems Solved", value: userProfile.practicesSolved, icon: Target, color: "text-accent" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card border-border">
            <CardContent className="p-3 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badges */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Badges & Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userProfile.badges.map((badge) => (
            <Card key={badge.id} className={`shadow-card border-border transition-all ${!badge.earned ? "opacity-40 grayscale" : "hover:-translate-y-0.5 hover:shadow-card-hover"}`}>
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">{badge.icon}</span>
                <p className="font-semibold text-foreground text-sm">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {badge.earned && (
                  <Badge className="mt-2 bg-success/10 text-success border-0 text-xs">Earned ✓</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Skills Learned</h2>
        <div className="flex flex-wrap gap-2">
          {userProfile.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
          ))}
        </div>
      </motion.section>

      {/* Active Paths */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Active Learning Paths</h2>
        <div className="space-y-3">
          {activePaths.map((path) => (
            <Card key={path.id} className="shadow-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <span className="text-2xl">{path.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{path.title}</p>
                  <Progress value={path.progress} className="h-1.5 mt-1" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{path.progress}%</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
