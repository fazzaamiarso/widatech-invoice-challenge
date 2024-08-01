import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as invoiceAPI from "@/api";
import { RootState } from "./store";
import type { InvoiceResponse } from "@/api";

const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async ({ page, limit }: { page?: number; limit?: number }) => {
    const response = await invoiceAPI.fetchInvoices({ page, limit });
    return response.data;
  },
);

const dailyChart = Array.from({ length: 24 }).map((_, idx) => {
  return { xAxis: String(idx), revenue: 0 };
});

const fetchInvoicesByPeriod = createAsyncThunk(
  "invoices/fetchInvoicesByPeriod",
  async (period: string) => {
    const response = await invoiceAPI.fetchInvoicesByPeriod(period);

    response.data.data.forEach((d, idx) => {
      dailyChart[idx].revenue =
        dailyChart[idx].revenue +
        d.invoiceItems.reduce((acc, curr) => {
          return acc + curr.product.price * curr.quantity;
        }, 0);
    });

    return dailyChart;
  },
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [] as InvoiceResponse[],
    chartInvoices: [] as { xAxis: string; revenue: number }[],
    totalInvoices: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload.data;
      state.totalInvoices = action.payload.total;
    });
    builder.addCase(fetchInvoicesByPeriod.fulfilled, (state, action) => {
      state.chartInvoices = action.payload;
    });
  },
});

export const selectInvoices = (state: RootState) => state.invoices.invoices;
export const selectTotalInvoice = (state: RootState) =>
  state.invoices.totalInvoices;
export const selectChartInvoices = (state: RootState) =>
  state.invoices.chartInvoices;

export { fetchInvoices, fetchInvoicesByPeriod };

export default invoiceSlice.reducer;
