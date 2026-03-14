import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Checkbox = React.forwardRef(function Checkbox(
  { className, checked = false, onCheckedChange, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className={cx(
        "h-4 w-4 rounded border border-border bg-background accent-[hsl(var(--primary))] focus:ring-2 focus:ring-primary/40",
        className,
      )}
      {...props}
    />
  );
});
