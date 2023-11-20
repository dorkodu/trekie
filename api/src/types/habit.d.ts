export interface IHabit {
  id: string;
  userId: string;
  date: number;
  title: string;
  description: string;
  count: number;
  heatmap?: number[];
}