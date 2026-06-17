import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-zinc-900 focus:border-transparent ${
              error
                ? "border-red-400 focus:ring-red-500"
                : "border-zinc-300"
            } ${rightElement ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
