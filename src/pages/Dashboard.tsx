import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Flame, Trophy, TrendingUp, ArrowRight, Play, Zap, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learningPaths, userProfile } from "@/data/mockData";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const xpForNextLevel = (level: number) => level * 500;

export default function Dashboard() {
  const activePaths = learningPaths.filter((p) => p.progress > 0);
  const recommended = learningPaths.filter((p) => p.progress === 0).slice(0, 3);
  const currentLevelXP = userProfile.totalXP % xpForNextLevel(userProfile.level);
  const nextLevelXP = xpForNextLevel(userProfile.level);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div {...fadeIn} className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {userProfile.name}! 👋
        </h1>
        <p className="text-primary-foreground/80 mb-4">
          You're on a {userProfile.streak}-day streak. Keep it going!
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-2">
            <Flame className="h-5 w-5 text-warning" />
            <div>
              <span className="font-semibold">{userProfile.streak} day streak</span>
              <span className="text-primary-foreground/60 text-xs ml-1">(best: {userProfile.longestStreak})</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-2">
            <Trophy className="h-5 w-5 text-warning" />
            <span className="font-semibold">{userProfile.totalXP} XP</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-2">
            <Zap className="h-5 w-5 text-warning" />
            <span className="font-semibold">Level {userProfile.level}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-4 py-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">{userProfile.coursesCompleted} courses</span>
          </div>
        </div>
        {/* Level progress bar */}
        <div className="mt-4 bg-primary-foreground/10 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Level {userProfile.level}</span>
            <span>{currentLevelXP}/{nextLevelXP} XP to Level {userProfile.level + 1}</span>
          </div>
          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(currentLevelXP / nextLevelXP) * 100}%` }} />
          </div>
        </div>
      </motion.div>

      {/* Continue Learning */}
      {activePaths.length > 0 && (
        <motion.section {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
            <Link to="/paths" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activePaths.map((path) => (
              <Card key={path.id} className="shadow-card hover:shadow-card-hover transition-shadow border-border group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{path.icon}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                      {path.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{path.description}</p>
                  <Progress value={path.progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{path.progress}% complete</span>
                    <Link to={`/courses/py-101`}>
                      <Button size="sm" variant="ghost" className="text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Play className="h-3 w-3 mr-1" /> Continue
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recommended */}
      <motion.section {...fadeIn} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recommended for You</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((path) => (
            <Card key={path.id} className="shadow-card hover:shadow-card-hover transition-shadow border-border group">
              <CardContent className="p-5">
                <span className="text-3xl mb-3 block">{path.icon}</span>
                <h3 className="font-semibold text-foreground mb-1">{path.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{path.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {path.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/paths">
                  <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <TrendingUp className="h-3 w-3 mr-1" /> Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section {...fadeIn} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Practice Now", desc: "Solve problems", icon: Target, to: "/practice", gradient: "gradient-accent" },
            { title: "Build Projects", desc: "Hands-on learning", icon: BookOpen, to: "/projects", gradient: "gradient-primary" },
            { title: "AI Assistant", desc: "Get help anytime", icon: Flame, to: "/assistant", gradient: "bg-info" },
            { title: "Analytics", desc: "Track progress", icon: BarChart3, to: "/analytics", gradient: "bg-warning" },
          ].map((action) => (
            <Link key={action.title} to={action.to}>
              <Card className="shadow-card hover:shadow-card-hover transition-all border-border cursor-pointer group hover:-translate-y-0.5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${action.gradient} flex items-center justify-center shrink-0`}>
                    <action.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
