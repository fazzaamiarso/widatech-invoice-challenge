import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const invoices = pgTable("invoice", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  notes: text("notes"),
  customer: varchar("customer_name", { length: 50 }).notNull(),
  salesperson: varchar("customer_name", { length: 50 }).notNull(),
});
