import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/",
});

export const fetchInvoices = async () => {
  return client.get("/invoices");
};
