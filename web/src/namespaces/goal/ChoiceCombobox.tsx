import { IconX } from "@tabler/icons-react";
import { Badge } from "@web/components/ui/badge";
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
    placeholder = "Search and select commitments...",
  } = props;

  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(externalValue);
  const [isOpen, setIsOpen] = useState(false);

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
    .filter(option =>
      option.label.toString().toLowerCase().includes(search.toLowerCase()) ||
      (option.content && typeof option.content === 'string' && option.content.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="w-full space-y-2">
      {/* Selected items as pills */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedValues.map(value => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge
                key={value}
                variant="default"
                className="flex items-center gap-1.5 pr-1.5 pl-2 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
              >
                {option ? (
                  <div className="flex items-center gap-1.5">
                    {option.content}
                  </div>
                ) : (
                  <span className="truncate max-w-24">{value}</span>
                )}
                <button
                  type="button"
                  className="ml-1 rounded-full hover:bg-primary/30 p-0.5 transition-colors"
                  onClick={() => handleValueRemove(value)}
                  aria-label={`Remove ${option?.label || value}`}
                >
                  <IconX className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Search and dropdown */}
      <div className="relative">
        <Command className="w-full border rounded-md bg-background">
          <CommandInput
            placeholder={selectedValues.length === 0 ? placeholder : `Search ${options.length - selectedValues.length} remaining commitments...`}
            value={search}
            onValueChange={setSearch}
            onFocus={() => setIsOpen(true)}
            className="h-9"
          />
          {isOpen && (
            <CommandList className="max-h-48 overflow-y-auto border-t">
              {filteredOptions.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  {search ? `No commitments found matching "${search}"` : "No commitments available"}
                </CommandEmpty>
              ) : (
                filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleOptionSelect(option.value)}
                    className="cursor-pointer hover:bg-accent/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-1 min-w-0">
                        {option.content ?? <span className="font-medium">{option.label}</span>}
                      </div>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          )}
        </Command>
      </div>

      {/* Summary */}
      {options.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selectedValues.length} of {options.length} commitments selected
        </div>
      )}
    </div>
  );
}
