import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as invoiceAPI from "@/api";
import type { RootState } from "../store";
import type { InvoiceResponse, InvoicePostPayload } from "@/api";
import {
  mapDataToDailyChart,
  mapDataToMonthlyChart,
  mapDataToWeeklyChart,
} from "../utils/chart-mapper";

const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async ({ page, limit }: { page?: number; limit?: number }) => {
    const response = await invoiceAPI.fetchInvoices({ page, limit });
    return response.data;
  },
);

const createInvoice = createAsyncThunk(
  "invoices/createInvoice",
  async (data: InvoicePostPayload) => {
    const response = await invoiceAPI.postInvoice(data);
    return response.data;
  },
);

const fetchInvoicesByPeriod = createAsyncThunk(
  "invoices/fetchInvoicesByPeriod",
  async (period: string) => {
    const response = await invoiceAPI.fetchInvoicesByPeriod(period);

    switch (period) {
      case "daily":
        return mapDataToDailyChart(response.data.data);
      case "weekly":
        return mapDataToWeeklyChart(response.data.data);
      case "monthly":
        return mapDataToMonthlyChart(response.data.data);
      default:
        return [];
    }
  },
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [] as InvoiceResponse[],
    chartInvoices: [] as { xAxis: string; revenue: number }[],
    totalInvoices: 0,
    hasNextPage: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload.data;
      state.totalInvoices = action.payload.total;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(fetchInvoicesByPeriod.fulfilled, (state, action) => {
      state.chartInvoices = action.payload;
    });
  },
});

export const selectInvoices = (state: RootState) => state.invoices.invoices;
export const selectTotalInvoice = (state: RootState) =>
  state.invoices.totalInvoices;
export const selectHasNextPage = (state: RootState) =>
  state.invoices.hasNextPage;
export const selectChartInvoices = (state: RootState) =>
  state.invoices.chartInvoices;

export { fetchInvoices, fetchInvoicesByPeriod, createInvoice };

export default invoiceSlice.reducer;
