import type { ComponentPropsWithoutRef } from "react";
import type { Transaction } from "../store/accountSlice";
import { Link } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import TransactionRow from "./TransactionRow";

type RecentTransactionsProps = ComponentPropsWithoutRef<"div"> & {
  recentTransactions: Transaction[];
};

export default function RecentTransactions({ recentTransactions }: RecentTransactionsProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="col-span-full lg:col-start-1 lg:col-end-5 xl:col-end-6 lg:row-start-3 row-span-1 flex flex-col gap-2 component-container">
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold lg:font-bold p-1">
          Recent transactions
        </h4>
        <Link
          to="/transactions"
          className={`text-xs ${isDarkMode ? "text-accent-500" : "text-accent-700"}`}>
          See all &rarr;
        </Link>
      </div>

      <ul className="w-full divide-y divide-faint-text/10 overflow-y-auto overflow-x-hidden">
        {recentTransactions.map((tr) => (
          <TransactionRow
            transaction={tr}
            columns="grid-cols-[1.4fr_2.5fr_1fr_1.3fr] sm:grid-cols-[repeat(4,1fr)]"
            key={`${tr.accountHolder}${tr.transactionId}`}
          />
        ))}
      </ul>
    </div>
  );
}
