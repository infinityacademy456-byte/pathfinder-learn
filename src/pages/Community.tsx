import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Send, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  topic: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
}

const initialPosts: Post[] = [
  { id: "1", author: "Sarah Kim", avatar: "SK", title: "How to start with Machine Learning?", content: "I know Python basics but I'm confused about where to start with ML. Should I learn math first or jump into libraries like sklearn?", topic: "Machine Learning", likes: 24, replies: 8, time: "2h ago", liked: false },
  { id: "2", author: "Marcus Lee", avatar: "ML", title: "SQL JOIN types explained simply", content: "I wrote a quick guide on INNER, LEFT, RIGHT, and FULL joins with visual examples. Hope it helps beginners!", topic: "SQL", likes: 45, replies: 12, time: "5h ago", liked: true },
  { id: "3", author: "Priya Sharma", avatar: "PS", title: "Python list comprehension vs for loop", content: "When should I use list comprehension over a regular for loop? Are there performance differences?", topic: "Python", likes: 18, replies: 6, time: "1d ago", liked: false },
  { id: "4", author: "Jordan Taylor", avatar: "JT", title: "Best resources for Data Visualization", content: "Looking for recommendations beyond matplotlib. What do you all use for creating beautiful charts in Python?", topic: "Data Science", likes: 31, replies: 15, time: "1d ago", liked: false },
];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    );
  };

  const handlePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: "Alex Chen",
      avatar: "AC",
      title: newTitle,
      content: newContent,
      topic: "General",
      likes: 0,
      replies: 0,
      time: "Just now",
      liked: false,
    };
    setPosts((prev) => [post, ...prev]);
    setNewTitle("");
    setNewContent("");
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-primary" /> Community
          </h1>
          <p className="text-muted-foreground">Ask questions, share knowledge, help others.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Ask a Question
        </Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card className="shadow-card border-border">
            <CardContent className="p-5 space-y-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Question title..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe your question..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="border-border">Cancel</Button>
                <Button size="sm" onClick={handlePost} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="h-3 w-3 mr-1" /> Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card border-border hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{post.author}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{post.time}</span>
                      <Badge variant="secondary" className="text-[10px]">{post.topic}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${post.liked ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${post.liked ? "fill-primary" : ""}`} />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" /> {post.replies} replies
                      </span>
                    </div>
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
