import { invoices } from "@db/schema";
import { db } from "@db/setup";
import { count, sql } from "drizzle-orm";
import { Request, Response } from "express";

export const createInvoice = async (req: Request, res: Response) => {
  // TODO: should validate and sanitize this later
  const { notes, customer, salesperson } = req.body;

  try {
    await db.insert(invoices).values({ notes, salesperson, customer });

    return res.status(201).json({ message: "invoice successfully created!" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "Invalid Payload", message: error.message });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  const page = req.query?.page ? Number(req.query.page) : 1;
  const limit = req.query?.limit ? Number(req.query.limit) : undefined;
  const offset = limit ? (page - 1) * limit : undefined;

  try {
    const result = await db.query.invoices.findMany({
      offset,
      limit,
      orderBy: (invoices, { desc }) => [desc(invoices.date)], // order from newest invoices
      columns: { date: false },
      with: {
        invoiceItems: {
          columns: { quantity: true },
          with: {
            product: { columns: { price: true } },
          },
        },
      },
    });

    const invoicesCount = await db.select({ count: count() }).from(invoices);

    return res.status(200).json({
      data: result,
      total: invoicesCount[0].count,
      message: "success!",
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "Invalid Payload", message: error.message });
  }
};

export const getInvoicesByPeriod = async (req: Request, res: Response) => {
  const period = req.query?.period;

  const periods = ["daily", "weekly", "monthly"] as const;
  if (typeof period !== "string" || !periods.some((p) => p === period)) {
    return res
      .status(400)
      .json({ message: `Bad Payload! "${period}" Not a valid period` });
  }

  const sqlInterval = {
    daily: sql`${invoices.date} BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()`,
    weekly: sql`${invoices.date} BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()`,
    monthly: sql`${invoices.date} BETWEEN NOW() - INTERVAL '30 DAYS' AND NOW()`,
  } as const;

  try {
    const result = await db.query.invoices.findMany({
      columns: { date: true },
      orderBy: (invoices, { asc }) => [asc(invoices.date)], // order from oldest invoices
      where: sqlInterval[period as (typeof periods)[number]],
      with: {
        invoiceItems: {
          columns: { quantity: true },
          with: {
            product: { columns: { price: true } },
          },
        },
      },
    });

    const data = result.map((item) => {
      return {
        date: item.date,
        paidAmount: item.invoiceItems.reduce((acc, curr) => {
          return acc + curr.product.price * curr.quantity;
        }, 0),
      };
    });

    return res.status(200).json({ data, message: "success!" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "Invalid Payload", message: error.message });
  }
};
