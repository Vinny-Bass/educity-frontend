interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      <button
        onClick={onPrevious}
        disabled={currentPage === 0}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Previous page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Next page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

