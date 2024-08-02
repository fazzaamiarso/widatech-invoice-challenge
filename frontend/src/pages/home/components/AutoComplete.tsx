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
import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// should be retrieved from API
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
  fieldValue: string | undefined;
  index: number;
  quantity: number;
  onSelectProduct: (params: {
    id: number;
    idx: number;
    quantity: number;
    name: string;
  }) => void;
};
export default function AutoComplete({
  fieldValue,
  onSelectProduct,
  index,
  quantity,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between",
              !fieldValue && "text-muted-foreground",
            )}
          >
            {fieldValue?.length ? fieldValue : "Select product"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {dummyProducts.map((item) => {
                return (
                  <CommandItem
                    value={item.name}
                    key={item.name}
                    className="flex items-center justify-between"
                    onSelect={() =>
                      onSelectProduct({
                        quantity,
                        idx: index,
                        id: item.id,
                        name: item.name,
                      })
                    }
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.picture}
                        width={40}
                        height={40}
                        alt=""
                        className="rounded-sm"
                      />
                      <div className="grid">
                        <span className="">{item.name}</span>
                        <span className="text-neutral-400">
                          stock: {item.stock}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg text-neutral-600">
                      ${item.price}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
