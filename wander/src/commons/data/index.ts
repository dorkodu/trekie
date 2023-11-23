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