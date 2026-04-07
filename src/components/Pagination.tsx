import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Pagination() {
  return (
    <div className="w-full flex items-center justify-between">
      <p className="ml-2 text-sm">
        Showing <span className="font-semibold">results</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button className="flex items-center justify-center gap-1 py-1.5 px-3 border-none rounded-sm font-semibold text-sm cursor-pointer disabled:cursor-not-allowed transition duration-200 [&:has(span:last-child)]:pl-1 [&:has(span:first-child)]:pr-1 [&_svg]:w-4 [&_svg]:h-4 hover:not-disabled:bg-accent-700 hover:not-disabled:text-light-100">
          <MdChevronLeft />
          <span>Prev</span>
        </button>
        <button className="flex items-center justify-center gap-1 py-1.5 px-3 border-none rounded-sm font-semibold text-sm cursor-pointer disabled:cursor-not-allowed transition duration-200 [&:has(span:last-child)]:pl-1 [&:has(span:first-child)]:pr-1 [&_svg]:w-4 [&_svg]:h-4 hover:not-disabled:bg-accent-700 hover:not-disabled:text-light-100">
          <span>Next</span>
          <MdChevronRight />
        </button>
      </div>
    </div>
  );
}
