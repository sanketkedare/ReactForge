import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  size = "md",
}) => {
  const sizeMap = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-8", thumb: "w-6 h-6", translate: "translate-x-6" },
  };

  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "rounded-full transition-colors duration-200 ease-in-out border border-slate-700",
            sizeMap[size].track,
            checked ? "bg-indigo-600 border-indigo-500" : "bg-slate-800"
          )}
        />
        <div
          className={cn(
            "absolute left-0.5 top-0.5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-md",
            sizeMap[size].thumb,
            checked && sizeMap[size].translate
          )}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-slate-200">{label}</span>
          )}
          {description && (
            <span className="text-xs text-slate-400">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};
