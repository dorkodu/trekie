export const postgresHost = process.env.POSTGRES_HOST || "127.0.0.1"
export const postgresPort = Number(process.env.POSTGRES_PORT) || 54322
export const postgresName = process.env.POSTGRES_DB || "postgres"
export const postgresUser = process.env.POSTGRES_USER || "postgres"
export const postgresPassword = process.env.POSTGRES_PASSWORD || "postgres"

export * as config from "./config"