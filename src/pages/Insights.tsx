import { getTransactionsInsights } from "../store/accountSlice";
import { useAppSelector } from "../store/storeHooks";
import { currencyFormatter } from "../utils/currencyFormatter";

export default function Insights() {
  const {
    highestExpenseCategory,
    lowestExpenseCategory,
    biggestExpense,
    totalInvestment,
    totalExpenses,
  } = useAppSelector(getTransactionsInsights);

  const insightStyles = "w-full p-3 lg:p-4 text-sm lg:text-lg bg-component-bg rounded-md shadow-md";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Insights:</h2>
      <ul className="w-full flex flex-col gap-2">
        <li className={insightStyles}>
          Highest expense category:{" "}
          <span className="font-bold">
            {highestExpenseCategory.category[0].toUpperCase()}
            {highestExpenseCategory.category.slice(1)}
          </span>{" "}
          ({currencyFormatter.format(highestExpenseCategory.amount)})
        </li>
        <li className={insightStyles}>
          Lowest expense category:{" "}
          <span className="font-bold">
            {lowestExpenseCategory.category[0].toUpperCase()}
            {lowestExpenseCategory.category.slice(1)} (
            {currencyFormatter.format(lowestExpenseCategory.amount)})
          </span>
        </li>
        <li className={insightStyles}>
          Your biggest expense:{" "}
          <span className="font-bold">
            {currencyFormatter.format(biggestExpense.amount)} ({biggestExpense.description})
          </span>
        </li>
        <li className={insightStyles}>
          Your total investments:{" "}
          <span className="font-bold">{currencyFormatter.format(totalInvestment)}</span>
        </li>
        <li className={insightStyles}>
          Total expenses (all time):{" "}
          <span className="font-bold">{currencyFormatter.format(totalExpenses)}</span>
        </li>
      </ul>
    </section>
  );
}
