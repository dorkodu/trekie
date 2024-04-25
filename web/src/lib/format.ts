export function percentage(percentage: number) {
  return Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 0 }).format(percentage / 100);
}

export * as format from "./format";