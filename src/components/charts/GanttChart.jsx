import React from "react";
import { motion } from "framer-motion";

const SEGMENT_COLORS = [
  { bg: "bg-primary/30", border: "border-primary/40", text: "text-primary" },
  { bg: "bg-accent/30", border: "border-accent/40", text: "text-accent" },
  { bg: "bg-chart-3/30", border: "border-chart-3/40", text: "text-chart-3" },
  { bg: "bg-chart-4/30", border: "border-chart-4/40", text: "text-chart-4" },
  { bg: "bg-chart-5/30", border: "border-chart-5/40", text: "text-chart-5" },
  { bg: "bg-blue-500/30", border: "border-blue-500/40", text: "text-blue-400" },
  { bg: "bg-orange-500/30", border: "border-orange-500/40", text: "text-orange-400" },
  { bg: "bg-rose-500/30", border: "border-rose-500/40", text: "text-rose-400" },
];

function getSegmentStyle(pid) {
  if (pid === "idle") {
    return { bg: "bg-muted/40", border: "border-border", text: "text-muted-foreground" };
  }
  const seed = pid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return SEGMENT_COLORS[seed % SEGMENT_COLORS.length];
}

export default function GanttChart({ timeline = [], currentStep = 0 }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <div className="w-6 h-3 rounded bg-primary/30 border border-primary/20" />
          </div>
          <p className="text-sm text-muted-foreground">
            Run a simulation to generate the Gantt chart.
          </p>
        </div>
      </div>
    );
  }

  const totalDuration = timeline[timeline.length - 1]?.end || 1;
  const activeIndex = Math.min(currentStep, timeline.length - 1);

  // Generate time markers
  const markerCount = Math.min(totalDuration + 1, 12);
  const markerStep = Math.ceil(totalDuration / (markerCount - 1));
  const markers = [];
  for (let t = 0; t <= totalDuration; t += markerStep) {
    markers.push(t);
  }
  if (markers[markers.length - 1] !== totalDuration) {
    markers.push(totalDuration);
  }

  // Collect unique PIDs for legend
  const uniquePids = [...new Set(timeline.filter((s) => s.pid !== "idle").map((s) => s.pid))];

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Gantt Chart</h3>
        <span className="text-[10px] text-muted-foreground font-mono">
          Total: {totalDuration}ms
        </span>
      </div>

      <div className="rounded-lg border border-border bg-secondary/20 p-4">
        {/* Gantt Bars */}
        <div className="flex w-full overflow-hidden rounded-lg">
          {timeline.map((segment, index) => {
            const duration = Math.max(0.1, segment.end - segment.start);
            const width = (duration / totalDuration) * 100;
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const style = getSegmentStyle(segment.pid);

            return (
              <motion.div
                key={`${segment.pid}-${segment.start}-${segment.end}`}
                initial={{ opacity: 0, scaleY: 0.8 }}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  scaleY: 1,
                }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                style={{ width: `${width}%` }}
                className={`h-14 border-r border-background/50 px-1 text-center text-xs flex flex-col items-center justify-center
                  ${style.bg} ${style.text} border-b-2 ${style.border}
                  ${isCurrent ? "ring-1 ring-primary/50" : ""}
                  transition-all duration-200`}
                title={`${segment.pid} (${segment.start}ms - ${segment.end}ms, duration: ${duration}ms)`}
              >
                <span className="font-semibold text-[11px] leading-tight truncate w-full">
                  {segment.pid}
                </span>
                {width > 6 && (
                  <span className="text-[9px] opacity-70 font-mono">
                    {segment.start}-{segment.end}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Time Markers */}
        <div className="relative mt-2 h-4">
          {markers.map((t) => (
            <span
              key={t}
              className="absolute text-[9px] text-muted-foreground font-mono -translate-x-1/2"
              style={{ left: `${(t / totalDuration) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      {uniquePids.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {uniquePids.map((pid) => {
            const style = getSegmentStyle(pid);
            return (
              <div key={pid} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${style.bg} ${style.border} border`} />
                <span className="text-[10px] text-muted-foreground font-mono">{pid}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
