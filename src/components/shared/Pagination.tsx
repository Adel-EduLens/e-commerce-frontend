import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function getPageList(currentPage: number, totalPages: number) {
  const pages: number[] = [];

  const addPage = (page: number) => {
    if (!pages.includes(page)) pages.push(page);
  };

  addPage(1);

  for (let page = currentPage - 1; page <= currentPage + 1; page++) {
    if (page > 1 && page < totalPages) addPage(page);
  }

  if (totalPages > 1) addPage(totalPages);

  pages.sort((a, b) => a - b);

  const withDots: (number | "dots")[] = [];
  let previous = 0;

  for (const page of pages) {
    if (previous && page - previous > 1) {
      withDots.push("dots");
    }
    withDots.push(page);
    previous = page;
  }

  return withDots;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageList = getPageList(currentPage, totalPages);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`flex w-full items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-light text-foreground transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-light"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        {pageList.map((page, index) =>
          page === "dots" ? (
            <span
              key={`dots-${index}`}
              className="flex h-11 w-11 items-center justify-center font-['Montserrat'] text-lg text-gray-text"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goTo(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl font-['Montserrat'] text-lg font-medium transition-colors ${
                page === currentPage
                  ? "bg-primary text-foreground"
                  : "bg-gray-light text-foreground hover:bg-primary/60"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-light text-foreground transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-light"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
}