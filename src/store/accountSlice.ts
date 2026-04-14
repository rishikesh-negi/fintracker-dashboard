import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  differenceInMilliseconds,
  eachDayOfInterval,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { createSelector } from "reselect";
import transactionsData from "../data/transactions.json" with { type: "json" };
import { TODAY } from "../utils/appConstants";
import {
  generateChartData,
  getExpensesByCategory,
  getSummaries,
  getTransactionsAfter,
  getTransactionsBetween,
  type DashboardSummaries,
} from "../utils/dashboardDataHelpers";
import type { RootState } from "./store";

export type TransactionCategory =
  | "salary"
  | "utility"
  | "lifestyle"
  | "transit"
  | "essentials"
  | "dividend"
  | "installment"
  | "investment";

type PaymentMethod = "upi" | "bank_transfer" | "cheque";

export interface Transaction {
  transactionId: string;
  accountNumber: string;
  accountHolder: string;
  transactionType: "income" | "expense";
  amount: number;
  date: string;
  description: string;
  category: TransactionCategory;
  balanceAfterTransaction: number;
  paymentMethod: PaymentMethod;
  status: "completed";
}

type AppRoles = "viewer" | "admin";
type TransactionsTimescales =
  | "current-month"
  | "three-months"
  | "current-year"
  | "one-year"
  | "all-time";
type TransactionsFiltersAndSort = {
  category: TransactionCategory | "all";
  transactionType: "income" | "expense" | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
};

export type AccountState = {
  accountHolder: string;
  accountNumber: string;
  accountBalance: number;
  userAvatar: string;
  transactions: Transaction[];
  dashboardFilter: TransactionsTimescales;
  transactionsFilters: TransactionsFiltersAndSort;
  role: AppRoles;
};

const initialState: AccountState = {
  accountHolder: transactionsData[0].accountHolder,
  accountNumber: transactionsData.at(-1)!.accountNumber,

  // Non-null assertion because mock data is being used for transactions state:
  accountBalance: transactionsData.at(-1)!.balanceAfterTransaction,

  userAvatar: "/userAvatar.jps",
  transactions: transactionsData as Transaction[],
  dashboardFilter: "current-month",
  transactionsFilters: {
    category: "all",
    transactionType: "all",
    sortBy: "date",
    sortOrder: "asc",
  },
  role: "viewer",
};

const accountSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setDashboardFilter(state, action: PayloadAction<{ filter: TransactionsTimescales }>) {
      state.dashboardFilter = action.payload.filter;
    },
    setTransactionsCategoryFilter(
      state,
      action: PayloadAction<{ category: TransactionCategory | "all" }>,
    ) {
      if (state.transactionsFilters.category !== action.payload.category)
        state.transactionsFilters.category = action.payload.category;
    },
    setTransactionTypeFilter(state, action: PayloadAction<{ type: "expense" | "income" | "all" }>) {
      if (state.transactionsFilters.transactionType !== action.payload.type)
        state.transactionsFilters.transactionType = action.payload.type;
    },
    setTransactionsSortBy(state, action: PayloadAction<{ sortBy: "date" | "amount" }>) {
      if (state.transactionsFilters.sortBy !== action.payload.sortBy)
        state.transactionsFilters.sortBy = action.payload.sortBy;
    },
    setTransactionsSortOrder(state, action: PayloadAction<{ sortOrder: "asc" | "desc" }>) {
      if (state.transactionsFilters.sortOrder !== action.payload.sortOrder)
        state.transactionsFilters.sortOrder = action.payload.sortOrder;
    },
    toggleRole(state, action: PayloadAction<{ role: AppRoles }>) {
      if (state.role === action.payload.role) return;
      state.role = action.payload.role;
    },
    updateBalance(state, action: PayloadAction<{ amount: number; type: "expense" | "income" }>) {
      if (action.payload.type === "income") state.accountBalance += action.payload.amount;
      else if (action.payload.type === "expense") state.accountBalance -= action.payload.amount;
      else throw new Error("Invalid transaction type received");
    },
    editTransaction(
      state,
      action: PayloadAction<{
        id: string;
        amount: string;
        description: string;
        transactionType: "income" | "expense";
        category: TransactionCategory;
      }>,
    ) {
      const { id, amount, description, transactionType, category } = action.payload;
      const transactionIndex = state.transactions.findIndex((tr) => tr.transactionId === id);
      if (transactionIndex === -1) throw new Error("Transaction not found!");

      const transaction = state.transactions[transactionIndex];

      if (transaction.transactionType !== transactionType) {
        // If type changed from "expense" to "income":
        if (transactionType === "income") {
          state.accountBalance = state.accountBalance + transaction.amount + Number(amount);
          transaction.transactionType = transactionType;
        }

        // If type changed from "income" to "expense":
        if (transactionType === "expense") {
          state.accountBalance = state.accountBalance - transaction.amount - Number(amount);
          transaction.transactionType = transactionType;
        }
      }

      if (
        transaction.transactionType === transactionType &&
        transaction.amount !== Number(amount)
      ) {
        const difference = transaction.amount - Number(amount);
        transaction.amount = Number(amount);
        state.accountBalance = state.accountBalance + difference;
      }

      if (transaction.description !== description) {
        if (description.length > 16) throw new Error("Description cannot exceed 15 characters");
        transaction.description = description;
      }

      if (transaction.category !== category) transaction.category = category;
    },
    deleteTransaction(state, action: PayloadAction<{ id: string }>) {
      const transactionIndex = state.transactions.findIndex(
        (tr) => (tr.transactionId = action.payload.id),
      );
      if (transactionIndex === -1)
        throw new Error("Deletion failed. Transaction could not be found");

      state.transactions.splice(transactionIndex, 1);
    },
    addTransaction(
      state,
      action: PayloadAction<{
        transactionType: "income" | "expense";
        amount: number;
        description: string;
        category: TransactionCategory;
        paymentMethod: PaymentMethod;
      }>,
    ) {
      if (action.payload.amount <= 0) throw new Error("Invalid transaction amount entered");
      const transaction: Partial<Transaction> = { ...action.payload };
      const { transactionType, amount } = action.payload;

      transaction["transactionId"] = crypto.randomUUID();
      transaction["accountNumber"] = state.accountNumber;
      transaction["accountHolder"] = state.accountHolder;
      transaction["date"] = TODAY.toISOString();
      transaction["balanceAfterTransaction"] =
        transactionType === "income"
          ? state.accountBalance + amount
          : state.accountBalance - amount;
      transaction["status"] = "completed";

      state.transactions.push(transaction as Transaction);
    },
  },
});

export const selectBalance = (state: RootState) => state.account.accountBalance;
export const selectCurrentRole = (state: RootState) => state.account.role;
export const selectTransactions = (state: RootState) => state.account.transactions;
export const selectDashboardFilter = (state: RootState) => state.account.dashboardFilter;
export const selectTransactionFilters = (state: RootState) => state.account.transactionsFilters;
export const selectTransactionTypeFilter = (state: RootState) =>
  state.account.transactionsFilters.transactionType;

export const selectDashboardData = createSelector(
  [selectTransactions, selectDashboardFilter],
  (transactions, dashboardFilter) => {
    let currentIntervalTransactions = transactions;
    let previousIntervalTransactions: Transaction[], summaries: DashboardSummaries;
    const recentTransactions = transactions.slice(-10).toReversed();

    if (dashboardFilter === "all-time") {
      summaries = getSummaries(currentIntervalTransactions);
      const expensesByCategory = getExpensesByCategory(currentIntervalTransactions);

      const allDates = eachDayOfInterval({
        start: subDays(currentIntervalTransactions[0].date, 1),
        end: TODAY,
      });

      const chartData = generateChartData(allDates, currentIntervalTransactions);

      return {
        transactions: currentIntervalTransactions,
        summaries,
        chartData,
        expensesByCategory,
        recentTransactions,
      };
    } else if (dashboardFilter === "current-month") {
      const startDate = startOfMonth(TODAY);
      const prevIntervalStartDate = startOfMonth(subMonths(TODAY, 1));
      currentIntervalTransactions = getTransactionsAfter(startDate, transactions);
      previousIntervalTransactions = getTransactionsBetween(
        prevIntervalStartDate,
        startDate,
        transactions,
      );
    } else if (dashboardFilter === "three-months") {
      const startDate = subMonths(TODAY, 3);
      const prevIntervalStartDate = subMonths(startDate, 3);
      currentIntervalTransactions = getTransactionsAfter(startDate, transactions);
      previousIntervalTransactions = getTransactionsBetween(
        prevIntervalStartDate,
        startDate,
        transactions,
      );
    } else if (dashboardFilter === "current-year") {
      const startDate = startOfYear(TODAY);
      const prevIntervalStartDate = startOfYear(subYears(startDate, 1));
      currentIntervalTransactions = getTransactionsAfter(startDate, transactions);
      previousIntervalTransactions = getTransactionsBetween(
        prevIntervalStartDate,
        startDate,
        transactions,
      );
    } else if (dashboardFilter === "one-year") {
      const startDate = subMonths(TODAY, 12);
      const prevIntervalStartDate = subMonths(startDate, 12);
      currentIntervalTransactions = getTransactionsAfter(startDate, transactions);
      previousIntervalTransactions = getTransactionsBetween(
        prevIntervalStartDate,
        startDate,
        transactions,
      );
    } else throw new Error("Invalid filter value applied");

    summaries = getSummaries(currentIntervalTransactions, previousIntervalTransactions);
    const expensesByCategory = getExpensesByCategory(currentIntervalTransactions);

    const allDates = eachDayOfInterval({
      start: subDays(currentIntervalTransactions[0].date, 1),
      end: TODAY,
    });

    const chartData = generateChartData(
      allDates,
      currentIntervalTransactions,
      previousIntervalTransactions?.at(-1),
    );

    return {
      transactions: currentIntervalTransactions,
      summaries,
      chartData,
      expensesByCategory,
      recentTransactions,
    };
  },
);

export const selectTransactionsData = createSelector(
  [selectTransactions, selectTransactionFilters],
  (transactions, transactionsFilters) => {
    let filteredTransactions = transactions;

    if (transactionsFilters.category !== "all") {
      filteredTransactions = [...filteredTransactions].filter(
        (tr) => tr.category === transactionsFilters.category,
      );
    }

    if (transactionsFilters.transactionType !== "all")
      filteredTransactions = [...filteredTransactions].filter(
        (tr) => tr.transactionType === transactionsFilters.transactionType,
      );

    if (transactionsFilters.sortBy === "date") {
      if (transactionsFilters.sortOrder === "asc") {
        filteredTransactions = [...filteredTransactions].toSorted((tr1, tr2) =>
          differenceInMilliseconds(new Date(tr2.date), new Date(tr1.date)),
        );
      } else if (transactionsFilters.sortOrder === "desc") {
        filteredTransactions = [...filteredTransactions].toSorted((tr1, tr2) =>
          differenceInMilliseconds(new Date(tr1.date), new Date(tr2.date)),
        );
      }
    }

    if (transactionsFilters.sortBy === "amount") {
      if (transactionsFilters.sortOrder === "asc") {
        filteredTransactions = [...filteredTransactions].toSorted(
          (tr1, tr2) => tr1.amount - tr2.amount,
        );
      } else if (transactionsFilters.sortOrder === "desc") {
        filteredTransactions = [...filteredTransactions].toSorted(
          (tr1, tr2) => tr2.amount - tr1.amount,
        );
      }
    }

    return filteredTransactions;
  },
);

export const getTransactionsInsights = createSelector([selectTransactions], (transactions) => {
  const expenses = transactions.filter((tr) => tr.transactionType === "expense");
  const expensesByCategory = getExpensesByCategory(expenses);
  const totalExpenses = expensesByCategory.reduce((accum, exp) => accum + exp.amount, 0);
  const highestExpenseCategory = expensesByCategory.reduce(
    (max, exp) => (exp.amount > max.amount ? exp : max),
    expensesByCategory[0],
  );
  const lowestExpenseCategory = expensesByCategory.reduce(
    (min, exp) => (exp.amount < min.amount ? exp : min),
    expensesByCategory[0],
  );
  const biggestExpense = expenses.reduce(
    (max, tr) => (tr.amount > max.amount ? tr : max),
    expenses[0],
  );
  const totalInvestment = expenses
    .filter((tr) => tr.category === "investment")
    .reduce((accum, tr) => accum + tr.amount, 0);

  return {
    highestExpenseCategory,
    lowestExpenseCategory,
    biggestExpense,
    totalInvestment,
    totalExpenses,
  };
});

export const {
  setDashboardFilter,
  setTransactionsCategoryFilter,
  setTransactionTypeFilter,
  setTransactionsSortBy,
  setTransactionsSortOrder,
  toggleRole,
  updateBalance,
  editTransaction,
  deleteTransaction,
  addTransaction,
} = accountSlice.actions;

export default accountSlice.reducer;
