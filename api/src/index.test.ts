import { expect, it, describe, beforeAll } from "bun:test";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import type { AppRouter } from "./router";

describe("API Index", () => {
  let app: any;

  beforeAll(() => {
    app = new Elysia()
      .use(
        cors({
          origin: ["http://localhost:5173"],
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          credentials: true,
          allowedHeaders: ["Content-Type", "Authorization"],
        })
      )
      .all("/trpc/*", (c) => {
        return fetchRequestHandler({
          endpoint: "/trpc",
          req: c.request,
          router: appRouter,
          createContext: ({ req }) => ({
            req,
            res: new Response(),
            session: undefined,
          }),
        });
      })
      .get("/", () => "Welcome to Trekie API -- this is the index.")
      .post("/echo", ({ body }) => {
        return body;
      });
  });

  describe("GET /", () => {
    it("returns the welcome message", async () => {
      const res = await app.handle(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("Welcome to Trekie API -- this is the index.");
    });
  });

  describe("POST /echo", () => {
    it("echoes request body", async () => {
      const body = { hello: "world", count: 42 };
      const res = await app.handle(
        new Request("http://localhost/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(body);
    });

    it("echoes an array body", async () => {
      const body = [1, 2, 3];
      const res = await app.handle(
        new Request("http://localhost/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      );
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(body);
    });

    it("echoes a string body", async () => {
      const res = await app.handle(
        new Request("http://localhost/echo", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: "hello",
        })
      );
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("hello");
    });
  });

  describe("tRPC endpoints", () => {
    let caller: ReturnType<AppRouter["createCaller"]>;

    beforeAll(() => {
      caller = appRouter.createCaller({
        req: new Request("http://localhost/trpc"),
        res: new Response(),
        session: undefined,
      });
    });

    describe("user.checkUsernameAvailability", () => {
      it("returns available for unused usernames", async () => {
        const result = await caller.user.checkUsernameAvailability({
          username: "newuser",
        });
        expect(result).toEqual({ available: true });
      });

      it("returns unavailable for blocked usernames", async () => {
        const result = await caller.user.checkUsernameAvailability({
          username: "admin",
        });
        expect(result).toEqual({ available: false });
      });

      it("rejects invalid username format", async () => {
        const promise = caller.user.checkUsernameAvailability({
          username: "",
        });
        expect(promise).rejects.toThrow();
      });
    });

    describe("user.getSettings", () => {
      it("returns default settings", async () => {
        const result = await caller.user.getSettings({});
        expect(result).toHaveProperty("preferences");
        expect(result).toHaveProperty("config");
        expect(result).toHaveProperty("onboarding");
        expect(result.preferences?.theme).toBe("system");
      });
    });

    describe("user.updateSettings", () => {
      it("updates theme preference", async () => {
        const result = await caller.user.updateSettings({
          preferences: { theme: "dark" },
        });
        expect(result.preferences?.theme).toBe("dark");
      });

      it("merges partial preferences", async () => {
        await caller.user.updateSettings({
          preferences: { theme: "light" },
        });
        const updated = await caller.user.getSettings({});
        expect(updated.preferences?.theme).toBe("light");
      });
    });

    describe("game.hello", () => {
      it("returns a greeting", async () => {
        const result = await caller.game.hello({ message: "world" });
        expect(result).toBe("Hello, world!");
      });

      it("handles empty messages", async () => {
        const result = await caller.game.hello({ message: "" });
        expect(result).toBe("Hello, !");
      });
    });

    describe("momentum.getSnapshot", () => {
      it("returns calibrating state", async () => {
        const result = await caller.momentum.getSnapshot({ windowDays: 7 });
        expect(result).toHaveProperty("calibrating", true);
      });
    });

    describe("momentum.logEvent", () => {
      it("logs an event and returns ok", async () => {
        const result = await caller.momentum.logEvent({
          userId: "test-user",
          event: "COUNT_UP",
          amount: 3,
          kind: "Habit",
          instanceId: "habit-1",
        });
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("record");
      });
    });
  });
});
