import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "../db"; // your drizzle instance

import * as schema from "@api/namespaces/auth/schemas/db"; // 👈 better-auth compatible schema export

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    username()
  ],
  baseURL: "http://localhost:3000",
  basePath: "/auth",
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})