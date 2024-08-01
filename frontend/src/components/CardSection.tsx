import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchInvoices,
  selectHasNextPage,
  selectInvoices,
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
import { cn } from "@/lib/utils";

export default function CardSection() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  useEffect(() => {
    dispatch(fetchInvoices({ page: currentPage }));
  }, [currentPage, dispatch]);

  console.log(`SKILL_ISSUE: ${hasNextPage}`);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to={
                  currentPage > 1
                    ? `?page=${currentPage === 1 ? currentPage : currentPage - 1}`
                    : "#"
                }
                className={cn(
                  currentPage > 1 ? "" : "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                to={hasNextPage ? `?page=${currentPage + 1}` : "#"}
                className={cn(
                  hasNextPage ? "" : "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
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
