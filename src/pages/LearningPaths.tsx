import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learningPaths } from "@/data/mockData";
import { ProgressRing } from "@/components/ProgressRing";

export default function LearningPaths() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Learning Paths</h1>
        <p className="text-muted-foreground">Choose a domain and go from beginner to job-ready.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {learningPaths.map((path, i) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all border-border group hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${path.color}20` }}
                  >
                    {path.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{path.title}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                        {path.level}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{path.lessonsCount} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{path.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {path.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    {path.progress > 0 ? (
                      <div className="space-y-2">
                        <Progress value={path.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{path.progress}% complete</span>
                          <Link to="/courses/py-101">
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Continue <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link to="/courses/py-101">
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          Start Path <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
