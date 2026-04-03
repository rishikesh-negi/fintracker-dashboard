import transactionsData from "../data/transactions.json" with { type: "json" };

// Setting the date of the last mock transaction as the current date (used instead of 'new Date()'):
export const TODAY = new Date(transactionsData.at(-1)!.date as string);
