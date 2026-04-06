import type { ComponentPropsWithoutRef, ReactElement } from "react";

type SummaryCardProps = ComponentPropsWithoutRef<"div"> & {
  title: string;
  icon: ReactElement;
  figure: string;
  change?: number;
};

export default function SummaryCard({ title, icon, figure, change, ...props }: SummaryCardProps) {
  const summaryCardClasses =
    "col-span-2 row-span-1 relative p-3 sm:p-4 bg-component-bg rounded-md shadow-md";

  const iconContainerClasses = `w-12 md:w-12 aspect-square md:h-12 rounded-full flex items-center justify-center bg-backdrop shadow-[inset_0.1rem_0.15rem_0.2rem_0.1rem_rgba(0,0,0,0.1)]`;

  return (
    <div {...props} className={summaryCardClasses}>
      <div className="w-full h-full flex items-center gap-2 sm:gap-3">
        <div className={iconContainerClasses}>{icon}</div>
        <div className="h-full flex flex-col gap-0.5 justify-center">
          <p className="text-[0.6rem] md:text-xs text-faint-text uppercase tracking-wider font-extrabold">
            {title}
          </p>
          <span className="text-sm sm:text-lg font-bold">{figure}</span>
          {typeof change === "number" ? (
            <span
              className={`font-semibold uppercase lg:font-bold text-[0.6rem] sm:text-xs tracking-wider ${change > 0 && "text-green-500"} ${change < 0 && "text-red-500"} ${change === 0 && "text-faint-text"}`}>
              {change === 0 && "No change"}
              {change > 0 && `+${change}%`}
              {change < 0 && `${change}%`}
            </span>
          ) : (
            <span className="font-semibold uppercase lg:font-bold text-[0.6rem] sm:text-xs tracking-wider text-faint-text">
              {title === "balance" ? "Net" : "No change"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
