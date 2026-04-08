import { MdAccountBalanceWallet, MdCurrencyRupee, MdPayments, MdSavings } from "react-icons/md";
import DashboardFilter from "../components/DashboardFilter";
import ExpensesBreakdownPieChart from "../components/ExpensesBreakdownPieChart";
import FinancesChart from "../components/FinancesChart";
import RecentTransactions from "../components/RecentTransactions";
import SummaryCard from "../components/SummaryCard";
import { selectBalance, selectDashboardData } from "../store/accountSlice";
import { useAppSelector } from "../store/storeHooks";
import { currencyFormatter } from "../utils/currencyFormatter";

export default function Dashboard() {
  const { summaries, expensesByCategory, chartData, recentTransactions } =
    useAppSelector(selectDashboardData);
  const balance = useAppSelector(selectBalance);
  const accountHolderName = useAppSelector((state) => state.account.accountHolder.split(" ")[0]);

  const iconClasses = "text-3xl text-faint-text";

  return (
    <>
      <section className="w-full h-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <p className="hidden md:inline w-fit text-md text-nowrap font-bold">
            Welcome, {accountHolderName}
          </p>
          <DashboardFilter />
        </div>
        <div className="w-full grid grid-cols-4 lg:grid-cols-8 grid-rows-[repeat(8,auto)] gap-x-2 lg:gap-x-3 gap-y-2 lg:gap-y-3">
          <SummaryCard
            title="balance"
            icon={<MdAccountBalanceWallet className={iconClasses} />}
            figure={currencyFormatter.format(balance)}
          />
          <SummaryCard
            title="expenses"
            icon={<MdPayments className={`${iconClasses}`} />}
            figure={currencyFormatter.format(summaries.expensesSummary.expenses)}
            change={summaries.expensesSummary.percentChangeExpenses}
          />
          <SummaryCard
            title="income"
            icon={<MdCurrencyRupee className={iconClasses} />}
            figure={currencyFormatter.format(summaries.incomeSummary.income)}
            change={summaries.incomeSummary.percentChangeIncome}
          />
          <SummaryCard
            title="savings rate"
            icon={<MdSavings className={iconClasses} />}
            figure={`${summaries.savingsRateSummary.savingsRate}%`}
            change={summaries.savingsRateSummary.percentChangeSavingsRate}
          />

          <FinancesChart chartData={chartData!} />

          <ExpensesBreakdownPieChart chartData={expensesByCategory} />

          <RecentTransactions recentTransactions={recentTransactions} />
        </div>
      </section>
    </>
  );
}
