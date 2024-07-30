import { createInvoice } from "@controllers/invoices";
import { Router } from "express";

const invoiceRouter = Router();

invoiceRouter.post("/create", createInvoice);

export default invoiceRouter;
