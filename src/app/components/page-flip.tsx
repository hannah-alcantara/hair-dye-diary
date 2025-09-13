import React from "react";
import PageNavigation from "./page-navigation";

interface PageFlipProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  children: React.ReactNode;
}

const PageFlip = ({ currentPage, totalPages, onPrevPage, onNextPage, children }: PageFlipProps) => {
  return (
    <div className="relative">
      {children}
      
      {/* Page Navigation Controls */}
      {totalPages > 1 && (
        <PageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
        />
      )}
    </div>
  );
};

export default PageFlip;
