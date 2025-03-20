import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DatePickerWithLabelProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  inputId: string;
  label: string;
  startYear?: number;
  endYear?: number;
}

export function DatePickerWithLabel({
  date,
  setDate,
  inputId,
  label,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
}: DatePickerWithLabelProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date ?? new Date(), months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date ?? new Date(), parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
    }
  };

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
          <div className="flex justify-between p-2">
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(date ?? new Date())]}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              value={getYear(date ?? new Date()).toString()}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            month={date}
            onMonthChange={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
