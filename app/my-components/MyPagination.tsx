import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import React from "react";

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
}

interface Props {
  itemCount: number;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  show?: boolean;
}

const MyPagination = ({ itemCount, pagination, setPagination, show = true }: Props) => {
  if (itemCount == 0 || !show) return null;

  const nextPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
  };

  const previousPage = () => {
    setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
  };

  if (Math.ceil(itemCount / pagination.itemsPerPage) < pagination.currentPage) {
    previousPage();
  }

  return (
    <div className="h-20 min-h-20 rounded-lg flex itmes-center px-5">
      <Pagination>
        <PaginationContent className="w-full justify-center gap-4">
          <div className="w-28 flex justify-end cursor-pointer ">
            {pagination.currentPage > 1 && (
              <PaginationItem onClick={previousPage}>
                <PaginationPrevious />
              </PaginationItem>
            )}
          </div>

          <PaginationItem>
            <div className="px-5 border py-2 rounded-lg shadow-md bg-white dark:bg-[#111]">
              <p className="text-sm dark:text-stone-300">
                Page {pagination.currentPage} of {Math.ceil(itemCount / pagination.itemsPerPage)}
              </p>
            </div>
          </PaginationItem>

          <div className="w-28 flex justify-start cursor-pointer ">
            {itemCount > pagination.currentPage * pagination.itemsPerPage && (
              <PaginationItem onClick={nextPage}>
                <PaginationNext />
              </PaginationItem>
            )}
          </div>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MyPagination;
