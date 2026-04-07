import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import PaginationButton from "./ui/PaginationButton";
import { useSearchParams } from "react-router-dom";
import type { ComponentPropsWithoutRef } from "react";
import { DATA_ROWS_PER_PAGE } from "../utils/appConstants";

type PaginationProps = ComponentPropsWithoutRef<"div"> & {
  count: number;
  paramExceedsLastPage: boolean;
};

export default function Pagination({ count, paramExceedsLastPage, ...props }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageCount = Math.ceil(count / DATA_ROWS_PER_PAGE);

  if (paramExceedsLastPage) {
    searchParams.set("page", pageCount.toString());
    setSearchParams(searchParams);
  }

  const currentPage = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  if (currentPage < 1) {
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  const nextPage = () => {
    if (currentPage === pageCount) return;
    const next = currentPage + 1;
    searchParams.set("page", next.toString());
    setSearchParams(searchParams);
  };

  const prevPage = () => {
    if (currentPage === 1) return;
    const prev = currentPage - 1;
    searchParams.set("page", prev.toString());
    setSearchParams(searchParams);
  };

  if (pageCount <= 1) return null;

  return (
    <div className="w-full flex items-center justify-between" {...props}>
      <p className="ml-2 text-sm">
        <span className="font-bold">{(currentPage - 1) * DATA_ROWS_PER_PAGE + 1}</span> to{" "}
        <span className="font-bold">
          {currentPage === pageCount ? count : currentPage * DATA_ROWS_PER_PAGE}
        </span>{" "}
        of <span className="font-bold">{count}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <MdChevronLeft />
          <span>Prev</span>
        </PaginationButton>
        <PaginationButton onClick={nextPage} disabled={currentPage === pageCount}>
          <span>Next</span>
          <MdChevronRight />
        </PaginationButton>
      </div>
    </div>
  );
}
