import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shuffle, RotateCcw } from "lucide-react";

const DEFAULT_DISK = {
  diskSize: 200,
  head: 53,
  requests: [98, 183, 37, 122, 14, 124, 65, 67],
};

export default function DiskInput({
  diskSize,
  setDiskSize,
  head,
  setHead,
  requests,
  setRequests,
}) {
  const generateRandom = () => {
    const size = diskSize || 200;
    const count = Math.floor(Math.random() * 6) + 4;
    const reqs = Array.from({ length: count }, () =>
      Math.floor(Math.random() * size),
    );
    setRequests(reqs);
    setHead(Math.floor(Math.random() * size));
  };

  const reset = () => {
    setDiskSize(DEFAULT_DISK.diskSize);
    setHead(DEFAULT_DISK.head);
    setRequests(DEFAULT_DISK.requests);
  };

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Disk Parameters
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="text-xs text-muted-foreground">Disk Size</Label>
          <Input
            type="number"
            min={1}
            value={diskSize}
            onChange={(e) =>
              setDiskSize(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="h-8 text-xs font-mono bg-secondary border-none mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Initial Head</Label>
          <Input
            type="number"
            min={0}
            max={diskSize - 1}
            value={head}
            onChange={(e) =>
              setHead(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="h-8 text-xs font-mono bg-secondary border-none mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Request Queue (comma separated)
        </Label>
        <Input
          value={requests.join(", ")}
          onChange={(e) => {
            const vals = e.target.value
              .split(",")
              .map((v) => parseInt(v.trim()))
              .filter((v) => !isNaN(v) && v >= 0);
            setRequests(vals);
          }}
          placeholder="98, 183, 37, 122, 14, 124, 65, 67"
          className="h-8 text-xs font-mono bg-secondary border-none mt-1"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          {requests.length} requests
        </p>
      </div>
    </div>
  );
}

export { DEFAULT_DISK };
