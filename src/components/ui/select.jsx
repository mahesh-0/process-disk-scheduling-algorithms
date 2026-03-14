import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SelectContext = createContext(null);

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const registerOption = (optionValue, label) => {
    setOptions((prev) => (prev[optionValue] === label ? prev : { ...prev, [optionValue]: label }));
  };

  const contextValue = useMemo(
    () => ({
      value,
      onValueChange,
      open,
      setOpen,
      options,
      registerOption,
    }),
    [value, onValueChange, open, options],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const context = useContext(SelectContext);

  return (
    <button
      type="button"
      className={cx(
        "flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground",
        className,
      )}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      <span className="truncate">{children}</span>
      <span className="ml-2 text-xs text-muted-foreground">▾</span>
    </button>
  );
}

export function SelectValue({ placeholder = "Select..." }) {
  const context = useContext(SelectContext);
  const label = context?.options?.[context?.value] || context?.value || placeholder;
  return <span>{label}</span>;
}

export function SelectContent({ className, children, ...props }) {
  const context = useContext(SelectContext);

  return (
    <div
      className={cx(
        "absolute z-50 mt-1 w-full rounded-lg border border-border bg-card p-1 shadow-lg",
        !context?.open && "hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ className, value, children, ...props }) {
  const context = useContext(SelectContext);
  const label = typeof children === "string" ? children : String(value);

  useEffect(() => {
    context?.registerOption(value, label);
  }, [context, value, label]);

  return (
    <button
      type="button"
      className={cx(
        "flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm text-foreground hover:bg-secondary",
        context?.value === value && "bg-secondary",
        className,
      )}
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
