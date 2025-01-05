import postgres from "postgres"
import { config } from "../config"

export const pg = postgres({
  host: config.postgresHost,
  port: config.postgresPort,
  database: config.postgresDatabase,
  user: config.postgresUser,
  password: config.postgresPassword,
  transform: postgres.camel,
})
