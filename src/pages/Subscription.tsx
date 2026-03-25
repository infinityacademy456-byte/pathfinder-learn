import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Access to beginner courses",
      "5 practice problems/day",
      "Community access",
      "Basic progress tracking",
    ],
    missing: [
      "Advanced courses",
      "AI Assistant",
      "Certificates",
      "Project guidance",
    ],
    cta: "Current Plan",
    active: true,
    gradient: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description: "Unlock everything and accelerate your learning",
    features: [
      "All courses & paths",
      "Unlimited practice problems",
      "AI Learning Assistant",
      "Downloadable certificates",
      "Priority community support",
      "Project step-by-step guidance",
      "Advanced analytics",
      "Offline content access",
    ],
    missing: [],
    cta: "Upgrade to Premium",
    active: false,
    gradient: true,
  },
];

export default function Subscription() {
  const [selected, setSelected] = useState("Free");

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 text-warning" /> Choose Your Plan
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">Unlock premium features and accelerate your learning journey.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`shadow-card border-border h-full relative ${plan.gradient ? "ring-2 ring-primary" : ""}`}>
              {plan.gradient && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">Recommended</span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  {plan.gradient ? (
                    <Zap className="h-8 w-8 text-warning mb-2" />
                  ) : (
                    <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                  )}
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm opacity-40">
                      <Check className="h-4 w-4 shrink-0" />
                      <span className="text-foreground line-through">{f}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full ${plan.gradient ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border"}`}
                  variant={plan.gradient ? "default" : "outline"}
                  disabled={plan.active}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
