import { BASE_URL } from "@/utils/config";
import axios from "axios";

export interface InvoiceResponse {
  id: number;
  notes?: string;
  customer: string;
  salesperson: string;
  invoiceItems: {
    quantity: number;
    product: {
      price: number;
    };
  }[];
}
export interface InvoiceChartResponse {
  date: string;
  paidAmount: number;
}

export interface InvoicePostPayload {
  notes?: string;
  customer: string;
  salesperson: string;
  products: Array<{ id: number; quantity: number }>;
}

const client = axios.create({
  baseURL: BASE_URL,
});

export const fetchInvoices = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return client.get<{
    data: InvoiceResponse[];
    total: number;
    hasNextPage: boolean;
  }>("/invoices", {
    params: {
      page,
      limit,
    },
  });
};

export const fetchInvoicesByPeriod = async (period: string) => {
  return client.get<{ data: InvoiceChartResponse[] }>("/invoices/period", {
    params: {
      period,
    },
  });
};

export const postInvoice = async (data: InvoicePostPayload) => {
  return client.post("/invoices/create", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
