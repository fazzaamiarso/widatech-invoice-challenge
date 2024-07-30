import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { salespersons } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  console.log("🌱 SEEDING START");
  try {
    await db
      .insert(salespersons)
      .values([{ name: "James" }, { name: "Elon" }, { name: "Kamala" }])
      .returning();
  } catch (e: any) {
    console.log(e?.message ?? "Something went wrong!");
  } finally {
    await client.end();
  }
  console.log("🏁 SEEDING END");
};

main();
