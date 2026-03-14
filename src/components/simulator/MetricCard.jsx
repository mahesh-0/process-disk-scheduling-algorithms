import React from "react";
import { motion } from "framer-motion";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "primary",
  delay = 0,
}) {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary border-primary/20",
    accent: "from-accent/20 to-accent/5 text-accent border-accent/20",
    chart3: "from-chart-3/20 to-chart-3/5 text-chart-3 border-chart-3/20",
    chart4: "from-chart-4/20 to-chart-4/5 text-chart-4 border-chart-4/20",
    chart5: "from-chart-5/20 to-chart-5/5 text-chart-5 border-chart-5/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`glass rounded-xl p-4 border bg-gradient-to-br ${colorClasses[color] || colorClasses.primary}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-lg font-bold font-mono mt-0.5">
            {typeof value === "number" ? value.toFixed(2) : value}
            {unit && (
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
