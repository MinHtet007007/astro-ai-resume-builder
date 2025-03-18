import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface TextareaWithLabelProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputId: string;
  label: string;
  placeholder: string;
  error?: string;
}

export const TextareaWithLabel = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithLabelProps
>(({ inputId, label, error, ...rest }, ref) => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <Textarea id={inputId} ref={ref} {...rest} />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

TextareaWithLabel.displayName = "TextareaWithLabel";
