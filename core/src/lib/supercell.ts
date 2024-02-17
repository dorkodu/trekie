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

const Supercell = { Cell, Event, Store, Slice }
export default Supercell