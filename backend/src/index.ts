import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import invoiceRouter from "./routes/invoices";

const PORT = process.env.PORT || 3000;

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// register routes
app.use("/invoices", invoiceRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
