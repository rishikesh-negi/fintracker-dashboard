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

interface PartyDetails {
  name: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

interface BaseTransaction {
  transactionId: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  date: string;
  description: string;
  category: TransactionCategory;
  balanceAfterTransaction: number;
  paymentMethod: "upi" | "cheque" | "bank_transfer";
  status: "completed";
}

interface Expense extends BaseTransaction {
  transactionType: "expense";
  beneficiaryDetails: PartyDetails;
  senderDetails?: never;
}

interface Income extends BaseTransaction {
  transactionType: "income";
  senderDetails: PartyDetails;
  beneficiaryDetails?: never;
}

export type Transaction = Income | Expense;

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
  accountBalance: number;
  userAvatar: string;
  transactions: Transaction[];
  dashboardFilter: TransactionsTimescales;
  transactionsFilters: TransactionsFiltersAndSort;
  role: AppRoles;
};

const initialState: AccountState = {
  accountHolder: transactionsData[0].accountHolderName,

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
} = accountSlice.actions;

export default accountSlice.reducer;
