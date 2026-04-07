import type { ComponentPropsWithoutRef, ReactElement } from "react";

type SummaryCardProps = ComponentPropsWithoutRef<"div"> & {
  title: string;
  icon: ReactElement;
  figure: string;
  change?: number;
};

export default function SummaryCard({ title, icon, figure, change, ...props }: SummaryCardProps) {
  return (
    <div {...props} className="summary-card">
      <div className="w-full h-full flex items-center gap-2 sm:gap-3">
        <div className="summary-icon-container">{icon}</div>
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
