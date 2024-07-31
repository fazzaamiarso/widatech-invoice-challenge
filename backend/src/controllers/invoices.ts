import { invoices } from "@db/schema";
import { db } from "@db/setup";
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
  try {
    const result = await db.query.invoices.findMany({
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

    return res.status(200).json({ data: result, message: "success!" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: "Invalid Payload", message: error.message });
  }
};
