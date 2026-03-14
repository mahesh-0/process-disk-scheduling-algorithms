// CPU Scheduling Algorithm Implementations

export function runFCFS(processes) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
  const timeline = [];
  let currentTime = 0;
  const results = sorted.map((p) => ({
    ...p,
    start: 0,
    end: 0,
    waiting: 0,
    turnaround: 0,
    response: 0,
    completed: false,
  }));

  for (const proc of results) {
    if (currentTime < proc.arrival) {
      timeline.push({ pid: "idle", start: currentTime, end: proc.arrival });
      currentTime = proc.arrival;
    }
    proc.start = currentTime;
    proc.response = currentTime - proc.arrival;
    timeline.push({
      pid: proc.pid,
      start: currentTime,
      end: currentTime + proc.burst,
    });
    currentTime += proc.burst;
    proc.end = currentTime;
    proc.waiting = proc.start - proc.arrival;
    proc.turnaround = proc.end - proc.arrival;
    proc.completed = true;
  }

  return {
    timeline,
    results,
    contextSwitches: Math.max(
      0,
      timeline.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

export function runRoundRobin(processes, quantum) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    firstRun: -1,
  }));
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
  const timeline = [];
  const queue = [];
  let currentTime = 0;
  let completed = 0;
  const n = sorted.length;
  let idx = 0;

  // Add initially arrived processes
  while (idx < n && sorted[idx].arrival <= currentTime) {
    queue.push(sorted[idx]);
    idx++;
  }

  while (completed < n) {
    if (queue.length === 0) {
      if (idx < n) {
        timeline.push({
          pid: "idle",
          start: currentTime,
          end: sorted[idx].arrival,
        });
        currentTime = sorted[idx].arrival;
        while (idx < n && sorted[idx].arrival <= currentTime) {
          queue.push(sorted[idx]);
          idx++;
        }
      }
      continue;
    }

    const proc = queue.shift();
    if (proc.firstRun === -1) proc.firstRun = currentTime;

    const execTime = Math.min(quantum, proc.remaining);
    timeline.push({
      pid: proc.pid,
      start: currentTime,
      end: currentTime + execTime,
    });
    currentTime += execTime;
    proc.remaining -= execTime;

    // Add newly arrived processes before re-adding current
    while (idx < n && sorted[idx].arrival <= currentTime) {
      queue.push(sorted[idx]);
      idx++;
    }

    if (proc.remaining > 0) {
      queue.push(proc);
    } else {
      proc.end = currentTime;
      completed++;
    }
  }

  const results = sorted.map((p) => ({
    ...p,
    start: p.firstRun,
    end: p.end,
    waiting: p.end - p.arrival - p.burst,
    turnaround: p.end - p.arrival,
    response: p.firstRun - p.arrival,
    completed: true,
  }));

  return {
    timeline,
    results,
    contextSwitches: Math.max(
      0,
      timeline.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

export function runSJN(processes) {
  const procs = processes.map((p) => ({ ...p }));
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = procs.length;
  const done = new Set();
  const results = [];

  while (completed < n) {
    const available = procs.filter(
      (p) => p.arrival <= currentTime && !done.has(p.pid),
    );
    if (available.length === 0) {
      const next = procs
        .filter((p) => !done.has(p.pid))
        .sort((a, b) => a.arrival - b.arrival)[0];
      timeline.push({ pid: "idle", start: currentTime, end: next.arrival });
      currentTime = next.arrival;
      continue;
    }

    available.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
    const proc = available[0];
    const start = currentTime;
    timeline.push({ pid: proc.pid, start, end: start + proc.burst });
    currentTime = start + proc.burst;
    done.add(proc.pid);
    completed++;
    results.push({
      ...proc,
      start,
      end: currentTime,
      waiting: start - proc.arrival,
      turnaround: currentTime - proc.arrival,
      response: start - proc.arrival,
      completed: true,
    });
  }

  return {
    timeline,
    results,
    contextSwitches: Math.max(
      0,
      timeline.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

export function runSRTN(processes) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    firstRun: -1,
    end: 0,
  }));
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = procs.length;
  const maxTime =
    Math.max(...procs.map((p) => p.arrival)) +
    procs.reduce((s, p) => s + p.burst, 0) +
    10;

  while (completed < n && currentTime < maxTime) {
    const available = procs.filter(
      (p) => p.arrival <= currentTime && p.remaining > 0,
    );
    if (available.length === 0) {
      const next = procs
        .filter((p) => p.remaining > 0)
        .sort((a, b) => a.arrival - b.arrival)[0];
      if (!next) break;
      timeline.push({ pid: "idle", start: currentTime, end: next.arrival });
      currentTime = next.arrival;
      continue;
    }

    available.sort(
      (a, b) => a.remaining - b.remaining || a.arrival - b.arrival,
    );
    const proc = available[0];
    if (proc.firstRun === -1) proc.firstRun = currentTime;

    // Find when next process arrives or current finishes
    const nextArrival =
      procs
        .filter((p) => p.arrival > currentTime && p.remaining > 0)
        .sort((a, b) => a.arrival - b.arrival)[0]?.arrival || Infinity;
    const runUntil = Math.min(currentTime + proc.remaining, nextArrival);

    timeline.push({ pid: proc.pid, start: currentTime, end: runUntil });
    proc.remaining -= runUntil - currentTime;
    currentTime = runUntil;

    if (proc.remaining === 0) {
      proc.end = currentTime;
      completed++;
    }
  }

  // Merge adjacent same-pid timeline entries
  const merged = mergeTimeline(timeline);

  const results = procs.map((p) => ({
    ...p,
    start: p.firstRun,
    end: p.end,
    waiting: p.end - p.arrival - p.burst,
    turnaround: p.end - p.arrival,
    response: p.firstRun - p.arrival,
    completed: true,
  }));

  return {
    timeline: merged,
    results,
    contextSwitches: Math.max(
      0,
      merged.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

export function runPriority(processes, preemptive = false) {
  if (!preemptive) {
    return runPriorityNonPreemptive(processes);
  }
  return runPriorityPreemptive(processes);
}

function runPriorityNonPreemptive(processes) {
  const procs = processes.map((p) => ({ ...p }));
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = procs.length;
  const done = new Set();
  const results = [];

  while (completed < n) {
    const available = procs.filter(
      (p) => p.arrival <= currentTime && !done.has(p.pid),
    );
    if (available.length === 0) {
      const next = procs
        .filter((p) => !done.has(p.pid))
        .sort((a, b) => a.arrival - b.arrival)[0];
      timeline.push({ pid: "idle", start: currentTime, end: next.arrival });
      currentTime = next.arrival;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
    const proc = available[0];
    const start = currentTime;
    timeline.push({ pid: proc.pid, start, end: start + proc.burst });
    currentTime = start + proc.burst;
    done.add(proc.pid);
    completed++;
    results.push({
      ...proc,
      start,
      end: currentTime,
      waiting: start - proc.arrival,
      turnaround: currentTime - proc.arrival,
      response: start - proc.arrival,
      completed: true,
    });
  }

  return {
    timeline,
    results,
    contextSwitches: Math.max(
      0,
      timeline.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

function runPriorityPreemptive(processes) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    firstRun: -1,
    end: 0,
  }));
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = procs.length;
  const maxTime =
    Math.max(...procs.map((p) => p.arrival)) +
    procs.reduce((s, p) => s + p.burst, 0) +
    10;

  while (completed < n && currentTime < maxTime) {
    const available = procs.filter(
      (p) => p.arrival <= currentTime && p.remaining > 0,
    );
    if (available.length === 0) {
      const next = procs
        .filter((p) => p.remaining > 0)
        .sort((a, b) => a.arrival - b.arrival)[0];
      if (!next) break;
      timeline.push({ pid: "idle", start: currentTime, end: next.arrival });
      currentTime = next.arrival;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
    const proc = available[0];
    if (proc.firstRun === -1) proc.firstRun = currentTime;

    const nextArrival =
      procs
        .filter((p) => p.arrival > currentTime && p.remaining > 0)
        .sort((a, b) => a.arrival - b.arrival)[0]?.arrival || Infinity;
    const runUntil = Math.min(currentTime + proc.remaining, nextArrival);

    timeline.push({ pid: proc.pid, start: currentTime, end: runUntil });
    proc.remaining -= runUntil - currentTime;
    currentTime = runUntil;

    if (proc.remaining === 0) {
      proc.end = currentTime;
      completed++;
    }
  }

  const merged = mergeTimeline(timeline);
  const results = procs.map((p) => ({
    ...p,
    start: p.firstRun,
    end: p.end,
    waiting: p.end - p.arrival - p.burst,
    turnaround: p.end - p.arrival,
    response: p.firstRun - p.arrival,
    completed: true,
  }));

  return {
    timeline: merged,
    results,
    contextSwitches: Math.max(
      0,
      merged.filter((t) => t.pid !== "idle").length - 1,
    ),
  };
}

function mergeTimeline(timeline) {
  if (timeline.length === 0) return [];
  const merged = [{ ...timeline[0] }];
  for (let i = 1; i < timeline.length; i++) {
    const last = merged[merged.length - 1];
    if (timeline[i].pid === last.pid) {
      last.end = timeline[i].end;
    } else {
      merged.push({ ...timeline[i] });
    }
  }
  return merged;
}

export function computeCPUMetrics(results, timeline) {
  const n = results.length;
  const avgWaiting = results.reduce((s, r) => s + r.waiting, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaround, 0) / n;
  const avgResponse = results.reduce((s, r) => s + r.response, 0) / n;
  const totalTime = Math.max(...timeline.map((t) => t.end));
  const idleTime = timeline
    .filter((t) => t.pid === "idle")
    .reduce((s, t) => s + (t.end - t.start), 0);
  const cpuUtilization = ((totalTime - idleTime) / totalTime) * 100;

  return { avgWaiting, avgTurnaround, avgResponse, cpuUtilization, totalTime };
}

export const CPU_ALGORITHMS = {
  fcfs: { name: "FCFS", run: runFCFS },
  rr: { name: "Round Robin", run: (p, q) => runRoundRobin(p, q) },
  sjn: { name: "SJN", run: runSJN },
  srtn: { name: "SRTN", run: runSRTN },
  priority: {
    name: "Priority (Non-Preemptive)",
    run: (p) => runPriority(p, false),
  },
  priority_p: {
    name: "Priority (Preemptive)",
    run: (p) => runPriority(p, true),
  },
};
