import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const categories = [
  {
    value: "medical",
    label: "Medical",
  },
  {
    value: "business",
    label: "Business",
  },
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "revuild & recover",
    label: "Rebuild & Recover",
  },
  {
    value: "charity",
    label: "Charity",
  },
];

interface Combobox {
  value?: string;
  onValueChange: (value: string) => void;
}

export function ComboboxDemo({ value, onValueChange }: Combobox) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[400px] justify-between"
          >
            {value
              ? categories.find((category) => category.value === value)?.label
              : "Select Category..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.value}
                    value={category.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    {category.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === category.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
