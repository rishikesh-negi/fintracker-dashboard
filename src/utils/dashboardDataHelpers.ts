import { format, isSameDay } from "date-fns";
import { type Transaction, type TransactionCategory } from "../store/accountSlice";

export type ExpensesSummary = {
  expenses: number;
  percentChangeExpenses?: number;
};

export type IncomeSummary = {
  income: number;
  percentChangeIncome?: number;
};

export type SavingsRateSummary = {
  savingsRate: number;
  percentChangeSavingsRate?: number;
};

export type DashboardSummaries = {
  expensesSummary: ExpensesSummary;
  incomeSummary: IncomeSummary;
  savingsRateSummary: SavingsRateSummary;
};

export const getSummaries = (
  currIntervalTransactions: Transaction[],
  prevIntervalTransactions?: Transaction[],
): DashboardSummaries => {
  const expenses = currIntervalTransactions
    .filter((tr) => tr.transactionType === "expense")
    .reduce((accum, tr) => accum + tr.amount, 0);

  const income = currIntervalTransactions
    .filter((tr) => tr.transactionType === "income")
    .reduce((accum, tr) => accum + tr.amount, 0);

  const savings = income - expenses;
  const savingsRate = Number(((savings / income) * 100).toFixed(2));

  if (prevIntervalTransactions) {
    const prevIntervalExpenses = prevIntervalTransactions
      .filter((tr) => tr.transactionType === "expense")
      .reduce((accum, tr) => accum + tr.amount, 0);

    const prevIntervalIncome = prevIntervalTransactions
      .filter((tr) => tr.transactionType === "income")
      .reduce((accum, tr) => accum + tr.amount, 0);

    const percentChangeExpenses = Number(
      (((expenses - prevIntervalExpenses) / prevIntervalExpenses) * 100).toFixed(2),
    );

    const percentChangeIncome = Number(
      (((income - prevIntervalIncome) / prevIntervalIncome) * 100).toFixed(2),
    );

    const prevIntervalSavings = prevIntervalIncome - prevIntervalExpenses;
    const prevIntervalSavingsRate = Number(
      ((prevIntervalSavings / prevIntervalIncome) * 100).toFixed(2),
    );

    const percentChangeSavingsRate = Number(
      (((savingsRate - prevIntervalSavingsRate) / prevIntervalSavingsRate) * 100).toFixed(2),
    );

    return {
      expensesSummary: {
        expenses,
        percentChangeExpenses,
      },
      incomeSummary: {
        income,
        percentChangeIncome,
      },
      savingsRateSummary: {
        savingsRate,
        percentChangeSavingsRate,
      },
    };
  }

  return {
    expensesSummary: {
      expenses,
    },
    incomeSummary: {
      income,
    },
    savingsRateSummary: {
      savingsRate,
    },
  };
};

export const getTransactionsAfter = (startDate: Date, transactions: Transaction[]) =>
  transactions.slice(
    transactions.findIndex((tr) => new Date(tr.date).getTime() >= startDate.getTime()),
  );

export const getTransactionsBetween = (
  startDate: Date,
  endDate: Date,
  transactions: Transaction[],
) =>
  transactions.slice(
    transactions.findIndex((tr) => new Date(tr.date).getTime() >= startDate.getTime()),
    transactions.findIndex((tr) => new Date(tr.date).getTime() >= endDate.getTime()),
  );

export const getExpensesByCategory = (
  transactions: Transaction[],
): { category: TransactionCategory; amount: number }[] => [
  {
    category: "utility",
    amount: transactions
      .filter((tr) => tr.category === "utility")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
  {
    category: "lifestyle",
    amount: transactions
      .filter((tr) => tr.category === "lifestyle")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
  {
    category: "transit",
    amount: transactions
      .filter((tr) => tr.category === "transit")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
  {
    category: "essentials",
    amount: transactions
      .filter((tr) => tr.category === "essentials")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
  {
    category: "installment",
    amount: transactions
      .filter((tr) => tr.category === "installment")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
  {
    category: "investment",
    amount: transactions
      .filter((tr) => tr.category === "investment")
      .reduce((accum, tr) => accum + tr.amount, 0),
  },
];

export const generateChartData = (
  allDates: Date[],
  transactions: Transaction[],
  transactionBeforeCurrentInterval?: Transaction,
) => {
  let balance = transactionBeforeCurrentInterval?.balanceAfterTransaction || 0;

  const getAndUpdateBalance = (dateTransactions: Transaction[]) => {
    if (dateTransactions?.length > 0) {
      balance = dateTransactions.at(-1)?.balanceAfterTransaction as number;
      return balance;
    } else return balance;
  };

  const data = allDates.map((date) => ({
    label: format(date, "MMM dd"),
    balance: getAndUpdateBalance(transactions.filter((tr) => isSameDay(date, new Date(tr.date)))),
    expenses:
      transactions
        .filter((tr) => isSameDay(date, new Date(tr.date)) && tr.transactionType === "expense")
        .reduce((accum, tr) => accum + tr.amount, 0) || 0,
    income:
      transactions
        .filter((tr) => isSameDay(date, new Date(tr.date)) && tr.transactionType === "income")
        .reduce((accum, tr) => accum + tr.amount, 0) || 0,
  }));

  return data;
};
