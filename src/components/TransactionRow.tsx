import type { ComponentPropsWithoutRef } from "react";
import type { Transaction } from "../store/accountSlice";
import { format } from "date-fns";
import { currencyFormatter } from "../utils/currencyFormatter";
import Tag from "./ui/Tag";

type RecentTransactionProps = ComponentPropsWithoutRef<"li"> & {
  transaction: Transaction;
};

export default function TransactionRow({ transaction, ...props }: RecentTransactionProps) {
  const { date, transactionType, amount, description } = transaction;

  return (
    <li
      {...props}
      className="grid w-full grid-cols-[1.2fr_3fr_1fr_1.2fr] gap-3 items-center text-xs px-2 py-2">
      <span className="text-xs">{format(date, "MMM dd")}</span>
      <span className="text-xs">{description}</span>
      <Tag
        text={transactionType}
        bgColor={`${transactionType === "expense" ? "bg-[#d90028]" : "bg-[#00a34f]"}`}
      />
      <span className="text-xs font-bold">{currencyFormatter.format(amount)}</span>
    </li>
  );
}
