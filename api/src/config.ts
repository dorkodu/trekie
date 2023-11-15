const port = Number(process.env.PORT) || 8001;
const env: "development" | "production" = (
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production"
) && process.env.NODE_ENV || "development";

const epochTime = Number(process.env.EPOCH_TIME) || 1695859200069;
const machineId = Number(process.env.MACHINE_ID) || 0;

const postgresHost = process.env.POSTGRES_HOST || "app-template_postgres";
const postgresPort = Number(process.env.PGPORT) || 7000;
const postgresName = process.env.POSTGRES_DB || "app";
const postgresUser = process.env.POSTGRES_USER || "postgres";
const postgresPassword = process.env.POSTGRES_PASSWORD || "postgres";

const smtpHost = process.env.SMTP_HOST || "mailslurper";
const smtpPort = Number(process.env.SMTP_PORT) || 2500;
const smtpUser = process.env.SMTP_USER || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

export const config = {
  port,
  env,

  epochTime,
  machineId,

  postgresHost,
  postgresPort,
  postgresName,
  postgresUser,
  postgresPassword,

  smtpHost,
  smtpPort,
  smtpUser,
  smtpPassword,
}