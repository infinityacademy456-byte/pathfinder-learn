import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { practiceQuestions } from "@/data/mockData";

const mcqs = practiceQuestions.filter((q) => q.type === "mcq" && q.options);

export default function QuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(mcqs.length).fill(null));
  const [done, setDone] = useState(false);

  const q = mcqs[current];
  const total = mcqs.length;

  const handleNext = () => {
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setSelected(null);
    if (current < total - 1) {
      setCurrent((p) => p + 1);
    } else {
      setDone(true);
    }
  };

  const score = answers.filter((a, i) => a === mcqs[i].correctAnswer).length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  if (done) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-card border-border">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Quiz Results</h1>
              <p className="text-4xl font-bold text-foreground">{score}/{total}</p>
              <p className="text-lg text-muted-foreground">{pct}%</p>
              <Badge variant={passed ? "default" : "destructive"} className="text-sm px-4 py-1">
                {passed ? "Passed ✓" : "Failed ✗"}
              </Badge>
              <div className="space-y-2 text-left pt-4">
                {mcqs.map((q, i) => (
                  <div key={q.id} className="flex items-center gap-2 text-sm">
                    {answers[i] === q.correctAnswer ? (
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <span className="text-foreground truncate">{q.question}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => { setCurrent(0); setAnswers(Array(total).fill(null)); setSelected(null); setDone(false); }}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Retry
                </Button>
                <Button onClick={() => navigate("/courses")}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Question {current + 1} of {total}</p>
        <Badge variant="secondary">{q.topic}</Badge>
      </div>
      <Progress value={((current + 1) / total) * 100} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
          <Card className="shadow-card border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{q.question}</h2>
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                      selected === opt
                        ? "border-primary bg-primary/10 text-foreground font-medium"
                        : "border-border hover:border-muted-foreground/30 text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!selected}>
          {current < total - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
}
