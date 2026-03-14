import React, { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GitCompare, Play } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CPU_ALGORITHMS,
  computeCPUMetrics,
} from "../components/algorithms/cpuAlgorithms";
import { DISK_ALGORITHMS } from "../components/algorithms/diskAlgorithms";
import ProcessInput, {
  DEFAULT_PROCESSES,
} from "../components/simulator/ProcessInput";
import DiskInput, { DEFAULT_DISK } from "../components/simulator/DiskInput";

export default function CompareAlgorithms() {
  const [mode, setMode] = useState("cpu");
  const [selectedAlgos, setSelectedAlgos] = useState(["fcfs", "rr", "sjn"]);
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [quantum, setQuantum] = useState(3);
  const [diskSize, setDiskSize] = useState(DEFAULT_DISK.diskSize);
  const [head, setHead] = useState(DEFAULT_DISK.head);
  const [requests, setRequests] = useState(DEFAULT_DISK.requests);
  const [comparisonResults, setComparisonResults] = useState(null);

  const algos = mode === "cpu" ? CPU_ALGORITHMS : DISK_ALGORITHMS;

  const toggleAlgo = (key) => {
    setSelectedAlgos((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const runComparison = () => {
    if (mode === "cpu") {
      const results = selectedAlgos
        .map((key) => {
          const algo = CPU_ALGORITHMS[key];
          if (!algo) return null;
          const result =
            key === "rr" ? algo.run(processes, quantum) : algo.run(processes);
          const metrics = computeCPUMetrics(result.results, result.timeline);
          return {
            name: algo.name,
            key,
            ...metrics,
            contextSwitches: result.contextSwitches,
          };
        })
        .filter(Boolean);
      setComparisonResults(results);
    } else {
      if (requests.length === 0) return;
      const results = selectedAlgos
        .map((key) => {
          const algo = DISK_ALGORITHMS[key];
          if (!algo) return null;
          const result = algo.run(requests, head, diskSize);
          return {
            name: algo.name,
            key,
            totalMovement: result.totalMovement,
            avgSeekTime: result.avgSeekTime,
          };
        })
        .filter(Boolean);
      setComparisonResults(results);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-4/20 to-primary/20 flex items-center justify-center">
          <GitCompare className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Compare Algorithms
          </h1>
          <p className="text-xs text-muted-foreground">
            Run multiple algorithms and compare performance
          </p>
        </div>
      </div>

      <Tabs
        value={mode}
        onValueChange={(v) => {
          setMode(v);
          setComparisonResults(null);
          setSelectedAlgos(
            v === "cpu" ? ["fcfs", "rr", "sjn"] : ["fcfs", "scan", "look"],
          );
        }}
      >
        <TabsList className="bg-secondary">
          <TabsTrigger value="cpu">CPU Scheduling</TabsTrigger>
          <TabsTrigger value="disk">Disk Scheduling</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Config */}
        <div className="space-y-4">
          {/* Algorithm Selection */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Select Algorithms
            </h3>
            <div className="space-y-2">
              {Object.entries(algos).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={selectedAlgos.includes(key)}
                    onCheckedChange={() => toggleAlgo(key)}
                  />
                  <Label htmlFor={key} className="text-xs cursor-pointer">
                    {val.name}
                  </Label>
                </div>
              ))}
            </div>
            {mode === "cpu" && selectedAlgos.includes("rr") && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">
                  RR Time Quantum
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={quantum}
                  onChange={(e) =>
                    setQuantum(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="h-8 text-xs mt-1 bg-secondary border-none font-mono"
                />
              </div>
            )}
          </div>

          {mode === "cpu" ? (
            <ProcessInput
              processes={processes}
              setProcesses={setProcesses}
              showPriority={
                selectedAlgos.includes("priority") ||
                selectedAlgos.includes("priority_p")
              }
            />
          ) : (
            <DiskInput
              diskSize={diskSize}
              setDiskSize={setDiskSize}
              head={head}
              setHead={setHead}
              requests={requests}
              setRequests={setRequests}
            />
          )}

          <Button
            onClick={runComparison}
            className="w-full bg-primary hover:bg-primary/90 gap-2"
            disabled={selectedAlgos.length < 2}
          >
            <Play className="w-4 h-4" fill="currentColor" /> Compare (
            {selectedAlgos.length} selected)
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {comparisonResults ? (
            <>
              {/* Chart */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Performance Comparison
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonResults}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(222, 47%, 14%)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(215, 20%, 55%)"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      stroke="hsl(215, 20%, 55%)"
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(222, 47%, 9%)",
                        border: "1px solid hsl(222, 47%, 16%)",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                      labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {mode === "cpu" ? (
                      <>
                        <Bar
                          dataKey="avgWaiting"
                          name="Avg Waiting"
                          fill="hsl(250, 89%, 67%)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="avgTurnaround"
                          name="Avg Turnaround"
                          fill="hsl(172, 66%, 50%)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="contextSwitches"
                          name="Context Switches"
                          fill="hsl(330, 80%, 60%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </>
                    ) : (
                      <>
                        <Bar
                          dataKey="totalMovement"
                          name="Total Movement"
                          fill="hsl(250, 89%, 67%)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="avgSeekTime"
                          name="Avg Seek Time"
                          fill="hsl(172, 66%, 50%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="glass rounded-xl p-5 overflow-x-auto">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Detailed Comparison
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs">Algorithm</TableHead>
                      {mode === "cpu" ? (
                        <>
                          <TableHead className="text-xs">Avg Waiting</TableHead>
                          <TableHead className="text-xs">
                            Avg Turnaround
                          </TableHead>
                          <TableHead className="text-xs">
                            Avg Response
                          </TableHead>
                          <TableHead className="text-xs">CPU Util.</TableHead>
                          <TableHead className="text-xs">
                            Ctx Switches
                          </TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-xs">
                            Total Movement
                          </TableHead>
                          <TableHead className="text-xs">
                            Avg Seek Time
                          </TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonResults.map((r, i) => (
                      <motion.tr
                        key={r.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-border"
                      >
                        <TableCell className="text-xs font-semibold">
                          {r.name}
                        </TableCell>
                        {mode === "cpu" ? (
                          <>
                            <TableCell className="text-xs font-mono text-primary">
                              {r.avgWaiting.toFixed(2)}ms
                            </TableCell>
                            <TableCell className="text-xs font-mono text-accent">
                              {r.avgTurnaround.toFixed(2)}ms
                            </TableCell>
                            <TableCell className="text-xs font-mono text-chart-3">
                              {r.avgResponse.toFixed(2)}ms
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {r.cpuUtilization.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {r.contextSwitches}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-xs font-mono text-primary">
                              {r.totalMovement} cyl
                            </TableCell>
                            <TableCell className="text-xs font-mono text-accent">
                              {r.avgSeekTime.toFixed(2)} cyl
                            </TableCell>
                          </>
                        )}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="glass rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <GitCompare className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Select algorithms and run comparison
              </h3>
              <p className="text-xs text-muted-foreground/60">
                Choose at least 2 algorithms and configure inputs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
