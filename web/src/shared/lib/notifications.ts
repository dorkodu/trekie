import { notifications } from "@mantine/notifications";

export function success(message: string | undefined) {
  notifications.show({
    title: "Success!",
    message: message,
    color: "green",
  });
}

export function clientError(message: string | undefined) {
  notifications.show({
    title: "Error!",
    message: message ?? "An error occured. Please try again, or restart the app.",
    color: "red",
  });
}


export function error(message: string | undefined) {
  notifications.show({
    title: "Error!",
    message: message ?? "An error occured. Please try again, or restart the app.",
    color: "red",
  });
}

export function serverError(message: string | undefined) {
  notifications.show({
    title: "Server Error!",
    message: message ?? "An error occured on the server. Please try again later.",
    color: "red",
  });
}

export * as notifications from "./notifications"