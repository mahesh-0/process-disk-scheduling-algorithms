import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, RotateCcw, Download } from "lucide-react";

export default function SimControls({
  onRun,
  onStep,
  onReset,
  onExport,
  isRunning,
  speed,
  setSpeed,
  hasResults,
  isPlaying,
  onPlayPause,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={onRun}
        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-9 text-sm font-medium glow-primary"
      >
        <Play className="w-3.5 h-3.5" fill="currentColor" /> Run Simulation
      </Button>

      {hasResults && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={onPlayPause}
            className="h-9 gap-1.5"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onStep}
            className="h-9 gap-1.5"
          >
            <SkipForward className="w-3.5 h-3.5" /> Step
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={onReset}
        className="h-9 gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </Button>

      {hasResults && onExport && (
        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          className="h-9 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground">Speed</span>
        <Slider
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
          min={0.25}
          max={3}
          step={0.25}
          className="w-24"
        />
        <span className="text-xs font-mono text-muted-foreground w-8">
          {speed}x
        </span>
      </div>
    </div>
  );
}
