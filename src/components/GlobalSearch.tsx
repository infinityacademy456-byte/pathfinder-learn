import { useState, useRef, useEffect } from "react";
import { Search, X, BookOpen, Route, Code2, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { learningPaths, courses, practiceQuestions, projects } from "@/data/mockData";

interface SearchResult {
  type: "path" | "course" | "practice" | "project";
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results: SearchResult[] = query.trim().length < 2 ? [] : [
    ...learningPaths
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      .map((p) => ({ type: "path" as const, title: p.title, subtitle: `${p.level} · ${p.lessonsCount} lessons`, url: "/paths", icon: <Route className="h-4 w-4 text-primary" /> })),
    ...courses
      .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
      .map((c) => ({ type: "course" as const, title: c.title, subtitle: c.level, url: `/courses/${c.id}`, icon: <BookOpen className="h-4 w-4 text-info" /> })),
    ...practiceQuestions
      .filter((q) => q.question.toLowerCase().includes(query.toLowerCase()) || q.topic.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((q) => ({ type: "practice" as const, title: q.question.slice(0, 60) + "...", subtitle: `${q.topic} · ${q.difficulty}`, url: "/practice", icon: <Code2 className="h-4 w-4 text-accent" /> })),
    ...projects
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())))
      .map((p) => ({ type: "project" as const, title: p.title, subtitle: p.level, url: "/projects", icon: <FolderKanban className="h-4 w-4 text-warning" /> })),
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (url: string) => {
    navigate(url);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-muted-foreground text-xs hover:bg-secondary transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-elevated overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search paths, courses, projects..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}><X className="h-4 w-4 text-muted-foreground" /></button>
              )}
            </div>
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.url)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-secondary transition-colors"
                  >
                    {r.icon}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{r.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
