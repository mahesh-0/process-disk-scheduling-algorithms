import React from "react";
import { History } from "lucide-react";

export default function SimHistory() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="glass rounded-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Simulation History
        </h1>
        <p className="text-sm text-muted-foreground">
          Saved simulation history will appear here in a future update.
        </p>
      </div>
    </div>
  );
}
