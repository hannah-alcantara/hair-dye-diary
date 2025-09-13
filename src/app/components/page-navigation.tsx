import React from "react";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div className='absolute bottom-4 right-4 flex items-center gap-2 z-50'>
      {/* Previous Page Button */}
      <button
        onClick={onPrevPage}
        disabled={!canGoPrev}
        className={`
          w-6 h-6 rounded-full transition-colors duration-200 flex items-center justify-center
          ${
            canGoPrev
              ? "bg-gray-50 text-indigo-800 hover:bg-indigo-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
          }
        `}
        title='Previous page'
      >
        <span className='text-sm font-bold'>‹</span>
      </button>

      {/* Page Indicator */}
      <div className='bg-indigo-50 px-2 py-1 rounded-full shadow-md'>
        <span className='text-xs font-medium text-indigo-800'>
          {currentPage + 1} / {totalPages}
        </span>
      </div>

      {/* Next Page Button */}
      <button
        onClick={onNextPage}
        disabled={!canGoNext}
        className={`
          w-6 h-6 rounded-full transition-colors duration-200 flex items-center justify-center
          ${
            canGoNext
              ? "bg-indigo-50 text-indigo-800 hover:bg-indigo-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
          }
        `}
        title='Next page'
      >
        <span className='text-sm font-bold'>›</span>
      </button>
    </div>
  );
};

export default PageNavigation;
