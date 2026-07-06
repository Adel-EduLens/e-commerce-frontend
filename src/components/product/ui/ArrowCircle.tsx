import { ChevronUp } from "lucide-react";

export function ArrowCircle({
  direction = "next",
}: {
  direction?: "next" | "prev";
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-full outline flex items-center justify-center p-2`}
    >
      <ChevronUp
        size={24}
        className={` ${direction === "next" ? "rotate-90 lg:rotate-0" : "-rotate-90 lg:rotate-180"}`}
      />
    </div>
  );
}
