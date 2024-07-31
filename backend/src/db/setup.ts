import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL haven't been provided!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
