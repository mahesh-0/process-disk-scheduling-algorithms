import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, Zap } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-6xl font-bold gradient-text mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          This page doesn't exist in the simulation.
        </p>
        <Link to={createPageUrl("Dashboard")}>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Home className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
