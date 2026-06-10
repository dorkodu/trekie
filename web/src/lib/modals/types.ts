// Types for modal API
export type ModalId = string;
export type ModalType = "base" | "context" | "confirm";

export interface ModalBase {
  id: ModalId;
  type: ModalType;
  opened: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  innerProps?: unknown;
  onClose?: () => void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  confirmProps?: ConfirmModalProps;
  contextModalProps?: ContextModalProps<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
}

export interface ConfirmModalProps {
  labels?: { confirm: string; cancel: string };
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  children?: React.ReactNode;
}

export interface ContextModalProps<T = unknown> {
  innerProps: T;
  context: ModalsContextValue;
  id: ModalId;
}

export interface ModalsContextValue {
  openModal: (options: Omit<ModalBase, "opened" | "type">) => ModalId;
  openContextModal: <T = unknown>(options: {
    modal: string;
    title?: React.ReactNode;
    innerProps: T;
    component?: React.ComponentType<ContextModalProps<T>>;
  }) => ModalId;
  openConfirmModal: (options: ConfirmModalProps & { title?: React.ReactNode }) => ModalId;
  closeModal: (id: ModalId) => void;
  closeAll: () => void;
  modals: ModalBase[];
}
