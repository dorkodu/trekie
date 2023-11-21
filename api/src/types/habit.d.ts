export interface IHabit {
  id: string;
  userId: string;
  date: number;

  title: string;
  description: string;

  dailyTarget: number;
  count: number;

  heatmap: { [offset: number]: number };
}