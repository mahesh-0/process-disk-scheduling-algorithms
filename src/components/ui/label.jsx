import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Label = React.forwardRef(function Label(
  { className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cx("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
});
