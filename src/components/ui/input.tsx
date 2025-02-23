import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isRequired?: boolean;
  labelText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      isRequired,
      className,
      type,
      isInvalid = false,
      errorMessage,
      startContent,
      endContent,
      labelText,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full text-sm">
        <div className="flex flex-col gap-1">
          {labelText && (
            <label className="text-sm" htmlFor={props.id}>
              {labelText}
            </label>
          )}
          <div
            className={cn(
              "flex h-9 w-full gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              isInvalid ? "border-destructive" : "border-border",
              className
            )}
          >
            {startContent && (
              <div className="flex items-center h-full text-foreground">
                {startContent}
              </div>
            )}
            <input
              className={cn(
                "flex-grow outline-none bg-transparent text-muted-foreground",
                type === "file" &&
                  "file:cursor-pointer file:border-0 file:bg-background file:bg-striped file:rounded-sm file:h-8 file:px-4 file:mr-2"
              )}
              type={type}
              required={isRequired}
              ref={ref}
              {...props}
              autoComplete="off"
            />
            {endContent && (
              <div className="flex items-center h-full">{endContent}</div>
            )}
          </div>
        </div>
        {isInvalid && errorMessage && (
          <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
