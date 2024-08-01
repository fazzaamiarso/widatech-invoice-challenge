import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchInvoices,
  selectInvoices,
  selectTotalInvoice,
} from "@/app/invoiceSlice";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

const ROW_LIMIT = 2;

export default function CardSection() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const totalInvoices = useAppSelector(selectTotalInvoice);
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const hasNextPage = totalInvoices / ROW_LIMIT > currentPage;

  useEffect(() => {
    dispatch(fetchInvoices({ page: currentPage, limit: ROW_LIMIT }));
  }, [currentPage, dispatch]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Pagination className="justify-end">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  to={`?page=${currentPage === 1 ? currentPage : currentPage - 1}`}
                />
              </PaginationItem>
            )}
            {hasNextPage && (
              <PaginationItem>
                <PaginationNext to={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
      <ul className="grid grid-cols-2 gap-4">
        {invoices.length &&
          invoices.map((invoice) => {
            const totalPaidAmount = invoice.invoiceItems.reduce((acc, curr) => {
              return acc + curr.product.price * curr.quantity;
            }, 0);

            return (
              <Card key={invoice.id}>
                <CardContent className="space-y-4 p-6">
                  <div>Salesperson: {invoice.salesperson}</div>
                  <div className="text-2xl font-bold">${totalPaidAmount}</div>
                  <p>{invoice.customer}</p>
                  <p>{invoice.notes}</p>
                </CardContent>
              </Card>
            );
          })}
      </ul>
    </div>
  );
}
