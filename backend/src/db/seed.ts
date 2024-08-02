import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { invoiceItem, invoices, products } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const generateRandomIdxFromArray = (array: any[]) => {
  return Math.floor(Math.random() * array.length);
};

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  try {
    console.log("RESET DATABASE START");
    await db.delete(products);
    await db.delete(invoiceItem);
    await db.delete(invoices);
    console.log("RESET DATABASE END");

    console.log("🌱 SEEDING START");

    const salespersons = ["Nahida", "Furina", "Arlecchino", "Venti"];
    const customers = [
      "Aether",
      "Diluc",
      "Zhongli",
      "Childe",
      "Navia",
      "Bennet",
      "HuTao",
      "Kazuha",
    ];
    const generatedInvoices = Array.from({ length: 30 }).map((_, idx) => {
      const today = new Date();
      const date = new Date();
      date.setDate(today.getDate() - idx);

      return {
        id: idx,
        customer: customers[generateRandomIdxFromArray(customers)],
        salesperson: salespersons[generateRandomIdxFromArray(salespersons)],
        notes: "lorem ipsum",
        date,
      };
    });

    const productsId = [111, 222, 333, 444, 555];

    await Promise.all([
      db.insert(products).values([
        { id: 111, name: "primogems", price: 30 },
        { id: 222, name: "Geo Sigil", price: 20 },
        { id: 333, name: "Anemo Sigil", price: 10 },
        { id: 444, name: "Hydro Sigil", price: 40 },
        { id: 555, name: "Dendro Sigil", price: 55 },
      ]),
      db.insert(invoices).values(generatedInvoices),
    ]);

    await Promise.all(
      generatedInvoices.map((item) => {
        return db.insert(invoiceItem).values({
          invoiceId: item.id,
          productId: productsId[generateRandomIdxFromArray(productsId)],
          quantity: 2,
        });
      })
    );
  } catch (e: any) {
    console.log(e?.message ?? "Something went wrong!");
  } finally {
    await client.end();
  }
  console.log("🏁 SEEDING END");
};

main();
