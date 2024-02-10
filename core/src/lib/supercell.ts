import { create, StateCreator } from 'zustand'

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

const Supercell = { create: Cell, Event }
export default Supercell