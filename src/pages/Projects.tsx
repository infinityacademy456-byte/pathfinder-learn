import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, CheckCircle2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/mockData";

const levelColor = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-warning/10 text-warning",
  advanced: "bg-destructive/10 text-destructive",
};

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Projects</h1>
        <p className="text-muted-foreground">Build real-world projects to solidify your skills.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all border-border h-full flex flex-col hover:-translate-y-0.5">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColor[project.level]}`}>
                    {project.level}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{project.estimatedTime}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Steps:</p>
                  <div className="space-y-1">
                    {project.steps.slice(0, 3).map((step, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                    {project.steps.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-5">+{project.steps.length - 3} more steps</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Start Project <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
