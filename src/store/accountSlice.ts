import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import transactionsData from "../data/transactions.json" with { type: "json" };

type TransactionCategory =
  | "salary"
  | "rent"
  | "food"
  | "transit"
  | "groceries"
  | "shopping"
  | "dividend"
  | "installment"
  | "subscription"
  | "bill"
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

interface DebitTransaction extends BaseTransaction {
  transactionType: "debit";
  beneficiaryDetails: PartyDetails;
  senderDetails?: never;
}

interface CreditTransaction extends BaseTransaction {
  transactionType: "credit";
  senderDetails: PartyDetails;
  beneficiaryDetails?: never;
}

export type Transaction = CreditTransaction | DebitTransaction;

type AppRoles = "viewer" | "admin";

export type AccountState = {
  accountHolder: string;
  accountBalance: number;
  transactions: Transaction[];
  role: AppRoles;
};

const initialState: AccountState = {
  accountHolder: transactionsData[0].accountHolderName,

  // Non-null assertion because mock data is being used for transactions state:
  accountBalance: transactionsData.at(-1)!.balanceAfterTransaction,
  transactions: transactionsData as Transaction[],
  role: "viewer",
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    switchRole(state, action: PayloadAction<{ role: AppRoles }>) {
      if (state.role === action.payload.role) return;
      state.role = action.payload.role;
    },
  },
});
