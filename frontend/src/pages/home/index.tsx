"use client";

import { Button } from "@/components/ui/button";

import CardSection from "@/components/CardSection";
import TimeSeriesGraph from "@/components/TimeSeriesGraph";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import InvoiceSheet from "./components/InvoiceSheet";

function Home() {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  return (
    <>
      <TimeSeriesGraph />
      <Card className="w-max min-w-[300px] sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Your Invoices</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setIsCreatingInvoice(true)}>
            Create New Invoice
          </Button>
        </CardFooter>
      </Card>
      <CardSection />
      <InvoiceSheet
        open={isCreatingInvoice}
        toggleOpen={setIsCreatingInvoice}
      />
    </>
  );
}

export default Home;
