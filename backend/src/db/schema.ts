import { relations } from "drizzle-orm";
import {
  bigint,
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
  salespersonId: bigint("salesperson", { mode: "number" }).notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  salesperson: one(salespersons, {
    fields: [invoices.salespersonId],
    references: [salespersons.id],
  }),
}));

export const salespersons = pgTable("salesperson", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

export const salespersonsRelations = relations(salespersons, ({ many }) => ({
  invoices: many(invoices),
}));
