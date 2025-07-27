import { auth } from "@api/lib/auth";
import { Elysia } from "elysia";


export const authEndpoints = new Elysia({ prefix: "/auth" })
  .options("/sign-in/*", ({ request }) => {
    return new Response(null, {
      status: 204,
    });
  })
  .get("/test", () => "auth ok")
  .mount(auth.handler);
