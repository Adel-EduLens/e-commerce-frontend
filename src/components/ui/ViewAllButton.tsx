import { IoIosArrowForward } from "react-icons/io";
export function ViewAllButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-start gap-2 rounded-2xl bg-primary p-4"
    >
      <div className="font-['Montserrat'] text-xl font-semibold text-foreground">
        View All
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
        <IoIosArrowForward
          className="size-5"
        />
      </div>
    </button>
  )
}