import type { ComponentPropsWithoutRef } from "react";
import type { Transaction } from "../store/accountSlice";
import { format } from "date-fns";
import { currencyFormatter } from "../utils/currencyFormatter";
import Tag from "./ui/Tag";

type RecentTransactionProps = ComponentPropsWithoutRef<"li"> & {
  transaction: Transaction;
  columns: string;
};

export default function TransactionRow({ transaction, columns, ...props }: RecentTransactionProps) {
  const { date, transactionType, amount, description } = transaction;

  return (
    <li
      {...props}
      className={`grid w-full ${columns} gap-3 items-center text-xs xl:text-sm px-2 py-2`}>
      <span>{format(date, "dd MMM yy")}</span>
      <span>{description}</span>
      <Tag
        text={transactionType}
        bgColor={`${transactionType === "expense" ? "bg-[#d90028]" : "bg-[#00a34f]"}`}
      />
      <span className="font-bold">{currencyFormatter.format(amount)}</span>
    </li>
  );
}
