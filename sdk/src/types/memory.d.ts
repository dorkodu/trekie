export interface IMemory {
  id: string;
  userId: string;
  date: number;
  description: string;
  favourites: number;
  favourited?: boolean;
}