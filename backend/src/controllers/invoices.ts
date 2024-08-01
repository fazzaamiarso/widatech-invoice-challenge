import { invoiceItem, invoices } from "@db/schema";
import { db } from "@db/setup";
import { count, sql } from "drizzle-orm";
import { Request, Response } from "express";
import ClientError from "src/helpers/errors/ClientError";
import InvariantError from "src/helpers/errors/InvariantError";

export const createInvoice = async (req: Request, res: Response) => {
  const { notes, customer, salesperson, products } = req.body;

  try {
    if (
      typeof customer !== "string" ||
      typeof salesperson !== "string" ||
      typeof products !== "object" ||
      products?.length < 1
    ) {
      throw new InvariantError("payload doesn't have the correct data type!");
    }

    const result = await db
      .insert(invoices)
      .values({ notes, salesperson, customer })
      .returning({ insertedId: invoices.id });

    const invoiceId = result[0].insertedId;

    await db.insert(invoiceItem).values(
      products.map((p: any) => ({
        invoiceId,
        productId: p.id,
        quantity: p.quantity,
      }))
    );

    return res.status(201).json({ message: "Invoice successfully created!" });
  } catch (error: any) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  const ROW_LIMIT = 6;

  const page = req.query?.page ? Number(req.query.page) : 1;
  const limit = req.query?.limit ? Number(req.query.limit) : ROW_LIMIT;
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
      hasNextPage: invoicesCount[0].count / ROW_LIMIT > page,
      message: "success!",
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getInvoicesByPeriod = async (req: Request, res: Response) => {
  const period = req.query?.period;

  const periods = ["daily", "weekly", "monthly"] as const;

  try {
    if (typeof period !== "string" || !periods.some((p) => p === period)) {
      throw new InvariantError(`Bad Payload! "${period}" Not a valid period`);
    }

    const sqlInterval = {
      daily: sql`${invoices.date} BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW()`,
      weekly: sql`${invoices.date} BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()`,
      monthly: sql`${invoices.date} BETWEEN NOW() - INTERVAL '30 DAYS' AND NOW()`,
    } as const;

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
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};
