import { PermissionInfo } from '@/commons/data';
import { EventFeed } from "@/commons/events";
import { DataStore } from "./datastore";
import { User } from '@/commons/identity';

export class Pod implements PodInterface {
  public user: User;
  public context: Record<string, any>;
  public store: DataStore;
  public feed: EventFeed;

  constructor({ user, context = {}, feed, store }: PodInterface) {
    this.user = user;
    this.context = context;
    this.store = store;
    this.feed = feed;
  }
}

export interface PodInterface {
  user: User;
  context: Record<string, any>;
  store: DataStore;
  feed: EventFeed;
}