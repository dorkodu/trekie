import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer';

export interface IStatus<TData> {
  kind: string; // keyof typeof "given kinds"
  timestamp: number;
  data: TData;
}

export interface IEvent<TData> {
  onCreate: (data: TData) => IStatus<TData>
  onShare: (status: IStatus<TData>) => void
}

export const Event = <TData>(kind: IEvent<TData>): IEvent<TData> => kind

export function Cell<TKinds extends Record<any, IEvent<any>>>(kinds: TKinds) {
  return {
    kinds,
    status<TKind extends keyof TKinds>(kind: TKind, data: Parameters<TKinds[TKind]["onCreate"]>[0]) {
      return this.kinds[kind]!.onCreate(data)
    },
    share(status: IStatus<any>) {
      this.kinds[status.kind]!.onShare(status)
    }
  }
}

export function Store<TState>
  (initializer: StateCreator<TState, [["zustand/immer", never]], [], TState>) {
  return create<TState>()(immer(initializer))
}

export function Slice<TState>
  (initializer: StateCreator<TState, [["zustand/immer", never]], [], TState>) { return initializer }


export class Signal<T extends any> {
  private listeners: ((args: T) => any)[] = [];

  public subscribe(receiver: (args: T) => any) {
    this.listeners.push(receiver);
  }

  public remove(receiver: (args: T) => any) {
    for (let i = 0; i < this.listeners.length; ++i) {
      if (this.listeners[i] === receiver) {
        this.listeners.splice(i, 1);
        return;
      }
    }
  }

  public broadcast(args: T) {
    for (let i = this.listeners.length - 1; i >= 0; --i) {
      this.listeners[i]?.(args);
    }
  }

  public clear() {
    this.listeners = [];
  }
}

const Supercell = { Cell, Event, Store, Slice, Signal }
export default Supercell

