import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4 "
      onClick={onClose}
    >
      <div
        className=" relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-card sm:max-h-[90vh] sm:w-full sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stroke px-4 py-3 sm:px-5">
          {title && (
            <h2 className="font-['Montserrat'] text-base font-semibold text-foreground sm:text-lg">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-gray-light"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="overflow-y-hidden p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}