import { createContext, use, type JSX, type ReactNode } from "react";
import type { Transaction } from "../store/accountSlice";

const TableContext = createContext<{ columns: string } | null>(null);

type TableProps = {
  columns: string;
  children: ReactNode;
};

function Table({ columns, children }: TableProps) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div
        role="table"
        className="relative min-h-fit flex-1 flex flex-col text-xs bg-component-bg rounded-md overflow-hidden">
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { columns } = use(TableContext)!;

  return (
    <div
      className={`grid ${columns} gap-x-4 md:gap-x-2 items-center px-3 md:px-4 py-4 md:py-6 border-b border-backdrop uppercase font-bold`}
      role="row">
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  const { columns } = use(TableContext)!;

  return (
    <div
      className={`grid ${columns} gap-x-4 md:gap-x-2 items-center px-3 py-6 not-last:border-b border-faint-text`}
      role="row">
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="w-full h-full grid items-center justify-center text-lg font-semibold text-center">
      {text}
    </p>
  );
}

function Body({
  data,
  render,
}: {
  data: Transaction[];
  render: (arg: Transaction) => JSX.Element;
}) {
  return (
    <section className="mx-1 h-full flex-1 flex flex-col *:flex-1 overflow-hidden divide-y divide-faint-text/10">
      {data.length ? (
        (data.map(render) as ReactNode)
      ) : (
        <Empty text="No data matches the selected filters" />
      )}
    </section>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="flex content-center p-2 md:p-3 border-t border-backdrop [&:not(:has(*))]:hidden">
      {children}
    </footer>
  );
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
