import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import AlgorithmCard from "../components/guide/AlgorithmCard";
import { CPU_GUIDE, DISK_GUIDE } from "../components/guide/algorithmData";

export default function AlgorithmGuide() {
  const [tab, setTab] = useState("cpu");

  const algorithms = tab === "cpu" ? CPU_GUIDE : DISK_GUIDE;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Algorithm Guide</h1>
          <p className="text-xs text-muted-foreground">
            Comprehensive explanations of scheduling algorithms
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="cpu">CPU Scheduling</TabsTrigger>
          <TabsTrigger value="disk">Disk Scheduling</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {algorithms.map((algo, i) => (
          <motion.div
            key={algo.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <AlgorithmCard algo={algo} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
