import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

export default function ResultsTable({ results, showPriority = false }) {
  if (!results || results.length === 0) return null;

  // Find best (min) and worst (max) for highlighting
  const minWaiting = Math.min(...results.map((r) => r.waiting));
  const maxWaiting = Math.max(...results.map((r) => r.waiting));
  const minTurnaround = Math.min(...results.map((r) => r.turnaround));
  const maxTurnaround = Math.max(...results.map((r) => r.turnaround));

  const getBadge = (value, min, max) => {
    if (results.length < 2 || min === max) return null;
    if (value === min) return <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-green-500/15 text-green-400">Best</span>;
    if (value === max) return <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-red-500/15 text-red-400">Worst</span>;
    return null;
  };

  return (
    <div className="glass rounded-xl p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-foreground mb-3">Results</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-xs">PID</TableHead>
            <TableHead className="text-xs">Arrival</TableHead>
            <TableHead className="text-xs">Burst</TableHead>
            {showPriority && (
              <TableHead className="text-xs">Priority</TableHead>
            )}
            <TableHead className="text-xs">Waiting</TableHead>
            <TableHead className="text-xs">Turnaround</TableHead>
            <TableHead className="text-xs">Response</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r, i) => (
            <motion.tr
              key={r.pid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-border"
            >
              <TableCell className="text-xs font-mono font-semibold">
                {r.pid}
              </TableCell>
              <TableCell className="text-xs font-mono">{r.arrival}</TableCell>
              <TableCell className="text-xs font-mono">{r.burst}</TableCell>
              {showPriority && (
                <TableCell className="text-xs font-mono">
                  {r.priority}
                </TableCell>
              )}
              <TableCell className="text-xs font-mono text-primary">
                {r.waiting}ms{getBadge(r.waiting, minWaiting, maxWaiting)}
              </TableCell>
              <TableCell className="text-xs font-mono text-accent">
                {r.turnaround}ms{getBadge(r.turnaround, minTurnaround, maxTurnaround)}
              </TableCell>
              <TableCell className="text-xs font-mono text-chart-3">
                {r.response}ms
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
