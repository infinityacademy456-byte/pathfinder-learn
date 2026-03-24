import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Explain Python lists vs tuples",
  "How does a for loop work?",
  "What is machine learning?",
  "Help me debug this code",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm your AI learning assistant. Ask me anything about programming, data science, or your learning path. I'll explain things in simple terms!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Mock AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: `Great question! Let me help you with that.\n\nHere's a simple explanation:\n\n1. **Start with the basics** - understand the core concept\n2. **Practice with examples** - try coding it yourself\n3. **Build something** - apply it in a project\n\nWould you like me to go deeper into any specific part?`,
      };
      setMessages((prev) => [...prev, { role: "assistant", content: responses.default }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b border-border bg-card">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" /> AI Learning Assistant
        </h1>
        <p className="text-xs text-muted-foreground">Ask questions, debug code, or get learning recommendations</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "assistant" ? "gradient-primary" : "bg-secondary"
            }`}>
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4 text-primary-foreground" />
              ) : (
                <User className="h-4 w-4 text-secondary-foreground" />
              )}
            </div>
            <Card className={`max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"} border-border shadow-card`}>
              <CardContent className="p-3 text-sm">
                <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-primary-foreground prose-headings:text-primary-foreground" : "text-foreground prose-headings:text-foreground"}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <Card className="bg-card border-border shadow-card">
              <CardContent className="p-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button type="submit" disabled={!input.trim() || isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
