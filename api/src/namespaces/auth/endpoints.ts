import { Elysia } from "elysia";
import { auth } from "./service";

export const authEndpoints = new Elysia({ prefix: "/auth" })
  .options("/sign-in/*", ({ request }) => {
    return new Response(null, {
      status: 204,
    });
  })
  .get("/test", () => "auth ok")
  .mount(auth.handler);
