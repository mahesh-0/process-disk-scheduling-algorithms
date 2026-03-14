// Disk Scheduling Algorithm Implementations

export function runDiskFCFS(requests, head, diskSize) {
  const sequence = [head, ...requests];
  let totalMovement = 0;
  const steps = [{ position: head, step: 0, label: head }];

  for (let i = 1; i < sequence.length; i++) {
    totalMovement += Math.abs(sequence[i] - sequence[i - 1]);
    steps.push({ position: sequence[i], step: i, label: sequence[i] });
  }

  return {
    sequence: sequence.slice(1),
    totalMovement,
    avgSeekTime: totalMovement / requests.length,
    steps,
  };
}

export function runSCAN(requests, head, diskSize) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  // Move right first, then left
  const sequence = [...right, diskSize - 1, ...left.reverse()];
  const fullSeq = [head, ...sequence];
  let totalMovement = 0;
  const steps = [{ position: head, step: 0, label: head }];

  for (let i = 1; i < fullSeq.length; i++) {
    totalMovement += Math.abs(fullSeq[i] - fullSeq[i - 1]);
    steps.push({
      position: fullSeq[i],
      step: i,
      label: fullSeq[i] === diskSize - 1 ? `${fullSeq[i]} (End)` : fullSeq[i],
    });
  }

  return {
    sequence,
    totalMovement,
    avgSeekTime: totalMovement / requests.length,
    steps,
  };
}

export function runCSCAN(requests, head, diskSize) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  // Move right, go to end, jump to 0, then continue right
  const sequence = [...right, diskSize - 1, 0, ...left];
  const fullSeq = [head, ...sequence];
  let totalMovement = 0;
  const steps = [{ position: head, step: 0, label: head }];

  for (let i = 1; i < fullSeq.length; i++) {
    totalMovement += Math.abs(fullSeq[i] - fullSeq[i - 1]);
    steps.push({
      position: fullSeq[i],
      step: i,
      label:
        fullSeq[i] === diskSize - 1
          ? `${fullSeq[i]} (End)`
          : fullSeq[i] === 0
            ? "0 (Start)"
            : fullSeq[i],
    });
  }

  return {
    sequence,
    totalMovement,
    avgSeekTime: totalMovement / requests.length,
    steps,
  };
}

export function runLOOK(requests, head) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  const sequence = [...right, ...left.reverse()];
  const fullSeq = [head, ...sequence];
  let totalMovement = 0;
  const steps = [{ position: head, step: 0, label: head }];

  for (let i = 1; i < fullSeq.length; i++) {
    totalMovement += Math.abs(fullSeq[i] - fullSeq[i - 1]);
    steps.push({ position: fullSeq[i], step: i, label: fullSeq[i] });
  }

  return {
    sequence,
    totalMovement,
    avgSeekTime: totalMovement / requests.length,
    steps,
  };
}

export function runCLOOK(requests, head) {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  const sequence = [...right, ...left];
  const fullSeq = [head, ...sequence];
  let totalMovement = 0;
  const steps = [{ position: head, step: 0, label: head }];

  for (let i = 1; i < fullSeq.length; i++) {
    totalMovement += Math.abs(fullSeq[i] - fullSeq[i - 1]);
    steps.push({ position: fullSeq[i], step: i, label: fullSeq[i] });
  }

  return {
    sequence,
    totalMovement,
    avgSeekTime: totalMovement / requests.length,
    steps,
  };
}

export const DISK_ALGORITHMS = {
  fcfs: { name: "FCFS", run: (r, h, d) => runDiskFCFS(r, h, d) },
  scan: { name: "SCAN", run: (r, h, d) => runSCAN(r, h, d) },
  cscan: { name: "C-SCAN", run: (r, h, d) => runCSCAN(r, h, d) },
  look: { name: "LOOK", run: (r, h) => runLOOK(r, h) },
  clook: { name: "C-LOOK", run: (r, h) => runCLOOK(r, h) },
};
