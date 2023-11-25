import { Document, DocumentTemplate } from "@/commons/data";
import { createDocument } from "@/index";

export { Peer, PeerConfig };

const DEFAULTPEERID = "wander:peer:0";

const DEFAULTCONFIG: PeerConfig = {
  namespace: string
  debug?: boolean
  
  pod?: {
    loadImmediately?: boolean
  }

  permissions?: Permissions
  seeds?: []
}

class Peer {
  private id: string;
  private namespace: string;

  public session: Session | null = null;
  
  private headers: Record<string, string> = {};
  
  private callbacks: Record<EventKind, Function> = {}

  private config: PeerConfig;

  private seeds: string[];

  constructor(config: PeerConfig = DEFAULTCONFIG) {
    this.config = config
  }

  on(eventName: EventKind, callback: (event?: Event) => void) {
    this.components.eventFeed
  }

  authenticate(method: string, input: any) {

  }
  
  accessClaim(namespace: string, permisions: PermissionInfo) {}

  add(document: Document) {}

  create(newDocument: DocumentTemplate) {
    return createDocument(newDocument);
  }

  read(cid: string) {}

  publish() {}

  authenticate(input: any): false | Session {
    
    // try to create a session
    const authResult = login(who);

    if (authResult.result) {
      // save credientials and session locally for future use
      this.session = authResult.session;
    }

    return authResult.result;
  }

  setSessionHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  whoAmI() {
    return this.session?.user ?? null;
    // returns the current user's session
    // just for fun..
  }
}

export type PeerConfig = {
  namespace: string
  debug?: boolean
  
  pod?: {
    loadImmediately?: boolean
  }

  permissions?: Permissions
  seeds?: string[]
}

function generatePeerID() {
  return DEFAULTPEERID;
}

type EventKind = string;

type Event = {
  kind: EventKind;
  info: string | boolean | number | object;
};

export const PeerEventKinds = [
  // PEER NODE ------------
  "peer:ready",
  "peer:anonymous",
  "peer:connected",
  "peer:disconnected",
  "peer:connecting",
  "peer:authing",
  "peer:network-online",
  // NETWORK --------------
  "network:busy",
  "network:online",
  "network:offline",
  // SYNC -----------------
  "sync:doing",
  "sync:done",
  "sync:error",
  // SYNC -----------------
]