import { EventId } from "./events";
import { IUser } from "./user";

export interface IEvent<T> {
  id: EventId;
  timestamp: number;
  data: T;
}

export interface IEventData<T> {
  onCreate: (data: T) => IEvent<T>;
  onTrigger: (user: IUser, event: IEvent<T>) => void;
}