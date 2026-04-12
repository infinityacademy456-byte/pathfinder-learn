import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Flame, Zap, Award, BookOpen, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { userProfile, learningPaths } from "@/data/mockData";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const stats = [
  { label: "Total XP", value: userProfile.totalXP, icon: Zap },
  { label: "Courses Completed", value: userProfile.coursesCompleted, icon: BookOpen },
  { label: "Streak Days", value: userProfile.streak, icon: Flame },
  { label: "Certificates", value: userProfile.coursesCompleted, icon: Award },
];

export default function StudentProfile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState("Passionate learner exploring data science and AI.");
  const [avatarColor, setAvatarColor] = useState("hsl(245, 58%, 21%)");

  const enrolled = learningPaths.filter((p) => p.progress > 0);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center gap-5">
        <Avatar className="h-20 w-20 text-2xl" style={{ backgroundColor: avatarColor }}>
          <AvatarFallback className="text-primary-foreground text-2xl font-bold" style={{ backgroundColor: avatarColor }}>
            {name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-bold text-foreground">{name}</h1>
          <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
            <Badge>Student</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Joined {new Date(userProfile.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
          {!editing && <p className="text-sm text-muted-foreground mt-2">{bio}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
          <Pencil className="h-3 w-3 mr-1" /> {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </motion.div>

      {/* Edit form */}
      {editing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card className="border-border">
            <CardContent className="p-4 space-y-3">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" rows={2} />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avatar Color</p>
                <div className="flex gap-2">
                  {["hsl(245,58%,21%)", "hsl(160,84%,39%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)", "hsl(210,100%,52%)"].map((c) => (
                    <button key={c} onClick={() => setAvatarColor(c)} className={`h-8 w-8 rounded-full border-2 ${avatarColor === c ? "border-foreground" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <Button size="sm" onClick={() => setEditing(false)}>Save</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border">
            <CardContent className="p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="space-y-3 mt-4">
          {enrolled.length === 0 && <p className="text-muted-foreground text-sm">No enrolled courses yet.</p>}
          {enrolled.map((p) => (
            <Card key={p.id} className="border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{p.title}</p>
                  <Progress value={p.progress} className="h-2 mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">{p.progress}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userProfile.badges.map((b) => (
              <Card key={b.id} className={`border-border ${!b.earned ? "opacity-40 grayscale" : ""}`}>
                <CardContent className="p-4 text-center">
                  <span className="text-3xl block mb-1">{b.icon}</span>
                  <p className="text-sm font-medium text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
