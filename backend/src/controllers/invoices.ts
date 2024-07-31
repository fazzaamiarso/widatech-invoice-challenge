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
