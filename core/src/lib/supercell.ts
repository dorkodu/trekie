export interface IStatus<TData> {
  kind: string; // keyof typeof "given kinds"
  timestamp: number;
  data: TData;
}

export interface IKind<TData> {
  onCreate: (data: TData) => IStatus<TData>
  onShare: (status: IStatus<TData>) => void
}

export const Kind = <TData>(kind: IKind<TData>): IKind<TData> => kind

export function Cell<TKinds extends Record<any, IKind<any>>>(kinds: TKinds) {
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

export default { Kind, create: Cell }