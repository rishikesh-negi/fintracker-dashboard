import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PaginationButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
};

export default function PaginationButton({ children, ...props }: PaginationButtonProps) {
  return (
    <button
      className="flex items-center justify-center gap-1 py-1.5 px-3 border-none rounded-sm font-semibold text-sm cursor-pointer disabled:cursor-not-allowed transition duration-200 [&:has(span:last-child)]:pl-1 [&:has(span:first-child)]:pr-1 [&_svg]:w-4 [&_svg]:h-4 hover:not-disabled:bg-accent-700 hover:not-disabled:text-light-100"
      {...props}>
      {children}
    </button>
  );
}
