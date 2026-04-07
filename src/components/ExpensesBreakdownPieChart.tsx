import type { ComponentPropsWithoutRef } from "react";
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import { useDarkMode } from "../contexts/DarkModeContext";
import type { TransactionCategory } from "../store/accountSlice";
import { currencyFormatter } from "../utils/currencyFormatter";

const colorsLight = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#3b82f6"];

const colorsDark = ["#b91c1c", "#c2410c", "#a16207", "#4d7c0f", "#15803d", "#1d4ed8"];

type ExpensesBreakdownProps = ComponentPropsWithoutRef<"div"> & {
  chartData: {
    category: TransactionCategory;
    amount: number;
  }[];
};

export default function ExpensesBreakdownPieChart({ chartData }: ExpensesBreakdownProps) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? colorsDark : colorsLight;
  const tooltipBgColor = isDarkMode ? "#1a1a1a" : "#f6f6f6";
  const totalLabelColor = isDarkMode ? "#d7d7d7" : "#777";

  const data = chartData
    .filter((obj) => obj.amount > 0)
    .map((obj, i) => ({ ...obj, color: colors[i] }));

  const pageWidth = document.documentElement.getBoundingClientRect().width;
  const innerRadius = pageWidth < 1280 ? 50 : 75;
  const outerRadius = pageWidth < 1280 ? 75 : 105;
  const chartHeight = pageWidth < 1024 ? 200 : 300;
  const totalLabelSize = pageWidth < 1280 ? "12px" : "14px";

  const chartCX = pageWidth < 1024 ? "50%" : "50%";
  const legendLayout = pageWidth < 1024 ? "vertical" : "horizontal";
  const legendVerticalAlign = (pageWidth < 1024 ? "middle" : "bottom") as
    | VerticalAlignmentType
    | undefined;
  const legendWidth = pageWidth < 1024 ? "35%" : "100%";
  const legendAlignment = pageWidth < 1024 ? "right" : "center";

  return (
    <div className="col-span-full lg:col-start-5 xl:col-start-6 lg:-col-end-1 flex flex-col gap-2 w-full component-container">
      <h4 className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold lg:font-bold p-1">
        Expenses breakdown
      </h4>

      <ResponsiveContainer width="100%" height={chartHeight}>
        {chartData.length > 0 ? (
          <PieChart>
            <Pie
              data={data}
              nameKey={"category"}
              dataKey={"amount"}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              stroke="none"
              cx={chartCX}
              cy="50%"
              paddingAngle={3}>
              {data.map((entry) => (
                <Cell
                  fill={entry.color}
                  stroke={entry.color}
                  key={`${entry.category}${entry.amount}`}
                />
              ))}
              <Label
                value={`${currencyFormatter.format(data.reduce((accum, tr) => accum + tr.amount, 0))}`}
                position="center"
                style={{ fontSize: totalLabelSize, fontWeight: 800, fill: totalLabelColor }}
              />
            </Pie>

            <Tooltip
              formatter={(value) => currencyFormatter.format(value as number)}
              itemStyle={{ fontSize: 18, fontWeight: 600 }}
              contentStyle={{ backgroundColor: tooltipBgColor }}
            />

            <Legend
              layout={legendLayout}
              verticalAlign={legendVerticalAlign}
              align={legendAlignment}
              width={legendWidth}
              iconSize={8}
              iconType="circle"
              fontSize={6}
            />
          </PieChart>
        ) : (
          <h2 className="self-center content-center text-2xl font-black">
            No data to show for the selected timescale...
          </h2>
        )}
      </ResponsiveContainer>
    </div>
  );
}
