import { format } from "date-fns";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Transaction } from "../store/accountSlice";
import { useAppSelector } from "../store/storeHooks";
import { currencyFormatter, currencyFormatterCompact } from "../utils/currencyFormatter";
import Tag from "./ui/Tag";

type RecentTransactionProps = ComponentPropsWithoutRef<"li"> & {
  transaction: Transaction;
  columns: string;
  menu?: ReactNode;
};

export default function TransactionRow({
  transaction,
  columns,
  menu,
  ...props
}: RecentTransactionProps) {
  const { date, transactionType, amount, description } = transaction;
  const role = useAppSelector((state) => state.account.role);

  return (
    <li
      {...props}
      className={`grid w-full ${columns} gap-2 sm:gap-3 items-center text-xs xl:text-sm px-2 py-2`}>
      <span className="text-[10px] sm:text-xs font-bold">{format(date, "dd MMM yy")}</span>
      <span>{description}</span>
      <Tag
        text={transactionType}
        bgColor={`${transactionType === "expense" ? "bg-[#d90028]" : "bg-[#00a34f]"}`}
      />
      <span className="font-bold flex items-center justify-between">
        {amount > 9999 ? currencyFormatterCompact.format(amount) : currencyFormatter.format(amount)}
        {menu && role === "admin" ? menu : ""}
      </span>
    </li>
  );
}
