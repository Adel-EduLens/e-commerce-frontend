import { Trash2 } from "lucide-react";
const placeholderProduct =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='166' viewBox='0 0 140 166'%3E%3Crect width='140' height='166' fill='%23D9D9D9'/%3E%3C/svg%3E";

function ProductRequestCard() {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-white p-2 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <img
        className="h-32 w-28 sm:h-40 sm:w-36 rounded-lg object-cover shrink-0"
        src={placeholderProduct}
        alt="Amber Blaze Classic Tee"
        draggable={false}
      />
      <div className="flex flex-1 flex-col gap-2 py-2">
        <div className="font-['Montserrat'] text-base sm:text-xl font-medium text-[#1A1A1A]">
          Amber Blaze Classic Tee
        </div>
        <div className="font-['Montserrat'] text-base sm:text-xl font-semibold text-[#1A1A1A]">
          $250
        </div>
        <div className="inline-flex flex-wrap items-center gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <div className="font-['Montserrat'] text-sm sm:text-base text-[#1A1A1A]">
            <span className="font-medium">Size: </span>
            <span className="font-bold">XXL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-['Montserrat'] text-sm sm:text-base font-medium text-[#1A1A1A]">
              Color:
            </div>
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#FECACA]" />
          </div>
        </div>
        <div className="font-['Montserrat'] text-xs sm:text-sm font-semibold text-[#6B7280]">
          Requested on Sep 30, 2025
        </div>
      </div>
      <button className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-full bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] flex items-center justify-center">
        <Trash2
          className="h-4 w-4 sm:h-6 sm:w-6 text-[#B91C1C]"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}

function NotifyMePanel() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="font-['Montserrat'] text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          NOTIFY ME LIST
        </div>
        <div className="font-['Montserrat'] text-base sm:text-xl font-medium text-[#1A1A1A]">
          You'll be notified as soon as these items come back in stock.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <ProductRequestCard />
        <ProductRequestCard />
      </div>
    </div>
  );
}

export default function NotifyMeListPage() {
  return <NotifyMePanel />;
}
