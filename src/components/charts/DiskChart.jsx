import React from "react";
import { motion } from "framer-motion";

function getPoint(step, index, maxX, height, totalPoints) {
  const x = maxX <= 0 ? 0 : (step.position / maxX) * 100;
  const y = totalPoints <= 1 ? 12 : 12 + (index / (totalPoints - 1)) * (height - 36);
  return { x, y };
}

export default function DiskChart({ steps = [], diskSize = 200, currentStep = 0 }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Run a simulation to visualize disk head movement.
          </p>
        </div>
      </div>
    );
  }

  const visibleSteps = steps.slice(0, Math.min(currentStep + 1, steps.length));
  const chartHeight = 320;
  const maxX = Math.max(1, diskSize - 1);

  // Generate grid lines
  const gridLines = [0, 25, 50, 75, 100];
  const gridLabels = gridLines.map((pct) => Math.round((pct / 100) * maxX));

  // Build path
  const pathPoints = visibleSteps
    .map((step, index) => {
      const { x, y } = getPoint(step, index, maxX, chartHeight, visibleSteps.length);
      return `${x},${y}`;
    })
    .join(" ");

  // Current head position (last visible step)
  const lastStep = visibleSteps[visibleSteps.length - 1];

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Head Movement</h3>
        <div className="flex items-center gap-3">
          {lastStep && (
            <span className="text-[10px] font-mono text-accent">
              Head: {lastStep.position}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground font-mono">
            {visibleSteps.length}/{steps.length} steps
          </span>
        </div>
      </div>

      <div className="relative h-[340px] w-full rounded-lg bg-secondary/30 border border-border/50 p-4">
        <svg viewBox={`0 0 100 ${chartHeight}`} className="h-full w-full overflow-visible">
          {/* Grid lines */}
          {gridLines.map((x) => (
            <line
              key={x}
              x1={x}
              y1={8}
              x2={x}
              y2={chartHeight - 20}
              stroke="hsl(var(--border))"
              strokeDasharray="1.5 2.5"
              strokeOpacity="0.5"
            />
          ))}

          {/* Path line with gradient */}
          {visibleSteps.length > 1 && (
            <>
              {/* Shadow line */}
              <polyline
                points={pathPoints}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.2"
                strokeOpacity="0.15"
                strokeLinejoin="round"
              />
              {/* Main line */}
              <motion.polyline
                points={pathPoints}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.7"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            </>
          )}

          {/* Data points */}
          {visibleSteps.map((step, index) => {
            const { x, y } = getPoint(step, index, maxX, chartHeight, visibleSteps.length);
            const isFirst = index === 0;
            const isLast = index === visibleSteps.length - 1;

            return (
              <g key={`${step.step}-${step.position}`}>
                {/* Glow for current position */}
                {isLast && (
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="hsl(var(--accent))"
                    opacity="0.3"
                  />
                )}
                {/* Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isFirst || isLast ? "1.4" : "0.9"}
                  fill={isFirst ? "hsl(var(--primary))" : isLast ? "hsl(var(--accent))" : "hsl(var(--accent))"}
                  stroke={isFirst || isLast ? "hsl(var(--background))" : "none"}
                  strokeWidth="0.3"
                />
                {/* Label */}
                <text
                  x={x + (x > 85 ? -1.5 : 1.5)}
                  y={y - 1.8}
                  fontSize="2.4"
                  fill={isFirst ? "hsl(var(--primary))" : isLast ? "hsl(var(--accent))" : "hsl(var(--foreground))"}
                  fontWeight={isFirst || isLast ? "bold" : "normal"}
                  textAnchor={x > 85 ? "end" : "start"}
                  opacity="0.85"
                >
                  {step.position}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom axis labels */}
        <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[9px] text-muted-foreground font-mono">
          {gridLabels.map((val, i) => (
            <span key={i}>{val}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
