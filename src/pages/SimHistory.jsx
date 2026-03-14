import React, { useCallback, useEffect, useState } from "react";
import { History, Cpu, HardDrive, Trash2, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  deleteSimulationHistory,
  fetchSimulationHistory,
} from "@/firebase/history";

function parseData(value) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default function SimHistory() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHistory = useCallback(
    async (isManualRefresh = false) => {
      if (!currentUser?.uid) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      if (isManualRefresh) setIsRefreshing(true);
      try {
        const data = await fetchSimulationHistory(currentUser.uid);
        setHistory(data.slice(0, 50));
      } catch (error) {
        console.error("Failed to load simulation history:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentUser?.uid],
  );

  useEffect(() => {
    setIsLoading(true);
    loadHistory();
  }, [loadHistory]);

  const deleteEntry = async (id) => {
    try {
      await deleteSimulationHistory(id);
      setHistory((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Failed to delete history entry:", error);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chart-5/20 to-primary/20 flex items-center justify-center">
            <History className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Simulation History
            </h1>
            <p className="text-xs text-muted-foreground">
              {history.length} saved simulations
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5"
          onClick={() => loadHistory(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 w-1/3 bg-secondary rounded mb-2" />
              <div className="h-3 w-2/3 bg-secondary rounded" />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            No simulations saved yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Run a CPU or Disk scheduling simulation to save and view it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((entry, i) => {
              const metrics = parseData(entry.metrics);
              const inputData = parseData(entry.input_data);

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl p-5 hover:border-border/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          entry.simulation_type === "cpu"
                            ? "bg-primary/10"
                            : "bg-accent/10"
                        }`}
                      >
                        {entry.simulation_type === "cpu" ? (
                          <Cpu className="w-4 h-4 text-primary" />
                        ) : (
                          <HardDrive className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {entry.algorithm}
                          </h3>
                          <Badge variant="outline" className="text-[10px]">
                            {entry.simulation_type === "cpu" ? "CPU" : "Disk"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(entry.created_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteEntry(entry.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {entry.simulation_type === "cpu" ? (
                      <>
                        {metrics.avgWaiting !== undefined && (
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            Avg Wait: {Number(metrics.avgWaiting).toFixed(2)}ms
                          </span>
                        )}
                        {metrics.avgTurnaround !== undefined && (
                          <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                            Avg Turnaround:{" "}
                            {Number(metrics.avgTurnaround).toFixed(2)}ms
                          </span>
                        )}
                        {metrics.cpuUtilization !== undefined && (
                          <span className="text-[10px] font-mono text-chart-4 bg-chart-4/10 px-2 py-0.5 rounded">
                            CPU: {Number(metrics.cpuUtilization).toFixed(1)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {metrics.totalMovement !== undefined && (
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            Movement: {metrics.totalMovement} cyl
                          </span>
                        )}
                        {metrics.avgSeekTime !== undefined && (
                          <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                            Avg Seek: {Number(metrics.avgSeekTime).toFixed(2)} cyl
                          </span>
                        )}
                      </>
                    )}
                    {inputData.processes && (
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {inputData.processes.length} processes
                      </span>
                    )}
                    {inputData.requests && (
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {inputData.requests.length} requests
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
