import {type ReactNode } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export interface ViewAllButtonProps {
  onClick?: () => void;
  to?: string;
  text?: string;
  children?: ReactNode;
  className?: string;
}

export function ViewAllButton({
  onClick,
  to,
  text,
  children,
  className = "",
}: ViewAllButtonProps) {
  const content = (
    <>
      <span className="font-['Montserrat'] text-lg font-semibold text-primary leading-none">
        {text || children || "View More"}
      </span>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary shrink-0 transition-transform duration-200 group-hover:scale-105">
        <IoIosArrowForward className="h-5 w-5 text-background" />
      </div>
    </>
  );

  const baseClasses = `group inline-flex items-center justify-between gap-4 rounded-[16px] border-2 border-primary bg-transparent px-[26px] py-[10px] transition-all duration-200 hover:bg-primary/10 active:scale-95 cursor-pointer no-underline ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}