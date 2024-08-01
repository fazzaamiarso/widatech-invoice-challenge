import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { createInvoice, fetchInvoices } from "@/app/invoiceSlice";
import AutoComplete from "./AutoComplete";
import TextInputWrapper from "./TextInputWrapper";
import { useEffect } from "react";

const createInvoiceSchema = z.object({
  customer: z.string().min(1, { message: "Field is required!" }).max(50),
  salesperson: z.string().min(1, { message: "Field is required!" }).max(50),
  notes: z.string().optional(),
  products: z.array(
    z.object({
      id: z.number(),
      quantity: z.number().min(1, { message: "Field is required!" }),
      name: z.string(),
    }),
  ),
});

type FormValues = z.infer<typeof createInvoiceSchema>;

const formDefaultValues = {
  customer: "",
  salesperson: "",
  notes: "",
  products: [
    {
      id: -1,
      name: "",
      quantity: 1,
    },
  ],
};

type Props = {
  open: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InvoiceSheet({ open, toggleOpen }: Props) {
  const dispatch = useAppDispatch();

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: formDefaultValues,
  });

  const {
    fields: products,
    append,
    remove,
    update,
  } = useFieldArray({
    name: "products",
    control: form.control,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(createInvoice(values)).unwrap();
      toast({
        title: "Invoice Created!",
        description: new Date().toDateString(),
        duration: 2000,
      });

      await dispatch(fetchInvoices({})).unwrap();

      form.reset();
    } catch (error) {
      toast({
        title: "Failed to create Invoice",
        description: "Something went wrong!",
        duration: 2000,
      });
    }
  };

  const onUpdateProduct = (params: {
    id: number;
    idx: number;
    quantity: number;
    name: string;
  }) => {
    update(params.idx, {
      name: params.name,
      quantity: params.quantity,
      id: params.id,
    });
  };

  const addProduct = () => {
    append({ id: -1, quantity: 1, name: "" });
  };

  const removeProduct = (idx: number) => {
    remove(idx);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        if (val === false) form.reset();
        toggleOpen(val);
      }}
    >
      <SheetContent className="mb-20 min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Create New Invoice</SheetTitle>
          <SheetDescription>
            Fill out all necessary information
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 py-12"
          >
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <TextInputWrapper label="Customer Name">
                  <Input placeholder="Elon Musk" {...field} />
                </TextInputWrapper>
              )}
            />
            <FormField
              control={form.control}
              name="salesperson"
              render={({ field }) => (
                <TextInputWrapper label="Salesperson Name">
                  <Input placeholder="Salvador Dali" {...field} />
                </TextInputWrapper>
              )}
            />
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-xl">Items</div>
              </div>

              <div className="space-y-4">
                {products.map((product, idx) => {
                  return (
                    <FormField
                      control={form.control}
                      name={`products.${idx}` as "products.0"}
                      key={product.id}
                      render={({ field }) => {
                        return (
                          <div className="grid grid-cols-4 gap-2 rounded-md p-2 ring-1 ring-neutral-100">
                            <FormItem className="col-span-2 flex flex-col">
                              <FormLabel>Name</FormLabel>
                              <AutoComplete
                                fieldValue={field.value.name}
                                index={idx}
                                onSelectProduct={onUpdateProduct}
                                quantity={product.quantity}
                              />
                            </FormItem>
                            <FormItem className="flex flex-col">
                              <FormLabel>qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="input quantity"
                                  {...field}
                                  value={field.value?.quantity}
                                  onChange={(e) =>
                                    onUpdateProduct({
                                      id: field.value.id,
                                      name: field.value.name,
                                      quantity: Number(e.target.value),
                                      idx,
                                    })
                                  }
                                  min={1}
                                />
                              </FormControl>
                            </FormItem>
                            <Button
                              className="m-0 self-end"
                              variant="ghost"
                              disabled={products.length <= 1}
                              onClick={() => removeProduct(idx)}
                            >
                              <Trash2 className="size-5 text-neutral-500" />
                            </Button>
                          </div>
                        );
                      }}
                    />
                  );
                })}
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={addProduct}
              >
                Add product
              </Button>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <TextInputWrapper label="Additional Notes (optional)">
                  <Textarea placeholder="Type your message here." {...field} />
                </TextInputWrapper>
              )}
            />

            <Button type="submit" className="w-full">
              Save Invoice
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
