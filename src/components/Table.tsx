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
      <div role="table" className="text-xs bg-component-bg rounded-md overflow-hidden">
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { columns } = use(TableContext)!;

  return (
    <div
      className={`grid ${columns} gap-x-6 items-center px-4 py-6 border-b border-backdrop uppercase font-bold`}
      role="row">
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  const { columns } = use(TableContext)!;

  return (
    <div
      className={`grid ${columns} gap-x-6 items-center px-3 py-6 not-last:border-b border-faint-text`}
      role="row">
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-lg font-semibold text-center m-6">{text}</p>;
}

function Body({
  data,
  render,
}: {
  data: Transaction[];
  render: (arg: Transaction) => JSX.Element;
}) {
  return (
    <section className="mx-1 overflow-y-scroll max-h-120 lg:max-h-150">
      {data.length ? (
        (data.map(render) as ReactNode)
      ) : (
        <Empty text="No data matches the selected filters" />
      )}
    </section>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <footer className="flex content-center p-3 [&:not(:has(*))]:hidden">{children}</footer>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
