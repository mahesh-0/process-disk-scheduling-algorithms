import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Table = React.forwardRef(function Table(
  { className, ...props },
  ref,
) {
  return (
    <table
      ref={ref}
      className={cx("w-full caption-bottom text-sm", className)}
      {...props}
    />
  );
});

export const TableHeader = React.forwardRef(function TableHeader(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={cx("[&_tr]:border-b", className)} {...props} />;
});

export const TableBody = React.forwardRef(function TableBody(
  { className, ...props },
  ref,
) {
  return (
    <tbody
      ref={ref}
      className={cx("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});

export const TableRow = React.forwardRef(function TableRow(
  { className, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={cx("border-b border-border transition-colors hover:bg-secondary/30", className)}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef(function TableHead(
  { className, ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      className={cx("h-10 px-2 text-left align-middle font-medium text-muted-foreground", className)}
      {...props}
    />
  );
});

export const TableCell = React.forwardRef(function TableCell(
  { className, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cx("p-2 align-middle", className)}
      {...props}
    />
  );
});
