import type { ReactNode } from "react";

export interface ApiResponse<T = any> {
  success?: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export interface ToggleProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export interface ViewAllButtonProps {
  to?: string;
  onClick?: () => void;
  text?: string;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white" | "current" | "subtle";
  className?: string;
  text?: string;
  textClassName?: string;
  fullScreen?: boolean;
  inline?: boolean;
  containerClassName?: string;
}
