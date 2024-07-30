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
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  salespersonId: bigint("salesperson", { mode: "number" }).notNull(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  salesperson: one(salespersons, {
    fields: [invoices.salespersonId],
    references: [salespersons.id],
  }),
}));

export const customers = pgTable("customer", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

export const salespersons = pgTable("salesperson", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const salespersonsRelations = relations(salespersons, ({ many }) => ({
  invoices: many(invoices),
}));
