import React, { createContext, useContext, useMemo, useState } from "react";

const TabsContext = createContext(null);

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs({ value, defaultValue, onValueChange, className, children }) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const selectedValue = value !== undefined ? value : internalValue;

  const setValue = (nextValue) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const contextValue = useMemo(
    () => ({ value: selectedValue, onValueChange: setValue }),
    [selectedValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cx("inline-flex items-center rounded-lg p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, value, ...props }) {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cx(
        "rounded-md px-3 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
