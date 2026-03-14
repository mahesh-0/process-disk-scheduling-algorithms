import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Shuffle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_PROCESSES = [
  { pid: "P1", arrival: 0, burst: 8, priority: 2 },
  { pid: "P2", arrival: 1, burst: 4, priority: 1 },
  { pid: "P3", arrival: 2, burst: 9, priority: 3 },
  { pid: "P4", arrival: 3, burst: 5, priority: 4 },
];

export default function ProcessInput({
  processes,
  setProcesses,
  showPriority = false,
}) {
  const addProcess = () => {
    const num = processes.length + 1;
    setProcesses([
      ...processes,
      { pid: `P${num}`, arrival: 0, burst: 1, priority: 1 },
    ]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    updated[index] = {
      ...updated[index],
      [field]: field === "pid" ? value : Math.max(0, parseInt(value) || 0),
    };
    setProcesses(updated);
  };

  const generateRandom = () => {
    const count = Math.floor(Math.random() * 4) + 3;
    const procs = Array.from({ length: count }, (_, i) => ({
      pid: `P${i + 1}`,
      arrival: Math.floor(Math.random() * 8),
      burst: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    }));
    setProcesses(procs);
  };

  const reset = () => setProcesses(DEFAULT_PROCESSES);

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Process Details
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={generateRandom}
            className="h-7 text-xs gap-1"
          >
            <Shuffle className="w-3 h-3" /> Random
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={reset}
            className="h-7 text-xs gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="pb-2 text-left font-medium px-2">PID</th>
              <th className="pb-2 text-left font-medium px-2">Arrival</th>
              <th className="pb-2 text-left font-medium px-2">Burst</th>
              {showPriority && (
                <th className="pb-2 text-left font-medium px-2">Priority</th>
              )}
              <th className="pb-2 w-8" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {processes.map((proc, i) => (
                <motion.tr
                  key={proc.pid + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="border-b border-border/50"
                >
                  <td className="py-1.5 px-2">
                    <Input
                      value={proc.pid}
                      onChange={(e) => updateProcess(i, "pid", e.target.value)}
                      className="h-7 w-16 text-xs font-mono bg-secondary border-none"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={proc.arrival}
                      onChange={(e) =>
                        updateProcess(i, "arrival", e.target.value)
                      }
                      className="h-7 w-16 text-xs font-mono bg-secondary border-none"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={1}
                      value={proc.burst}
                      onChange={(e) =>
                        updateProcess(i, "burst", e.target.value)
                      }
                      className="h-7 w-16 text-xs font-mono bg-secondary border-none"
                    />
                  </td>
                  {showPriority && (
                    <td className="py-1.5 px-2">
                      <Input
                        type="number"
                        min={1}
                        value={proc.priority}
                        onChange={(e) =>
                          updateProcess(i, "priority", e.target.value)
                        }
                        className="h-7 w-16 text-xs font-mono bg-secondary border-none"
                      />
                    </td>
                  )}
                  <td className="py-1.5 px-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeProcess(i)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      disabled={processes.length <= 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={addProcess}
        className="mt-3 h-7 text-xs gap-1 w-full border-dashed"
      >
        <Plus className="w-3 h-3" /> Add Process
      </Button>
    </div>
  );
}

export { DEFAULT_PROCESSES };
