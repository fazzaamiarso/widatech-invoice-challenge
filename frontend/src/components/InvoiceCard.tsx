import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceResponse } from "@/api";

type Props = {
  invoice: Pick<
    InvoiceResponse,
    "customer" | "invoiceItems" | "notes" | "salesperson"
  >;
};

export default function InvoiceCard({ invoice }: Props) {
  const totalPaidAmount = invoice.invoiceItems.reduce((acc, curr) => {
    return acc + curr.product.price * curr.quantity;
  }, 0);
  return (
    <Card>
      <div className="flex items-center justify-between bg-neutral-100 p-6">
        <div className="text-2xl font-bold">${totalPaidAmount}</div>

        <Button variant="link" className="pr-0 text-xs">
          View detail
        </Button>
      </div>
      <CardContent className="divide-y-[1px]">
        <div className="flex justify-between py-3 text-sm">
          <span className="text-neutral-600">Salesperson</span>
          <span>{invoice.salesperson}</span>
        </div>
        <div className="flex justify-between py-3 text-sm">
          <span className="text-neutral-600">Customer</span>
          <span>{invoice.customer}</span>
        </div>
        <div className="pt-4 text-xs text-neutral-500">
          <span className="mr-1">Notes:</span>
          <span className="">
            {invoice.notes?.length ? invoice.notes : "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
