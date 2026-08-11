import React from "react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "primary" | "secondary" | "white" | "current" | "subtle";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  text?: string;
  textClassName?: string;
  fullScreen?: boolean;
  inline?: boolean;
  containerClassName?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3.5 w-3.5 border-2",
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-10 w-10 border-4",
  xl: "h-14 w-14 border-4",
};

const variantMap: Record<SpinnerVariant, { track: string; head: string }> = {
  primary: {
    track: "border-primary/20",
    head: "border-t-primary",
  },
  secondary: {
    track: "border-secondary/20",
    head: "border-t-secondary",
  },
  white: {
    track: "border-white/20",
    head: "border-t-white",
  },
  current: {
    track: "border-current/20",
    head: "border-t-current",
  },
  subtle: {
    track: "border-stroke",
    head: "border-t-primary",
  },
};

export function InlineSpinner({
  size = "sm",
  variant = "current",
  className = "",
}: {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}) {
  const sizeClass = sizeMap[size] || sizeMap.sm;
  const { track, head } = variantMap[variant] || variantMap.current;

  return (
    <span
      className={`inline-block animate-spin rounded-full ${track} ${head} ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  className,
  text,
  textClassName = "",
  fullScreen = false,
  inline = false,
  containerClassName = "",
}: LoadingSpinnerProps) {
  const isCustomClass = Boolean(className && (className.includes("border-") || className.includes("text-")));
  const sizeClass = className || sizeMap[size] || sizeMap.md;
  const { track, head } = variantMap[variant] || variantMap.primary;

  const spinner = (
    <div
      className={`animate-spin rounded-full ${
        isCustomClass ? "" : `${track} ${head}`
      } ${sizeClass}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (inline) {
    return spinner;
  }

  const containerClasses = fullScreen
    ? `fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs p-6 gap-3 ${containerClassName}`
    : `flex h-full w-full flex-col items-center justify-center p-6 gap-3 ${containerClassName}`;

  return (
    <div className={containerClasses}>
      {spinner}
      {text && (
        <p className={`font-['Montserrat'] text-xs font-medium text-gray-text animate-pulse ${textClassName}`}>
          {text}
        </p>
      )}
    </div>
  );
}

export { LoadingSpinner };
