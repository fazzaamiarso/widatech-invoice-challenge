import { createInvoice, getInvoices } from "@controllers/invoices";
import { Router } from "express";

const invoiceRouter = Router();

invoiceRouter.post("/create", createInvoice);
invoiceRouter.get("/", getInvoices);

export default invoiceRouter;
