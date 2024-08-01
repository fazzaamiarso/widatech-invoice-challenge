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

const client = axios.create({
  baseURL: "http://localhost:3000/",
});

export const fetchInvoices = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return client.get<{ data: InvoiceResponse[]; total: number }>("/invoices", {
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
