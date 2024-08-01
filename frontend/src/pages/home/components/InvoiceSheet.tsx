import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { createInvoice, fetchInvoices } from "@/app/invoiceSlice";

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

const dummyProducts = [
  {
    id: 111,
    name: "primogems",
    price: 30,
    stock: 5,
    picture: "https://picsum.photos/40",
  },
  {
    id: 222,
    name: "Geo Sigil",
    price: 20,
    stock: 5,
    picture: "https://picsum.photos/40",
  },
  {
    id: 333,
    name: "Anemo Sigil",
    price: 10,
    stock: 5,
    picture: "https://picsum.photos/40",
  },
  {
    id: 444,
    name: "Hydro Sigil",
    price: 40,
    stock: 5,
    picture: "https://picsum.photos/40",
  },
  {
    id: 555,
    name: "Dendro Sigil",
    price: 55,
    stock: 5,
    picture: "https://picsum.photos/40",
  },
];

type Props = {
  open: boolean;
  toggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InvoiceSheet({ open, toggleOpen }: Props) {
  const dispatch = useAppDispatch();

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customer: "",
      salesperson: "",
      notes: "",
    },
  });

  // 1. Able to add new field
  // 2. display product input + autosuggest, stock, delete
  // 3. as user types shows autosuggest
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
    } catch (error) {
      toast({
        title: "Failed to create Invoice",
        description: "Something went wrong!",
        duration: 2000,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Create New Invoice</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salesperson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salesperson Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-xl">Products</div>
                <Button
                  type="button"
                  onClick={() => append({ id: -1, quantity: 0, name: "" })}
                >
                  Add new product
                </Button>
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
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "justify-between",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value?.name.length
                                        ? field.value.name
                                        : "Select product"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search products..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No product found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {dummyProducts.map((item) => {
                                          return (
                                            <CommandItem
                                              value={item.name}
                                              key={item.name}
                                              className="grid grid-cols-3"
                                              onSelect={() => {
                                                update(idx, {
                                                  id: item.id,
                                                  name: item.name,
                                                  quantity: product.quantity,
                                                });
                                              }}
                                            >
                                              <img
                                                src={item.picture}
                                                width={40}
                                                height={40}
                                                alt=""
                                              />
                                              <div className="grid">
                                                <span>{item.name}</span>
                                                <span>stock: {item.stock}</span>
                                              </div>
                                              <div>${item.price}</div>
                                            </CommandItem>
                                          );
                                        })}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
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
                                    update(idx, {
                                      id: field.value.id,
                                      name: field.value.name,
                                      quantity: Number(e.target.value),
                                    })
                                  }
                                  min={0}
                                />
                              </FormControl>
                            </FormItem>
                            <Button
                              className="m-0 self-end"
                              variant="ghost"
                              onClick={() => remove(idx)}
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
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}