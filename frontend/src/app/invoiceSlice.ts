import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as invoiceAPI from "@/api";
import { RootState } from "./store";
import type {
  InvoiceResponse,
  InvoicePostPayload,
  InvoiceChartResponse,
} from "@/api";

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

const mapDataToDailyChart = (data: InvoiceChartResponse[]) => {
  // should be ordered by hours from 0 to 23
  const dailyChart = Array.from({ length: 24 }).map((_, idx) => {
    return { xAxis: String(idx), revenue: 0 };
  });

  data.forEach((d) => {
    const hoursIdx = new Date(d.date).getHours();
    dailyChart[hoursIdx].revenue = dailyChart[hoursIdx].revenue + d.paidAmount;
  });

  return dailyChart;
};

const mapDataToWeeklyChart = (data: InvoiceChartResponse[]) => {
  const weeklyMap = new Map();
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    weeklyMap.set(String(date.getDate()), 0);
  }

  data.forEach((d) => {
    const day = new Date(d.date).getDate().toString();
    weeklyMap.set(day, weeklyMap.get(day) + d.paidAmount);
  });

  return Array.from(weeklyMap, ([key, value]) => ({
    xAxis: key,
    revenue: value,
  }));
};

const mapDataToMonthlyChart = (data: InvoiceChartResponse[]) => {
  const monthlyMap = new Map();
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    monthlyMap.set(String(date.getDate()), 0);
  }

  data.forEach((d) => {
    const day = new Date(d.date).getDate().toString();
    monthlyMap.set(day, monthlyMap.get(day) + d.paidAmount);
  });

  return Array.from(monthlyMap, ([key, value]) => ({
    xAxis: key,
    revenue: value,
  }));
};

const fetchInvoicesByPeriod = createAsyncThunk(
  "invoices/fetchInvoicesByPeriod",
  async (period: string) => {
    const response = await invoiceAPI.fetchInvoicesByPeriod(period);

    switch (period) {
      case "daily":
        return mapDataToDailyChart(response.data.data);
      case "weekly":
        return mapDataToWeeklyChart([]);
      case "monthly":
        return mapDataToMonthlyChart([]);
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
      console.log(action.payload);
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
