import { relations } from "drizzle-orm";
import {
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  bigint,
} from "drizzle-orm/pg-core";

export const invoices = pgTable("invoice", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  notes: text("notes"),
  customer: varchar("customer_name", { length: 50 }).notNull(),
  salesperson: varchar("salesperson_name", { length: 50 }).notNull(),
});

// Simplified version of the hardcoded data in Frontend
export const products = pgTable("product", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 50 }),
  price: integer("price").notNull(),
});

export const invoiceItem = pgTable("invoice_item", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  invoiceId: bigint("invoice_id", { mode: "number" }).notNull(),
  productId: bigint("product_id", { mode: "number" }).notNull(),
  quantity: integer("quantity").notNull(),
});

export const invoiceItemRelation = relations(invoiceItem, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItem.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItem.productId],
    references: [products.id],
  }),
}));

export const productsRelation = relations(products, ({ many }) => ({
  invoiceItems: many(invoiceItem),
}));

export const invoicesRelation = relations(invoices, ({ many }) => ({
  invoiceItems: many(invoiceItem),
}));
