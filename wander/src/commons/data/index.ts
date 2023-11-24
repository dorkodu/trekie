import { CID } from "@/commons/cid";
import { Event } from "@/commons/events";

export interface Document {
  meta: Record<string, any>;
  data: CID;
  parent?: CID;
  hash: string;
  kind: DocumentKind;
  owner: string; // public key
  timestamp: number;
  permissions: DocumentPermissions;
  event: Event
}

export enum DocumentKind {
  Blank = 0,
  Metadata = 2,
  Text = 1,
  User = 3,
  Event = 4,
  Index = 5,
  Report = 1984,
  ZapRequest = 9734,
  Zap = 9735,
  RelayList = 10002,
  ClientAuth = 22242,
  ProfileBadge = 30008,
  BadgeDefinition = 30009,
  Article = 30023,
}


export interface DocumentPermissions {
  public: {} & BasicPermissions
  owner: {} & BasicPermissions
  app: {} & BasicPermissions
}

export interface BasicPermissions {
  read: boolean;
  write: boolean;
}