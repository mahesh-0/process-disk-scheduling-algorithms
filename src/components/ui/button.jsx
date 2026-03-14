import React from "react";

const VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  ghost: "bg-transparent hover:bg-secondary text-foreground",
  outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
};

const SIZE_CLASSES = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  icon: "h-9 w-9 p-0",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.default,
        SIZE_CLASSES[size] || SIZE_CLASSES.default,
        className,
      )}
      {...props}
    />
  );
});
