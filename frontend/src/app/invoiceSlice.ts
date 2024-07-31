import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as invoiceAPI from "@/api";
import { RootState } from "./store";

const fetchInvoices = createAsyncThunk(
  "invoices/fetchAllInvoices",
  async () => {
    const response = await invoiceAPI.fetchInvoices();
    return response.data.data;
  },
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    invoices: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload;
    });
  },
});

export const selectInvoices = (state: RootState) => state.invoices.invoices;

export { fetchInvoices };

export default invoiceSlice.reducer;
