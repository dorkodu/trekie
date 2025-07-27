import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "../db"; // your drizzle instance

import * as schema from "@api/namespaces/auth/schemas/db"; // 👈 better-auth compatible schema export

export const auth = betterAuth({
  database: drizzleAdapter(db, { schema, provider: "pg" }),
  plugins: [
    username()
  ],
  baseURL: "http://localhost:8000",
  basePath: "/auth",
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },
})