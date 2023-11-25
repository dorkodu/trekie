import { useApiStore } from "@/stores/apiStore";
import { useEffect } from "react";

export const useRefreshStatsDaily = () => {
  useEffect(() => {
    const task = () => {
      useApiStore.getState().updateStats();
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const timeout = setTimeout(task, tomorrow.getTime() - today.getTime());
    const interval = setInterval(task, 24 * 60 * 60 * 1000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(interval);
    };
  }, []);
};
