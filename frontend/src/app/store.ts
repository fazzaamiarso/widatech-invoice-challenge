import { configureStore } from "@reduxjs/toolkit";
import invoices from "./invoiceSlice";

const store = configureStore({
  reducer: {
    invoices,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
