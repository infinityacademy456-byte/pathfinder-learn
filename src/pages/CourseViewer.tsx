import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/mockData";
import ReactMarkdown from "react-markdown";

export default function CourseViewer() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const activeLesson = course.lessons[activeLessonIndex];

  const completedCount = course.lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar - Lesson List */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card p-4 overflow-y-auto">
        <h2 className="font-bold text-foreground mb-1">{course.title}</h2>
        <p className="text-xs text-muted-foreground mb-3 capitalize">{course.level} · {course.lessons.length} lessons</p>
        <Progress value={progressPercent} className="h-1.5 mb-4" />
        <div className="space-y-1">
          {course.lessons.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonIndex(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors ${
                i === activeLessonIndex
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              {lesson.completed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{lesson.title}</p>
                <p className={`text-xs ${i === activeLessonIndex ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  <Clock className="h-3 w-3 inline mr-1" />{lesson.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLesson.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                  {activeLesson.type}
                </span>
                <span className="text-xs text-muted-foreground">{activeLesson.duration}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-6">{activeLesson.title}</h1>

              <Card className="border-border shadow-card">
                <CardContent className="p-6 prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:rounded prose-pre:bg-secondary prose-pre:text-foreground">
                  <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveLessonIndex(Math.max(0, activeLessonIndex - 1))}
                  disabled={activeLessonIndex === 0}
                  className="border-border"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  onClick={() => setActiveLessonIndex(Math.min(course.lessons.length - 1, activeLessonIndex + 1))}
                  disabled={activeLessonIndex === course.lessons.length - 1}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
