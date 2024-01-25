import { IHabit } from "./events";

export interface IUser {
  id: string;
  name: string;

  habits: IHabit[];
}
