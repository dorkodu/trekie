import { useApiStore } from "@/stores/apiStore";

export const refreshDailyStats = () => {
  const task = () => {
    useApiStore.getState().updateStats();
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const timeout = setTimeout(task, tomorrow.getTime() - today.getTime());
  const interval = setInterval(task, 24 * 60 * 60 * 1000);
  () => {
    clearTimeout(timeout);
    clearTimeout(interval);
  };
};
