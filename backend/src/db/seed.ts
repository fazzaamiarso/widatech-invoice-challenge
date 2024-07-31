import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { invoiceItem, invoices, products } from "./schema";
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
    console.log("RESET DATABASE START");
    await db.delete(products);
    await db.delete(invoiceItem);
    await db.delete(invoices);
    console.log("RESET DATABASE END");

    await Promise.all([
      db.insert(products).values([
        { id: 345, name: "primogems", price: 30 },
        { id: 222, name: "Geo Sigil", price: 20 },
        { id: 333, name: "Anemo Sigil", price: 10 },
      ]),
      db.insert(invoices).values([
        {
          id: 1,
          customer: "Aether",
          salesperson: "Katheryne",
          notes: "Lorem ipsum",
        },
        {
          id: 2,
          customer: "Diluc",
          salesperson: "Katheryne",
          notes: "Lorem ipsum",
        },
      ]),
    ]);

    await db.insert(invoiceItem).values([
      { quantity: 2, invoiceId: 1, productId: 333 },
      { quantity: 1, invoiceId: 1, productId: 222 },
      { quantity: 1, invoiceId: 2, productId: 345 },
    ]);
  } catch (e: any) {
    console.log(e?.message ?? "Something went wrong!");
  } finally {
    await client.end();
  }
  console.log("🏁 SEEDING END");
};

main();
