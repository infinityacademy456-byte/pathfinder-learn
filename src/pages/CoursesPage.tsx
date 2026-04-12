import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Star, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MockCourse {
  id: string;
  title: string;
  mentor: string;
  rating: number;
  duration: string;
  enrolled: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  progress: number;
}

const allCourses: MockCourse[] = [
  { id: "c1", title: "Python for Beginners", mentor: "Dr. Anil Kumar", rating: 4.8, duration: "12h", enrolled: 3200, level: "beginner", category: "Python", progress: 35 },
  { id: "c2", title: "SQL Masterclass", mentor: "Sarah Kim", rating: 4.7, duration: "8h", enrolled: 2100, level: "beginner", category: "SQL", progress: 60 },
  { id: "c3", title: "Machine Learning A-Z", mentor: "Dr. James Lee", rating: 4.9, duration: "24h", enrolled: 5400, level: "intermediate", category: "AI", progress: 0 },
  { id: "c4", title: "React & TypeScript", mentor: "Priya Sharma", rating: 4.6, duration: "16h", enrolled: 1800, level: "intermediate", category: "Web Dev", progress: 0 },
  { id: "c5", title: "Power BI Dashboard Design", mentor: "Mark Chen", rating: 4.5, duration: "10h", enrolled: 1400, level: "beginner", category: "Data", progress: 0 },
  { id: "c6", title: "Advanced Python Patterns", mentor: "Dr. Anil Kumar", rating: 4.7, duration: "14h", enrolled: 980, level: "advanced", category: "Python", progress: 0 },
  { id: "c7", title: "Deep Learning with PyTorch", mentor: "Dr. James Lee", rating: 4.8, duration: "20h", enrolled: 2600, level: "advanced", category: "AI", progress: 0 },
  { id: "c8", title: "Full-Stack Web Development", mentor: "Priya Sharma", rating: 4.6, duration: "30h", enrolled: 4100, level: "intermediate", category: "Web Dev", progress: 10 },
];

const categories = ["All", "AI", "Web Dev", "Data", "SQL", "Python"];
const levels = ["All", "beginner", "intermediate", "advanced"];
const sortOptions = ["Popular", "Newest", "Rating"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("Popular");

  const filtered = useMemo(() => {
    let result = allCourses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "All") result = result.filter((c) => c.category === category);
    if (level !== "All") result = result.filter((c) => c.level === level);
    if (sort === "Popular") result.sort((a, b) => b.enrolled - a.enrolled);
    else if (sort === "Rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, category, level, sort]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-foreground">
        Explore Courses
      </motion.h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            {levels.map((l) => <SelectItem key={l} value={l}>{l === "All" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            {sortOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card hover:shadow-card-hover transition-shadow border-border h-full flex flex-col">
              <div className="h-32 bg-muted rounded-t-lg flex items-center justify-center text-muted-foreground text-sm">
                Thumbnail
              </div>
              <CardContent className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="font-semibold text-foreground line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground">by {course.mentor}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{course.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.enrolled}</span>
                </div>
                <Badge variant="outline" className="capitalize w-fit">{course.level}</Badge>
                <div className="mt-auto pt-2">
                  <Link to={`/courses/${course.id}`}>
                    <Button size="sm" className="w-full">{course.progress > 0 ? "Continue" : "Enroll"}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No courses found.</p>}
    </div>
  );
}
