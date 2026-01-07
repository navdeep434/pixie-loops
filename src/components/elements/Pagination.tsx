import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  showPageNumbers = true,
  maxPageButtons = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSide = Math.floor(maxPageButtons / 2);
      const rightSide = maxPageButtons - leftSide - 1;
      
      let start = Math.max(1, page - leftSide);
      let end = Math.min(totalPages, page + rightSide);
      
      if (page - leftSide <= 0) {
        end = Math.min(totalPages, maxPageButtons);
      }
      
      if (page + rightSide >= totalPages) {
        start = Math.max(1, totalPages - maxPageButtons + 1);
      }
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border-2 border-gray-200 p-2 text-gray-700 transition hover:border-purple-300 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {showPageNumbers && (
        <div className="flex gap-2">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              );
            }
            
            const pageNum = p as number;
            return (
              <button
                key={pageNum}
                onClick={() => onChange(pageNum)}
                className={`min-w-[2.5rem] rounded-lg px-3 py-2 font-semibold transition ${
                  pageNum === page
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border-2 border-gray-200 p-2 text-gray-700 transition hover:border-purple-300 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}