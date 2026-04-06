import type { ChangeEvent } from "react";
import Filter from "../components/Filter";
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
import Table from "../components/Table";
import TransactionRow from "../components/TransactionRow";

export default function Transactions() {
  const transactions = useAppSelector(selectTransactionsData);

  const transactionTypeFilterOptions = [
    { label: "All", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
  ];

  const transactionCategoryFilterOptions = [
    { label: "All", value: "all" },
    { label: "Utility", value: "utility" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Transit", value: "transit" },
    { label: "Essentials", value: "essentials" },
    { label: "Installment", value: "installment" },
    { label: "Investment", value: "investment" },
  ];

  const transactionsSortByOptions = [
    { label: "Date (newest first)", value: "date_asc" },
    { label: "Date (oldest first)", value: "date_desc" },
    { label: "Amount (highest first)", value: "amount_desc" },
    { label: "Amount (lowest first)", value: "amount_asc" },
  ];

  const dispatch = useAppDispatch();

  const appliedFilters = useAppSelector(selectTransactionFilters);
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
      <div className="w-full flex flex-col items-end gap-2">
        <Filter
          options={transactionTypeFilterOptions}
          filterField="type"
          stateSelector={selectTransactionTypeFilter}
          actionCreator={setTransactionTypeFilter}
        />
        <div className="flex items-center gap-2">
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

      <Table columns="grid-cols-[1.2fr_3fr_1fr_2fr]">
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
              key={`${arg.accountHolderName}${arg.accountNumber}${arg.transactionId}`}
            />
          )}
        />

        <Table.Footer>
          <div></div>
        </Table.Footer>
      </Table>
    </section>
  );
}
