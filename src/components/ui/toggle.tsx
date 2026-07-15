import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToggleProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  variant?: "primary" | "success";
}

export function Toggle({
  checked,
  onChange,
  size = "md",
  variant = "primary",
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  // Styles for the switch container
  const sizeClasses = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
  };

  // Color variants for active/inactive states
  const activeColorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
  };

  const inactiveColorClass = "bg-stroke dark:bg-stroke/40";

  // Knob sizes and translations
  const knobSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
  };

  // Translation values when active/inactive
  // Uses translate-x for smooth micro-animations with perfect symmetry:
  // - sm: 20px height, 36px width, 14px knob -> 3px padding all around.
  // - md: 24px height, 44px width, 20px knob -> 2px padding all around.
  const knobTransformClasses = {
    sm: checked
      ? "translate-x-[19px] rtl:-translate-x-[19px]"
      : "translate-x-[3px] rtl:-translate-x-[3px]",
    md: checked
      ? "translate-x-[22px] rtl:-translate-x-[22px]"
      : "translate-x-[2px] rtl:-translate-x-[2px]",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        checked ? activeColorClasses[variant] : inactiveColorClass,
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out",
          knobSizeClasses[size],
          knobTransformClasses[size]
        )}
      />
    </button>
  );
}

