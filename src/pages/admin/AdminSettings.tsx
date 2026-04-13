import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Settings className="h-6 w-6 text-primary" /> Platform Settings</h1>
      </motion.div>
      <Card className="shadow-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-xs text-muted-foreground">Platform Name</label><Input defaultValue="Infinity Learning Hub" /></div>
            <div><label className="text-xs text-muted-foreground">Support Email</label><Input defaultValue="support@infinitylearning.com" /></div>
            <div><label className="text-xs text-muted-foreground">Max Free Courses</label><Input type="number" defaultValue="3" /></div>
            <div><label className="text-xs text-muted-foreground">Premium Price ($/month)</label><Input type="number" defaultValue="19" /></div>
          </div>
          <Button onClick={() => toast.success("Settings saved")} className="bg-primary text-primary-foreground">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
