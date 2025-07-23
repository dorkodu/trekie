import { db } from "@api/db";
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import * as schema from './schemas/db'; // 👈 better-auth compatible schema export

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  basePath: "/auth",
  trustedOrigins: ["http://localhost:5173"],
  database: drizzleAdapter(db, { schema, provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [
    username(),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
