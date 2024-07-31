import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchInvoices, selectInvoices } from "@/app/invoiceSlice";
import { useEffect } from "react";

export default function CardSection() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <div>
      <pre>{JSON.stringify(invoices, null, 2)}</pre>
    </div>
  );
}
