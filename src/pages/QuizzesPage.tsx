import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HelpCircle, Clock, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quizzes = [
  { id: "1", title: "Python Basics Quiz", course: "Python Fundamentals", questions: 10, time: 15, difficulty: "Beginner" },
  { id: "2", title: "SQL Joins Challenge", course: "SQL Mastery", questions: 8, time: 12, difficulty: "Intermediate" },
  { id: "3", title: "ML Concepts Quiz", course: "Machine Learning", questions: 12, time: 20, difficulty: "Advanced" },
  { id: "4", title: "HTML & CSS Basics", course: "Web Development", questions: 10, time: 10, difficulty: "Beginner" },
  { id: "5", title: "Data Structures", course: "Python Advanced", questions: 15, time: 25, difficulty: "Intermediate" },
];

export default function QuizzesPage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" /> Quizzes
        </h1>
        <p className="text-sm text-muted-foreground">Test your knowledge across courses</p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card border-border hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{q.title}</p>
                    <p className="text-xs text-muted-foreground">{q.course}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" />{q.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{q.time} min</span>
                </div>
                <Button size="sm" className="w-full bg-primary text-primary-foreground" onClick={() => navigate(`/quiz/${q.id}`)}>
                  Start Quiz <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
