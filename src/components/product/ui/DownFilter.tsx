

export function DownFilter({
  label,
  onClick,
  isOpen = false,
}: {
  label: string;
  onClick?: () => void;
  isOpen?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center justify-start gap-2 rounded-2xl bg-gray-light p-3 sm:p-4"
    >
      <div className="whitespace-nowrap font-['Montserrat'] text-base font-medium text-gray-text sm:text-xl">
        {label}
      </div>
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-card sm:h-8 sm:w-8">
        <img
          src="home-page/weui_arrow-filled-1.svg"
          className={`absolute left-[4px] top-[9px] h-3 w-5 transition-transform sm:top-[10px] sm:w-6 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
  );
}