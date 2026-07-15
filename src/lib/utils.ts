import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const asset = (file: string) => `/home-page/${encodeURIComponent(file)}`

export function handleApiError(error: unknown, defaultMessage = "An unexpected error occurred") {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message || defaultMessage;
    toast.error(msg);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
}
