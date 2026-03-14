import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Cpu,
  HardDrive,
  BookOpen,
  GitCompare,
  History,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "CPU Scheduling",
    desc: "Simulate FCFS, Round Robin, SJN, SRTN, and Priority scheduling with interactive Gantt charts.",
    icon: Cpu,
    page: "CpuScheduling",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Disk Scheduling",
    desc: "Visualize FCFS, SCAN, C-SCAN, LOOK, and C-LOOK disk head movement patterns.",
    icon: HardDrive,
    page: "DiskScheduling",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    title: "Algorithm Guide",
    desc: "Deep dive into each algorithm with explanations, complexity analysis, and real-world usage.",
    icon: BookOpen,
    page: "AlgorithmGuide",
    gradient: "from-chart-3/20 to-chart-3/5",
    iconColor: "text-chart-3",
  },
  {
    title: "Compare Algorithms",
    desc: "Run multiple algorithms side-by-side and compare performance metrics visually.",
    icon: GitCompare,
    page: "CompareAlgorithms",
    gradient: "from-chart-4/20 to-chart-4/5",
    iconColor: "text-chart-4",
  },
  {
    title: "Simulation History",
    desc: "Review and analyze your past simulations with saved inputs and results.",
    icon: History,
    page: "SimHistory",
    gradient: "from-chart-5/20 to-chart-5/5",
    iconColor: "text-chart-5",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 md:py-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            OS Scheduling Visualizer
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">AlgoSIM</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Interactive CPU and Disk scheduling algorithm simulator with real-time
          visualizations, step-by-step execution, and performance comparison
          tools.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Link to={createPageUrl("CpuScheduling")}>
            <Button className="bg-primary hover:bg-primary/90 gap-2 glow-primary">
              <Cpu className="w-4 h-4" /> CPU Scheduling
            </Button>
          </Link>
          <Link to={createPageUrl("DiskScheduling")}>
            <Button variant="outline" className="gap-2">
              <HardDrive className="w-4 h-4" /> Disk Scheduling
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={createPageUrl(f.page)}>
              <div
                className={`glass glass-hover rounded-xl p-6 h-full bg-gradient-to-br ${f.gradient} group cursor-pointer transition-all duration-300`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center mb-4`}
                >
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {f.desc}
                </p>
                <div className="flex items-center text-xs text-primary font-medium group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 glass rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
      >
        {[
          { label: "CPU Algorithms", value: "6" },
          { label: "Disk Algorithms", value: "5" },
          { label: "Visualization Types", value: "3" },
          { label: "Comparison Tools", value: "2" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
