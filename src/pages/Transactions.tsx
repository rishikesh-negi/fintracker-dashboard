import type { ChangeEvent } from "react";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import TransactionRow from "../components/TransactionRow";
import Select from "../components/ui/Select";
import {
  selectTransactionFilters,
  selectTransactionsData,
  selectTransactionTypeFilter,
  setTransactionsCategoryFilter,
  setTransactionsSortBy,
  setTransactionsSortOrder,
  setTransactionTypeFilter,
  type Transaction,
  type TransactionCategory,
} from "../store/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";

export default function Transactions() {
  const transactions = useAppSelector(selectTransactionsData);
  const appliedFilters = useAppSelector(selectTransactionFilters);

  const transactionTypeFilterOptions = [
    { label: "All", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  const transactionCategoryFilterOptions = [
    { label: "All", value: "all" },
    ...(appliedFilters.transactionType === "income" || appliedFilters.transactionType === "all"
      ? [
          { label: "Salary", value: "salary" },
          { label: "Dividend", value: "dividend" },
        ]
      : []),
    ...(appliedFilters.transactionType === "expense" || appliedFilters.transactionType === "all"
      ? [
          { label: "Utility", value: "utility" },
          { label: "Lifestyle", value: "lifestyle" },
          { label: "Transit", value: "transit" },
          { label: "Essentials", value: "essentials" },
          { label: "Installment", value: "installment" },
          { label: "Investment", value: "investment" },
        ]
      : []),
  ];

  const transactionsSortByOptions = [
    { label: "Date (newest first)", value: "date_asc" },
    { label: "Date (oldest first)", value: "date_desc" },
    { label: "Amount (highest first)", value: "amount_desc" },
    { label: "Amount (lowest first)", value: "amount_asc" },
  ];

  const dispatch = useAppDispatch();

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) =>
    dispatch(
      setTransactionsCategoryFilter({ category: e.target.value as TransactionCategory | "all" }),
    );

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTransactionsSortBy({ sortBy: e.target.value.split("_")[0] as "date" | "amount" }));
    dispatch(
      setTransactionsSortOrder({ sortOrder: e.target.value.split("_")[1] as "asc" | "desc" }),
    );
  };

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col sm:flex-row-reverse items-end sm:items-center gap-2">
        <Filter
          options={transactionTypeFilterOptions}
          filterField="type"
          stateSelector={selectTransactionTypeFilter}
          actionCreator={setTransactionTypeFilter}
        />
        <div className="flex items-center gap-2 sm:mr-auto">
          <Select
            options={transactionCategoryFilterOptions}
            value={appliedFilters.category}
            onChange={handleCategoryChange}
          />
          <Select
            options={transactionsSortByOptions}
            value={`${appliedFilters.sortBy}_${appliedFilters.sortOrder}`}
            onChange={handleSortChange}
          />
        </div>
      </div>

      <Table columns="grid-cols-[1.2fr_2.5fr_1fr_1.5fr] sm:grid-cols-[repeat(4,1fr)]">
        <Table.Header>
          <div>Date</div>
          <div>Description</div>
          <div>Type</div>
          <div>Amount</div>
        </Table.Header>

        <Table.Body
          data={transactions}
          render={(arg: Transaction) => (
            <TransactionRow
              transaction={arg}
              columns="grid-cols-[1.2fr_2.5fr_1fr_1.5fr] sm:grid-cols-[repeat(4,1fr)]"
              key={`${arg.accountHolderName}${arg.accountNumber}${arg.transactionId}`}
            />
          )}
        />

        <Table.Footer>
          <Pagination />
        </Table.Footer>
      </Table>
    </section>
  );
}
