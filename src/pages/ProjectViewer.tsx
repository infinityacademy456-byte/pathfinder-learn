import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/data/mockData";

export default function ProjectViewer() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Project not found.</p>
        <Button variant="outline" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
        </Button>
      </div>
    );
  }

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const progressPercent = Math.round((completedSteps.size / project.steps.length) * 100);

  const levelColor: Record<string, string> = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-warning/10 text-warning",
    advanced: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColor[project.level]}`}>
            {project.level}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />{project.estimatedTime}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{project.title}</h1>
        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1 mb-6">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
          ))}
        </div>
      </motion.div>

      {/* Progress */}
      <Card className="shadow-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{completedSteps.size}/{project.steps.length} steps</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</p>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {project.steps.map((step, i) => {
          const done = completedSteps.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`shadow-card border-border cursor-pointer transition-all hover:shadow-card-hover ${done ? "bg-success/5 border-success/20" : ""}`}
                onClick={() => toggleStep(i)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Step {i + 1}</span>
                    <p className={`font-medium ${done ? "text-success line-through" : "text-foreground"}`}>{step}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {progressPercent === 100 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-card border-success/30 bg-success/5">
            <CardContent className="p-6 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <h3 className="text-lg font-bold text-foreground mb-1">Project Complete!</h3>
              <p className="text-sm text-muted-foreground mb-4">Great work finishing {project.title}.</p>
              <Button onClick={() => navigate("/projects")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Back to Projects <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
