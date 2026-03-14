import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MoveHorizontal, Gauge, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DiskChart from "../components/charts/DiskChart";
import MetricCard from "../components/simulator/MetricCard";
import DiskInput, { DEFAULT_DISK } from "../components/simulator/DiskInput";
import SimControls from "../components/simulator/SimControls";
import useSimPlayback from "../components/simulator/useSimPlayback";
import { DISK_ALGORITHMS } from "../components/algorithms/diskAlgorithms";

const chartTooltipStyle = {
  background: "hsl(222, 47%, 9%)",
  border: "1px solid hsl(222, 47%, 16%)",
  borderRadius: 8,
  fontSize: 11,
};

export default function DiskScheduling() {
  const [searchParams, setSearchParams] = useSearchParams();
  const algoFromUrl = searchParams.get("algo") || "fcfs";

  const [algorithm, setAlgorithm] = useState(algoFromUrl);
  const [diskSize, setDiskSize] = useState(DEFAULT_DISK.diskSize);
  const [head, setHead] = useState(DEFAULT_DISK.head);
  const [requests, setRequests] = useState(DEFAULT_DISK.requests);
  const [simResult, setSimResult] = useState(null);
  const [speed, setSpeed] = useState(1);

  const totalSteps = simResult?.steps?.length || 0;
  const {
    currentStep,
    isPlaying,
    step,
    reset: resetPlayback,
    togglePlayPause,
  } = useSimPlayback(totalSteps, speed);

  // Sync algorithm state when URL changes (sidebar navigation)
  useEffect(() => {
    const urlAlgo = searchParams.get("algo") || "fcfs";
    if (urlAlgo !== algorithm) {
      setAlgorithm(urlAlgo);
      setSimResult(null);
      resetPlayback();
    }
  }, [searchParams]);

  // When user changes algorithm via dropdown, also update URL
  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo);
    setSearchParams({ algo: newAlgo });
    setSimResult(null);
    resetPlayback();
  };

  const runSimulation = useCallback(() => {
    if (requests.length === 0) return;
    const algo = DISK_ALGORITHMS[algorithm];
    if (!algo) return;

    const result = algo.run(requests, head, diskSize);
    setSimResult(result);
  }, [algorithm, diskSize, head, requests]);

  const handleReset = () => {
    setSimResult(null);
    resetPlayback();
  };

  const exportCSV = () => {
    if (!simResult) return;
    const headers = "Step,Position,Movement\n";
    const rows = simResult.steps
      .map((s, i) => {
        const movement =
          i > 0 ? Math.abs(s.position - simResult.steps[i - 1].position) : 0;
        return `${s.step},${s.position},${movement}`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disk_${algorithm}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const algoName = DISK_ALGORITHMS[algorithm]?.name || algorithm;

  // Build per-step movement data for the bar chart
  const movementData = simResult
    ? simResult.steps.slice(1).map((s, i) => ({
        step: `Step ${i + 1}`,
        position: s.position,
        movement: Math.abs(s.position - simResult.steps[i].position),
      }))
    : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-foreground">
          DISK SCHEDULING
          <span className="text-muted-foreground font-normal ml-2 text-sm">
            ({algoName})
          </span>
        </h1>
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

      {/* Algorithm Selector */}
      <div className="w-48">
        <Label className="text-xs text-muted-foreground mb-1 block">
          Algorithm
        </Label>
        <Select value={algorithm} onValueChange={handleAlgorithmChange}>
          <SelectTrigger className="h-9 bg-secondary border-none text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DISK_ALGORITHMS).map(([key, val]) => (
              <SelectItem key={key} value={key}>
                {val.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <DiskChart
            steps={simResult?.steps}
            diskSize={diskSize}
            currentStep={currentStep}
          />

          {simResult && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard
                icon={MoveHorizontal}
                label="Total Head Movement"
                value={simResult.totalMovement}
                unit="Cylinders"
                color="primary"
                delay={0}
              />
              <MetricCard
                icon={Gauge}
                label="Avg Seek Time"
                value={simResult.avgSeekTime}
                unit="Cylinders"
                color="accent"
                delay={0.05}
              />
              <MetricCard
                icon={ArrowRight}
                label="Requests Served"
                value={requests.length}
                color="chart3"
                delay={0.1}
              />
            </div>
          )}

          {/* Seek Sequence */}
          {simResult && (
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Seek Sequence
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                  {head} (start)
                </span>
                {simResult.sequence.map((pos, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-secondary text-foreground">
                      {pos}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-Step Movement Bar Chart */}
          {simResult && movementData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Per-Step Seek Distance
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={movementData} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 14%)" />
                  <XAxis dataKey="step" stroke="hsl(215, 20%, 55%)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(215, 20%, 55%)" tick={{ fontSize: 10 }} unit=" cyl" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                    formatter={(value, name) => [
                      name === "movement" ? `${value} cylinders` : value,
                      name === "movement" ? "Seek Distance" : "Position",
                    ]}
                  />
                  <Bar dataKey="movement" name="Seek Distance" fill="hsl(250, 89%, 67%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Head Position Line Chart */}
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Head Position Over Time
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={simResult.steps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 14%)" />
                  <XAxis
                    dataKey="step"
                    stroke="hsl(215, 20%, 55%)"
                    tick={{ fontSize: 10 }}
                    label={{ value: "Step", position: "insideBottom", offset: -3, fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                  />
                  <YAxis
                    stroke="hsl(215, 20%, 55%)"
                    tick={{ fontSize: 10 }}
                    domain={[0, diskSize]}
                    label={{ value: "Cylinder", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(215, 20%, 55%)" }}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    labelStyle={{ color: "hsl(210, 40%, 96%)" }}
                    formatter={(value) => [`Cylinder ${value}`, "Position"]}
                    labelFormatter={(label) => `Step ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="position"
                    stroke="hsl(172, 66%, 50%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(172, 66%, 50%)", r: 3 }}
                    activeDot={{ r: 5, fill: "hsl(172, 66%, 60%)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
        <div>
          <DiskInput
            diskSize={diskSize}
            setDiskSize={setDiskSize}
            head={head}
            setHead={setHead}
            requests={requests}
            setRequests={setRequests}
          />
        </div>
      </div>
    </div>
  );
}
