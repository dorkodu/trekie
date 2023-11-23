import { Document } from "@/commons/data";
export { Peer, PeerConfig };

class Peer {

  constructor({ namespace, debug }: PeerConfig) {}

  add(document: Document) {}

  get(cid: string) {}

  read(cid: string) {}

  write(cid: string) {}
}

export type PeerConfig = {
  namespace: string
  debug?: boolean
  pod?: {
    loadImmediately?: boolean
    version?: string
  }
  permissions?: Permissions
  userMessages?: UserMessages
}
