export const defaultAvatarUrl = '/images/avatar.webp'

export const port = Number(process.env.PORT) || 8000
export const dev = process.env.BUN_ENV !== "production"
export const prod = process.env.BUN_ENV === "production"
export const origin = process.env.ORIGIN || "http://localhost:5173"

export const trpcApiUrl = dev ? "http://localhost:8000/trpc" : "https://api.trekie.io/trpc"

export * as vars from "./vars"
