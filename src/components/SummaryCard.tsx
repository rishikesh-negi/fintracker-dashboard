import type { ReactElement } from "react";

type SummaryCardProps = {
  summary: {
    icon: ReactElement;
    title: string;
    figure: string;
    percentage: string;
    accentColor: string;
  };
};

export default function SummaryCard(/* { summary }: SummaryCardProps*/) {
  return <div className="col-span-2 row-span-1 bg-dark-300 rounded-xl">SummaryCard</div>;
}
