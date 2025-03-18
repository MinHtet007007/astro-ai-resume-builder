import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerWithLabelProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  inputId: string;
  label: string;
}

export function DatePickerWithLabel({
  date,
  setDate,
  inputId,
  label,
}: DatePickerWithLabelProps) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            className={cn(
              "justify-start text-left font-normal cursor-pointer",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => setDate(selectedDate ?? undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
