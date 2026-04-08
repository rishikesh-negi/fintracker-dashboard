import type { ComponentPropsWithoutRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../contexts/DarkModeContext";
import { currencyFormatter, currencyFormatterCompact } from "../utils/currencyFormatter";

type FinanceChartProps = ComponentPropsWithoutRef<"div"> & {
  chartData: {
    label: string;
    balance: number;
    expenses: number;
    income: number;
  }[];
};

export default function FinancesChart({ chartData }: FinanceChartProps) {
  const { isDarkMode } = useDarkMode();
  const colors = {
    balance: {
      stroke: "rgb(80, 177, 0)",
      fill: isDarkMode ? "rgba(80, 177, 0, 0.4)" : "rgba(80, 177, 0, 0.8)",
    },
    income: {
      stroke: "rgb(0, 211, 165)",
      fill: isDarkMode ? "rgba(0, 211, 165, 0.4)" : "rgba(0, 211, 165, 0.8)",
    },
    expenses: {
      stroke: "#e4572e",
      fill: isDarkMode ? "rgba(240, 171, 151, 0.4)" : "rgba(228, 87, 46, 0.6)",
    },
    gridStroke: isDarkMode ? "#333" : "#ddd",
    text: isDarkMode ? "#acacac" : "#646464",
    background: isDarkMode ? "#1a1a1a" : "#f6f6f6",
  };

  const formatYAxis = (value: number) => currencyFormatterCompact.format(value);

  const chartHeight = window.innerWidth > 768 ? 300 : 200;
  const axesFontSize = window.innerWidth > 768 ? 12 : 10;
  const chartLeftMargin = window.innerWidth > 768 ? 12 : 0;

  return (
    <div className="col-span-full flex flex-col gap-2 w-full component-container">
      <h4 className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold lg:font-bold p-1">
        {chartData.length
          ? `Your finances (${chartData[0].label} — ${chartData.at(-1)?.label})`
          : "Your finances..."}
      </h4>

      {chartData.length ? (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={chartData} margin={{ left: chartLeftMargin }}>
            <XAxis
              dataKey={"label"}
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
              fontSize={axesFontSize}
              stroke={colors.gridStroke}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: colors.text }}
              tickLine={{ stroke: colors.text }}
              fontSize={axesFontSize}
              stroke={colors.gridStroke}
              width={33}
            />
            <CartesianGrid strokeDasharray="4" stroke={colors.gridStroke} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                fontSize: 12,
                borderRadius: 8,
                padding: 8,
                gap: 1,
              }}
              formatter={(value) => currencyFormatter.format(value as number)}
            />
            <Area
              dataKey="balance"
              type="monotone"
              stroke={colors.balance.stroke}
              strokeWidth={2}
              fill={colors.balance.fill}
              name="Balance"
            />
            <Area
              dataKey="expenses"
              type="monotone"
              stroke={colors.expenses.stroke}
              strokeWidth={2}
              fill={colors.expenses.fill}
              name="Expenses"
            />
            <Area
              dataKey="income"
              type="monotone"
              stroke={colors.income.stroke}
              strokeWidth={2}
              fill={colors.income.fill}
              name="Income"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <h2 className="self-center content-center text-2xl font-black">
          No data to show for the selected timescale...
        </h2>
      )}
    </div>
  );
}
