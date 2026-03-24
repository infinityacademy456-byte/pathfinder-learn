import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Code2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { practiceQuestions } from "@/data/mockData";

export default function PracticeZone() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [filter, setFilter] = useState<"all" | "mcq" | "coding">("all");

  const filtered = practiceQuestions.filter((q) => filter === "all" || q.type === filter);
  const question = filtered[currentIndex];

  const handleSubmit = () => {
    if (selectedAnswer) setShowResult(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const isCorrect = selectedAnswer === question?.correctAnswer;
  const difficultyColor = {
    easy: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    hard: "bg-destructive/10 text-destructive",
  };

  if (!question) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Practice Zone</h1>
        <p className="text-muted-foreground">Sharpen your skills with real problems.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "mcq", "coding"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => { setFilter(f); setCurrentIndex(0); setShowResult(false); setSelectedAnswer(null); }}
            className={filter === f ? "bg-primary text-primary-foreground" : "border-border"}
          >
            {f === "mcq" ? "MCQs" : f === "coding" ? "Coding" : "All"}
          </Button>
        ))}
      </div>

      {/* Question Card */}
      <motion.div key={question.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {question.type === "mcq" ? (
                <HelpCircle className="h-5 w-5 text-info" />
              ) : (
                <Code2 className="h-5 w-5 text-primary" />
              )}
              <Badge variant="secondary" className="capitalize">{question.topic}</Badge>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[question.difficulty]}`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {currentIndex + 1} / {filtered.length}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-6">{question.question}</h3>

            {question.type === "mcq" && question.options ? (
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isOptionCorrect = option === question.correctAnswer;
                  let optionStyle = "border-border hover:border-primary/50 hover:bg-secondary";
                  if (showResult && isOptionCorrect) optionStyle = "border-success bg-success/5";
                  else if (showResult && isSelected && !isOptionCorrect) optionStyle = "border-destructive bg-destructive/5";
                  else if (isSelected) optionStyle = "border-primary bg-primary/5";

                  return (
                    <button
                      key={option}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-colors text-foreground ${optionStyle}`}
                    >
                      <span className="text-sm">{option}</span>
                      {showResult && isOptionCorrect && <CheckCircle2 className="inline h-4 w-4 ml-2 text-success" />}
                      {showResult && isSelected && !isOptionCorrect && <XCircle className="inline h-4 w-4 ml-2 text-destructive" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  placeholder="Write your solution here..."
                  value={selectedAnswer || ""}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className="w-full h-32 p-4 rounded-xl border-2 border-border bg-secondary text-foreground font-mono text-sm resize-none focus:outline-none focus:border-primary"
                />
                {showResult && (
                  <div className="p-4 rounded-xl bg-secondary border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Expected solution:</p>
                    <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{question.correctAnswer}</pre>
                  </div>
                )}
              </div>
            )}

            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mt-4 p-4 rounded-xl ${isCorrect ? "bg-success/5 border border-success/20" : "bg-destructive/5 border border-destructive/20"}`}
              >
                <p className={`font-semibold text-sm mb-1 ${isCorrect ? "text-success" : "text-destructive"}`}>
                  {isCorrect ? "🎉 Correct!" : "❌ Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </motion.div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {!showResult ? (
                <Button onClick={handleSubmit} disabled={!selectedAnswer} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Next Question <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
