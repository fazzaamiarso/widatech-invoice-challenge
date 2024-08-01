import { Button } from "@/components/ui/button";
import CardSection from "./components/CardSection";
import InvoiceSheet from "./components/InvoiceSheet";
import TimeSeriesGraph from "@/components/TimeSeriesGraph";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useState } from "react";

function Home() {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  return (
    <>
      <Card className="w-full min-w-[300px] p-6">
        <div className="flex items-center justify-between">
          <div className="">
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              See an overview of your applications via this dashboard
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreatingInvoice(true)}>
            Create New Invoice
          </Button>
        </div>
      </Card>
      <TimeSeriesGraph />
      <CardSection />
      <InvoiceSheet
        open={isCreatingInvoice}
        toggleOpen={setIsCreatingInvoice}
      />
    </>
  );
}

export default Home;
