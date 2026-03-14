import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, ThumbsUp, ThumbsDown, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AlgorithmCard({ algo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${algo.color}`}
          >
            <algo.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{algo.name}</h3>
            <p className="text-xs text-muted-foreground">{algo.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {algo.type}
          </Badge>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              {/* Explanation */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  How It Works
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {algo.explanation}
                </p>
              </div>

              {/* Working Principle */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Working Principle
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {algo.principle}
                </p>
              </div>

              {/* Complexity */}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Time Complexity:
                </span>
                <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {algo.complexity}
                </code>
              </div>

              {/* Advantages */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsUp className="w-3.5 h-3.5 text-accent" />
                  <h4 className="text-xs font-semibold text-accent">
                    Advantages
                  </h4>
                </div>
                <ul className="space-y-1">
                  {algo.advantages.map((a, i) => (
                    <li
                      key={i}
                      className="text-xs text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-accent mt-0.5">•</span> {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disadvantages */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsDown className="w-3.5 h-3.5 text-destructive" />
                  <h4 className="text-xs font-semibold text-destructive">
                    Disadvantages
                  </h4>
                </div>
                <ul className="space-y-1">
                  {algo.disadvantages.map((d, i) => (
                    <li
                      key={i}
                      className="text-xs text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-destructive mt-0.5">•</span> {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real World */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Globe className="w-3.5 h-3.5 text-chart-5" />
                  <h4 className="text-xs font-semibold text-chart-5">
                    Real-World Usage
                  </h4>
                </div>
                <p className="text-xs text-foreground/70">{algo.realWorld}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
