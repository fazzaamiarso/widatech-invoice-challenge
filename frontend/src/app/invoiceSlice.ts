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

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [] as InvoiceResponse[],
    totalInvoices: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload.data;
      state.totalInvoices = action.payload.total;
    });
  },
});

export const selectInvoices = (state: RootState) => state.invoices.invoices;
export const selectTotalInvoice = (state: RootState) =>
  state.invoices.totalInvoices;

export { fetchInvoices };

export default invoiceSlice.reducer;
