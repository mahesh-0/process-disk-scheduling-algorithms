import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Timer, ArrowLeftRight, Gauge } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import GanttChart from "../components/charts/GanttChart";
import MetricCard from "../components/simulator/MetricCard";
import ProcessInput, {
  DEFAULT_PROCESSES,
} from "../components/simulator/ProcessInput";
import SimControls from "../components/simulator/SimControls";
import ResultsTable from "../components/simulator/ResultsTable";
import useSimPlayback from "../components/simulator/useSimPlayback";
import {
  CPU_ALGORITHMS,
  computeCPUMetrics,
} from "../components/algorithms/cpuAlgorithms";
import { useAuth } from "@/context/AuthContext";
import { saveSimulationHistory } from "@/firebase/history";

const CHART_COLORS = [
  "hsl(250, 89%, 67%)",
  "hsl(172, 66%, 50%)",
  "hsl(330, 80%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 80%, 55%)",
  "hsl(280, 70%, 60%)",
];

const chartTooltipStyle = {
  background: "hsl(222, 47%, 9%)",
  border: "1px solid hsl(222, 47%, 16%)",
  borderRadius: 8,
  fontSize: 11,
};

export default function CpuScheduling() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const algoFromUrl = searchParams.get("algo") || "fcfs";

  const [algorithm, setAlgorithm] = useState(algoFromUrl);

  // Sync algorithm state when URL changes (sidebar navigation)
  useEffect(() => {
    const urlAlgo = searchParams.get("algo") || "fcfs";
    if (urlAlgo !== algorithm) {
      setAlgorithm(urlAlgo);
      // Reset simulation when switching algorithms via sidebar
      setSimResult(null);
      resetPlayback();
    }
  }, [searchParams]);
  const [quantum, setQuantum] = useState(3);
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [simResult, setSimResult] = useState(null);
  const [speed, setSpeed] = useState(1);

  const totalSteps = simResult?.timeline?.length || 0;
  const {
    currentStep,
    isPlaying,
    step,
    reset: resetPlayback,
    togglePlayPause,
  } = useSimPlayback(totalSteps, speed);

  const runSimulation = useCallback(async () => {
    const algo = CPU_ALGORITHMS[algorithm];
    if (!algo) return;

    let result;
    if (algorithm === "rr") {
      result = algo.run(processes, quantum);
    } else {
      result = algo.run(processes);
    }

    const metrics = computeCPUMetrics(result.results, result.timeline);
    const computedResult = { ...result, metrics };
    setSimResult(computedResult);

    // Save simulation snapshot for the signed-in user.
    saveSimulationHistory({
      userId: currentUser?.uid,
      simulationType: "cpu",
      algorithm: CPU_ALGORITHMS[algorithm]?.name || algorithm,
      inputData: {
        processes,
        quantum: algorithm === "rr" ? quantum : null,
      },
      results: computedResult.results,
      metrics: computedResult.metrics,
    }).catch((error) => {
      console.error("Failed to save CPU simulation history:", error);
    });
  }, [algorithm, currentUser?.uid, processes, quantum]);

  // When user changes algorithm via dropdown, also update URL
  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo);
    setSearchParams({ algo: newAlgo });
    setSimResult(null);
    resetPlayback();
  };

  const handleReset = () => {
    setSimResult(null);
    resetPlayback();
  };

  const exportCSV = () => {
    if (!simResult) return;
    const headers = "PID,Arrival,Burst,Waiting,Turnaround,Response\n";
    const rows = simResult.results
      .map(
        (r) =>
          `${r.pid},${r.arrival},${r.burst},${r.waiting},${r.turnaround},${r.response}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cpu_${algorithm}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const algoName = CPU_ALGORITHMS[algorithm]?.name || algorithm;
  const showPriority = algorithm === "priority" || algorithm === "priority_p";

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            CPU SCHEDULING
            <span className="text-muted-foreground font-normal ml-2 text-sm">
              ({algoName}
              {algorithm === "rr" ? ` - Time Quantum: ${quantum}ms` : ""})
            </span>
          </h1>
        </div>
        <SimControls
          onRun={runSimulation}
          onStep={step}
          onReset={handleReset}
          onExport={exportCSV}
          isRunning={false}
          speed={speed}
          setSpeed={setSpeed}
          hasResults={!!simResult}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
        />
      </div>

      {/* Config Row */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-48">
          <Label className="text-xs text-muted-foreground mb-1 block">
            Algorithm
          </Label>
          <Select value={algorithm} onValueChange={handleAlgorithmChange}>
            <SelectTrigger className="h-9 bg-secondary border-none text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CPU_ALGORITHMS).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {algorithm === "rr" && (
          <div className="w-32">
            <Label className="text-xs text-muted-foreground mb-1 block">
              Time Quantum
            </Label>
            <Input
              type="number"
              min={1}
              value={quantum}
              onChange={(e) =>
                setQuantum(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="h-9 bg-secondary border-none text-sm font-mono"
            />
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <GanttChart
            timeline={simResult?.timeline}
            currentStep={currentStep}
          />
          {simResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                icon={Clock}
                label="Avg Waiting Time"
                value={simResult.metrics.avgWaiting}
                unit="ms"
                color="primary"
                delay={0}
              />
              <MetricCard
                icon={Timer}
                label="Avg Turnaround"
                value={simResult.metrics.avgTurnaround}
                unit="ms"
                color="accent"
                delay={0.05}
              />
              <MetricCard
                icon={ArrowLeftRight}
                label="Context Switches"
                value={simResult.contextSwitches}
                color="chart3"
                delay={0.1}
              />
              <MetricCard
                icon={Gauge}
                label="CPU Utilization"
                value={simResult.metrics.cpuUtilization}
                unit="%"
                color="chart4"
                delay={0.15}
              />
            </div>
          )}
          <ResultsTable
            results={simResult?.results}
            showPriority={showPriority}
          />

          {/* Per-Process Metrics Bar Chart */}
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Per-Process Metrics
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={simResult.results} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 14%)" />
                  <XAxis dataKey="pid" stroke="hsl(215, 20%, 55%)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(215, 20%, 55%)" tick={{ fontSize: 10 }} unit="ms" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                    formatter={(value) => [`${value}ms`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="waiting" name="Waiting" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="turnaround" name="Turnaround" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="response" name="Response" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* CPU Utilization Pie Chart */}
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                CPU Utilization Breakdown
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Busy", value: parseFloat(simResult.metrics.cpuUtilization.toFixed(1)) },
                        { name: "Idle", value: parseFloat((100 - simResult.metrics.cpuUtilization).toFixed(1)) },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      <Cell fill="hsl(250, 89%, 67%)" />
                      <Cell fill="hsl(222, 47%, 20%)" />
                    </Pie>
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => [`${value}%`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>
        <div>
          <ProcessInput
            processes={processes}
            setProcesses={setProcesses}
            showPriority={showPriority}
          />
        </div>
      </div>
    </div>
  );
}
