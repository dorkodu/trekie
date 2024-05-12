import { notifications } from "@mantine/notifications";

export function success(message: string | undefined) {
  notifications.show({
    title: "Success!",
    message: message,
    color: "green",
  });
}

export function error(title?: string, message?: string) {
  notifications.show({
    title: title ?? "Error!",
    message: message ?? "An error occured. Please try again, or restart the app.",
    color: "red",
  });
}

export * as notifications from "./notifications"