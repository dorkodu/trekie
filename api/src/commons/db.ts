import { Database } from "bun:sqlite";

export const db = new Database("./dorkodu.db", { create: true });
db.exec("PRAGMA journal_mode = WAL;");