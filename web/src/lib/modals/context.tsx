import { createContext, useContext } from "react";
import type { ModalsContextValue } from "./types";

const ModalsContext = createContext(defaultValue)<ModalsContextValue | null>(null);

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used within ModalsProvider");
  return ctx;
}

export default ModalsContext;
