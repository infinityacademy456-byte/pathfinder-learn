import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const courses = [
  { title: "Python Fundamentals", category: "Python", difficulty: "Beginner", mentor: "Dr. Sarah Lin", students: 342, status: "Published" },
  { title: "SQL Mastery", category: "SQL", difficulty: "Intermediate", mentor: "Priya Sharma", students: 218, status: "Published" },
  { title: "Machine Learning Basics", category: "Machine Learning", difficulty: "Advanced", mentor: "Dr. Sarah Lin", students: 156, status: "Published" },
  { title: "Web Dev with React", category: "Web Dev", difficulty: "Intermediate", mentor: "Marcus Lee", students: 289, status: "Draft" },
  { title: "Power BI Analytics", category: "Power BI", difficulty: "Beginner", mentor: "Priya Sharma", students: 94, status: "Published" },
];

export default function AdminCourses() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Manage Courses</h1>
      </motion.div>
      <Card className="shadow-card border-border">
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead>
              <TableHead>Mentor</TableHead><TableHead>Students</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {courses.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{c.difficulty}</Badge></TableCell>
                  <TableCell>{c.mentor}</TableCell>
                  <TableCell>{c.students}</TableCell>
                  <TableCell><Badge variant={c.status === "Published" ? "default" : "secondary"} className="text-xs">{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
