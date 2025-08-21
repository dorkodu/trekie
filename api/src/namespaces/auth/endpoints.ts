import { auth } from "@api/lib/auth";
import { Context, Elysia } from "elysia";


export const authEndpoints = new Elysia({ prefix: "/auth" })
  .options("/sign-in/*", ({ request }) => {
    return new Response(null, {
      status: 204,
    });
  })
  .get("/test", () => "auth ok")
  .mount(auth.handler)

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method))
    return auth.handler(context.request);
  else
    return context.error(405);
}