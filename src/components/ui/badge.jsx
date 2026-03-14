import React from "react";

const VARIANT_CLASSES = {
  default: "bg-primary/15 text-primary border border-primary/30",
  outline: "border border-border bg-transparent text-muted-foreground",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.default,
        className,
      )}
      {...props}
    />
  );
}
