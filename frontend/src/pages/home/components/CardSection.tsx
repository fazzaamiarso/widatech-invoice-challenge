import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchInvoices,
  selectHasNextPage,
  selectInvoices,
} from "@/app/slice/invoice";
import { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import InvoiceCard from "@/components/InvoiceCard";

export default function CardSection() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const hasPrevPage = currentPage > 1;

  useEffect(() => {
    dispatch(fetchInvoices({ page: currentPage }));
  }, [currentPage, dispatch]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to={
                  hasPrevPage
                    ? `?page=${currentPage === 1 ? currentPage : currentPage - 1}`
                    : "#"
                }
                className={cn(
                  hasPrevPage ? "" : "pointer-events-none opacity-50",
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
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {invoices.length &&
          invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
      </ul>
    </div>
  );
}
