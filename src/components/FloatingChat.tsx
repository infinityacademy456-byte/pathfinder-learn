import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickReplies = [
  "Explain Python lists",
  "What is SQL?",
  "Help me debug",
];

const mockResponses: Record<string, string> = {
  default: `Great question! Here's a quick breakdown:\n\n1. **Understand the concept** — grasp the fundamentals first\n2. **Try examples** — practice with small code snippets\n3. **Build something** — apply it in a mini project\n\nWant me to elaborate on any part?`,
  "Explain Python lists": `**Python Lists** are ordered, mutable collections:\n\n\`\`\`python\nfruits = ["apple", "banana", "cherry"]\nfruits.append("date")\nprint(fruits[0])  # apple\n\`\`\`\n\nKey features:\n- **Ordered** — items have a defined order\n- **Mutable** — you can change items\n- **Allow duplicates** — same value can appear multiple times`,
  "What is SQL?": `**SQL** (Structured Query Language) is used to manage databases.\n\n\`\`\`sql\nSELECT name, age FROM users WHERE age > 18;\n\`\`\`\n\nCore operations: **SELECT**, **INSERT**, **UPDATE**, **DELETE**`,
  "Help me debug": `Sure! Share your code and I'll help. Common debugging steps:\n\n1. **Read the error message** carefully\n2. **Check line numbers** mentioned\n3. **Print variables** to inspect values\n4. **Google the error** — someone's likely faced it before`,
};

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm your AI assistant. Ask me anything about your learning!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const response = mockResponses[msg] || mockResponses.default;
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-primary">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="font-semibold text-sm text-primary-foreground">AI Assistant</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsOpen(false)} className="h-7 w-7 rounded-lg flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="h-7 w-7 rounded-lg flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "gradient-primary" : "bg-secondary"}`}>
                    {msg.role === "assistant" ? <Bot className="h-3 w-3 text-primary-foreground" /> : <User className="h-3 w-3 text-secondary-foreground" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                    <div className="prose prose-xs max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-xl px-3 py-2 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div className="px-3 pb-1 flex gap-1 flex-wrap">
                {quickReplies.map((q) => (
                  <button key={q} onClick={() => handleSend(q)} className="text-[10px] px-2 py-1 rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
