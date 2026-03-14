import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Slider({
  className,
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) {
  const currentValue = Array.isArray(value) ? value[0] : value;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      className={cx("h-2 w-full cursor-pointer rounded-lg accent-[hsl(var(--primary))]", className)}
      {...props}
    />
  );
}
