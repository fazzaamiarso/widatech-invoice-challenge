import {
  createInvoice,
  getInvoices,
  getInvoicesByPeriod,
} from "@controllers/invoices";
import { Router } from "express";

const invoiceRouter = Router();

invoiceRouter.get("/", getInvoices);
invoiceRouter.post("/create", createInvoice);
invoiceRouter.get("/period", getInvoicesByPeriod);

export default invoiceRouter;
