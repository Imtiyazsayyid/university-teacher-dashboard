import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrossIcon, XIcon } from "lucide-react";

interface Props {
  placeholder?: string;
  options?: { value: string | number; label: string | number }[];
  selectedItem: string | number | undefined;
  onSelect: (selectedItem: string | undefined) => void;
  className?: string;
  clearable?: boolean;
}

export function MySelect({ placeholder, options, selectedItem, onSelect, className, clearable }: Props) {
  return (
    <div className="relative">
      <Select
        key={new Date().toString()}
        onValueChange={(val) => onSelect(val)}
        value={(selectedItem && selectedItem.toString()) || undefined}
      >
        <SelectTrigger className={`w-full ${className}`}>
          <SelectValue placeholder={placeholder || ""} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((selectItem) => (
              <SelectItem key={selectItem.value} value={selectItem.value.toString()}>
                {selectItem.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {clearable && selectedItem && (
        <XIcon
          size={14}
          className="text-slate-400 hover:text-black dark:text-stone-600 dark:hover:text-white transition-all absolute cursor-pointer top-[0.75rem] right-9"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(undefined);
          }}
        />
      )}
    </div>
  );
}
