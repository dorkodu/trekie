import { Server } from "socket.io";
import { server } from "./server";

export interface ServerToClientEvents {

}

export interface ClientToServerEvents {

}

export const socketio = new Server<
  ClientToServerEvents,
  ServerToClientEvents
>(server, { path: "/api/socket" });

socketio.on("connection", async (socket) => {
  socket.on("disconnect", (_reason, _description) => {

  });

  socket.on("disconnecting", (_reason, _description) => {

  });

  socket.on("error", (_err) => {

  });
});