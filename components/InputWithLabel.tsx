import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  label: string;
  placeholder: string;
  error?: string;
}

export const InputWithLabel = React.forwardRef<
  HTMLInputElement,
  InputWithLabelProps
>(({ inputId, label, error, ...rest }, ref) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} ref={ref} {...rest} />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

InputWithLabel.displayName = "InputWithLabel";
