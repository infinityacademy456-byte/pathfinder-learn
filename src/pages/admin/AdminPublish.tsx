import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import PublishContent from "@/components/admin/PublishContent";

export default function AdminPublish() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Upload className="h-6 w-6 text-primary" /> Publish Content</h1>
      </motion.div>
      <PublishContent />
    </div>
  );
}
