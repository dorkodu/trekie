import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

interface Props {
  title: string;
  children: React.ReactNode;
  confirm: string;
  cancel: string;
  onConfirm: () => any;
  onCancel?: () => any;
}

export function openDangerousActionModal({
  title,
  children,
  confirm,
  cancel,
  onConfirm,
  onCancel,
}: Props) {
  modals.openConfirmModal({
    title,
    lockScroll: false,
    centered: true,
    size: 360,
    children,
    labels: {
      confirm: <Text fw={600}>{confirm}</Text>,
      cancel: <Text fw={600}>{cancel}</Text>,
    },
    onConfirm,
    onCancel,
    groupProps: { gap: "xs" },
    confirmProps: { variant: "light", color: "red", mih: 48 },
    cancelProps: {
      variant: "filled",
      color: "green",
      mih: 48,
      style: { flex: 1 },
    },
  });
}
