import { Badge } from "@";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@web/components/ui/command";
import type * as React from "react";
import { useEffect, useState } from "react";

// Option type definition
export interface ChoiceOption {
  value: string;
  label: string;
  content?: React.ReactNode;
}

interface ChoiceComboboxProps {
  options: ChoiceOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export function ChoiceCombobox(props: ChoiceComboboxProps) {
  const {
    options = [],
    value: externalValue = [],
    onChange,
    placeholder = "Pick one or more values",
  } = props;

  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(externalValue);

  useEffect(() => {
    setSelectedValues(externalValue);
  }, [externalValue]);

  // Handle selecting an option
  const handleOptionSelect = (val: string) => {
    const newValues = selectedValues.includes(val)
      ? selectedValues.filter(v => v !== val)
      : [...selectedValues, val];
    setSelectedValues(newValues);
    onChange?.(newValues);
    setSearch("");
  };

  // Handle removing a selected value
  const handleValueRemove = (val: string) => {
    const newValues = selectedValues.filter(v => v !== val);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Filter options: first remove selected values, then filter by search text
  const filteredOptions = options
    .filter(option => !selectedValues.includes(option.value))
    .filter(option => option.label.toString().toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedValues.map(value => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge key={value} variant="secondary" className="flex items-center gap-1 pr-1">
              {option ? (option.content ? option.content : option.label) : value}
              <button
                type="button"
                className="ml-1 rounded hover:bg-muted/50 p-0.5"
                onClick={() => handleValueRemove(value)}
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      <Command className="w-full border rounded-md">
        <CommandInput
          placeholder={selectedValues.length === 0 ? placeholder : "Search..."}
          value={search}
          onValueChange={setSearch}
          onFocus={() => setSearch("")}
        />
        <CommandList className="max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <CommandEmpty>Nothing found</CommandEmpty>
          ) : (
            filteredOptions.map(option => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleOptionSelect(option.value)}
                className="cursor-pointer"
              >
                {option.content ?? <span>{option.label}</span>}
              </CommandItem>
            ))
          )}
        </CommandList>
      </Command>
    </div>
  );
}
